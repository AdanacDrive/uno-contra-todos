# Modo Spotify: diseño

**Fecha:** 2026-11-24 · **Tamaño:** cambio pequeño sobre la web existente

## Para qué
Las canciones libres de derechos no las conoce nadie. El usuario tiene Spotify Premium y quiere que suenen éxitos (Top 50 o la playlist que pongan). La web pasa a **controlar la app de Spotify**: la pausa al azar, la reanuda y salta de canción. El resto del juego no cambia.

## Cómo funciona (decisiones mías, revisables)
- En la pantalla de inicio aparece un botón **"Conectar Spotify"**. El inicio de sesión se hace con el método oficial para páginas web sin servidor (PKCE), con permisos solo para **ver y controlar la reproducción**.
- Los jugadores ponen a sonar en Spotify la playlist que quieran, en ese celular o en un parlante conectado. Después tocan "Empezar ronda" en la web.
- Cada ronda tiene 3 tramos de 60 a 90 s, con las mismas pausas que ahora (2 a 4, separadas por 12 s como mínimo). Al terminar cada tramo, la web **salta a la siguiente canción** de Spotify.
- El tiempo se cuenta con un reloj que se detiene en las pausas, porque Spotify no le pasa a la web el segundo exacto de la canción.
- Si Spotify no tiene nada sonando, o falla la conexión, sale la pantalla **"La música se detuvo"** con indicaciones ("Abre Spotify y pon a sonar tu playlist").
- Sin conectar Spotify, la web funciona igual que ahora, con las canciones de Pixabay. Esa es la opción por defecto y el respaldo.

## Fuera de alcance
- Elegir la playlist desde la web, buscar canciones o mostrar carátulas.
- Que suene sin Premium. Spotify no lo permite.

## Restricciones de Spotify (verificadas el 2026-11-24 en developer.spotify.com)
- Desde febrero de 2026, las apps en modo desarrollo exigen que **el dueño tenga Premium**, permiten **un solo Client ID por desarrollador** y solo funcionan para usuarios **agregados a mano** en el panel.
- Los endpoints de reproducción (pause, play, next, estado del reproductor, dispositivos) **siguen disponibles**.
- El usuario debe crear la app en el panel de Spotify. El Client ID es público y puede ir en el código.
- Redirect URIs: `https://adanacdrive.github.io/uno-contra-todos/` y `http://127.0.0.1:5180/` (para pruebas locales).

## Enfoques considerados
- **Controlar la app de Spotify con la Web API** *(elegido)*: funciona en celulares y con parlantes.
- **Web Playback SDK** (que el audio suene dentro de la página): no funciona en navegadores de celular. Descartado.
- **Playlist de YouTube incrustada**: no necesita cuentas, pero tiene anuncios y videos que no dejan incrustarse. Queda como plan B si Spotify falla.
