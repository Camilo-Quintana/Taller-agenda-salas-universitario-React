// Input con su etiqueta, un texto de ayuda y su mensaje de error
function CampoTexto({ id, etiqueta, tipo = 'text', valor, error, ayuda, onCambiar, autoComplete }) {
  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`
  let descripcion
  if (error) descripcion = idError
  else if (ayuda) descripcion = idAyuda

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}
      </label>
      <input
        id={id}
        type={tipo}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={descripcion}
        autoComplete={autoComplete}
      />
      {error && (
        <div id={idError} className="invalid-feedback">
          {error}
        </div>
      )}
      {!error && ayuda && (
        <div id={idAyuda} className="form-text">
          {ayuda}
        </div>
      )}
    </div>
  )
}

export default CampoTexto
