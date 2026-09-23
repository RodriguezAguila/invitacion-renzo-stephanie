"use strict";

/*
  ================================================================
  DATOS EDITABLES DE LA INVITACIÓN
  Modifica solamente este bloque para cambiar nombres, lugares,
  enlaces, WhatsApp, regalos, mensajes y fechas.
  ================================================================
*/
const INVITACION = {
  novios: {
    novio: "Renzo",
    novia: "Stephanie",
    novioCompleto: "Renzo Rodríguez",
    noviaCompleta: "Stephanie Jorge",
  },

  boda: {
    fechaISO: "2026-11-07T16:00:00-05:00",
    fechaNumerica: "07/11/2026",
    fechaPuntos: "07 · 11 · 2026",
    fechaCompleta: "Sábado 7 de noviembre de 2026",
  },

  textos: {
    frasePrincipal:
      "Nuestra historia de amor comienza un nuevo capítulo; acompáñanos a celebrar este día tan especial.",
  },

  historia: {
    titulo: "Nuestra historia",
    descripcion:
      "Entre encuentros, aprendizajes y sueños compartidos, elegimos caminar juntos. Hoy queremos celebrar este nuevo comienzo con las personas que hacen nuestra historia aún más especial.",
  },

  eventos: {
    civil: {
      horario: "3:40 p. m. – 5:00 p. m.",
      lugar: "CLUB AOPIP OFICIAL - SURCO",
      direccion: "Av.Casuarinas 450, Santiago de Surco",
      maps: "https://maps.app.goo.gl/4VRptw1821XmzfLu7?g_st=iw",
    },
    religiosa: {
      horario: "6:40 p. m. – 7:45 p. m.",
      lugar: "Parroquia San Francisco de Asis",
      direccion: "Jiron colón 324, Barranco",
      maps: "https://maps.app.goo.gl/zTGMeN2kFCEbBq2W8?g_st=iw",
    },
    recepcion: {
      horario: "8:00 p. m. – 2:00 a. m.",
      lugar: "CLUB AOPIP OFICIAL - SURCO",
      direccion: "Av.Casuarinas 450, Santiago de Surco",
      maps: "https://maps.app.goo.gl/4VRptw1821XmzfLu7?g_st=iw",
    },
  },

  vestimenta: {
    codigo: "Traje elegante"    
  },

  regalos: {
    mensaje:
      "Lo más valioso será compartir este día contigo. Los que deseen obsequiarnos algo para nuestra luna de miel , les dejamos esta información con mucho cariño.",
        cuenta:
                
        "Mi número de cuenta BCP Soles es 19492196850029.Mi número de cuenta interbancaria es 00219419219685002994."
  },

  confirmacion: {
    fechaLimite: "05 de octubre de 2026",
    whatsapp: "+51 991675256",
  },

  album: {
    mensaje:
      "Después de la celebración podrás compartir aquí las fotografías que tomes durante nuestro gran día.",
    enlace: "https://forms.gle/YBgWmD8zoW8HzWC16",
  },
};

/*
  ================================================================
  LÓGICA DE LA INVITACIÓN
  No necesitas modificar esta parte para cambiar la información.
  ================================================================
*/

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const obtenerValor = (ruta) =>
  ruta.split(".").reduce((valor, clave) => valor?.[clave], INVITACION);

const esDatoPendiente = (valor) =>
  !valor ||
  (typeof valor === "string" &&
    (valor.trim().startsWith("[") || valor.trim() === "#"));

function cargarDatos() {
  $$("[data-config]").forEach((elemento) => {
    const valor = obtenerValor(elemento.dataset.config);
    if (valor !== undefined && valor !== null) {
      elemento.textContent = valor;
    }
  });

  $$("[data-map-link]").forEach((enlace) => {
    const evento = INVITACION.eventos[enlace.dataset.mapLink];
    prepararEnlace(enlace, evento?.maps, "Agrega el enlace de Google Maps en js/script.js");
  });

  prepararEnlace(
    $("#enlace-album"),
    INVITACION.album.enlace,
    "Agrega el enlace del álbum en js/script.js",
  );
}

function prepararEnlace(enlace, destino, mensajePendiente) {
  if (!enlace) return;

  if (esDatoPendiente(destino)) {
    enlace.href = "#";
    enlace.setAttribute("aria-disabled", "true");
    enlace.title = mensajePendiente;
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      mostrarAviso(mensajePendiente);
    });
    return;
  }

  enlace.href = destino;
  enlace.removeAttribute("aria-disabled");
  enlace.removeAttribute("title");
}

function configurarApertura() {
  const pantalla = $("#pantalla-apertura");
  const botonAbrir = $("#boton-abrir");
  const contenido = $("#contenido-principal");

  if (!pantalla || !botonAbrir) {
    document.body.classList.remove("bloqueo-scroll");
    return;
  }

  botonAbrir.addEventListener("click", () => {
    if (pantalla.classList.contains("abierta")) return;

    botonAbrir.disabled = true;
    pantalla.classList.add("abierta");

    // Inicia la música al tocar el sello.
    reproducirMusica();

    const reducirMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tiempoApertura = reducirMovimiento ? 50 : 1450;

    window.setTimeout(() => {
      pantalla.setAttribute("aria-hidden", "true");
      pantalla.hidden = true;

      document.body.classList.remove("bloqueo-scroll");

      if (contenido) {
        contenido.setAttribute("tabindex", "-1");
        contenido.focus({ preventScroll: true });
      }
    }, tiempoApertura);
  });
}

