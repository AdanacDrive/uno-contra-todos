---
name: UNO contra todos
description: The table's game master, shouted in painted bus-sign lettering.
colors:
  morado: "#3b1f78"
  amarillo: "#ffc81e"
  cobalto: "#1f4fd1"
  rojo: "#c42620"
  rosa: "#ff6fa8"
  crema: "#fbf1dc"
  crema-sombra: "#efdfbd"
  tinta: "#24124e"
  lavanda: "#e6dcfb"
typography:
  display:
    fontFamily: "Bungee, Figtree, system-ui, sans-serif"
    fontSize: "clamp(5rem, 30vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.95
  headline:
    fontFamily: "Bungee, Figtree, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 11vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.02
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 8vw, 2.1rem)"
    fontWeight: 800
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 500
    lineHeight: 1.35
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 800
    letterSpacing: "0.02em"
rounded:
  link: "6px"
  tile: "14px"
  button: "18px"
  die: "28px"
  pill: "999px"
spacing:
  stack: "18px"
  gutter: "22px"
  edge: "28px"
components:
  button-hero:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.morado}"
    typography: "{typography.headline}"
    rounded: "{rounded.button}"
    padding: "18px 26px"
    height: "84px"
    width: "min(100%, 340px)"
  button-hero-on-crema:
    backgroundColor: "{colors.morado}"
    textColor: "{colors.crema}"
  button-dark:
    backgroundColor: "{colors.morado}"
    textColor: "{colors.crema}"
    rounded: "{rounded.button}"
    padding: "18px 26px"
    height: "64px"
    width: "min(100%, 320px)"
  button-light:
    backgroundColor: "{colors.crema}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "18px 26px"
    height: "64px"
    width: "min(100%, 320px)"
  button-dice:
    backgroundColor: "{colors.rojo}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    padding: "18px 26px"
    height: "64px"
    width: "min(100%, 320px)"
  counter-pill:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  link-quiet:
    textColor: "{colors.lavanda}"
    rounded: "{rounded.link}"
  die:
    backgroundColor: "{colors.crema}"
    rounded: "{rounded.die}"
    padding: "22px"
    size: "150px"
---

# Design System: UNO contra todos

## Overview

**Creative North Star: "The Chiva Sign"**

The screen is a hand-painted bus sign (rotulación popular, chiva lettering) that runs the game. Every state is a full field of one flat colour with one instruction painted on it in Bungee, read from about a metre away across a noisy table. There is no chrome: no header, no player, no scrubber, no cards-in-a-grid. One screen, one job, one big tap target.

Colour is state. Purple is the resting ground, yellow floods in when the music stops, cobalt carries the "ponchado" restart, red owns the die and penalties, cream closes the round. The festive Colombian feel comes from saturated popular-sign colour and painted letter shading, never from the flag: the system never stacks yellow, blue and red as stripes.

Density is deliberately low. A screen holds a counter, an illustration or drawn icon, a sign headline, one line of help and at most one primary action, stacked and centred.

**Key Characteristics:**
- Full-bleed single-colour fields per game state; the field colour is the message.
- Bungee sign lettering for anything the table must read; Figtree for everything else.
- Painted drop-shading on sign lettering (a solid colour offset under the letters).
- Big, rounded, centred thumb targets (64px minimum, 84px for the hero action).
- Drawn SVG icons and illustrations with thick round strokes; no glyph icons, no photos.
- Motion that lands: stamp, drop, roll, all on one decisive ease-out.

## Colors

Saturated popular-sign colours on a deep purple ground, with cream as paper and ink.

### Primary
- **Chiva Purple** (morado): the home ground of the app (body background, theme-color) and the ink colour of sign lettering on cream. Also the dark button on the yellow stop screen and the hero button on the cream end screen.

### Secondary
- **Stop Yellow** (amarillo): the stop-screen flood, the game name's top line, the focus ring, text selection and link underlines. Yellow means "the music stopped, act now".
- **Ponchado Cobalt** (cobalto): the full field of the ponchado screen, the only cobalt surface.

### Tertiary
- **Penalty Red** (rojo): the die screen field, the "Salió Retroceder" button, the stop headline, the end-screen instruction and the painted shade under the game name.
- **Squishy Pink** (rosa): the squishy ball illustration and one equaliser bar. Illustration only, never a surface or text colour.

