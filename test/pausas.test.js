import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarPausas, avanzarPausas } from '../js/pausas.js';
import { rngConSemilla } from './util.js';

function revisarPausas({ fin, pausas }) {
  for (const p of pausas) {
    assert.ok(p >= 8 && p <= fin - 5, `pausa ${p} fuera de [8, ${fin - 5}]`);
  }
  for (let i = 1; i < pausas.length; i++) {
    assert.ok(pausas[i] > pausas[i - 1], 'pausas no ordenadas');
    assert.ok(pausas[i] - pausas[i - 1] >= 12, `pausas a menos de 12 s: ${pausas}`);
  }
}

test('una canción larga usa un tramo de 60 a 90 s con 2 a 4 pausas', () => {
  for (let semilla = 1; semilla <= 200; semilla++) {
    const r = generarPausas(180, rngConSemilla(semilla));
    assert.ok(r.fin >= 60 && r.fin <= 90, `fin ${r.fin}`);
    assert.ok(r.pausas.length >= 2 && r.pausas.length <= 4, `cantidad ${r.pausas.length}`);
    revisarPausas(r);
  }
});

test('una canción de 45 s se recorta a su duración y respeta los márgenes', () => {
  for (let semilla = 1; semilla <= 200; semilla++) {
    const r = generarPausas(45, rngConSemilla(semilla));
    assert.equal(r.fin, 45);
    assert.ok(r.pausas.length >= 1, 'sin pausas');
    revisarPausas(r);
  }
});

test('avanzarPausas salta todas las pausas vencidas y las que caen a menos de 12 s', () => {
  const pausas = [10, 25, 40, 70];
  assert.deepEqual(avanzarPausas(pausas, 0, 5), { dispara: false, siguiente: 0 });
  assert.deepEqual(avanzarPausas(pausas, 0, 10.2), { dispara: true, siguiente: 1 });
  // El dado o el bloqueo dejaron pasar 10 y 25: una sola pausa, y la de 40 (a 9 s) también se descarta.
  assert.deepEqual(avanzarPausas(pausas, 0, 31), { dispara: true, siguiente: 3 });
  assert.deepEqual(avanzarPausas(pausas, 3, 80), { dispara: true, siguiente: 4 });
  assert.deepEqual(avanzarPausas(pausas, 4, 90), { dispara: false, siguiente: 4 });
});
