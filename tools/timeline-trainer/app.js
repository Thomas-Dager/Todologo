/* Línea del Tiempo Universal (T025) — Todologo
 * Seis eras × 15 hitos detallados (90 en total). Retos: ¿Cuál vino antes?, ¿En qué año?, Ordenar cuatro eventos.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const saved = window.SiteProgress
    ? SiteProgress.tool('timeline-trainer')
    : { get: (k, d) => d, set: () => {} };

  var LANG = 'es';
  (function initLang() {
    let p = null;
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'es' || q === 'en') p = q;
    } catch (e) {}
    try {
      if (!p) {
        const g = localStorage.getItem('todologo.lang');
        if (g === 'es' || g === 'en') p = g;
      }
    } catch (e) {}
    if (!p) {
      const s = saved.get('lang', null);
      if (s === 'es' || s === 'en') p = s;
    }
    LANG = p || 'es';
    try { localStorage.setItem('todologo.lang', LANG); } catch (e) {}
  })();

  const UI = {
    es: {
      docTitle: 'Línea del Tiempo Universal — Todologo',
      brandMark: 'LÍNEA <span>DEL TIEMPO</span><sup>T025</sup>',
      brandSub: 'Seis eras y 90 hitos detallados para ordenar la historia en tu cabeza',
      railTitle: 'Eras, en orden',
      railPath: 'Recorre las eras en orden. Una marca ✓ significa 90% o más en el Examen.',
      langHeading: 'Idioma', modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Recorre los 15 hitos de la era, su lugar, contexto y consecuencias históricas.',
        practice: 'Responde sin reloj; cada respuesta revela fecha exacta, protagonistas e impacto.',
        test: '10 retos contrarreloj. Consigue 90% (9/10) para marcar la era con ✓.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', duel: '¿Cuál antes?', year: 'Año', order: 'Ordenar' },
      taskHints: {
        mix: 'Alterna al azar entre los tres tipos de reto.',
        duel: 'Dos eventos: elige el que ocurrió primero.',
        year: 'Elige el año correcto entre cuatro opciones.',
        order: 'Haz clic en los cuatro eventos del más antiguo al más reciente.'
      },
      scopeHeading: 'Eventos',
      scopes: { era: 'De esta era', all: 'Toda la historia' },
      statAcc: 'Precisión', statTime: 'Tiempo', statStreak: 'Racha',
      restart: 'Reiniciar', cleanView: 'Vista limpia', cleanExit: 'Salir de vista limpia',
      settings: 'Ajustes', howItWorks: 'Cómo funciona', closeSheet: 'Listo',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> para elegir · <kbd>←</kbd> <kbd>→</kbd> en «¿Cuál antes?» · <kbd>Espacio</kbd> siguiente',
      credit: 'Muchas fechas antiguas son aproximadas (marcadas con «c.», circa). Lo clave es el orden relativo, las causas y la distancia entre hitos. Parte de Todologo.',
      goPractice: 'Practicar esta era →',
      nextBtn: 'Siguiente', tryAgain: 'Intentar de nuevo', undo: 'Deshacer último',
      testDone: 'Examen completado',
      passedMsg: '¡Dominada! Lograste al menos 90% de precisión.',
      retryMsg: 'Necesitas 90% (9/10) para marcar esta era. ¡Vuelve a intentarlo!',
      bestNone: 'Sin marca de examen todavía en esta era.',
      bestFmt: (pct, s) => `Mejor examen: <b>${pct}%</b> en ${s}s`,
      correctExcl: '¡Correcto!',
      wrongExcl: 'No exactamente',
      qDuel: '¿Cuál ocurrió primero?',
      qYear: '¿En qué año ocurrió?',
      qOrder: 'Ordena del más antiguo al más reciente',
      gap: (n) => `+ ${n.toLocaleString('es')} años`,
      bc: 'a.C.',
      orderOk: 'Orden perfecto',
      orderBad: (n) => `${n} de 4 en su lugar`,
      impactLbl: 'Por qué importa:'
    },
    en: {
      docTitle: 'Universal Timeline — Todologo',
      brandMark: 'UNIVERSAL <span>TIMELINE</span><sup>T025</sup>',
      brandSub: 'Six eras and 90 detailed anchors to order history in your head',
      railTitle: 'Eras, in order',
      railPath: 'Work through the eras in order. A ✓ means 90% or higher on the Test.',
      langHeading: 'Language', modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Browse all 15 detailed milestones per era with location, context, and historical impact.',
        practice: 'Answer without a clock; every answer reveals date, actors, and lasting impact.',
        test: '10 timed challenges. Score 90% (9/10) to earn a ✓ on this era.'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mix', duel: 'Which first?', year: 'Year', order: 'Order' },
      taskHints: {
        mix: 'Randomly alternates between the three challenge types.',
        duel: 'Two events: pick the one that happened first.',
        year: 'Pick the correct year out of four options.',
        order: 'Click the four events from oldest to most recent.'
      },
      scopeHeading: 'Events',
      scopes: { era: 'This era', all: 'All history' },
      statAcc: 'Accuracy', statTime: 'Time', statStreak: 'Streak',
      restart: 'Restart', cleanView: 'Clean view', cleanExit: 'Exit clean view',
      settings: 'Settings', howItWorks: 'How it works', closeSheet: 'Done',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> to pick · <kbd>←</kbd> <kbd>→</kbd> in "Which first?" · <kbd>Space</kbd> next',
      credit: 'Many ancient dates are approximate (marked "c.", circa). What matters most is relative sequence, causes, and historical distance. Part of Todologo.',
      goPractice: 'Practice this era →',
      nextBtn: 'Next', tryAgain: 'Run again', undo: 'Undo last',
      testDone: 'Test complete',
      passedMsg: 'Mastered! You scored 90% or higher.',
      retryMsg: 'Score 90% (9/10) to earn a tick on this era. Give it another run!',
      bestNone: 'No test score saved for this era yet.',
      bestFmt: (pct, s) => `Best test: <b>${pct}%</b> in ${s}s`,
      correctExcl: 'Correct!',
      wrongExcl: 'Not quite',
      qDuel: 'Which happened first?',
      qYear: 'In which year did it happen?',
      qOrder: 'Order from oldest to most recent',
      gap: (n) => `+ ${n.toLocaleString('en')} years`,
      bc: 'BC',
      orderOk: 'Perfect order',
      orderBad: (n) => `${n} of 4 in place`,
      impactLbl: 'Why it matters:'
    }
  };
  const t = () => UI[LANG] || UI.es;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // [año, aprox, tituloES, tituloEN, lugarES, lugarEN, notaES, notaEN, impactoES, impactoEN]
  const ERAS = [
    {
      id: 'ancient',
      color: '#c9a36a',
      title: { es: 'Prehistoria y Antigüedad', en: 'Prehistory & Antiquity' },
      span: { es: '10000 a.C. – 500 a.C.', en: '10000 BC – 500 BC' },
      summary: {
        es: '<b>El salto a la civilización:</b> la humanidad pasa de bandas nómadas a aldeas agrícolas, inventa la escritura, el derecho escrito, el bronce y los primeros grandes imperios fluviales.',
        en: '<b>The leap to civilization:</b> humanity shifts from nomadic foraging to farming settlements, inventing writing, codified law, bronze metallurgy, and river-valley empires.'
      },
      events: [
        [-10000, true, 'Revolución neolítica: nace la agricultura', 'Neolithic Revolution: farming begins',
          'Creciente Fértil', 'Fertile Crescent',
          'Tras el final de la última glaciación, comunidades del Levante y Mesopotamia domestican trigo, cebada, lentejas, ovejas y cabras, abandonando progresivamente el nomadismo.',
          'After the last Ice Age, communities across the Levant and Mesopotamia domesticate wheat, barley, lentils, sheep, and goats, settling permanently.',
          'Permitió producir excedentes de alimentos, multiplicar la población y originar las primeras aldeas, cerámica y especialización laboral.',
          'Generated food surpluses that multiplied population and triggered permanent villages, pottery, and labor specialization.'],
        [-9000, true, 'Templo megalítico de Göbekli Tepe', 'Megalithic sanctuary of Göbekli Tepe',
          'Anatolia (Turquía)', 'Anatolia (Turkey)',
          'Cazadores-recolectores erigen recintos circulares con pilares en forma de T de hasta 16 toneladas decorados con animales tallados en relieve.',
          'Hunter-gatherers erect circular enclosures of T-shaped limestone pillars weighing up to 16 tons carved with animal reliefs.',
          'Demostró que la arquitectura monumental y los santuarios colectivos surgieron incluso antes de las ciudades agrícolas.',
          'Proved monumental architecture and organized ritual gatherings emerged even before full-scale agricultural cities.'],
        [-3500, true, 'Invención de la rueda y el torno', 'Invention of the wheel and potter’s wheel',
          'Mesopotamia', 'Mesopotamia',
          'Alfareros sumerios perfeccionan el torno giratorio y pronto se adaptan ruedas macizas con ejes de madera para carros de carga tirados por bueyes.',
          'Sumerian potters refine the rotary potter’s wheel, soon adapted into solid wooden axles and ox-drawn transport carts.',
          'Transformó el transporte terrestre de mercancías, multiplicó la capacidad de carga comercial y aceleró la producción cerámica.',
          'Revolutionized overland freight transport, expanded trade volume, and accelerated ceramic production.'],
        [-3200, true, 'Escritura cuneiforme y jeroglíficos', 'Cuneiform and Egyptian hieroglyphs',
          'Sumeria y Egipto', 'Sumer & Egypt',
          'Escribas mesopotámicos graban cuñas con cañas sobre arcilla húmeda para registrar granos e impuestos; en paralelo nacen los jeroglíficos egipcios.',
          'Mesopotamian scribes press reed wedges into wet clay to record grain and taxes while Egyptian hieroglyphs emerge in the Nile Valley.',
          'Marca la frontera entre prehistoria e historia: permite preservar leyes, contratos, astronomía y memoria más allá de la tradición oral.',
          'Marks the boundary between prehistory and recorded history, preserving laws, treaties, astronomy, and literature.'],
        [-2560, true, 'Gran Pirámide de Guiza', 'Great Pyramid of Giza',
          'Guiza, Egipto', 'Giza, Egypt',
          'Construida con más de 2,3 millones de bloques calizos como tumba del faraón Keops bajo la dirección del arquitecto Hemiunu.',
          'Built from over 2.3 million limestone blocks as Pharaoh Khufu’s tomb under royal architect Hemiunu.',
          'Fue la construcción humana más alta del mundo durante 3.800 años y evidencia una capacidad logística estatal sin precedentes.',
          'Remained the tallest human-made structure on Earth for 3,800 years, proving massive state administrative logistics.'],
        [-2334, true, 'Imperio acadio de Sargón', 'Akkadian Empire of Sargon',
          'Mesopotamia', 'Mesopotamia',
          'Sargón de Acad somete las ciudades-estado sumerias independientes desde el Golfo Pérsico hasta Siria bajo una sola administración.',
          'Sargon of Akkad unites previously independent Sumerian city-states from the Persian Gulf to Syria under one crown.',
          'Considerado el primer imperio territorial multiétnico de la historia con ejército permanente y red de correos.',
          'Widely recognized as history’s first multi-ethnic territorial empire with a standing army and imperial courier system.'],
        [-1754, true, 'Código de Hammurabi', 'Code of Hammurabi',
          'Babilonia', 'Babylon',
          'El rey babilonio Hammurabi hace grabar 282 leyes en una estela de diorita regulando contratos, salarios, familia y penas proporcionales («ojo por ojo»).',
          'Babylonian king Hammurabi engraves 282 statutes on a basalt stele governing trade, wages, family law, and proportional justice.',
          'Estableció el precedente de que la ley debía estar escrita, visible al público y por encima del arbitrio momentáneo de los jueces.',
          'Established the enduring principle that laws must be written, publicly visible, and uniformly enforced.'],
        [-1600, true, 'Civilización micénica y dinastía Shang', 'Mycenaean Greece & Shang Dynasty',
          'Egeo y China', 'Aegean & China',
          'Mientras los palacios micénicos dominan el Egeo con escritura Lineal B, la dinastía Shang unifica el valle del río Amarillo con bronces rituales.',
          'Mycenaean fortress palaces rise in the Aegean with Linear B script while the Shang Dynasty consolidates the Yellow River basin.',
          'Consolidó la Edad del Bronce madura desde el Mediterráneo hasta Asia Oriental con élites guerreras y escritura temprana china.',
          'Anchored mature Bronze Age civilizations across Eurasia, giving China its earliest surviving oracle-bone writing.'],
        [-1332, true, 'Reinado de Tutankamón', 'Reign of Tutankhamun',
          'Tebas, Egipto', 'Thebes, Egypt',
          'Sube al trono hacia los 9 años tras la revolución religiosa de Akenatón y restaura el culto tradicional de Amón antes de morir a los 19.',
          'Ascends the throne around age 9 after Akhenaten’s religious upheaval and restores traditional Amun worship before dying young.',
          'El hallazgo de su tumba prácticamente intacta por Howard Carter en 1922 reveló los tesoros funerarios mejor conservados de Egipto.',
          'Howard Carter’s 1922 discovery of his nearly intact tomb yielded the richest view of Egyptian royal material culture.'],
        [-1259, false, 'Tratado de Qadesh (primer tratado de paz escrito)', 'Treaty of Kadesh (earliest surviving peace treaty)',
          'Egipto / Imperio Hitita', 'Egypt & Hittite Empire',
          'Tras décadas de guerra en Siria, Ramsés II y el rey hitita Hattusili III firman un pacto bilingüe de no agresión y alianza mutua.',
          'After decades of warfare in Syria, Ramesses II and Hittite king Hattusili III sign a bilingual pact of mutual defense and non-aggression.',
          'Es el tratado diplomático internacional más antiguo conservado íntegramente; una réplica se exhibe hoy en la sede de la ONU.',
          'Oldest surviving complete international peace treaty; a replica hangs today at United Nations headquarters.'],
        [-1200, true, 'Colapso de la Edad del Bronce Tardía', 'Late Bronze Age collapse',
          'Mediterráneo oriental', 'Eastern Mediterranean',
          'En apenas medio siglo colapsan el Imperio hitita, Micenas y numerosas ciudades levantinas tras invasiones («Pueblos del Mar»), sequías y crisis comercial.',
          'Within fifty years, Hittite, Mycenaean, and Levantine palaces collapse amid migrations ("Sea Peoples"), droughts, and trade disruption.',
          'Abrió paso a la Edad del Hierro, el alfabeto fenicio consonántico y el surgimiento de nuevas sociedades como Israel y Grecia clásica.',
          'Ushered in the Iron Age, widespread use of the Phoenician alphabet, and new Iron Age kingdoms and Greek poleis.'],
        [-776, false, 'Primeros Juegos Olímpicos antiguos', 'First ancient Olympic Games',
          'Olimpia, Grecia', 'Olympia, Greece',
          'Santuarios griegos instauran competiciones atléticas cuatrienales dedicadas a Zeus acompañadas de una tregua sagrada entre polis rivales.',
          'Greek sanctuaries establish quadrennial athletic contests honoring Zeus under a sacred Panhellenic truce.',
          'Fijaron la base cultural común del mundo helénico y sirvieron como calendario universal griego mediante «olimpiadas».',
          'Forged shared Panhellenic cultural identity and served as the standard four-year chronological anchor across Greece.'],
        [-753, false, 'Fundación tradicional de Roma', 'Traditional founding of Rome',
          'Lacio, Italia', 'Latium, Italy',
          'Según la cronología de Varrón, Rómulo funda el asentamiento sobre el monte Palatino a orillas del Tíber el 21 de abril.',
          'According to Varro’s chronology, Romulus founds a settlement on the Palatine Hill beside the Tiber River on April 21.',
          'Se convirtió en el punto de partida del calendario romano («Ab Urbe Condita») y cuna de la civilización romana.',
          'Became the epoch ("Ab Urbe Condita") of the Roman calendar and seed of the Mediterranean world power.'],
        [-551, false, 'Nace Confucio (Kongzi)', 'Birth of Confucius',
          'Estado de Lu, China', 'State of Lu, China',
          'Pensador y maestro que propone el mérito, la piedad filial y la rectitud moral de los gobernantes frente al caos de las guerras feudales.',
          'Philosopher and teacher advocating merit, civic virtue, filial duty, and ethical rule amid warring feudal states.',
          'El confucianismo vertebró los exámenes imperiales chinos y la ética estatal de Asia Oriental durante más de dos milenios.',
          'Confucianism shaped Chinese civil service exams and East Asian governance and family ethics for over 2,000 years.'],
        [-509, false, 'Instauración de la República Romana', 'Founding of the Roman Republic',
          'Roma, Italia', 'Rome, Italy',
          'Tras expulsar al último rey etrusco Tarquinio el Soberbio, los patricios establecen magistraturas anuales electivas y doble consulado.',
          'After expelling the last Etruscan king Tarquin the Proud, Romans institute elected annual magistrates and dual consuls.',
          'Creó un sistema de contrapesos constitucionales y derecho civil que inspiraría siglos después las repúblicas modernas.',
          'Created institutional checks and balances and a body of civil law that later inspired modern constitutional republics.']
      ]
    },
    {
      id: 'classical',
      color: '#d8b46a',
      title: { es: 'Antigüedad Clásica', en: 'Classical Antiquity' },
      span: { es: '500 a.C. – 476', en: '500 BC – AD 476' },
      summary: {
        es: '<b>La era axial y los grandes imperios clásicos:</b> florecen la democracia ateniense, la filosofía clásica, el imperio de Alejandro Magno, la unificación de China y el auge y caída de Roma.',
        en: '<b>The Axial zenith & classical empires:</b> Athenian democracy, Greek philosophy, Alexander’s conquests, imperial unification of China, and Rome’s rise and fall.'
      },
      events: [
        [-508, false, 'Reformas democráticas de Clístenes en Atenas', 'Cleisthenes’ democratic reforms in Athens',
          'Atenas, Grecia', 'Athens, Greece',
          'Clístenes reorganiza la ciudadanía por distritos territoriales (demos) y otorga poder soberano a la Asamblea (Ekklesía) de ciudadanos.',
          'Cleisthenes reorganizes citizenship by territorial districts (demes) and empowers the citizen Assembly (Ekklesia).',
          'Consolidó la primera democracia directa institucionalizada de la historia, modelo de debate cívico e igualdad ante la ley.',
          'Established the first enduring institutional direct democracy and the ideal of citizens’ equality before the law.'],
        [-490, false, 'Batalla de Maratón', 'Battle of Marathon',
          'Ática, Grecia', 'Attica, Greece',
          'Los hoplitas atenienses liderados por Milcíades derrotan al cuerpo expedicionario del rey persa Darío I en la llanura costera de Maratón.',
          'Athenian hoplites led by Miltiades defeat Persian King Darius I’s landing force on the plain of Marathon.',
          'Demostró que las ciudades griegas podían vencer al Imperio aqueménida, preservando su autonomía cultural y dando nombre al maratón.',
          'Proved Greek city-states could withstand Persia, safeguarding classical Aegean culture and inspiring the 42 km marathon.'],
        [-447, false, 'Construcción del Partenón de Atenas', 'Construction of the Parthenon begins',
          'Acrópolis de Atenas', 'Acropolis, Athens',
          'Impulsado por Pericles y diseñado por Ictino, Calícrates y el escultor Fidias como templo dorado en mármol del Pentélico para Atenea.',
          'Commissioned by Pericles and crafted by Ictinus, Callicrates, and sculptor Phidias as a marble temple to Athena.',
          'Cumbre del orden dórico y símbolo universal de las proporciones arquitectónicas clásicas y del Siglo de Oro ateniense.',
          'Pinnacle of Doric architecture and enduring global emblem of classical proportion and Periclean Athens.'],
        [-399, false, 'Juicio y muerte de Sócrates', 'Trial and death of Socrates',
          'Atenas, Grecia', 'Athens, Greece',
          'Acusado de impiedad y corromper a la juventud, el filósofo rechaza exiliarse y bebe cicuta defendiendo su método de interrogatorio crítico.',
          'Convicted of impiety and corrupting youth, Socrates refuses exile and drinks hemlock while defending critical inquiry.',
          'Su figura, inmortalizada por su discípulo Platón, fundó la tradición ética occidental basada en el examen racional.',
          'Immortalized by Plato, his defense of reasoned inquiry anchored the entire Western philosophical tradition.'],
        [-323, false, 'Muerte de Alejandro Magno en Babilonia', 'Death of Alexander the Great in Babylon',
          'Babilonia', 'Babylon',
          'Tras derrocar al Imperio persa y llegar hasta el río Indo en trece años de campaña invicta, muere a los 32 años sin sucesor claro.',
          'After toppling the Persian Empire and marching to the Indus in 13 undefeated years, he dies at age 32 without a clear heir.',
          'Su imperio se fragmentó entre sus generales (diádocos), inaugurando el período helenístico y el griego como lengua común de Oriente.',
          'His generals partitioned his realm, launching the Hellenistic Age and spreading Greek science and language across Asia.'],
        [-260, true, 'Edicto de conversión de Ashoka en la India', 'Ashoka’s moral edicts in Mauryan India',
          'Imperio Maurya, India', 'Mauryan Empire, India',
          'Horrorizado tras la sangrienta conquista de Kalinga, el emperador Ashoka adopta la no violencia (ahimsa) y la graba en pilares por todo el subcontinente.',
          'Appalled by bloodshed in the Kalinga War, Emperor Ashoka embraces non-violence (ahimsa) and carves tolerance edicts across India.',
          'Impulsó la expansión del budismo por Asia y legó una de las primeras cartas estatales de tolerancia religiosa y bienestar público.',
          'Propelled Buddhism across Asia and created one of history’s earliest state charters of religious tolerance.'],
        [-221, false, 'Qin Shi Huang unifica China', 'Qin Shi Huang unifies China',
          'Xianyang, China', 'Xianyang, China',
          'El rey de Qin somete a los seis reinos combatientes, se proclama Primer Emperador y estandariza moneda, ejes de carro, pesos, medidas y caligrafía.',
          'The King of Qin conquers six rival states, takes the title First Emperor, and standardizes coins, axle widths, weights, and script.',
          'Forjó el estado centralizado chino cuyos cimientos territoriales y administrativos (y sus Guerreros de Terracota) perduraron milenios.',
          'Created the unified Chinese imperial state structure and left the monumental Terracotta Army guarding his tomb.'],
        [-202, false, 'Batalla de Zama: Roma vence a Cartago', 'Battle of Zama: Rome defeats Carthage',
          'Túnez (Norte de África)', 'Tunisia (North Africa)',
          'Escipión el Africano derrota a Aníbal Barca poniendo fin a la Segunda Guerra Púnica tras diecisiete años de conflicto mediterráneo.',
          'Scipio Africanus defeats Hannibal Barca, ending the Second Punic War after 17 years of Mediterranean struggle.',
          'Aseguró la hegemonía absoluta de Roma sobre el Mediterráneo occidental y abrió su expansión imparable hacia Hispania y Oriente.',
          'Secured Rome’s undisputed mastery of the western Mediterranean and cleared its path to imperial expansion.'],
        [-130, true, 'Apertura oficial de la Ruta de la Seda', 'Opening of the Silk Road',
          'Asia Central (Dinastía Han)', 'Central Asia (Han Dynasty)',
          'Las embajadas del enviado imperial Zhang Qian hacia Fergana y Bactriana conectan las redes comerciales de China Han con Persia y el Mediterráneo.',
          'Imperial envoy Zhang Qian’s diplomatic missions west link Han China’s trade corridors directly to Persia and the Mediterranean.',
          'Circuló no solo seda, papel, vidrio y especias, sino también religiones (budismo), técnicas agrícolas y epidemias entre continentes.',
          'Carried not just silk, paper, and spices, but Buddhism, technology, and crops across the Eurasian landmass.'],
        [-44, false, 'Asesinato de Julio César', 'Assassination of Julius Caesar',
          'Curia de Pompeyo, Roma', 'Theatre of Pompey, Rome',
          'Tras proclamarse dictador perpetuo y cruzar el Rubicón años atrás, César cae apuñalado el 15 de marzo (idus) por senadores liderados por Bruto y Casio.',
          'Named dictator for life, Caesar is stabbed on the Ides of March (15 March) by senators led by Brutus and Cassius.',
          'Lejos de restaurar la República, desató nuevas guerras civiles que coronaron a su heredero Octavio como primer emperador.',
          'Rather than saving the Republic, it triggered final civil wars crowning his adopted heir Octavian as Rome’s first emperor.'],
        [-27, false, 'Augusto, primer emperador romano', 'Augustus becomes first Roman Emperor',
          'Roma, Imperio Romano', 'Rome, Roman Empire',
          'Octavio recibe el título de Augusto por el Senado e inaugura el Principado, reorganizando provincias, legiones y finanzas imperiales.',
          'Octavian accepts the title Augustus from the Senate, establishing the Principate and stabilizing Rome’s legions and provinces.',
          'Dio inicio a dos siglos de relativa estabilidad y comercio mediterráneo conocidos como la Pax Romana.',
          'Launched two centuries of relative internal peace, roads, law, and trade known as the Pax Romana.'],
        [79, false, 'Erupción del Vesubio sepulta Pompeya', 'Vesuvius erupts and buries Pompeii',
          'Bahía de Nápoles, Italia', 'Bay of Naples, Italy',
          'Flujos piroclásticos sepultan bajo metros de ceniza y piedra pómez las ciudades de Pompeya y Herculano; Plinio el Joven describe la catástrofe.',
          'Pyroclastic surges bury Pompeii and Herculaneum beneath meters of ash and pumice while Pliny the Younger records the eruption.',
          'Conservó intactos frescos, panaderías, graffiti políticos y casas cotidianas, convirtiéndose en la mayor cápsula temporal romana.',
          'Preserved houses, frescoes, bakeries, and street graffiti intact, forming archaeology’s richest snapshot of Roman life.'],
        [200, true, 'Apogeo de Teotihuacán en Mesoamérica', 'Peak of Teotihuacan in Mesoamerica',
          'Valle de México', 'Basin of Mexico',
          'Metrópoli planificada en cuadrícula con más de 100.000 habitantes, las pirámides del Sol y la Luna y amplia influencia comercial hasta territorio maya.',
          'Grid-planned metropolis exceeding 100,000 residents, famed for the Pyramids of the Sun and Moon and Maya trade ties.',
          'Fue una de las mayores ciudades del planeta en su siglo y marcó la arquitectura, religión y política de toda Mesoamérica.',
          'One of the world’s largest cities of its era, shaping Mesoamerican architecture, trade, and iconography for centuries.'],
        [313, false, 'Edicto de Milán: legalización del cristianismo', 'Edict of Milan legalizes Christianity',
          'Milán, Imperio Romano', 'Milan, Roman Empire',
          'Los emperadores Constantino y Licinio proclaman la libertad de culto y ordenan devolver propiedades confiscadas a las comunidades cristianas.',
          'Emperors Constantine and Licinius proclaim religious toleration and restore confiscated properties to Christian churches.',
          'Transformó una minoría perseguida en eje religioso y cultural de Europa y del Imperio bizantino.',
          'Transformed a persecuted minority faith into a central religious and institutional pillar of Europe and Byzantium.'],
        [476, false, 'Caída del Imperio Romano de Occidente', 'Fall of the Western Roman Empire',
          'Rávena, Italia', 'Ravenna, Italy',
          'El jefe germánico Odoacro depone al joven emperador Rómulo Augústulo y remite las insignias imperiales al emperador de Oriente en Constantinopla.',
          'Germanic commander Odoacer deposes child emperor Romulus Augustulus and sends the imperial regalia back to Constantinople.',
          'Señala convencionalmente el fin de la Antigüedad y el tránsito hacia los reinos germánicos y la Europa medieval.',
          'Serves as historians’ conventional boundary closing Antiquity and opening the early medieval kingdoms of Western Europe.']
      ]
    },
    {
      id: 'medieval',
      color: '#7fb8a4',
      title: { es: 'Edad Media', en: 'Middle Ages' },
      span: { es: '476 – 1453', en: '476 – 1453' },
      summary: {
        es: '<b>Mil años de transformación eurasiática y americana:</b> expansión islámica, Edad de Oro árabe, imperio mongol, rutas transaharianas, universidades europeas y señoríos mayas e incas.',
        en: '<b>A millennium of Eurasian and American transformations:</b> Islamic Golden Age, Mongol steppe unification, West African Mali wealth, European universities, and Maya/Inca powers.'
      },
      events: [
        [529, false, 'Código de Justiniano (Corpus Juris Civilis)', 'Justinian’s Code (Corpus Juris Civilis)',
          'Constantinopla', 'Constantinople',
          'El emperador bizantino Justiniano I ordena compilar y armonizar mil años de derecho romano junto a grandes obras como Santa Sofía.',
          'Byzantine Emperor Justinian I orders jurists to codify a millennium of Roman law alongside monumental works like Hagia Sophia.',
          'Se convirtió en la columna vertebral del derecho civil moderno en Europa continental e Iberoamérica.',
          'Became the foundation of modern civil law systems across continental Europe and Latin America.'],
        [622, false, 'La Hégira: Mahoma emigra a Medina', 'The Hijra: Muhammad moves to Medina',
          'Arabia', 'Arabian Peninsula',
          'Mahoma y sus seguidores dejan La Meca rumbo a Medina para fundar la primera comunidad política islámica organizada.',
          'Muhammad and followers migrate from Mecca to Medina, establishing the first organized Muslim civic community.',
          'Marca el año 1 del calendario lunar islámico y el inicio de la rápida expansión religiosa, científica y comercial por tres continentes.',
          'Marks Year 1 of the Islamic calendar and the start of rapid religious, commercial, and scholarly expansion across three continents.'],
        [711, false, 'Llegada musulmana a la península ibérica', 'Muslim arrival in the Iberian Peninsula',
          'Guadalete, Hispania', 'Guadalete, Iberia',
          'Tropas bereberes y árabes al mando de Tariq ibn Ziyad cruzan el estrecho y derrotan al rey visigodo Rodrigo.',
          'Berber and Arab forces under Tariq ibn Ziyad cross the strait and defeat the Visigothic King Roderic.',
          'Inauguró casi ocho siglos de Al-Ándalus, puente decisivo por el que filosofía griega, álgebra y medicina llegaron a Europa.',
          'Launched nearly eight centuries of Al-Andalus, a vital corridor transmitting Greek philosophy, algebra, and optics into Europe.'],
        [780, true, 'Edad de Oro islámica y Casa de la Sabiduría', 'Islamic Golden Age & House of Wisdom',
          'Bagdad (Califato Abasí)', 'Baghdad (Abbasid Caliphate)',
          'Bagdad reúne sabios musulmanes, cristianos y judíos para traducir obras griegas, persas e indias; Al-Juarismi sistematiza el álgebra y las cifras indoarábigas.',
          'Baghdad scholars translate Greek, Persian, and Indian texts while Al-Khwarizmi pioneers algebra and Hindu-Arabic numerals.',
          'De su nombre nació la palabra «algoritmo» y sus tratados impulsaron la óptica, medicina, química y astronomía moderna.',
          'Al-Khwarizmi’s name gave us the word "algorithm," while Baghdad scholarship transformed medicine, optics, and astronomy.'],
        [800, false, 'Carlomagno coronado emperador', 'Charlemagne crowned Emperor',
          'Basílica de San Pedro, Roma', 'St. Peter’s Basilica, Rome',
          'El papa León III corona al rey franco Carlomagno el día de Navidad tras unificar gran parte de Europa occidental y fomentar escuelas palatinas.',
          'Pope Leo III crowns Frankish King Charlemagne on Christmas Day after uniting much of Western Europe and reviving Latin schooling.',
          'Sentó las bases políticas del Sacro Imperio Romano Germánico y la minúscula carolingia sobre la que aún leemos hoy.',
          'Laid the political seed of medieval European kingdoms and standardized Carolingian minuscule—the ancestor of modern lowercase type.'],
        [1000, true, 'Invención china de la pólvora, brújula e imprenta de barro', 'Song China innovations: gunpowder, compass & printing',
          'China (Dinastía Song)', 'China (Song Dynasty)',
          'La China Song adopta la brújula magnética en navegación marítima, papel moneda oficial y fórmulas militares tempranas de pólvora.',
          'Song Dynasty China deploys the magnetic mariner’s compass, official paper currency, and military gunpowder formulas.',
          'Al viajar hacia Occidente por rutas comerciales, la brújula y la pólvora cambiaron para siempre los océanos y la guerra moderna.',
          'Carried westward along trade networks, the compass and gunpowder later reshaped global ocean navigation and warfare.'],
        [1054, false, 'Gran Cisma de Oriente y Occidente', 'East–West Great Schism',
          'Roma y Constantinopla', 'Rome & Constantinople',
          'Tras siglos de divergencias teológicas y políticas sobre la autoridad papal, Roma y Constantinopla se excomulgan mutuamente.',
          'Following centuries of doctrinal and papal-authority disputes, Rome and Constantinople exchange mutual excommunications.',
          'Dividió de forma duradera el cristianismo europeo entre la Iglesia católica romana y la Iglesia ortodoxa oriental.',
          'Permanently split European Christendom into the Roman Catholic West and Eastern Orthodox churches.'],
        [1066, false, 'Batalla de Hastings: conquista normanda de Inglaterra', 'Battle of Hastings: Norman conquest of England',
          'Sussex, Inglaterra', 'Sussex, England',
          'Guillermo el Conquistador, duque de Normandía, vence y da muerte al rey sajón Harold II y reordena tierras e impuestos en el Domesday Book.',
          'William, Duke of Normandy, defeats Anglo-Saxon King Harold II, reshaping land tenure and compiling the Domesday Book.',
          'Fusionó la nobleza anglosajona con la francófona, inyectando miles de términos franceses y latinos al idioma inglés.',
          'Bound England to continental politics and infused thousands of French and Latin words into the English language.'],
        [1088, false, 'Fundación de la Universidad de Bolonia', 'Founding of the University of Bologna',
          'Bolonia, Italia', 'Bologna, Italy',
          'Asociaciones de estudiantes de derecho romano forman una corporación autónoma (*universitas*) con estatutos propios y títulos reconocidos.',
          'Guilds of law students organize an autonomous teaching corporation (universitas) with recognized degrees.',
          'Inauguró el modelo universitario occidental (seguido pronto por París, Oxford y Salamanca) que aún estructura la educación superior.',
          'Created the Western university model—soon joined by Paris, Oxford, and Salamanca—still structuring higher education today.'],
        [1096, false, 'Comienza la Primera Cruzada', 'First Crusade launched',
          'Europa y Levante', 'Europe & the Levant',
          'Tras la llamada del papa Urbano II en Clermont, miles de caballeros y peregrinos parten hacia Oriente y toman Jerusalén en 1099.',
          'Answering Pope Urban II’s call at Clermont, European armies march east and capture Jerusalem in 1099.',
          'Intensificó durante dos siglos el choque religioso y el comercio marítimo entre repúblicas italianas y el Mediterráneo oriental.',
          'Fueled two centuries of Mediterranean conflict alongside booming commercial ties for Venice, Genoa, and Levant ports.'],
        [1206, false, 'Gengis Kan unifica a los mongoles', 'Genghis Khan unites the Mongol tribes',
          'Estepa mongola', 'Mongolian Steppe',
          'Temujin es proclamado Gengis Kan («gobernante universal») y organiza las tribus nómadas en un ejército disciplinado y decimal de caballería.',
          'Temujin is proclaimed Genghis Khan ("universal ruler"), forging nomadic tribes into a disciplined cavalry machine.',
          'Creó el mayor imperio terrestre contiguo de la historia (desde Corea hasta Polonia) y reactivó el tránsito eurasiático («Pax Mongolica»).',
          'Built the largest contiguous land empire in history, stretching from Korea to Poland and securing trans-Eurasian trade.'],
        [1215, false, 'Firma de la Carta Magna', 'Signing of Magna Carta',
          'Runnymede, Inglaterra', 'Runnymede, England',
          'Barones rebeldes obligan al rey Juan sin Tierra a sellar un documento que prohíbe impuestos arbitrarios y arrestos sin juicio de pares.',
          'Rebellious English barons force King John to seal a charter barring arbitrary taxation and imprisonment without lawful judgment.',
          'Piedra angular del constitucionalismo, el habeas corpus y la limitación jurídica del poder del gobernante.',
          'Became a cornerstone of constitutional rule of law, due process, and limits on executive authority.'],
        [1324, false, 'Peregrinación de Mansa Musa desde el Imperio de Malí', 'Mansa Musa’s golden pilgrimage from Mali',
          'Malí → El Cairo → La Meca', 'Mali → Cairo → Mecca',
          'El emperador de Malí atraviesa el Sáhara con una caravana de decenas de miles de acompañantes y toneladas de oro, convirtiendo Tombuctú en centro erudito.',
          'Mali’s Emperor Mansa Musa crosses the Sahara with massive gold reserves, putting Timbuktu on Eurasian maps and funding mosques and schools.',
          'Demostró la enorme riqueza y alcance cultural de los reinos de África Occidental en la red mundial medieval.',
          'Displayed the immense wealth and scholarly reach of West African kingdoms across Mediterranean cartography.'],
        [1347, false, 'La Peste Negra llega a Europa y el Mediterráneo', 'The Black Death reaches the Mediterranean & Europe',
          'Caffa → Mesina → Europa', 'Caffa → Messina → Europe',
          'Galera genovesas propagan la bacteria Yersinia pestis desde Asia Central y Crimea por todo el continente europeo y el mundo islámico.',
          'Genoese ships carry Yersinia pestis from Central Asia and Crimea into Mediterranean ports and across Eurasia.',
          'Acabó con entre un 35% y 50% de la población europea, encareció el trabajo campesino y debilitó el sistema feudal.',
          'Killed 35–50% of Europe’s population, raising peasant wages and accelerating the decline of serfdom.'],
        [1453, false, 'Caída de Constantinopla ante el Imperio otomano', 'Fall of Constantinople to the Ottoman Empire',
          'Constantinopla (Estambul)', 'Constantinople (Istanbul)',
          'Tras 53 días de asedio con enormes cañones de bronce, el sultán Mehmed II toma la última gran fortaleza bizantina tras más de mil años.',
          'After a 53-day siege with giant bronze bombards, Ottoman Sultan Mehmed II captures the millennial Byzantine capital.',
          'Bloqueó rutas tradicionales hacia Asia impulsando la búsqueda oceánica europea y llevó eruditos griegos hacia el Renacimiento italiano.',
          'Pushed Europeans to seek ocean routes to Asia while refugee Greek scholars enriched the Italian Renaissance.']
      ]
    },
    {
      id: 'early-modern',
      color: '#6fb0d8',
      title: { es: 'Edad Moderna', en: 'Early Modern Period' },
      span: { es: '1440 – 1789', en: '1440 – 1789' },
      summary: {
        es: '<b>Primera globalización y Revolución científica:</b> la imprenta democratiza el saber, Europa, América, África y Asia quedan conectadas por mar, estalla la Reforma y Newton formula las leyes físicas.',
        en: '<b>First globalization & Scientific Revolution:</b> movable print spreads literacy, oceans link five continents, the Reformation splits Europe, and Newton unifies physics.'
      },
      events: [
        [1440, true, 'Imprenta de tipos móviles de Gutenberg', 'Gutenberg’s movable-type printing press',
          'Maguncia, Alemania', 'Mainz, Germany',
          'Johannes Gutenberg combina punzones metálicos reutilizables, tinta oleosa y prensa de tornillo para imprimir páginas idénticas en serie.',
          'Johannes Gutenberg pairs reusable metal type, oil-based ink, and a screw press for rapid book production.',
          'Abarató drásticamente los libros, disparó la alfabetización e hizo imparable la difusión de ideas científicas y religiosas.',
          'Slashed book prices, surged European literacy, and made the rapid spread of scientific and religious ideas unstoppable.'],
        [1470, true, 'Expansión del Imperio Inca bajo Túpac Yupanqui', 'Height of the Inca Empire (Tawantinsuyu)',
          'Cusco / Andes', 'Cusco / Andes',
          'Desde Cusco, el Estado inca articula más de 4.000 km de caminos (Qhapaq Ñan), terrazas agrícolas, depósitos estatales y registros en quipus.',
          'From Cusco, the Inca state integrates over 4,000 km of Andean roads (Qhapaq Ñan), storehouses, agricultural terraces, and knotted quipu records.',
          'Constituyó el mayor imperio de la América precolombina pese a no emplear rueda de tiro ni escritura alfabética.',
          'Formed the largest state of pre-Columbian America, governing millions across the Andes without wheeled transport or alphabet.'],
        [1492, false, 'Llegada de Cristóbal Colón a América', 'Columbus reaches the Americas',
          'Guanahaní (Bahamas)', 'Guanahani (Bahamas)',
          'La expedición financiada por los Reyes Católicos cruza el Atlántico pensando alcanzar Asia y desembarca el 12 de octubre en el Caribe.',
          'Backed by Spain’s Catholic Monarchs, Columbus crosses the Atlantic expecting Asia and makes landfall in the Caribbean on 12 October.',
          'Inició el «Intercambio Colombino»: maíz, papa y tomate viajan a Eurasia mientras llegan caballos, trigo, cultura europea y epidemias letales a América.',
          'Triggered the Columbian Exchange: crops like potatoes and maize reshaped Old World diets while Old World diseases devastated Indigenous Americas.'],
        [1498, false, 'Vasco da Gama abre la ruta marítima a la India', 'Vasco da Gama reaches India by sea',
          'Lisboa → Calicut, India', 'Lisbon → Calicut, India',
          'Rodeando el cabo de Buena Esperanza en África, la flota portuguesa alcanza Calicut conectando directamente Europa con las especias asiáticas.',
          'Rounding Africa’s Cape of Good Hope, the Portuguese fleet reaches Calicut, directly linking Europe by sea to Asian spice markets.',
          'Desplazó el centro económico europeo del Mediterráneo al océano Atlántico e inauguró la presencia colonial europea en el Índico.',
          'Shifted Europe’s commercial center of gravity from the Mediterranean to the Atlantic and launched Indian Ocean colonial trade.'],
        [1517, false, 'Martín Lutero publica sus 95 tesis', 'Martin Luther posts his 95 Theses',
          'Wittenberg, Alemania', 'Wittenberg, Germany',
          'El monje alemán critica la venta papal de indulgencias y defiende la lectura directa de la Biblia en lenguas vernáculas mediante la imprenta.',
          'German monk Martin Luther challenges papal indulgences and advocates vernacular Scripture printed for ordinary readers.',
          'Dividió el cristianismo occidental entre católicos y protestantes y desencadenó más de un siglo de guerras religiosas en Europa.',
          'Split Western Christianity into Catholic and Protestant churches, fueling over a century of European religious wars.'],
        [1521, false, 'Caída de Tenochtitlan ante Cortés y sus aliados', 'Fall of Tenochtitlan to Cortés and Indigenous allies',
          'México-Tenochtitlan', 'Mexico-Tenochtitlan',
          'Tras dos años de asedio, viruela y alianza con pueblos enemigos de los mexicas como Tlaxcala, cae la capital del imperio azteca el 13 de agosto.',
          'After siege, smallpox outbreaks, and coalition with rival native states like Tlaxcala, the Mexica capital falls on 13 August.',
          'Fundó el Virreinato de la Nueva España e inició el mestizaje cultural, lingüístico y demográfico de Hispanoamérica.',
          'Established the Viceroyalty of New Spain and began the cultural, linguistic, and demographic transformation of Spanish America.'],
        [1522, false, 'Elcano completa la primera vuelta al mundo', 'Elcano completes the first circumnavigation',
          'Sanlúcar de Barrameda, España', 'Sanlúcar, Spain',
          'Tras partir con Magallanes (muerto en Filipinas), Juan Sebastián Elcano y 17 supervivientes regresan en la nao Victoria tras tres años de viaje.',
          'After Magellan’s death in the Philippines, Juan Sebastián Elcano and 17 survivors bring the Victoria home after a three-year voyage.',
          'Demostró empíricamente la continuidad de todos los océanos de la Tierra y la verdadera magnitud del océano Pacífico.',
          'Empirically proved the Earth’s oceans form one navigable network and revealed the true vastness of the Pacific.'],
        [1543, false, 'Revolución heliocéntrica de Copérnico', 'Copernicus publishes the heliocentric model',
          'Núremberg / Polonia', 'Nuremberg / Poland',
          'En «De revolutionibus orbium coelestium», Nicolás Copérnico demuestra matemáticamente que los planetas, incluida la Tierra, giran en torno al Sol.',
          'In De revolutionibus orbium coelestium, Nicolaus Copernicus argues mathematically that Earth and the planets orbit the Sun.',
          'Desplazó al ser humano del centro geométrico del cosmos y marcó el arranque simbólico de la Revolución Científica moderna.',
          'Removed Earth from the geometric center of the universe, launching the modern Scientific Revolution.'],
        [1605, false, 'Publicación de la primera parte del Quijote', 'Publication of Don Quixote (Part I)',
          'Madrid, España', 'Madrid, Spain',
          'Miguel de Cervantes crea una parodia genial de las novelas de caballerías donde los personajes evolucionan psicológicamente mediante el diálogo.',
          'Miguel de Cervantes crafts a brilliant satire of chivalric romances whose characters evolve through psychological realism and dialogue.',
          'Consolidó la novela moderna polifónica y fijó la obra cumbre de la lengua española a nivel universal.',
          'Established the blueprint of the modern psychological novel and stands as the crowning work of the Spanish language.'],
        [1610, false, 'Galileo observa con el telescopio las lunas de Júpiter', 'Galileo discovers Jupiter’s moons by telescope',
          'Padua, Italia', 'Padua, Italy',
          'Perfeccionando un catalejo neerlandés, Galileo publica en «Sidereus Nuncius» cráteres lunares y cuatro astros orbitando alrededor de Júpiter.',
          'Refining a Dutch spyglass, Galileo reveals lunar mountains and four moons orbiting Jupiter in Sidereus Nuncius.',
          'Aportó la primera prueba observacional directa de que no todos los cuerpos celestes giran alrededor de la Tierra.',
          'Delivered direct observational proof that not every celestial body revolves around Earth.'],
        [1648, false, 'Paz de Westfalia: fin de los Treinta Años', 'Peace of Westphalia ends the Thirty Years’ War',
          'Münster y Osnabrück', 'Münster & Osnabrück',
          'Tras una guerra devastadora en Europa central, potencias católicas y protestantes reconocen la soberanía territorial e igualdad entre Estados.',
          'Following a devastating Central European war, Catholic and Protestant powers recognize territorial sovereignty and mutual equality of states.',
          'Acuñó el concepto de Estado-nación soberano y no injerencia interna sobre el que aún se organiza la diplomacia moderna.',
          'Defined the Westphalian model of sovereign nation-states and non-interference that still underpins international law.'],
        [1687, false, 'Isaac Newton publica los «Principia»', 'Isaac Newton publishes the Principia',
          'Londres, Inglaterra', 'London, England',
          'En «Philosophiæ Naturalis Principia Mathematica» unifica la caída de una manzana y las órbitas planetarias mediante tres leyes y la gravedad universal.',
          'Principia Mathematica unifies falling apples and planetary orbits under three laws of motion and universal gravitation.',
          'Fundó la física clásica y demostró que todo el universo obedece leyes matemáticas universales comprensibles por la razón.',
          'Founded classical mechanics and showed the entire cosmos obeys universal, mathematically predictable laws.'],
        [1751, false, 'Diderot y d’Alembert lanzan la Enciclopedia', 'Diderot & d’Alembert launch the Encyclopédie',
          'París, Francia', 'Paris, France',
          'Decenas de filósofos ilustran oficios, ciencias, derechos y crítica al absolutismo en 28 volúmenes ilustrados pese a la censura real.',
          'Enlightenment thinkers compile sciences, crafts, political theory, and critique of absolutism across 28 illustrated volumes despite censorship.',
          'Difundió los ideales de la Ilustración —razón, ciencia práctica y derechos ciudadanos— preparando el terreno intelectual de 1789.',
          'Spread Enlightenment ideals of reason, secular knowledge, and civic liberty, paving the intellectual path to 1789.'],
        [1776, false, 'Declaración de Independencia de Estados Unidos', 'US Declaration of Independence',
          'Filadelfia, EE. UU.', 'Philadelphia, USA',
          'El 4 de julio las Trece Colonias aprueban el texto redactado por Thomas Jefferson proclamando la igualdad de derechos y soberanía popular.',
          'On 4 July, the Thirteen Colonies adopt Thomas Jefferson’s declaration asserting inalienable rights and government by consent.',
          'Inauguró la primera república constitucional moderna de América e inspiró directamente los movimientos emancipadores de Europa y Latinoamérica.',
          'Created the Americas’ first modern constitutional republic and directly inspired European and Latin American independence movements.'],
        [1781, false, 'Rebelión de Túpac Amaru II y máquina de Watt', 'Túpac Amaru II rebellion & Watt’s rotary steam engine',
          'Andes / Gran Bretaña', 'Andes / Britain',
          'Mientras José Gabriel Condorcanqui lidera en Perú la mayor sublevación indígena anticolonial, James Watt patenta en Inglaterra el vapor rotativo fabril.',
          'José Gabriel Condorcanqui leads the largest anti-colonial Andean uprising in Peru just as James Watt patents rotary factory steam power in Britain.',
          'Simboliza la doble fractura del mundo antiguo: crisis profunda de los imperios coloniales y salto mecánico hacia la era industrial.',
          'Marks a dual turning point: deepening anti-colonial cracks in empires and the mechanical leap powering the Industrial Revolution.']
      ]
    },
    {
      id: 'nineteenth',
      color: '#b59ad8',
      title: { es: 'Siglo XIX', en: '19th Century' },
      span: { es: '1789 – 1914', en: '1789 – 1914' },
      summary: {
        es: '<b>Revoluciones políticas e industrialización:</b> caen las monarquías absolutas, se emancipa Hispanoamérica, el ferrocarril y el telégrafo encogen el planeta y la ciencia revela la evolución y los microbios.',
        en: '<b>Political revolutions & industrial takeoff:</b> absolute monarchies fall, Latin America wins independence, railways and telegraphs shrink distance, and science unveils evolution and germ theory.'
      },
      events: [
        [1789, false, 'Revolución Francesa: Toma de la Bastilla', 'French Revolution: Storming of the Bastille',
          'París, Francia', 'Paris, France',
          'El 14 de julio el pueblo parisino asalta la fortaleza real y la Asamblea proclama los Derechos del Hombre y del Ciudadano acabando con los privilegios feudales.',
          'On 14 July Parisians storm the royal fortress while the Assembly issues the Declaration of the Rights of Man, abolishing feudal privilege.',
          'Redefinió la política mundial introduciendo conceptos de ciudadanía, soberanía nacional, sistema métrico decimal y código civil.',
          'Reshaped modern politics around citizenship, national sovereignty, the metric system, and civic equality.'],
        [1804, false, 'Independencia de Haití y Código Napoleónico', 'Haitian independence & Napoleonic Code',
          'Haití / Francia', 'Haiti / France',
          'Antiguos esclavos liderados por Dessalines proclaman la primera república negra libre (1 de enero) meses antes de que Napoleón se corone y promulgue su Código Civil.',
          'Formerly enslaved revolutionaries proclaim free Haiti (Jan 1) months before Napoleon crowns himself emperor and issues his Civil Code.',
          'Haití demolió la idea de supremacía esclavista en América, mientras el Código Napoleónico unificó las leyes civiles en media Europa y América Latina.',
          'Haiti proved enslaved people could win sovereignty, while the Napoleonic Code modernized legal codes across Europe and Latin America.'],
        [1810, false, 'Estallan las independencias hispanoamericanas', 'Spanish American wars of independence ignite',
          'Buenos Aires, México, Caracas, Santiago', 'Buenos Aires, Mexico, Caracas, Santiago',
          'Aprovechando el vacío de poder tras la invasión napoleónica a España, se forman juntas autónomas en mayo (Argentina), julio (Colombia), septiembre (México y Chile).',
          'Amid Napoleon’s invasion of Spain, autonomous juntas and uprisings erupt across Buenos Aires, Caracas, Bogota, Dolores (Mexico), and Santiago.',
          'Tras campañas de San Martín y Bolívar en la década siguiente, nacieron las repúblicas soberanas de América Latina.',
          'Following campaigns by San Martín and Bolívar, nearly all Spanish mainland colonies forged sovereign Latin American republics.'],
        [1815, false, 'Batalla de Waterloo y Congreso de Viena', 'Battle of Waterloo & Congress of Vienna',
          'Waterloo, Bélgica', 'Waterloo, Belgium',
          'Coalición anglo-prusiana liderada por Wellington y Blücher derrota definitivamente a Napoleón el 18 de junio, cerrando 23 años de guerras europeas.',
          'Wellington and Blücher’s coalition permanently defeats Napoleon on 18 June, ending 23 years of European coalition wars.',
          'Estableció un equilibrio diplomático de grandes potencias en Europa que evitó guerras continentales totales durante casi un siglo.',
          'Reordered Europe under the Concert of Europe, preventing general continental war among major powers for nearly a century.'],
        [1825, false, 'Primer ferrocarril público a vapor', 'First public steam railway opens',
          'Stockton–Darlington, Reino Unido', 'Stockton–Darlington, UK',
          'La locomotora «Locomotion No. 1» de George Stephenson transporta carbón y pasajeros sobre raíles metálicos superando la velocidad de cualquier carruaje.',
          'George Stephenson’s Locomotion No. 1 hauls coal and passengers on iron rails faster than any horse-drawn carriage.',
          'Desató la fiebre ferroviaria planetaria, abarató alimentos y materias primas y obligó a unificar los husos horarios.',
          'Sparked the global railway boom, slashed freight costs, connected interiors to ports, and forced standardized timekeeping.'],
        [1844, false, 'Primer mensaje por telégrafo eléctrico de Morse', 'Samuel Morse sends the first public telegram',
          'Washington – Baltimore, EE. UU.', 'Washington – Baltimore, USA',
          'Samuel Morse transmite «What hath God wrought» por cable eléctrico entre Washington y Baltimore usando puntos y rayas.',
          'Samuel Morse transmits "What hath God wrought" over wire between Washington and Baltimore using his dot-dash code.',
          'Por primera vez en la historia humana la información viajó más rápido que un caballo o un barco, inaugurando las telecomunicaciones.',
          'Separated communication from physical travel for the first time in history, founding modern telecommunications.'],
        [1848, false, 'Oleada revolucionaria europea y fiebre del oro', '1848 European Revolutions & California Gold Rush',
          'Europa / California', 'Europe / California',
          'Revueltas populares en París, Viena, Berlín y Milán exigen constituciones, sufragio ampliado y fin de la servidumbre; en paralelo aparece oro en California.',
          'Popular uprisings from Paris to Vienna demand constitutions and abolition of serfdom just as gold strikes spark migration to California.',
          'Aceleró la abolición definitiva de la servidumbre en Europa Central, el auge del movimiento obrero y las migraciones transoceánicas.',
          'Ended serfdom across Central Europe, catalyzed labor movements, and spurred Pacific migration and globalization.'],
        [1859, false, 'Charles Darwin publica «El origen de las especies»', 'Darwin publishes On the Origin of Species',
          'Londres, Reino Unido', 'London, UK',
          'Tras su viaje en el Beagle por Sudamérica y Galápagos, Darwin explica cómo todas las especies evolucionan por descendencia común y selección natural.',
          'Building on his South American and Galápagos Beagle voyage, Darwin explains evolution by common descent and natural selection.',
          'Unificó toda la biología moderna bajo una sola teoría explicativa verificada posteriormente por la genética y el ADN.',
          'Unified all of biology under a single explanatory framework later confirmed down to molecular genetics.'],
        [1861, false, 'Louis Pasteur demuestra la teoría germinal', 'Louis Pasteur establishes germ theory',
          'París, Francia', 'Paris, France',
          'Con sus matraces de cuello de cisne, Pasteur refuta la generación espontánea y prueba que microorganismos invisibles causan fermentaciones e infecciones.',
          'Using swan-neck flasks, Pasteur disproves spontaneous generation and proves microscopic organisms cause fermentation and disease.',
          'Revolucionó la medicina moderna con la asepsia quirúrgica, pasteurización de alimentos y vacunas contra el carbunco y la rabia.',
          'Transformed medicine and food safety through surgical antisepsis, pasteurization, and laboratory-crafted vaccines.'],
        [1865, false, 'Fin de la Guerra Civil de EE. UU. y abolición esclavista', 'End of the US Civil War & abolition of slavery',
          'Estados Unidos', 'United States',
          'La rendición confederada en Appomattox y la 13.ª Enmienda ponen fin a la esclavitud legal de cuatro millones de personas; días después muere asesinado Lincoln.',
          'Confederate surrender at Appomattox and the 13th Amendment abolish slavery across the US, days before Abraham Lincoln’s assassination.',
          'Consolidó la unidad federal estadounidense convirtiéndola en potencia industrial y supuso un hito decisivo en el fin mundial de la esclavitud legal.',
          'Preserved the United States as a unified industrial power and marked a decisive blow to chattel slavery worldwide.'],
        [1869, false, 'Tabla periódica de Mendeléyev y Canal de Suez', 'Mendeleev’s Periodic Table & Suez Canal opens',
          'San Petersburgo / Egipto', 'St. Petersburg / Egypt',
          'Dmitri Mendeléyev organiza los 63 elementos conocidos dejando huecos para elementos aún por descubrir; ese mismo año se inaugura el Canal de Suez.',
          'Dmitri Mendeleev arranges 63 known elements—leaving gaps that accurately predict missing ones—the same year Egypt’s Suez Canal opens.',
          'Convirtió la química en ciencia predictiva exacta mientras Suez acortaba en semanas la navegación entre Europa y Asia.',
          'Turned chemistry into an exact predictive science while the Suez Canal cut sea voyages between Europe and Asia in half.'],
        [1876, false, 'Alexander Graham Bell patenta el teléfono', 'Bell patents the electric telephone',
          'Boston, EE. UU.', 'Boston, USA',
          'Bell logra transmitir voz humana modulada en tiempo real mediante corriente eléctrica: «Sr. Watson, venga aquí, quiero verlo».',
          'Bell transmits intelligible human speech in real time over wire: "Mr. Watson, come here, I want to see you."',
          'Permitió la comunicación directa de voz a distancia en hogares, empresas y redes urbanas globales.',
          'Enabled instant two-way voice communication across cities and continents, reshaping business and daily life.'],
        [1885, false, 'Abolición progresiva y Conferencia de Berlín / Auto Benz', 'Benz patents motorcar & Congo Berlin Conference',
          'Alemania', 'Germany',
          'Mientras potencias europeas se reparten África en Berlín, Karl Benz construye el primer automóvil práctico propulsado por motor de combustión interna.',
          'As European powers partition Africa at Berlin, Karl Benz builds the first practical gasoline internal-combustion automobile.',
          'El reparto imperial marcó las fronteras africanas modernas, y el motor de explosión transformó la movilidad y la industria petrolera.',
          'Colonial partition carved lasting African borders, while the motorcar sparked global road networks and oil economies.'],
        [1895, false, 'Hermanos Lumière inauguran el cine y Röntgen descubre rayos X', 'Lumière brothers unveil cinema & Röntgen finds X-rays',
          'París / Wurzburgo', 'Paris / Würzburg',
          'En diciembre nacen casi a la vez el cinematógrafo ante público pagado en París y la primera radiografía médica de la mano en Alemania.',
          'In late 1895 the first commercial cinema screening opens in Paris weeks after Wilhelm Röntgen discovers medical X-rays in Germany.',
          'Dieron origen a la cultura audiovisual de masas del siglo XX y al diagnóstico médico no invasivo.',
          'Launched twentieth-century mass visual culture alongside non-invasive diagnostic medicine.'],
        [1903, false, 'Primer vuelo controlado a motor de los hermanos Wright', 'Wright brothers’ first powered airplane flight',
          'Kitty Hawk, Carolina del Norte', 'Kitty Hawk, NC',
          'El 17 de diciembre Orville Wright recorre 36 metros en 12 segundos sobre las dunas controlando alabeo, cabeceo y guiñada.',
          'On 17 December Orville Wright flies 36 meters in 12 seconds with three-axis aerodynamic control.',
          'En solo 66 años llevó a la humanidad desde planear 12 segundos sobre una playa hasta caminar sobre la Luna.',
          'Launched aviation, shrinking oceans to hours and leading within 66 years to walking on the Moon.']
      ]
    },
    {
      id: 'contemporary',
      color: '#e58a7a',
      title: { es: 'Siglos XX y XXI', en: '20th & 21st Centuries' },
      span: { es: '1914 – hoy', en: '1914 – today' },
      summary: {
        es: '<b>El siglo más veloz de la historia:</b> dos guerras mundiales, fin de los imperios coloniales, antibióticos, exploración espacial, caída del Muro, Internet y revolución genética e informática.',
        en: '<b>History’s fastest century:</b> two world wars, decolonization, antibiotics, the Space Race, collapse of the Berlin Wall, the World Wide Web, and genomic/AI revolutions.'
      },
      events: [
        [1914, false, 'Estalla la Primera Guerra Mundial', 'World War I begins',
          'Europa (Sarajevo → Frentes globales)', 'Europe (Sarajevo → Global Fronts)',
          'Tras el asesinato del archiduque Francisco Fernando en Sarajevo, el sistema de alianzas arrastra a Europa a cuatro años de guerra industrial de trincheras.',
          'Following Archduke Franz Ferdinand’s assassination in Sarajevo, rival alliances plunge empires into four years of industrial trench warfare.',
          'Hundió cuatro imperios centenarios (alemán, austrohúngaro, ruso y otomano), dejó 17 millones de muertos y sembró tensiones futuras.',
          'Toppled four empires (German, Austro-Hungarian, Russian, Ottoman), killed 17 million, and set up later geopolitical crises.'],
        [1917, false, 'Revolución Rusa y triunfo bolchevique', 'Russian Revolution & Bolshevik takeover',
          'Petrogrado, Rusia', 'Petrograd, Russia',
          'Cae el zarismo en febrero y en octubre los bolcheviques encabezados por Lenin toman el poder retirando a Rusia de la guerra mundial.',
          'Tsarist autocracy falls in February, and in October Lenin’s Bolsheviks seize power and withdraw Russia from WWI.',
          'Dio origen a la Unión Soviética (1922) y definió la gran pugna ideológica del siglo XX entre capitalismo y comunismo.',
          'Created the Soviet Union (1922) and defined the 20th century’s central ideological struggle between capitalism and communism.'],
        [1928, false, 'Alexander Fleming descubre la penicilina', 'Alexander Fleming discovers penicillin',
          'Londres, Reino Unido', 'London, UK',
          'Observa por azar que un moho (Penicillium) destruye colonias de bacterias estafilococos en una placa de Petri olvidada.',
          'Fleming notices a stray mold (Penicillium) dissolving Staphylococcus bacteria colonies on an unwashed Petri dish.',
          'Inauguró la era de los antibióticos (producida en masa en los años 40), multiplicando la esperanza de vida mundial y salvando cientos de millones de vidas.',
          'Inaugurated the antibiotic era, saving hundreds of millions of lives from previously lethal everyday infections.'],
        [1929, false, 'Crack del 29 y Gran Depresión', 'Wall Street Crash & Great Depression',
          'Nueva York → Mundo', 'New York → Global',
          'El desplome bursátil de octubre en Nueva York provoca quiebras bancarias en cadena, contracción comercial y desempleo masivo mundial durante una década.',
          'October’s stock market collapse triggers banking failures, global trade contraction, and decade-long mass unemployment.',
          'Transformó el papel económico de los Estados (New Deal, bancos centrales, redes de protección social) y favoreció extremismos en Europa.',
          'Reshaped state economic policy (New Deal, social safety nets) while destabilizing fragile democracies in Europe.'],
        [1939, false, 'Comienza la Segunda Guerra Mundial', 'World War II begins',
          'Europa / Pacífico', 'Europe / Pacific',
          'El 1 de septiembre Alemania invade Polonia; en los seis años siguientes se convierte en el conflicto más mortífero de la historia (~70 millones de víctimas).',
          'On 1 September Germany invades Poland; over six years it escalates into the deadliest global war in history (~70 million dead).',
          'Su desenlace reconfiguró por completo las fronteras, aceleró la descolonización y dio paso a la era nuclear y a la Guerra Fría.',
          'Redrew global power, accelerated decolonization, and ushered in both the nuclear age and Cold War bipolarity.'],
        [1945, false, 'Fin de la II Guerra Mundial y fundación de la ONU', 'End of WWII & founding of the United Nations',
          'San Francisco / Hiroshima / Berlín', 'San Francisco / Hiroshima / Berlin',
          'Tras la derrota del Eje y las bombas atómicas de Hiroshima y Nagasaki, 51 países firman la Carta de las Naciones Unidas para preservar la paz.',
          'Following Axis surrender and atomic bombings of Hiroshima and Nagasaki, 51 nations sign the UN Charter to prevent future global wars.',
          'Consolidó los Derechos Humanos internacionales (1948), las instituciones multilaterales y el equilibrio nuclear entre EE. UU. y la URSS.',
          'Anchored international human rights law (1948), multilateral institutions, and Cold War superpower rivalry.'],
        [1947, false, 'Independencia de la India e invención del transistor', 'Indian Independence & invention of the transistor',
          'India / Bell Labs, EE. UU.', 'India / Bell Labs, USA',
          'El subcontinente indio logra su independencia (dividido en India y Pakistán) el mismo año en que Bell Labs crea el primer transistor semiconductor.',
          'British India wins independence (partitioned into India and Pakistan) the exact year Bell Labs builds the first semiconductor transistor.',
          'Uno desató la gran ola descolonizadora de Asia y África; el otro reemplazó las válvulas de vacío y fundó toda la microelectrónica moderna.',
          'One sparked global decolonization across Asia and Africa; the other enabled microchips, computers, and modern electronics.'],
        [1953, false, 'Descubrimiento de la doble hélice del ADN', 'Discovery of the DNA double helix',
          'Cambridge, Reino Unido', 'Cambridge, UK',
          'James Watson y Francis Crick proponen la estructura molecular helicoidal del ADN basándose decisivamente en la difracción de rayos X (Foto 51) de Rosalind Franklin.',
          'Watson and Crick deduce DNA’s double-helix structure, built crucially on Rosalind Franklin’s X-ray diffraction Photo 51.',
          'Reveló el mecanismo universal por el que todos los seres vivos copian y heredan la información genética.',
          'Unlocked the universal molecular mechanism by which every living organism stores and copies genetic code.'],
        [1957, false, 'Lanzamiento del Sputnik 1 y Tratado de Roma', 'Sputnik 1 launched & Treaty of Rome signed',
          'Baikonur (URSS) / Roma', 'Baikonur (USSR) / Rome',
          'La URSS pone en órbita el primer satélite artificial de la historia mientras seis países europeos firman el mercado común embrión de la Unión Europea.',
          'The USSR orbits humanity’s first artificial satellite just months after six European nations sign the treaty founding the European Common Market.',
          'Abrió oficialmente la Era Espacial (telecomunicaciones por satélite, GPS) y sentó las bases de la integración europea pacífica.',
          'Opened the Space Age—enabling satellite communications and GPS—alongside the foundation of today’s European Union.'],
        [1969, false, 'Llegada humana a la Luna (Apolo 11) y ARPANET', 'Apollo 11 Moon landing & ARPANET’s first link',
          'Mar de la Tranquilidad / California', 'Sea of Tranquility / California',
          'El 20 de julio Neil Armstrong y Buzz Aldrin caminan sobre la Luna; semanas después se envía el primer mensaje entre computadoras de ARPANET.',
          'On 20 July Neil Armstrong and Buzz Aldrin walk on the Moon; weeks later ARPANET transmits its first computer-to-computer packet.',
          'Representó la cumbre técnica del siglo XX en exploración espacial y sembró el protocolo de redes que daría origen a Internet.',
          'Crowned 20th-century aerospace engineering while sowing the packet-switched network that evolved into the Internet.'],
        [1979, false, 'Erradicación mundial de la viruela', 'Global eradication of smallpox',
          'Mundial (OMS)', 'Global (WHO)',
          'Tras una campaña global coordinada de vacunación sin precedentes en plena Guerra Fría, la OMS certifica en 1979-1980 el fin de la viruela.',
          'Following an unprecedented worldwide vaccination campaign during the Cold War, the WHO certifies smallpox completely eradicated.',
          'Primera y hasta ahora única enfermedad humana infecciosa eliminada de la Tierra (había causado ~300 millones de muertes solo en el siglo XX).',
          'The first—and so far only—human disease completely wiped from Earth, saving tens of millions of lives every decade since.'],
        [1989, false, 'Caída del Muro de Berlín', 'Fall of the Berlin Wall',
          'Berlín, Alemania', 'Berlin, Germany',
          'La noche del 9 de noviembre miles de berlineses derriban la barrera que dividía la ciudad y Europa desde 1961; dos años después se disuelve la URSS.',
          'On 9 November crowds dismantle the wall dividing Berlin since 1961; within two years Germany reunifies and the USSR dissolves.',
          'Puso fin simbólico y real a la Guerra Fría y aceleró la globalización económica e integración europea hacia el Este.',
          'Ended the Cold War division of Europe and accelerated global trade and eastward European integration.'],
        [1991, false, 'Apertura pública de la World Wide Web', 'World Wide Web released to the public',
          'CERN (Ginebra, Suiza)', 'CERN (Geneva, Switzerland)',
          'Tim Berners-Lee publica la primera página web combinando hipertexto (HTML), direcciones URL y el protocolo HTTP sin patentes ni licencias.',
          'Tim Berners-Lee releases the first website combining hypertext (HTML), URLs, and HTTP completely royalty-free.',
          'Democratizó la publicación universal de información y transformó para siempre la economía, educación, prensa y vida cotidiana.',
          'Turned the Internet into a universal public information commons, transforming commerce, education, and media.'],
        [2003, false, 'Finalización del Proyecto Genoma Humano', 'Completion of the Human Genome Project',
          'Consorcio Internacional', 'International Consortium',
          'Tras 13 años de trabajo internacional se publica la secuencia completa de ~3.000 millones de pares de bases del ADN humano.',
          'After 13 years of global collaboration, scientists complete the sequence of ~3 billion base pairs of human DNA.',
          'Abrió la medicina genómica personalizada, terapias dirigidas, arqueogenética y edición genética CRISPR.',
          'Inaugurated genomic medicine, targeted therapies, ancient DNA reconstruction, and later CRISPR gene editing.'],
        [2007, false, 'Llegada del teléfono inteligente moderno', 'Launch of the modern touchscreen smartphone',
          'Cupertino / Mundial', 'Cupertino / Global',
          'La convergencia de pantalla capacitiva multitáctil, GPS, cámaras digitales e Internet móvil 3G/4G mete un ordenador conectado en cada bolsillo.',
          'Capacitive touchscreens, GPS, cameras, and mobile broadband converge into pocket supercomputers connected 24/7.',
          'Reorganizó la comunicación social, el comercio, la navegación urbana y la economía digital del siglo XXI en menos de una década.',
          'Reshaped social communication, commerce, maps, and 21st-century digital life across nearly every continent within a decade.']
      ]
    }
  ];

  const EVENTS = [];
  ERAS.forEach((era, ei) => {
    era.events.forEach((e, i) => {
      EVENTS.push({
        id: `${era.id}-${i}`,
        eraIdx: ei,
        year: e[0],
        approx: e[1],
        title: { es: e[2], en: e[3] },
        place: { es: e[4], en: e[5] },
        note: { es: e[6], en: e[7] },
        impact: { es: e[8], en: e[9] }
      });
    });
  });

  function fmtYear(y, approx) {
    const pre = approx ? 'c. ' : '';
    return y < 0 ? `${pre}${-y} ${t().bc}` : `${pre}${y}`;
  }

  const TEST_LEN = 10;
  const state = {
    eraIdx: 0,
    mode: saved.get('mode', 'study'),
    task: saved.get('task', 'mix'),
    scope: saved.get('scope', 'era'),
    bests: saved.get('bests', {}),
    right: 0, total: 0, streak: 0, t0: 0, frozen: null,
    answered: false, q: null
  };

  const currentEra = () => ERAS[state.eraIdx] || ERAS[0];
  const pool = () => (state.scope === 'all' ? EVENTS : EVENTS.filter((e) => e.eraIdx === state.eraIdx));

  function elapsed() {
    if (state.frozen != null) return state.frozen;
    return state.t0 ? (Date.now() - state.t0) / 1000 : 0;
  }
  function fmtClock(s) {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  setInterval(() => {
    if (state.t0 && state.frozen == null) $('sTime').textContent = fmtClock(elapsed());
  }, 400);

  function updateStats() {
    $('sAcc').textContent = state.total ? Math.round((100 * state.right) / state.total) + '%' : '–';
    $('sStreak').textContent = state.streak;
    $('sTime').textContent = fmtClock(elapsed());
  }
  function resetSession() {
    state.right = 0; state.total = 0; state.streak = 0;
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
    $('taskHeading').textContent = L.taskHeading;
    $('scopeHeading').textContent = L.scopeHeading;
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

    const seg = (id, val, labels) =>
      document.querySelectorAll(`#${id} button`).forEach((b) => {
        const v = b.getAttribute('data-v');
        b.textContent = labels[v];
        b.setAttribute('aria-pressed', String(v === val));
      });
    seg('modeSeg', state.mode, L.modes);
    seg('taskSeg', state.task, L.tasks);
    seg('scopeSeg', state.scope, L.scopes);
    $('modeHint').textContent = L.modeHints[state.mode] || '';
    $('taskHint').textContent = L.taskHints[state.task] || '';

    renderRail();
    renderBest();
  }

  function renderRail() {
    const box = $('railList');
    box.innerHTML = '';
    let nextMarked = false;
    ERAS.forEach((era, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', String(idx === state.eraIdx));
      const best = state.bests[era.id];
      let cls = '', txt = era.span[LANG];
      if (best && best.pct >= 90) { cls = 'done'; txt = best.pct + '%'; }
      else if (!nextMarked) { nextMarked = true; cls = 'next'; }
      btn.innerHTML = `<span><i>${idx + 1}</i>${era.title[LANG]}</span><em class="${cls}">${txt}</em>`;
      btn.addEventListener('click', () => { state.eraIdx = idx; resetSession(); renderAll(); });
      box.appendChild(btn);
    });
  }

  function renderBest() {
    const best = state.bests[currentEra().id];
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

  function eraStripHTML() {
    return `<div class="era-strip">${ERAS.map(
      (e, i) => `<button type="button" data-era="${i}" aria-pressed="${i === state.eraIdx}" style="flex:1;background:${e.color}" title="${e.title[LANG]} (${e.span[LANG]})">${e.span[LANG]}</button>`
    ).join('')}</div>`;
  }
  function bindEraStrip() {
    document.querySelectorAll('.era-strip button').forEach((b) =>
      b.addEventListener('click', () => {
        state.eraIdx = Number(b.getAttribute('data-era'));
        resetSession();
        renderAll();
      })
    );
  }

  function buildEraAxisSVG(era, evs) {
    if (!evs.length) return '';
    const W = 640;
    const H = 74;
    const padL = 28;
    const padR = 28;
    const plotW = W - padL - padR;
    const minY = evs[0].year;
    const maxY = evs[evs.length - 1].year;
    const span = Math.max(1, maxY - minY);
    const axisY = 38;
    const midY = Math.round((minY + maxY) / 2);

    const dots = evs.map((e, i) => {
      const ratio = (e.year - minY) / span;
      const x = +(padL + ratio * plotW).toFixed(1);
      const yOff = (i % 2 === 0 ? -9 : 9);
      return `<g class="tl-axis-node">
        <line x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + yOff}" stroke="${era.color}" stroke-width="1.2" opacity="0.55" />
        <circle class="tl-axis-dot" data-idx="${i}" cx="${x}" cy="${axisY + yOff}" r="5.5" fill="${era.color}" fill-opacity="0.82" stroke="#0c1218" stroke-width="1.5">
          <title>${fmtYear(e.year, e.approx)} · ${e.title[LANG]}</title>
        </circle>
      </g>`;
    }).join('');

    return `
      <div class="tl-axis-box">
        <div class="tl-axis-head">
          <span>${LANG === 'es' ? 'Escala temporal proporcional de la era' : 'Proportional era time axis'}</span>
          <span>${era.span[LANG]}</span>
        </div>
        <svg class="tl-axis-svg" viewBox="0 0 ${W} ${H}" aria-label="${era.title[LANG]}">
          <line x1="${padL}" y1="${axisY}" x2="${W - padR}" y2="${axisY}" stroke="#273645" stroke-width="2.5" stroke-linecap="round" />
          <text x="${padL}" y="${H - 4}" fill="#7f91a2" font-size="10" font-family="ui-monospace, monospace" text-anchor="start">${fmtYear(minY, false)}</text>
          <text x="${padL + plotW / 2}" y="${H - 4}" fill="#7f91a2" font-size="10" font-family="ui-monospace, monospace" text-anchor="middle">${fmtYear(midY, true)}</text>
          <text x="${W - padR}" y="${H - 4}" fill="#7f91a2" font-size="10" font-family="ui-monospace, monospace" text-anchor="end">${fmtYear(maxY, false)}</text>
          ${dots}
        </svg>
      </div>`;
  }

  // ---------------- ESTUDIAR ----------------
  function renderStudy() {
    const era = currentEra();
    const L = t();
    $('felt').classList.add('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');
    setPrompt({ eyebrow: `${era.title[LANG]} · ${L.modes.study}`, name: era.title[LANG], meta: `${era.span[LANG]} · 15 ${LANG === 'es' ? 'hitos clave' : 'anchors'}`, bar: null });

    const evs = EVENTS.filter((e) => e.eraIdx === state.eraIdx).sort((a, b) => a.year - b.year);
    let html = '';
    evs.forEach((e, i) => {
      if (i > 0) html += `<div class="tl-gap" data-idx="${i}">${L.gap(e.year - evs[i - 1].year)}</div>`;
      const hay = `${fmtYear(e.year, e.approx)} ${e.title[LANG]} ${e.place[LANG]} ${e.note[LANG]} ${e.impact[LANG]}`.toLowerCase();
      html += `<div class="tl-item" data-idx="${i}" data-hay="${hay.replace(/"/g, '&quot;')}" style="--dot:${era.color}">
        <span class="tl-year">${fmtYear(e.year, e.approx)}</span>
        <div class="tl-head">
          <span class="tl-title">${e.title[LANG]}</span>
          <span class="tl-place">${e.place[LANG]}</span>
        </div>
        <span class="tl-note">${e.note[LANG]}</span>
        <div class="tl-impact"><b>${L.impactLbl}</b> ${e.impact[LANG]}</div>
      </div>`;
    });

    const ph = LANG === 'es' ? 'Filtrar hitos, lugares, años o conceptos…' : 'Filter milestones, places, years, or concepts…';
    $('felt').innerHTML = `
      <div class="tl-wrap">
        ${eraStripHTML()}
        ${buildEraAxisSVG(era, evs)}
        <div class="era-summary" style="--era-c:${era.color}">${era.summary[LANG]}</div>
        <div class="tl-toolbar">
          <input type="search" class="tl-search" id="tlSearch" placeholder="${ph}" aria-label="${ph}">
          <span class="tl-search-count" id="tlCount">${evs.length} / ${evs.length}</span>
        </div>
        <div class="tl-list" id="tlList">${html}</div>
      </div>`;
    bindEraStrip();

    const dots = document.querySelectorAll('.tl-axis-dot');
    const items = document.querySelectorAll('.tl-list .tl-item');
    const gaps = document.querySelectorAll('.tl-list .tl-gap');
    const searchEl = $('tlSearch');
    const countEl = $('tlCount');

    const applyFilter = (qRaw) => {
      const q = (qRaw || '').trim().toLowerCase();
      let visible = 0;
      let prevShown = false;
      items.forEach((it, idx) => {
        const hit = !q || it.getAttribute('data-hay').includes(q);
        it.hidden = !hit;
        if (dots[idx]) dots[idx].style.opacity = hit ? '1' : '0.18';
        if (idx > 0 && gaps[idx - 1]) gaps[idx - 1].hidden = !(hit && prevShown && !q);
        if (hit) { visible++; prevShown = true; }
      });
      if (countEl) countEl.textContent = `${visible} / ${evs.length}`;
    };

    if (searchEl) {
      searchEl.addEventListener('input', (e) => applyFilter(e.target.value));
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.getAttribute('data-idx'));
        if (searchEl && searchEl.value) {
          searchEl.value = '';
          applyFilter('');
        }
        dots.forEach((d) => d.classList.remove('is-active'));
        dot.classList.add('is-active');
        items.forEach((el) => el.classList.remove('is-focus'));
        const target = items[idx];
        if (target) {
          target.classList.add('is-focus');
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    const act = $('actions');
    act.innerHTML = '';
    const go = document.createElement('button');
    go.type = 'button';
    go.className = 'act primary';
    go.textContent = L.goPractice;
    go.addEventListener('click', () => setMode('practice'));
    act.appendChild(go);
  }

  // ---------------- PRACTICAR / EXAMEN ----------------
  function eraLabel(e) { return ERAS[e.eraIdx].title[LANG]; }

  function nextQuestion() {
    const L = t();
    $('felt').classList.remove('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');
    if (state.mode === 'test' && state.total >= TEST_LEN) { finishTest(); return; }
    state.answered = false;

    const kind = state.task === 'mix' ? pick(['duel', 'year', 'order']) : state.task;
    const meta = state.mode === 'test' ? `${state.total + 1} / ${TEST_LEN}` : currentEra().span[LANG];
    const bar = state.mode === 'test' ? state.total / TEST_LEN : null;
    const eyebrow = `${state.scope === 'all' ? L.scopes.all : currentEra().title[LANG]} · ${L.modes[state.mode]}`;

    if (kind === 'duel') renderDuel(eyebrow, meta, bar);
    else if (kind === 'year') renderYear(eyebrow, meta, bar);
    else renderOrder(eyebrow, meta, bar);
  }

  function renderDuel(eyebrow, meta, bar) {
    const L = t();
    const P = pool();
    let a, b;
    do { [a, b] = shuffle(P).slice(0, 2); } while (a.year === b.year);
    state.q = { kind: 'duel', a, b };
    setPrompt({ eyebrow, name: L.qDuel, meta, bar });

    $('felt').innerHTML = `
      <div class="tl-wrap">
        <div class="duel">
          ${[a, b].map((e, i) => `
            <button type="button" class="duel-btn" data-i="${i}">
              <small>${i === 0 ? '←' : '→'} · ${e.place[LANG]}</small>
              <b>${e.title[LANG]}</b>
              <span class="reveal-year"></span>
            </button>`).join('')}
        </div>
        <div class="duel-detail-box" id="duelNote" hidden></div>
      </div>`;
    $('actions').innerHTML = '';

    document.querySelectorAll('.duel-btn').forEach((btn) =>
      btn.addEventListener('click', () => {
        if (state.answered) return;
        const i = Number(btn.getAttribute('data-i'));
        const chosen = i === 0 ? a : b;
        const earlier = a.year < b.year ? a : b;
        const ok = chosen === earlier;
        document.querySelectorAll('.duel-btn').forEach((x, j) => {
          const ev = j === 0 ? a : b;
          x.disabled = true;
          x.querySelector('.reveal-year').textContent = fmtYear(ev.year, ev.approx);
          if (ev === earlier) x.classList.add('is-right');
          else if (j === i && !ok) x.classList.add('is-wrong');
        });
        const later = earlier === a ? b : a;
        const cardHtml = (ev, tag) => `
          <div class="duel-detail-card">
            <div class="dd-head"><span>${tag} · ${fmtYear(ev.year, ev.approx)}</span><span>${ev.place[LANG]}</span></div>
            <b>${ev.title[LANG]}</b>
            <p>${ev.note[LANG]}</p>
            <p class="dd-imp"><b>${L.impactLbl}</b> ${ev.impact[LANG]}</p>
          </div>`;
        $('duelNote').hidden = false;
        $('duelNote').innerHTML = `
          <div class="duel-gap-bar">${fmtYear(earlier.year, earlier.approx)} → <b>${L.gap(later.year - earlier.year)}</b> → ${fmtYear(later.year, later.approx)}</div>
          <div class="duel-detail-grid">
            ${cardHtml(earlier, LANG === 'es' ? '1º Anterior' : '1st Earlier')}
            ${cardHtml(later, LANG === 'es' ? '2º Posterior' : '2nd Later')}
          </div>`;
        record(ok, `${earlier.title[LANG]} (${fmtYear(earlier.year, earlier.approx)})`);
      })
    );
  }

  function yearDistractors(y) {
    const span = y < 0 ? 900 : y < 1000 ? 260 : y < 1500 ? 160 : y < 1800 ? 90 : y < 1900 ? 40 : 22;
    const step = y < 0 ? 50 : y < 1500 ? 10 : 1;
    const opts = new Set([y]);
    let guard = 0;
    while (opts.size < 4 && guard++ < 200) {
      let d = rand(Math.ceil(span / 6), span) * (Math.random() < 0.5 ? -1 : 1);
      let cand = Math.round((y + d) / step) * step;
      if (y < 0 && cand >= 0) cand = -Math.abs(cand) - step;
      if (y > 0 && cand <= 0) continue;
      if (y > 0 && cand > 2025) continue;
      if ([...opts].some((o) => Math.abs(o - cand) < Math.max(step, span / 10))) continue;
      opts.add(cand);
    }
    return [...opts].sort((p, q) => p - q);
  }

  function renderYear(eyebrow, meta, bar) {
    const L = t();
    const e = pick(pool());
    const opts = yearDistractors(e.year);
    state.q = { kind: 'year', e, opts };
    setPrompt({ eyebrow, name: L.qYear, meta, bar });

    $('felt').innerHTML = `
      <div class="tl-wrap">
        <div class="event-card">
          <div class="ev-era">${eraLabel(e)} · ${e.place[LANG]}</div>
          <div class="ev-title">${e.title[LANG]}</div>
          <div class="ev-year" id="yrReveal">?</div>
          <div class="ev-reveal" id="yrNote" style="text-align:left"></div>
        </div>
      </div>`;

    const act = $('actions');
    act.innerHTML = '';
    opts.forEach((y, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'act num';
      b.innerHTML = `${fmtYear(y, false)} <kbd>${i + 1}</kbd>`;
      b.addEventListener('click', () => {
        if (state.answered) return;
        const ok = y === e.year;
        act.querySelectorAll('.act').forEach((x, j) => {
          x.disabled = true;
          if (opts[j] === e.year) x.classList.add('is-right');
          else if (x === b && !ok) x.classList.add('is-wrong');
        });
        $('yrReveal').textContent = fmtYear(e.year, e.approx);
        $('yrNote').innerHTML = `${e.note[LANG]}<br><span style="display:block;margin-top:5px;color:var(--amber)"><b>${L.impactLbl}</b> ${e.impact[LANG]}</span>`;
        record(ok, `${e.title[LANG]} · ${fmtYear(e.year, e.approx)}`);
      });
      act.appendChild(b);
    });
  }

  function renderOrder(eyebrow, meta, bar) {
    const L = t();
    let items;
    let guard = 0;
    do {
      items = shuffle(pool()).slice(0, 4);
      guard++;
    } while (new Set(items.map((x) => x.year)).size < 4 && guard < 50);
    state.q = { kind: 'order', items, picked: [] };
    setPrompt({ eyebrow, name: L.qOrder, meta, bar });

    $('felt').innerHTML = `
      <div class="tl-wrap">
        <div class="order-list">
          ${items.map((e, i) => `
            <button type="button" class="order-btn" data-i="${i}">
              <span class="slot"></span>
              <span><b>${e.title[LANG]}</b> <small style="display:block;color:var(--muted);font-weight:400">${e.place[LANG]}</small></span>
              <span class="yr"></span>
            </button>`).join('')}
        </div>
      </div>`;

    const act = $('actions');
    act.innerHTML = '';
    const undo = document.createElement('button');
    undo.type = 'button';
    undo.className = 'act';
    undo.textContent = L.undo;
    undo.addEventListener('click', () => {
      if (state.answered || !state.q.picked.length) return;
      state.q.picked.pop();
      paintOrder();
    });
    act.appendChild(undo);

    document.querySelectorAll('.order-btn').forEach((btn) =>
      btn.addEventListener('click', () => {
        if (state.answered) return;
        const i = Number(btn.getAttribute('data-i'));
        const pk = state.q.picked;
        if (pk.includes(i)) {
          if (pk[pk.length - 1] === i) pk.pop();
        } else {
          pk.push(i);
        }
        paintOrder();
        if (pk.length === 4) evaluateOrder();
      })
    );
  }

  function paintOrder() {
    const pk = state.q.picked;
    document.querySelectorAll('.order-btn').forEach((btn) => {
      const i = Number(btn.getAttribute('data-i'));
      const pos = pk.indexOf(i);
      btn.classList.toggle('picked', pos >= 0);
      btn.querySelector('.slot').textContent = pos >= 0 ? String(pos + 1) : '';
    });
  }

  function evaluateOrder() {
    const L = t();
    const { items, picked } = state.q;
    const sorted = items.map((e, i) => ({ e, i })).sort((a, b) => a.e.year - b.e.year).map((x) => x.i);
    let inPlace = 0;
    picked.forEach((idx, pos) => { if (sorted[pos] === idx) inPlace++; });
    const ok = inPlace === 4;

    document.querySelectorAll('.order-btn').forEach((btn) => {
      const i = Number(btn.getAttribute('data-i'));
      const pos = picked.indexOf(i);
      const ev = items[i];
      btn.disabled = true;
      btn.querySelector('.yr').textContent = fmtYear(ev.year, ev.approx);
      btn.querySelector('.slot').textContent = `${pos + 1}→${sorted.indexOf(i) + 1}`;
      btn.classList.add(sorted[pos] === i ? 'is-right' : 'is-wrong');
      const mid = btn.children[1];
      if (mid && !mid.querySelector('.order-note')) {
        const noteEl = document.createElement('small');
        noteEl.className = 'order-note';
        noteEl.textContent = ev.note[LANG];
        mid.appendChild(noteEl);
      }
    });
    const list = document.querySelector('.order-list');
    sorted.forEach((i) => list.appendChild(list.querySelector(`.order-btn[data-i="${i}"]`)));
    $('actions').innerHTML = '';
    record(ok, ok ? L.orderOk : L.orderBad(inPlace));
  }

  function record(ok, label) {
    if (state.answered) return;
    state.answered = true;
    const L = t();
    state.total++;
    if (ok) { state.right++; state.streak++; } else state.streak = 0;
    updateStats();
    $('stageBox').classList.add(ok ? 'flash-ok' : 'flash-bad');
    setPrompt({
      eyebrow: ok ? L.correctExcl : L.wrongExcl,
      name: label,
      meta: state.mode === 'test' ? `${state.total} / ${TEST_LEN}` : currentEra().title[LANG],
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: ok ? 'ok' : 'bad'
    });
    const nb = document.createElement('button');
    nb.type = 'button';
    nb.className = 'act primary';
    nb.innerHTML = `${L.nextBtn} <kbd>Space</kbd>`;
    nb.addEventListener('click', () => nextQuestion());
    $('actions').appendChild(nb);
  }

  function finishTest() {
    state.frozen = elapsed();
    const L = t();
    const era = currentEra();
    const pct = Math.round((100 * state.right) / TEST_LEN);
    const timeSec = Math.round(state.frozen);
    const passed = pct >= 90;
    const prev = state.bests[era.id];
    if (!prev || pct > prev.pct || (pct === prev.pct && timeSec < prev.time)) {
      state.bests[era.id] = { pct, time: timeSec };
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
    $('felt').innerHTML = `<div class="tl-wrap"><div class="event-card"><div class="ev-era">${era.title[LANG]}</div><div class="ev-year">${pct}%</div><div class="ev-reveal">${fmtClock(timeSec)}</div></div></div>`;
    const act = $('actions');
    act.innerHTML = '';
    const r = document.createElement('button');
    r.type = 'button';
    r.className = 'act primary';
    r.textContent = L.tryAgain;
    r.addEventListener('click', () => { resetSession(); nextQuestion(); });
    act.appendChild(r);
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
  document.querySelectorAll('#modeSeg button').forEach((b) => b.addEventListener('click', () => setMode(b.getAttribute('data-v'))));
  document.querySelectorAll('#taskSeg button').forEach((b) =>
    b.addEventListener('click', () => {
      state.task = b.getAttribute('data-v');
      saved.set('task', state.task);
      resetSession();
      renderAll();
    })
  );
  document.querySelectorAll('#scopeSeg button').forEach((b) =>
    b.addEventListener('click', () => {
      state.scope = b.getAttribute('data-v');
      saved.set('scope', state.scope);
      resetSession();
      renderAll();
    })
  );
  $('restartBtn').addEventListener('click', () => { resetSession(); renderAll(); });
  $('cleanBtn').addEventListener('click', () => document.body.classList.add('clean'));
  $('cleanExit').addEventListener('click', () => document.body.classList.remove('clean'));
  $('settingsBtn').addEventListener('click', () => document.body.classList.add('sheet-open'));
  $('closeSheet').addEventListener('click', () => document.body.classList.remove('sheet-open'));
  $('howBtn').addEventListener('click', () => { $('intro').hidden = false; });
  $('introGo').addEventListener('click', () => { $('intro').hidden = true; });

  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;
    if (!$('intro').hidden) {
      if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); $('intro').hidden = true; }
      return;
    }
    if (state.mode === 'study') return;
    if (state.answered) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); nextQuestion(); }
      return;
    }
    const q = state.q;
    if (!q) return;
    if (q.kind === 'duel' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === '1' || e.key === '2')) {
      const i = e.key === 'ArrowLeft' || e.key === '1' ? 0 : 1;
      const btn = document.querySelectorAll('.duel-btn')[i];
      if (btn) { e.preventDefault(); btn.click(); }
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = Number(e.key) - 1;
      const btn = q.kind === 'order'
        ? document.querySelectorAll('.order-btn')[idx]
        : document.querySelectorAll('#actions .act.num')[idx];
      if (btn) { e.preventDefault(); btn.click(); }
    } else if (e.key === 'Backspace' && q.kind === 'order' && q.picked.length) {
      e.preventDefault();
      q.picked.pop();
      paintOrder();
    }
  });

  resetSession();
  renderAll();
})();
