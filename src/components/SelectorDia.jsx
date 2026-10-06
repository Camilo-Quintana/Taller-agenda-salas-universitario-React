import { fechaHoy, fechaManana, formatearFechaCorta } from '../utils/fechas.js'

// Botones Hoy y Mañana (solo se puede reservar para esos dos días)
function SelectorDia({ dia, onCambiar, ahora, etiqueta = 'Día' }) {
  const opciones = [
    { valor: 'hoy', texto: 'Hoy', fecha: fechaHoy(ahora) },
    { valor: 'manana', texto: 'Mañana', fecha: fechaManana(ahora) },
  ]

  return (
    <div className="btn-group" role="group" aria-label={etiqueta}>
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className={`btn btn-sm ${dia === opcion.valor ? 'btn-primary' : 'btn-outline-primary'}`}
          aria-pressed={dia === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.texto} ({formatearFechaCorta(opcion.fecha)})
        </button>
      ))}
    </div>
  )
}

export default SelectorDia
