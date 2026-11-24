import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tirarDado } from '../js/dado.js';

test('el dado da 1 con rng 0 y 6 con rng casi 1', () => {
  assert.equal(tirarDado(() => 0), 1);
  assert.equal(tirarDado(() => 0.9999), 6);
});

test('el dado siempre da un entero entre 1 y 6', () => {
  for (let i = 0; i < 500; i++) {
    const n = tirarDado();
    assert.ok(Number.isInteger(n) && n >= 1 && n <= 6);
  }
});
