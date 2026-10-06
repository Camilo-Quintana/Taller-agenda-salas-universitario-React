# ReservaUNAB: Reserva de espacios (React)

Aplicación web para consultar y reservar espacios de la **Sede Viña del Mar** de la Universidad Andrés Bello:
salas de clases, laboratorios, salas de estudio, salas de reunión y espacios exteriores.

Taller Evaluado 2 de Desarrollo Web y Móvil (2º semestre 2026). Es la migración a React de la Actividad
Evaluada 1 (HTML, CSS, Bootstrap y JavaScript), que se conserva en la carpeta [`version-1-html/`](version-1-html/).

## Integrantes
- Camilo Quintana.
- Axel Antezana.

## Problemática
En la sede no hay un lugar único para saber qué espacios están libres ni para reservarlos: la información está
dispersa, se producen choques de horario y el proceso depende de consultar en persona.

## Usuarios objetivo
Estudiantes, docentes y organizaciones estudiantiles de la Sede Viña del Mar que necesitan un espacio por una
hora (clases de apoyo, trabajos en grupo, reuniones o actividades al aire libre).

## Funcionalidades
- Catálogo de 24 espacios con imagen, tipo, edificio, piso, capacidad y características.
- Búsqueda por nombre o característica y filtros por tipo, edificio y capacidad. Los filtros se guardan en la URL.
- Disponibilidad del día (hoy o mañana) en cada tarjeta, incluidas reservas simuladas de otros estudiantes.
- Detalle de cada espacio con el pronóstico del clima por hora (Open-Meteo) y aviso de lluvia en espacios exteriores.
- Reserva por bloques de 1 hora (08:00 a 21:00) con validaciones: solo hoy o mañana, horas pasadas bloqueadas,
  horario ocupado y una reserva por día por estudiante.
- Perfil del estudiante (nombre, correo y RUT validado con dígito verificador), que funciona como un inicio de
  sesión simulado.
- "Mis reservas" con estados (Próxima, En curso, Finalizada) y cancelación con confirmación.
- Diseño responsive y accesible.

## Diseño

### Mapa de navegación
```
                 ┌──────────── Navbar (en todas las páginas) ────────────┐
                 │                     │                                  │
          Espacios (/)        Mis reservas (/mis-reservas)       Mi perfil (/perfil)
                 │                     ▲                                  ▲
       Ver detalle                     │                                  │
                 ▼                     │                                  │
   Detalle del espacio (/espacios/:id) ┴── "Ver mis reservas"             │
                 └──────────── "Ir a mi perfil" (si no hay perfil) ───────┘

   Cualquier otra ruta → Página no encontrada
```

### Flujo principal
Catálogo → Ver detalle → Elegir día → Elegir horario (con su clima) → Confirmar → Ventana de confirmación →
Mis reservas → (opcional) Cancelar.

### Componentes que se repiten
Tarjetas (`EspacioCard`, `ReservaCard`), alertas (`Alerta`), ventana de confirmación (`Ventana`), campos de
formulario (`CampoTexto`), mensajes de "no hay resultados" (`MensajeVacio`) y selector de día (`SelectorDia`).

### Criterios visuales
- Colores institucionales de la versión 1, definidos una sola vez en `src/styles/variables.css`
  (primario `#7a1128`, acento `#d4a72c`, fondo `#f5f5f7`).
- Tipografía del sistema (Segoe UI, system-ui, Roboto).
- Bootstrap para la grilla y los formularios, adaptado a nuestros colores con sus variables CSS.
- Estados con color: libre (verde), ocupado o pasado (gris), seleccionado (color primario).

## Tecnologías
React 19, Vite 8, React Router 7, Bootstrap 5.3 (solo CSS), Bootstrap Icons, JavaScript, CSS3, Fetch API, JSON,
localStorage y oxlint.

## Cómo ejecutar
Requisito: Node.js 20.19 o superior (o 22.12 o superior).

```bash
npm install
npm run dev
```

Luego abrir http://localhost:5173. Otros comandos:

```bash
npm run build     # versión de producción en dist/
npm run preview   # sirve la versión de producción
npm run lint      # revisa el código (no muestra nada si está todo bien)
```

**Datos para probar:** en *Mi perfil* usar, por ejemplo, el RUT `12.345.678-5`. Para dejar la demo como al
inicio: en *Mi perfil*, botón *Restablecer datos de ejemplo*.

