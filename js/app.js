import { generarPausas, avanzarPausas, SEPARACION_MIN } from './pausas.js';
import { armarRonda } from './seleccion.js';
import { tirarDado } from './dado.js';

const CANCIONES_POR_RONDA = 3;
const DURACION_PONCHADO_MS = 2000;
// ?rapido acelera todo para probar una ronda completa en un par de minutos.
const ESCALA = new URLSearchParams(location.search).has('rapido') ? 1 / 6 : 1;

const $ = (id) => document.getElementById(id);
const audio = new Audio();
audio.preload = 'auto';
if (ESCALA !== 1) window.__audio = audio; // para inspeccionar en pruebas

let porDefecto = [];
let propias = [];
let ronda = [];
let indice = 0;
let plan = null;      // { fin, pausas } de la canción actual
let siguiente = 0;    // índice de la próxima pausa en plan.pausas
let finPendiente = false; // la canción terminó mientras el dado estaba abierto
let pausaPropia = false;  // la última pausa del audio la pidió el juego, no el celular
let temporizadorPonchado = null;
let bloqueoPantalla = null;

function mostrar(estado) {
  document.body.dataset.estado = estado;
}
const estado = () => document.body.dataset.estado;

async function cargarLista() {
  const boton = $('btn-empezar');
  try {
    const respuesta = await fetch('musica/canciones.json');
    if (!respuesta.ok) throw new Error(respuesta.status);
    porDefecto = await respuesta.json();
    boton.disabled = false;
    boton.textContent = 'Empezar ronda';
  } catch {
    boton.textContent = 'No cargó la música';
  }
}

async function mantenerPantalla() {
  try {
    bloqueoPantalla = await navigator.wakeLock?.request('screen');
  } catch {
    bloqueoPantalla = null;
  }
}

// Si el celular no deja sonar (llamada, auriculares, bloqueo), se pide un toque para seguir.
function reproducir() {
  audio.play().catch((e) => {
    if (e.name !== 'AbortError' && estado() === 'sonando') mostrar('detenido');
  });
}

function detenerMusica() {
  if (audio.paused) return;
  pausaPropia = true;
  audio.pause();
}

function empezarRonda() {
  clearTimeout(temporizadorPonchado);
  finPendiente = false;
  ronda = armarRonda(propias, porDefecto, CANCIONES_POR_RONDA);
  indice = 0;
  mantenerPantalla();
  iniciarCancion();
}

function iniciarCancion() {
  const cancion = ronda[indice];
  plan = null;
  siguiente = 0;
  $('txt-cancion').textContent = `Canción ${indice + 1} de ${ronda.length}`;
  mostrar('sonando');
  detenerMusica();
  audio.src = cancion.archivo;
  // play() debe llamarse dentro del toque del usuario la primera vez (bloqueo de audio del navegador).
  reproducir();
}

audio.addEventListener('loadedmetadata', () => {
  const base = generarPausas(audio.duration / ESCALA);
  plan = { fin: base.fin * ESCALA, pausas: base.pausas.map((t) => t * ESCALA) };
});

audio.addEventListener('timeupdate', () => {
  if (!plan) return;
  const t = audio.currentTime;
  if (t >= plan.fin) return terminarCancion();
  if (estado() === 'sonando') revisarPausa(t);
});

audio.addEventListener('ended', terminarCancion);
audio.addEventListener('error', () => {
  if (ronda.length) terminarCancion();
});
audio.addEventListener('play', () => {
  pausaPropia = false;
});
audio.addEventListener('pause', () => {
  if (pausaPropia) {
    pausaPropia = false;
    return;
  }
  if (estado() === 'sonando') mostrar('detenido');
});

function revisarPausa(t) {
  if (!plan) return;
  const r = avanzarPausas(plan.pausas, siguiente, t, SEPARACION_MIN * ESCALA);
  siguiente = r.siguiente;
  if (r.dispara) {
    detenerMusica();
    navigator.vibrate?.(300);
    mostrar('pausa');
  }
}

function terminarCancion() {
  if (estado() === 'fin' || estado() === 'inicio') return;
  if (estado() === 'dado') {
    // Que el resultado del dado no desaparezca antes de leerlo.
    finPendiente = true;
    detenerMusica();
    return;
  }
  plan = null;
  indice++;
  if (indice < ronda.length) {
    iniciarCancion();
  } else {
    detenerMusica();
    mostrar('fin');
  }
}

$('btn-empezar').addEventListener('click', empezarRonda);
$('btn-otra').addEventListener('click', empezarRonda);

$('btn-lanzaron').addEventListener('click', () => {
  if (estado() !== 'pausa') return;
  mostrar('ponchado');
  temporizadorPonchado = setTimeout(() => {
    mostrar('sonando');
    reproducir();
  }, DURACION_PONCHADO_MS);
});

$('btn-seguir').addEventListener('click', () => {
  if (estado() !== 'detenido') return;
  mostrar('sonando');
  reproducir();
});

$('btn-dado').addEventListener('click', () => {
  if (estado() !== 'sonando') return;
  const valor = tirarDado();
  const dado = $('dado');
  dado.dataset.valor = valor;
  dado.classList.remove('rodando');
  void dado.offsetWidth; // reinicia la animación
  dado.classList.add('rodando');
  $('txt-dado').textContent = `Come ${valor} ${valor === 1 ? 'carta' : 'cartas'}`;
  mostrar('dado');
});

$('btn-cerrar-dado').addEventListener('click', () => {
  if (estado() !== 'dado') return;
  mostrar('sonando');
  if (finPendiente) {
    finPendiente = false;
    terminarCancion();
  } else if (audio.paused) {
    mostrar('detenido');
  } else {
    // Si una pausa tocaba mientras el dado estaba abierto, sale ahora.
    revisarPausa(audio.currentTime);
  }
});

$('archivos').addEventListener('change', (e) => {
  for (const c of propias) URL.revokeObjectURL(c.archivo);
  const archivos = [...e.target.files].filter((f) => f.type.startsWith('audio/'));
  propias = archivos.map((f) => ({ titulo: f.name, archivo: URL.createObjectURL(f) }));
  const total = e.target.files.length;
  $('txt-mis-canciones').textContent =
    propias.length > 0
      ? `${propias.length} ${propias.length === 1 ? 'canción tuya lista' : 'canciones tuyas listas'}`
      : total > 0
        ? 'Esos archivos no son audio'
        : 'Usar mis canciones';
});

// Al volver al juego: se pide de nuevo el bloqueo de pantalla y se revisa si el celular paró la música.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || estado() === 'inicio') return;
  if (bloqueoPantalla?.released !== false) mantenerPantalla();
  if (estado() === 'sonando' && audio.paused) mostrar('detenido');
});

cargarLista();
