# sistema-agenda-salas-universitario

Sistema web de gestión y reserva de espacios universitarios para la 
Universidad Andrés Bello.
 
Status: ACTIVO
Versión: 1.0.0
Licencia: MIT

Contenidos
 
1. Problemática
2. Solución
3. Características
4. Tecnologías
5. Instalación
6. Uso
7. Estructura del proyecto
8. Funcionalidades técnicas
9. Integrantes
10. Contacto
 
Problemática
 
En la Universidad Andrés Bello existe la necesidad de:
 
- Falta de visibilidad: Los estudiantes y académicos no conocen qué espacios 
  están disponibles
 
- Conflictos de reserva: Múltiples usuarios pueden reservar el mismo espacio 
  al mismo tiempo
 
- Falta de organización: No existe un sistema centralizado para gestionar 
  reservas
 
- Información dispersa: Los datos sobre disponibilidad están en múltiples 
  lugares
 
- Proceso manual: Reservar espacios requería contactar directamente con 
  administración
 
Esto genera:
• Pérdida de tiempo de estudiantes
• Conflictos entre usuarios
• Uso ineficiente de espacios
• Falta de registro histórico de reservas
 
Solución
 
ReservaUNAB es una aplicación web que permite:
 
✓ Visualizar espacios disponibles - Catálogo completo de salas, laboratorios 
  y espacios de estudio
 
✓ Filtros inteligentes - Buscar por nombre, tipo, edificio, capacidad y fecha
 
✓ Reservas en línea - Sistema completo de reserva con validación robusta
 
✓ Gestión de reservas - Ver, modificar y cancelar tus reservas
 
✓ Validaciones rigurosas - Prevención de datos inválidos y conflictos de 
  horario
 
✓ Diseño responsivo - Funciona en móvil, tablet y desktop
 
✓ Datos persistentes - Las reservas se guardan localmente en el navegador
 
Características principales:
 
3.1 EXPLORACIÓN DE ESPACIOS
- Visualización en grilla de todas las salas disponibles
- Información completa: nombre, tipo, ubicación, piso, capacidad
- Características especiales (WiFi, proyector, aire acondicionado, etc.)
- Badges de estado (disponible/completo)
- Imágenes descriptivas de cada espacio
 
3.2 SISTEMA DE FILTROS
- Búsqueda por nombre - Encuentra salas por nombre o característica
- Filtro por tipo - Clases, Laboratorios, Estudio, Reunión
- Filtro por edificio - A, B, C
- Filtro por capacidad - Encuentra salas con capacidad mínima
- Filtro por fecha - Consulta disponibilidad para hoy o mañana
- Actualizaciones en tiempo real - Los resultados se actualizan al cambiar 
  filtros
 
3.3 SISTEMA DE RESERVAS
- Modal interactivo - Formulario limpio y fácil de usar
- Selector de horarios - Visualización clara de bloques disponibles y ocupados
- 13 franjas horarias - De 08:00 a 21:00 en bloques de 1 hora
- Validación completa - RUT, correo, nombre, fecha y horario
- Confirmación visual - Aviso flotante al confirmar reserva
 
3.4 VALIDACIONES RIGUROSAS
- RUT chileno - Algoritmo módulo 11 con dígito verificador
- Email válido - Validación de formato con regex
- Nombre requerido - Mínimo 3 caracteres
- Horario específico - Impide reservar si ya tienes ese horario
- Fecha limitada - Solo permite hoy o mañana
- Feedback visual - Errores marcados en rojo con mensajes claros
 
3.5 GESTIÓN DE RESERVAS
- Página "Mis Reservas" - Ve todas tus reservas
- Información detallada - Sala, edificio, piso, fecha, horario, datos 
  solicitante
- Cancelación de reservas - Cancela reservas futuras en cualquier momento
- Estado visual - Badge "Pasada" para reservas del pasado
- Confirmación de cancelación - Modal para evitar cambios accidentales
 
3.6 EXPERIENCIA DE USUARIO
- Paginación - Grilla de 6 salas por página
- Diseño adaptable - Mobile-first, responsive en todos los tamaños
- Identidad visual UNAB - Colores corporativos (rojo y oro)
- Animaciones suaves - Transiciones de 200ms para hover effects
- Accesibilidad - ARIA labels, roles semánticos, contraste de colores
 
