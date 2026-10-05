const imagenPorTipo = {
    "Clases": "./img/salas/sala-clases.jpg",
    "Laboratorio": "./img/salas/laboratorio.jpg",
    "Estudio": "./img/salas/sala-estudio.jpg",
    "Reunión": "./img/salas/sala-reunion.jpg"
};

const imagenPorCategoria = {
    "cientifico": "./img/salas/laboratorio-cientifico.jpg"
};

function getImagenPorTipo(sala) {
    if (sala.categoria && imagenPorCategoria[sala.categoria]) {
        return imagenPorCategoria[sala.categoria];
    }
    return imagenPorTipo[sala.tipo] || "./img/salas/sala-default.jpg";
}

/* =====================================================
   SALAS (repartidas en 3 edificios: A, B y C)
   - Nombres únicos para probar búsqueda por texto
   - Capacidades en umbrales 5 / 15 / 30 para filtro
   - 4 tipos repartidos en pisos y edificios
   - Laboratorios científicos comparten categoría
===================================================== */

const BLOQUES = [
    "08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00",
    "13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00",
    "18:00-19:00","19:00-20:00","20:00-21:00"
];

const salas = [
    // ===== Edificio A =====
    { id: 1,  nombre: "Sala 101", tipo: "Clases", piso: 1, edificio: "A", capacidad: 2,  caracteristicas: ["Pizarra"], disponibilidad: true },
    { id: 2,  nombre: "Sala 102", tipo: "Clases", piso: 1, edificio: "A", capacidad: 3,  caracteristicas: ["Pizarra", "Proyector"], disponibilidad: true },
    { id: 3,  nombre: "Sala 103", tipo: "Clases", piso: 1, edificio: "A", capacidad: 5,  caracteristicas: ["Proyector", "WiFi"], disponibilidad: true },
    { id: 11, nombre: "Laboratorio Informático 1", tipo: "Laboratorio", piso: 1, edificio: "A", capacidad: 40, caracteristicas: ["Computadoras", "Proyector", "WiFi"], disponibilidad: true },
    { id: 13, nombre: "Laboratorio de Física",   tipo: "Laboratorio", categoria: "cientifico", piso: 1, edificio: "A", capacidad: 25, caracteristicas: ["Equipos de medición", "Pizarra"], disponibilidad: true },
    { id: 16, nombre: "Sala de Reunión 1", tipo: "Reunión", piso: 1, edificio: "A", capacidad: 4,  caracteristicas: ["Mesa redonda", "WiFi"], disponibilidad: true },
    { id: 17, nombre: "Sala de Reunión 2", tipo: "Reunión", piso: 1, edificio: "A", capacidad: 8,  caracteristicas: ["Mesa conferencia", "Pantalla"], disponibilidad: true },

    // ===== Edificio B =====
    { id: 4,  nombre: "Sala 104", tipo: "Clases", piso: 1, edificio: "B", capacidad: 6,  caracteristicas: ["Proyector", "Pizarra"], disponibilidad: true },
    { id: 5,  nombre: "Sala 105", tipo: "Clases", piso: 1, edificio: "B", capacidad: 8,  caracteristicas: ["Proyector", "Pizarra", "WiFi"], disponibilidad: true },
    { id: 6,  nombre: "Sala 201", tipo: "Clases", piso: 2, edificio: "B", capacidad: 14, caracteristicas: ["Proyector", "Computadoras"], disponibilidad: true },
    { id: 7,  nombre: "Sala 202", tipo: "Clases", piso: 2, edificio: "B", capacidad: 15, caracteristicas: ["Proyector", "Pizarra", "WiFi"], disponibilidad: true },
    { id: 12, nombre: "Laboratorio Informático 2", tipo: "Laboratorio", piso: 2, edificio: "B", capacidad: 35, caracteristicas: ["Computadoras", "Servidor", "WiFi"], disponibilidad: true },
    { id: 14, nombre: "Laboratorio de Química",  tipo: "Laboratorio", categoria: "cientifico", piso: 2, edificio: "B", capacidad: 20, caracteristicas: ["Campana de extracción", "Equipos de seguridad"], disponibilidad: true },
    { id: 18, nombre: "Sala de Reunión 3", tipo: "Reunión", piso: 2, edificio: "B", capacidad: 15, caracteristicas: ["Pantalla", "Videoconferencia"], disponibilidad: true },

    // ===== Edificio C =====
    { id: 8,  nombre: "Sala 203", tipo: "Clases", piso: 2, edificio: "C", capacidad: 16, caracteristicas: ["Proyector", "Aire acondicionado"], disponibilidad: true },
    { id: 9,  nombre: "Sala 204", tipo: "Clases", piso: 2, edificio: "C", capacidad: 29, caracteristicas: ["Proyector", "Pizarra", "Computadoras"], disponibilidad: true },
    { id: 10, nombre: "Sala 205", tipo: "Clases", piso: 2, edificio: "C", capacidad: 30, caracteristicas: ["Proyector", "Pizarra", "Computadoras", "Aire acondicionado"], disponibilidad: true },
    { id: 15, nombre: "Laboratorio de Biología", tipo: "Laboratorio", categoria: "cientifico", piso: 1, edificio: "C", capacidad: 22, caracteristicas: ["Microscopios", "Freezer"], disponibilidad: true },
    { id: 19, nombre: "Sala de Reunión 4", tipo: "Reunión", piso: 2, edificio: "C", capacidad: 20, caracteristicas: ["Pantalla dual", "Videoconferencia", "Grabación"], disponibilidad: true }
];

