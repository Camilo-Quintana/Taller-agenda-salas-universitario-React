import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import espacios from '../data/espacios.json'
import bloques from '../data/bloques.json'
import sede from '../data/sede.json'
import PanelClima from '../components/PanelClima.jsx'
import SelectorDia from '../components/SelectorDia.jsx'
import SelectorHorario from '../components/SelectorHorario.jsx'
import AtribucionClima from '../components/AtribucionClima.jsx'
import Alerta from '../components/Alerta.jsx'
import Ventana from '../components/Ventana.jsx'
import MensajeVacio from '../components/MensajeVacio.jsx'
import { useAhora } from '../hooks/useAhora.js'
import { useClima } from '../hooks/useClima.js'
import { imagenDeEspacio } from '../utils/imagenes.js'
import { fechaDelDia, formatearBloque, formatearFechaLarga } from '../utils/fechas.js'
import { debeAvisarLluvia, estadoBloque, validarNuevaReserva } from '../utils/reglasReserva.js'
import { describirUbicacion, textoCapacidad } from '../utils/textos.js'
import './DetalleEspacioPage.css'

function DetalleEspacioPage({ reservas, perfil, onReservar }) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const ahora = useAhora()

  const [dia, setDia] = useState(params.get('dia') === 'manana' ? 'manana' : 'hoy')
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null)
  const [error, setError] = useState(null)
  const [reservaConfirmada, setReservaConfirmada] = useState(null)

  const fecha = fechaDelDia(dia, ahora)
  const clima = useClima(fecha)
  const espacio = espacios.find((e) => e.id === Number(id))

  function volverAEspacios() {
    // si vino desde la app, volver atrás recupera los filtros del catálogo
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  if (!espacio) {
    return (
      <section aria-labelledby="titulo-no-encontrado">
        <h1 id="titulo-no-encontrado" className="visually-hidden">
          Espacio no encontrado
        </h1>
        <MensajeVacio
          icono="bi-door-open"
          titulo="Espacio no encontrado"
          mensaje="El espacio que buscas no existe."
          accion={{ texto: 'Ver todos los espacios', ruta: '/' }}
        />
      </section>
    )
  }

  // cada bloque con su estado (libre, ocupado o pasado) y su clima
  const bloquesDelDia = bloques.map((bloque) => ({
    bloque,
    estado: estadoBloque(reservas, espacio.id, fecha, bloque, ahora),
    clima: clima.datos?.porHora[bloque.slice(0, 5)] ?? null,
  }))
  const climaElegido = bloquesDelDia.find((b) => b.bloque === bloqueSeleccionado)?.clima ?? null
  const avisarLluvia = bloqueSeleccionado !== null && debeAvisarLluvia(espacio, climaElegido)

  function cambiarDia(nuevoDia) {
    setDia(nuevoDia)
    setBloqueSeleccionado(null) // el horario elegido era del otro día
    setError(null)
  }

  function elegirBloque(bloque) {
    setBloqueSeleccionado(bloque)
    setError(null)
  }

  function confirmar() {
    const problema = validarNuevaReserva({
      reservas,
      espacioId: espacio.id,
      fecha,
      bloque: bloqueSeleccionado,
      perfil,
      // hora exacta del clic ("ahora" se actualiza cada 30 s); el linter reclama, pero esto corre al hacer clic
      // oxlint-disable-next-line react/purity
      ahora: new Date(),
    })
    if (problema) {
      setError(problema)
      return
    }
    const nueva = onReservar({
      espacioId: espacio.id,
      nombreSolicitante: perfil.nombre,
      correo: perfil.correo,
      rut: perfil.rut,
      fecha,
      bloque: bloqueSeleccionado,
    })
    setReservaConfirmada(nueva)
    setBloqueSeleccionado(null)
  }

  return (
    <article aria-labelledby="titulo-espacio">
      <button type="button" className="btn btn-link px-0 mb-3" onClick={volverAEspacios}>
        <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
        Volver a espacios
      </button>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <img src={imagenDeEspacio(espacio)} alt={espacio.nombre} className="detalle__imagen" />
          <h1 id="titulo-espacio" className="titulo-pagina mt-3 mb-1">
            {espacio.nombre}
          </h1>
          <p className="text-muted mb-2">
            {describirUbicacion(espacio)} - Capacidad: {textoCapacidad(espacio.capacidad)}
          </p>
          <ul className="lista-etiquetas" aria-label="Características">
            {espacio.caracteristicas.map((caracteristica) => (
              <li key={caracteristica}>{caracteristica}</li>
            ))}
          </ul>
          <PanelClima clima={clima} fecha={fecha} sede={sede.nombre} onReintentar={clima.reintentar} />
        </div>

        <div className="col-12 col-lg-7">
          <section className="panel-blanco" aria-labelledby="titulo-reservar">
            <h2 id="titulo-reservar" className="h4 mb-3">
              Reservar
            </h2>

            <h3 className="detalle__paso">1. Elige el día</h3>
            <SelectorDia dia={dia} onCambiar={cambiarDia} ahora={ahora} etiqueta="Día de la reserva" />

            <h3 className="detalle__paso">
              2. Elige el horario <span className="fw-normal text-muted small">(bloques de 1 hora)</span>
            </h3>
            <SelectorHorario bloques={bloquesDelDia} seleccionado={bloqueSeleccionado} onSeleccionar={elegirBloque} />
            {clima.estado === 'listo' && <AtribucionClima />}

            {avisarLluvia && (
              <Alerta tipo="aviso">
                <strong>Espacio exterior:</strong> hay {climaElegido.probLluvia}% de probabilidad de lluvia a las{' '}
                {bloqueSeleccionado.slice(0, 5)}. Considera otro horario, otro día o un espacio interior.
              </Alerta>
            )}

            <h3 className="detalle__paso">3. Confirma</h3>
            {perfil ? (
              <div className="detalle__confirmar">
                <p className="mb-2">
                  Reservarás como <strong>{perfil.nombre}</strong> (RUT {perfil.rut})
                </p>
                {error && <Alerta tipo="error">{error}</Alerta>}
                <button type="button" className="btn btn-primary" onClick={confirmar}>
                  Confirmar reserva
                </button>
              </div>
            ) : (
              <Alerta tipo="info">
                Para reservar necesitas completar tu perfil.{' '}
                <Link to="/perfil" state={{ volverAlGuardar: true }} className="alert-link">
                  Ir a mi perfil
                </Link>
              </Alerta>
            )}
          </section>
        </div>
      </div>

      <Ventana
        abierto={reservaConfirmada !== null}
        titulo="Reserva confirmada"
        onCerrar={() => setReservaConfirmada(null)}
        pie={
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={volverAEspacios}>
              Seguir explorando
            </button>
            <button type="button" className="btn btn-primary" autoFocus onClick={() => navigate('/mis-reservas')}>
              Ver mis reservas
            </button>
          </>
        }
      >
        {reservaConfirmada && (
          <>
            <p className="mb-2">Tu reserva quedó registrada:</p>
            <ul className="mb-0">
              <li>
                <strong>{espacio.nombre}</strong>
              </li>
              <li>{formatearFechaLarga(reservaConfirmada.fecha)}</li>
              <li>{formatearBloque(reservaConfirmada.bloque)}</li>
            </ul>
          </>
        )}
      </Ventana>
    </article>
  )
}

export default DetalleEspacioPage