Tecnologías utulizadas:
 
FRONTEND:
- HTML5 - Estructura semántica del proyecto
- CSS3 - Diseño visual, responsive, variables CSS
- JavaScript (Vanilla) - Lógica de aplicación, manipulación DOM
- Bootstrap 5 - Sistema de grillas, componentes, utilidades
 
PERSISTENCIA:
- localStorage - Almacenamiento de reservas en navegador
- JSON - Serialización de datos
 
HERRAMIENTAS:
- VS Code - Editor de código
- Git - Control de versiones
- GitHub - Repositorio remoto
 
NO INCLUIDO (por requisitos):
- Frameworks (React, Vue, Angular)
- Backend (Node.js, Python, etc.)
- Base de datos (MongoDB, PostgreSQL, etc.)
- Bundlers (Webpack, Vite, etc.)
 
Instalación:
 
REQUISITOS PREVIOS:
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- No requiere Node.js ni instalación de dependencias
 
PASOS:
 
1. Clonar el repositorio
   $ git clone https://github.com/tu-usuario/reserva-unab.git
   $ cd reserva-unab
 
2. Iniciar servidor local (opcional pero recomendado)
   
   Con Python 3:
   $ python -m http.server 8000
   
   Con Python 2:
   $ python -m SimpleHTTPServer 8000
   
   Con Node.js (si tienes http-server instalado):
   $ http-server -p 8000
   
   Con Live Server en VS Code:
   - Click derecho en index.html → "Open with Live Server"
 
3. Abrir en navegador
   http://localhost:8000
 
   O directamente doble-click en index.html (sin servidor local)
 
Cómo usar la aplicación:
 
6.1 EXPLORAR ESPACIOS
1. Abre index.html
2. Verás una grilla con todas las salas disponibles
3. Usa los filtros en la parte superior:
   - Escribe nombre para buscar
   - Selecciona tipo (Clases, Laboratorio, etc.)
   - Elige edificio (A, B, C)
   - Filtra por capacidad
   - Selecciona fecha (hoy o mañana)
 
6.2 HACER UNA RESERVA
1. Haz clic en el botón "Reservar" de cualquier sala
2. Se abre un modal con:
   - Nombre de la sala
   - Selector de fecha
   - Grilla de horarios
   - Formulario de datos
3. Completa:
   - Selecciona un horario (azul = disponible, gris = ocupado)
   - Ingresa tu nombre (mínimo 3 caracteres)
   - Ingresa tu correo (formato válido)
   - Ingresa tu RUT (con dígito verificador correcto)
4. Haz clic en "Confirmar reserva"
5. Verás un aviso verde confirmando la reserva
 
6.3 VER TUS RESERVAS
1. Haz clic en "Mis Reservas" en la barra superior
2. Se muestran todas tus reservas en tarjetas
3. Para las reservas futuras:
   - Haz clic en "Cancelar reserva"
   - Confirma en el modal
   - La reserva se cancela inmediatamente
 
6.4 DATOS DE EJEMPLO (para pruebas)
RUT válido:     12.345.678-5
Email:          usuario@unab.cl
Nombre:         Juan Pérez
Fecha:          Hoy o mañana (automático)
Horarios:       08:00 a 21:00 (bloques de 1 hora)
 
Estructura del proyecto:
 
reserva-unab/
├── index.html              # Página principal (explorar y reservar)
├── reservas.html           # Página de gestión de reservas
├── README.md               # Documentación
│
├── js/
│   ├── index.js            # Lógica de página principal
│   ├── reservas.js         # Lógica de gestión de reservas
│   └── salas.js            # Datos de salas y funciones auxiliares
│
├── css/
│   ├── styles.css          # Variables y estilos globales
│   ├── index.css           # Estilos de página principal
│   ├── filtros.css         # Estilos de filtros
│   └── reservas.css        # Estilos de página de reservas
│
└── img/
    └── salas/              # Imágenes descriptivas de espacios
        ├── sala-clases.jpg
        ├── laboratorio.jpg
        ├── sala-estudio.jpg
        └── sala-reunion.jpg
 
