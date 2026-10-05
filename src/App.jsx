import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import EspaciosPage from './pages/EspaciosPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import NoEncontradoPage from './pages/NoEncontradoPage.jsx'
import { useReservas } from './hooks/useReservas.js'
import { usePerfil } from './hooks/usePerfil.js'

function App() {
  // Las reservas y el perfil se usan en varias páginas: viven aquí y bajan por props
  const { reservas, restablecerReservas } = useReservas()
  const { perfil, guardarPerfil } = usePerfil()
  const { pathname } = useLocation()

  // Cada vez que cambia la ruta, volvemos al inicio de la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <Navbar perfil={perfil} />
      <main className="app-contenido container">
        <Routes>
          <Route path="/" element={<EspaciosPage reservas={reservas} />} />
          <Route
            path="/perfil"
            element={<PerfilPage perfil={perfil} onGuardar={guardarPerfil} onRestablecer={restablecerReservas} />}
          />
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App