const contenedorTarjetas = document.getElementById("salas-container");
const TARJETAS_POR_PAGINA = 6;
 
let paginaActual = 1;
let salasFiltradas = [];
let ventanaReserva;
let bloqueSeleccionado = null;
 
// Reglas de validación
const REGLAS_VALIDACION = {
    fecha: (val) => val >= fechaHoy() && val <= fechaManana(),
    nombre: (val) => val.trim().length >= 3,
    correo: (val) => validarEmail(val),
    rut: (val) => validarRut(val)
};
 
const MENSAJES_ERROR = {
    fecha: "Solo hoy o mañana.",
    nombre: "Mínimo 3 caracteres.",
    correo: "Correo inválido.",
    rut: "RUT inválido.",
    bloque: "Selecciona un horario.",
    rutDuplicado: "Ya tienes reserva ese día.",
    bloqueOcupado: "Ese horario fue tomado."
};
 
function mostrarPagina(numeroPagina) {
    contenedorTarjetas.innerHTML = "";
    
    const inicio = (numeroPagina - 1) * TARJETAS_POR_PAGINA;
    const fin = inicio + TARJETAS_POR_PAGINA;
    const salasPagina = salasFiltradas.slice(inicio, fin);
    const fechaFiltro = obtenerFechaFiltro();
    
    salasPagina.forEach(sala => {
        const nuevaSala = document.createElement("div");
        nuevaSala.className = "col-12 col-sm-6 col-lg-4";
        
        // Calcular disponibilidad
        const estado = estadoEspacio(sala.id, fechaFiltro);
        const bloquesFree = contarBloquesDisponibles(sala.id, fechaFiltro);
        const totalBloques = BLOQUES.length;
        const estaCompleto = estado === "Completo";
        
        // Badge de estado
        const badgeEstado = `
            <span class="badge ${estaCompleto ? 'bg-danger' : 'bg-success'}">
                ${estaCompleto ? 'Completo' : `${bloquesFree}/${totalBloques} libres`}
            </span>
        `;
        
        nuevaSala.innerHTML = `
            <div class="card h-100 ${estaCompleto ? 'card-completo' : ''}">
                <img src="${getImagenPorTipo(sala)}" class="card-img-top" alt="${sala.nombre}">
                <div class="card-body">
                    <h5 class="card-title">
                        ${sala.nombre}
                        ${badgeEstado}
                    </h5>
                    <p class="card-text small"><strong>Tipo:</strong> ${sala.tipo}</p>
                    <p class="card-text small"><strong>Edificio:</strong> ${sala.edificio}</p>
                    <p class="card-text small"><strong>Piso:</strong> ${sala.piso}</p>
                    <p class="card-text small"><strong>Capacidad:</strong> ${sala.capacidad}</p>
                    <p class="card-text small">${sala.caracteristicas.map(c => 
                        `<span class="badge bg-secondary">${c}</span>`
                    ).join(" ")}</p>
                    <button 
                        class="btn btn-sm w-100 btn-reservar ${estaCompleto ? 'btn-secondary' : 'btn-primary'}"
                        data-id="${sala.id}"
                        ${estaCompleto ? 'disabled' : ''}
                    >
                        ${estaCompleto ? 'No disponible' : 'Reservar'}
                    </button>
                </div>
            </div>
        `;
        contenedorTarjetas.appendChild(nuevaSala);
    });
    
    generarPaginacion();
    paginaActual = numeroPagina;
}
 
function generarPaginacion() {
    const totalPaginas = Math.ceil(salasFiltradas.length / TARJETAS_POR_PAGINA);
 
    let paginacionDiv = document.querySelector('.paginacion');
    if (paginacionDiv) paginacionDiv.remove();
 
    // Si todo cabe en una sola página, no tiene sentido mostrar controles de paginación.
    if (totalPaginas <= 1) return;
 
    let paginacionHTML = '<div class="paginacion">';
 
    if (paginaActual > 1) {
        paginacionHTML += `<button onclick="mostrarPagina(${paginaActual - 1})" class="btn-paginacion">← Anterior</button>`;
    }
 
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === paginaActual) {
            paginacionHTML += `<span class="pagina-actual">${i}</span>`;
        } else {
            paginacionHTML += `<button onclick="mostrarPagina(${i})" class="btn-paginacion">${i}</button>`;
        }
    }
 
    if (paginaActual < totalPaginas) {
        paginacionHTML += `<button onclick="mostrarPagina(${paginaActual + 1})" class="btn-paginacion">Siguiente →</button>`;
    }
 
    paginacionHTML += '</div>';
 
    contenedorTarjetas.insertAdjacentHTML('afterend', paginacionHTML);
}
 
