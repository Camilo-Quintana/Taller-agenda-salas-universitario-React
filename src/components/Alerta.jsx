// Mensaje con las alertas de Bootstrap. tipo: 'exito', 'error', 'aviso' o 'info'
const VARIANTES = {
  exito: { clase: 'success', icono: 'bi-check-circle' },
  error: { clase: 'danger', icono: 'bi-x-circle' },
  aviso: { clase: 'warning', icono: 'bi-exclamation-triangle' },
  info: { clase: 'info', icono: 'bi-info-circle' },
}

function Alerta({ tipo = 'info', children, onCerrar }) {
  const variante = VARIANTES[tipo]
  return (
    <div
      className={`alert alert-${variante.clase} alerta d-flex align-items-start gap-2`}
      role={tipo === 'error' ? 'alert' : 'status'}
    >
      <i className={`bi ${variante.icono} alerta__icono`} aria-hidden="true"></i>
      <div className="flex-grow-1">{children}</div>
      {onCerrar && <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={onCerrar}></button>}
    </div>
  )
}

export default Alerta
