import { formatearBloque, formatearFechaLarga } from '../utils/fechas.js'
import { describirUbicacion } from '../utils/textos.js'
import './ReservaCard.css'

const TEXTO_ESTADO = {
  proxima: 'Próxima',
  'en-curso': 'En curso',
  finalizada: 'Finalizada',
}

// Tarjeta de una reserva. Solo las próximas se pueden cancelar.
function ReservaCard({ reserva, espacio, estado, onCancelar }) {
  return (
    <article className={`card reserva-card h-100 ${estado}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h2 className="h6 reserva-card__titulo mb-1">{espacio ? espacio.nombre : 'Espacio no disponible'}</h2>
          <span className={`badge reserva-card__estado ${estado}`}>{TEXTO_ESTADO[estado]}</span>
        </div>
        {espacio && (
          <p className="small text-muted mb-2">{describirUbicacion(espacio)}</p>
        )}
        <p className="mb-1">
          <i className="bi bi-calendar-event me-1" aria-hidden="true"></i>
          {formatearFechaLarga(reserva.fecha)}
        </p>
        <p className="mb-3">
          <i className="bi bi-clock me-1" aria-hidden="true"></i>
          {formatearBloque(reserva.bloque)}
        </p>
        {estado === 'proxima' && (
          <button type="button" className="btn btn-outline-danger btn-sm mt-auto" onClick={() => onCancelar(reserva)}>
            Cancelar reserva
          </button>
        )}
      </div>
    </article>
  )
}

export default ReservaCard
