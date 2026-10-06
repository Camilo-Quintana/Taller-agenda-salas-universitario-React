import { useState } from 'react'
import espacios from '../data/espacios.json'
import ReservaCard from '../components/ReservaCard.jsx'
import Ventana from '../components/Ventana.jsx'
import Alerta from '../components/Alerta.jsx'
import MensajeVacio from '../components/MensajeVacio.jsx'
import { useAhora } from '../hooks/useAhora.js'
import { normalizarRut } from '../utils/validaciones.js'
import { estadoReserva } from '../utils/reglasReserva.js'
import { formatearBloque, formatearFechaLarga } from '../utils/fechas.js'

// Orden: primero las en curso, después las próximas y al final las finalizadas
const ORDEN_ESTADO = { 'en-curso': 0, proxima: 1, finalizada: 2 }
const NOMBRE_ESTADO = {
  'en-curso': ['en curso', 'en curso'],
  proxima: ['próxima', 'próximas'],
  finalizada: ['finalizada', 'finalizadas'],
}

function buscarEspacio(id) {
  return espacios.find((espacio) => espacio.id === id)
}

function MisReservasPage({ reservas, perfil, onCancelar }) {
  const ahora = useAhora()
  const [reservaACancelar, setReservaACancelar] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  if (!perfil) {
    return (
      <section aria-labelledby="titulo-mis-reservas">
        <h1 id="titulo-mis-reservas" className="titulo-pagina">
          Mis reservas
        </h1>
        <MensajeVacio
          icono="bi-person-circle"
          titulo="Completa tu perfil para ver tus reservas"
          mensaje="Tus reservas se identifican con tu RUT."
          accion={{ texto: 'Ir a mi perfil', ruta: '/perfil' }}
        />
      </section>
    )
  }

  // Solo las reservas de este RUT, cada una con su estado según la hora
  const rutPerfil = normalizarRut(perfil.rut)
  const misReservas = reservas
    .filter((reserva) => normalizarRut(reserva.rut) === rutPerfil)
    .map((reserva) => ({ reserva, estado: estadoReserva(reserva, ahora) }))
    .sort(
      (a, b) =>
        ORDEN_ESTADO[a.estado] - ORDEN_ESTADO[b.estado] ||
        (a.reserva.fecha + a.reserva.bloque).localeCompare(b.reserva.fecha + b.reserva.bloque),
    )

  const resumen = Object.keys(ORDEN_ESTADO)
    .map((estado) => {
      const cantidad = misReservas.filter((item) => item.estado === estado).length
      const [singular, plural] = NOMBRE_ESTADO[estado]
      return cantidad > 0 ? `${cantidad} ${cantidad === 1 ? singular : plural}` : null
    })
    .filter(Boolean)
    .join(', ')

  function confirmarCancelacion() {
    onCancelar(reservaACancelar.id)
    setReservaACancelar(null)
    setMensaje('Reserva cancelada. El horario quedó libre otra vez.')
  }

  return (
    <section aria-labelledby="titulo-mis-reservas">
      <h1 id="titulo-mis-reservas" className="titulo-pagina">
        Mis reservas
      </h1>

      {mensaje && (
        <Alerta tipo="exito" onCerrar={() => setMensaje(null)}>
          {mensaje}
        </Alerta>
      )}

      {misReservas.length === 0 ? (
        <MensajeVacio
          icono="bi-calendar-event"
          titulo="Aún no tienes reservas"
          mensaje="Explora los espacios y reserva un horario."
          accion={{ texto: 'Explorar espacios', ruta: '/' }}
        />
      ) : (
        <>
          <p className="text-muted">{resumen}</p>
          <div className="row g-3">
            {misReservas.map(({ reserva, estado }) => (
              <div key={reserva.id} className="col-12 col-md-6 col-lg-4">
                <ReservaCard
                  reserva={reserva}
                  espacio={buscarEspacio(reserva.espacioId)}
                  estado={estado}
                  onCancelar={setReservaACancelar}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <Ventana
        abierto={reservaACancelar !== null}
        titulo="¿Cancelar reserva?"
        onCerrar={() => setReservaACancelar(null)}
        pie={
          <>
            <button type="button" className="btn btn-outline-secondary" autoFocus onClick={() => setReservaACancelar(null)}>
              No, volver
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmarCancelacion}>
              Sí, cancelar
            </button>
          </>
        }
      >
        {reservaACancelar && (
          <p className="mb-0">
            Se cancelará tu reserva de <strong>{buscarEspacio(reservaACancelar.espacioId)?.nombre ?? 'este espacio'}</strong>{' '}
            el {formatearFechaLarga(reservaACancelar.fecha)}, {formatearBloque(reservaACancelar.bloque)}. Esta acción no se
            puede deshacer.
          </p>
        )}
      </Ventana>
    </section>
  )
}

export default MisReservasPage
