let ventanaCancelar;
let idReservaACancelar = null;

function obtenerNombreEspacio(espacioId) {
    const espacio = salas.find(s => s.id === espacioId);
    return espacio ? espacio.nombre : "Espacio desconocido";
}

function obtenerEdificioEspacio(espacioId) {
    const espacio = salas.find(s => s.id === espacioId);
    return espacio ? espacio.edificio : "-";
}

function obtenerPisoEspacio(espacioId) {
    const espacio = salas.find(s => s.id === espacioId);
    return espacio ? espacio.piso : "-";
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString + "T00:00");
    return fecha.toLocaleDateString("es-CL", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
    });
}

function mostrarReservas() {
    const contenedor = document.getElementById("lista-reservas");
    const msgVacio = document.getElementById("sin-reservas");
    
    if(!contenedor) return;
    
    contenedor.innerHTML = "";
    
    if(reservas.length === 0) {
        msgVacio.classList.remove("d-none");
        return;
    }
    
    msgVacio.classList.add("d-none");
    
    // Ordenar reservas por fecha y bloque
    const reservasOrdenadas = [...reservas].sort((a, b) => {
        const comparaFecha = a.fecha.localeCompare(b.fecha);
        return comparaFecha !== 0 ? comparaFecha : a.bloque.localeCompare(b.bloque);
    });
    
    reservasOrdenadas.forEach(reserva => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";
        
        const fechaFormato = formatearFecha(reserva.fecha);
        const espacio = salas.find(s => s.id === reserva.espacioId);
        
        // Determinar si la reserva ya pasó
        const hoy = new Date(fechaHoy() + "T00:00").getTime();
        const fechaReserva = new Date(reserva.fecha + "T00:00").getTime();
        const yapaso = fechaReserva < hoy;
        
        col.innerHTML = `
            <div class="card h-100 ${yapaso ? 'card-pasada' : ''}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${obtenerNombreEspacio(reserva.espacioId)}</h5>
                        ${yapaso ? '<span class="badge bg-secondary">Pasada</span>' : ''}
                    </div>
                    
                    <p class="mb-2 small text-muted">
                        <strong>Edificio:</strong> ${obtenerEdificioEspacio(reserva.espacioId)} 
                        | <strong>Piso:</strong> ${obtenerPisoEspacio(reserva.espacioId)}
                    </p>
                    
                    <div class="mb-3 bg-light p-2 rounded">
                        <p class="mb-1"><strong>📅 ${fechaFormato}</strong></p>
                        <p class="mb-0"><strong>🕐 ${reserva.bloque}</strong></p>
                    </div>
                    
                    <hr class="my-2">
                    
                    <div class="small text-muted mb-3">
                        <p class="mb-1"><strong>Solicitante:</strong> ${reserva.nombreSolicitante}</p>
                        <p class="mb-1"><strong>Correo:</strong> <a href="mailto:${reserva.correo}">${reserva.correo}</a></p>
                        <p class="mb-0"><strong>RUT:</strong> ${reserva.rut}</p>
                    </div>
                    
                    ${!yapaso ? `
                        <button class="btn btn-outline-danger btn-sm w-100 btn-cancelar" data-id="${reserva.id}">
                            Cancelar reserva
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        contenedor.appendChild(col);
    });
}

function configurarCancelacion() {
    ventanaCancelar = new bootstrap.Modal(document.getElementById("ventana-cancelar"));
    
    // Delegación de eventos para botones de cancelar
    document.addEventListener("click", (e) => {
        const boton = e.target.closest(".btn-cancelar");
        if(boton) {
            idReservaACancelar = Number(boton.dataset.id);
            
            // Mostrar información de la reserva en el modal
            const reserva = reservas.find(r => r.id === idReservaACancelar);
            if(reserva) {
                const espacio = obtenerNombreEspacio(reserva.espacioId);
                const fecha = formatearFecha(reserva.fecha);
                const hora = reserva.bloque;
                
                const msgDiv = document.getElementById("msg-cancelar");
                if(msgDiv) {
                    msgDiv.innerHTML = `
                        ¿Estás seguro que quieres cancelar esta reserva?<br>
                        <strong>${espacio}</strong> - ${fecha} - ${hora}
                    `;
                }
            }
            
            ventanaCancelar.show();
        }
    });
    
    // Confirmar cancelación
    document.getElementById("btn-confirmar-cancelar").addEventListener("click", () => {
        if(idReservaACancelar === null) return;
        
        const reserva = reservas.find(r => r.id === idReservaACancelar);
        const nombreEspacio = reserva ? obtenerNombreEspacio(reserva.espacioId) : "Reserva";
        
        reservas = reservas.filter(r => r.id !== idReservaACancelar);
        guardarReservas();
        
        idReservaACancelar = null;
        ventanaCancelar.hide();
        
        mostrarReservas();
        mostrarAviso(`✓ Reserva cancelada: ${nombreEspacio}`);
    });
}

// Inicializar cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarReservas();
    configurarCancelacion();
});