function actualizarIconoMusica(reproduciendo) {
  const boton = $("#boton-musica");
  const icono = $("i", boton);
  if (!boton || !icono) return;

  boton.setAttribute("aria-pressed", String(reproduciendo));
  boton.setAttribute(
    "aria-label",
    reproduciendo ? "Pausar música" : "Reproducir música",
  );
  icono.className = reproduciendo
    ? "fa-solid fa-pause"
    : "fa-solid fa-music";
}

async function reproducirMusica() {
  const audio = $("#musica-boda");
  if (!audio) return false;

  try {
    await audio.play();
    actualizarIconoMusica(true);
    return true;
  } catch {
    actualizarIconoMusica(false);
    return false;
  }
}

function configurarMusica() {
  const audio = $("#musica-boda");
  const boton = $("#boton-musica");
  if (!audio || !boton) return;

  boton.addEventListener("click", async () => {
    if (audio.paused) {
      const seReprodujo = await reproducirMusica();
      if (!seReprodujo) {
        mostrarAviso("Reemplaza assets/audio/elvis.mp3 por tu canción");
      }
      return;
    }

    audio.pause();
    actualizarIconoMusica(false);
  });

  audio.addEventListener("pause", () => actualizarIconoMusica(false));
  audio.addEventListener("play", () => actualizarIconoMusica(true));
  audio.addEventListener("error", () => {
    actualizarIconoMusica(false);
    mostrarAviso("No se pudo cargar la música");
  });
}

function configurarCuentaRegresiva() {
  const destino = new Date(INVITACION.boda.fechaISO).getTime();
  const contador = $("#contador");
  const mensaje = $("#mensaje-contador");

  if (!contador || !mensaje || Number.isNaN(destino)) return;

  const elementos = {
    dias: $("#dias"),
    horas: $("#horas"),
    minutos: $("#minutos"),
    segundos: $("#segundos"),
  };

  const actualizar = () => {
    const diferencia = destino - Date.now();

    if (diferencia <= 0) {
      contador.hidden = true;
      mensaje.hidden = false;
      return false;
    }

    const segundosTotales = Math.floor(diferencia / 1000);
    const dias = Math.floor(segundosTotales / 86400);
    const horas = Math.floor((segundosTotales % 86400) / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;

    elementos.dias.textContent = String(dias).padStart(3, "0");
    elementos.horas.textContent = String(horas).padStart(2, "0");
    elementos.minutos.textContent = String(minutos).padStart(2, "0");
    elementos.segundos.textContent = String(segundos).padStart(2, "0");
    return true;
  };

  if (actualizar()) {
    const intervalo = window.setInterval(() => {
      if (!actualizar()) window.clearInterval(intervalo);
    }, 1000);
  }
}

function configurarAnimaciones() {
  const elementos = $$(".revelar");
  const reduceMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMovimiento || !("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas, instancia) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visible");
        instancia.unobserve(entrada.target);
      });
    },
    { threshold: 0.13, rootMargin: "0px 0px -45px" },
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

function configurarNavegacion() {
  const botonVolver = $("#boton-volver");
  const enlaces = $$(".navegacion-secciones a");
  const secciones = enlaces
    .map((enlace) => $(enlace.getAttribute("href")))
    .filter(Boolean);

  botonVolver?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const actualizarBoton = () => {
    botonVolver?.classList.toggle("visible", window.scrollY > 650);
  };
  actualizarBoton();
  window.addEventListener("scroll", actualizarBoton, { passive: true });

  if (!("IntersectionObserver" in window)) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        enlaces.forEach((enlace) => {
          const activo = enlace.getAttribute("href") === `#${entrada.target.id}`;
          enlace.classList.toggle("activo", activo);
          if (activo) enlace.setAttribute("aria-current", "location");
          else enlace.removeAttribute("aria-current");
        });
      });
    },
    { threshold: 0.34 },
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

let temporizadorAviso;
function mostrarAviso(texto) {
  const aviso = $("#aviso-copiado");
  if (!aviso) return;

  window.clearTimeout(temporizadorAviso);
  aviso.textContent = texto;
  aviso.classList.add("visible");
  temporizadorAviso = window.setTimeout(
    () => aviso.classList.remove("visible"),
    2800,
  );
}

async function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const campoTemporal = document.createElement("textarea");
  campoTemporal.value = texto;
  campoTemporal.setAttribute("readonly", "");
  campoTemporal.style.position = "fixed";
  campoTemporal.style.opacity = "0";
  document.body.appendChild(campoTemporal);
  campoTemporal.select();
  const copiado = document.execCommand("copy");
  campoTemporal.remove();
  if (!copiado) throw new Error("No fue posible copiar");
}