DESCRIPCIÓN DE ARCHIVOS PRINCIPALES:
 
index.html
- Página de inicio y exploración
- Grilla de salas con filtros
- Modal para crear reservas
- Lógica de búsqueda y filtrado
 
reservas.html
- Página de gestión de reservas
- Lista de reservas personales
- Funcionalidad de cancelación
- Estado de reservas (futuras/pasadas)
 
js/salas.js
- Base de datos de 20 salas (3 edificios)
- Funciones de validación (RUT, email, fecha)
- Funciones auxiliares (fechas, almacenamiento)
- Gestión de localStorage
 
js/index.js
- Lógica de filtrado dinámico
- Paginación de salas
- Gestión de modal de reservas
- Validación de formulario
- Manipulación del DOM
 
js/reservas.js
- Carga y renderizado de reservas
- Funcionalidad de cancelación
- Estados de reservas
- Actualización del DOM
 
css/styles.css
- Variables CSS (colores, espaciado)
- Estilos globales
- Tipografía
- Temas corporativos UNAB
 
css/index.css
- Estilos de página principal
- Grilla de salas
- Modal de reservas
- Paginación
 
css/filtros.css
- Estilos del panel de filtros
- Inputs y selects
- Responsive en móvil
 
Funcionalidades técnicas
 
8.1 VALIDACIONES IMPLEMENTADAS
 
RUT Chileno (Módulo 11)
- Validación con algoritmo oficial chileno
- Verifica formato y dígito verificador
- Ejemplo: 12.345.678-5 → válido
 
Email
- Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Verifica formato básico pero válido
 
Horario Específico
- Impide reservar mismo horario dos veces
- Pero permite múltiples reservas en diferentes horarios
- Lógica de negocio correcta
 
Fecha Limitada
- Solo permite hoy o mañana
- Validación en cliente
- Rango: desde hoy hasta mañana a las 23:59
 
8.2 PERSISTENCIA DE DATOS
 
Los datos se guardan en localStorage con la clave "reservas_unab":
 
Guardar:
localStorage.setItem("reservas_unab", JSON.stringify(reservas));
 
Cargar:
const reservas = JSON.parse(localStorage.getItem("reservas_unab")) || [];
 
Limitaciones:
- ~5-10MB por dominio
- No sincroniza entre navegadores
- Se borra al limpiar cache
 

Mejoras futuras:
 
Si se continuara este proyecto:
 
- Backend real - Node.js + Express para API
- Base de datos - MongoDB o PostgreSQL para persistencia
- Autenticación - Login con credenciales UNAB
- Email - Confirmaciones por correo
- Notificaciones - Push notifications para cambios
- Admin panel - Gestión de espacios y usuarios
- Calendario - Vista mensual de reservas
- Reportes - Estadísticas de uso de espacios
- Multi-usuario - Cada usuario ve solo sus reservas
- Comentarios - Reseñas de espacios
 
Integrantes:
 
Nombre: Camilo Quintana
Rol: Desarrollador Full Stack
Responsabilidades: Arquitectura general, validaciones, backend lógico
 
Nombre: Axel Antezana
Rol: Desarrollador Frontend
Responsabilidades: Interfaz, CSS, diseño responsivo, UX
 
Contacto:
 
Para preguntas o sugerencias sobre el proyecto:
 
Camilo Quintana - c.quintanagaitan@uandresbello.edu
Axel Antezana - a.antezanapereyra@uandresbello.edu
 
Referencias:
 
- MDN Web Docs - HTML
  https://developer.mozilla.org/es/docs/Web/HTML
 
- MDN Web Docs - CSS
  https://developer.mozilla.org/es/docs/Web/CSS
 
- MDN Web Docs - JavaScript
  https://developer.mozilla.org/es/docs/Web/JavaScript
 
- Bootstrap 5 Documentation
  https://getbootstrap.com/docs/5.0/
 
- Algorithm RUT Chile
  https://www.sii.cl/
 
- Web Accessibility Guidelines (WCAG)
  https://www.w3.org/WAI/WCAG21/quickref/
 


 
Última actualización: Septiembre 2026
Versión: 1.0.0
Estado: Completado y funcional 
 

 
