/**
 * resenas.js — Calificaciones y comentarios por lugar
 * Proyecto: Ecuador Patrimonio Vivo
 * ─────────────────────────────────────────────────────────────
 * Se conecta con el servidor (server.js) mediante /api/...
 * Expone window.Resenas con:
 *   - montar(contenedor, lugarId)  → dibuja la sección en el modal
 *   - pintarTarjetas()             → muestra ★ promedio en las tarjetas
 *
 * Todo texto del usuario se inserta con textContent (nunca innerHTML),
 * así no se puede inyectar código desde un comentario.
 */
(function () {
  "use strict";

  const API = "/api";
  const MAX_COMENTARIO = 600;
  const MAX_NOMBRE = 40;

  // Resumen de todos los lugares: { lugar_id: {promedio, total} }
  let resumen = {};
  let resumenListo = false;

  /* ── Utilidades ──────────────────────────────────────────── */
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fmtPromedio = (n) => Number(n).toFixed(1).replace(".", ",");

  const fmtFecha = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" });
  };

  /** Estrellas (con media estrella proporcional) como texto decorativo. */
  const estrellasHTML = (promedio) => {
    const pct = Math.max(0, Math.min(100, (promedio / 5) * 100));
    return `<span class="estrellas" style="--pct:${pct}%" aria-hidden="true">★★★★★</span>`;
  };

  const textoAccesible = (promedio, total) =>
    total
      ? `Calificación ${fmtPromedio(promedio)} de 5, basada en ${total} ${total === 1 ? "opinión" : "opiniones"}`
      : "Aún sin opiniones";

  async function pedir(ruta, opciones) {
    const r = await fetch(API + ruta, opciones);
    let datos = null;
    try { datos = await r.json(); } catch (_) {}
    if (!r.ok) {
      const err = new Error((datos && datos.error) || "Error del servidor");
      err.status = r.status;
      throw err;
    }
    return datos;
  }

  const mensajeSinServicio = () =>
    location.protocol === "file:"
      ? "Para ver y enviar opiniones, abre el sitio con el servidor: ejecuta «node server.js» y entra a http://localhost:3000."
      : "El servicio de opiniones no está disponible en este momento. Intenta de nuevo más tarde.";

  /* ═══════════════════════════════════════════════════════════
     TARJETAS: promedio de estrellas en cada destino
     ═══════════════════════════════════════════════════════════ */
  function pintarTarjetas() {
    document.querySelectorAll("[data-valoracion]").forEach((el) => {
      const r = resumen[el.getAttribute("data-valoracion")];
      if (r && r.total > 0) {
        el.innerHTML =
          `${estrellasHTML(r.promedio)} <strong>${fmtPromedio(r.promedio)}</strong> ` +
          `<span class="tarjeta__valoracion-total">(${r.total})</span>`;
        el.setAttribute("aria-label", textoAccesible(r.promedio, r.total));
        el.classList.add("tarjeta__valoracion--visible");
      } else {
        el.textContent = "";
        el.removeAttribute("aria-label");
        el.classList.remove("tarjeta__valoracion--visible");
      }
    });
  }

  async function cargarResumen() {
    try {
      resumen = await pedir("/resumen");
      resumenListo = true;
      pintarTarjetas();
    } catch (_) { /* sin servidor: las tarjetas simplemente no muestran estrellas */ }
  }

  /* ═══════════════════════════════════════════════════════════
     MODAL: sección de opiniones de un lugar
     ═══════════════════════════════════════════════════════════ */
  function plantilla() {
    const radios = [5, 4, 3, 2, 1].map((n) => `
      <input type="radio" name="estrellas" id="resena-est-${n}" value="${n}" required>
      <label for="resena-est-${n}" title="${n} ${n === 1 ? "estrella" : "estrellas"}">
        <span aria-hidden="true">★</span>
        <span class="sr-only">${n} ${n === 1 ? "estrella" : "estrellas"}</span>
      </label>`).join("");

    return `
      <h4 class="modal__subtitulo"><span aria-hidden="true">⭐</span> Opiniones de visitantes</h4>

      <div class="resenas__resumen" data-rol="resumen" aria-live="polite">
        <p class="resenas__cargando">Cargando opiniones…</p>
      </div>

      <form class="resenas__form" data-rol="form" novalidate>
        <h5 class="resenas__form-titulo">Comparte tu experiencia</h5>

        <fieldset class="resenas__estrellas">
          <legend>¿Cuántas estrellas le das?</legend>
          <div class="resenas__estrellas-grupo">${radios}</div>
        </fieldset>

        <div class="resenas__campo">
          <label for="resena-comentario">¿Por qué esa calificación? <span class="resenas__opcional">(opcional)</span></label>
          <textarea id="resena-comentario" name="comentario" rows="3" maxlength="${MAX_COMENTARIO}"
            placeholder="Cuéntanos qué te gustó o qué se podría mejorar…"></textarea>
          <small class="resenas__contador" data-rol="contador">0 / ${MAX_COMENTARIO}</small>
        </div>

        <div class="resenas__campo">
          <label for="resena-nombre">Tu nombre <span class="resenas__opcional">(opcional — si lo dejas vacío serás «Anónimo»)</span></label>
          <input type="text" id="resena-nombre" name="nombre" maxlength="${MAX_NOMBRE}"
            autocomplete="nickname" placeholder="Anónimo">
        </div>

        <!-- Campo trampa para bots: los humanos no lo ven -->
        <div class="resenas__trampa" aria-hidden="true">
          <label>No llenar <input type="text" name="web" tabindex="-1" autocomplete="off"></label>
        </div>

        <div class="resenas__acciones">
          <button type="submit" class="btn btn--primario" data-rol="enviar">Enviar opinión</button>
          <p class="resenas__estado" data-rol="estado" role="status" aria-live="polite"></p>
        </div>
      </form>

      <div class="resenas__lista-wrap">
        <ul class="resenas__lista" data-rol="lista"></ul>
        <button type="button" class="btn btn--secundario btn--pequeño resenas__mas" data-rol="mas" hidden>
          Ver más opiniones
        </button>
      </div>`;
  }

  function montar(contenedor, lugarId) {
    if (!contenedor) return;
    contenedor.innerHTML = plantilla();
    contenedor.dataset.lugar = lugarId;

    const $ = (rol) => contenedor.querySelector(`[data-rol="${rol}"]`);
    const elResumen = $("resumen"), elLista = $("lista"), btnMas = $("mas");
    const form = $("form"), estado = $("estado"), btnEnviar = $("enviar");
    const txt = form.elements.comentario, contador = $("contador");

    // Evita pintar respuestas tardías si el usuario ya abrió otro lugar
    const vigente = () => contenedor.isConnected && contenedor.dataset.lugar === lugarId;

    let ultimoId = null;

    const pintarResumen = (d) => {
      if (!d.total) {
        elResumen.innerHTML =
          `<p class="resenas__vacio">Aún no hay opiniones. <strong>¡Sé la primera persona en opinar!</strong></p>`;
        return;
      }
      const barras = [5, 4, 3, 2, 1].map((n) => {
        const cant = d.distribucion[n] || 0;
        const pct = Math.round((cant / d.total) * 100);
        return `<li><span class="resenas__barra-n">${n} ★</span>
          <span class="resenas__barra"><span style="width:${pct}%"></span></span>
          <span class="resenas__barra-c">${cant}</span></li>`;
      }).join("");
      elResumen.innerHTML = `
        <div class="resenas__promedio" aria-label="${esc(textoAccesible(d.promedio, d.total))}">
          <span class="resenas__promedio-num">${fmtPromedio(d.promedio)}</span>
          ${estrellasHTML(d.promedio)}
          <span class="resenas__promedio-total">${d.total} ${d.total === 1 ? "opinión" : "opiniones"}</span>
        </div>
        <ul class="resenas__barras" aria-hidden="true">${barras}</ul>`;
    };

    const crearItem = (r) => {
      const li = document.createElement("li");
      li.className = "resena";

      const cab = document.createElement("div");
      cab.className = "resena__cab";
      const quien = document.createElement("strong");
      quien.className = "resena__nombre";
      quien.textContent = r.nombre || "Anónimo";
      const est = document.createElement("span");
      est.className = "estrellas";
      est.style.setProperty("--pct", (r.estrellas / 5) * 100 + "%");
      est.setAttribute("role", "img");
      est.setAttribute("aria-label", `${r.estrellas} de 5 estrellas`);
      est.textContent = "★★★★★";
      const fecha = document.createElement("time");
      fecha.className = "resena__fecha";
      fecha.dateTime = r.creado_en;
      fecha.textContent = fmtFecha(r.creado_en);
      cab.append(quien, est, fecha);
      li.appendChild(cab);

      if (r.comentario) {
        const p = document.createElement("p");
        p.className = "resena__texto";
        p.textContent = r.comentario; // seguro: textContent
        li.appendChild(p);
      }
      return li;
    };

    async function cargar(reiniciar) {
      try {
        const query = !reiniciar && ultimoId ? `?antes=${ultimoId}&limite=10` : "?limite=10";
        const d = await pedir("/resenas/" + encodeURIComponent(lugarId) + query);
        if (!vigente()) return;

        if (reiniciar) { elLista.innerHTML = ""; }
        d.resenas.forEach((r) => elLista.appendChild(crearItem(r)));
        if (d.resenas.length) ultimoId = d.resenas[d.resenas.length - 1].id;
        btnMas.hidden = !d.hayMas;

        if (reiniciar) {
          pintarResumen(d);
          resumen[lugarId] = { promedio: d.promedio, total: d.total };
          pintarTarjetas();
        }
      } catch (_) {
        if (!vigente()) return;
        elResumen.innerHTML = `<p class="resenas__error">${esc(mensajeSinServicio())}</p>`;
      }
    }

    // Contador de caracteres
    txt.addEventListener("input", () => {
      contador.textContent = `${txt.value.length} / ${MAX_COMENTARIO}`;
    });

    btnMas.addEventListener("click", () => cargar(false));

    const mostrarEstado = (msg, tipo) => {
      estado.textContent = msg;
      estado.className = "resenas__estado" + (tipo ? " resenas__estado--" + tipo : "");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const estrellas = form.elements.estrellas.value;
      if (!estrellas) {
        mostrarEstado("Elige de 1 a 5 estrellas antes de enviar.", "error");
        form.querySelector(".resenas__estrellas-grupo input")?.focus();
        return;
      }

      btnEnviar.disabled = true;
      mostrarEstado("Enviando…");
      try {
        await pedir("/resenas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lugar_id: lugarId,
            estrellas: Number(estrellas),
            comentario: form.elements.comentario.value,
            nombre: form.elements.nombre.value,
            web: form.elements.web.value
          })
        });
        if (!vigente()) return;
        form.reset();
        contador.textContent = `0 / ${MAX_COMENTARIO}`;
        mostrarEstado("¡Gracias! Tu opinión fue guardada.", "ok");
        ultimoId = null;
        await cargar(true);
      } catch (err) {
        if (!vigente()) return;
        mostrarEstado(err.status ? err.message : mensajeSinServicio(), "error");
      } finally {
        btnEnviar.disabled = false;
      }
    });

    cargar(true);
  }

  window.Resenas = { montar, pintarTarjetas };

  document.addEventListener("DOMContentLoaded", cargarResumen);
})();
