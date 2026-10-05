// Conexión con la API de Open-Meteo (documentación: https://open-meteo.com/en/docs)
// Los datos tienen licencia CC BY 4.0
import bloques from '../data/bloques.json'

const URL_API = 'https://api.open-meteo.com/v1/forecast'

// Las horas que nos sirven: el inicio de cada bloque ("08:00" hasta "20:00")
const HORAS_DE_BLOQUES = bloques.map((bloque) => bloque.slice(0, 5))

// Agrupamos los códigos de clima (WMO) en tipos simples, con su nombre en español
const GRUPOS_CLIMA = [
  { codigos: [0], tipo: 'despejado', descripcion: 'Despejado' },
  { codigos: [1, 2], tipo: 'parcial', descripcion: 'Parcialmente nublado' },
  { codigos: [3], tipo: 'nublado', descripcion: 'Nublado' },
  { codigos: [45, 48], tipo: 'niebla', descripcion: 'Niebla' },
  { codigos: [51, 53, 55, 56, 57], tipo: 'llovizna', descripcion: 'Llovizna' },
  { codigos: [61, 63, 65, 66, 67], tipo: 'lluvia', descripcion: 'Lluvia' },
  { codigos: [80, 81, 82], tipo: 'chubascos', descripcion: 'Chubascos' },
  { codigos: [95, 96, 99], tipo: 'tormenta', descripcion: 'Tormenta' },
  { codigos: [71, 73, 75, 77, 85, 86], tipo: 'nieve', descripcion: 'Nieve' },
]

export function interpretarCodigoClima(codigo) {
  const grupo = GRUPOS_CLIMA.find((g) => g.codigos.includes(codigo))
  return grupo
    ? { tipo: grupo.tipo, descripcion: grupo.descripcion }
    : { tipo: 'desconocido', descripcion: 'Sin datos' }
}

// Pasa la respuesta (arreglos paralelos) a un objeto por hora y un resumen del día
export function transformarPronostico(respuesta) {
  const horario = respuesta?.hourly
  if (!horario?.time) throw new Error('Respuesta inesperada de la API del clima')

  const porHora = {}
  horario.time.forEach((instante, i) => {
    const hora = instante.slice(11, 16) // "2026-10-02T08:00" -> "08:00"
    if (!HORAS_DE_BLOQUES.includes(hora)) return
    porHora[hora] = {
      temperatura: Math.round(horario.temperature_2m[i]),
      probLluvia: horario.precipitation_probability[i] ?? 0,
      ...interpretarCodigoClima(horario.weather_code[i]),
    }
  })

  const horas = Object.values(porHora)
  if (horas.length === 0) throw new Error('La API no entregó datos para el horario de la sede')

  // el tipo de clima que más se repite es el del resumen
  const conteo = {}
  horas.forEach((h) => {
    conteo[h.tipo] = (conteo[h.tipo] ?? 0) + 1
  })
  const tipoFrecuente = Object.keys(conteo).reduce((a, b) => (conteo[b] > conteo[a] ? b : a))
  const temperaturas = horas.map((h) => h.temperatura)

  return {
    porHora,
    resumen: {
      minima: Math.min(...temperaturas),
      maxima: Math.max(...temperaturas),
      probLluviaMax: Math.max(...horas.map((h) => h.probLluvia)),
      tipo: tipoFrecuente,
      descripcion: horas.find((h) => h.tipo === tipoFrecuente).descripcion,
    },
  }
}

// Pide el pronóstico por hora de una fecha ("AAAA-MM-DD")
export async function obtenerPronostico(sede, fecha, signal) {
  const parametros = new URLSearchParams({
    latitude: sede.latitud,
    longitude: sede.longitud,
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    timezone: sede.zonaHoraria,
    start_date: fecha,
    end_date: fecha,
  })

  let respuesta
  try {
    respuesta = await fetch(`${URL_API}?${parametros}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error // se canceló a propósito, no hay que mostrarlo
    // fetch falla así cuando no hay internet
    throw new Error('Sin conexión con el servicio del clima. Revisa tu internet.', { cause: error })
  }
  if (!respuesta.ok) {
    let motivo = ''
    try {
      motivo = (await respuesta.json()).reason ?? ''
    } catch {
      // el error no venía en JSON, mostramos solo el código
    }
    throw new Error(`La API del clima respondió ${respuesta.status}${motivo ? `: ${motivo}` : ''}`)
  }
  return transformarPronostico(await respuesta.json())
}
