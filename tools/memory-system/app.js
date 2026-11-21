/* Sistema Mayor de Memoria (T023) — Todologo
 * Código fonético 0–9, Casillero Mental 00–99 completo, Decodificador palabra↔número y Reto de Secuencias.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const saved = window.SiteProgress
    ? SiteProgress.tool('memory-system')
    : { get: (k, d) => d, set: () => {} };

  var LANG = 'es';
  (function initLang() {
    let pick = null;
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'es' || q === 'en') pick = q;
    } catch (e) {}
    try {
      if (!pick) {
        const g = localStorage.getItem('todologo.lang');
        if (g === 'es' || g === 'en') pick = g;
      }
    } catch (e) {}
    if (!pick) {
      const s = saved.get('lang', null);
      if (s === 'es' || s === 'en') pick = s;
    }
    LANG = pick || 'es';
    try { localStorage.setItem('todologo.lang', LANG); } catch (e) {}
  })();

  const UI = {
    es: {
      docTitle: 'Sistema Mayor de Memoria — Todologo',
      brandMark: 'SISTEMA <span>MAYOR</span><sup>T023</sup>',
      brandSub: 'Código fonético 0–9, casillero 00–99, Palacio Mental y secuencias',
      railTitle: 'Ejercicios, en orden',
      railPath: 'Domina los dígitos 0–9, el casillero 00–99, tu Palacio de la Memoria y las secuencias largas.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Explora las consonantes, las imágenes del casillero 00–99 y el traductor de números a historias.',
        practice: 'Entrena la conversión instantánea entre números e imágenes mentales.',
        test: '10 preguntas contrarreloj. Consigue 90% o más para marcar este bloque con ✓.'
      },
      spanHeading: 'Longitud de secuencia',
      spans: { '6': '6 dígitos', '8': '8 dígitos', '10': '10 dígitos' },
      statAcc: 'Precisión',
      statTime: 'Tiempo',
      statStreak: 'Racha',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      cleanExit: 'Salir de vista limpia',
      settings: 'Ajustes',
      howItWorks: 'Cómo funciona',
      closeSheet: 'Listo',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> para elegir · <kbd>Enter</kbd> comprobar · <kbd>Espacio</kbd> siguiente',
      credit: 'El cerebro humano olvida números abstractos en segundos, pero recuerda escenas visuales absurdas durante días. El Sistema Mayor traduce cada par de dígitos en un objeto concreto. Parte de Todologo.',
      goPractice: 'Practicar este bloque →',
      nextBtn: 'Siguiente',
      tryAgain: 'Intentar de nuevo',
      testDone: 'Examen completado',
      passedMsg: '¡Dominado! Lograste al menos 90% de precisión.',
      retryMsg: 'Necesitas 90% (9/10) para marcar este ejercicio. ¡Vuelve a intentarlo!',
      bestNone: 'Sin marca de examen todavía en este ejercicio.',
      bestFmt: (pct, s) => `Mejor examen: <b>${pct}%</b> en ${s}s`,
      correctExcl: '¡Correcto!',
      wrongExcl: (ans) => `Era: ${ans}`,
      memorizeBtn: 'Ya lo memoricé → Ocultar y escribir',
      walkedBtn: 'Ya recorrí el palacio → Evocar',
      checkSeqBtn: 'Comprobar secuencia',
      palacePresetCustom: 'Mi palacio (editable)',
      palacePresetNums: '16 dígitos con Loci',
      palacePresetList: 'Ejemplo lista / discurso'
    },
    en: {
      docTitle: 'Major Memory System — Todologo',
      brandMark: 'MAJOR <span>SYSTEM</span><sup>T023</sup>',
      brandSub: 'Phonetic digits 0–9, 00–99 peg list, Memory Palace & span',
      railTitle: 'Drills, in order',
      railPath: 'Master digits 0–9, the 00–99 peg list, the Memory Palace (Loci) and long sequences.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Explore the phonetic consonants, the 00–99 peg images and the live number-to-story converter.',
        practice: 'Train instant recall between numbers and mental peg images.',
        test: '10 timed questions. Score 90% or higher to earn a ✓ on this drill.'
      },
      spanHeading: 'Sequence length',
      spans: { '6': '6 digits', '8': '8 digits', '10': '10 digits' },
      statAcc: 'Accuracy',
      statTime: 'Time',
      statStreak: 'Streak',
      restart: 'Restart',
      cleanView: 'Clean view',
      cleanExit: 'Exit clean view',
      settings: 'Settings',
      howItWorks: 'How it works',
      closeSheet: 'Done',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> to pick · <kbd>Enter</kbd> submit · <kbd>Space</kbd> next',
      credit: 'Human working memory drops raw digits in seconds, yet retains vivid visual scenes effortlessly. The Major System turns every digit pair into a concrete object. Part of Todologo.',
      goPractice: 'Practice this drill →',
      nextBtn: 'Next',
      tryAgain: 'Run again',
      testDone: 'Test complete',
      passedMsg: 'Mastered! You scored 90% or higher.',
      retryMsg: 'Score 90% (9/10) to earn a tick on this drill. Give it another run!',
      bestNone: 'No test score saved for this drill yet.',
      bestFmt: (pct, s) => `Best test: <b>${pct}%</b> in ${s}s`,
      correctExcl: 'Correct!',
      wrongExcl: (ans) => `Answer: ${ans}`,
      memorizeBtn: 'I memorized it → Hide & recall',
      walkedBtn: 'Walked the palace → Recall',
      checkSeqBtn: 'Check sequence',
      palacePresetCustom: 'My palace (editable)',
      palacePresetNums: '16 digits via Loci',
      palacePresetList: 'Demo list / speech'
    }
  };

  const t = () => UI[LANG] || UI.es;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------------- Código Fonético 0–9 (Hispano / Inglés) ----------------
  const DIGITS = [
    { d: '0', consEs: 'R / RR', consEn: 'R (o S/Z)', wordEs: 'aRo', wordEn: 'oRe', hintEs: 'Cero y Aro llevan R; el 0 es una rueda.', hintEn: 'Zero / Ring.' },
    { d: '1', consEs: 'T / D', consEn: 'T / D', wordEs: 'Té', wordEn: 'Tie', hintEs: 'La T tiene 1 solo trazo vertical.', hintEn: 'T has 1 vertical stroke.' },
    { d: '2', consEs: 'N / Ñ', consEn: 'N', wordEs: 'Noé', wordEn: 'Noah', hintEs: 'La N tiene 2 patas verticales.', hintEn: 'n has 2 downstrokes.' },
    { d: '3', consEs: 'M', consEn: 'M', wordEs: 'Humo', wordEn: 'Ma', hintEs: 'La M tiene 3 patas verticales.', hintEn: 'm has 3 downstrokes.' },
    { d: '4', consEs: 'C / K / Q', consEn: 'C / K / Q', wordEs: 'oCa', wordEn: 'Key', hintEs: 'Empieza como la palabra Cuatro.', hintEn: 'Hard C/K sound (Cuatro).' },
    { d: '5', consEs: 'L / LL', consEn: 'L', wordEs: 'oLa', wordEn: 'Law', hintEs: 'En números romanos L = 50 (5 dedos forman una L).', hintEn: 'Roman numeral L = 50.' },
    { d: '6', consEs: 'S / Z', consEn: 'S / Z', wordEs: 'oSo', wordEn: 'Zoo', hintEs: 'Empieza como la palabra Seis.', hintEn: 'Sibilant S/Z sound (Seis).' },
    { d: '7', consEs: 'F / J', consEn: 'F', wordEs: 'uFo', wordEn: 'Ufo', hintEs: 'El 7 con barra central parece una F invertida.', hintEn: 'A 7 looks like a flipped F.' },
    { d: '8', consEs: 'G / CH', consEn: 'G / CH', wordEs: 'haCHa', wordEn: 'Chew', hintEs: 'El 8 parece unas Gafas o la CH de oCHo.', hintEn: 'Eight / oCHo.' },
    { d: '9', consEs: 'P / B / V', consEn: 'P / B / V', wordEs: 'aVe', wordEn: 'Bee', hintEs: 'El 9 es una P en espejo y una b girada.', hintEn: '9 looks like a mirrored P or b.' }
  ];

  // ---------------- Casillero Mental 00–99 completo ----------------
  // Cada entrada: [numStr, palabraEs, consPair, pistaVisualEs]
  const RAW_PEGS = [
    ['00', 'RaRo / Rueda', 'R-R', 'Una rueda gigante rodando'],
    ['01', 'RaTa', 'R-T', 'Una rata gris con queso'],
    ['02', 'RaNa', 'R-N', 'Una rana verde saltando'],
    ['03', 'RaMa', 'R-M', 'Una rama de árbol seca'],
    ['04', 'RoCa', 'R-C', 'Una roca volcánica pesada'],
    ['05', 'RuLo / Raíl', 'R-L', 'Un raíl de tren brillante'],
    ['06', 'RoSa', 'R-S', 'Una rosa roja con espinas'],
    ['07', 'RiFa', 'R-F', 'Un boleto de rifa dorado'],
    ['08', 'RaCHa / RoCHa', 'R-CH', 'Un hacha partiendo un tronco'],
    ['09', 'RoPa', 'R-P', 'Un tendedero lleno de ropa'],
    ['10', 'ToRo', 'T-R', 'Un toro negro embistiendo'],
    ['11', 'DaDo', 'D-D', 'Un dado de casino en el aire'],
    ['12', 'TiNa', 'T-N', 'Una tina de baño con espuma'],
    ['13', 'DaMa', 'D-M', 'Una dama con vestido medieval'],
    ['14', 'TaCo', 'T-C', 'Un taco mexicano picante'],
    ['15', 'TeLa', 'T-L', 'Un rollo de tela de seda'],
    ['16', 'TaZa', 'T-Z', 'Una taza de café humeante'],
    ['17', 'TuFo / GaFas', 'T-F', 'Un tubo de escape echando humo'],
    ['18', 'TeCHo / DuCHa', 'D-CH', 'Una ducha de agua helada'],
    ['19', 'TuBo', 'T-B', 'Un tubo de cobre largo'],
    ['20', 'NoRia', 'N-R', 'Una noria de feria iluminada'],
    ['21', 'NiDo', 'N-D', 'Un nido de pájaro con huevos'],
    ['22', 'NeNe', 'N-N', 'Un nene con chupete'],
    ['23', 'NeMo', 'N-M', 'Un pez payaso naranja'],
    ['24', 'NuCa', 'N-C', 'Un collar brillando en la nuca'],
    ['25', 'NiLo', 'N-L', 'Una pirámide junto al río Nilo'],
    ['26', 'NaSa', 'N-S', 'Un cohete espacial de la NASA'],
    ['27', 'NaVe / NieVe', 'N-F/V', 'Un muñeco de nieve gigante'],
    ['28', 'NoCHe', 'N-CH', 'Una luna llena en la noche'],
    ['29', 'NuBe', 'N-B', 'Una nube esponjosa con rayos'],
    ['30', 'MaR', 'M-R', 'Una ola gigante del mar'],
    ['31', 'MoTo', 'M-T', 'Una moto deportiva rugiendo'],
    ['32', 'MoNo', 'M-N', 'Un mono comiendo plátano'],
    ['33', 'MoMia', 'M-M', 'Una momia envuelta en vendas'],
    ['34', 'MaCa', 'M-C', 'Una hamaca colgada entre palmeras'],
    ['35', 'MuLa', 'M-L', 'Una mula cargando alforjas'],
    ['36', 'MeSa', 'M-S', 'Una mesa de roble servida'],
    ['37', 'MaFia / MoFa', 'M-F', 'Un sombrero fedora negro'],
    ['38', 'MeCHa', 'M-CH', 'Una mecha de dinamita encendida'],
    ['39', 'MaPa', 'M-P', 'Un mapa del tesoro antiguo'],
    ['40', 'CaRRo', 'C-R', 'Un carro antiguo de madera'],
    ['41', 'Cohete / CaTo', 'C-T', 'Una catana afilada'],
    ['42', 'CuNa', 'C-N', 'Una cuna de madera meciendo'],
    ['43', 'CaMa', 'C-M', 'Una cama elástica saltando'],
    ['44', 'CoCo', 'C-C', 'Un coco partido a la mitad'],
    ['45', 'CoLa', 'C-L', 'Un bote de pegamento escolar'],
    ['46', 'CaSa', 'C-S', 'Una casa con tejado rojo'],
    ['47', 'CaFé', 'C-F', 'Una cafetera expreso hirviendo'],
    ['48', 'CoCHe', 'C-CH', 'Un coche descapotable rojo'],
    ['49', 'CoPa', 'C-P', 'Una copa de cristal dorada'],
    ['50', 'LoRo', 'L-R', 'Un loro verde hablando'],
    ['51', 'LaTa', 'L-T', 'Una lata de refresco aplastada'],
    ['52', 'LuNa', 'L-N', 'Un astronauta pisando la luna'],
    ['53', 'LiMa', 'L-M', 'Una lima ácida recién cortada'],
    ['54', 'LaCa', 'L-C', 'Un bote de laca en spray'],
    ['55', 'LiLa', 'L-L', 'Un ramo de flores lilas'],
    ['56', 'LoSa / LaZo', 'L-Z', 'Un lazo de regalo gigante'],
    ['57', 'LuPa / eLFe', 'L-F', 'Un elfo con orejas puntiagudas'],
    ['58', 'LeCHe', 'L-CH', 'Una jarra de leche blanca'],
    ['59', 'LuPa', 'L-P', 'Una lupa de detective enfocando'],
    ['60', 'SiRena', 'S-R', 'Una sirena de ambulancia girando'],
    ['61', 'SeTa', 'S-T', 'Una seta roja con puntos blancos'],
    ['62', 'CiNe', 'S-N', 'Una claqueta de cine y palomitas'],
    ['63', 'SuMo', 'S-M', 'Un luchador de sumo en el ring'],
    ['64', 'SaCo', 'S-C', 'Un saco de arpillera con monedas'],
    ['65', 'SoL', 'S-L', 'Un sol radiante abrasador'],
    ['66', 'SeSo', 'S-S', 'Un cerebro brillante flotando'],
    ['67', 'SoFá', 'S-F', 'Un sofá de terciopelo rojo'],
    ['68', 'SaCHe / HaCHa', 'S-CH', 'Un serrucho cortando madera'],
    ['69', 'SoPa', 'S-P', 'Un plato de sopa hirviendo'],
    ['70', 'FaRo', 'F-R', 'Un faro costero en la tormenta'],
    ['71', 'FoTo', 'F-T', 'Una cámara tomando una foto con flash'],
    ['72', 'FaNa / FiNo', 'F-N', 'Una copa de vino fino andaluz'],
    ['73', 'FuMa', 'F-M', 'Una pipa echando aros de humo'],
    ['74', 'FoCa', 'F-C', 'Una foca aplaudiendo con una pelota'],
    ['75', 'FiLa', 'F-L', 'Una fila de fichas de dominó cayendo'],
    ['76', 'FoSa', 'F-S', 'Un foso medieval con cocodrilos'],
    ['77', 'FiFí', 'F-F', 'Un caniche blanco recién peinado'],
    ['78', 'FiCHa', 'F-CH', 'Una ficha de póker gigante'],
    ['79', 'FoBo', 'F-B', 'Un foco de teatro deslumbrante'],
    ['80', 'GoRRa', 'G-R', 'Una gorra de béisbol azul'],
    ['81', 'GaTo', 'G-T', 'Un gato negro erizado'],
    ['82', 'CHiNo', 'CH-N', 'Un sombrero cónico tradicional'],
    ['83', 'GoMa', 'G-M', 'Una goma de borrar gigante'],
    ['84', 'CHoCo', 'CH-C', 'Una tableta de chocolate fundiéndose'],
    ['85', 'CHaL', 'CH-L', 'Un chal de lana tejido'],
    ['86', 'GaS', 'G-S', 'Una bombona de gas naranja'],
    ['87', 'CHeF', 'CH-F', 'Un chef con gorro alto blanco'],
    ['88', 'CoCHe / CHuCHe', 'CH-CH', 'Un caramelo multicolor gigante'],
    ['89', 'CHaPa', 'CH-P', 'Una chapa metálica de botella'],
    ['90', 'PeRRo', 'P-R', 'Un perro pastor ladrando'],
    ['91', 'BoTa / PaTo', 'P-T', 'Un pato amarillo de goma'],
    ['92', 'PiNo / ViNo', 'P-N', 'Un pino nevado de Navidad'],
    ['93', 'PuMa', 'P-M', 'Un puma saltando entre rocas'],
    ['94', 'VaCa', 'V-C', 'Una vaca con manchas blancas y negras'],
    ['95', 'VeLa', 'V-L', 'Una vela de cera encendida'],
    ['96', 'VaSo', 'V-S', 'Un vaso de cristal con hielo'],
    ['97', 'BoFe / BaFLe', 'B-F', 'Un altavoz (bafle) vibrando'],
    ['98', 'BiCHo', 'B-CH', 'Un escarabajo brillante'],
    ['99', 'BeBé / PaPa', 'B-B', 'Una patata asada humeante']
  ];

  const PEGS = RAW_PEGS.map(([num, word, cons, hint]) => ({
    num,
    word,
    cons,
    hint
  }));

  const PEG_BY_NUM = {};
  PEGS.forEach((p) => { PEG_BY_NUM[p.num] = p; });

  const DRILLS = [
    {
      id: 'digits-0-9',
      title: { es: 'Código Fonético 0–9', en: 'Phonetic Code 0–9' },
      sub: {
        es: 'Asocia cada dígito del 0 al 9 con su consonante fija.',
        en: 'Link each digit 0–9 to its fixed consonant sound.'
      }
    },
    {
      id: 'pegs-00-29',
      title: { es: 'Casillero 00–29 (R, T, N)', en: 'Peg List 00–29 (R, T, N)' },
      sub: {
        es: 'Los primeros 30 objetos del casillero mental.',
        en: 'The first 30 concrete objects in the mental peg list.'
      },
      range: [0, 29]
    },
    {
      id: 'pegs-30-59',
      title: { es: 'Casillero 30–59 (M, C, L)', en: 'Peg List 30–59 (M, C, L)' },
      sub: {
        es: 'Objetos del 30 (MaR) al 59 (LuPa).',
        en: 'Peg objects from 30 (MaR) to 59 (LuPa).'
      },
      range: [30, 59]
    },
    {
      id: 'pegs-60-99',
      title: { es: 'Casillero 60–99 (S, F, G, P)', en: 'Peg List 60–99 (S, F, G, P)' },
      sub: {
        es: 'Objetos del 60 (SiRena) al 99 (BeBé/PaPa).',
        en: 'Peg objects from 60 (SiRena) to 99 (BeBé/PaPa).'
      },
      range: [60, 99]
    },
    {
      id: 'decoder',
      title: { es: 'Traductor Palabra ↔ Número', en: 'Word ↔ Number Decoder' },
      sub: {
        es: 'Convierte cualquier número largo en una cadena de objetos y viceversa.',
        en: 'Turn any multi-digit number into an object chain and vice versa.'
      }
    },
    {
      id: 'span-challenge',
      title: { es: 'Reto de Secuencias', en: 'Number Span Challenge' },
      sub: {
        es: 'Memoriza secuencias de 6 a 10 dígitos encadenando sus imágenes.',
        en: 'Memorize 6-to-10 digit sequences by chaining their mental images.'
      }
    },
    {
      id: 'palace-loci',
      title: { es: 'Palacio de la Memoria (Loci)', en: 'Memory Palace (Loci)' },
      sub: {
        es: 'Recorre 8 estaciones físicas de una casa y ancla recuerdos en orden espacial exacto.',
        en: 'Walk 8 spatial stations inside a house blueprint and anchor items in exact order.'
      }
    }
  ];

  const PALACE_LOCI = [
    { id: 1, x: 75,  y: 205, es: 'Puerta principal', en: 'Front Door',    placeEs: 'Recibidor', placeEn: 'Entry',      actEs: 'pegado al timbre', actEn: 'blocking the doorbell' },
    { id: 2, x: 75,  y: 82,  es: 'Perchero',         en: 'Coat Rack',     placeEs: 'Recibidor', placeEn: 'Entry',      actEs: 'colgado del abrigo', actEn: 'hanging from the coat' },
    { id: 3, x: 225, y: 82,  es: 'Sofá del salón',   en: 'Living Sofa',   placeEs: 'Salón',     placeEn: 'Living',     actEs: 'saltando en los cojines', actEn: 'bouncing on cushions' },
    { id: 4, x: 255, y: 198, es: 'Mesa de centro',   en: 'Coffee Table',  placeEs: 'Salón',     placeEn: 'Living',     actEs: 'aplastando la lámpara', actEn: 'crushing the lamp' },
    { id: 5, x: 405, y: 198, es: 'Nevera',           en: 'Fridge',        placeEs: 'Cocina',    placeEn: 'Kitchen',    actEs: 'congelándose dentro', actEn: 'freezing inside' },
    { id: 6, x: 425, y: 74,  es: 'Fregadero',        en: 'Kitchen Sink',  placeEs: 'Cocina',    placeEn: 'Kitchen',    actEs: 'salpicando jabón', actEn: 'splashing foam' },
    { id: 7, x: 560, y: 78,  es: 'Escritorio',       en: 'Study Desk',    placeEs: 'Estudio',   placeEn: 'Study',      actEs: 'sobre el teclado', actEn: 'on top of the desk' },
    { id: 8, x: 560, y: 198, es: 'Ventana al jardín',en: 'Garden Window', placeEs: 'Estudio',   placeEn: 'Study',      actEs: 'asomado al jardín', actEn: 'out the window' }
  ];

  const PALACE_PRESETS = {
    numbers: ['31 · MoTo', '74 · FoCa', '92 · PiNo', '10 · ToRo', '58 · LeCHe', '47 · CaFé', '81 · GaTo', '65 · SoL'],
    list: {
      es: ['Pan recién horneado', 'Aceite de oliva', 'Tomates gigantes', 'Café molido', 'Pila de libros', 'Paraguas rojo', 'Llaves doradas', 'Cargador'],
      en: ['Fresh bread loaf', 'Olive oil bottle', 'Giant tomatoes', 'Roasted coffee', 'Book stack', 'Red umbrella', 'Golden keys', 'Charger']
    }
  };

  const TEST_LEN = 10;

  const state = {
    drillIdx: 0,
    mode: saved.get('mode', 'study'),
    spanLen: Number(saved.get('spanLen', 6)),
    bests: saved.get('bests', {}),
    customLoci: saved.get('customLoci', ['ToRo', 'MoTo', 'FoCa', 'CaFé', 'SoL', 'GaTo', 'LuPa', 'PiNo']),
    palacePreset: 'custom',
    activeLocus: 1,
    right: 0,
    total: 0,
    streak: 0,
    t0: 0,
    frozen: null,
    answered: false,
    studyConverterVal: '317492',
    currentQ: null,
    spanPhase: 'memorize'
  };

  function currentDrill() {
    return DRILLS[state.drillIdx] || DRILLS[0];
  }

  function elapsed() {
    if (state.frozen != null) return state.frozen;
    if (!state.t0) return 0;
    return (Date.now() - state.t0) / 1000;
  }

  function fmtClock(s) {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  setInterval(() => {
    if (state.t0 && state.frozen == null) {
      $('sTime').textContent = fmtClock(elapsed());
    }
  }, 400);

  function updateStats() {
    $('sAcc').textContent = state.total ? Math.round((100 * state.right) / state.total) + '%' : '–';
    $('sStreak').textContent = state.streak;
    $('sTime').textContent = fmtClock(elapsed());
  }

  function resetSession() {
    state.right = 0;
    state.total = 0;
    state.streak = 0;
    state.t0 = state.mode === 'study' ? 0 : Date.now();
    state.frozen = null;
    updateStats();
  }

  function applyStaticI18n() {
    const L = t();
    document.documentElement.lang = LANG;
    document.title = L.docTitle;
    $('brandMark').innerHTML = L.brandMark;
    $('brandSub').textContent = L.brandSub;
    $('railTitle').textContent = L.railTitle;
    $('railPath').textContent = L.railPath;
    $('langHeading').textContent = L.langHeading;
    $('langSel').value = LANG;
    $('modeHeading').textContent = L.modeHeading;
    $('spanHeading').textContent = L.spanHeading;
    $('statAccLabel').textContent = L.statAcc;
    $('statTimeLabel').textContent = L.statTime;
    $('statStreakLabel').textContent = L.statStreak;
    $('restartBtn').textContent = L.restart;
    $('cleanBtn').textContent = L.cleanView;
    $('cleanExit').textContent = L.cleanExit;
    $('settingsBtn').textContent = L.settings;
    $('howBtn').textContent = L.howItWorks;
    $('closeSheet').textContent = L.closeSheet;
    $('keysHint').innerHTML = L.keysHint;
    $('creditText').textContent = L.credit;

    document.querySelectorAll('#modeSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.modes[v];
      b.setAttribute('aria-pressed', String(v === state.mode));
    });
    $('modeHint').textContent = L.modeHints[state.mode] || '';

    document.querySelectorAll('#spanSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.spans[v];
      b.setAttribute('aria-pressed', String(Number(v) === state.spanLen));
    });

    renderRail();
    renderBest();
  }

  function renderRail() {
    const box = $('railList');
    box.innerHTML = '';
    let nextMarked = false;
    DRILLS.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', String(idx === state.drillIdx));
      const best = state.bests[d.id];
      const passed = best && best.pct >= 90;
      let tagClass = '';
      let tagText = '';
      if (passed) {
        tagClass = 'done';
        tagText = best.pct + '%';
      } else if (!nextMarked) {
        nextMarked = true;
        tagClass = 'next';
        tagText = LANG === 'es' ? 'sig.' : 'next';
      }
      btn.innerHTML = `<span><i>${idx + 1}</i>${d.title[LANG]}</span><em class="${tagClass}">${tagText}</em>`;
      btn.addEventListener('click', () => {
        state.drillIdx = idx;
        resetSession();
        renderAll();
      });
      box.appendChild(btn);
    });
  }

  function renderBest() {
    const d = currentDrill();
    const best = state.bests[d.id];
    $('best').innerHTML = best ? t().bestFmt(best.pct, best.time) : t().bestNone;
  }

  function setPrompt({ eyebrow, name, meta, bar, status }) {
    const p = $('prompt');
    p.classList.toggle('is-ok', status === 'ok');
    p.classList.toggle('is-bad', status === 'bad');
    $('pEyebrow').textContent = eyebrow || '';
    $('pName').textContent = name || '';
    $('pMeta').textContent = meta || '\u00a0';
    $('pBarWrap').classList.toggle('is-off', bar == null);
    if (bar != null) $('pBar').style.width = Math.round(bar * 100) + '%';
  }

  function buildPalaceSVG({ activeId, items, hideLabels, targetId }) {
    const roomLbl = LANG === 'es'
      ? { entry: 'RECIBIDOR', living: 'SALÓN', kitchen: 'COCINA', study: 'ESTUDIO' }
      : { entry: 'ENTRY', living: 'LIVING', kitchen: 'KITCHEN', study: 'STUDY' };

    const routePts = PALACE_LOCI.map((l) => `${l.x},${l.y}`).join(' ');
    const nodes = PALACE_LOCI.map((loc, idx) => {
      const isActive = loc.id === activeId || loc.id === targetId;
      const isTarget = loc.id === targetId;
      const val = items && items[idx] ? items[idx] : '';
      const shortVal = val.length > 14 ? val.slice(0, 13) + '…' : val;
      const locName = LANG === 'es' ? loc.es : loc.en;
      const stroke = isTarget ? '#f0cf6a' : (isActive ? '#6fd0e8' : '#33475a');
      const fill = isTarget ? '#2d2511' : (isActive ? '#112c38' : '#0d1720');
      const pill = hideLabels
        ? (isTarget ? '?' : locName)
        : (shortVal || locName);

      return `<g class="locus-node" data-lid="${loc.id}" transform="translate(${loc.x},${loc.y})">
        <circle cx="0" cy="-16" r="14" fill="${fill}" stroke="${stroke}" stroke-width="${isActive ? 2.4 : 1.4}"/>
        <text x="0" y="-11.5" text-anchor="middle" fill="${isTarget ? '#f0cf6a' : '#ecdec2'}" font-family="IBM Plex Mono,monospace" font-size="11.5" font-weight="700">${loc.id}</text>
        <rect x="-54" y="3" width="108" height="20" rx="5" fill="#091016" fill-opacity="0.9" stroke="${stroke}" stroke-width="1"/>
        <text x="0" y="16" text-anchor="middle" fill="${isTarget ? '#f0cf6a' : (hideLabels ? '#8d9ca9' : '#e8edf0')}" font-family="Archivo,sans-serif" font-size="10.5" font-weight="600">${pill}</text>
      </g>`;
    }).join('');

    return `<svg class="palace-svg" viewBox="0 0 640 265" role="img" aria-label="Memory Palace Blueprint">
      <rect x="8" y="8" width="624" height="249" rx="8" fill="#09131a" stroke="#294052" stroke-width="2"/>
      <!-- Rooms -->
      <rect x="14" y="14" width="124" height="237" fill="rgba(111,208,232,0.03)" stroke="#1d3242" stroke-width="1.2"/>
      <rect x="138" y="14" width="194" height="237" fill="rgba(236,222,194,0.02)" stroke="#1d3242" stroke-width="1.2"/>
      <rect x="332" y="14" width="160" height="237" fill="rgba(111,208,232,0.03)" stroke="#1d3242" stroke-width="1.2"/>
      <rect x="492" y="14" width="134" height="237" fill="rgba(240,207,106,0.025)" stroke="#1d3242" stroke-width="1.2"/>
      <!-- Door openings -->
      <line x1="138" y1="125" x2="138" y2="165" stroke="#09131a" stroke-width="4"/>
      <line x1="332" y1="125" x2="332" y2="165" stroke="#09131a" stroke-width="4"/>
      <line x1="492" y1="115" x2="492" y2="155" stroke="#09131a" stroke-width="4"/>
      <!-- Room Labels -->
      <text x="24" y="30" fill="#5e788a" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="1">${roomLbl.entry}</text>
      <text x="148" y="30" fill="#5e788a" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="1">${roomLbl.living}</text>
      <text x="342" y="30" fill="#5e788a" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="1">${roomLbl.kitchen}</text>
      <text x="502" y="30" fill="#5e788a" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="1">${roomLbl.study}</text>
      <!-- Dotted Route Path -->
      <polyline points="${routePts}" fill="none" stroke="#6fd0e8" stroke-opacity="0.34" stroke-width="2" stroke-dasharray="5 5"/>
      ${nodes}
    </svg>`;
  }

  function numberToChainHTML(numStr) {
    const clean = (numStr || '').replace(/\D+/g, '');
    if (!clean) return '';
    const pairs = [];
    for (let i = 0; i < clean.length; i += 2) {
      const chunk = clean.slice(i, i + 2);
      if (chunk.length === 2 && PEG_BY_NUM[chunk]) {
        pairs.push({ code: chunk, word: PEG_BY_NUM[chunk].word });
      } else if (chunk.length === 1) {
        const dg = DIGITS[Number(chunk)];
        pairs.push({ code: chunk, word: dg ? dg.wordEs : chunk });
      }
    }
    return `<div class="chain-row">${pairs
      .map(
        (p, idx) =>
          `${idx > 0 ? '<span class="chain-arrow">→</span>' : ''}<div class="chain-item"><b>${p.code}</b><span>${p.word}</span></div>`
      )
      .join('')}</div>`;
  }

  // ---------------- MODO ESTUDIAR ----------------
  function renderStudy() {
    const d = currentDrill();
    const L = t();
    $('felt').classList.add('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    setPrompt({
      eyebrow: `${d.title[LANG]} · ${L.modes.study}`,
      name: d.title[LANG],
      meta: d.sub[LANG],
      bar: null,
      status: null
    });

    if (d.id === 'digits-0-9') {
      const cards = DIGITS.map(
        (dg) => `
        <div class="peg-card">
          <div class="peg-head">
            <span class="peg-num">${dg.d}</span>
            <span class="peg-cons">${LANG === 'es' ? dg.consEs : dg.consEn}</span>
          </div>
          <div class="peg-word">${LANG === 'es' ? dg.wordEs : dg.wordEn}</div>
          <div class="peg-hint">${LANG === 'es' ? dg.hintEs : dg.hintEn}</div>
        </div>`
      ).join('');
      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="rule-banner">
            <b>Regla fundamental:</b> Solo cuentan las <b>consonantes</b>; las vocales (<code>A, E, I, O, U</code>) y la <code>H</code> muda no tienen valor numérico y sirven únicamente como relleno para armar sustantivos fáciles de visualizar.
          </div>
          <div class="peg-grid">${cards}</div>
        </div>
      `;
    } else if (d.range) {
      const [lo, hi] = d.range;
      const slice = PEGS.slice(lo, hi + 1);
      const cards = slice
        .map(
          (p) => `
          <div class="peg-card">
            <div class="peg-head">
              <span class="peg-num">${p.num}</span>
              <span class="peg-cons">${p.cons}</span>
            </div>
            <div class="peg-word">${p.word}</div>
            <div class="peg-hint">${p.hint}</div>
          </div>`
        )
        .join('');
      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="rule-banner">
            Visualiza cada objeto con exageración sensorial (color, sonido, movimiento). La primera consonante da la <b>decena</b> y la segunda la <b>unidad</b>.
          </div>
          <div class="peg-grid">${cards}</div>
        </div>
      `;
    } else if (d.id === 'palace-loci') {
      const L = t();
      const items = state.palacePreset === 'numbers'
        ? PALACE_PRESETS.numbers
        : (state.palacePreset === 'list' ? PALACE_PRESETS.list[LANG] : state.customLoci);

      const ruleMsg = LANG === 'es'
        ? '<b>Cómo funciona el Palacio de la Memoria (Método Loci):</b> El cerebro recuerda espacios físicos 10× mejor que listas sueltas. Recorre siempre la misma ruta (<code>1 → 8</code>) y haz que cada elemento <b>interactúe de forma absurda y sensorial</b> con el mueble de esa estación.'
        : '<b>How the Memory Palace (Method of Loci) works:</b> Spatial memory outlasts rote lists by 10×. Always walk the exact same route (<code>1 → 8</code>) and make each item <b>absurdly interact</b> with that room’s landmark.';

      const presetsHtml = `
        <div class="palace-bar">
          <div class="palace-presets" id="palacePresets">
            <button type="button" class="preset-chip" data-p="custom" aria-pressed="${state.palacePreset === 'custom'}">${L.palacePresetCustom}</button>
            <button type="button" class="preset-chip" data-p="numbers" aria-pressed="${state.palacePreset === 'numbers'}">${L.palacePresetNums}</button>
            <button type="button" class="preset-chip" data-p="list" aria-pressed="${state.palacePreset === 'list'}">${L.palacePresetList}</button>
          </div>
        </div>`;

      const mapSvg = buildPalaceSVG({ activeId: state.activeLocus, items, hideLabels: false });

      const cardsHtml = PALACE_LOCI.map((loc, idx) => {
        const val = items[idx] || '';
        const isOn = state.activeLocus === loc.id;
        const locName = LANG === 'es' ? loc.es : loc.en;
        const actTxt = LANG === 'es' ? loc.actEs : loc.actEn;
        return `
          <div class="loci-card ${isOn ? 'is-on' : ''}" data-lid="${loc.id}">
            <div class="loci-head">
              <span class="loci-idx">#${loc.id}</span>
              <span class="loci-room">${locName}</span>
            </div>
            ${state.palacePreset === 'custom'
              ? `<input type="text" class="loci-item-in" data-lidx="${idx}" value="${String(val).replace(/"/g, '&quot;')}" maxlength="28">`
              : `<div class="peg-word" style="font-size:13.5px">${val}</div>`}
            <div class="loci-scene">${val ? `«${val}» ${actTxt}` : '—'}</div>
          </div>`;
      }).join('');

      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="rule-banner">${ruleMsg}</div>
          ${presetsHtml}
          <div class="palace-map-box">${mapSvg}</div>
          <div class="loci-grid">${cardsHtml}</div>
        </div>
      `;

      document.querySelectorAll('#palacePresets button').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.palacePreset = btn.getAttribute('data-p');
          renderStudy();
        });
      });

      const mapBoxEl = $('felt').querySelector('.palace-map-box');
      if (mapBoxEl) {
        mapBoxEl.addEventListener('click', (e) => {
          const node = e.target.closest('.locus-node');
          if (!node) return;
          state.activeLocus = Number(node.getAttribute('data-lid'));
          renderStudy();
        });
      }

      document.querySelectorAll('.loci-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target && e.target.tagName === 'INPUT') return;
          state.activeLocus = Number(card.getAttribute('data-lid'));
          renderStudy();
        });
      });

      document.querySelectorAll('.loci-item-in').forEach((inp) => {
        inp.addEventListener('input', () => {
          const i = Number(inp.getAttribute('data-lidx'));
          state.customLoci[i] = inp.value;
          saved.set('customLoci', state.customLoci);
          const card = inp.closest('.loci-card');
          if (card) {
            const loc = PALACE_LOCI[i];
            const actTxt = LANG === 'es' ? loc.actEs : loc.actEn;
            const sc = card.querySelector('.loci-scene');
            if (sc) sc.textContent = inp.value ? `«${inp.value}» ${actTxt}` : '—';
          }
          const mapBox = document.querySelector('.palace-map-box');
          if (mapBox) mapBox.innerHTML = buildPalaceSVG({ activeId: state.activeLocus, items: state.customLoci, hideLabels: false });
        });
      });
    } else {
      // decoder or span-challenge study: live interactive number -> story converter
      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="rule-banner">
            <b>Traductor interactivo de números a imágenes:</b> Escribe cualquier número abajo (una fecha histórica, un PIN, los decimales de π) para ver cómo se divide en parejas de tu Casillero Mental <code>00–99</code>.
          </div>
          <div class="converter-box">
            <input type="text" class="converter-input" id="convIn" maxlength="16" value="${state.studyConverterVal}" aria-label="Número a convertir">
            <div id="convOut">${numberToChainHTML(state.studyConverterVal)}</div>
          </div>
        </div>
      `;
      $('convIn').addEventListener('input', (e) => {
        state.studyConverterVal = e.target.value.replace(/\D+/g, '');
        $('convOut').innerHTML = numberToChainHTML(state.studyConverterVal);
      });
    }

    const act = $('actions');
    act.innerHTML = '';
    const goBtn = document.createElement('button');
    goBtn.type = 'button';
    goBtn.className = 'act primary';
    goBtn.textContent = L.goPractice;
    goBtn.addEventListener('click', () => setMode('practice'));
    act.appendChild(goBtn);
  }

  // ---------------- MODO PRACTICAR Y EXAMEN ----------------
  function nextQuestion() {
    const d = currentDrill();
    const L = t();
    $('felt').classList.remove('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    if (state.mode === 'test' && state.total >= TEST_LEN) {
      finishTest();
      return;
    }

    state.answered = false;
    const progressMeta =
      state.mode === 'test' ? `${state.total + 1} / ${TEST_LEN} · ${d.sub[LANG]}` : d.sub[LANG];

    if (d.id === 'digits-0-9') {
      const target = pick(DIGITS);
      const askCons = Math.random() < 0.5;
      const others = shuffle(DIGITS.filter((x) => x.d !== target.d)).slice(0, 3);
      const options = shuffle([target, ...others]);

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: askCons
          ? (LANG === 'es' ? `¿Qué consonante corresponde al dígito ${target.d}?` : `Which consonant maps to digit ${target.d}?`)
          : (LANG === 'es' ? `¿Qué dígito representa el sonido «${target.consEs}»?` : `Which digit maps to sound "${target.consEs}"?`),
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="quiz-box">
            <div class="quiz-big">${askCons ? target.d : target.consEs}</div>
            <div class="quiz-sub" id="qSubHint">&nbsp;</div>
          </div>
        </div>
      `;

      const act = $('actions');
      act.innerHTML = '';
      options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'act';
        const label = askCons ? opt.consEs : opt.d;
        b.innerHTML = `${label} <kbd>${idx + 1}</kbd>`;
        b.addEventListener('click', () => {
          const ok = opt.d === target.d;
          $('qSubHint').textContent = `${target.d} = ${target.consEs} (${target.hintEs})`;
          finalizeChoice(ok, b, `${target.d} = ${target.consEs}`, options.indexOf(target));
        });
        act.appendChild(b);
      });
    } else if (d.range || d.id === 'decoder') {
      const [lo, hi] = d.range || [0, 99];
      const pool = PEGS.slice(lo, hi + 1);
      const target = pick(pool);
      const askWord = d.id === 'decoder' ? false : Math.random() < 0.55;
      const others = shuffle(pool.filter((x) => x.num !== target.num)).slice(0, 3);
      const options = shuffle([target, ...others]);

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: askWord
          ? (LANG === 'es' ? `¿Qué imagen corresponde al número ${target.num}?` : `Which peg image matches ${target.num}?`)
          : (LANG === 'es' ? `¿Qué número codifica la palabra «${target.word}»?` : `Which number does "${target.word}" encode?`),
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="quiz-box">
            <div class="quiz-big">${askWord ? target.num : target.word}</div>
            <div class="quiz-sub" id="qSubHint">${askWord ? target.cons : ''}</div>
          </div>
        </div>
      `;

      const act = $('actions');
      act.innerHTML = '';
      options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'act';
        const label = askWord ? opt.word : opt.num;
        b.innerHTML = `${label} <kbd>${idx + 1}</kbd>`;
        b.addEventListener('click', () => {
          const ok = opt.num === target.num;
          $('qSubHint').textContent = `${target.num} (${target.cons}) = ${target.word} · ${target.hint}`;
          finalizeChoice(ok, b, `${target.num} = ${target.word}`, options.indexOf(target));
        });
        act.appendChild(b);
      });
    } else if (d.id === 'span-challenge') {
      let seq = '';
      for (let i = 0; i < state.spanLen; i++) seq += String(Math.floor(Math.random() * 10));
      state.currentQ = { seq };
      state.spanPhase = 'memorize';

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: LANG === 'es' ? `Memoriza esta secuencia de ${state.spanLen} dígitos` : `Memorize this ${state.spanLen}-digit sequence`,
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="quiz-box">
            <div class="quiz-big">${seq.replace(/(..)/g, '$1 ').trim()}</div>
            <div class="quiz-sub">${LANG === 'es' ? 'Encadena estas imágenes en una mini-escena mental:' : 'Chain these peg images into a vivid scene:'}</div>
          </div>
          ${numberToChainHTML(seq)}
        </div>
      `;

      const act = $('actions');
      act.innerHTML = '';
      const hideBtn = document.createElement('button');
      hideBtn.type = 'button';
      hideBtn.className = 'act primary';
      hideBtn.innerHTML = `${L.memorizeBtn} <kbd>Enter</kbd>`;
      hideBtn.addEventListener('click', () => renderSpanRecall());
      act.appendChild(hideBtn);
    } else if (d.id === 'palace-loci') {
      const count = 6;
      const chosenPegs = shuffle(PEGS).slice(0, count);
      const stationPegs = PALACE_LOCI.slice(0, count).map((loc, i) => ({
        loc,
        peg: chosenPegs[i],
        label: `${chosenPegs[i].num} · ${chosenPegs[i].word}`
      }));
      const qTarget = pick(stationPegs);
      state.currentQ = { stationPegs, qTarget };

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: LANG === 'es' ? `Recorre ${count} estaciones del palacio y fija cada objeto` : `Walk ${count} palace stations and anchor each object`,
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      const sceneCards = stationPegs.map((sp) => {
        const locName = LANG === 'es' ? sp.loc.es : sp.loc.en;
        const actTxt = LANG === 'es' ? sp.loc.actEs : sp.loc.actEn;
        return `<div class="loci-card">
          <div class="loci-head"><span class="loci-idx">#${sp.loc.id}</span><span class="loci-room">${locName}</span></div>
          <div class="peg-word" style="font-size:13.5px">${sp.label}</div>
          <div class="loci-scene">${sp.peg.hint} (${actTxt})</div>
        </div>`;
      }).join('');

      $('felt').innerHTML = `
        <div class="mem-wrap">
          <div class="palace-map-box">${buildPalaceSVG({ items: stationPegs.map((x) => x.label), hideLabels: false })}</div>
          <div class="loci-grid">${sceneCards}</div>
        </div>
      `;

      const act = $('actions');
      act.innerHTML = '';
      const walkBtn = document.createElement('button');
      walkBtn.type = 'button';
      walkBtn.className = 'act primary';
      walkBtn.innerHTML = `${L.walkedBtn} <kbd>Enter</kbd>`;
      walkBtn.addEventListener('click', () => renderPalaceRecall());
      act.appendChild(walkBtn);
    }
  }

  function renderPalaceRecall() {
    const { stationPegs, qTarget } = state.currentQ;
    const L = t();
    const locName = LANG === 'es' ? qTarget.loc.es : qTarget.loc.en;
    const distractors = shuffle(stationPegs.filter((sp) => sp.loc.id !== qTarget.loc.id)).slice(0, 3);
    const options = shuffle([qTarget, ...distractors]);

    setPrompt({
      eyebrow: `${currentDrill().title[LANG]} · ${L.modes[state.mode]}`,
      name: LANG === 'es'
        ? `¿Qué colocaste en la Estación #${qTarget.loc.id} (${locName})?`
        : `What did you place at Station #${qTarget.loc.id} (${locName})?`,
      meta: `${LANG === 'es' ? qTarget.loc.placeEs : qTarget.loc.placeEn} · ${LANG === 'es' ? qTarget.loc.actEs : qTarget.loc.actEn}`,
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: null
    });

    $('felt').innerHTML = `
      <div class="mem-wrap">
        <div class="palace-map-box">${buildPalaceSVG({ targetId: qTarget.loc.id, items: [], hideLabels: true })}</div>
      </div>
    `;

    const act = $('actions');
    act.innerHTML = '';
    options.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'act';
      b.innerHTML = `${opt.label} <kbd>${idx + 1}</kbd>`;
      b.addEventListener('click', () => {
        const ok = opt.loc.id === qTarget.loc.id;
        finalizeChoice(ok, b, `#${qTarget.loc.id} (${locName}) = ${qTarget.label}`, options.indexOf(qTarget));
      });
      act.appendChild(b);
    });
  }

  function renderSpanRecall() {
    const { seq } = state.currentQ;
    const L = t();
    state.spanPhase = 'recall';

    setPrompt({
      eyebrow: `${currentDrill().title[LANG]} · ${L.modes[state.mode]}`,
      name: LANG === 'es' ? 'Escribe la secuencia completa de memoria' : 'Type the full sequence from memory',
      meta: `${state.spanLen} dígitos`,
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: null
    });

    $('felt').innerHTML = `
      <div class="mem-wrap">
        <div class="converter-box">
          <input type="text" class="converter-input" id="recallIn" maxlength="${state.spanLen}" placeholder="${'•'.repeat(state.spanLen)}" autocomplete="off">
          <div id="recallFeedback"></div>
        </div>
      </div>
    `;

    const inputEl = $('recallIn');
    inputEl.focus();

    const act = $('actions');
    act.innerHTML = '';
    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'act primary';
    checkBtn.innerHTML = `${L.checkSeqBtn} <kbd>Enter</kbd>`;
    checkBtn.addEventListener('click', () => {
      if (state.answered) return;
      const typed = inputEl.value.replace(/\D+/g, '');
      const ok = typed === seq;
      inputEl.disabled = true;
      $('recallFeedback').innerHTML = numberToChainHTML(seq);
      act.innerHTML = '';
      recordOutcome(ok, seq);
    });
    act.appendChild(checkBtn);
  }

  function finalizeChoice(isRight, clickedBtn, rightLabel, rightIdx) {
    document.querySelectorAll('#actions .act').forEach((b, i) => {
      b.disabled = true;
      if (i === rightIdx) b.classList.add('is-right');
      else if (b === clickedBtn && !isRight) b.classList.add('is-wrong');
    });
    recordOutcome(isRight, rightLabel);
  }

  function recordOutcome(isRight, rightLabel) {
    if (state.answered) return;
    state.answered = true;
    const L = t();
    state.total++;
    if (isRight) {
      state.right++;
      state.streak++;
    } else {
      state.streak = 0;
    }
    updateStats();

    $('stageBox').classList.add(isRight ? 'flash-ok' : 'flash-bad');
    setPrompt({
      eyebrow: isRight ? L.correctExcl : L.wrongExcl(rightLabel),
      name: rightLabel,
      meta: state.mode === 'test' ? `${state.total} / ${TEST_LEN}` : currentDrill().title[LANG],
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: isRight ? 'ok' : 'bad'
    });

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'act primary';
    nextBtn.innerHTML = `${L.nextBtn} <kbd>Space</kbd>`;
    nextBtn.addEventListener('click', () => nextQuestion());
    $('actions').appendChild(nextBtn);
  }

  function finishTest() {
    state.frozen = elapsed();
    const L = t();
    const d = currentDrill();
    const pct = Math.round((100 * state.right) / TEST_LEN);
    const timeSec = Math.round(state.frozen);
    const passed = pct >= 90;

    const prev = state.bests[d.id];
    if (!prev || pct > prev.pct || (pct === prev.pct && timeSec < prev.time)) {
      state.bests[d.id] = { pct, time: timeSec };
      saved.set('bests', state.bests);
    }
    renderRail();
    renderBest();

    setPrompt({
      eyebrow: L.testDone,
      name: `${pct}% (${state.right}/${TEST_LEN}) · ${timeSec}s`,
      meta: passed ? L.passedMsg : L.retryMsg,
      bar: 1,
      status: passed ? 'ok' : 'bad'
    });

    $('felt').innerHTML = `
      <div class="mem-wrap">
        <div class="quiz-box">
          <div class="quiz-big">${pct}%</div>
          <div class="quiz-sub">${fmtClock(timeSec)}</div>
        </div>
      </div>
    `;

    const act = $('actions');
    act.innerHTML = '';
    const rBtn = document.createElement('button');
    rBtn.type = 'button';
    rBtn.className = 'act primary';
    rBtn.textContent = L.tryAgain;
    rBtn.addEventListener('click', () => {
      resetSession();
      nextQuestion();
    });
    act.appendChild(rBtn);
  }

  function setMode(m) {
    state.mode = m;
    saved.set('mode', m);
    resetSession();
    renderAll();
  }

  function renderAll() {
    applyStaticI18n();
    if (state.mode === 'study') renderStudy();
    else nextQuestion();
  }

  // ---------------- Eventos ----------------
  $('langSel').addEventListener('change', (e) => {
    LANG = e.target.value === 'en' ? 'en' : 'es';
    saved.set('lang', LANG);
    try { localStorage.setItem('todologo.lang', LANG); } catch (err) {}
    renderAll();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'todologo.lang' && (e.newValue === 'es' || e.newValue === 'en')) {
      LANG = e.newValue;
      renderAll();
    }
  });

  document.querySelectorAll('#modeSeg button').forEach((b) => {
    b.addEventListener('click', () => setMode(b.getAttribute('data-v')));
  });

  document.querySelectorAll('#spanSeg button').forEach((b) => {
    b.addEventListener('click', () => {
      state.spanLen = Number(b.getAttribute('data-v'));
      saved.set('spanLen', state.spanLen);
      resetSession();
      renderAll();
    });
  });

  $('restartBtn').addEventListener('click', () => {
    resetSession();
    renderAll();
  });

  $('cleanBtn').addEventListener('click', () => document.body.classList.add('clean'));
  $('cleanExit').addEventListener('click', () => document.body.classList.remove('clean'));
  $('settingsBtn').addEventListener('click', () => document.body.classList.add('sheet-open'));
  $('closeSheet').addEventListener('click', () => document.body.classList.remove('sheet-open'));
  $('howBtn').addEventListener('click', () => { $('intro').hidden = false; });
  $('introGo').addEventListener('click', () => { $('intro').hidden = true; });

  window.addEventListener('keydown', (e) => {
    if (!$('intro').hidden) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $('intro').hidden = true;
      }
      return;
    }
    if (state.mode === 'study') return;

    if (state.answered) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextQuestion();
      }
      return;
    }

    if (e.key === 'Enter') {
      const primary = document.querySelector('#actions .act.primary');
      if (primary) {
        e.preventDefault();
        primary.click();
        return;
      }
    }

    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;

    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = Number(e.key) - 1;
      const btns = document.querySelectorAll('#actions .act');
      if (btns[idx]) {
        e.preventDefault();
        btns[idx].click();
      }
    }
  });

  resetSession();
  renderAll();
})();