### Neutral
- **Sign Cream** (crema): body text on dark fields, the hero button, the die face, the end-screen field.
- **Cream Shade** (crema-sombra): the painted side of the die only.
- **Night Ink** (tinta): text on yellow and cream fields, die pips, light-button text.
- **Lavender Mist** (lavanda): secondary help text and quiet links on the purple field.

### Named Rules
**The Colour Is State Rule.** Each game state owns one full-bleed field colour (purple playing, yellow stopped, cobalt ponchado, red die, cream end). Do not reuse a state colour as another state's field, and do not split a screen into colour blocks.

**The No Flag Rule.** Yellow, cobalt and red never appear together as adjacent bands or stripes. The Colombian feel comes from sign-painting colour and lettering, not from the flag.

**The Tinted Help Rule.** Secondary text on a coloured field is a pale tint of that field (lavender on purple, pale blue on cobalt, pale rose on red), not grey and not reduced opacity.

## Typography

**Display Font:** Bungee (with Figtree, system-ui fallback)
**Body Font:** Figtree 500 / 700 / 800 (with system-ui fallback)

**Character:** Bungee is the painted bus-sign voice: blocky, upright, always loud. Figtree is the friendly sans that explains, set heavy so it holds up at a distance.

### Hierarchy
- **Display** (Bungee 400, clamp(5rem, 30vw, 7.5rem), 0.95): the word "UNO" in the stacked game-name sign on the start screen only. The sign stacks three lines at different sizes: "UNO" huge, "contra" small and letterspaced (0.08em), "todos" large.
- **Headline** (Bungee 400, clamp(2.1rem, 11vw, 3rem), 1.02, balanced wrap): the one instruction per screen ("Sigan jugando", "Empieza el ponchado", "Come 4 cartas"). The stop headline runs slightly larger (clamp(2.6rem, 14vw, 3.8rem), 0.98).
- **Title** (Figtree 800, clamp(1.6rem, 8vw, 2.1rem)): the action line under a headline ("Todos por el squishy", "Gana quien tenga menos").
- **Body** (Figtree 500, 1.2rem, 1.35, max 22ch): one sentence of help per screen.
- **Label** (Figtree 800, 1.15rem, 0.02em): the counter pill ("Canción 1 de 3") and button text (800, 1.35rem).

### Named Rules
**The Sign Speaks Once Rule.** Bungee appears at most once per screen as the headline (twice only in the stacked game-name sign). It is never used for body, help text or lists.

**The Metre Away Rule.** Nothing the table must act on is smaller than 1.15rem, and Figtree is never set lighter than 500.

## Layout

Each game state is a full-viewport screen (min-height 100dvh) stacked in one grid cell; only the active one is shown. Content is a single centred column (flex column, centred on both axes, centred text) with an 18px gap, 22px side gutters and 28px top and bottom padding that grows to the safe-area insets. Buttons and cards cap at 320 to 340px wide so they stay a thumb-sized block on any phone. Help text caps at 22ch. Quiet secondary links sit in a footer group 28px below the primary action with a 14px gap.

There are no breakpoints: the type ramp scales with viewport width through clamp(), so the same composition holds from small phones to a projected laptop. The credits page is the only reading layout: a 560px centred column on the purple field.

## Elevation & Depth

The system is flat colour fields with painted depth, not stacked UI layers. Depth comes from two sources: sign-painter letter shading (a solid colour shade offset straight down under Bungee lettering) and soft purple-black ambient shadows under objects that sit on the field (buttons, the die, the tie-break card). Shadows are always cast straight down, as if the phone lies flat under a ceiling light.

### Shadow Vocabulary
- **Sign shade, large** (`text-shadow: 0 6px 0 #c42620, 0 14px 24px rgb(20 8 50 / .45)`): the "UNO" of the game-name sign.
- **Sign shade, stop** (`text-shadow: 0 4px 0 #3b1f78`): the red stop headline on yellow.
- **Button lift** (`box-shadow: 0 14px 22px rgb(20 8 50 / .28)`): ambient lift under every button; tightens to `0 6px 12px rgb(20 8 50 / .25)` as the button presses down 4px.
- **Die body** (`box-shadow: 0 10px 0 #efdfbd, 0 22px 30px rgb(60 0 0 / .35)`): the die's painted side plus its cast shadow; part of the die drawing, not a general surface treatment.
- **Card rest** (`box-shadow: 0 8px 20px rgb(59 31 120 / .12)`): the white tie-break card on cream.

