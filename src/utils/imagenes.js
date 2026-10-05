// Imagen de cada espacio. Las importamos para que Vite las incluya al hacer el build.
import salaClases from '../assets/images/espacios/sala-clases.jpg'
import laboratorio from '../assets/images/espacios/laboratorio.jpg'
import laboratorioCientifico from '../assets/images/espacios/laboratorio-cientifico.jpg'
import salaReunion from '../assets/images/espacios/sala-reunion.jpg'
import salaEstudio from '../assets/images/espacios/sala-estudio.jpg'
import exterior from '../assets/images/espacios/exterior.svg'
import salaDefault from '../assets/images/espacios/sala-default.jpg'

const IMAGEN_POR_TIPO = {
  'Clases': salaClases,
  'Laboratorio': laboratorio,
  'Reunión': salaReunion,
  'Estudio': salaEstudio,
  'Exterior': exterior,
}

const IMAGEN_POR_CATEGORIA = {
  'cientifico': laboratorioCientifico,
}

// Primero la categoría (laboratorios científicos), después el tipo y si no, la imagen por defecto
export function imagenDeEspacio(espacio) {
  return IMAGEN_POR_CATEGORIA[espacio.categoria] ?? IMAGEN_POR_TIPO[espacio.tipo] ?? salaDefault
}
