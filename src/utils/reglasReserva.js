// Reglas de las reservas. No tocan la pantalla: reciben los datos y devuelven un resultado.
import bloques from '../data/bloques.json'
import { normalizarRut } from './validaciones.js'
import { fechaHoy, fechaManana, rangoDeBloque } from './fechas.js'

// Desde este % de lluvia avisamos en los espacios exteriores
export const UMBRAL_LLUVIA = 50

export function bloqueEstaTomado(reservas, espacioId, fecha, bloque) {
  return reservas.some((r) => r.espacioId === espacioId && r.fecha === fecha && r.bloque === bloque)
}

// Un bloque ya pasó si su hora de inicio ya llegó
export function bloqueYaPaso(fecha, bloque, ahora) {
  return rangoDeBloque(fecha, bloque).inicio <= ahora
}

// Devuelve 'pasado', 'ocupado' o 'libre'.
export function estadoBloque(reservas, espacioId, fecha, bloque, ahora) {
  if (bloqueYaPaso(fecha, bloque, ahora)) return 'pasado'
  if (bloqueEstaTomado(reservas, espacioId, fecha, bloque)) return 'ocupado'
  return 'libre'
}

export function contarBloquesLibres(reservas, espacioId, fecha, ahora) {
  return bloques.filter((bloque) => estadoBloque(reservas, espacioId, fecha, bloque, ahora) === 'libre').length
}

export function estudianteYaReservoEseDia(reservas, rut, fecha) {
  const rutBuscado = normalizarRut(rut)
  return reservas.some((r) => normalizarRut(r.rut) === rutBuscado && r.fecha === fecha)
}

// Devuelve 'proxima', 'en-curso' o 'finalizada'.
export function estadoReserva(reserva, ahora) {
  const { inicio, fin } = rangoDeBloque(reserva.fecha, reserva.bloque)
  if (ahora < inicio) return 'proxima'
  if (ahora < fin) return 'en-curso'
  return 'finalizada'
}

// Devuelve null si está todo bien, o el mensaje del primer problema
export function validarNuevaReserva({ reservas, espacioId, fecha, bloque, perfil, ahora }) {
  if (!perfil) return 'Completa tu perfil para poder reservar.'
  if (fecha !== fechaHoy(ahora) && fecha !== fechaManana(ahora)) return 'Solo puedes reservar para hoy o mañana.'
  if (!bloque) return 'Elige un horario.'
  if (bloqueYaPaso(fecha, bloque, ahora)) return 'Ese horario ya pasó. Elige uno más tarde.'
  if (bloqueEstaTomado(reservas, espacioId, fecha, bloque)) return 'Ese horario ya está ocupado. Elige otro.'
  if (estudianteYaReservoEseDia(reservas, perfil.rut, fecha)) {
    return 'Ya tienes una reserva ese día. Solo se permite una por día.'
  }
  return null
}

// Solo avisamos en espacios exteriores y si la probabilidad llega al umbral
export function debeAvisarLluvia(espacio, climaDelBloque) {
  return espacio.tipo === 'Exterior' && (climaDelBloque?.probLluvia ?? 0) >= UMBRAL_LLUVIA
}
