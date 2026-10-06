import IconoClima from './IconoClima.jsx'
import { formatearBloque } from '../utils/fechas.js'
import './SelectorHorario.css'

const TEXTO_ESTADO = { libre: 'Libre', ocupado: 'Ocupado', pasado: 'Ya pasó' }

// Los 13 horarios del día, cada uno con su estado y su clima (si ya llegó)
function SelectorHorario({ bloques, seleccionado, onSeleccionar }) {
  return (
    <div className="selector-horario" role="group" aria-label="Horarios del día">
      {bloques.map(({ bloque, estado, clima }) => {
        const elegido = bloque === seleccionado
        const disponible = estado === 'libre'
        const detalleClima = clima
          ? `, ${clima.descripcion}, ${clima.temperatura} grados, ${clima.probLluvia}% de probabilidad de lluvia`
          : ''
        return (
          <button
            key={bloque}
            type="button"
            className={`selector-horario__bloque ${estado} ${elegido ? 'elegido' : ''}`}
            disabled={!disponible}
            aria-pressed={elegido}
            aria-label={`${formatearBloque(bloque)}, ${TEXTO_ESTADO[estado]}${detalleClima}`}
            onClick={() => onSeleccionar(bloque)}
          >
            <span className="selector-horario__hora">{bloque.slice(0, 5)}</span>
            {disponible && clima ? (
              <span className="selector-horario__detalle">
                <IconoClima tipo={clima.tipo} /> {clima.temperatura}° | {clima.probLluvia}%
              </span>
            ) : (
              <span className="selector-horario__detalle">{TEXTO_ESTADO[estado]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SelectorHorario
