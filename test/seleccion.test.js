import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elegirCanciones } from '../js/seleccion.js';
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
