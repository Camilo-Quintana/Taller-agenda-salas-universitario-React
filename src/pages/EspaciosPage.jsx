import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import espacios from '../data/espacios.json'
import Filtros from '../components/Filtros.jsx'
import SelectorDia from '../components/SelectorDia.jsx'
import EspacioCard from '../components/EspacioCard.jsx'
import Paginacion from '../components/Paginacion.jsx'
import MensajeVacio from '../components/MensajeVacio.jsx'
import { useAhora } from '../hooks/useAhora.js'
import { fechaDelDia } from '../utils/fechas.js'
import { contarBloquesLibres } from '../utils/reglasReserva.js'

const POR_PAGINA = 6

// Opciones de los filtros sacadas de los datos (sin repetir)
const OPCIONES = {
  tipos: [...new Set(espacios.map((espacio) => espacio.tipo))],
  edificios: [...new Set(espacios.map((espacio) => espacio.edificio))].sort(),
}

// Nombre de cada filtro en la URL (?q=...&tipo=...)
const PARAMETRO = { busqueda: 'q', tipo: 'tipo', edificio: 'edificio', capacidadMin: 'capacidad', dia: 'dia' }

function leerFiltrosDeUrl(params) {
  return {
    tipo: params.get('tipo') ?? '',
    edificio: params.get('edificio') ?? '',
    capacidadMin: Number(params.get('capacidad')) || 0,
    dia: params.get('dia') === 'manana' ? 'manana' : 'hoy',
  }
}

function coincide(espacio, filtros) {
  const texto = filtros.busqueda.trim().toLowerCase()
  const coincideTexto =
    !texto ||
    espacio.nombre.toLowerCase().includes(texto) ||
    espacio.caracteristicas.some((caracteristica) => caracteristica.toLowerCase().includes(texto))
  return (
    coincideTexto &&
    (!filtros.tipo || espacio.tipo === filtros.tipo) &&
    (!filtros.edificio || espacio.edificio === filtros.edificio) &&
    espacio.capacidad >= filtros.capacidadMin
  )
}

function EspaciosPage({ reservas }) {
  // Los filtros, el día y la página van en la URL para no perderlos al volver del detalle
  const [params, setParams] = useSearchParams()
  // La búsqueda tiene además su propio estado para que el campo responda al instante
  const [busqueda, setBusqueda] = useState(() => params.get('q') ?? '')
  const ahora = useAhora()

  // Esto se calcula en cada render, no hace falta guardarlo en un estado
  const filtros = { ...leerFiltrosDeUrl(params), busqueda }
  const fecha = fechaDelDia(filtros.dia, ahora)
  const resultados = espacios.filter((espacio) => coincide(espacio, filtros))
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA))
  const pagina = Math.min(Math.max(1, Number(params.get('pagina')) || 1), totalPaginas)
  const espaciosDePagina = resultados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  function cambiarFiltro(campo, valor) {
    if (campo === 'busqueda') setBusqueda(valor)
    setParams(
      (anteriores) => {
        const nuevos = new URLSearchParams(anteriores)
        const sinValor = valor === '' || valor === 0 || (campo === 'dia' && valor === 'hoy')
        if (sinValor) nuevos.delete(PARAMETRO[campo])
        else nuevos.set(PARAMETRO[campo], String(valor))
        if (campo !== 'dia') nuevos.delete('pagina') // al filtrar volvemos a la página 1
        return nuevos
      },
      { replace: true },
    )
  }

  function limpiarFiltros() {
    setBusqueda('')
    setParams(
      (anteriores) => {
        const nuevos = new URLSearchParams()
        if (anteriores.get('dia') === 'manana') nuevos.set('dia', 'manana') // el día elegido se mantiene
        return nuevos
      },
      { replace: true },
    )
  }

  function cambiarPagina(numero) {
    setParams((anteriores) => {
      const nuevos = new URLSearchParams(anteriores)
      if (numero === 1) nuevos.delete('pagina')
      else nuevos.set('pagina', String(numero))
      return nuevos
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="titulo-espacios">
      <h1 id="titulo-espacios" className="titulo-pagina">
        Espacios disponibles
      </h1>
      <p className="text-muted">
        Salas de clases, laboratorios, salas de estudio, salas de reunión y espacios exteriores de la Sede Viña del
        Mar.
      </p>

      <Filtros filtros={filtros} opciones={OPCIONES} onCambiar={cambiarFiltro} onLimpiar={limpiarFiltros} />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 my-3">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="fw-semibold">Disponibilidad para:</span>
          <SelectorDia
            dia={filtros.dia}
            onCambiar={(dia) => cambiarFiltro('dia', dia)}
            ahora={ahora}
            etiqueta="Día para ver la disponibilidad"
          />
        </div>
        <p className="mb-0 text-muted" aria-live="polite">
          {resultados.length} {resultados.length === 1 ? 'espacio' : 'espacios'}
        </p>
      </div>

      {resultados.length === 0 ? (
        <MensajeVacio
          icono="bi-search"
          titulo="No hay espacios con esos filtros"
          mensaje="Prueba con otra búsqueda o quita algunos filtros."
          accion={{ texto: 'Limpiar filtros', onClick: limpiarFiltros }}
        />
      ) : (
        <>
          <div className="row g-4">
            {espaciosDePagina.map((espacio) => (
              <div key={espacio.id} className="col-12 col-sm-6 col-lg-4">
                <EspacioCard
                  espacio={espacio}
                  libres={contarBloquesLibres(reservas, espacio.id, fecha, ahora)}
                  dia={filtros.dia}
                />
              </div>
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={cambiarPagina} />
        </>
      )}
    </section>
  )
}

export default EspaciosPage