let reservas = cargarReservas();

function cargarReservas(){
    try { 
        return JSON.parse(localStorage.getItem("reservas_unab")) || []; 
    }
    catch(e) { 
        console.error("Error al cargar reservas:", e);
        return []; 
    }
}

function guardarReservas(){
    try {
        localStorage.setItem("reservas_unab", JSON.stringify(reservas));
    }
    catch(e) {
        console.error("Error al guardar reservas:", e);
        mostrarAviso("No se pudo guardar la reserva", "danger");
    }
}

/* ===== FUNCIONES DE UTILIDAD ===== */

function fechaHoy(){
    const d = new Date();
    const desfase = d.getTimezoneOffset();
    return new Date(d.getTime() - desfase * 60000).toISOString().slice(0, 10);
}

function fechaManana(){
    const [anio, mes, dia] = fechaHoy().split("-").map(Number);
    const d = new Date(anio, mes - 1, dia + 1);
    const desfase = d.getTimezoneOffset();
    return new Date(d.getTime() - desfase * 60000).toISOString().slice(0, 10);
}

function normalizarRut(rut){
    return String(rut).replace(/[.\-\s]/g, "").toUpperCase();
}

function validarRut(rut){
    const limpio = normalizarRut(rut);
    if(!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
    
    const cuerpo = limpio.slice(0, -1);
    const digitoVerificador = limpio.slice(-1);
    let suma = 0, multiplo = 2;
    
    for(let i = cuerpo.length - 1; i >= 0; i--){
        suma += Number(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return digitoVerificador === esperado;
}

function validarEmail(correo){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim());
}

function bloqueEstaTomado(espacioId, fecha, bloque){
    return reservas.some(r => 
        r.espacioId === espacioId && r.fecha === fecha && r.bloque === bloque
    );
}

function estudianteYaReservoEseDia(rut, fecha){
    const rutLimpio = normalizarRut(rut);
    return reservas.some(r => 
        normalizarRut(r.rut) === rutLimpio && r.fecha === fecha
    );
}

function bloquesDisponibles(espacioId, fecha){
    return BLOQUES.map(bloque => ({
        bloque,
        tomado: bloqueEstaTomado(espacioId, fecha, bloque)
    }));
}

function contarBloquesDisponibles(espacioId, fecha){
    return bloquesDisponibles(espacioId, fecha).filter(b => !b.tomado).length;
}

function estadoEspacio(espacioId, fecha){
    const disponibles = contarBloquesDisponibles(espacioId, fecha);
    return disponibles > 0 ? "Disponible" : "Completo";
}

function mostrarAviso(mensaje, tipo = "success"){
    const contenedor = document.getElementById("contenedor-avisos");
    if(!contenedor) return;
    
    const aviso = document.createElement("div");
    aviso.className = `alert alert-${tipo} alert-dismissible fade show`;
    aviso.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    contenedor.appendChild(aviso);
    
    setTimeout(() => {
        if(aviso.parentNode) aviso.remove();
    }, 4000);
}
