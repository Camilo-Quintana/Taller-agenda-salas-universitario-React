import { useEffect, useId } from 'react'
import './Ventana.css'

// Ventana emergente hecha en React (no usamos el JavaScript de Bootstrap).
// Se cierra con la X, con la tecla Escape o con un clic afuera.
function Ventana({ abierto, titulo, onCerrar, pie, children }) {
  const idTitulo = useId()

  // escuchamos la tecla Escape solo mientras la ventana está abierta
  useEffect(() => {
    if (!abierto) return
    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="ventana__fondo" onClick={onCerrar}>
      <div
        className="ventana"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="ventana__cabecera">
          <h2 id={idTitulo} className="h5 mb-0">
            {titulo}
          </h2>
          <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={onCerrar}></button>
        </div>
        <div className="ventana__cuerpo">{children}</div>
        {pie && <div className="ventana__pie">{pie}</div>}
      </div>
    </div>
  )
}

export default Ventana