## Estructura
```
├── version-1-html/     versión del Taller 1 (HTML, CSS, Bootstrap y JavaScript)
└── src/
    ├── main.jsx            Bootstrap, íconos, estilos y Router
    ├── App.jsx             rutas + estado compartido (reservas y perfil)
    ├── pages/              Espacios, Detalle, Mis reservas, Perfil, No encontrado
    ├── components/         15 componentes reutilizables (+ su CSS)
    ├── hooks/              useLocalStorage, useReservas, usePerfil, useAhora, useClima
    ├── services/           climaApi.js (Open-Meteo)
    ├── utils/              validaciones, fechas, reglas de reserva, datos de ejemplo, imágenes, textos
    ├── data/               espacios, bloques, sede y reservas de ejemplo (JSON)
    ├── assets/images/      logo y fotos de los espacios
    └── styles/             variables.css y global.css
```

## API pública: Open-Meteo

| | |
|---|---|
| Nombre | Open-Meteo: Weather Forecast API |
| Documentación | https://open-meteo.com/en/docs |
| Endpoint | `https://api.open-meteo.com/v1/forecast` |
| Método | `GET` |
| Parámetros | `latitude=-33.02`, `longitude=-71.55` (Viña del Mar), `hourly=temperature_2m,precipitation_probability,weather_code`, `timezone=America/Santiago`, `start_date` y `end_date` = día elegido (`AAAA-MM-DD`) |
| Datos usados | `hourly.time`, `hourly.temperature_2m` (°C), `hourly.precipitation_probability` (%), `hourly.weather_code` (código WMO) |
| Dónde se muestran | Detalle del espacio: panel de clima del día, clima de cada horario y aviso de lluvia en espacios exteriores |
| Autenticación | No requiere clave |
| Límites | Uso gratuito no comercial: menos de 10.000 llamadas al día, 5.000 por hora y 600 por minuto |

### Justificación
En un espacio exterior (patio, terraza o cancha) la lluvia cambia la decisión: con el pronóstico por hora el
estudiante puede elegir otro horario, otro día o un espacio interior antes de reservar. Por ejemplo, el 2 de octubre
de 2026 había llovizna con 94% de probabilidad a las 17:00, y el 3 de octubre estaba despejado (0%).

### Transformación de la respuesta
La API entrega arreglos paralelos (`time[]`, `temperature_2m[]`, etc.). `services/climaApi.js` los convierte en
un objeto por hora (`"08:00": { temperatura, probLluvia, tipo, descripcion }`) solo para las horas de los bloques,
redondea la temperatura, traduce los códigos WMO a 9 tipos en español y calcula un resumen del día.

### Si la API falla
El panel de clima muestra "No pudimos obtener el pronóstico. Puedes reservar igual." y un botón **Reintentar**.
Si el problema es la conexión, el detalle dice "Sin conexión con el servicio del clima. Revisa tu internet.";
si la API responde con un error, el detalle muestra su código y motivo. Los horarios se muestran sin clima.
**La reserva nunca depende de la API.** Si se cambia de día o se sale de la vista mientras se espera la respuesta,
la petición se cancela.

### Licencia y atribución
Los datos se ofrecen bajo **CC BY 4.0**. La app muestra "Weather data by Open-Meteo.com" junto a cada lugar donde
aparece el clima y en el pie de página. Los datos se **adaptan**: se redondean y los códigos se traducen al español.

## Flujo de trabajo con Git
- `main`: versiones entregables (la v1 del Taller 1 y la v1.0.0 de este taller, con su tag).
- `develop`: integración del trabajo.
- Una rama `feature/` por funcionalidad (migración, layout, datos, catálogo, perfil, clima, detalle, mis reservas),
  integrada en `develop` mediante Pull Request.
- `release/1.0.0`: preparación de la entrega, integrada en `main` y en `develop`.

## Uso de Inteligencia Artificial

**Herramienta:** Claude (Anthropic).

**Para qué se usó:**
- **Diseño:** analizar la consigna y proponer los wireframes, el mapa de navegación y el árbol de componentes a
  partir de las decisiones del equipo.
- **Migración a React:** convertir la página del Taller 1 (HTML, CSS, Bootstrap y JavaScript) a componentes,
  páginas y rutas de React.
- **Implementación de partes específicas:**
  - el hook `useClima` y el servicio de la API (estados de carga y error, reintento y cancelación de peticiones),
  - los filtros y la búsqueda del catálogo guardados en la URL,
  - el manejo de fechas y zona horaria (`fechas.js`),
  - el componente `Ventana` (ventana de confirmación hecha en React).
- **Depuración:** encontrar y corregir errores en el código en general.
- **Investigación:** verificar la API de Open-Meteo (parámetros, formato de respuesta, límites y licencia).
- **Git:** planificar las ramas, los commits y los Pull Requests del repositorio.

