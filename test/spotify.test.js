import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desafioPkce, urlAutorizacion, crearClienteSpotify } from '../js/spotify.js';

test('el desafío PKCE coincide con el ejemplo del RFC 7636', async () => {
  const desafio = await desafioPkce('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');
  assert.equal(desafio, 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
});

test('la URL de autorización pide solo permisos de reproducción', () => {
  const url = new URL(urlAutorizacion('ID', 'https://x.github.io/juego/', 'DESAFIO'));
  assert.equal(url.origin + url.pathname, 'https://accounts.spotify.com/authorize');
  assert.equal(url.searchParams.get('client_id'), 'ID');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(url.searchParams.get('code_challenge'), 'DESAFIO');
  assert.equal(url.searchParams.get('redirect_uri'), 'https://x.github.io/juego/');
  assert.equal(url.searchParams.get('scope'), 'user-read-playback-state user-modify-playback-state');
});

function respuesta(status, cuerpo = null) {
  return { ok: status >= 200 && status < 300, status, json: async () => cuerpo, text: async () => '' };
}

function memoria(inicial = {}) {
  const datos = { ...inicial };
  return { get: (k) => datos[k] ?? null, set: (k, v) => { datos[k] = v; }, del: (k) => { delete datos[k]; }, datos };
}

test('si el token venció, lo renueva y repite la orden', async () => {
  const llamadas = [];
  const respuestas = [
    respuesta(401),
    respuesta(200, { access_token: 'nuevo', refresh_token: 'r2', expires_in: 3600 }),
    respuesta(204),
  ];
  const fetch = async (url, opciones) => {
    llamadas.push([url, opciones?.headers?.Authorization ?? null]);
    return respuestas.shift();
  };
  const guardado = memoria({ token: 'viejo', refresco: 'r1' });
  const cliente = crearClienteSpotify({ clientId: 'ID', redirect: 'R', fetch, guardado });
  await cliente.pausar();
  assert.equal(llamadas[0][0], 'https://api.spotify.com/v1/me/player/pause');
  assert.equal(llamadas[0][1], 'Bearer viejo');
  assert.equal(llamadas[1][0], 'https://accounts.spotify.com/api/token');
  assert.equal(llamadas[2][1], 'Bearer nuevo');
  assert.equal(guardado.datos.refresco, 'r2');
});

test('si no hay dónde sonar, el error dice sin-dispositivo', async () => {
  const fetch = async () => respuesta(404);
  const cliente = crearClienteSpotify({ clientId: 'ID', redirect: 'R', fetch, guardado: memoria({ token: 't', refresco: 'r' }) });
  await assert.rejects(cliente.reanudar(), (e) => e.tipo === 'sin-dispositivo');
});

test('sin sesión guardada no está conectado y las órdenes fallan con sin-sesion', async () => {
  const cliente = crearClienteSpotify({ clientId: 'ID', redirect: 'R', fetch: async () => respuesta(200), guardado: memoria() });
  assert.equal(cliente.conectado(), false);
  await assert.rejects(cliente.pausar(), (e) => e.tipo === 'sin-sesion');
});
