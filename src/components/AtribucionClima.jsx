// Crédito que pide la licencia de Open-Meteo donde mostramos sus datos
function AtribucionClima() {
  return (
    <p className="atribucion-clima">
      <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
        Weather data by Open-Meteo.com
      </a>
      {' | '}
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
        CC BY 4.0
      </a>
      {' | datos adaptados (redondeados y traducidos)'}
    </p>
  )
}

export default AtribucionClima