function aplicarFiltros() {
    const busqueda = (document.getElementById("filtro-busqueda")?.value || "").toLowerCase();
    const tipo = document.getElementById("filtro-tipo")?.value || "";
    const edificio = document.getElementById("filtro-edificio")?.value || "";
    const capacidad = Number(document.getElementById("filtro-capacidad")?.value) || 0;
    
    salasFiltradas = salas.filter(sala =>
        (!busqueda || sala.nombre.toLowerCase().includes(busqueda)) &&
        (!tipo || sala.tipo === tipo) &&
        (!edificio || sala.edificio === edificio) &&
        (sala.capacidad >= capacidad)
    );
    
    paginaActual = 1;
    mostrarPagina(1);
}
 
function llenarSelects() {
    const selectTipo = document.getElementById("filtro-tipo");
    const selectEdificio = document.getElementById("filtro-edificio");
    
    if(selectTipo) {
        const tipos = [...new Set(salas.map(s => s.tipo))];
        tipos.forEach(tipo => {
            const opcion = document.createElement("option");
            opcion.value = tipo;
            opcion.textContent = tipo;
            selectTipo.appendChild(opcion);
        });
    }
 
    if(selectEdificio) {
        const edificios = [...new Set(salas.map(s => s.edificio))].sort();
        edificios.forEach(edificio => {
            const opcion = document.createElement("option");
            opcion.value = edificio;
            opcion.textContent = `Edificio ${edificio}`;
            selectEdificio.appendChild(opcion);
        });
    }
}
 
function obtenerFechaFiltro() {
    const inputFecha = document.getElementById("filtro-fecha");
    return inputFecha ? inputFecha.value || fechaHoy() : fechaHoy();
}
 
function abrirModalReserva(espacioId) {
    const espacio = salas.find(s => s.id === espacioId);
    if(!espacio) return;
    
    document.getElementById("reserva-espacio-id").value = espacioId;
    document.getElementById("ventana-titulo").textContent = `Reservar - ${espacio.nombre}`;
    
    let fechaActual = obtenerFechaFiltro();
    // Asegurar que la fecha esté dentro del rango permitido
    if(fechaActual < fechaHoy()) fechaActual = fechaHoy();
    if(fechaActual > fechaManana()) fechaActual = fechaManana();
    
    document.getElementById("reserva-fecha").value = fechaActual;
    document.getElementById("reserva-fecha").min = fechaHoy();
    document.getElementById("reserva-fecha").max = fechaManana();
    
    mostrarBloquesDisponibles(espacioId, fechaActual);
    ventanaReserva.show();
}
 
function mostrarBloquesDisponibles(espacioId, fecha) {
    const contenedor = document.getElementById("grilla-bloques");
    contenedor.innerHTML = "";
    bloqueSeleccionado = null;
    
    bloquesDisponibles(espacioId, fecha).forEach(({bloque, tomado}) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = `btn btn-sm ${tomado ? "btn-secondary" : "btn-outline-primary"}`;
        boton.textContent = bloque.replace(":00", "").replace("-", "–");
        boton.disabled = tomado;
        
        if(!tomado) {
            boton.addEventListener("click", () => {
                document.querySelectorAll("#grilla-bloques button").forEach(b => b.classList.remove("active"));
                boton.classList.add("active");
                bloqueSeleccionado = bloque;
                document.getElementById("err-bloque").classList.add("d-none");
            });
        }
        contenedor.appendChild(boton);
    });
}
 
function limpiarErrores() {
    ["reserva-nombre", "reserva-correo", "reserva-rut", "reserva-fecha"].forEach(id => {
        const elem = document.getElementById(id);
        if(elem) elem.classList.remove("is-invalid");
    });
    document.getElementById("err-bloque").classList.add("d-none");
}
 
function marcarError(inputId, errorId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if(input) input.classList.add("is-invalid");
    if(error) {
        error.textContent = mensaje;
        error.classList.remove("d-none");
    }
}
 
