import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import './Navbar.css'

const ENLACES = [
  { ruta: '/', texto: 'Espacios', icono: 'bi-grid' },
  { ruta: '/mis-reservas', texto: 'Mis reservas', icono: 'bi-bookmark-check' },
  { ruta: '/perfil', texto: 'Mi perfil', icono: 'bi-person-circle' },
]

// Barra de arriba. En celular el menú se abre y se cierra con un botón.
function Navbar({ perfil }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const primerNombre = perfil?.nombre.split(' ')[0]
  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="navbar-unab">
      <nav className="container navbar-unab__barra" aria-label="Navegación principal">
        <Link to="/" className="navbar-unab__marca" onClick={cerrarMenu}>
          <img src={logo} alt="Universidad Andrés Bello" className="navbar-unab__logo" />
          <span className="navbar-unab__nombre">ReservaUNAB</span>
        </Link>

        <button
          type="button"
          className="navbar-unab__toggle"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <i className={`bi ${menuAbierto ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true"></i>
        </button>

        <div id="menu-principal" className={`navbar-unab__menu ${menuAbierto ? 'abierto' : ''}`}>
          {primerNombre && <span className="navbar-unab__saludo">Hola, {primerNombre}</span>}
          <ul className="navbar-unab__enlaces">
            {ENLACES.map((enlace) => (
              <li key={enlace.ruta}>
                <NavLink
                  to={enlace.ruta}
                  end={enlace.ruta === '/'}
                  className={({ isActive }) => `navbar-unab__enlace ${isActive ? 'activo' : ''}`}
                  onClick={cerrarMenu}
                >
                  <i className={`bi ${enlace.icono} me-1`} aria-hidden="true"></i>
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
