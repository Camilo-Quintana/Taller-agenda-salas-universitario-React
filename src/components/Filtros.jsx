const CAPACIDADES = [
  { valor: 0, texto: 'Cualquier capacidad' },
  { valor: 5, texto: '5 o más personas' },
  { valor: 15, texto: '15 o más personas' },
  { valor: 30, texto: '30 o más personas' },
]

// Filtros del catálogo. Muestra los valores que recibe y avisa cada cambio con onCambiar.
function Filtros({ filtros, opciones, onCambiar, onLimpiar }) {
  return (
    <form className="panel-blanco" role="search" onSubmit={(evento) => evento.preventDefault()}>
      <div className="row g-3 align-items-end">
        <div className="col-12 col-lg-4">
          <label htmlFor="filtro-busqueda" className="form-label small fw-semibold">
            Buscar
          </label>
          <div className="input-group">
            <span className="input-group-text" aria-hidden="true">
              <i className="bi bi-search"></i>
            </span>
            <input
              id="filtro-busqueda"
              type="search"
              className="form-control"
              placeholder="Nombre o característica (ej. WiFi)"
              value={filtros.busqueda}
              onChange={(evento) => onCambiar('busqueda', evento.target.value)}
            />
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <label htmlFor="filtro-tipo" className="form-label small fw-semibold">
            Tipo
          </label>
          <select
            id="filtro-tipo"
            className="form-select"
            value={filtros.tipo}
            onChange={(evento) => onCambiar('tipo', evento.target.value)}
          >
            <option value="">Todos</option>
            {opciones.tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <label htmlFor="filtro-edificio" className="form-label small fw-semibold">
            Edificio
          </label>
          <select
            id="filtro-edificio"
            className="form-select"
            value={filtros.edificio}
            onChange={(evento) => onCambiar('edificio', evento.target.value)}
          >
            <option value="">Todos</option>
            {opciones.edificios.map((edificio) => (
              <option key={edificio} value={edificio}>
                Edificio {edificio}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4 col-lg-2">
          <label htmlFor="filtro-capacidad" className="form-label small fw-semibold">
            Capacidad
          </label>
          <select
            id="filtro-capacidad"
            className="form-select"
            value={filtros.capacidadMin}
            onChange={(evento) => onCambiar('capacidadMin', Number(evento.target.value))}
          >
            {CAPACIDADES.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.texto}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-lg-2 d-grid">
          <button type="button" className="btn btn-outline-secondary" onClick={onLimpiar}>
            Limpiar filtros
          </button>
        </div>
      </div>
    </form>
  )
}

export default Filtros