### Named Rules
**The Painted Shade Rule.** Solid, zero-blur offset shading belongs to sign lettering and drawn objects (the die), the way a sign painter shades letters. UI surfaces get only soft ambient shadow.

## Shapes

Generously rounded, friendly corners throughout: 18px on buttons and the tie-break card, 28px on the die, 14px on list tiles, full pills on the counter, 6px on links (for the focus ring). No hard square corners and no outlines or borders on surfaces; shapes are defined by fill against the field. Icons are drawn on a 24px grid with 2.2 to 2.4 strokes, round caps and joins; illustrations (the squishy ball) are flat filled shapes with one highlight and one ground shadow ellipse.

## Components

### Buttons
Chunky, pressable, centred; one primary action per screen.
- **Shape:** gently rounded (18px), no border, minimum 64px tall.
- **Hero:** cream on purple (morado on crema on the end screen), Bungee 1.6rem, 84px tall, up to 340px wide. Used for "Empezar ronda" and "Otra ronda".
- **Field buttons:** Figtree 800 1.35rem, up to 320px wide. Dark (purple on the yellow stop screen), light (cream on the red die screen), dice (red with white text, leading die icon, on the purple playing screen).
- **Press:** moves down 4px and the shadow tightens, on a 0.15s ease-out (cubic-bezier(.16, 1, .3, 1)).
- **Focus:** 3px yellow outline, 4px offset.
- **Disabled:** 55% opacity.

### Counter Pill
- **Style:** Figtree 800 on a translucent white wash (12%) over the field (16% black on red), full pill. States progress or context ("Canción 2 de 3"), never decoration.

### Quiet Links
- **Style:** lavender Figtree 700 1.05rem with a 4px-offset underline in 60% yellow, optional leading 1.5em drawn icon. Used for secondary paths (own songs, credits, back to the game).

### Cards / Containers
- **Tie-break card:** white, 18px corners, 16px 20px padding, left-aligned numbered list, soft card-rest shadow. Only container on the cream end screen.
- **Credit tiles:** 8% white wash on purple, 14px corners, 12px 16px padding.

### The Die (signature)
A 150px cream rounded square (28px) with a 3x3 pip grid of 24px night-ink dots, a painted cream-shade side and cast shadow. It rolls in with a 0.7s rotate-and-scale on the shared ease-out.

### The Stop Slam (signature)
The yellow field appears, the red sign headline stamps in (scale 1.5 and -4deg with blur, to rest, 0.45s) and the pink squishy drops from above with a squash on landing (0.7s). The playing screen's five-bar equaliser (22px bars in yellow, pink, cream, light blue and red, desynchronised) is the only looping motion. All motion collapses under prefers-reduced-motion.

## Do's and Don'ts

### Do:
- **Do** give each game state one full-bleed field colour and keep one instruction and one primary action per screen.
- **Do** set the screen's headline in Bungee 400, and set everything else in Figtree at 500 or heavier.
- **Do** keep tap targets at 64px tall or more (84px for the hero action) and up to 320 to 340px wide.
- **Do** draw icons as inline SVG on a 24px grid with 2.2 to 2.4 round strokes in currentColor.
- **Do** use the shared ease-out (cubic-bezier(.16, 1, .3, 1)) for every entrance and press, and honour prefers-reduced-motion.

### Don't:
- **Don't** stack yellow, cobalt and red as stripes or bands; no literal Colombian flag.
- **Don't** add music-player furniture: album art, scrubbers, playlists, track lists.
- **Don't** put Bungee on body text, help text, lists or more than one headline per screen.
- **Don't** use grey or reduced-opacity text for secondary copy on a coloured field; use the field's pale tint.
- **Don't** add hard, zero-blur offset shadows to buttons, cards or other UI surfaces; solid offset shading is reserved for sign lettering and the die.
