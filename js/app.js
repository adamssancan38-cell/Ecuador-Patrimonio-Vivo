/**
 * app.js — Lógica e interacción del sitio Ecuador Patrimonio Vivo
 * ─────────────────────────────────────────────────────────────
 * DEPENDE DE: data.js (debe cargarse antes en el HTML)
 *
 * ESTRUCTURA:
 *   1. Estado de la aplicación
 *   2. Inicialización y evento DOMContentLoaded
 *   3. Renderizado de tarjetas
 *   4. Filtros (región, provincia, búsqueda)
 *   5. Modal de detalle del lugar
 *   6. Modo oscuro
 *   7. Lugar aleatorio
 *   8. Utilidades
 */

/* ═══════════════════════════════════════════════════════════════
   1. ESTADO DE LA APLICACIÓN
   ═══════════════════════════════════════════════════════════════ */
const Estado = {
  regionActiva: "todas",      // región seleccionada actualmente
  provinciaActiva: "todas",   // provincia seleccionada
  textoBusqueda: "",          // texto del buscador
  modoOscuro: false,          // modo oscuro activado
  lugarAbierto: null          // id del lugar en el modal
};

/* ═══════════════════════════════════════════════════════════════
   2. INICIALIZACIÓN
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  // Recuperar preferencia de modo oscuro guardada
  if (localStorage.getItem("modoOscuro") === "true") {
    Estado.modoOscuro = true;
    document.documentElement.classList.add("modo-oscuro");
    actualizarBotonModo();
  }

  // Construir el selector de provincias
  construirSelectorProvincias();

  // Renderizar las tarjetas iniciales
  renderizarTarjetas(LUGARES);

  // Adjuntar listeners de eventos
  adjuntarEventos();

  // Contador de lugares
  actualizarContador(LUGARES.length);

  // Cerrar modal con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });
});

/* ═══════════════════════════════════════════════════════════════
   3. RENDERIZADO DE TARJETAS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Renderiza las tarjetas en el grid principal.
 * @param {Array} lugares - Array de objetos de lugar a mostrar
 */
function renderizarTarjetas(lugares) {
  const grid = document.getElementById("grid-lugares");
  if (!grid) return;

  grid.innerHTML = "";

  if (lugares.length === 0) {
    grid.innerHTML = `
      <div class="sin-resultados" role="status" aria-live="polite">
        <span class="sin-resultados__icono" aria-hidden="true">🔍</span>
        <p class="sin-resultados__texto">No se encontraron lugares con ese criterio.</p>
        <button class="btn btn--primario" onclick="limpiarFiltros()">Limpiar filtros</button>
      </div>`;
    actualizarContador(0);
    return;
  }

  const fragmento = document.createDocumentFragment();

  lugares.forEach(lugar => {
    const tarjeta = crearTarjeta(lugar);
    fragmento.appendChild(tarjeta);
  });

  grid.appendChild(fragmento);
  actualizarContador(lugares.length);
  window.Resenas?.pintarTarjetas();   // ★ promedio (resenas.js)
}

/**
 * Crea el elemento HTML de una tarjeta de lugar.
 * @param {Object} lugar - Objeto de lugar del data.js
 * @returns {HTMLElement}
 */
function crearTarjeta(lugar) {
  const article = document.createElement("article");
  article.className = "tarjeta";
  article.setAttribute("data-id", lugar.id);
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `Ver detalles de ${lugar.nombre}`);

  // Imagen o placeholder CSS
  const imagenHTML = generarImagenOPlaceholder(lugar, "tarjeta");

  // Badge de región
  const badgeClass = `badge badge--${slugRegion(lugar.region)}`;

  article.innerHTML = `
    <div class="tarjeta__imagen-wrap">
      ${imagenHTML}
      <span class="${badgeClass}">${lugar.region}</span>
    </div>
    <div class="tarjeta__cuerpo">
      <h3 class="tarjeta__nombre">${lugar.nombre}</h3>
      <p class="tarjeta__provincia">
        <svg class="icono-inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        ${lugar.provincia}
      </p>
      <p class="tarjeta__valoracion" data-valoracion="${lugar.id}"></p>
      <p class="tarjeta__descripcion">${lugar.descripcion.substring(0, 110)}${lugar.descripcion.length > 110 ? "…" : ""}</p>
      <div class="tarjeta__pie">
        <span class="tarjeta__patrimonio-tag" aria-label="Tiene patrimonio cultural asociado">🏛️ Patrimonio</span>
        <button class="btn btn--secundario btn--pequeño" onclick="abrirModal('${lugar.id}')">
          Ver más
        </button>
      </div>
    </div>`;

  // Abrir modal al hacer clic o Enter/Space
  article.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      abrirModal(lugar.id);
    }
  });
  article.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirModal(lugar.id);
    }
  });

  return article;
}

