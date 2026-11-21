(function () {
  'use strict';

  var STORE = SiteProgress.tool('meat-cuts');

  function resolveInitialLang() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q === 'es' || q === 'en') return q;
    } catch (_) {}
    var saved = STORE.get('lang', null);
    if (saved === 'es' || saved === 'en') return saved;
    try {
      var global = localStorage.getItem('todologo.lang');
      if (global === 'es' || global === 'en') return global;
    } catch (_) {}
    return 'es';
  }

  var LANG = resolveInitialLang();
  var CLEAN = false;

  var ZONES = {
    dorsal:    { es: 'Lomo y dorso',              en: 'Loin & Dorsal Rib',      color: 'var(--z-dorsal)',    hex: 0xff7b72, muscleHex: 0xc84b44 },
    costillar: { es: 'Costillar, vacío y falda',  en: 'Ribs, Flank & Skirt',    color: 'var(--z-costillar)', hex: 0xf0cf6a, muscleHex: 0xb63f3a },
    delantero: { es: 'Cuarto delantero y garrón', en: 'Chuck, Brisket & Shank', color: 'var(--z-delantero)', hex: 0x5fd39a, muscleHex: 0xa23432 },
    trasero:   { es: 'Cuarto trasero',            en: 'Round & Hindquarter',    color: 'var(--z-trasero)',   hex: 0x6fd0e8, muscleHex: 0xb93c3a }
  };

  var COOK_METHODS = {
    sear: {
      es: 'Plancha o parrilla rápida (fuego alto)',
      en: 'Fast sear / high-heat grill'
    },
    grill_med: {
      es: 'Parrilla gradual a fuego medio-bajo',
      en: 'Slow wood/charcoal grill (medium-low heat)'
    },
    braise: {
      es: 'Braseado, estofado o ahumado largo',
      en: 'Long slow braise, stew, or low-&-slow smoke'
    },
    milanese: {
      es: 'Escalope, milanesa, relleno u horno controlado',
      en: 'Thin cutlets, schnitzel, or controlled roast'
    }
  };

  var CUTS = [
    {
      id: 'aguja', code: '01', zone: 'dorsal', cookKey: 'braise',
      cx: 238, cy: 112,
      poly: '185,95 270,84 275,144 196,154',
      es: 'Aguja / Roast beef', en: 'Chuck Roll',
      names: { arg: 'Aguja / Roast beef', esp: 'Aguja', mex: 'Diezmillo', usa: 'Chuck Roll / Eye' },
      tenderEs: 'Terneza media · Buen marmoleo', tenderEn: 'Medium tenderness · Rich marbling',
      anatEs: 'Músculos del cuello y primeras cinco vértebras torácicas; trabajan al bajar y levantar la cabeza.',
      anatEn: 'Neck and upper thoracic muscles heavily engaged when raising or lowering the head.',
      tipEs: 'Picada da las mejores hamburguesas (75/25); en trozo exige braseado o diezmillo asado al carbón.',
      tipEn: 'Ideal ground for 75/25 burgers, slow pot roasts, or thinly sliced for carne asada.'
    },
    {
      id: 'bife_ancho', code: '02', zone: 'dorsal', cookKey: 'sear',
      cx: 318, cy: 108,
      poly: '270,84 366,80 366,138 275,144',
      es: 'Ojo de bife / Bife ancho', en: 'Ribeye / Prime Rib',
      names: { arg: 'Ojo de bife / Bife ancho', esp: 'Lomo alto / Entrecot', mex: 'Rib eye', usa: 'Ribeye / Prime Rib' },
      tenderEs: 'Muy tierno · Máximo veteado', tenderEn: 'Very tender · Peak marbling',
      anatEs: 'Porción delantera del dorsal largo sobre las costillas 6 a 12; músculo de sostén muy jugoso.',
      anatEn: 'Front portion of the longissimus dorsi over ribs 6–12; minimal locomotion work yields rich fat.',
      tipEs: 'Dóralo a fuego fuerte 3–4 min por lado hasta punto jugoso (54 °C) para fundir su grasa intramuscular.',
      tipEn: 'Hard high-heat sear to medium-rare (54 °C) so abundant marbling basts the steak naturally.'
    },
    {
      id: 'bife_angosto', code: '03', zone: 'dorsal', cookKey: 'sear',
      cx: 416, cy: 105,
      poly: '366,80 468,78 468,128 366,138',
      es: 'Bife de chorizo / Angosto', en: 'Striploin / NY Strip',
      names: { arg: 'Bife de chorizo / Angosto', esp: 'Lomo bajo / Entrecot', mex: 'New York', usa: 'Striploin / NY Strip' },
      tenderEs: 'Muy tierno · Cordón de grasa lateral', tenderEn: 'Very tender · Crisp fat cap',
      anatEs: 'Continuación lumbar del dorsal largo sin costillas (vértebras lumbares); textura firme y sabor intenso.',
      anatEn: 'Lumbar continuation of the longissimus muscle behind the ribs; tight grain and beefy flavor.',
      tipEs: 'Empieza apoyándolo verticalmente sobre su banda de grasa exterior para volverla crocante antes de dorar las caras.',
      tipEn: 'Render the outer fat edge vertically first before searing both flat faces on high heat.'
    },
    {
      id: 'lomo', code: '04', zone: 'dorsal', cookKey: 'sear', deep: true,
      cx: 418, cy: 147,
      poly: '366,138 468,128 486,158 370,162',
      es: 'Lomo / Solomillo', en: 'Tenderloin / Filet Mignon',
      names: { arg: 'Lomo', esp: 'Solomillo', mex: 'Filete / Cafilete', usa: 'Tenderloin / Filet Mignon' },
      tenderEs: 'El corte más tierno · Profundo sub-lumbar', tenderEn: 'Most tender cut · Deep sub-lumbar',
      anatEs: 'Músculo psoas mayor protegido por debajo de la columna lumbar (visible en Media Res o Rayos X); apenas soporta carga mecánica.',
      anatEn: 'Deep psoas major tucked beneath the lumbar vertebrae (inspect in Half Carcass / X-Ray); barely loaded mechanically.',
      tipEs: 'Al tener poca grasa, no lo pases de cocción (máximo punto rojo/medio) o añade mantequilla/salsa.',
      tipEn: 'Because it is ultra-lean, never cook past medium-rare and finish with butter or pan sauce.'
    },
    {
      id: 'cuadril', code: '05', zone: 'dorsal', cookKey: 'sear',
      cx: 525, cy: 112,
      poly: '468,78 584,84 576,144 486,158 468,128',
      es: 'Cuadril / Picaña', en: 'Sirloin Cap / Rump / Picanha',
      names: { arg: 'Cuadril / Tapa y colita', esp: 'Cadera / Tapilla', mex: 'Aguayón / Picaña', usa: 'Top Sirloin / Coulotte' },
      tenderEs: 'Tierno y equilibrado', tenderEn: 'Tender & flavorful balance',
      anatEs: 'Músculos glúteos de la cadera entre el lomo y el cuarto trasero; gran equilibrio entre terneza y sabor.',
      anatEn: 'Hip/gluteal muscles linking loin and round, balancing steakhouse tenderness with deep flavor.',
      tipEs: 'La picaña (tapa de cuadril) conserva su gruesa capa de grasa superior para asar entera o en brocheta.',
      tipEn: 'Leave the thick fat cap intact on culotte/picanha and slice across the grain after resting.'
    },
    {
      id: 'tapa_asado', code: '06', zone: 'costillar', cookKey: 'grill_med',
      cx: 318, cy: 162,
      poly: '275,144 366,138 366,184 282,186',
      es: 'Tapa de asado / Tapa de bife', en: 'Rib Cap / Chuck Cover',
      names: { arg: 'Tapa de asado', esp: 'Tapa de lomo alto', mex: 'Tapa de rib eye', usa: 'Spinalis / Rib Cap' },
      tenderEs: 'Muy jugosa si se cocina lenta', tenderEn: 'Extra juicy when seared/grilled properly',
      anatEs: 'Músculo plano y veteado (trapecio/spinalis) que recubre externamente la parte superior del costillar delantero.',
      anatEn: 'Thin richly marbled cap muscle covering the upper outer rib cage.',
      tipEs: 'En piezas de parrillero conviene fuego medio lento o enrollar el Spinalis aparte para plancha rápida.',
      tipEn: 'Grill gradually at medium heat on bone cuts, or roll pure Spinalis cap into tender pinwheel steaks.'
    },
    {
      id: 'asado_tira', code: '07', zone: 'costillar', cookKey: 'grill_med',
      cx: 324, cy: 208,
      poly: '282,186 366,184 368,236 278,232',
      es: 'Asado de tira / Costillar', en: 'Beef Short Ribs',
      names: { arg: 'Asado de tira', esp: 'Costillar / Churrasco', mex: 'Costilla cargada', usa: 'Short Ribs / Flanken' },
      tenderEs: 'Fibroso con hueso · Sabor rey', tenderEn: 'Bone-in collagen · Deepest beef flavor',
      anatEs: 'Sección transversal de las costillas 6 a 12 con músculos intercostales y tejido conectivo alrededor del hueso.',
      anatEn: 'Cross-section of ribs 6–12 containing richly flavored intercostal muscle and marrow-adjacent collagen.',
      tipEs: 'Empieza siempre con el lado del hueso hacia las brasas a fuego lento-medio para transmitir calor uniforme.',
      tipEn: 'Cook bone-side down over gentle embers for traditional asado, or braise thick cuts until fork-tender.'
    },
    {
      id: 'matambre', code: '08', zone: 'costillar', cookKey: 'grill_med',
      cx: 416, cy: 192,
      poly: '366,162 468,158 462,216 368,212',
      es: 'Matambre', en: 'Rose Meat (Cutaneous Trunci)',
      names: { arg: 'Matambre', esp: 'Falda exterior / Sobrebarriga', mex: 'Suadero / Matambre', usa: 'Rose Meat' },
      tenderEs: 'Fino y alargado · Pide leche o brasa suave', tenderEn: 'Thin layer · Needs gentle heat or tenderizing',
      anatEs: 'Capa muscular subcutánea muy delgada que envuelve el costillar justo debajo del cuero; tiembla para espantar insectos.',
      anatEn: 'Thin subcutaneous sheet directly under the hide used to twitch skin across the flank.',
      tipEs: 'Famoso arrollado relleno o «a la pizza» tras tiernizarlo a fuego suave; vigila no secarlo.',
      tipEn: 'Famous rolled and stuffed cold, or braised briefly in milk/broth before crisping on the grill.'
    },
    {
      id: 'entrana', code: '09', zone: 'costillar', cookKey: 'sear', deep: true,
      cx: 400, cy: 230,
      poly: '368,212 436,216 428,248 368,242',
      es: 'Entraña', en: 'Skirt Steak (Diaphragm)',
      names: { arg: 'Entraña', esp: 'Entraña', mex: 'Arrachera / Fajita', usa: 'Inside / Outside Skirt' },
      tenderEs: 'Sabor intenso · Fibras largas', tenderEn: 'Ultra beefy · Long loose fibers',
      anatEs: 'Músculo del diafragma unido al borde interno de las costillas bajas; altísima irrigación sanguínea y sabor férrico.',
      anatEn: 'Respiratory diaphragm anchored inside the lower ribs; dense vascularization gives intense flavor.',
      tipEs: 'Vuelta y vuelta a fuego vivo (2–3 min por lado) y córtala siempre perpendicular al sentido de sus fibras largas.',
      tipEn: 'Flash-sear screaming hot for 2 minutes per side and slice strictly perpendicular to the long grain.'
    },
    {
      id: 'vacio', code: '10', zone: 'costillar', cookKey: 'grill_med',
      cx: 472, cy: 214,
      poly: '468,158 532,166 516,246 428,248 436,216 462,216',
      es: 'Vacío', en: 'Flank Steak / Bavette',
      names: { arg: 'Vacío', esp: 'Bavette / Vacío', mex: 'Falda / Arrachera de vacío', usa: 'Flank / Sirloin Bavette' },
      tenderEs: 'Jugoso con membrana crocante', tenderEn: 'Juicy with crisp outer membrane',
      anatEs: 'Región abdominal lateral posterior sin huesos, protegida por una membrana elástica exterior que retiene jugos.',
      anatEn: 'Boneless posterior abdominal wall guarded by an elastic silver fascia membrane.',
      tipEs: 'Ásalo entero a fuego moderado empezando por la membrana hacia arriba para lograr piel crujiente al final.',
      tipEn: 'Roast whole over steady coals with membrane up first, then crisp down at the end before slicing.'
    },
    {
      id: 'pecho', code: '11', zone: 'delantero', cookKey: 'braise',
      cx: 220, cy: 204,
      poly: '164,174 278,186 278,236 172,226',
      es: 'Pecho / Tapa de pecho', en: 'Beef Brisket',
      names: { arg: 'Pecho / Grano de pecho', esp: 'Pecho', mex: 'Pecho', usa: 'Brisket (Flat & Point)' },
      tenderEs: 'Alto colágeno · Rey del ahumado', tenderEn: 'Collagen-rich · King of low & slow BBQ',
      anatEs: 'Pectorales inferiores que sostienen más del 60% del peso corporal de la res en reposo.',
      anatEn: 'Lower pectoral muscles supporting over 60% of the animal’s standing body weight.',
      tipEs: 'Necesita horas a baja temperatura (85–110 °C en ahumador o caldo de puchero) para derretir su tejido conectivo.',
      tipEn: 'Requires hours at low heat (smoke at 110 °C or simmer in puchero/stew) to melt tough collagen into silk.'
    },
    {
      id: 'paleta', code: '12', zone: 'delantero', cookKey: 'braise',
      cx: 218, cy: 158,
      poly: '162,138 275,144 278,186 164,174',
      es: 'Paleta / Marucha', en: 'Shoulder Clod / Flat Iron',
      names: { arg: 'Paleta / Marucha / Chiquizuela', esp: 'Espaldilla / Llana', mex: 'Paleta / Planchuela', usa: 'Shoulder Clod / Flat Iron' },
      tenderEs: 'Sabroso · Nervio central en marucha', tenderEn: 'Flavorful · Central seam yields tender Flat Iron',
      anatEs: 'Musculatura adherida al omóplato (escápula) en el cuarto delantero de locomoción.',
      anatEn: 'Muscles covering the shoulder blade (scapula) driving forelimb movement.',
      tipEs: 'Excelente en guisos largos o milanesas; retirando la lámina interna sale el tiernísimo Flat Iron a la plancha.',
      tipEn: 'Great for slow braises; splitting out its internal sinew reveals remarkably tender Flat Iron steaks.'
    },
    {
      id: 'osobuco', code: '13', zone: 'delantero', cookKey: 'braise',
      cx: 204, cy: 266,
      poly: '172,226 242,232 230,308 184,308',
      es: 'Osobuco / Garrón y brazuelo', en: 'Beef Shank / Ossobuco',
      names: { arg: 'Osobuco / Garrón', esp: 'Morcillo / Jarrete', mex: 'Chambarete', usa: 'Beef Shank / Cross-Cut' },
      tenderEs: 'Máxima gelatina + tuétano óseo', tenderEn: 'Maximum gelatin + bone marrow',
      anatEs: 'Pierna baja (tibia o radio/cúbito) de carga continua; tendones densos y hueso cargado de médula.',
      anatEn: 'Lower leg muscles continually bracing limb stride, packed with dense tendons around marrow bone.',
      tipEs: 'Braseado en rodajas transversales (ossobuco) o en caldo: el tuétano y tendones dan una salsa sedosa insuperable.',
      tipEn: 'Simmer cross-cut slices gently for 2.5+ hours; tendon collagen and marrow create rich velvety broth.'
    },
    {
      id: 'bola_lomo', code: '14', zone: 'trasero', cookKey: 'milanese',
      cx: 540, cy: 196,
      poly: '516,162 568,154 574,234 516,246',
      es: 'Bola de lomo', en: 'Sirloin Tip / Knuckle',
      names: { arg: 'Bola de lomo', esp: 'Babilla', mex: 'Pulpa bola', usa: 'Sirloin Tip / Knuckle' },
      tenderEs: 'Magro, versátil y rendidor', tenderEn: 'Lean, clean, and versatile',
      anatEs: 'Cuádriceps femoral delante del fémur en el muslo; grupo extensor grande y muy limpio de grasa.',
      anatEn: 'Quadriceps muscle group in front of the femur; lean extensor muscles with fine uniform texture.',
      tipEs: 'Clásico indiscutido para milanesas tiernas, escalopes y churrasquitos finos a la plancha rápida.',
      tipEn: 'Top everyday cut for thin breaded cutlets (milanesa), stir-fry strips, and fast skillet minute steaks.'
    },
    {
      id: 'nalga', code: '15', zone: 'trasero', cookKey: 'milanese',
      cx: 604, cy: 184,
      poly: '568,144 634,126 638,236 574,234',
      es: 'Nalga de adentro', en: 'Top / Inside Round',
      names: { arg: 'Nalga', esp: 'Tapa', mex: 'Pulpa negra / Tapa', usa: 'Top / Inside Round' },
      tenderEs: 'Grande, tierna y casi sin nervios', tenderEn: 'Large, lean, and clean-slicing',
      anatEs: 'Aductores de la cara interna del muslo; piezas amplias, compactas y de fibra regular.',
      anatEn: 'Inner thigh adductor muscles forming broad, uniform slabs ideal for slicing.',
      tipEs: 'El corte rey en Argentina y España para milanesas/escalopes grandes y niños envueltos.',
      tipEn: 'Premier cut for wide uniform milanesas, roast beef sandwiches, and thin stuffed beef rolls.'
    },
    {
      id: 'peceto', code: '16', zone: 'trasero', cookKey: 'milanese',
      cx: 650, cy: 192,
      poly: '634,126 666,144 662,238 638,236',
      es: 'Peceto', en: 'Eye of Round',
      names: { arg: 'Peceto', esp: 'Redondo', mex: 'Cuete', usa: 'Eye of Round' },
      tenderEs: 'Cilindro ultralimpio y muy magro', tenderEn: 'Ultra-lean tight cylinder',
      anatEs: 'Músculo semitendinoso cilíndrico en la parte posterior externa del muslo; cero veteado graso.',
      anatEn: 'Cylindrical semitendinosus muscle along the rear hindquarter with virtually no internal fat.',
      tipEs: 'Se luce hervido en frío con salsa (vitel toné) o mechado al horno con líquido para que no se seque.',
      tipEn: 'Shines poached cold and sliced paper-thin (vitello tonnato) or pot-braised in sauce so it stays moist.'
    }
  ];

  var BY_ID = {};
  CUTS.forEach(function (c) { BY_ID[c.id] = c; });

  var BLOCKS = [
    {
      id: 'all',
      es: 'Mapa completo (16 cortes)',
      en: 'Full steer map (16 cuts)',
      match: function () { return true; }
    },
    {
      id: 'dorsal',
      es: 'Lomo y dorso (tiernos)',
      en: 'Loin & rib (tender)',
      match: function (c) { return c.zone === 'dorsal'; }
    },
    {
      id: 'costillar',
      es: 'Costillar, vacío y entraña',
      en: 'Ribs, flank & skirt',
      match: function (c) { return c.zone === 'costillar'; }
    },
    {
      id: 'cuartos',
      es: 'Cuartos, pecho y milanesas',
      en: 'Brisket, chuck & round',
      match: function (c) { return c.zone === 'delantero' || c.zone === 'trasero'; }
    }
  ];

  var STRINGS = {
    es: {
      brandSub: 'Anatomía 3D de la res, equivalencias y cocción',
      home: 'Volver al catálogo de Todologo',
      railTitle: 'Zonas de estudio',
      railPath: '90%+ en Examen marca la zona como completada.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Rota el bovino 3D y haz clic en cualquier músculo para explorar su nombre y cocción.',
        practice: 'Entrena sin límite: puedes usar Media Res, Rayos X (X) o Despiece (E) para ver cortes profundos.',
        test: 'Ronda cronometrada de 12 preguntas con nombres ocultos en el modelo 3D.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', locate: 'Ubicar', equiv: 'Equiv.', cook: 'Cocción' },
      taskHints: {
        mix: 'Alterna ubicación en la res 3D, equivalencias por país y método de cocción.',
        locate: 'Haz clic sobre el corte exacto directamente en el modelo 3D de la res.',
        equiv: 'Relaciona el nombre del corte entre Argentina, España, México y EE. UU.',
        cook: 'Elige la cocción adecuada según colágeno y trabajo muscular.'
      },
      hud: {
        camLbl: 'Vista:',
        side: 'Lateral',
        sagittal: 'Media Res',
        front: 'Frente',
        back: 'Atrás',
        top: 'Dorso',
        reset: 'Centrar',
        dragHint: 'Arrastra: rotar · Rueda: zoom · Clic: corte',
        toolsLbl: 'Anatomía 3D:',
        explode: 'Despiece 3D',
        xray: 'Rayos X',
        bones: 'Huesos',
        colorMuscle: 'Color: Músculo',
        colorZones: 'Color: Zonas',
        map2d: 'Esquema 2D'
      },
      statAccLabel: 'Precisión',
      statTimeLabel: 'Tiempo',
      statStreakLabel: 'Racha',
      actions: {
        prev: 'Anterior',
        next: 'Siguiente',
        goPractice: 'Practicar este bloque →',
        clean: 'Vista limpia',
        cleanExit: 'Salir de vista limpia',
        restart: 'Reiniciar',
        settings: 'Ajustes',
        how: 'Cómo funciona',
        best: 'Mejor: ',
        bestNone: 'Sin marca aún',
        keysHint: 'Flechas navegan · E despiece · X rayos X · M media res · B huesos · Space siguiente · C limpia'
      },
      docTitle: 'Atlas 3D Cortes de Carne · Todologo',
      creditText: 'Visor WebGL anatómico bovino · 16 cortes × 2 lados + esqueleto interno',
      allZones: 'Todas las zonas',
      lblArg: 'Argentina / Uruguay',
      lblEsp: 'España',
      lblMex: 'México',
      lblUsa: 'EE. UU. / Internacional',
      anatWord: 'Anatomía:',
      tipWord: 'En la cocina:',
      studyEyebrow: 'Estudio anatómico 3D · Corte',
      qLocateEyebrow: 'Ubicar en la res 3D',
      qLocatePrefix: 'Señala en el 3D: ',
      deepHintPractice: 'Corte profundo sub-lumbar · Activa Media Res (M), Rayos X (X) o Despiece (E).',
      qEquivEyebrow: 'Equivalencia regional',
      qCookEyebrow: 'Ciencia de cocción',
      qCookTitlePrefix: '¿Cuál es la mejor cocción para ',
      rightMsg: '¡Correcto! ',
      wrongMsg: 'Era ',
      roundDone: 'Ronda completada',
      roundMeta: 'aciertos en ',
      passedMsg: 'Zona superada (≥90%).',
      retryMsg: 'Necesitas 90%+ en Examen para completar esta zona.',
      introTitle: 'Cómo explorar los cortes de carne en 3D',
      introBody1: 'La terneza y el método de cocción de un corte dependen directamente de la <b>función anatómica</b> de ese músculo en el animal:',
      introList: [
        '<li><b>Visor 3D interactivo:</b> arrastra para rotar el bovino, usa <b>Media Res (M)</b> para ver el interior junto a la columna vertebral o <b>Despiece 3D (E)</b> y <b>Rayos X (X)</b> para cortes profundos como <i>Lomo</i> y <i>Entraña</i>.</li>',
        '<li><b>Regla del movimiento (lomo y dorso):</b> los músculos posturales trabajan poco → fibras cortas, máxima terneza y cocción rápida a fuego fuerte.</li>',
        '<li><b>Regla del trabajo (patas, cuello y pecho):</b> los músculos de carga acumulan colágeno → exigen cocción lenta o ahumado largo.</li>'
      ],
      introGo: 'Empezar',
      floorL: 'IZQ', floorR: 'DER', floorFront: 'FRENTE · ANTERIOR'
    },
    en: {
      brandSub: '3D beef anatomy, international cut names & cooking science',
      home: 'Back to Todologo catalog',
      railTitle: 'Study Regions',
      railPath: 'Score 90%+ in Test mode to mark a region completed.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Orbit the 3D steer and click any muscle cut to inspect grain, equivalents, and cooking.',
        practice: 'Practice freely: use Half Carcass (M), X-Ray (X), or Explode (E) to inspect deep cuts.',
        test: 'Timed 12-question assessment with labels hidden across the 3D model.'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mixed', locate: 'Locate', equiv: 'Names', cook: 'Cooking' },
      taskHints: {
        mix: 'Alternates 3D model location, international cut names, and cooking science.',
        locate: 'Click the exact beef cut directly on the 3D bovine model.',
        equiv: 'Match beef cut equivalents across USA, Argentina, Spain, and Mexico.',
        cook: 'Select the ideal cooking method based on collagen and muscle work.'
      },
      hud: {
        camLbl: 'View:',
        side: 'Side',
        sagittal: 'Half Carcass',
        front: 'Front',
        back: 'Rear',
        top: 'Dorsal',
        reset: 'Center',
        dragHint: 'Drag: orbit · Scroll: zoom · Click: cut',
        toolsLbl: '3D Anatomy:',
        explode: 'Explode 3D',
        xray: 'X-Ray',
        bones: 'Bones',
        colorMuscle: 'Color: Muscle',
        colorZones: 'Color: Zones',
        map2d: '2D Diagram'
      },
      statAccLabel: 'Accuracy',
      statTimeLabel: 'Time',
      statStreakLabel: 'Streak',
      actions: {
        prev: 'Previous',
        next: 'Next',
        goPractice: 'Practice this block →',
        clean: 'Clean view',
        cleanExit: 'Exit clean',
        restart: 'Restart',
        settings: 'Settings',
        how: 'Quick guide',
        best: 'Best: ',
        bestNone: 'No score yet',
        keysHint: 'Arrows browse · E explode · X x-ray · M half carcass · B bones · Space next · C clean'
      },
      docTitle: '3D Beef Cuts Atlas · Todologo',
      creditText: 'WebGL 3D bovine anatomy · 16 cuts × 2 sides + internal skeleton',
      allZones: 'All regions',
      lblArg: 'Argentina / Uruguay',
      lblEsp: 'Spain',
      lblMex: 'Mexico',
      lblUsa: 'USA / International',
      anatWord: 'Anatomy:',
      tipWord: 'Kitchen tip:',
      studyEyebrow: '3D Anatomical study · Cut',
      qLocateEyebrow: 'Locate on 3D steer',
      qLocatePrefix: 'Click on 3D steer: ',
      deepHintPractice: 'Deep sub-lumbar cut · Try Half Carcass (M), X-Ray (X), or Explode (E).',
      qEquivEyebrow: 'Regional equivalence',
      qCookEyebrow: 'Cooking science',
      qCookTitlePrefix: 'Best cooking method for ',
      rightMsg: 'Correct! ',
      wrongMsg: 'Answer: ',
      roundDone: 'Round complete',
      roundMeta: 'correct in ',
      passedMsg: 'Region mastered (≥90%).',
      retryMsg: 'Score 90%+ in Test mode to mark this region completed.',
      introTitle: 'How to Read Beef Cuts in 3D',
      introBody1: 'Tenderness and cooking method depend directly on the muscle’s <b>anatomical job</b> in the animal:',
      introList: [
        '<li><b>Interactive 3D Viewer:</b> drag to rotate the steer, toggle <b>Half Carcass (M)</b> to view the spine & ribs inside, or use <b>Explode 3D (E)</b> and <b>X-Ray (X)</b> for deep cuts like <i>Tenderloin</i> and <i>Skirt</i>.</li>',
        '<li><b>Posture muscles (loin & rib):</b> muscles along the spine do minimal locomotion work → tender fibers for quick high-heat searing.</li>',
        '<li><b>Work muscles (legs, chuck & brisket):</b> weight-bearing limbs build dense collagen → need low, slow moist cooking or smoking.</li>'
      ],
      introGo: 'Start',
      floorL: 'L', floorR: 'R', floorFront: 'FRONT · ANTERIOR'
    }
  };

  var state = {
    block: STORE.get('block', 'all'),
    mode: STORE.get('mode', 'study'),
    task: STORE.get('task', 'mix'),
    zoneFilter: 'all',
    selectedId: STORE.get('selectedId', 'bife_ancho'),
    question: null,
    answered: false,
    lastOk: false,
    streak: 0,
    totalCount: 0,
    rightCount: 0,
    qStart: 0,
    roundTarget: 12,
    roundAsk: 0,
    roundRight: 0,
    roundStart: 0,
    frozenSec: null,
    bests: STORE.get('bests', {}),
    flashTimer: null,
    // 3D Viewer state
    exploded: false,
    xray: false,
    bones: true,
    sagittal: false,
    colorMode: 'muscle', // 'muscle' | 'zones'
    show2d: false
  };

  if (!BLOCKS.some(function (b) { return b.id === state.block; })) state.block = 'all';
  if (!BY_ID[state.selectedId]) state.selectedId = 'bife_ancho';

  var $ = function (id) { return document.getElementById(id); };
  function S() { return STRINGS[LANG] || STRINGS.es; }
  function cutName(c) { return LANG === 'en' ? c.en : c.es; }
  function zoneName(z) { return (ZONES[z] && ZONES[z][LANG]) || z; }
  function zoneColor(z) { return (ZONES[z] && ZONES[z].color) || 'var(--scan)'; }
  function cookName(k) { return (COOK_METHODS[k] && COOK_METHODS[k][LANG]) || k; }

  function activePool() {
    var blk = BLOCKS.filter(function (b) { return b.id === state.block; })[0] || BLOCKS[0];
    return CUTS.filter(blk.match);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* =====================================================================
   * 3D PBR WEBGL ENGINE (Three.js + OrbitControls + RoomEnvironment)
   * ===================================================================== */
  var viewer3d = null;

  function createMuscleTexture(THREE) {
    if (typeof document === 'undefined' || !document.createElement) return null;
    try {
      var cv = document.createElement('canvas');
      cv.width = 256; cv.height = 256;
      var g = cv.getContext('2d');
      if (!g) return null;
      g.fillStyle = '#c8c8c8';
      g.fillRect(0, 0, 256, 256);
      // Muscle fiber striations
      for (var y = 0; y < 256; y += 3) {
        var alpha = 0.08 + ((y * 7) % 13) * 0.012;
        g.strokeStyle = y % 6 === 0 ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(60,40,40,' + alpha + ')';
        g.lineWidth = 1.4;
        g.beginPath();
        g.moveTo(0, y);
        g.bezierCurveTo(85, y + 6, 170, y - 6, 256, y);
        g.stroke();
      }
      // Subtle fat marbling flecks
      for (var i = 0; i < 60; i++) {
        var fx = (i * 73) % 248 + 4;
        var fy = (i * 137) % 248 + 4;
        g.fillStyle = 'rgba(255,248,236,0.22)';
        g.fillRect(fx, fy, 4 + (i % 5), 2);
      }
      var tex = new THREE.CanvasTexture(cv);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      return tex;
    } catch (_) {
      return null;
    }
  }

  function initSteer3D() {
    var bundle = window.__THREE_BUNDLE;
    var modelData = window.__STEER_3D_MODEL;
    var canvas = $('steerCanvas');
    var viewport = $('steerViewport');
    if (!bundle || !modelData || !canvas || !viewport) return null;

    var THREE = bundle.THREE;
    var OrbitControls = bundle.OrbitControls;
    var RoomEnvironment = bundle.RoomEnvironment;
    if (!THREE || !OrbitControls || !RoomEnvironment) return null;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      return null;
    }

    document.body.classList.add('has-webgl');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.52;

    var camera = new THREE.PerspectiveCamera(34, 1, 0.02, 40);
    scene.add(camera);
    var keyLight = new THREE.DirectionalLight(0xfff3e2, 1.9);
    keyLight.position.set(1.2, 1.8, 1.4);
    var rimLight = new THREE.DirectionalLight(0x86dcf0, 1.35);
    rimLight.position.set(-1.5, 0.7, -1.6);
    var lTarget = new THREE.Object3D();
    lTarget.position.set(0, 0, -1);
    keyLight.target = lTarget;
    rimLight.target = lTarget;
    camera.add(keyLight, rimLight, lTarget);
    scene.add(new THREE.HemisphereLight(0xe4ecf2, 0x161e25, 0.6));

    var controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.minDistance = 0.65;
    controls.maxDistance = 6.2;
    controls.rotateSpeed = 0.75;
    controls.screenSpacePanning = true;

    // Circular Radiograph Platform (matching muscle-atlas floor)
    var floorCv = document.createElement('canvas');
    floorCv.width = 1024; floorCv.height = 1024;
    var floorTex = new THREE.CanvasTexture(floorCv);
    floorTex.colorSpace = THREE.SRGBColorSpace;
    function drawFloor() {
      var g = floorCv.getContext('2d');
      if (!g) return;
      var s = 1024, c = s / 2;
      g.clearRect(0, 0, s, s);
      var grad = g.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, 'rgba(111,208,232,0.16)');
      grad.addColorStop(0.58, 'rgba(111,208,232,0.05)');
      grad.addColorStop(1, 'rgba(111,208,232,0)');
      g.fillStyle = grad; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(140,200,220,0.28)'; g.lineWidth = 2;
      [0.62, 0.86].forEach(function (r) { g.beginPath(); g.arc(c, c, c * r, 0, Math.PI * 2); g.stroke(); });
      for (var a = 0; a < 360; a += 10) {
        var rad = a * Math.PI / 180, r1 = c * 0.86, r2 = c * (a % 30 === 0 ? 0.81 : 0.835);
        g.beginPath(); g.moveTo(c + Math.cos(rad) * r1, c + Math.sin(rad) * r1);
        g.lineTo(c + Math.cos(rad) * r2, c + Math.sin(rad) * r2); g.stroke();
      }
      var marker = function (txt, x, y) {
        g.save(); g.translate(x, y);
        g.fillStyle = 'rgba(236,222,194,0.9)'; g.fillRect(-40, -28, 80, 56);
        g.fillStyle = '#0a0f14'; g.font = '800 34px Archivo, Arial, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 2); g.restore();
      };
      var str = S();
      marker(str.floorL, c, c - c * 0.72); // -Z
      marker(str.floorR, c, c + c * 0.72); // +Z
      g.fillStyle = 'rgba(160,190,205,0.78)'; g.font = '600 24px "IBM Plex Mono", monospace';
      g.textAlign = 'center'; g.fillText(str.floorFront, c + c * 0.56, c);
      floorTex.needsUpdate = true;
    }
    drawFloor();
    var platform = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 3.5),
      new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, depthWrite: false })
    );
    platform.rotation.x = -Math.PI / 2;
    platform.position.set(0.05, 0.003, 0);
    platform.renderOrder = -2;
    scene.add(platform);

    // Build all dequantized 3D geometries from window.__STEER_3D_MODEL
    var fiberBump = createMuscleTexture(THREE);
    var Q = modelData.q;
    var rootGroup = new THREE.Group();
    scene.add(rootGroup);

    var cutMeshes = [];       // clickable bilateral muscle cut meshes
    var cutPickables = [];    // currently raycast-eligible meshes
    var bodyShellMesh = null;
    var skeletonMesh = null;

    var COL_SCAN = new THREE.Color(0x6fd0e8);
    var COL_AMBER = new THREE.Color(0xf0cf6a);
    var COL_OK = new THREE.Color(0x4fd18f);
    var COL_BAD = new THREE.Color(0xff7a6b);
    var COL_ZERO = new THREE.Color(0x000000);
    var tmpColor = new THREE.Color();

    modelData.meshes.forEach(function (m) {
      var geo = new THREE.BufferGeometry();
      var posArr = new Float32Array(m.p.length);
      for (var i = 0; i < m.p.length; i++) posArr[i] = m.p[i] / Q;
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      geo.setIndex(m.i);
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      geo.computeBoundingBox();

      // Generate basic planar UVs for muscle bump texture mapping
      var uvArr = new Float32Array((m.p.length / 3) * 2);
      for (var vi = 0, ui = 0; vi < posArr.length; vi += 3, ui += 2) {
        uvArr[ui] = (posArr[vi] + posArr[vi + 2]) * 1.4;
        uvArr[ui + 1] = posArr[vi + 1] * 1.6;
      }
      geo.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));

      if (m.k === 'ctx_body') {
        var bMat = new THREE.MeshStandardMaterial({
          color: 0x355064,
          roughness: 0.72,
          metalness: 0.05,
          transparent: true,
          opacity: 0.34,
          depthWrite: false
        });
        bodyShellMesh = new THREE.Mesh(geo, bMat);
        bodyShellMesh.renderOrder = -1;
        bodyShellMesh.raycast = function () {};
        rootGroup.add(bodyShellMesh);
        return;
      }

      if (m.k === 'ctx_skeleton') {
        var sMat = new THREE.MeshStandardMaterial({
          color: 0xe3d6bb,
          roughness: 0.62,
          metalness: 0.04,
          envMapIntensity: 0.8
        });
        skeletonMesh = new THREE.Mesh(geo, sMat);
        rootGroup.add(skeletonMesh);
        return;
      }

      // Cut piece
      var cutMeta = BY_ID[m.c];
      var zMeta = ZONES[cutMeta ? cutMeta.zone : 'dorsal'];
      var mat = new THREE.MeshStandardMaterial({
        color: state.colorMode === 'zones' ? zMeta.hex : zMeta.muscleHex,
        roughness: 0.48,
        metalness: 0.04,
        envMapIntensity: 0.9,
        bumpMap: fiberBump || null,
        bumpScale: fiberBump ? 0.014 : 0,
        side: THREE.FrontSide
      });

      var mesh = new THREE.Mesh(geo, mat);
      var center = geo.boundingSphere ? geo.boundingSphere.center.clone() : new THREE.Vector3();
      // Pick closest outer surface vertex to center as stable callout anchor
      var anchor = center.clone();
      var bestD = Infinity;
      for (var k = 0; k < posArr.length; k += 3) {
        var vx = posArr[k], vy = posArr[k + 1], vz = posArr[k + 2];
        var d2 = (vx - center.x) * (vx - center.x) + (vy - center.y) * (vy - center.y) + (vz - center.z) * (vz - center.z);
        if (d2 < bestD) { bestD = d2; anchor.set(vx, vy, vz); }
      }

      var rec = {
        name: m.n,
        cutId: m.c,
        side: m.s,
        layer: m.l || 1,
        explodeVec: new THREE.Vector3(m.e[0], m.e[1], m.e[2]),
        basePos: new THREE.Vector3(0, 0, 0),
        curExplode: 0,
        mesh: mesh,
        mat: mat,
        center: center,
        anchor: anchor,
        flash: null
      };
      mesh.userData.rec = rec;
      cutMeshes.push(rec);
      rootGroup.add(mesh);
    });

    // Fit full model bounding center & camera
    var modelCenter = new THREE.Vector3(0.05, 0.88, 0);
    var VIEW_OFFSETS = {
      side:     new THREE.Vector3(0.05, 0.35, -3.15),  // Looks at Animal Left (-Z), head right (+X)!
      sagittal: new THREE.Vector3(0.02, 0.25, 3.05),   // Right half removed -> sees Spine/Ribs/Lomo from inside!
      front:    new THREE.Vector3(3.15, 0.42, 0.42),
      back:     new THREE.Vector3(-3.15, 0.42, -0.42),
      top:      new THREE.Vector3(0.05, 3.15, -0.45)
    };
    camera.position.copy(modelCenter).add(VIEW_OFFSETS.side);
    camera.lookAt(modelCenter);
    controls.target.copy(modelCenter);
    controls.update();
    camera.updateMatrixWorld(true);

    var fly = null;
    function flyTo(targetPos, offsetVec, dur) {
      fly = {
        t0: controls.target.clone(),
        t1: targetPos.clone(),
        p0: camera.position.clone().sub(controls.target),
        p1: offsetVec.clone(),
        start: performance.now(),
        dur: dur || 480
      };
    }

    function setCameraView(preset) {
      if (preset === 'sagittal') {
        state.sagittal = true;
        refreshHUD();
        updateCutAppearance();
        flyTo(modelCenter, VIEW_OFFSETS.sagittal, 500);
        return;
      }
      if (preset === 'reset') {
        flyTo(modelCenter, state.sagittal ? VIEW_OFFSETS.sagittal : VIEW_OFFSETS.side, 450);
        return;
      }
      if (preset === 'side' && state.sagittal) {
        state.sagittal = false;
        refreshHUD();
        updateCutAppearance();
      }
      var off = VIEW_OFFSETS[preset] || VIEW_OFFSETS.side;
      flyTo(modelCenter, off, 450);
    }

    function focusCutCamera(cutId) {
      var camSide = camera.position.z < 0 ? 'L' : 'R';
      var rec = cutMeshes.find(function (r) { return r.cutId === cutId && r.side === camSide && r.mesh.visible; }) ||
                cutMeshes.find(function (r) { return r.cutId === cutId && r.mesh.visible; });
      if (!rec) return;
      var curOff = camera.position.clone().sub(controls.target);
      if (curOff.length() > 3.6 || curOff.length() < 1.2) curOff.setLength(2.65);
      var worldC = rec.center.clone().add(rec.mesh.position);
      flyTo(modelCenter.clone().lerp(worldC, 0.55), curOff, 420);
    }

    // Appearance sync: zone filters, study block, sagittal cutaway, deep cut auto-ghost, X-ray, bone visibility
    function updateCutAppearance() {
      var pool = activePool();
      var poolSet = Object.create(null);
      pool.forEach(function (c) { poolSet[c.id] = true; });

      // Deep cut auto-ghost when inspecting Lomo or Entrana in Study OR after answering!
      var activeTarget = state.mode === 'study'
        ? state.selectedId
        : (state.answered && state.question ? state.question.target.id : null);
      var deepFocus = (activeTarget === 'lomo' || activeTarget === 'entrana') && !state.xray && !state.sagittal && !state.exploded;
      var waistOccluders = { bife_angosto: true, vacio: true, matambre: true, tapa_asado: true };

      cutPickables = [];
      var camSide = camera.position.z < 0 ? 'L' : 'R';

      cutMeshes.forEach(function (rec) {
        var cutMeta = BY_ID[rec.cutId];
        var zMeta = ZONES[cutMeta.zone];
        var inBlock = !!poolSet[rec.cutId];
        var inZone = state.mode !== 'study' || state.zoneFilter === 'all' || cutMeta.zone === state.zoneFilter;
        var activeScope = inBlock && inZone;

        // Sagittal Media Res hides Right ('R') side external/internal cuts except skeleton so left interior is exposed!
        if (state.sagittal && rec.side === 'R') {
          rec.mesh.visible = false;
          return;
        }
        rec.mesh.visible = true;

        var isRight = state.mode !== 'study' && state.question && state.answered && rec.cutId === state.question.target.id;
        var isWrong = state.mode !== 'study' && state.question && state.question.kind === 'locate' && state.answered && rec.cutId === state.question.pickedId && !isRight;
        var isQuizAmber = state.mode !== 'study' && state.question && !state.answered && state.question.kind !== 'locate' && rec.cutId === state.question.target.id;
        var isSelected = state.mode === 'study' && rec.cutId === state.selectedId;

        if (isRight) rec.mat.color.setHex(0x4fd18f);
        else if (isWrong) rec.mat.color.setHex(0xff7a6b);
        else if (!activeScope) rec.mat.color.setHex(0x283540);
        else rec.mat.color.setHex(state.colorMode === 'zones' ? zMeta.hex : zMeta.muscleHex);

        var op = 1.0;
        if (state.xray) {
          op = (isSelected || isRight || isQuizAmber || rec.cutId === activeTarget) ? 0.92 : 0.24;
        } else if (deepFocus && waistOccluders[rec.cutId] && rec.side === camSide) {
          op = 0.20;
        } else if (!activeScope) {
          op = 0.32;
        }

        rec.mat.transparent = op < 0.99;
        rec.mat.opacity = op;
        rec.mat.depthWrite = op >= 0.99;
        rec.mesh.renderOrder = op < 0.99 ? 2 : 0;

        if (inBlock && op > 0.28) {
          cutPickables.push(rec.mesh);
        } else if (state.xray && inBlock) {
          // Under X-ray allow picking all layer >= 2 deep cuts first by including everything
          cutPickables.push(rec.mesh);
        }
      });

      if (skeletonMesh) {
        skeletonMesh.visible = state.bones;
      }
      if (bodyShellMesh) {
        bodyShellMesh.material.opacity = state.xray ? 0.16 : 0.34;
      }
    }

    function flashCut(cutId, ok) {
      var col = ok ? COL_OK : COL_BAD;
      var t0 = performance.now();
      cutMeshes.forEach(function (r) {
        if (r.cutId === cutId) r.flash = { color: col, t0: t0, dur: 800 };
      });
    }

    // Raycasting & hover state
    var raycaster = new THREE.Raycaster();
    var pointerNDC = new THREE.Vector2();
    var hoveredCutId = null;
    var ptrDown = null;

    function pickAt(clientX, clientY) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      var hits = raycaster.intersectObjects(cutPickables, false);
      if (!hits.length) return null;
      if (state.xray) {
        // Under X-ray, prefer deep internal layers (lomo / entrana) if ray intersects them too!
        var deepHit = hits.find(function (h) { return h.object.userData.rec && h.object.userData.rec.layer >= 2; });
        if (deepHit) return deepHit.object.userData.rec;
      }
      return hits[0].object.userData.rec || null;
    }

    canvas.addEventListener('pointerdown', function (e) {
      ptrDown = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener('pointermove', function (e) {
      var rec = pickAt(e.clientX, e.clientY);
      hoveredCutId = rec ? rec.cutId : null;
      canvas.style.cursor = rec ? 'pointer' : '';
    });
    canvas.addEventListener('pointerleave', function () {
      hoveredCutId = null;
      canvas.style.cursor = '';
    });
    canvas.addEventListener('pointerup', function (e) {
      if (!ptrDown) return;
      var dx = e.clientX - ptrDown.x, dy = e.clientY - ptrDown.y;
      ptrDown = null;
      if (dx * dx + dy * dy > 36) return; // drag/orbit, not click!
      var rec = pickAt(e.clientX, e.clientY);
      if (!rec) return;
      onCutClickedFrom3D(rec.cutId);
    });

    function resize() {
      var w = viewport.clientWidth || 640;
      var h = viewport.clientHeight || 320;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(viewport);
    }

    // 3D floating leader + callout update
    var leaderLine = $('leaderLine');
    var leaderDot = $('leaderDot');
    var callout = $('callout');
    var projVec = new THREE.Vector3();

    function updateCalloutOverlay() {
      if (!leaderLine || !leaderDot || !callout) return;
      var showId = null;
      if (state.mode === 'study') {
        showId = hoveredCutId || state.selectedId;
      } else if (state.answered && state.question) {
        showId = state.question.target.id;
      }

      if (!showId) {
        callout.hidden = true;
        leaderLine.setAttribute('x1', 0); leaderLine.setAttribute('x2', 0);
        leaderLine.setAttribute('y1', 0); leaderLine.setAttribute('y2', 0);
        leaderDot.setAttribute('r', 0);
        return;
      }

      // Pick side closer to camera for clearest leader line
      var bestRec = null, bestDist = Infinity;
      cutMeshes.forEach(function (r) {
        if (r.cutId !== showId || !r.mesh.visible) return;
        var wc = r.anchor.clone().add(r.mesh.position);
        var d = wc.distanceTo(camera.position);
        if (d < bestDist) { bestDist = d; bestRec = r; }
      });

      if (!bestRec) { callout.hidden = true; leaderDot.setAttribute('r', 0); return; }

      var w = viewport.clientWidth || 640, h = viewport.clientHeight || 320;
      projVec.copy(bestRec.anchor).add(bestRec.mesh.position).project(camera);
      if (projVec.z > 1) { callout.hidden = true; leaderDot.setAttribute('r', 0); return; }

      var px = (projVec.x * 0.5 + 0.5) * w;
      var py = (-projVec.y * 0.5 + 0.5) * h;

      var c = BY_ID[showId];
      callout.innerHTML = cutName(c) + '<small>' + c.names.usa + '</small>';
      callout.hidden = false;
      var bw = callout.offsetWidth || 140, bh = callout.offsetHeight || 34;
      var dir = px < w * 0.5 ? 1 : -1;
      var lx = Math.max(8, Math.min(w - bw - 8, px + dir * 48 - (dir < 0 ? bw : 0)));
      var ly = Math.max(8, Math.min(h - bh - 8, py - 34));
      callout.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';

      var ex = dir > 0 ? lx : lx + bw;
      var ey = ly + bh * 0.5;
      leaderLine.setAttribute('x1', px.toFixed(1));
      leaderLine.setAttribute('y1', py.toFixed(1));
      leaderLine.setAttribute('x2', ex.toFixed(1));
      leaderLine.setAttribute('y2', ey.toFixed(1));
      leaderDot.setAttribute('cx', px.toFixed(1));
      leaderDot.setAttribute('cy', py.toFixed(1));
      leaderDot.setAttribute('r', 3.6);
    }

    function tick(now) {
      if (fly) {
        var k = Math.min(1, (now - fly.start) / fly.dur);
        var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        controls.target.lerpVectors(fly.t0, fly.t1, e);
        var off = fly.p0.clone().lerp(fly.p1, e);
        camera.position.copy(controls.target).add(off);
        if (k >= 1) fly = null;
      }
      controls.update();

      var targetExplode = state.exploded ? 0.36 : 0;
      var selectedCut = state.mode === 'study'
        ? state.selectedId
        : (state.answered && state.question ? state.question.target.id : null);
      var quizAmberCut = state.mode !== 'study' && state.question && !state.answered && state.question.kind !== 'locate'
        ? state.question.target.id
        : null;

      cutMeshes.forEach(function (r) {
        r.curExplode += (targetExplode - r.curExplode) * 0.14;
        r.mesh.position.copy(r.explodeVec).multiplyScalar(r.curExplode);
        r.mesh.updateMatrixWorld();

        tmpColor.copy(COL_ZERO);
        if (selectedCut && r.cutId === selectedCut) {
          tmpColor.copy(COL_SCAN).multiplyScalar(0.32 + 0.12 * Math.sin(now / 260));
        } else if (quizAmberCut && r.cutId === quizAmberCut) {
          tmpColor.copy(COL_AMBER).multiplyScalar(0.36 + 0.14 * Math.sin(now / 220));
        } else if (hoveredCutId && r.cutId === hoveredCutId) {
          tmpColor.copy(COL_SCAN).multiplyScalar(0.24);
        }
        if (r.flash) {
          var fk = (now - r.flash.t0) / r.flash.dur;
          if (fk >= 1) r.flash = null;
          else tmpColor.lerp(r.flash.color, 0.85 * (1 - fk));
        }
        r.mat.emissive.copy(tmpColor);
      });

      camera.updateMatrixWorld();
      updateCutAppearance();
      updateCalloutOverlay();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    updateCutAppearance();
    requestAnimationFrame(tick);

    return {
      updateCutAppearance: updateCutAppearance,
      setCameraView: setCameraView,
      focusCutCamera: focusCutCamera,
      flashCut: flashCut,
      drawFloor: drawFloor,
      resize: resize,
      cutMeshes: cutMeshes
    };
  }

  function onCutClickedFrom3D(cid) {
    var cut = BY_ID[cid];
    if (!cut) return;
    var pool = activePool();
    if (!pool.some(function (c) { return c.id === cid; })) return;
    if (state.mode === 'study') {
      state.selectedId = cid;
      STORE.set('selectedId', cid);
      renderStage();
      return;
    }
    if (state.question && state.question.kind === 'locate' && !state.answered) {
      submitLocateAnswer(cut);
    }
  }

  function setLang(newLang) {
    LANG = newLang === 'en' ? 'en' : 'es';
    STORE.set('lang', LANG);
    try { localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    applyStaticLabels();
    if (viewer3d) viewer3d.drawFloor();
    renderRail();
    renderStage();
  }

  function elapsedSec() {
    if (state.frozenSec != null) return state.frozenSec;
    if (!state.roundStart || state.mode === 'study') return 0;
    return (Date.now() - state.roundStart) / 1000;
  }

  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  setInterval(function () {
    if (state.mode !== 'study' && state.roundStart && state.frozenSec == null) {
      $('sTime').textContent = fmtClock(elapsedSec());
    }
  }, 400);

  function refreshHUD() {
    var h = S().hud;
    var camLbl = $('camViewLbl'), dragHint = $('hudDragHint'), toolsLbl = $('tools3dLbl');
    if (camLbl) camLbl.textContent = h.camLbl;
    if (dragHint) dragHint.textContent = h.dragHint;
    if (toolsLbl) toolsLbl.textContent = h.toolsLbl;

    var sideB = document.querySelector('#camViewGroup [data-cam="side"]');
    var sagB = $('sagittalBtn');
    var frB = document.querySelector('#camViewGroup [data-cam="front"]');
    var bkB = document.querySelector('#camViewGroup [data-cam="back"]');
    var tpB = document.querySelector('#camViewGroup [data-cam="top"]');
    var rsB = $('resetCamBtn');
    if (sideB) { sideB.textContent = h.side; sideB.setAttribute('aria-pressed', String(!state.sagittal)); }
    if (sagB) { sagB.innerHTML = h.sagittal + ' <kbd>M</kbd>'; sagB.setAttribute('aria-pressed', String(state.sagittal)); }
    if (frB) frB.textContent = h.front;
    if (bkB) bkB.textContent = h.back;
    if (tpB) tpB.textContent = h.top;
    if (rsB) rsB.innerHTML = h.reset + ' <kbd>R</kbd>';

    var exB = $('explodeBtn'), xrB = $('xrayBtn'), bnB = $('bonesBtn'), cmB = $('colorModeBtn'), d2B = $('toggle2dBtn');
    if (exB) { exB.innerHTML = h.explode + ' <kbd>E</kbd>'; exB.setAttribute('aria-pressed', String(state.exploded)); }
    if (xrB) { xrB.innerHTML = h.xray + ' <kbd>X</kbd>'; xrB.setAttribute('aria-pressed', String(state.xray)); }
    if (bnB) { bnB.innerHTML = h.bones + ' <kbd>B</kbd>'; bnB.setAttribute('aria-pressed', String(state.bones)); }
    if (cmB) {
      cmB.textContent = state.colorMode === 'zones' ? h.colorZones : h.colorMuscle;
      cmB.setAttribute('aria-pressed', String(state.colorMode === 'zones'));
    }
    if (d2B) { d2B.innerHTML = h.map2d + ' <kbd>D</kbd>'; d2B.setAttribute('aria-pressed', String(state.show2d)); }
    document.body.classList.toggle('show-2d', state.show2d);
  }

  function applyStaticLabels() {
    var s = S();
    document.documentElement.lang = LANG;
    document.title = s.docTitle;
    $('brandMark').innerHTML = LANG === 'en'
      ? 'MEAT <span>CUTS</span><sup>T028</sup>'
      : 'CORTES DE <span>CARNE</span><sup>T028</sup>';
    $('brandSub').textContent = s.brandSub;
    $('homeLink').setAttribute('aria-label', s.home);
    $('homeLink').setAttribute('title', s.home);
    $('railTitle').textContent = s.railTitle;
    $('railPath').textContent = s.railPath;
    $('langHeading').textContent = s.langHeading;
    $('langSel').value = LANG;
    $('modeHeading').textContent = s.modeHeading;
    $('taskHeading').textContent = s.taskHeading;
    $('statAccLabel').textContent = s.statAccLabel;
    $('statTimeLabel').textContent = s.statTimeLabel;
    $('statStreakLabel').textContent = s.statStreakLabel;
    $('cleanBtn').textContent = s.actions.clean;
    $('cleanExit').textContent = s.actions.cleanExit;
    $('restartBtn').textContent = s.actions.restart;
    $('settingsBtn').textContent = s.actions.settings;
    $('howBtn').textContent = s.actions.how;
    $('keysHint').textContent = s.actions.keysHint;
    $('creditText').textContent = s.creditText;
    $('introTitle').textContent = s.introTitle;
    $('introBody1').innerHTML = s.introBody1;
    $('introList').innerHTML = s.introList.join('');
    $('introGo').textContent = s.introGo;

    Array.prototype.forEach.call($('modeSeg').querySelectorAll('button'), function (btn) {
      var m = btn.getAttribute('data-v');
      btn.textContent = s.modes[m] || m;
      btn.setAttribute('aria-pressed', state.mode === m ? 'true' : 'false');
    });
    $('modeHint').textContent = s.modeHints[state.mode] || '';

    Array.prototype.forEach.call($('taskSeg').querySelectorAll('button'), function (btn) {
      var t = btn.getAttribute('data-v');
      btn.textContent = s.tasks[t] || t;
      btn.setAttribute('aria-pressed', state.task === t ? 'true' : 'false');
    });
    $('taskHint').textContent = s.taskHints[state.task] || '';
    document.body.classList.toggle('quiz-active', state.mode !== 'study');
    refreshHUD();
    updateStatsUI();
  }

  function renderRail() {
    var box = $('railList');
    box.innerHTML = '';
    var nextAssigned = false;

    BLOCKS.forEach(function (b, idx) {
      var best = state.bests[b.id];
      var mastered = !!(best && best.pct >= 90);
      var statusCls = mastered ? 'done' : (!nextAssigned ? 'next' : '');
      if (!mastered && !nextAssigned) nextAssigned = true;
      var rightTxt = best ? (best.pct + '%') : String(CUTS.filter(b.match).length);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', state.block === b.id ? 'true' : 'false');
      btn.innerHTML =
        '<span><i>' + String(idx + 1).padStart(2, '0') + '</i>' + (LANG === 'en' ? b.en : b.es) + '</span>' +
        '<em class="' + statusCls + '">' + rightTxt + '</em>';

      btn.addEventListener('click', function () {
        state.block = b.id;
        STORE.set('block', b.id);
        var pool = activePool();
        if (pool.length && !pool.some(function (c) { return c.id === state.selectedId; })) {
          state.selectedId = pool[0].id;
          STORE.set('selectedId', state.selectedId);
        }
        renderRail();
        updateStatsUI();
        if (state.mode === 'study') renderStage();
        else startRoundOrQuestion(true);
      });
      box.appendChild(btn);
    });
  }

  function advanceQuestion() {
    if (state.mode === 'test') state.roundAsk += 1;
    startRoundOrQuestion(false);
  }

  function renderDockActions() {
    var s = S();
    var box = $('actions');
    box.innerHTML = '';

    if (state.mode === 'study') {
      var pool = activePool();
      var idx = pool.findIndex(function (c) { return c.id === state.selectedId; });
      if (idx < 0) idx = 0;

      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'act';
      prev.innerHTML = '<kbd>←</kbd> ' + s.actions.prev;
      prev.addEventListener('click', function () {
        var ni = (idx - 1 + pool.length) % pool.length;
        state.selectedId = pool[ni].id;
        STORE.set('selectedId', state.selectedId);
        renderStage();
      });

      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'act';
      next.innerHTML = s.actions.next + ' <kbd>→</kbd>';
      next.addEventListener('click', function () {
        var ni = (idx + 1) % pool.length;
        state.selectedId = pool[ni].id;
        STORE.set('selectedId', state.selectedId);
        renderStage();
      });

      var go = document.createElement('button');
      go.type = 'button';
      go.className = 'act primary';
      go.textContent = s.actions.goPractice;
      go.addEventListener('click', function () {
        state.mode = 'practice';
        STORE.set('mode', 'practice');
        applyStaticLabels();
        startRoundOrQuestion(true);
      });

      box.appendChild(prev);
      box.appendChild(next);
      box.appendChild(go);
      return;
    }

    var q = state.question;
    if (!q || (state.mode === 'test' && state.roundAsk > state.roundTarget)) return;

    if (q.kind !== 'locate') {
      q.options.forEach(function (opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'act';
        if (state.answered) {
          btn.disabled = true;
          if (opt.isRight) btn.classList.add('is-right');
          else if (idx === q.pickedIdx) btn.classList.add('is-wrong');
        }
        btn.innerHTML = '<kbd>' + (idx + 1) + '</kbd> ' + opt.label;
        btn.addEventListener('click', function () {
          if (!state.answered) submitChoiceAnswer(idx);
        });
        box.appendChild(btn);
      });
    }

    if (state.answered) {
      var nb = document.createElement('button');
      nb.type = 'button';
      nb.className = 'act primary';
      nb.innerHTML = s.actions.next + ' <kbd>Space</kbd>';
      nb.addEventListener('click', advanceQuestion);
      box.appendChild(nb);
    }
  }

  function renderTopPrompt() {
    var s = S();
    var pr = $('prompt');
    pr.classList.remove('is-ok', 'is-bad');

    if (state.mode === 'study') {
      var c = BY_ID[state.selectedId] || CUTS[1];
      $('pEyebrow').textContent = s.studyEyebrow + ' #' + c.code;
      $('pName').textContent = cutName(c);
      $('pMeta').textContent = zoneName(c.zone) + ' · ' + (LANG === 'en' ? c.tenderEn : c.tenderEs);
      $('pBarWrap').classList.add('is-off');
      renderDockActions();
      return;
    }

    var q = state.question;
    if (!q) return;
    if (state.mode === 'test') {
      $('pBarWrap').classList.remove('is-off');
      var pct = Math.min(100, Math.round((state.roundAsk / state.roundTarget) * 100));
      $('pBar').style.width = pct + '%';
    } else {
      $('pBarWrap').classList.add('is-off');
    }

    if (state.answered) {
      var target = q.target;
      pr.classList.add(state.lastOk ? 'is-ok' : 'is-bad');
      $('pEyebrow').textContent = state.lastOk ? s.rightMsg.trim() : (s.wrongMsg + '#' + target.code);
      $('pName').textContent = (state.lastOk ? s.rightMsg : s.wrongMsg) + cutName(target) + ' (' + target.names.usa + ')';
      $('pMeta').textContent = zoneName(target.zone) + ' · ' + cookName(target.cookKey);
    } else {
      $('pEyebrow').textContent = q.eyebrow;
      $('pName').textContent = q.title;
      $('pMeta').textContent = q.meta;
    }
    renderDockActions();
  }

  function buildZoneBar() {
    var s = S();
    var bar = document.createElement('div');
    bar.className = 'zone-bar';

    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'zone-chip';
    allBtn.style.setProperty('--zc', 'var(--scan)');
    allBtn.setAttribute('aria-pressed', state.zoneFilter === 'all' ? 'true' : 'false');
    allBtn.innerHTML = '<i></i><span>' + s.allZones + '</span>';
    allBtn.addEventListener('click', function () {
      state.zoneFilter = 'all';
      renderStage();
    });
    bar.appendChild(allBtn);

    Object.keys(ZONES).forEach(function (zk) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'zone-chip';
      chip.style.setProperty('--zc', ZONES[zk].color);
      chip.setAttribute('aria-pressed', state.zoneFilter === zk ? 'true' : 'false');
      chip.innerHTML = '<i></i><span>' + zoneName(zk) + '</span>';
      chip.addEventListener('click', function () {
        state.zoneFilter = state.zoneFilter === zk ? 'all' : zk;
        renderStage();
      });
      bar.appendChild(chip);
    });
    return bar;
  }

  var CUT_MAP = {
    aguja:        { polys: ['205,86 295,76 295,148 174,148'], labels: [[245, 115]] },
    bife_ancho:   { polys: ['295,76 405,74 405,142 295,148'], labels: [[350, 110]] },
    bife_angosto: { polys: ['405,74 515,72 515,114 405,114'], labels: [[460, 93]] },
    lomo:         { polys: ['405,114 515,114 515,148 405,142'], labels: [[460, 130]] },
    cuadril:      { polys: ['515,72 615,80 685,102 648,152 590,152 515,148'], labels: [[590, 115]] },
    tapa_asado:   { polys: ['295,148 405,142 405,184 295,184'], labels: [[350, 164]] },
    asado_tira:   { polys: ['295,184 405,184 405,256 295,252'], labels: [[350, 220]] },
    entrana:      { polys: ['405,142 460,145 460,222 405,222'], labels: [[432, 183]] },
    vacio:        { polys: ['460,145 515,148 530,194 522,222 460,222'], labels: [[492, 185]] },
    matambre:     { polys: ['405,222 522,222 528,256 405,256'], labels: [[466, 239]] },
    paleta:       { polys: ['174,148 295,148 295,210 178,210 166,178'], labels: [[234, 179]] },
    pecho:        { polys: ['178,210 295,210 295,252 250,254 198,250 182,232'], labels: [[238, 232]] },
    osobuco: {
      polys: [
        '198,250 250,254 244,302 248,342 216,342 210,302',
        '636,248 694,248 698,296 686,342 656,342 662,296'
      ],
      labels: [[228, 296], [672, 296]]
    },
    bola_lomo:    { polys: ['515,148 590,152 606,248 588,254 528,256 522,222 530,194'], labels: [[562, 204]] },
    nalga:        { polys: ['590,152 648,152 656,206 662,248 606,248'], labels: [[627, 202]] },
    peceto:       { polys: ['685,102 712,138 714,198 694,248 662,248 656,206 648,152'], labels: [[686, 186]] }
  };

  function buildButcherDiagram(poolSet) {
    var box = document.createElement('div');
    box.className = 'butcher-diagram';

    var isLocateQ = state.mode !== 'study' && state.question && state.question.kind === 'locate';
    var hideLabels = state.mode === 'test' && isLocateQ && !state.answered;

    var polys = CUTS.map(function (c) {
      var geo = CUT_MAP[c.id] || { polys: [c.poly], labels: [[c.cx, c.cy]] };
      var inBlock = !!poolSet[c.id];
      var inZone = state.mode !== 'study' || state.zoneFilter === 'all' || c.zone === state.zoneFilter;
      var dim = !(inBlock && inZone);
      var cls = 'cut-poly';
      if (dim) cls += ' is-dim';
      if (state.mode === 'study' && c.id === state.selectedId) cls += ' is-selected';
      else if (state.mode !== 'study' && state.question) {
        if (state.answered && c.id === state.question.target.id) {
          cls += ' is-right';
        } else if (state.question.kind === 'locate' && state.answered && c.id === state.question.pickedId) {
          cls += ' is-wrong';
        } else if (state.question.kind !== 'locate' && c.id === state.question.target.id && state.mode === 'practice') {
          cls += ' is-target';
        }
      }

      var labelText = hideLabels ? '?' : c.code;
      var shapes = geo.polys.map(function (pts) { return '<polygon points="' + pts + '"/>'; }).join('');
      var texts = !dim ? geo.labels.map(function (xy) {
        return '<text class="cut-label" x="' + xy[0] + '" y="' + xy[1] + '">' + labelText + '</text>';
      }).join('') : '';

      return '<g class="' + cls + '" data-cid="' + c.id + '" style="--zc:' + zoneColor(c.zone) + '">' + shapes + '</g>' + texts;
    }).join('');

    var ribs = [306, 326, 346, 366, 386, 406, 426].map(function (rx) {
      return '<path d="M' + rx + ',86 Q' + (rx + 10) + ',156 ' + (rx + 2) + ',232" fill="none" stroke="#6fd0e8" stroke-opacity="0.14" stroke-width="1.3" stroke-dasharray="3 3"/>';
    }).join('');

    box.innerHTML =
      '<svg class="butcher-svg" viewBox="0 0 820 380" role="img" aria-label="Anatomical beef cuts map">' +
        '<defs>' +
          '<linearGradient id="steerSkin" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#172834"/>' +
            '<stop offset="100%" stop-color="#0d1821"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<line x1="60" y1="350" x2="760" y2="350" stroke="#223747" stroke-width="1.5" stroke-dasharray="6 5"/>' +
        '<path d="M205,86 C168,74 134,74 102,88 C92,70 100,50 120,44 C110,58 114,72 128,76 C152,78 178,82 205,86 ' +
                 'L295,76 L405,74 L515,72 L615,80 L685,102 L712,138 L714,198 L694,248 L698,296 L686,342 L656,342 L662,296 L636,248 ' +
                 'L606,248 L588,254 L528,256 L405,256 L295,252 L250,254 L244,302 L248,342 L216,342 L210,302 L198,250 ' +
                 'L182,232 L178,210 L166,178 L174,148 C154,154 132,154 106,144 C82,132 78,108 92,90 Z" ' +
              'fill="url(#steerSkin)" stroke="#48697e" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M174,108 Q295,94 405,90 Q530,86 678,116" fill="none" stroke="#ecdec2" stroke-opacity="0.18" stroke-width="2.2" stroke-dasharray="5 4"/>' +
        ribs +
        '<path d="M708,132 Q742,148 734,254" fill="none" stroke="#48697e" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="122" cy="104" r="3" fill="#6fd0e8" opacity="0.75"/>' +
        '<path d="M148,88 L162,74 L160,94 Z" fill="#1b303e" stroke="#48697e" stroke-width="1.2"/>' +
        polys +
      '</svg>';

    Array.prototype.forEach.call(box.querySelectorAll('.cut-poly'), function (poly) {
      poly.addEventListener('click', function () {
        var cid = poly.getAttribute('data-cid');
        var cut = BY_ID[cid];
        if (!cut || !poolSet[cid]) return;
        if (state.mode === 'study') {
          state.selectedId = cid;
          STORE.set('selectedId', cid);
          renderStage();
          return;
        }
        if (state.question && state.question.kind === 'locate' && !state.answered) {
          submitLocateAnswer(cut);
        }
      });
    });

    return box;
  }

  function buildCutPills(pool) {
    var wrap = document.createElement('div');
    wrap.className = 'cut-pills';
    pool.forEach(function (c) {
      if (state.zoneFilter !== 'all' && c.zone !== state.zoneFilter) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cut-pill';
      btn.style.setProperty('--zc', zoneColor(c.zone));
      btn.setAttribute('aria-pressed', state.selectedId === c.id ? 'true' : 'false');
      btn.innerHTML = '<span class="code">' + c.code + '</span><span>' + cutName(c) + '</span>';
      btn.addEventListener('click', function () {
        state.selectedId = c.id;
        STORE.set('selectedId', c.id);
        renderStage();
      });
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function buildCutCrossSectionSVG(c) {
    var col = zoneColor(c.zone);
    var detail = '';
    var tag = '';

    if (c.id === 'osobuco') {
      detail =
        '<ellipse cx="90" cy="56" rx="64" ry="38" fill="#7c282e" stroke="#f0d7b8" stroke-width="3.2"/>' +
        '<path d="M40,42 Q90,56 144,44 M42,68 Q90,58 140,70" fill="none" stroke="#e4cfb2" stroke-opacity="0.75" stroke-width="2" stroke-dasharray="4 3"/>' +
        '<circle cx="90" cy="56" r="14" fill="#f2e6cf" stroke="#cdb692" stroke-width="2"/>' +
        '<circle cx="90" cy="56" r="7.5" fill="#d9756c" fill-opacity="0.85"/>';
      tag = LANG === 'en' ? 'Marrow bone + collagen septa' : 'Hueso con tuétano + colágeno';
    } else if (c.id === 'asado_tira') {
      detail =
        '<rect x="20" y="34" width="140" height="44" rx="10" fill="#812c32" stroke="#ebd4b6" stroke-width="3"/>' +
        '<path d="M22,42 Q90,38 158,42" fill="none" stroke="#f3e6cf" stroke-width="4" stroke-linecap="round"/>' +
        '<rect x="44" y="50" width="22" height="14" rx="4" fill="#efe2cb" stroke="#bfa987" stroke-width="1.5"/>' +
        '<rect x="82" y="50" width="22" height="14" rx="4" fill="#efe2cb" stroke="#bfa987" stroke-width="1.5"/>' +
        '<rect x="120" y="50" width="22" height="14" rx="4" fill="#efe2cb" stroke="#bfa987" stroke-width="1.5"/>';
      tag = LANG === 'en' ? 'Cross-cut rib bones + fat' : 'Costillas transversales + grasa';
    } else if (c.id === 'entrana' || c.id === 'vacio' || c.id === 'matambre') {
      detail =
        '<path d="M22,52 C34,32 146,30 158,54 C156,74 128,82 90,82 C52,82 24,74 22,52 Z" fill="#842a31" stroke="#ebd7ba" stroke-width="2.5"/>' +
        '<path d="M32,48 Q90,42 146,48 M28,57 Q90,51 150,57 M34,66 Q90,61 144,66 M44,74 Q90,70 132,74" fill="none" stroke="#d87f85" stroke-opacity="0.7" stroke-width="1.6"/>' +
        '<line x1="90" y1="22" x2="90" y2="90" stroke="#6fd0e8" stroke-width="1.8" stroke-dasharray="4 3"/>';
      tag = LANG === 'en' ? 'Long fibers · slice across grain ⊥' : 'Fibras largas · cortar ⊥ a la veta';
    } else if (c.id === 'bife_ancho') {
      detail =
        '<ellipse cx="90" cy="56" rx="64" ry="38" fill="#8b2b33" stroke="#f0d9bc" stroke-width="3"/>' +
        '<path d="M36,42 Q90,26 144,44" fill="none" stroke="#f2e4cd" stroke-width="3.2" stroke-linecap="round"/>' +
        '<circle cx="64" cy="58" r="2.2" fill="#f5ead7"/><circle cx="78" cy="48" r="2.5" fill="#f5ead7"/><circle cx="96" cy="52" r="2.3" fill="#f5ead7"/>' +
        '<circle cx="114" cy="48" r="2.1" fill="#f5ead7"/><circle cx="122" cy="64" r="2.4" fill="#f5ead7"/><circle cx="86" cy="68" r="2" fill="#f5ead7"/>' +
        '<path d="M56,64 Q72,58 84,64 M98,62 Q114,56 126,64" fill="none" stroke="#f5ead7" stroke-opacity="0.75" stroke-width="1.5"/>';
      tag = LANG === 'en' ? 'Abundant marbling + spinalis' : 'Marmolado abundante + ceja';
    } else if (c.id === 'bife_angosto' || c.id === 'cuadril' || c.id === 'tapa_asado') {
      detail =
        '<path d="M26,46 C26,30 150,32 152,50 C150,76 112,86 72,84 C40,82 26,68 26,46 Z" fill="#892b33" stroke="#ecd9be" stroke-width="2.5"/>' +
        '<path d="M30,38 Q92,28 148,44" fill="none" stroke="#f5ead6" stroke-width="6.5" stroke-linecap="round"/>' +
        '<circle cx="68" cy="54" r="1.8" fill="#f5ead7"/><circle cx="92" cy="60" r="2" fill="#f5ead7"/><circle cx="116" cy="56" r="1.8" fill="#f5ead7"/><circle cx="82" cy="70" r="1.7" fill="#f5ead7"/>';
      tag = LANG === 'en' ? 'Outer fat cap + moderate marbling' : 'Capa grasa externa + marmolado';
    } else if (c.id === 'lomo' || c.id === 'peceto') {
      detail =
        '<ellipse cx="90" cy="56" rx="44" ry="36" fill="#9a343c" stroke="#ecd6bc" stroke-width="2.2"/>' +
        '<path d="M62,48 Q90,44 118,48 M58,58 Q90,54 122,58 M64,68 Q90,65 116,68" fill="none" stroke="#c96b72" stroke-opacity="0.6" stroke-width="1.4"/>';
      tag = LANG === 'en' ? 'Lean cylindrical · fine grain' : 'Magro cilíndrico · fibra muy fina';
    } else {
      detail =
        '<path d="M26,54 C28,30 148,28 154,54 C150,78 120,86 88,86 C52,86 26,76 26,54 Z" fill="#7a262c" stroke="#e4cfb3" stroke-width="2.6"/>' +
        '<path d="M40,48 Q84,60 142,44 M46,68 Q94,54 136,72" fill="none" stroke="#ebd7b8" stroke-opacity="0.72" stroke-width="2.1"/>' +
        '<circle cx="72" cy="44" r="1.6" fill="#f2e4ce"/><circle cx="108" cy="64" r="1.8" fill="#f2e4ce"/>';
      tag = LANG === 'en' ? 'Dense bundles · rich collagen' : 'Haces densos · rico en colágeno';
    }

    return '<div class="cut-cross-box">' +
      '<svg class="cut-cross-svg" viewBox="0 0 180 116" aria-hidden="true">' +
        '<rect width="180" height="116" rx="8" fill="#09131b" stroke="' + col + '" stroke-opacity="0.35"/>' +
        detail +
        '<text x="90" y="106" text-anchor="middle" fill="#b7c6d3" font-family="IBM Plex Mono,monospace" font-size="9">' + tag + '</text>' +
      '</svg>' +
      '<small>' + (LANG === 'en' ? 'Fiber & marbling' : 'Corte transversal') + '</small>' +
    '</div>';
  }

  function buildInspectorCard(c) {
    var s = S();
    var card = document.createElement('div');
    card.className = 'cut-inspector';
    card.style.setProperty('--zc', zoneColor(c.zone));

    card.innerHTML =
      '<div class="cut-insp-top">' +
        buildCutCrossSectionSVG(c) +
        '<div class="cut-insp-main">' +
          '<div class="cut-head">' +
            '<h4>' + c.code + ' · ' + cutName(c) + '</h4>' +
            '<div class="cut-badges">' +
              '<span class="cut-badge">' + zoneName(c.zone) + '</span>' +
              '<span class="cut-badge cook">' + cookName(c.cookKey) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="equiv-grid">' +
            '<div class="equiv-cell"><small>' + s.lblArg + '</small><b>' + c.names.arg + '</b></div>' +
            '<div class="equiv-cell"><small>' + s.lblEsp + '</small><b>' + c.names.esp + '</b></div>' +
            '<div class="equiv-cell"><small>' + s.lblMex + '</small><b>' + c.names.mex + '</b></div>' +
            '<div class="equiv-cell"><small>' + s.lblUsa + '</small><b>' + c.names.usa + '</b></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cut-body">' +
        '<p><b>' + s.anatWord + '</b> ' + (LANG === 'en' ? c.anatEn : c.anatEs) + '</p>' +
        '<p class="tip"><b>' + s.tipWord + '</b> ' + (LANG === 'en' ? c.tipEn : c.tipEs) + '</p>' +
      '</div>';

    return card;
  }

  function buildChoiceFocusCard(q) {
    var card = document.createElement('div');
    card.className = 'quiz-card';
    card.innerHTML = '<b>' + q.title + '</b><span>' + q.meta + '</span>';
    return card;
  }

  function renderRoundSummary(felt) {
    var s = S();
    state.frozenSec = elapsedSec();
    var timeSec = Math.round(state.frozenSec);
    var acc = Math.round((state.roundRight / state.roundTarget) * 100);
    var passed = acc >= 90;
    var prev = state.bests[state.block];
    if (!prev || acc > prev.pct || (acc === prev.pct && timeSec < prev.time)) {
      state.bests[state.block] = { pct: acc, time: timeSec };
      STORE.set('bests', state.bests);
    }
    renderRail();
    updateStatsUI();

    var box = document.createElement('div');
    box.className = 'quiz-card';
    box.innerHTML =
      '<b style="font-size:20px">' + s.roundDone + ' · ' + acc + '%</b>' +
      '<span>' + state.roundRight + ' / ' + state.roundTarget + ' ' + s.roundMeta + fmtClock(timeSec) + '</span>';

    var again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn primary';
    again.style.justifySelf = 'center';
    again.style.marginTop = '6px';
    again.textContent = s.actions.restart;
    again.addEventListener('click', function () { startRoundOrQuestion(true); });
    box.appendChild(again);
    felt.appendChild(box);

    var pr = $('prompt');
    pr.classList.remove('is-ok', 'is-bad');
    pr.classList.add(passed ? 'is-ok' : 'is-bad');
    $('pEyebrow').textContent = s.modes.test;
    $('pName').textContent = s.roundDone + ' · ' + acc + '%';
    $('pMeta').textContent = passed ? s.passedMsg : s.retryMsg;
    $('pBar').style.width = '100%';
    $('actions').innerHTML = '';
    if (viewer3d) viewer3d.updateCutAppearance();
  }

  function renderStage() {
    var felt = $('felt');
    felt.innerHTML = '';
    var pool = activePool();
    var poolSet = {};
    pool.forEach(function (c) { poolSet[c.id] = true; });

    if (state.mode === 'study') {
      felt.appendChild(buildZoneBar());
      felt.appendChild(buildButcherDiagram(poolSet));
      felt.appendChild(buildCutPills(pool));
      felt.appendChild(buildInspectorCard(BY_ID[state.selectedId] || CUTS[1]));
      renderTopPrompt();
      if (viewer3d) {
        viewer3d.updateCutAppearance();
        viewer3d.focusCutCamera(state.selectedId);
      }
      return;
    }

    if (state.mode === 'test' && state.roundAsk > state.roundTarget) {
      renderRoundSummary(felt);
      return;
    }

    felt.appendChild(buildButcherDiagram(poolSet));
    if (state.question) {
      if (state.answered) {
        felt.appendChild(buildInspectorCard(state.question.target));
      } else if (state.question.kind !== 'locate') {
        felt.appendChild(buildChoiceFocusCard(state.question));
      }
    }
    renderTopPrompt();
    if (viewer3d) viewer3d.updateCutAppearance();
  }

  function pickKind() {
    if (state.task !== 'mix') return state.task;
    var kinds = ['locate', 'equiv', 'cook'];
    return kinds[Math.floor(Math.random() * kinds.length)];
  }

  function makeQuestion() {
    var s = S();
    var pool = activePool();
    var target = pool[Math.floor(Math.random() * pool.length)];
    var kind = pickKind();

    if (kind === 'locate') {
      var metaLine = zoneName(target.zone) + ' · ' + target.names.usa;
      if (state.mode === 'practice' && target.deep) metaLine = s.deepHintPractice;
      return {
        kind: 'locate',
        target: target,
        pickedId: null,
        eyebrow: s.qLocateEyebrow,
        title: s.qLocatePrefix + cutName(target),
        meta: metaLine
      };
    }

    if (kind === 'equiv') {
      var pairs = LANG === 'en'
        ? [
            { ask: target.names.usa, getAns: function (c) { return c.names.arg; }, label: 'What is US "' + target.names.usa + '" called in Argentina?' },
            { ask: target.names.esp, getAns: function (c) { return c.names.usa; }, label: 'What is Spanish "' + target.names.esp + '" called in US cuts?' },
            { ask: target.names.mex, getAns: function (c) { return c.names.arg; }, label: 'What is Mexican "' + target.names.mex + '" called in Argentina?' }
          ]
        : [
            { ask: target.names.arg, getAns: function (c) { return c.names.usa; }, label: '¿Cómo llaman en EE. UU. al «' + target.names.arg + '»?' },
            { ask: target.names.arg, getAns: function (c) { return c.names.esp; }, label: '¿Cómo llaman en España al «' + target.names.arg + '»?' },
            { ask: target.names.mex, getAns: function (c) { return c.names.arg; }, label: '¿Qué corte argentino equivale al «' + target.names.mex + '» mexicano?' }
          ];
      var chosenPair = pairs[Math.floor(Math.random() * pairs.length)];
      var rightAns = chosenPair.getAns(target);
      var distractors = shuffle(CUTS.filter(function (c) {
        return c.id !== target.id && chosenPair.getAns(c) !== rightAns;
      })).slice(0, 3);
      var opts = shuffle([target].concat(distractors)).map(function (c) {
        return { label: chosenPair.getAns(c), isRight: c.id === target.id };
      });
      return {
        kind: 'equiv',
        target: target,
        options: opts,
        pickedIdx: -1,
        eyebrow: s.qEquivEyebrow,
        title: chosenPair.label,
        meta: zoneName(target.zone)
      };
    }

    var cookKeys = Object.keys(COOK_METHODS);
    var cookOpts = cookKeys.map(function (ck) {
      return { label: cookName(ck), isRight: ck === target.cookKey };
    });
    return {
      kind: 'cook',
      target: target,
      options: cookOpts,
      pickedIdx: -1,
      eyebrow: s.qCookEyebrow,
      title: s.qCookTitlePrefix + cutName(target) + '?',
      meta: target.names.usa + ' · ' + (LANG === 'en' ? target.tenderEn : target.tenderEs)
    };
  }

  function startRoundOrQuestion(resetRound) {
    if (resetRound) {
      state.roundAsk = 1;
      state.roundRight = 0;
      state.roundStart = state.mode === 'study' ? 0 : Date.now();
      state.frozenSec = null;
      state.totalCount = 0;
      state.rightCount = 0;
      state.streak = 0;
      updateStatsUI();
    }
    if (state.mode === 'test' && state.roundAsk > state.roundTarget) {
      renderStage();
      return;
    }
    state.answered = false;
    state.lastOk = false;
    state.question = makeQuestion();
    state.qStart = Date.now();
    renderStage();
  }

  function recordOutcome(ok) {
    state.totalCount += 1;
    if (ok) {
      state.rightCount += 1;
      state.streak += 1;
      if (state.mode === 'test') state.roundRight += 1;
    } else {
      state.streak = 0;
    }
    updateStatsUI();
  }

  function flashStage(ok) {
    var box = $('stageBox');
    box.classList.remove('flash-ok', 'flash-bad');
    void box.offsetWidth;
    box.classList.add(ok ? 'flash-ok' : 'flash-bad');
    if (state.flashTimer) clearTimeout(state.flashTimer);
    state.flashTimer = setTimeout(function () {
      box.classList.remove('flash-ok', 'flash-bad');
    }, 450);
  }

  function finishQuestion(ok) {
    state.answered = true;
    state.lastOk = ok;
    recordOutcome(ok);
    flashStage(ok);
    if (viewer3d && state.question) {
      viewer3d.flashCut(state.question.target.id, ok);
      if (state.question.pickedId && state.question.pickedId !== state.question.target.id) {
        viewer3d.flashCut(state.question.pickedId, false);
      }
      viewer3d.focusCutCamera(state.question.target.id);
    }
    renderStage();
  }

  function submitLocateAnswer(cut) {
    state.question.pickedId = cut.id;
    finishQuestion(cut.id === state.question.target.id);
  }

  function submitChoiceAnswer(idx) {
    state.question.pickedIdx = idx;
    finishQuestion(!!(state.question.options[idx] && state.question.options[idx].isRight));
  }

  function updateStatsUI() {
    var s = S();
    $('sAcc').textContent = state.totalCount ? Math.round((state.rightCount / state.totalCount) * 100) + '%' : '–';
    $('sTime').textContent = fmtClock(elapsedSec());
    $('sStreak').textContent = String(state.streak);
    var best = state.bests[state.block];
    $('best').innerHTML = best
      ? (s.actions.best + '<b>' + best.pct + '%</b> · ' + fmtClock(best.time))
      : s.actions.bestNone;
  }

  function toggleClean(on) {
    CLEAN = on === undefined ? !CLEAN : !!on;
    document.body.classList.toggle('clean', CLEAN);
    if (viewer3d) viewer3d.resize();
  }

  function toggleExplode() {
    state.exploded = !state.exploded;
    refreshHUD();
    if (viewer3d) viewer3d.updateCutAppearance();
  }
  function toggleXray() {
    state.xray = !state.xray;
    refreshHUD();
    if (viewer3d) viewer3d.updateCutAppearance();
  }
  function toggleBones() {
    state.bones = !state.bones;
    refreshHUD();
    if (viewer3d) viewer3d.updateCutAppearance();
  }
  function toggleSagittal() {
    state.sagittal = !state.sagittal;
    refreshHUD();
    if (viewer3d) {
      viewer3d.updateCutAppearance();
      viewer3d.setCameraView(state.sagittal ? 'sagittal' : 'side');
    }
  }
  function toggleColorMode() {
    state.colorMode = state.colorMode === 'muscle' ? 'zones' : 'muscle';
    refreshHUD();
    if (viewer3d) viewer3d.updateCutAppearance();
  }
  function toggle2dDiagram() {
    state.show2d = !state.show2d;
    refreshHUD();
    if (viewer3d) viewer3d.resize();
  }

  function bindEvents() {
    $('langSel').addEventListener('change', function (e) { setLang(e.target.value); });

    window.addEventListener('storage', function (e) {
      if (e.key === 'todologo.lang' && (e.newValue === 'es' || e.newValue === 'en')) {
        setLang(e.newValue);
      }
    });

    // 3D HUD Toolbar
    var camGrp = $('camViewGroup');
    if (camGrp) {
      camGrp.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-cam]');
        if (!btn) return;
        var preset = btn.getAttribute('data-cam');
        if (preset === 'sagittal') {
          if (!state.sagittal) toggleSagittal();
          else if (viewer3d) viewer3d.setCameraView('sagittal');
        } else {
          if (preset === 'side' && state.sagittal) {
            state.sagittal = false;
            refreshHUD();
          }
          if (viewer3d) viewer3d.setCameraView(preset);
        }
      });
    }
    if ($('explodeBtn')) $('explodeBtn').addEventListener('click', toggleExplode);
    if ($('xrayBtn')) $('xrayBtn').addEventListener('click', toggleXray);
    if ($('bonesBtn')) $('bonesBtn').addEventListener('click', toggleBones);
    if ($('colorModeBtn')) $('colorModeBtn').addEventListener('click', toggleColorMode);
    if ($('toggle2dBtn')) $('toggle2dBtn').addEventListener('click', toggle2dDiagram);

    $('modeSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.mode = btn.getAttribute('data-v');
      STORE.set('mode', state.mode);
      applyStaticLabels();
      if (state.mode === 'study') {
        state.roundStart = 0;
        state.frozenSec = null;
        updateStatsUI();
        renderStage();
      } else {
        startRoundOrQuestion(true);
      }
    });

    $('taskSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.task = btn.getAttribute('data-v');
      STORE.set('task', state.task);
      applyStaticLabels();
      if (state.mode !== 'study') startRoundOrQuestion(state.mode === 'test');
    });

    $('restartBtn').addEventListener('click', function () {
      if (state.mode === 'study') {
        state.zoneFilter = 'all';
        renderStage();
      } else {
        startRoundOrQuestion(true);
      }
    });

    $('cleanBtn').addEventListener('click', function () { toggleClean(true); });
    $('cleanExit').addEventListener('click', function () { toggleClean(false); });
    $('settingsBtn').addEventListener('click', function () { document.body.classList.add('sheet-open'); });
    $('closeSheet').addEventListener('click', function () { document.body.classList.remove('sheet-open'); });
    $('howBtn').addEventListener('click', function () { $('intro').hidden = false; });
    $('introGo').addEventListener('click', function () {
      $('intro').hidden = true;
      STORE.set('seenIntro', true);
    });

    document.addEventListener('keydown', function (e) {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) return;
      if (!$('intro').hidden) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          $('intro').hidden = true;
          STORE.set('seenIntro', true);
        }
        return;
      }
      var kl = e.key.toLowerCase();
      if (kl === 'c') { toggleClean(); return; }
      if (kl === 'e') { toggleExplode(); return; }
      if (kl === 'x') { toggleXray(); return; }
      if (kl === 'b') { toggleBones(); return; }
      if (kl === 'm') { toggleSagittal(); return; }
      if (kl === 'd') { toggle2dDiagram(); return; }
      if (kl === 'r' && viewer3d) { viewer3d.setCameraView('reset'); return; }
      if (e.key === 'Escape' && CLEAN) { toggleClean(false); return; }
      if (state.mode === 'study') {
        var pool = activePool();
        var idx = pool.findIndex(function (c) { return c.id === state.selectedId; });
        if (idx < 0) idx = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          state.selectedId = pool[(idx + 1) % pool.length].id;
          STORE.set('selectedId', state.selectedId);
          renderStage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          state.selectedId = pool[(idx - 1 + pool.length) % pool.length].id;
          STORE.set('selectedId', state.selectedId);
          renderStage();
        }
      } else if (state.answered) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          advanceQuestion();
        }
      } else if (state.question && state.question.kind !== 'locate') {
        var k = Number(e.key) - 1;
        if (k >= 0 && k < state.question.options.length) {
          submitChoiceAnswer(k);
        }
      }
    });
  }

  window.__MEAT_CUTS_3D__ = {
    getState: function () { return state; },
    getViewer: function () { return viewer3d; },
    toggleExplode: toggleExplode,
    toggleXray: toggleXray,
    toggleBones: toggleBones,
    toggleSagittal: toggleSagittal,
    toggleColorMode: toggleColorMode,
    toggle2dDiagram: toggle2dDiagram
  };

  function init() {
    viewer3d = initSteer3D();
    applyStaticLabels();
    renderRail();
    bindEvents();
    if (!STORE.get('seenIntro', false)) $('intro').hidden = false;
    if (state.mode === 'study') renderStage();
    else startRoundOrQuestion(true);
  }

  init();
})();
