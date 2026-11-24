import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elegirCanciones, armarRonda } from '../js/seleccion.js';
import { rngConSemilla } from './util.js';

const lista = Array.from({ length: 8 }, (_, i) => ({ titulo: `Tema ${i}`, archivo: `t${i}.mp3` }));

test('elige 3 canciones distintas de la lista', () => {
  for (let semilla = 1; semilla <= 100; semilla++) {
    const elegidas = elegirCanciones(lista, 3, rngConSemilla(semilla));
    assert.equal(elegidas.length, 3);
    assert.equal(new Set(elegidas.map((c) => c.archivo)).size, 3);
    for (const c of elegidas) assert.ok(lista.includes(c));
  }
});

test('con una lista de 2 devuelve las 2 sin inventar más', () => {
  const corta = lista.slice(0, 2);
  const elegidas = elegirCanciones(corta, 3, rngConSemilla(7));
  assert.equal(elegidas.length, 2);
  assert.equal(new Set(elegidas).size, 2);
});

test('no modifica la lista original', () => {
  const copia = [...lista];
  elegirCanciones(lista, 3, rngConSemilla(3));
  assert.deepEqual(lista, copia);
});

const propia = (i) => ({ titulo: `Mía ${i}`, archivo: `blob:${i}` });

test('armarRonda usa solo canciones propias cuando hay 3 o más', () => {
  const propias = [propia(1), propia(2), propia(3), propia(4)];
  const ronda = armarRonda(propias, lista, 3, rngConSemilla(5));
  assert.equal(ronda.length, 3);
  for (const c of ronda) assert.ok(propias.includes(c));
});

test('armarRonda completa con canciones del juego cuando hay menos de 3 propias', () => {
  const propias = [propia(1)];
  const ronda = armarRonda(propias, lista, 3, rngConSemilla(9));
  assert.equal(ronda.length, 3);
  assert.ok(ronda.includes(propias[0]));
  assert.equal(ronda.filter((c) => lista.includes(c)).length, 2);
  assert.equal(new Set(ronda).size, 3);
});

test('armarRonda sin canciones propias elige 3 del juego', () => {
  const ronda = armarRonda([], lista, 3, rngConSemilla(2));
  assert.equal(ronda.length, 3);
  for (const c of ronda) assert.ok(lista.includes(c));
});
