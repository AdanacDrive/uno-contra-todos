# Web de "UNO contra todos": diseño

**Fecha:** 2026-11-24 · **Tamaño:** proyecto pequeño (una sola página web)

## Para qué
Es el componente digital del juego para la Evaluación Final (Corte 3) de Creatividad e Innovación. Hoy el celular solo pone Spotify y un dado aparte, y eso es débil frente al criterio *"interacción digital integrada a las mecánicas"*. La web pasa a **controlar la dinámica**: decide cuándo para la música, dice qué hacer en cada momento y tira el dado. También resuelve el problema que más se repitió en la prueba de clase: no saber quién sigue después del lanzamiento del squishy.

## Objetivos
- Que la música suene desde la web y se detenga **varias veces por canción**, en momentos al azar.
- Que en cada pausa la pantalla indique qué hacer, y al reanudar diga **"Empieza el ponchado"**.
- Que tenga un dado digital para la carta Retroceder.
- Que tenga un enlace público que funcione en cualquier celular, sin cuentas ni instalación.

## Fuera de alcance
- Llevar la cuenta de cartas o puntajes: eso sigue siendo físico.
- Nombres de jugadores, cuentas o registro.
- Modo multijugador en varios celulares: se usa **un solo celular** en el centro de la mesa.

## Lo que haría fallar la web aunque "funcione"
- Que se pueda predecir cuándo para la música.
- Que la pantalla tenga tanto texto que nadie la lea en medio del caos.
- Que no funcione el día de la prueba (enlaces rotos, audio bloqueado o canciones con derechos).

## Flujo (decidido con el usuario)
1. **Inicio**: botón "Empezar ronda" y un enlace discreto para cargar canciones propias.
2. **Sonando**: "Canción X de 3", animación ligera y botón del dado siempre visible.
3. **Pausa al azar** (varias por canción): pantalla amarilla, **"¡Se paró la música! Todos por el squishy"** y botón **"Ya lo lanzaron"**.
4. Al tocarlo: **"Empieza el ponchado"**, y la música sigue desde donde iba.
5. **Dado (Retroceder)**: animación de tirada con resultado de 1 a 6 y "Come N cartas". Al cerrarlo se vuelve a la pantalla anterior.
6. **Fin de ronda** (después de 3 canciones): "¡Cuenten sus cartas! Gana quien tenga menos", más un recordatorio del desempate y el botón "Otra ronda".

## Estilo
Opción B del boceto, el festivo: fondo crema, morado como color principal y amarillo, azul y rojo como acentos, en la línea de la infografía y el pitch. **Sin la franja literal de la bandera.** Letra grande y legible a un metro de distancia.

## Enfoques considerados
- **Dónde vive:** se eligió GitHub Pages (el usuario ya tiene sesión de GitHub). Se descartaron una playlist de YouTube incrustada (bloqueos, anuncios, fragilidad) y un artifact de Claude (el profe podría necesitar iniciar sesión).
- **Música:** se eligieron **canciones reales con licencia libre** (Pixabay Music / Free Music Archive, CC0 o similar), de 6 a 10 temas festivos, descargados solo tras aprobación del usuario. Se descartaron canciones propias publicadas (derechos de autor) y música generada por código (suena artificial). En todos los casos se incluye "cargar canciones desde el celular", que suenan solo en ese dispositivo y no se publican.

## Decisiones mías (revisables)
- HTML, CSS y JavaScript sin frameworks ni proceso de compilación.
- Pausas: cada canción usa un tramo de unos 60 a 90 s y tiene de 2 a 4 pausas, separadas por al menos 12 s. Así ninguna ronda se alarga demasiado y quedan cerca de los 15 a 30 min que dura una partida.
- Cada ronda toma 3 canciones al azar de la lista, sin repetir dentro de la misma ronda.
- La pantalla no se apaga mientras se juega (Wake Lock, cuando el navegador lo permite).
- Una página de créditos con la licencia de cada canción.

## Lo que queda para quien construye
Las animaciones exactas, los tamaños y cómo se escribe el código. Antes de entregar se verifica a tamaño celular en el navegador.
