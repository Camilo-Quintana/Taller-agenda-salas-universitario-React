import IconoClima from './IconoClima.jsx'
import AtribucionClima from './AtribucionClima.jsx'
import Alerta from './Alerta.jsx'
import { formatearFechaCorta } from '../utils/fechas.js'
import './PanelClima.css'

// Clima del día con sus 3 estados: cargando, listo y error
function PanelClima({ clima, fecha, sede, onReintentar }) {
  return (
    <section className="panel-clima" aria-labelledby="titulo-clima">
      <h2 id="titulo-clima" className="h6 panel-clima__titulo">
        Clima en {sede} ({formatearFechaCorta(fecha)})
      </h2>

      {clima.estado === 'cargando' && (
        <p className="mb-0" role="status">
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Consultando el pronóstico...
        </p>
      )}

      {clima.estado === 'error' && (
        <>
          <Alerta tipo="error">
            No pudimos obtener el pronóstico. Puedes reservar igual.
            <div className="small mt-1">Detalle: {clima.error}</div>
          </Alerta>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={onReintentar}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
            Reintentar
          </button>
        </>
      )}

      {clima.estado === 'listo' && (
        <>
          <div className="panel-clima__resumen">
            <IconoClima tipo={clima.datos.resumen.tipo} />
            <div>
              <p className="panel-clima__descripcion mb-0">{clima.datos.resumen.descripcion}</p>
              <p className="mb-0 small">
                {clima.datos.resumen.minima}° a {clima.datos.resumen.maxima}°, probabilidad de lluvia de hasta{' '}
                {clima.datos.resumen.probLluviaMax}%
              </p>
            </div>
          </div>
          <AtribucionClima />
        </>
      )}
    </section>
  )
}

export default PanelClima
