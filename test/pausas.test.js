import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarPausas } from '../js/pausas.js';
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
