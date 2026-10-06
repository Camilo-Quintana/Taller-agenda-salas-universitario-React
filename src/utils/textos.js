// Textos que se repiten en varias vistas

// { tipo: 'Clases', edificio: 'A', piso: 1 } -> "Clases - Edificio A - Piso 1"
export function describirUbicacion(espacio) {
  return `${espacio.tipo} - Edificio ${espacio.edificio} - Piso ${espacio.piso}`
}

// 1 -> "1 persona", 40 -> "40 personas"
export function textoCapacidad(cantidad) {
  return `${cantidad} ${cantidad === 1 ? 'persona' : 'personas'}`
}
