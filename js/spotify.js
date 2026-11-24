// Control de la app de Spotify del jugador (requiere Premium).
// Inicio de sesión con PKCE: no hay servidor ni secreto, solo el Client ID público.
const AUTORIZAR = 'https://accounts.spotify.com/authorize';
const TOKEN = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';
const PERMISOS = 'user-read-playback-state user-modify-playback-state';

export const CLIENT_ID = '430e7c81f40c4138ac45a0460bbfbc70';

class ErrorSpotify extends Error {
  constructor(tipo) {
    super(tipo);
    this.tipo = tipo; // 'sin-sesion' | 'sin-dispositivo' | 'restriccion' | 'red'
  }
}

function base64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generarVerificador() {
  return base64url(crypto.getRandomValues(new Uint8Array(48)));
}

export async function desafioPkce(verificador) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verificador));
  return base64url(new Uint8Array(hash));
}

export function urlAutorizacion(clientId, redirect, desafio) {
  const url = new URL(AUTORIZAR);
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirect,
    code_challenge_method: 'S256',
    code_challenge: desafio,
    scope: PERMISOS,
  });
  return url.toString();
}

// guardado: { get(clave), set(clave, valor), del(clave) }
export function crearClienteSpotify({ clientId, redirect, fetch = (...a) => globalThis.fetch(...a), guardado }) {
  function salir() {
    guardado.del('token');
    guardado.del('refresco');
  }

  async function pedirToken(datos) {
    const r = await fetch(TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, ...datos }),
    });
    if (!r.ok) throw new ErrorSpotify('sin-sesion');
    const j = await r.json();
    guardado.set('token', j.access_token);
    if (j.refresh_token) guardado.set('refresco', j.refresh_token);
  }

  async function renovar() {
    const refresco = guardado.get('refresco');
    if (!refresco) throw new ErrorSpotify('sin-sesion');
    try {
      await pedirToken({ grant_type: 'refresh_token', refresh_token: refresco });
    } catch (e) {
      salir();
      throw e;
    }
  }

  async function orden(metodo, ruta, reintentar = true) {
    const token = guardado.get('token');
    if (!token) throw new ErrorSpotify('sin-sesion');
    let r;
    try {
      r = await fetch(API + ruta, { method: metodo, headers: { Authorization: `Bearer ${token}` } });
    } catch {
      throw new ErrorSpotify('red');
    }
    if (r.status === 401 && reintentar) {
      await renovar();
      return orden(metodo, ruta, false);
    }
    if (r.status === 401) throw new ErrorSpotify('sin-sesion');
    if (r.status === 404) throw new ErrorSpotify('sin-dispositivo');
    // 403: por ejemplo pausar algo que ya está en pausa.
    if (r.status === 403) throw new ErrorSpotify('restriccion');
    if (!r.ok) throw new ErrorSpotify('red');
    return r;
  }

  return {
    conectado: () => Boolean(guardado.get('token') || guardado.get('refresco')),
    canjearCodigo: (codigo, verificador) =>
      pedirToken({ grant_type: 'authorization_code', code: codigo, redirect_uri: redirect, code_verifier: verificador }),
    pausar: () => orden('PUT', '/me/player/pause'),
    reanudar: () => orden('PUT', '/me/player/play'),
    siguiente: () => orden('POST', '/me/player/next'),
    salir,
  };
}
