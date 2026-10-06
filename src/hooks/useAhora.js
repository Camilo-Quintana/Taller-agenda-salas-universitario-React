import { useEffect, useState } from 'react'

// Hora actual que se actualiza cada 30 segundos.
// Así lo que depende de la hora ("ya pasó", "en curso") cambia solo.
export function useAhora(intervaloMs = 30000) {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), intervaloMs)
    return () => clearInterval(id)
  }, [intervaloMs])

  return ahora
}