**Ejemplos de consultas** (los prompts originales no se guardaron; los siguientes son reconstrucciones
representativas del tipo de instrucciones que usamos, salvo el último, que es textual):
- Migración: "Ayúdame a migrar mi página de reservas hecha en HTML, CSS, Bootstrap y JavaScript a React con Vite,
  separando páginas, componentes reutilizables, hooks y datos en JSON. Explica por qué divides la interfaz en esos
  componentes y qué datos pasa cada uno por props."
- `useClima`: "Crea un hook useClima para mostrar el pronóstico por hora de Open-Meteo, con estados de carga, error
  y reintento, que no muestre el clima de un día equivocado si el usuario cambia de día rápido. Explica por qué usas
  useEffect y para qué sirve la función de limpieza."
- Filtros: "Quiero que los filtros del catálogo no se pierdan al entrar al detalle y volver. ¿Cómo lo hago con React
  Router? Explica por qué conviene calcular los resultados en cada render en vez de guardarlos en un estado."
- Fechas: "Guardo las fechas como AAAA-MM-DD y uso new Date(), pero a veces las reservas quedan en el día anterior.
  ¿Por qué pasa esto en Chile y cómo lo corrijo?"
- `Ventana`: "Necesito una ventana de confirmación para cancelar reservas. ¿Conviene usar el modal de Bootstrap o
  hacerlo en React? Hazlo accesible (que se cierre con Escape y con un clic afuera) y explica cada decisión."
- Depuración: "Al pasar el mouse sobre el horario elegido el texto se vuelve ilegible, y los campos y las tarjetas
  se ven grises en vez de blancos. ¿Por qué pasa y cómo lo corrijo sin usar !important?"
- Git (textual): "Quiero documentar el proyecto con Git subiendo por partes día a día, con ramas, como pide la guía
  del taller."

**Resultado:** código de los componentes, hooks y páginas de la versión React; explicaciones de los errores
encontrados; y un plan de ramas y commits para el repositorio.

**Modificación humana:**
- Las reglas de negocio, los datos de los espacios, los colores y las validaciones del RUT vienen de nuestra
  versión del Taller 1.
- Ejecutamos la aplicación y probamos cada flujo en el navegador (reservar, cancelar, perfil, error de la API sin
  conexión, responsive y teclado); revisamos que el linter y el build no tuvieran errores; comprobamos las
  validaciones con casos conocidos (RUT con dígito verificador correcto e incorrecto).
- Esas pruebas encontraron problemas que se corrigieron antes de entregar: el horario elegido se volvía ilegible al
  pasar el mouse, y los campos y las tarjetas quedaban grises en vez de blancos.
- Al integrar la versión del Taller 1 en el repositorio, el linter empezó a revisar ese código antiguo y fallaba;
  decidimos excluir la carpeta `version-1-html/` del linter en vez de modificar la versión ya entregada.

**Aprendizaje:**
- `useEffect` se usa solo para sincronizarse con algo externo a React (la API del clima, el reloj, la tecla
  Escape), y su función de limpieza evita efectos que quedan "colgando": en `useClima` cancela la petición
  anterior con `AbortController` para no mostrar el clima de un día equivocado.
- Si un dato se puede calcular a partir de otros (los resultados filtrados, la página actual), es mejor calcularlo
  en cada render que guardarlo en un estado, porque dos copias del mismo dato se pueden desincronizar.
- Guardar los filtros en la URL permite volver del detalle sin perderlos; `replace: true` evita llenar el
  historial del navegador.
- `new Date("AAAA-MM-DD")` interpreta la fecha en UTC, y en Chile (UTC−3) puede quedar en el día anterior; por eso
  construimos la fecha con año, mes y día por separado.
- El JavaScript de Bootstrap modifica el DOM directamente y choca con React; por eso la ventana de confirmación
  se abre y se cierra con estado.
- Para entender el código asistido, lo revisamos archivo por archivo y le pedimos a la IA que explicara cada
  decisión, no solo que generara el código.

## Limitaciones conocidas
- Los datos viven solo en el navegador (localStorage): no se comparten entre dispositivos y las reservas de
  otros estudiantes son simuladas.
- El perfil no es una autenticación real: cualquier RUT válido puede usarse.
- La fecha y la hora se toman del reloj del dispositivo.
- El clima necesita conexión a internet; el pronóstico es a escala de ciudad (un punto cercano a Viña del Mar) y
  está sujeto a los límites de la API gratuita.
- Solo considera una sede.