function configurarCopiado() {
  const botones = $$(".boton-copiar");

  if (!botones.length) return;

  botones.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const ruta = boton.dataset.copyConfig;
      const datoBancario = String(obtenerValor(ruta) || "").trim();
      const etiqueta = boton.dataset.copyLabel || "CCI";

      if (!datoBancario || esDatoPendiente(datoBancario)) {
        mostrarAviso(`Agrega el ${etiqueta} en js/script.js`);
        return;
      }

      try {
        await copiarTexto(datoBancario);
        mostrarAviso(`${etiqueta} copiado correctamente`);
      } catch {
        mostrarAviso("Selecciona y copia el dato manualmente");
      }
    });
  });
}

function configurarGaleria() {
  const lightbox = $("#lightbox");
  const imagenAmpliada = $("#lightbox-imagen");
  const descripcion = $("#lightbox-descripcion");
  const botones = $$(".foto-galeria");
  const cerrar = $("#lightbox-cerrar");
  const anterior = $("#lightbox-anterior");
  const siguiente = $("#lightbox-siguiente");

  if (
    !lightbox ||
    !imagenAmpliada ||
    !descripcion ||
    botones.length === 0
  ) {
    return;
  }

  let indiceActual = 0;
  let activador = null;

  const mostrarImagen = (indice) => {
    indiceActual = (indice + botones.length) % botones.length;
    const imagen = $("img", botones[indiceActual]);
    imagenAmpliada.src = imagen.src;
    imagenAmpliada.alt = imagen.alt;
    descripcion.textContent = `${imagen.alt} · ${indiceActual + 1} de ${botones.length}`;
  };

  const abrir = (indice, boton) => {
    activador = boton;
    mostrarImagen(indice);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("bloqueo-scroll");
    cerrar?.focus();
  };

  const cerrarLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bloqueo-scroll");
    activador?.focus();
  };

  botones.forEach((boton, indice) => {
    boton.addEventListener("click", () => abrir(indice, boton));
  });

  cerrar?.addEventListener("click", cerrarLightbox);
  anterior?.addEventListener("click", () => mostrarImagen(indiceActual - 1));
  siguiente?.addEventListener("click", () => mostrarImagen(indiceActual + 1));

  lightbox.addEventListener("click", (evento) => {
    if (evento.target === lightbox) cerrarLightbox();
  });

  document.addEventListener("keydown", (evento) => {
    if (lightbox.hidden) return;

    if (evento.key === "Escape") cerrarLightbox();
    if (evento.key === "ArrowLeft") mostrarImagen(indiceActual - 1);
    if (evento.key === "ArrowRight") mostrarImagen(indiceActual + 1);
  });
}

function limpiarErroresFormulario() {
  $$(".mensaje-error").forEach((elemento) => {
    elemento.textContent = "";
  });
  $("#estado-formulario").textContent = "";
}

function configurarFormulario() {
  const formulario = $("#formulario-rsvp");
  if (!formulario) return;

  $$('input[name="asistencia"]', formulario).forEach((radio) => {
    radio.addEventListener("change", () => {
      const noAsiste = radio.checked && radio.value === "No";
      if (noAsiste) acompanantes.value = "0";
      acompanantes.disabled = noAsiste;
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarErroresFormulario();

    const datos = new FormData(formulario);
    const nombre = String(datos.get("nombre") || "").trim();
    const asistencia = String(datos.get("asistencia") || "");  
    const mensaje = String(datos.get("mensaje") || "").trim();
    let formularioValido = true;

    if (nombre.length < 3) {
      $("#error-nombre").textContent = "Escribe tu nombre completo.";
      formularioValido = false;
    }

    if (!asistencia) {
      $("#error-asistencia").textContent = "Selecciona una opción.";
      formularioValido = false;
    }  

    if (!formularioValido) {
      $("#estado-formulario").textContent =
        "Revisa los campos señalados antes de continuar.";
      formulario.querySelector(".mensaje-error:not(:empty)")?.parentElement
        ?.querySelector("input, textarea")
        ?.focus();
      return;
    }

    const telefono = INVITACION.confirmacion.whatsapp.replace(/\D/g, "");
    if (esDatoPendiente(INVITACION.confirmacion.whatsapp) || telefono.length < 8) {
      $("#estado-formulario").textContent =
        "Falta agregar el número de WhatsApp en js/script.js.";
      return;
    }

    const texto = [
      `Hola, somos invitados de Renzo & Stephanie.`,
      "",
      "*Confirmación de asistencia*",
      `Nombre: ${nombre}`,
      `Asistiré: ${asistencia}`,
      `Mensaje: ${mensaje || "Sin mensaje adicional"}`,
    ].join("\n");

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function iniciarInvitacion() {
  cargarDatos();
  configurarApertura();
  configurarMusica();
  configurarCuentaRegresiva();
  configurarAnimaciones();
  configurarNavegacion();
  configurarCopiado();
  configurarGaleria();
  configurarFormulario();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarInvitacion);
} else {
  iniciarInvitacion();
}
