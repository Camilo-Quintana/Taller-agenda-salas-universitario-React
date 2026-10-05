import { useLocalStorage } from './useLocalStorage.js'
import { crearReservasEjemplo } from '../utils/datosEjemplo.js'

// Reservas de todos los estudiantes, guardadas en el navegador.
// La primera vez carga las de ejemplo con las fechas de hoy y mañana.
export function useReservas() {
  const [reservas, setReservas] = useLocalStorage('reservas_unab', () => crearReservasEjemplo(new Date()))

  // siempre creamos un arreglo nuevo, no cambiamos el anterior
  function agregarReserva(datos) {
    const nueva = { id: Date.now(), ...datos }
    setReservas((anteriores) => [...anteriores, nueva])
    return nueva
  }

  function cancelarReserva(id) {
    setReservas((anteriores) => anteriores.filter((reserva) => reserva.id !== id))
  }

  function restablecerReservas() {
    setReservas(crearReservasEjemplo(new Date()))
  }

  return { reservas, agregarReserva, cancelarReserva, restablecerReservas }
}
