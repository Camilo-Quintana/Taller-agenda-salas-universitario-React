// Validaciones del perfil (las mismas de la versión 1)

// "12.345.678-5" -> "123456785"
export function normalizarRut(rut) {
  return String(rut).replace(/[.\s-]/g, '').toUpperCase()
}

// Valida el RUT con su dígito verificador (módulo 11)
export function validarRut(rut) {
  const limpio = normalizarRut(rut)
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false
  const cuerpo = limpio.slice(0, -1)
  const digitoVerificador = limpio.slice(-1)
  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return digitoVerificador === esperado
}

// "123456785" -> "12.345.678-5"
export function formatearRut(rut) {
  const limpio = normalizarRut(rut)
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${cuerpo}-${limpio.slice(-1)}`
}

export function validarEmail(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim())
}

// Devuelve los errores que encuentra (si está todo bien devuelve {})
export function validarPerfil({ nombre, correo, rut }) {
  const errores = {}
  if (nombre.trim().length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  if (!validarEmail(correo)) errores.correo = 'Ingresa un correo válido (por ejemplo, nombre@uandresbello.edu).'
  if (!validarRut(rut)) errores.rut = 'RUT inválido: revisa el dígito verificador (ejemplo: 12.345.678-5).'
  return errores
}
