import { Link } from 'react-router-dom'

// Mensaje para cuando no hay nada que mostrar (sin resultados, sin reservas o una página que no existe).
// accion puede ser un enlace { texto, ruta } o un botón { texto, onClick }.
function MensajeVacio({ icono = 'bi-inbox', titulo, mensaje, accion }) {
  return (
    <div className="mensaje-vacio">
      <i className={`bi ${icono} mensaje-vacio__icono`} aria-hidden="true"></i>
      <h2 className="h5 mt-3">{titulo}</h2>
      {mensaje && <p className="text-muted mb-3">{mensaje}</p>}
      {accion?.ruta && (
        <Link to={accion.ruta} className="btn btn-primary">
          {accion.texto}
        </Link>
      )}
      {accion?.onClick && (
        <button type="button" className="btn btn-primary" onClick={accion.onClick}>
          {accion.texto}
        </button>
      )}
    </div>
  )
}

export default MensajeVacio
