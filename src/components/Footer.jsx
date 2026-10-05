// Pie de página (con el crédito de Open-Meteo que pide su licencia)
function Footer() {
  return (
    <footer className="footer-unab">
      <div className="container">
        <p className="mb-1">© 2026 Universidad Andrés Bello - ReservaUNAB - Sede Viña del Mar</p>
        <p className="mb-0 small">
          Datos meteorológicos:{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Weather data by Open-Meteo.com
          </a>{' '}
          (licencia{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
          )
        </p>
      </div>
    </footer>
  )
}

export default Footer
