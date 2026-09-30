/**
 * imagenes.js — Fotos libres desde Wikimedia Commons
 * Proyecto: Ecuador Patrimonio Vivo
 *
 * Para cada lugar sin foto propia (campo "imagen" vacío en data.js) busca en
 * Wikimedia Commons una fotografía con LICENCIA LIBRE (Creative Commons o
 * dominio público), la muestra y escribe el crédito (autor + licencia + enlace).
 *
 * Opciones por lugar en data.js (todas opcionales):
 *   busquedaImagen: "texto de búsqueda"   -> para afinar qué foto se busca
 *   imagen: "img/archivo.jpg"             -> si lo pones, este módulo no actúa
 *
 * Las respuestas se guardan en localStorage para no repetir las búsquedas.
 */
(function () {
  "use strict";

  const API = "https://commons.wikimedia.org/w/api.php";
  const CLAVE_CACHE = "epv-imagenes-v2";
  const MAX_SIMULTANEAS = 3;
  const LICENCIA_LIBRE = /^(cc[\s-]|cc0|public domain|pd[\s-]|dominio p)/i;

  // ── Caché ─────────────────────────────────────────────────
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CLAVE_CACHE) || "{}"); } catch (_) {}
  const guardarCache = () => {
    try { localStorage.setItem(CLAVE_CACHE, JSON.stringify(cache)); } catch (_) {}
  };

  // ── Utilidades ────────────────────────────────────────────
  const limpiarHTML = (t) => {
    const d = document.createElement("div");
    d.innerHTML = t || "";
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  };

  // Devuelve una lista de búsquedas para probar en orden (de la más
  // específica a la más general) hasta encontrar una foto libre.
  const consultasDe = (lugar) => {
    const base = lugar.nombre.split("—")[0].replace(/\(.*?\)/g, "").trim();
    const extra = [].concat(lugar.busquedaImagen || []);
    return [...extra, `${base} Ecuador`].filter((q, i, a) => a.indexOf(q) === i);
  };

  // ── Petición a Commons ────────────────────────────────────
  async function buscarEnCommons(lugar) {
    if (cache[lugar.id] !== undefined) return cache[lugar.id];

    let resultado = null;
    try {
      for (const consulta of consultasDe(lugar)) {
        const params = new URLSearchParams({
          action: "query", format: "json", origin: "*",
          generator: "search", gsrnamespace: "6", gsrlimit: "20",
          gsrsearch: `${consulta} filetype:bitmap`,
          prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "1000"
        });
        const r = await fetch(`${API}?${params}`);
        const j = await r.json();
        const paginas = Object.values((j.query && j.query.pages) || {})
          .sort((a, b) => a.index - b.index);

        for (const p of paginas) {
          const info = p.imageinfo && p.imageinfo[0];
          if (!info || info.mime !== "image/jpeg") continue;
          if (info.width < 800 || info.width < info.height) continue; // solo horizontales
          const meta = info.extmetadata || {};
          const licencia = limpiarHTML(meta.LicenseShortName && meta.LicenseShortName.value);
          if (!LICENCIA_LIBRE.test(licencia)) continue;
          resultado = {
            url: info.thumburl || info.url,
            autor: limpiarHTML(meta.Artist && meta.Artist.value) || "Autor desconocido",
            licencia,
            pagina: info.descriptionurl
          };
          break;
        }
        if (resultado) break;
      }
      cache[lugar.id] = resultado;   // también se guarda "null" para no reintentar
      guardarCache();
    } catch (e) {
      return null;                   // error de red: no se guarda, se reintentará luego
    }
    return resultado;
  }

  // ── Cola con límite de peticiones simultáneas ─────────────
  const cola = [];
  let activas = 0;
  function encolar(tarea) {
    cola.push(tarea);
    avanzar();
  }
  function avanzar() {
    while (activas < MAX_SIMULTANEAS && cola.length) {
      const t = cola.shift();
      activas++;
      t().finally(() => { activas--; avanzar(); });
    }
  }

  // ── Mostrar la foto en lugar del placeholder ──────────────
  async function hidratar(ph) {
    if (ph.dataset.cargando) return;
    ph.dataset.cargando = "1";
    const lugar = (typeof LUGARES !== "undefined" ? LUGARES : []).find((l) => l.id === ph.dataset.lugarId);
    if (!lugar) return;

    const foto = await buscarEnCommons(lugar);
    if (!foto || !ph.isConnected) return;

    const contenedor = ph.parentElement;
    const esModal = contenedor.classList.contains("modal__imagen-wrap");

    const img = new Image();
    img.className = esModal ? "modal__imagen" : "tarjeta__imagen";
    img.alt = `Fotografía de ${lugar.nombre}, ${lugar.provincia}, Ecuador`;
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      if (!ph.isConnected) return;
      ph.replaceWith(img);
      const texto = `📷 ${foto.autor} — ${foto.licencia}`;
      if (esModal) {
        const c = contenedor.querySelector(".modal__credito");
        if (c) {
          c.classList.remove("modal__credito--pendiente");
          c.innerHTML = "";
          const a = document.createElement("a");
          a.href = foto.pagina; a.target = "_blank"; a.rel = "noopener noreferrer";
          a.textContent = texto + " (Wikimedia Commons)";
          c.appendChild(a);
        }
      } else {
        const c = document.createElement("p");
        c.className = "tarjeta__credito";
        c.textContent = texto;
        c.title = texto;
        contenedor.appendChild(c);
      }
    };
    img.src = foto.url;
  }

  // ── Observadores: cargar solo lo que se ve ────────────────
  const visor = "IntersectionObserver" in window
    ? new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            visor.unobserve(e.target);
            encolar(() => hidratar(e.target));
          }
        });
      }, { rootMargin: "200px" })
    : null;

  function revisar(raiz) {
    raiz.querySelectorAll(".placeholder-imagen[data-lugar-id]").forEach((ph) => {
      if (ph.dataset.observado) return;
      ph.dataset.observado = "1";
      visor ? visor.observe(ph) : encolar(() => hidratar(ph));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    revisar(document);
    new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType === 1) revisar(n);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
