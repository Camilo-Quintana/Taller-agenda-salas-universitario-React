// Reservas de estudiantes ficticios para que la app no parta vacía
import ejemplos from '../data/reservasEjemplo.json'
import { fechaHoy, fechaManana } from './fechas.js'

// En el JSON "dia" es 0 (hoy) o 1 (mañana); aquí lo cambiamos por la fecha real
export function crearReservasEjemplo(ahora) {
  const fechas = [fechaHoy(ahora), fechaManana(ahora)]
  return ejemplos.map(({ dia, ...datos }, indice) => ({
    id: `ejemplo-${indice + 1}`,
    ...datos,
    fecha: fechas[dia],
  }))
}