/* ═══════════════════════════════════════════════════════════════
   4. FILTROS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Adjunta todos los listeners de la interfaz.
 */
function adjuntarEventos() {

  // Buscador — input con debounce de 300ms
  const buscador = document.getElementById("buscador");
  if (buscador) {
    let timeout;
    buscador.addEventListener("input", (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        Estado.textoBusqueda = e.target.value.trim().toLowerCase();
        aplicarFiltros();
      }, 300);
    });
    // Botón limpiar buscador
    const btnLimpiarBusqueda = document.getElementById("btn-limpiar-busqueda");
    if (btnLimpiarBusqueda) {
      btnLimpiarBusqueda.addEventListener("click", () => {
        buscador.value = "";
        Estado.textoBusqueda = "";
        aplicarFiltros();
      });
    }
  }

  // Botones de región
  document.querySelectorAll("[data-region]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-region]").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      Estado.regionActiva = btn.getAttribute("data-region");
      Estado.provinciaActiva = "todas"; // resetear provincia al cambiar región
      construirSelectorProvincias();     // reconstruir provincias filtradas
      aplicarFiltros();
    });
  });

  // Selector de provincia
  const selectProvincia = document.getElementById("select-provincia");
  if (selectProvincia) {
    selectProvincia.addEventListener("change", (e) => {
      Estado.provinciaActiva = e.target.value;
      aplicarFiltros();
    });
  }

  // Botón modo oscuro
  const btnModo = document.getElementById("btn-modo");
  if (btnModo) {
    btnModo.addEventListener("click", toggleModoOscuro);
  }

  // Botón lugar aleatorio
  const btnAleatorio = document.getElementById("btn-aleatorio");
  if (btnAleatorio) {
    btnAleatorio.addEventListener("click", abrirLugarAleatorio);
  }

  // Cerrar modal con clic en overlay
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrarModal();
    });
  }

  // Botón cerrar modal
  const btnCerrar = document.getElementById("modal-cerrar");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarModal);
  }

  // Botón "ir arriba"
  const btnArriba = document.getElementById("btn-arriba");
  if (btnArriba) {
    window.addEventListener("scroll", () => {
      btnArriba.classList.toggle("visible", window.scrollY > 400);
    });
    btnArriba.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Navegación del menú
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const destino = document.getElementById(link.getAttribute("data-nav"));
      if (destino) {
        destino.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Cerrar menú móvil si está abierto
      document.getElementById("menu-movil")?.classList.remove("abierto");
    });
  });

  // Botón menú hamburguesa
  const btnMenu = document.getElementById("btn-menu");
  const menuMovil = document.getElementById("menu-movil");
  if (btnMenu && menuMovil) {
    btnMenu.addEventListener("click", () => {
      const abierto = menuMovil.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", abierto);
    });
  }
}

/**
 * Construye o reconstruye el selector de provincias según la región activa.
 */
function construirSelectorProvincias() {
  const select = document.getElementById("select-provincia");
  if (!select) return;

  // Obtener provincias únicas del array de lugares filtrado por región
  let lugaresBase = LUGARES;
  if (Estado.regionActiva !== "todas") {
    lugaresBase = LUGARES.filter(l => l.region === Estado.regionActiva);
  }

  const provincias = [...new Set(lugaresBase.map(l => l.provincia))].sort();

  select.innerHTML = `<option value="todas">Todas las provincias</option>`;
  provincias.forEach(prov => {
    const opt = document.createElement("option");
    opt.value = prov;
    opt.textContent = prov;
    if (prov === Estado.provinciaActiva) opt.selected = true;
    select.appendChild(opt);
  });
}

/**
 * Aplica todos los filtros activos y re-renderiza las tarjetas.
 */
