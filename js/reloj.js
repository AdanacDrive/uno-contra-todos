// Reloj que solo avanza mientras la música suena. Spotify no le dice a la web
// en qué segundo va la canción, así que el juego lleva su propia cuenta.
export function crearReloj(ahora = () => performance.now()) {
  let acumulado = 0;
  let desde = null; // momento en que arrancó el tramo actual, o null si está en pausa

  return {
    iniciar() {
      acumulado = 0;
      desde = ahora();
    },
    pausar() {
      if (desde === null) return;
      acumulado += ahora() - desde;
      desde = null;
    },
    reanudar() {
      if (desde === null) desde = ahora();
    },
    transcurrido() {
      return (acumulado + (desde === null ? 0 : ahora() - desde)) / 1000;
    },
  };
}
