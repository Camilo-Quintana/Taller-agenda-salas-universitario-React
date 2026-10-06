import './IconoClima.css'

// Ícono según el tipo de clima
const ICONO_POR_TIPO = {
  despejado: 'bi-sun',
  parcial: 'bi-cloud-sun',
  nublado: 'bi-cloud',
  niebla: 'bi-cloud-fog2',
  llovizna: 'bi-cloud-drizzle',
  lluvia: 'bi-cloud-rain',
  chubascos: 'bi-cloud-rain-heavy',
  tormenta: 'bi-cloud-lightning-rain',
  nieve: 'bi-cloud-snow',
}

function IconoClima({ tipo }) {
  const clase = ICONO_POR_TIPO[tipo] ?? 'bi-question-circle'
  return <i className={`bi ${clase} icono-clima icono-clima--${tipo}`} aria-hidden="true"></i>
}

export default IconoClima