function aplicarFiltros() {
  let resultado = LUGARES;

  // Filtro por región
  if (Estado.regionActiva !== "todas") {
    resultado = resultado.filter(l => l.region === Estado.regionActiva);
  }

  // Filtro por provincia
  if (Estado.provinciaActiva !== "todas") {
    resultado = resultado.filter(l => l.provincia === Estado.provinciaActiva);
  }

  // Filtro por texto de búsqueda
  if (Estado.textoBusqueda) {
    resultado = resultado.filter(l =>
      l.nombre.toLowerCase().includes(Estado.textoBusqueda) ||
      l.provincia.toLowerCase().includes(Estado.textoBusqueda) ||
      l.region.toLowerCase().includes(Estado.textoBusqueda) ||
      l.descripcion.toLowerCase().includes(Estado.textoBusqueda) ||
      l.patrimonio.toLowerCase().includes(Estado.textoBusqueda)
    );
  }

  renderizarTarjetas(resultado);
}

/**
 * Limpia todos los filtros y muestra todos los lugares.
 */
function limpiarFiltros() {
  Estado.regionActiva = "todas";
  Estado.provinciaActiva = "todas";
  Estado.textoBusqueda = "";

  const buscador = document.getElementById("buscador");
  if (buscador) buscador.value = "";

  document.querySelectorAll("[data-region]").forEach(b => b.classList.remove("activo"));
  document.querySelector('[data-region="todas"]')?.classList.add("activo");

  construirSelectorProvincias();
  aplicarFiltros();
}

/**
 * Actualiza el contador de lugares mostrados.
 * @param {number} cantidad
 */
