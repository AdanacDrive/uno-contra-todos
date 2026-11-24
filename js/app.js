import { generarPausas, avanzarPausas, SEPARACION_MIN } from './pausas.js';
import { armarRonda } from './seleccion.js';
import { tirarDado } from './dado.js';
import { crearReloj } from './reloj.js';
import { CLIENT_ID, crearClienteSpotify, generarVerificador, desafioPkce, urlAutorizacion } from './spotify.js';

const CANCIONES_POR_RONDA = 3;
const DURACION_PONCHADO_MS = 2000;
// ?rapido acelera todo para probar una ronda completa en un par de minutos.
const ESCALA = new URLSearchParams(location.search).has('rapido') ? 1 / 6 : 1;
const REDIRECT = location.origin + location.pathname;
const TEXTO_DETENIDO = 'El celular la pausó. Toquen para seguir donde iban.';

const $ = (id) => document.getElementById(id);
const audio = new Audio();
audio.preload = 'auto';
if (ESCALA !== 1) window.__audio = audio; // para inspeccionar en pruebas

// localStorage puede no estar disponible (modo privado): el juego sigue sin Spotify.
const guardado = {
  get(k) { try { return localStorage.getItem('uct-' + k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem('uct-' + k, v); } catch {} },
  del(k) { try { localStorage.removeItem('uct-' + k); } catch {} },
};
const spotify = crearClienteSpotify({ clientId: CLIENT_ID, redirect: REDIRECT, guardado });
const reloj = crearReloj();
const usaSpotify = () => spotify.conectado();

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

function mostrarDetenido(texto = TEXTO_DETENIDO) {
  reloj.pausar();
  $('txt-detenido').textContent = texto;
  mostrar('detenido');
}

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

// ---- Spotify ----

function errorSpotify(e) {
  if (e.tipo === 'restriccion') return; // p. ej. pausar algo que ya estaba en pausa
  if (estado() === 'inicio' || estado() === 'fin') return;
  if (e.tipo === 'sin-dispositivo') {
    mostrarDetenido('Abran Spotify, pongan a sonar su playlist y vuelvan aquí.');
  } else if (e.tipo === 'sin-sesion') {
    pintarSpotify();
    mostrarDetenido('Se cerró la sesión de Spotify. Toquen para seguir con la música del juego.');
  } else {
    mostrarDetenido('Se perdió la conexión con Spotify. Revisen el internet y toquen para seguir.');
  }
}

function pintarSpotify() {
  const conectado = usaSpotify();
  $('txt-spotify').textContent = conectado ? 'Spotify conectado · desconectar' : 'Usar mi Spotify (Premium)';
  $('lbl-archivos').hidden = conectado;
  $('txt-inicio').textContent = conectado
    ? 'Pongan a sonar su playlist en Spotify y toquen Empezar.'
    : 'Pongan el celular en el centro de la mesa y suban el volumen.';
}

async function conectarSpotify() {
  if (usaSpotify()) {
    spotify.salir();
    pintarSpotify();
    return;
  }
  const verificador = generarVerificador();
  guardado.set('verificador', verificador);
  location.href = urlAutorizacion(CLIENT_ID, REDIRECT, await desafioPkce(verificador));
}

// Al volver de iniciar sesión en Spotify, la URL trae ?code=...
async function regresoDeSpotify() {
  const params = new URLSearchParams(location.search);
  const codigo = params.get('code');
  if (!codigo && !params.get('error')) return;
  history.replaceState(null, '', REDIRECT);
  const verificador = guardado.get('verificador');
  guardado.del('verificador');
  if (codigo && verificador) {
    try {
      await spotify.canjearCodigo(codigo, verificador);
    } catch {
      $('txt-inicio').textContent = 'No se pudo conectar Spotify. Intenten de nuevo.';
      return;
    }
  }
  pintarSpotify();
}

// ---- Música: canciones del juego o Spotify ----

// Si el celular no deja sonar (llamada, auriculares, bloqueo), se pide un toque para seguir.
function reproducir() {
  if (usaSpotify()) {
    reloj.reanudar();
    spotify.reanudar().catch(errorSpotify);
    return;
  }
  audio.play().catch((e) => {
    if (e.name !== 'AbortError' && estado() === 'sonando') mostrarDetenido();
  });
}

function detenerMusica() {
  if (usaSpotify()) {
    reloj.pausar();
    spotify.pausar().catch(errorSpotify);
    return;
  }
  if (audio.paused) return;
  pausaPropia = true;
  audio.pause();
}

function empezarRonda() {
  clearTimeout(temporizadorPonchado);
  finPendiente = false;
  ronda = usaSpotify()
    ? Array.from({ length: CANCIONES_POR_RONDA }, () => null)
    : armarRonda(propias, porDefecto, CANCIONES_POR_RONDA);
  indice = 0;
  mantenerPantalla();
  iniciarCancion();
}

function iniciarCancion() {
  siguiente = 0;
  $('txt-cancion').textContent = `Canción ${indice + 1} de ${ronda.length}`;
  mostrar('sonando');
  if (usaSpotify()) {
    // Spotify no dice cuánto dura la canción: tramo de 60 a 90 s y luego la siguiente.
    const base = generarPausas(Infinity);
    plan = { fin: base.fin * ESCALA, pausas: base.pausas.map((t) => t * ESCALA) };
    reloj.iniciar();
    const arrancar = indice === 0 ? spotify.reanudar() : spotify.siguiente().then(() => spotify.reanudar());
    arrancar.catch(errorSpotify);
    return;
  }
  plan = null;
  detenerMusica();
  audio.src = ronda[indice].archivo;
  // play() debe llamarse dentro del toque del usuario la primera vez (bloqueo de audio del navegador).
  reproducir();
}

audio.addEventListener('loadedmetadata', () => {
  const base = generarPausas(audio.duration / ESCALA);
  plan = { fin: base.fin * ESCALA, pausas: base.pausas.map((t) => t * ESCALA) };
});

audio.addEventListener('timeupdate', () => {
  if (!plan || usaSpotify()) return;
  revisarTiempo(audio.currentTime);
});

// Con Spotify el tiempo lo lleva el reloj del juego.
setInterval(() => {
  if (plan && usaSpotify() && (estado() === 'sonando' || estado() === 'dado')) revisarTiempo(reloj.transcurrido());
}, 250);

function revisarTiempo(t) {
  if (t >= plan.fin) return terminarCancion();
  if (estado() === 'sonando') revisarPausa(t);
}

audio.addEventListener('ended', terminarCancion);
audio.addEventListener('error', () => {
  if (ronda.length && !usaSpotify()) terminarCancion();
});
audio.addEventListener('play', () => {
  pausaPropia = false;
});
audio.addEventListener('pause', () => {
  if (pausaPropia) {
    pausaPropia = false;
    return;
  }
  if (estado() === 'sonando') mostrarDetenido();
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
$('btn-spotify').addEventListener('click', conectarSpotify);

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
  if (!usaSpotify() && ronda[indice] === null) {
    // Spotify se desconectó a mitad de ronda: sigue con la música del juego.
    ronda = armarRonda(propias, porDefecto, ronda.length);
    iniciarCancion();
    return;
  }
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
  } else if (!usaSpotify() && audio.paused) {
    mostrarDetenido();
  } else {
    // Si una pausa tocaba mientras el dado estaba abierto, sale ahora.
    revisarPausa(usaSpotify() ? reloj.transcurrido() : audio.currentTime);
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
  if (estado() === 'sonando' && !usaSpotify() && audio.paused) mostrarDetenido();
});

pintarSpotify();
regresoDeSpotify();
cargarLista();
