import { useEffect, useState } from 'react'
import { obtenerPronostico } from '../services/climaApi.js'
import sede from '../data/sede.json'

// Pide el clima de una fecha ("AAAA-MM-DD").
// Devuelve el estado ('cargando', 'listo' o 'error'), los datos, el error y la función reintentar.
export function useClima(fecha) {
  const [intento, setIntento] = useState(0)
  // la última respuesta que llegó: { fecha, intento, datos, error }
  const [respuesta, setRespuesta] = useState(null)

  // usamos useEffect porque la API es algo externo: se vuelve a pedir si cambia la fecha o si se reintenta
  useEffect(() => {
    const controlador = new AbortController()
    obtenerPronostico(sede, fecha, controlador.signal)
      .then((datos) => setRespuesta({ fecha, intento, datos, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return // se canceló porque cambió la fecha o se salió de la página
        setRespuesta({ fecha, intento, datos: null, error: error.message })
      })
    return () => controlador.abort()
  }, [fecha, intento])

  // si la respuesta guardada no es de esta fecha y este intento, todavía está cargando
  const llego = respuesta?.fecha === fecha && respuesta?.intento === intento
  let estado = 'cargando'
  if (llego) estado = respuesta.error ? 'error' : 'listo'

  return {
    estado,
    datos: estado === 'listo' ? respuesta.datos : null,
    error: estado === 'error' ? respuesta.error : null,
    reintentar: () => setIntento((n) => n + 1),
  }
}
