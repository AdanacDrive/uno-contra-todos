import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearReloj } from '../js/reloj.js';

test('el reloj cuenta solo el tiempo que la música estuvo sonando', () => {
  let ms = 0;
  const reloj = crearReloj(() => ms);
  reloj.iniciar();
  ms = 10_000;
  assert.equal(reloj.transcurrido(), 10);
  reloj.pausar();
  ms = 40_000; // 30 s en pausa no cuentan
  assert.equal(reloj.transcurrido(), 10);
  reloj.reanudar();
  ms = 45_000;
  assert.equal(reloj.transcurrido(), 15);
});

test('pausar o reanudar dos veces no descuadra el reloj', () => {
  let ms = 0;
  const reloj = crearReloj(() => ms);
  reloj.iniciar();
  ms = 5_000;
  reloj.pausar();
  reloj.pausar();
  ms = 9_000;
  reloj.reanudar();
  reloj.reanudar();
  ms = 11_000;
  assert.equal(reloj.transcurrido(), 7);
});

test('iniciar vuelve a cero', () => {
  let ms = 0;
  const reloj = crearReloj(() => ms);
  reloj.iniciar();
  ms = 20_000;
  reloj.iniciar();
  ms = 21_000;
  assert.equal(reloj.transcurrido(), 1);
});
