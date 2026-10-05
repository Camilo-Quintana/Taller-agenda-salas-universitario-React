import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CampoTexto from '../components/CampoTexto.jsx'
import Alerta from '../components/Alerta.jsx'
import Ventana from '../components/Ventana.jsx'
import { formatearRut, validarPerfil } from '../utils/validaciones.js'

const PERFIL_VACIO = { nombre: '', correo: '', rut: '' }

function PerfilPage({ perfil, onGuardar, onRestablecer }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [valores, setValores] = useState(perfil ?? PERFIL_VACIO)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [confirmarRestablecer, setConfirmarRestablecer] = useState(false)

  function cambiarCampo(campo, valor) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }))
    setErrores((anteriores) => ({ ...anteriores, [campo]: null })) // el error se borra al corregir
    setMensaje(null)
  }

  function guardar(evento) {
    evento.preventDefault() // para que el navegador no recargue la página
    const encontrados = validarPerfil(valores)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    const datos = {
      nombre: valores.nombre.trim(),
      correo: valores.correo.trim().toLowerCase(),
      rut: formatearRut(valores.rut),
    }
    onGuardar(datos)

    if (location.state?.volverAlGuardar) {
      navigate(-1) // vuelve al espacio que estaba reservando
      return
    }
    setValores(datos)
    setMensaje('Perfil guardado. Ya puedes reservar.')
  }

  function restablecer() {
    onRestablecer()
    setConfirmarRestablecer(false)
    setMensaje('Datos de ejemplo restablecidos.')
  }

  return (
    <section aria-labelledby="titulo-perfil">
      <h1 id="titulo-perfil" className="titulo-pagina">
        Mi perfil
      </h1>
      <p className="text-muted">Tus datos identifican tus reservas. Se guardan solo en este navegador.</p>

      {mensaje && (
        <Alerta tipo="exito" onCerrar={() => setMensaje(null)}>
          {mensaje}
        </Alerta>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="panel-blanco" noValidate onSubmit={guardar}>
            <CampoTexto
              id="perfil-nombre"
              etiqueta="Nombre completo"
              valor={valores.nombre}
              error={errores.nombre}
              onCambiar={(valor) => cambiarCampo('nombre', valor)}
              autoComplete="name"
            />
            <CampoTexto
              id="perfil-correo"
              etiqueta="Correo institucional"
              tipo="email"
              valor={valores.correo}
              error={errores.correo}
              ayuda="Ejemplo: nombre@uandresbello.edu"
              onCambiar={(valor) => cambiarCampo('correo', valor)}
              autoComplete="email"
            />
            <CampoTexto
              id="perfil-rut"
              etiqueta="RUT"
              valor={valores.rut}
              error={errores.rut}
              ayuda="Con o sin puntos, con guion y dígito verificador. Ejemplo: 12.345.678-5"
              onCambiar={(valor) => cambiarCampo('rut', valor)}
            />
            <button type="submit" className="btn btn-primary">
              Guardar perfil
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <section className="panel-blanco" aria-labelledby="titulo-demo">
            <h2 id="titulo-demo" className="h6">
              Datos de demostración
            </h2>
            <p className="small text-muted">
              Vuelve a cargar las reservas de ejemplo de otros estudiantes con las fechas de hoy y mañana. Se borran las
              demás reservas guardadas en este navegador.
            </p>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmarRestablecer(true)}>
              <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
              Restablecer datos de ejemplo
            </button>
          </section>
        </div>
      </div>

      <Ventana
        abierto={confirmarRestablecer}
        titulo="¿Restablecer datos de ejemplo?"
        onCerrar={() => setConfirmarRestablecer(false)}
        pie={
          <>
            <button type="button" className="btn btn-outline-secondary" autoFocus onClick={() => setConfirmarRestablecer(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={restablecer}>
              Sí, restablecer
            </button>
          </>
        }
      >
        <p className="mb-0">
          Se eliminarán todas las reservas guardadas en este navegador y se cargarán las de ejemplo. Tu perfil no cambia.
        </p>
      </Ventana>
    </section>
  )
}

export default PerfilPage
