// Elige n canciones distintas al azar (Fisher-Yates parcial sobre una copia).
export function elegirCanciones(lista, n = 3, rng = Math.random) {
  const copia = [...lista];
  const total = Math.min(n, copia.length);
  for (let i = 0; i < total; i++) {
    const j = i + Math.floor(rng() * (copia.length - i));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, total);
}

// Arma la ronda: prefiere las canciones propias y completa con las del juego si faltan.
export function armarRonda(propias, porDefecto, n = 3, rng = Math.random) {
  if (propias.length >= n) return elegirCanciones(propias, n, rng);
  const relleno = elegirCanciones(porDefecto, n - propias.length, rng);
  return elegirCanciones([...propias, ...relleno], n, rng);
}
