import { generarPausas } from './pausas.js';
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
let temporizadorPonchado = null;
let bloqueoPantalla = null;

function mostrar(estado) {
  document.body.dataset.estado = estado;
}
const estado = () => document.body.dataset.estado;

async function cargarLista() {
  try {
    porDefecto = await (await fetch('musica/canciones.json')).json();
  } catch {
    $('btn-empezar').disabled = true;
    $('btn-empezar').textContent = 'No cargó la música';
  }
}

async function mantenerPantalla() {
  try {
    bloqueoPantalla = await navigator.wakeLock?.request('screen');
  } catch {
    bloqueoPantalla = null;
  }
}

function empezarRonda() {
  clearTimeout(temporizadorPonchado);
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
  audio.src = cancion.archivo;
  // play() debe llamarse dentro del toque del usuario la primera vez (bloqueo de audio del navegador).
  audio.play().catch(() => {});
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

function revisarPausa(t) {
  if (plan && siguiente < plan.pausas.length && t >= plan.pausas[siguiente]) {
    siguiente++;
    audio.pause();
    navigator.vibrate?.(300);
    mostrar('pausa');
  }
}

function terminarCancion() {
  if (estado() === 'fin' || estado() === 'inicio') return;
  plan = null;
  indice++;
  if (indice < ronda.length) {
    iniciarCancion();
  } else {
    audio.pause();
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
    audio.play().catch(() => {});
  }, DURACION_PONCHADO_MS);
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
  // Si una pausa tocaba mientras el dado estaba abierto, sale ahora.
  revisarPausa(audio.currentTime);
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

// El navegador suelta el bloqueo de pantalla al cambiar de pestaña; se pide de nuevo al volver.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && estado() !== 'inicio' && bloqueoPantalla?.released !== false) {
    mantenerPantalla();
  }
});

cargarLista();
