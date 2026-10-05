// Funciones de fechas. Las fechas se guardan como texto "AAAA-MM-DD" (hora del computador).

// Date -> "AAAA-MM-DD"
export function aTextoFecha(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function fechaHoy(ahora) {
  return aTextoFecha(ahora)
}

export function fechaManana(ahora) {
  // si es fin de mes, new Date pasa solo al mes siguiente
  return aTextoFecha(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1))
}

// "hoy" | "manana" -> "AAAA-MM-DD"
export function fechaDelDia(dia, ahora) {
  return dia === 'manana' ? fechaManana(ahora) : fechaHoy(ahora)
}

// "AAAA-MM-DD" -> Date a medianoche
// (ojo: new Date("AAAA-MM-DD") lo toma en UTC y en Chile puede quedar en el día anterior)
export function aFecha(textoFecha) {
  const [anio, mes, dia] = textoFecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia)
}

// "2026-10-02" -> "viernes, 2 de octubre"
export function formatearFechaLarga(textoFecha) {
  return aFecha(textoFecha).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

// "2026-10-03" -> "sáb 3 oct"
export function formatearFechaCorta(textoFecha) {
  return aFecha(textoFecha)
    .toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
    .replaceAll('.', '')
    .replace(',', '')
}

// "08:00-09:00" -> "08:00 - 09:00"
export function formatearBloque(bloque) {
  return bloque.replace('-', ' - ')
}

// ("2026-10-02", "15:00-16:00") -> { inicio: Date 15:00, fin: Date 16:00 }
export function rangoDeBloque(textoFecha, bloque) {
  const [horaInicio, horaFin] = bloque.split('-').map((hora) => Number(hora.slice(0, 2)))
  const base = aFecha(textoFecha)
  return {
    inicio: new Date(base.getFullYear(), base.getMonth(), base.getDate(), horaInicio),
    fin: new Date(base.getFullYear(), base.getMonth(), base.getDate(), horaFin),
  }
}
