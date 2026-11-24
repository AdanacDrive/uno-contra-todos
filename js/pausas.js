// Decide en qué segundos de una canción se detiene la música.
// Devuelve { fin, pausas }: fin es dónde termina el tramo que suena de esa canción.
const TRAMO_MIN = 60;
const TRAMO_EXTRA = 30;
const MARGEN_INICIO = 8;
const MARGEN_FINAL = 5;
const SEPARACION_MIN = 12;
const INTENTOS = 50;

export function generarPausas(duracionCancion, rng = Math.random) {
  const fin = Math.min(duracionCancion, TRAMO_MIN + rng() * TRAMO_EXTRA);
  const cantidad = 2 + Math.floor(rng() * 3);
  const desde = MARGEN_INICIO;
  const hasta = fin - MARGEN_FINAL;
  const pausas = [];

  for (let i = 0; i < INTENTOS && pausas.length < cantidad && hasta > desde; i++) {
    const t = desde + rng() * (hasta - desde);
    if (pausas.every((p) => Math.abs(p - t) >= SEPARACION_MIN)) pausas.push(t);
  }

  return { fin, pausas: pausas.sort((a, b) => a - b) };
}
