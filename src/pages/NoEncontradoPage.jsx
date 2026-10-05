import MensajeVacio from '../components/MensajeVacio.jsx'

// Para cualquier ruta que no existe
function NoEncontradoPage() {
  return (
    <section aria-labelledby="titulo-no-encontrado">
      <h1 id="titulo-no-encontrado" className="visually-hidden">
        Página no encontrada
      </h1>
      <MensajeVacio
        icono="bi-question-circle"
        titulo="Página no encontrada"
        mensaje="La dirección que escribiste no existe en ReservaUNAB."
        accion={{ texto: 'Ir a espacios', ruta: '/' }}
      />
    </section>
  )
}

export default NoEncontradoPage