function actualizarContador(cantidad) {
  const contador = document.getElementById("contador-lugares");
  if (contador) {
    contador.textContent = `${cantidad} lugar${cantidad !== 1 ? "es" : ""} encontrado${cantidad !== 1 ? "s" : ""}`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   5. MODAL DE DETALLE
   ═══════════════════════════════════════════════════════════════ */

/**
 * Abre el modal con la información completa de un lugar.
 * @param {string} id - ID del lugar en LUGARES
 */
function abrirModal(id) {
  const lugar = LUGARES.find(l => l.id === id);
  if (!lugar) return;

  Estado.lugarAbierto = id;

  const overlay = document.getElementById("modal-overlay");
  const contenido = document.getElementById("modal-contenido");
  if (!overlay || !contenido) return;

  // Encontrar relato si existe
  const relatoObj = lugar.relato
    ? RELATOS_EJEMPLO.find(r => r.id === lugar.relato)
    : null;

  // Generar URL de Booking
  const urlBooking = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(lugar.nombre + ", Ecuador")}`;

  // Generar URL de Google Maps
  const urlMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.nombre + " " + lugar.provincia + " Ecuador")}`;

  // Imagen modal (más grande)
  const imagenHTML = generarImagenOPlaceholder(lugar, "modal");

  // Crédito de imagen
  const creditoHTML = lugar.creditoImagen && lugar.creditoImagen !== "POR COMPLETAR"
    ? `<p class="modal__credito">📷 ${lugar.creditoImagen} — ${lugar.licencia}</p>`
    : `<p class="modal__credito modal__credito--pendiente">📷 Fotografía por completar</p>`;

  // Sección de relato
  let relatoHTML = "";
  if (relatoObj) {
    relatoHTML = `
      <section class="modal__relato" aria-label="Voces del lugar">
        <h4 class="modal__subtitulo">
          <span aria-hidden="true">🗣️</span> Voces del lugar
        </h4>
        <div class="modal__relato-caja">
          <span class="modal__relato-etiqueta" role="note">⚠️ Relato ilustrativo</span>
          <blockquote class="modal__cita">
            "${relatoObj.texto}"
          </blockquote>
          <footer class="modal__relato-footer">
            <cite class="modal__narrador">— ${relatoObj.narrador}</cite>
            <p class="modal__fuente"><strong>Fuente:</strong> ${relatoObj.fuente}</p>
          </footer>
        </div>
      </section>`;
  } else {
    relatoHTML = `
      <section class="modal__relato" aria-label="Voces del lugar">
        <h4 class="modal__subtitulo">
          <span aria-hidden="true">🗣️</span> Voces del lugar
        </h4>
        <p class="modal__relato-pendiente">
          Relato de habitante local pendiente de recopilación.<br>
          <small>¿Conoces a alguien de este lugar? <strong>Comparte su historia.</strong></small>
        </p>
      </section>`;
  }

  contenido.innerHTML = `
    <div class="modal__imagen-wrap">
      ${imagenHTML}
      ${creditoHTML}
    </div>

    <div class="modal__info">
      <div class="modal__encabezado">
        <div>
          <span class="badge badge--${slugRegion(lugar.region)} badge--grande">${lugar.region}</span>
          <h2 class="modal__titulo" id="modal-titulo">${lugar.nombre}</h2>
          <p class="modal__ubicacion">
            <svg class="icono-inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <strong>${lugar.provincia}</strong> &bull; ${lugar.region}
          </p>
        </div>
      </div>

      <section aria-label="Descripción">
        <h4 class="modal__subtitulo">
          <span aria-hidden="true">📍</span> Descripción
        </h4>
        <p class="modal__descripcion">${lugar.descripcion}</p>
      </section>

      <section aria-label="Patrimonio cultural">
        <h4 class="modal__subtitulo modal__subtitulo--patrimonio">
          <span aria-hidden="true">🏛️</span> Patrimonio Cultural
        </h4>
        <div class="modal__patrimonio-caja">
          <p>${lugar.patrimonio}</p>
        </div>
      </section>

      ${relatoHTML}

      <section class="modal__resenas" id="resenas-seccion" aria-label="Opiniones de visitantes"></section>

      <div class="modal__acciones" role="group" aria-label="Acciones del lugar">
        <a href="${urlBooking}" target="_blank" rel="noopener noreferrer"
           class="btn btn--booking"
           aria-label="Ver hoteles cercanos a ${lugar.nombre} en Booking.com (abre en nueva pestaña)">
          🏨 Ver hoteles cercanos
        </a>
        <a href="${urlMaps}" target="_blank" rel="noopener noreferrer"
           class="btn btn--mapa"
           aria-label="Ver ${lugar.nombre} en Google Maps (abre en nueva pestaña)">
          🗺️ Ver en el mapa
        </a>
      </div>

      <p class="modal__coordenadas">
        <small>📡 Coordenadas: ${lugar.latitud}°, ${lugar.longitud}°</small>
      </p>
    </div>`;

  // Sección de calificaciones y comentarios (resenas.js)
  window.Resenas?.montar(document.getElementById("resenas-seccion"), lugar.id);

  // Mostrar overlay
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("sin-scroll");

  // Mover foco al botón de cerrar (accesibilidad)
  setTimeout(() => {
    document.getElementById("modal-cerrar")?.focus();
  }, 50);
}

/**
 * Cierra el modal.
 */
function cerrarModal() {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sin-scroll");
  Estado.lugarAbierto = null;
}

/* ═══════════════════════════════════════════════════════════════
   6. MODO OSCURO
   ═══════════════════════════════════════════════════════════════ */

/**
 * Alterna entre modo claro y oscuro.
 */
function toggleModoOscuro() {
  Estado.modoOscuro = !Estado.modoOscuro;
  document.documentElement.classList.toggle("modo-oscuro", Estado.modoOscuro);
  localStorage.setItem("modoOscuro", Estado.modoOscuro);
  actualizarBotonModo();
}

/**
 * Actualiza el ícono y texto del botón de modo.
 */
function actualizarBotonModo() {
  const btn = document.getElementById("btn-modo");
  if (!btn) return;
  btn.innerHTML = Estado.modoOscuro
    ? '<span class="modo-icono" aria-hidden="true">☀️</span><span class="modo-texto"> Modo claro</span>'
    : '<span class="modo-icono" aria-hidden="true">🌙</span><span class="modo-texto"> Modo oscuro</span>';
  btn.setAttribute("aria-label", Estado.modoOscuro ? "Activar modo claro" : "Activar modo oscuro");
}

/* ═══════════════════════════════════════════════════════════════
   7. LUGAR ALEATORIO
   ═══════════════════════════════════════════════════════════════ */

/**
 * Abre el modal de un lugar seleccionado al azar.
 */
function abrirLugarAleatorio() {
  const indice = Math.floor(Math.random() * LUGARES.length);
  const lugar = LUGARES[indice];

  // Desplazar a la sección de exploración
  document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Pequeña demora para que el scroll no interfiera con el modal
  setTimeout(() => abrirModal(lugar.id), 300);
}

/* ═══════════════════════════════════════════════════════════════
   8. UTILIDADES
   ═══════════════════════════════════════════════════════════════ */

/**
 * Convierte el nombre de una región en un slug para clases CSS.
 * @param {string} region
 * @returns {string}
 */
function slugRegion(region) {
  return region
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Genera el HTML de la imagen de un lugar o un placeholder CSS atractivo.
 * @param {Object} lugar - Objeto del lugar
 * @param {string} contexto - "tarjeta" o "modal"
 * @returns {string} HTML
 */
function generarImagenOPlaceholder(lugar, contexto) {
  const altText = `Imagen de ${lugar.nombre}, ${lugar.provincia}, Ecuador`;
  const colores = REGION_COLORES[lugar.region] || { inicio: "#333", fin: "#666" };

  if (lugar.imagen && lugar.imagen !== "") {
    // Intentar cargar imagen real; si falla, mostrar placeholder
    return `
      <img
        src="${lugar.imagen}"
        alt="${altText}"
        class="${contexto === "modal" ? "modal__imagen" : "tarjeta__imagen"}"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="placeholder-imagen"
           style="background: linear-gradient(135deg, ${colores.inicio}, ${colores.fin}); display:none;"
           aria-label="${altText}" role="img">
        <span class="placeholder-imagen__nombre">${lugar.nombre}</span>
        <span class="placeholder-imagen__provincia">${lugar.provincia}</span>
        <span class="placeholder-imagen__icono" aria-hidden="true">${iconoRegion(lugar.region)}</span>
      </div>`;
  }

  // Sin imagen: placeholder; imagenes.js lo reemplaza por una foto libre de Wikimedia Commons
  return `
    <div class="placeholder-imagen" data-lugar-id="${lugar.id}"
         style="background: linear-gradient(135deg, ${colores.inicio}, ${colores.fin});"
         aria-label="${altText}" role="img">
      <span class="placeholder-imagen__nombre">${lugar.nombre}</span>
      <span class="placeholder-imagen__provincia">${lugar.provincia}</span>
      <span class="placeholder-imagen__icono" aria-hidden="true">${iconoRegion(lugar.region)}</span>
    </div>`;
}

/**
 * Devuelve un emoji representativo de cada región.
 * @param {string} region
 * @returns {string}
 */
function iconoRegion(region) {
  const iconos = {
    "Costa":    "🌊",
    "Sierra":   "🏔️",
    "Amazonía": "🌿",
    "Insular":  "🐢"
  };
  return iconos[region] || "📍";
}

/**
 * Renderiza el contenido de la sección "Sobre el proyecto"
 * (toma los datos del objeto PROYECTO en data.js)
 */
function renderizarSobreProyecto() {
  const contenedor = document.getElementById("sobre-proyecto-contenido");
  if (!contenedor || typeof PROYECTO === "undefined") return;

  contenedor.innerHTML = `
    <div class="proyecto-grid">
      <div class="proyecto-info">
        <h3 class="proyecto-info__titulo">${PROYECTO.nombre}</h3>
        <p class="proyecto-info__slogan">"${PROYECTO.slogan}"</p>
        <div class="proyecto-bloque">
          <h4>🎯 Objetivo</h4>
          <p>${PROYECTO.objetivo}</p>
        </div>
        <div class="proyecto-bloque">
          <h4>👥 Público objetivo</h4>
          <p>${PROYECTO.publicoObjetivo}</p>
        </div>
        <div class="proyecto-bloque">
          <h4>✅ Beneficios</h4>
          <ul class="proyecto-beneficios">
            ${PROYECTO.beneficios.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
        <div class="proyecto-bloque">
          <h4>🧑‍💻 Integrantes</h4>
          <ul class="proyecto-equipo">
            ${[].concat(PROYECTO.equipo).sort((a, b) => a.localeCompare(b, "es")).map(n => `<li>${n}</li>`).join("")}
          </ul>
        </div>
        <div class="proyecto-bloque proyecto-bloque--meta">
          <p><strong>Institución:</strong> ${PROYECTO.universidad}</p>
          <p><strong>Materia:</strong> ${PROYECTO.materia}</p>
          <p><strong>Año:</strong> ${PROYECTO.anio}</p>
        </div>
      </div>
      <div class="proyecto-stats">
        <div class="stat-card">
          <span class="stat-card__numero">${LUGARES.length}</span>
          <span class="stat-card__etiqueta">Lugares turísticos</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__numero">24</span>
          <span class="stat-card__etiqueta">Provincias</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__numero">4</span>
          <span class="stat-card__etiqueta">Regiones</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__numero">${RELATOS_EJEMPLO.length}</span>
          <span class="stat-card__etiqueta">Relatos ilustrativos</span>
        </div>
      </div>
    </div>`;
}

// Llamar cuando el DOM esté listo (se llama desde DOMContentLoaded)
document.addEventListener("DOMContentLoaded", renderizarSobreProyecto);