function validarFormularioReserva() {
    limpiarErrores();
    let errores = {};
    
    const fecha = document.getElementById("reserva-fecha").value;
    const nombre = document.getElementById("reserva-nombre").value;
    const correo = document.getElementById("reserva-correo").value;
    const rut = document.getElementById("reserva-rut").value;
    const espacioId = Number(document.getElementById("reserva-espacio-id").value);
    
    // Validar fecha
    if(!REGLAS_VALIDACION.fecha(fecha)) {
        errores.fecha = MENSAJES_ERROR.fecha;
    }
    
    // Validar bloque seleccionado
    if(!bloqueSeleccionado) {
        errores.bloque = MENSAJES_ERROR.bloque;
    }
    
    // Validar nombre
    if(!REGLAS_VALIDACION.nombre(nombre)) {
        errores.nombre = MENSAJES_ERROR.nombre;
    }
    
    // Validar correo
    if(!REGLAS_VALIDACION.correo(correo)) {
        errores.correo = MENSAJES_ERROR.correo;
    }
    
    // Validar RUT
    if(!REGLAS_VALIDACION.rut(rut)) {
        errores.rut = MENSAJES_ERROR.rut;
    }
    
    // Validaciones condicionales (solo si pasó validaciones básicas)
    if(!errores.rut && estudianteYaReservoEseDia(rut, fecha)) {
        errores.rut = MENSAJES_ERROR.rutDuplicado;
    }
    
    if(!errores.bloque && bloqueEstaTomado(espacioId, fecha, bloqueSeleccionado)) {
        errores.bloque = MENSAJES_ERROR.bloqueOcupado;
        mostrarBloquesDisponibles(espacioId, fecha);
    }
    
    // Mostrar errores
    if(Object.keys(errores).length > 0) {
        if(errores.fecha) marcarError("reserva-fecha", "err-fecha", errores.fecha);
        if(errores.nombre) marcarError("reserva-nombre", "err-nombre", errores.nombre);
        if(errores.correo) marcarError("reserva-correo", "err-correo", errores.correo);
        if(errores.rut) marcarError("reserva-rut", "err-rut", errores.rut);
        if(errores.bloque) {
            document.getElementById("err-bloque").textContent = errores.bloque;
            document.getElementById("err-bloque").classList.remove("d-none");
        }
        return false;
    }
    
    return true;
}
 
function configurarFormularioReserva() {
    const form = document.getElementById("form-reserva");
    if(!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if(!validarFormularioReserva()) return;
        
        // Crear reserva
        const espacioId = Number(document.getElementById("reserva-espacio-id").value);
        const fecha = document.getElementById("reserva-fecha").value;
        const nombre = document.getElementById("reserva-nombre").value.trim();
        const correo = document.getElementById("reserva-correo").value.trim();
        const rut = document.getElementById("reserva-rut").value.trim();
        
        const espacio = salas.find(s => s.id === espacioId);
        
        reservas.push({
            id: Date.now(),
            espacioId,
            nombreSolicitante: nombre,
            correo,
            rut,
            fecha,
            bloque: bloqueSeleccionado
        });
        
        guardarReservas();
        ventanaReserva.hide();
        form.reset();
        bloqueSeleccionado = null;
        
        mostrarAviso(`✓ Reserva confirmada: ${espacio.nombre}`);
        mostrarPagina(paginaActual);
    });
}
 
function configurarVentanaReserva() {
    ventanaReserva = new bootstrap.Modal(document.getElementById("ventana-reserva"));
    
    // Delegación de eventos optimizada
    document.addEventListener("click", (e) => {
        const boton = e.target.closest(".btn-reservar");
        if(boton && !boton.disabled) {
            abrirModalReserva(Number(boton.dataset.id));
        }
    });
    
    // Listener para cambios de fecha
    const fechaInput = document.getElementById("reserva-fecha");
    if(fechaInput) {
        fechaInput.addEventListener("change", () => {
            const espacioId = Number(document.getElementById("reserva-espacio-id").value);
            mostrarBloquesDisponibles(espacioId, fechaInput.value);
        });
    }
}
 
document.addEventListener("DOMContentLoaded", () => {
    llenarSelects();
    configurarVentanaReserva();
    configurarFormularioReserva();
 
    // Evita que la barra de filtros (es un <form>) recargue la página
    // si el usuario presiona Enter dentro de algún input (ej: búsqueda).
    document.getElementById("barra-filtros")?.addEventListener("submit", (e) => {
        e.preventDefault();
    });
 
    // Configurar listeners de filtros
    const filtros = [
        { id: "filtro-busqueda", evento: "input" },
        { id: "filtro-tipo", evento: "change" },
        { id: "filtro-edificio", evento: "change" },
        { id: "filtro-capacidad", evento: "change" },
        { id: "filtro-fecha", evento: "change" }
    ];
    
    filtros.forEach(({id, evento}) => {
        const elem = document.getElementById(id);
        if(elem) {
            elem.addEventListener(evento, aplicarFiltros);
        }
    });
    
    // Inicializar fecha
    const fechaInput = document.getElementById("filtro-fecha");
    if(fechaInput) {
        fechaInput.value = fechaHoy();
        fechaInput.min = fechaHoy();
        fechaInput.max = fechaManana();
    }
    
    salasFiltradas = salas;
    mostrarPagina(1);
});