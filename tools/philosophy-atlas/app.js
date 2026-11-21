(function () {
  'use strict';

  var STORE = SiteProgress.tool('philosophy-atlas');

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

  var BRANCHES = {
    epistemologia: {
      id: 'epistemologia',
      color: 'var(--b-epistemologia)',
      hex: '#6fd0e8',
      es: 'Epistemología y Ciencia',
      en: 'Epistemology & Science',
      questionEs: '¿Qué podemos saber y cómo distinguir conocimiento de opinión?',
      questionEn: 'What can we truly know and how do we separate knowledge from opinion?',
      descEs: 'Estudia los límites, fuentes y criterios de validez del saber humano: razón innata vs. experiencia sensible y método científico.',
      descEn: 'Examines the sources, limits, and validity criteria of human knowledge: innate reason vs. sensory experience and scientific method.'
    },
    etica: {
      id: 'etica',
      color: 'var(--b-etica)',
      hex: '#5fd39a',
      es: 'Ética y Virtud',
      en: 'Ethics & Virtue',
      questionEs: '¿Qué es una vida buena y cuál es nuestro deber moral?',
      questionEn: 'What constitutes a good life and what is our moral duty?',
      descEs: 'Analiza cómo debemos actuar, qué hace virtuosa a una persona y cómo fundamentar el deber más allá del mero interés.',
      descEn: 'Analyzes how we ought to act, what makes character virtuous, and how moral duty can be grounded beyond self-interest.'
    },
    politica: {
      id: 'politica',
      color: 'var(--b-politica)',
      hex: '#f0cf6a',
      es: 'Política y Sociedad',
      en: 'Politics & Society',
      questionEs: '¿Qué legitima el poder, la ley, la libertad y la justicia?',
      questionEn: 'What legitimizes political power, law, liberty, and social justice?',
      descEs: 'Indaga cómo organizar la comunidad política, los derechos individuales, las estructuras económicas y la emancipación.',
      descEn: 'Investigates political order, individual rights, economic structures, and paths toward human emancipation.'
    },
    metafisica: {
      id: 'metafisica',
      color: 'var(--b-metafisica)',
      hex: '#d2a8ff',
      es: 'Metafísica y Ontología',
      en: 'Metaphysics & Ontology',
      questionEs: '¿Cuál es la estructura última de lo real, el ser y la mente?',
      questionEn: 'What is the ultimate structure of reality, being, and mind?',
      descEs: 'Pregunta qué existe realmente por debajo de las apariencias: Ideas eternas, sustancia única, causalidad e historia.',
      descEn: 'Asks what ultimately exists beneath appearances: eternal Forms, single substance, causality, or unfolding history.'
    },
    existencia: {
      id: 'existencia',
      color: 'var(--b-existencia)',
      hex: '#ff8e72',
      es: 'Existencia y Absurdo',
      en: 'Existence & Absurd',
      questionEs: '¿Cómo crear sentido siendo radicalmente libres y mortales?',
      questionEn: 'How do we create meaning while radically free and finite?',
      descEs: 'Sitúa en el centro la experiencia vivida: angustia, elección, nihilismo superado, autenticidad y rebeldía frente al absurdo.',
      descEn: 'Centers lived human experience: anxiety, choice, overcoming nihilism, authenticity, and revolt against the absurd.'
    },
    oriental: {
      id: 'oriental',
      color: 'var(--b-oriental)',
      hex: '#79b8ff',
      es: 'Sabiduría Oriental',
      en: 'Eastern Wisdom',
      questionEs: '¿Cómo alcanzar armonía con el cosmos, la mente y la comunidad?',
      questionEn: 'How can one harmonize mind, effortless action, and community?',
      descEs: 'Reúne grandes tradiciones asiáticas: ética relacional (Confucio), fluidez natural sin forzar (Tao) y liberación del apego (Buda).',
      descEn: 'Unites major Asian traditions: relational ethics (Confucius), effortless natural flow (Dao), and liberation from craving (Buddha).'
    }
  };

  var SCHOOLS = {
    mayeutica: {
      id: 'mayeutica', branch: 'etica',
      es: 'Mayéutica e Intelectualismo', en: 'Maieutics & Moral Intellectualism',
      questionEs: '¿Por qué hacemos el mal y cómo nace la verdad?',
      questionEn: 'Why do people do wrong and how is truth born?',
      thesisEs: 'Nadie obra mal a sabiendas: conocer el bien conduce a practicarlo; la verdad emerge dialogando y refutando falsas certezas.',
      thesisEn: 'No one errs willingly: true knowledge of the good produces virtue; truth emerges through questioning false certainties.',
      rivalEs: 'Relativismo retórico de los Sofistas', rivalEn: 'Rhetorical relativism of the Sophists',
      praxisEs: 'Haz cinco "por qué" antes de defender una opinión heredada como dogma.',
      praxisEn: 'Ask "why" relentlessly before defending any inherited opinion as dogma.'
    },
    idealismo_platonico: {
      id: 'idealismo_platonico', branch: 'metafisica',
      es: 'Idealismo Platónico', en: 'Platonic Idealism',
      questionEs: '¿Son los sentidos suficientes para conocer lo verdadero?',
      questionEn: 'Are the senses enough to grasp eternal truth?',
      thesisEs: 'El mundo físico cambia sin cesar y solo ofrece sombras; el conocimiento real capta las Formas o Ideas eternas con la razón.',
      thesisEn: 'The physical world constantly shifts and yields mere shadows; true knowledge grasps unchanging Forms via reason.',
      rivalEs: 'Materialismo sensorial', rivalEn: 'Sensory materialism',
      praxisEs: 'Distingue entre popularidad inmediata (opinión / doxa) y principios duraderos (episteme).',
      praxisEn: 'Distinguish fleeting opinion (doxa) from tested, durable principles (episteme).'
    },
    aristotelismo: {
      id: 'aristotelismo', branch: 'etica',
      es: 'Aristotelismo y Ética de la Virtud', en: 'Aristotelianism & Virtue Ethics',
      questionEs: '¿Cómo se alcanza el florecimiento humano (eudaimonía)?',
      questionEn: 'How is human flourishing (eudaimonia) achieved?',
      thesisEs: 'Las esencias habitan en las cosas concretas; la virtud es un hábito racional que busca el justo medio entre el exceso y el defecto.',
      thesisEn: 'Forms inhabit concrete things; virtue is a cultivated habit choosing the Golden Mean between excess and deficiency.',
      rivalEs: 'Dualismo separado / utilitarismo de cálculo puro', rivalEn: 'Separated dualism / pure utility calculus',
      praxisEs: 'No busques un acto heroico aislado: diseña hábitos diarios en el término medio (coraje entre cobardía y temeridad).',
      praxisEn: 'Build daily habits at the Golden Mean (courage between cowardice and recklessness).'
    },
    epicureismo: {
      id: 'epicureismo', branch: 'etica',
      es: 'Epicureísmo y Hedonismo Racional', en: 'Epicureanism & Rational Hedonism',
      questionEs: '¿Qué placeres producen una vida verdaderamente serena?',
      questionEn: 'Which pleasures yield a genuinely tranquil life?',
      thesisEs: 'El fin de la vida es la ausencia de dolor físico (aponía) y de turbación mental (ataraxia) mediante amistad, mesura y eliminación del miedo a la muerte.',
      thesisEn: 'The aim of life is freedom from bodily pain (aponia) and mental anxiety (ataraxia) through friendship, simplicity, and losing fear of death.',
      rivalEs: 'Consumo ilimitado y ambición política ansiosa', rivalEn: 'Boundless luxury and anxious political ambition',
      praxisEs: 'Separa deseos naturales y necesarios (agua, amistad, reflexión) de deseos vanos que esclavizan.',
      praxisEn: 'Separate natural, necessary desires (friendship, thought) from vain status cravings.'
    },
    estoicismo: {
      id: 'estoicismo', branch: 'etica',
      es: 'Estoicismo', en: 'Stoicism',
      questionEs: '¿Cómo conservar la paz interior frente al caos externo?',
      questionEn: 'How do we keep inner peace amid external chaos?',
      thesisEs: 'La virtud es el único bien auténtico; debemos distinguir lo que depende de nosotros (juicios, carácter) de lo ajeno (fortuna, fama, enfermedad).',
      thesisEn: 'Virtue is the sole true good; divide all events into what is up to us (judgments, choices) and what is not (fortune, reputation).',
      rivalEs: 'Pasividad fatalista o dramatización emocional', rivalEn: 'Helpless fatalism or emotional catastrophizing',
      praxisEs: 'Ante un contratiempo, pregúntate de inmediato: "¿qué parte de esto está bajo mi control ahora?".',
      praxisEn: 'When trouble hits, ask immediately: "What part of this lies within my control right now?".'
    },
    realismo_politico: {
      id: 'realismo_politico', branch: 'politica',
      es: 'Realismo Político', en: 'Political Realism',
      questionEs: '¿Se gobierna según la moral ideal o según cómo actúan las personas?',
      questionEn: 'Is politics governed by moral ideals or how people actually behave?',
      thesisEs: 'La política tiene lógica autónoma orientada a la estabilidad del Estado; el gobernante eficaz combina astucia (zorro) y firmeza (león) ante la fortuna.',
      thesisEn: 'Politics follows its own logic of state stability; an effective leader blends fox-like foresight and lion-like resolve against fortune.',
      rivalEs: 'Utopismo moralista ingenuo', rivalEn: 'Naive moralistic utopianism',
      praxisEs: 'Analiza incentivos y correlaciones reales de poder antes que buenas intenciones declaradas.',
      praxisEn: 'Inspect real incentives and power balances rather than taking stated good intentions at face value.'
    },
    racionalismo: {
      id: 'racionalismo', branch: 'epistemologia',
      es: 'Racionalismo Continental', en: 'Continental Rationalism',
      questionEs: '¿Qué fundamento indudable sostiene todo saber científico?',
      questionEn: 'What indubitable foundation supports all scientific knowledge?',
      thesisEs: 'Los sentidos engañan; solo la razón deductiva a partir de ideas claras y distintas (como el "Pienso, luego existo") garantiza verdades necesarias.',
      thesisEn: 'The senses can deceive; deductive reason starting from clear, distinct ideas ("I think, therefore I am") yields necessary truth.',
      rivalEs: 'Empirismo radical', rivalEn: 'Radical Empiricism',
      praxisEs: 'Aplica duda metódica y divide cada problema complejo en partes simples verificables antes de afirmar.',
      praxisEn: 'Apply methodical doubt and split complex problems into simple, clear components.'
    },
    empirismo: {
      id: 'empirismo', branch: 'epistemologia',
      es: 'Empirismo Británico', en: 'British Empiricism',
      questionEs: '¿Existen ideas innatas o todo entra por la experiencia?',
      questionEn: 'Do innate ideas exist, or does all knowledge enter through experience?',
      thesisEs: 'La mente nace como hoja en blanco (tabula rasa); nuestras ideas derivan de impresiones sensibles y hasta la "causalidad" es un hábito mental.',
      thesisEn: 'Mind begins as a blank slate (tabula rasa); ideas trace back to sensory impressions, and even causation rests on mental habit.',
      rivalEs: 'Innatismo racionalista y dogmatismo metafísico', rivalEn: 'Rationalist innatism and dogmatic metaphysics',
      praxisEs: 'Exige evidencia observable y recuerda que "siempre ocurrió A antes de B" no prueba necesidad lógica eterna.',
      praxisEn: 'Demand observable evidence and remember that "A always preceded B" is habit, not logical proof.'
    },
    criticismo: {
      id: 'criticismo', branch: 'epistemologia',
      es: 'Idealismo Trascendental (Criticismo)', en: 'Transcendental Idealism',
      questionEs: '¿Cómo ordena nuestra propia mente lo que percibimos del mundo?',
      questionEn: 'How does our own mind structure everything we experience?',
      thesisEs: 'Sintetiza empirismo y racionalismo: el conocimiento empieza en la experiencia, pero el sujeto moldea los datos mediante espacio, tiempo y categorías; en ética rige el deber universal.',
      thesisEn: 'Bridges empiricism and rationalism: experience supplies content, but mind shapes it via space, time, and categories; ethics obeys universal duty.',
      rivalEs: 'Escepticismo absoluto / Consecuencialismo utilitario', rivalEn: 'Total skepticism / Utilitarian consequentialism',
      praxisEs: 'Antes de actuar, prueba tu regla personal con la pregunta: "¿sería sostenible si todo el mundo hiciera esto?".',
      praxisEn: 'Before acting, test your maxim: "Would the world remain coherent if everyone acted like this?".'
    },
    dialectica_materialismo: {
      id: 'dialectica_materialismo', branch: 'politica',
      es: 'Dialéctica e Historia Material', en: 'Dialectics & Historical Materialism',
      questionEs: '¿Por qué cambian las sociedades, las ideas y la historia?',
      questionEn: 'Why do societies, ideas, and human history transform?',
      thesisEs: 'La realidad histórica avanza mediante contradicciones y superaciones dialécticas; para el materialismo histórico, las condiciones materiales de trabajo moldean conciencia e instituciones.',
      thesisEn: 'History advances via contradictions and syntheses; for historical materialism, concrete work relations shape institutions and consciousness.',
      rivalEs: 'Esencialismo ahistórico e individualismo abstracto', rivalEn: 'Ahistorical essentialism and abstract individualism',
      praxisEs: 'Para entender una idea o conflicto actual, examina qué condiciones materiales y económicas la produjeron.',
      praxisEn: 'To understand any current belief or conflict, examine the material conditions that shaped it.'
    },
    vitalismo_pesimismo: {
      id: 'vitalismo_pesimismo', branch: 'existencia',
      es: 'Pesimismo y Vitalismo Trágico', en: 'Philosophical Pessimism & Vitalism',
      questionEs: '¿Qué fuerza irracional nos mueve debajo de la razón?',
      questionEn: 'What non-rational force drives us beneath conscious reason?',
      thesisEs: 'Detrás de la razón consciente late una Voluntad ciega o fuerza vital. Mientras Schopenhauer propone negarla con arte y compasión, Nietzsche llama a afirmarla creando valores propios.',
      thesisEn: 'Beneath reason pulses a blind Will or life-force. Schopenhauer counsels quiet compassion and art; Nietzsche demands life-affirmation and new values.',
      rivalEs: 'Racionalismo optimista e igualitarismo gregarista', rivalEn: 'Optimistic rationalism and herd conformity',
      praxisEs: 'Vive de modo que desearías repetir exactamente tu decisión infinitas veces (Amor fati).',
      praxisEn: 'Act in such a way that you would gladly relive this exact choice forever (Amor fati).'
    },
    existencialismo: {
      id: 'existencialismo', branch: 'existencia',
      es: 'Existencialismo y Absurdo', en: 'Existentialism & Absurdism',
      questionEs: '¿Nacemos con un propósito o debemos inventarnos libremente?',
      questionEn: 'Are we born with a fixed essence, or must we invent ourselves?',
      thesisEs: 'La existencia precede a la esencia: no hay naturaleza humana prefijada que nos excuse; estamos condenados a elegirnos en situación ante el vértigo de la libertad y el absurdo.',
      thesisEn: 'Existence precedes essence: no prewritten nature excuses us; we are condemned to define ourselves amid freedom, situation, and the absurd.',
      rivalEs: 'Determinismo esencialista y "mala fe" conformista', rivalEn: 'Essentialist determinism and conformist "bad faith"' ,
      praxisEs: 'Deja de decir "yo soy así y no puedo cambiar"; identifica tu elección actual como compromiso libre.',
      praxisEn: 'Stop hiding behind "that is just how I am"; take ownership of your present choice.'
    },
    analitica_ciencia: {
      id: 'analitica_ciencia', branch: 'epistemologia',
      es: 'Giro Lingüístico y Falsacionismo', en: 'Linguistic Turn & Falsificationism',
      questionEs: '¿Cuántos pseudoproblemas vienen del lenguaje y qué es ciencia?',
      questionEn: 'How many puzzles stem from language misuse, and what marks true science?',
      thesisEs: 'Muchos enigmas filosóficos nacen de enredos en los "juegos de lenguaje"; a su vez, la ciencia progresa formulando hipótesis arriesgadas y falsables, no acumulando confirmaciones.',
      thesisEn: 'Many philosophical knots arise from confused "language-games"; science advances through bold falsifiable conjectures rather than piling up confirmations.',
      rivalEs: 'Metafísica especulativa oscura y pseudociencia infalsable', rivalEn: 'Obscure speculative metaphysics and unfalsifiable dogma',
      praxisEs: 'Para probar una teoría seria, pregúntate qué evidencia concreta bastaría para refutarla.',
      praxisEn: 'To test any serious claim, ask what concrete evidence would suffice to prove it wrong.'
    },
    sabiduria_oriental: {
      id: 'sabiduria_oriental', branch: 'oriental',
      es: 'Confucionismo, Taoísmo y Budismo', en: 'Confucianism, Daoism & Buddhism',
      questionEs: '¿Armonía cívica, flujo sin esfuerzo o despertar del apego?',
      questionEn: 'Civic harmony, effortless flow, or awakening from attachment?',
      thesisEs: 'Tres caminos complementarios: rectitud relacional y educación moral (Confucio), acción natural sin fricción o wu-wei (Lao-Tsé), y comprensión de la impermanencia para cesar el sufrimiento (Buda).',
      thesisEn: 'Three major paths: relational virtue and civic care (Confucius), effortless natural flow / wu-wei (Laozi), and insight into impermanence (Buddha).',
      rivalEs: 'Individualismo rígido e ilusión de permanencia fija', rivalEn: 'Rigid ego-centrism and clinging to fixed permanence',
      praxisEs: 'No confundas intensidad con eficacia: practica presencia, cuidado relacional y acción oportuna sin forzar.',
      praxisEn: 'Do not confuse forcing with effectiveness: practice mindful presence and timely, harmonious action.'
    }
  };

  var STUDY_BLOCKS = [
    {
      id: 'all',
      es: 'Atlas completo',
      en: 'Complete atlas',
      ids: null
    },
    {
      id: 'antigua',
      es: 'Antigüedad clásica',
      en: 'Classical Antiquity',
      ids: ['socrates', 'platon', 'aristoteles', 'epicuro', 'seneca', 'marco_aurelio']
    },
    {
      id: 'moderna',
      es: 'Modernidad e Ilustración',
      en: 'Modernity & Enlightenment',
      ids: ['maquiavelo', 'descartes', 'spinoza', 'locke', 'hume', 'kant']
    },
    {
      id: 'sigloxix',
      es: 'Siglo XIX y giro crítico',
      en: '19th Century & Critical Turn',
      ids: ['hegel', 'schopenhauer', 'kierkegaard', 'marx', 'nietzsche']
    },
    {
      id: 'contemp',
      es: 'Siglo XX y Oriente',
      en: '20th Century & Eastern Wisdom',
      ids: ['wittgenstein', 'popper', 'sartre', 'beauvoir', 'camus', 'confucio', 'laotse_buda']
    }
  ];

  // Connected genealogical influence & critique edges on the philosophical map
  var EDGES = [
    { from: 'socrates', to: 'platon', kind: 'influence' },
    { from: 'platon', to: 'aristoteles', kind: 'critique' },
    { from: 'socrates', to: 'seneca', kind: 'influence' },
    { from: 'seneca', to: 'marco_aurelio', kind: 'influence' },
    { from: 'aristoteles', to: 'maquiavelo', kind: 'critique' },
    { from: 'descartes', to: 'spinoza', kind: 'influence' },
    { from: 'descartes', to: 'locke', kind: 'critique' },
    { from: 'locke', to: 'hume', kind: 'influence' },
    { from: 'hume', to: 'kant', kind: 'influence' },
    { from: 'descartes', to: 'kant', kind: 'critique' },
    { from: 'kant', to: 'hegel', kind: 'influence' },
    { from: 'kant', to: 'schopenhauer', kind: 'influence' },
    { from: 'hegel', to: 'marx', kind: 'critique' },
    { from: 'hegel', to: 'kierkegaard', kind: 'critique' },
    { from: 'schopenhauer', to: 'nietzsche', kind: 'critique' },
    { from: 'kierkegaard', to: 'sartre', kind: 'influence' },
    { from: 'nietzsche', to: 'sartre', kind: 'influence' },
    { from: 'sartre', to: 'beauvoir', kind: 'influence' },
    { from: 'nietzsche', to: 'camus', kind: 'influence' },
    { from: 'hume', to: 'popper', kind: 'influence' },
    { from: 'confucio', to: 'laotse_buda', kind: 'critique' }
  ];

  var THINKERS = [
    {
      id: 'socrates', block: 'antigua', branch: 'etica', school: 'mayeutica',
      eraShort: '470 a.C.', dates: '470–399 a.C.', cityEs: 'Atenas', cityEn: 'Athens',
      mx: 92, my: 136,
      photoCredit: 'Retrato de Sócrates · Museo del Louvre (Wikimedia Commons)',
      es: 'Sócrates', en: 'Socrates',
      thesisEs: 'La verdadera sabiduría comienza reconociendo la propia ignorancia ("solo sé que no sé nada"); nadie hace el mal sabiendo qué es el bien.',
      thesisEn: 'True wisdom begins by recognizing one’s own ignorance ("I know that I know nothing"); no one harms knowingly once they truly know the good.',
      conceptsEs: [
        { k: 'Mayéutica', d: 'Dar a luz ideas mediante preguntas.' },
        { k: 'Intelectualismo', d: 'Conocer el bien lleva a obrar bien.' },
        { k: 'Ironía socrática', d: 'Desmontar dogmas fingiendo no saber.' }
      ],
      conceptsEn: [
        { k: 'Maieutics', d: 'Drawing truth out via questioning.' },
        { k: 'Moral Intellectualism', d: 'Knowledge produces virtue.' },
        { k: 'Socratic Irony', d: 'Exposing false certainty via inquiry.' }
      ],
      paradoxTitleEs: 'El tábano de Atenas y la cicuta', paradoxTitleEn: 'The Gadfly of Athens & Hemlock',
      paradoxEs: 'Rechazó huir de prisión en Atenas porque prefería morir injustamente antes que traicionar la coherencia moral con las leyes del diálogo.',
      paradoxEn: 'Refused to escape Athenian prison, preferring unjust death over breaking moral consistency and civic duty.',
      dilemmaCaseEs: 'Un experto seguro de sí mismo afirma qué es "la justicia" en una plaza pública, pero tres preguntas bien dirigidas demuestran que se contradice.',
      dilemmaCaseEn: 'A confident expert defines "justice" publicly, yet three careful follow-up questions expose his own self-contradiction.',
      debateEs: 'Contra los Sofistas, que vendían retórica para persuadir sin importar la verdad.',
      debateEn: 'Against the Sophists, who taught persuasive rhetoric regardless of objective truth.',
      workEs: 'Sin obra escrita (recogido en Diálogos de Platón)', workEn: 'Wrote nothing (preserved in Plato’s Dialogues)',
      quoteEs: '«Una vida sin examen no merece ser vivida.»', quoteEn: '“An unexamined life is not worth living.”',
      schema: {
        kind: 'cycle',
        titleEs: 'Método Socrático', titleEn: 'Socratic Method',
        stepsEs: ['1. Opinión segura', '2. Pregunta e Ironía', '3. Aporía (duda)', '4. Definición clara'],
        stepsEn: ['1. Confident opinion', '2. Irony & Questions', '3. Aporia (humility)', '4. Clearer truth']
      }
    },
    {
      id: 'platon', block: 'antigua', branch: 'metafisica', school: 'idealismo_platonico',
      eraShort: '427 a.C.', dates: '427–347 a.C.', cityEs: 'Atenas (Academia)', cityEn: 'Athens (Academy)',
      mx: 158, my: 58,
      photoCredit: 'Busto de Platón · Museos Capitolinos (Wikimedia Commons)',
      es: 'Platón', en: 'Plato',
      thesisEs: 'La realidad se divide entre el Mundo Sensible (copias cambiantes) y el Mundo Inteligible de las Ideas eternas, presidido por la Idea del Bien.',
      thesisEn: 'Reality splits into the mutable Sensible World of appearances and the eternal Intelligible Realm of Forms ruled by the Form of the Good.',
      conceptsEs: [
        { k: 'Mundo de las Ideas', d: 'Modelos perfectos e inmutables.' },
        { k: 'Anamnesis', d: 'Conocer es recordar esencias.' },
        { k: 'Rey filósofo', d: 'Gobierno guiado por la razón, no demagogia.' }
      ],
      conceptsEn: [
        { k: 'World of Forms', d: 'Perfect, unchanging archetypes.' },
        { k: 'Anamnesis', d: 'Learning as rational recollection.' },
        { k: 'Philosopher-King', d: 'Rule guided by wisdom, not mob flattery.' }
      ],
      paradoxTitleEs: 'Alegoría de la Caverna', paradoxTitleEn: 'Allegory of the Cave',
      paradoxEs: 'Prisioneros atados desde niños confunden sombras proyectadas en un muro con la realidad real y ridiculizan a quien regresa de ver el Sol exterior.',
      paradoxEn: 'Lifetime prisoners mistake wall shadows for reality and mock the freed companion who returns from the sunlight outside.',
      dilemmaCaseEs: 'Vives atrapado mirando pantallas que proyectan sombras de objetos reales y crees que esas proyecciones son todo cuanto existe.',
      dilemmaCaseEn: 'People raised watching projected shadows mistake them for real objects and reject anyone describing the sun outside.',
      debateEs: 'Combate el relativismo sofista ("el hombre es medida de todo") fundando verdades matemáticas y morales eternas.',
      debateEn: 'Answers sophistic relativism by anchoring immutable mathematical and moral truth in intelligible Forms.',
      workEs: 'La República · Fedón · El Banquete', workEn: 'The Republic · Phaedo · Symposium',
      quoteEs: '«El alma que contempla la Idea del Bien deja atrás la sombra.»', quoteEn: '“Philosophy is the ascent from shadow toward the light of Truth.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Dualismo Ontológico', titleEn: 'Two-World Dualism',
        topEs: 'MUNDO INTELIGIBLE', topSubEs: 'Ideas eternas · Ciencia (Episteme)',
        topEn: 'INTELLIGIBLE REALM', topSubEn: 'Eternal Forms · Knowledge (Episteme)',
        botEs: 'MUNDO SENSIBLE', botSubEs: 'Sombras cambiantes · Opinión (Doxa)',
        botEn: 'SENSIBLE WORLD', botSubEn: 'Changing copies · Opinion (Doxa)'
      }
    },
    {
      id: 'aristoteles', block: 'antigua', branch: 'etica', school: 'aristotelismo',
      eraShort: '384 a.C.', dates: '384–322 a.C.', cityEs: 'Estagira / Atenas (Liceo)', cityEn: 'Stagira / Athens (Lyceum)',
      mx: 222, my: 136,
      photoCredit: 'Busto de Aristóteles · Palazzo Altemps, Roma (Wikimedia Commons)',
      es: 'Aristóteles', en: 'Aristotle',
      thesisEs: 'No hay otro mundo separado: las formas habitan en la naturaleza concreta, y la felicidad (eudaimonía) consiste en cultivar hábitos virtuosos en el justo medio.',
      thesisEn: 'Forms reside within concrete things, not in a separate heaven; flourishing (eudaimonia) grows by practicing virtue at the Golden Mean.',
      conceptsEs: [
        { k: 'Justo medio', d: 'Virtud equilibrada entre exceso y defecto.' },
        { k: 'Hilemorfismo', d: 'Materia + Forma unidas en cada ser.' },
        { k: 'Zoon politikon', d: 'El humano florece en la polis justa.' }
      ],
      conceptsEn: [
        { k: 'Golden Mean', d: 'Virtue balanced between excess and defect.' },
        { k: 'Hylomorphism', d: 'Matter and Form united in every thing.' },
        { k: 'Political Animal', d: 'Humans flourish inside civic community.' }
      ],
      paradoxTitleEs: 'Las Cuatro Causas y el Motor Inmóvil', paradoxTitleEn: 'Four Causes & Unmoved Mover',
      paradoxEs: 'Para explicar una escultura o un árbol no basta saber de qué está hecho: hay que conocer materia, forma, agente y finalidad (telos).',
      paradoxEn: 'To understand any real object—a statue or an oak—you need four explanations: material, formal, efficient, and final purpose (telos).',
      dilemmaCaseEs: 'Evitar tanto la cobardía paralizante como la temeridad suicida entrenando día a día la valentía prudente como hábito.',
      dilemmaCaseEn: 'Rejecting both paralyzing cowardice and reckless bravado by cultivating prudent courage as a daily habit.',
      debateEs: 'Corrige el idealismo de su maestro Platón trayendo las esencias desde el cielo abstracto a la biología, lógica y política terrestre.',
      debateEn: 'Critiques his teacher Plato’s transcendent Forms, grounding logic, biology, and ethics in concrete reality.',
      workEs: 'Ética a Nicómaco · Política · Metafísica', workEn: 'Nicomachean Ethics · Politics · Metaphysics',
      quoteEs: '«Somos lo que hacemos repetidamente; la excelencia no es un acto, sino un hábito.»', quoteEn: '“Excellence is not a single act, but a cultivated habit.”',
      schema: {
        kind: 'spectrum',
        titleEs: 'Ética del Justo Medio', titleEn: 'Ethics of the Golden Mean',
        leftEs: 'Defecto', leftSubEs: 'Cobardía / Avaricia',
        leftEn: 'Deficiency', leftSubEn: 'Cowardice / Stinginess',
        midEs: 'VIRTUD', midSubEs: 'Justo Medio (Phronesis)',
        midEn: 'VIRTUE', midSubEn: 'Golden Mean (Phronesis)',
        rightEs: 'Exceso', rightSubEs: 'Temeridad / Derroche',
        rightEn: 'Excess', rightSubEn: 'Rashness / Extravagance'
      }
    },
    {
      id: 'epicuro', block: 'antigua', branch: 'etica', school: 'epicureismo',
      eraShort: '341 a.C.', dates: '341–270 a.C.', cityEs: 'Samos / Atenas (El Jardín)', cityEn: 'Samos / Athens (The Garden)',
      mx: 274, my: 214,
      photoCredit: 'Busto de Epicuro · Museo Británico (Wikimedia Commons)',
      es: 'Epicuro', en: 'Epicurus',
      thesisEs: 'La buena vida busca la serenidad tranquila (ataraxia) eligiendo placeres sencillos, cultivando la amistad y liberándose del miedo vano a dioses y muerte.',
      thesisEn: 'The good life attains serene peace (ataraxia) through simple pleasures, deep friendship, and shedding fears of gods and death.',
      conceptsEs: [
        { k: 'Ataraxia', d: 'Imperturbabilidad serena del ánimo.' },
        { k: 'Tetrafármaco', d: 'Cuatro remedios contra miedos humanos.' },
        { k: 'Atomismo', d: 'Todo es materia y vacío con azar (clinamen).' }
      ],
      conceptsEn: [
        { k: 'Ataraxia', d: 'Untroubled tranquility of mind.' },
        { k: 'Tetrapharmakos', d: 'Four-part cure against existential fear.' },
        { k: 'Atomism', d: 'Atoms and void with spontaneous swerve.' }
      ],
      paradoxTitleEs: 'La Paradoja de la Muerte', paradoxTitleEn: 'Symmetry & Death Argument',
      paradoxEs: '«La muerte nada es para nosotros: mientras existimos, ella no está; cuando ella llega, nosotros ya no estamos» para sentir sufrimiento.',
      paradoxEn: '“Death is nothing to us: when we exist, death is absent; when death arrives, we are no longer there” to suffer.',
      dilemmaCaseEs: 'Rechazas una vida frenética persiguiendo lujos que traen deudas e insomnio, prefiriendo pan sencillo y conversación en el jardín con amigos.',
      dilemmaCaseEn: 'Turning down stressful status wealth for simple food, quiet reflection, and loyal friendship in a peaceful garden.',
      debateEs: 'Frente a la angustia religiosa y la rigidez política de las polis agonizantes, ofrece refugio ético privado basado en amistad.',
      debateEn: 'Answers civic instability and superstitious fear by founding an egalitarian philosophical community rooted in friendship.',
      workEs: 'Carta a Meneceo · Máximas Capitales', workEn: 'Letter to Menoeceus · Principal Doctrines',
      quoteEs: '«Nada basta a quien lo suficiente le parece poco.»', quoteEn: '“Nothing is enough for the man to whom enough is too little.”',
      schema: {
        kind: 'triad',
        titleEs: 'El Tetrafármaco', titleEn: 'The Four-Part Cure',
        topEs: 'ATARAXIA',
        leftEs: 'Sin temor a dioses ni muerte',
        rightEs: 'Placeres simples · Amistad',
        topEn: 'ATARAXIA',
        leftEn: 'No fear of gods or death',
        rightEn: 'Simple needs · Friendship'
      }
    },
    {
      id: 'seneca', block: 'antigua', branch: 'etica', school: 'estoicismo',
      eraShort: '4 a.C.', dates: '4 a.C.–65 d.C.', cityEs: 'Córdoba / Roma', cityEn: 'Corduba / Rome',
      mx: 332, my: 214,
      photoCredit: 'Herma doble de Séneca · Altes Museum, Berlín (Wikimedia Commons)',
      es: 'Séneca', en: 'Seneca the Younger',
      thesisEs: 'No es corto el tiempo que tenemos, sino mucho el que perdemos; la filosofía entrena la serenidad frente a la fortuna cambiante, la ira y la prisa.',
      thesisEn: 'It is not that we have a short time to live, but that we waste much of it; philosophy trains resilience against anger, haste, and fickle fortune.',
      conceptsEs: [
        { k: 'Premeditatio malorum', d: 'Anticipar reveses para no quebrar.' },
        { k: 'Dominio de la ira', d: 'Pausar antes que la pasión nuble la razón.' },
        { k: 'Brevedad vital', d: 'Vivir presente sin posponer lo esencial.' }
      ],
      conceptsEn: [
        { k: 'Premeditatio malorum', d: 'Rehearsing adversity calmly ahead of time.' },
        { k: 'Taming Anger', d: 'Delaying reaction before rage clouds reason.' },
        { k: 'Shortness of Life', d: 'Claiming your time back from trivial busyness.' }
      ],
      paradoxTitleEs: 'Sufrimos más en la imaginación', paradoxTitleEn: 'Suffering in Imagination',
      paradoxEs: 'Quien teme catástrofes futuras padece por adelantado dolores que quizá jamás ocurrirán; ensayar la sencillez desarma la ansiedad.',
      paradoxEn: 'Whoever dreads future ruin suffers in advance ills that may never happen; rehearsing voluntary simplicity disarms anxiety.',
      dilemmaCaseEs: 'Alguien se queja de que "no le alcanza la vida", pero pasa horas compitiendo por aplausos vacíos en lugar de cuidar su carácter hoy.',
      dilemmaCaseEn: 'Someone laments having "too little time" while wasting years chasing shallow status instead of living deliberately today.',
      debateEs: 'A diferencia del aislamiento epicúreo del jardín, Séneca defiende actuar con templanza dentro de los deberes públicos de Roma.',
      debateEn: 'Unlike Epicurean withdrawal from politics, urges principled engagement inside public and civic duties.',
      workEs: 'Cartas a Lucilio · Sobre la brevedad de la vida', workEn: 'Letters from a Stoic · On the Shortness of Life',
      quoteEs: '«Sufrimos con más frecuencia en la imaginación que en la realidad.»', quoteEn: '“We suffer more often in imagination than in reality.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Uso del Tiempo', titleEn: 'Mastery of Time',
        topEs: 'VIDA BREVE POR DESCUÍDO', topSubEs: 'Prisa · Ira · Ansiedad por el futuro',
        topEn: 'SQUANDERED TIME', topSubEn: 'Busyness · Anger · Future anxiety',
        botEs: 'VIDA AMPLIA CON FILOSOFÍA', botSubEs: 'Presencia · Templanza · Propósito',
        botEn: 'STILL & VAST LIFE', botSubEn: 'Presence · Temperance · Deliberate use'
      }
    },
    {
      id: 'marco_aurelio', block: 'antigua', branch: 'etica', school: 'estoicismo',
      eraShort: '121 d.C.', dates: '121–180 d.C.', cityEs: 'Roma / Carnunto', cityEn: 'Rome / Carnuntum',
      mx: 382, my: 214,
      photoCredit: 'Busto de Marco Aurelio · Museo Saint-Raymond (Wikimedia Commons)',
      es: 'Marco Aurelio', en: 'Marcus Aurelius',
      thesisEs: 'Incluso con poder imperial absoluto, la libertad reside en la "ciudadela interior": gobernar los propios juicios, aceptar el destino y servir al bien común.',
      thesisEn: 'Even holding supreme imperial power, freedom lives in the "inner citadel": governing one’s judgments, accepting fate, and serving the common good.',
      conceptsEs: [
        { k: 'Ciudadela interior', d: 'Refugio racional invulnerable al ruido externo.' },
        { k: 'Dicotomía del control', d: 'Distinguir juicio propio vs. suceso ajeno.' },
        { k: 'Cosmopolitismo', d: 'Todos colaboramos como miembros del todo.' }
      ],
      conceptsEn: [
        { k: 'Inner Citadel', d: 'Rational sanctuary untouched by chaos.' },
        { k: 'Dichotomy of Control', d: 'Separating inner choice from outer events.' },
        { k: 'Cosmopolitan Duty', d: 'All humans collaborate like limbs of one body.' }
      ],
      paradoxTitleEs: 'El obstáculo es el camino', paradoxTitleEn: 'The Obstacle Becomes the Way',
      paradoxEs: 'Lo que impide una acción avanza la acción misma: el fuego transforma todo obstáculo en llama si sabes convertir la adversidad en práctica de virtud.',
      paradoxEn: 'The impediment to action advances action: like fire turning anything thrown at it into brightness, adversity becomes material for virtue.',
      dilemmaCaseEs: 'Un proyecto fracasa por causas meteorológicas o ajenas. En vez de maldecir la suerte, usas el revés para practicar paciencia, justicia y nuevo plan.',
      dilemmaCaseEn: 'Your plans collapse due to outside disruption; instead of raging, you treat the setback as training in patience and clear action.',
      debateEs: 'Diálogo íntimo consigo mismo (nunca pensado para publicar) aplicando las enseñanzas del exesclavo Epicteto desde el trono imperial.',
      debateEn: 'Private nightly self-dialogue translating former slave Epictetus’s Stoic discipline onto the Roman imperial throne.',
      workEs: 'Meditaciones (A sí mismo)', workEn: 'Meditations',
      quoteEs: '«Tienes poder sobre tu mente, no sobre los acontecimientos externos. Date cuenta y hallarás fuerza.»', quoteEn: '“You have power over your mind—not outside events. Realize this, and you will find strength.”',
      schema: {
        kind: 'triad',
        titleEs: 'Ciudadela Estoica', titleEn: 'Stoic Citadel',
        topEs: 'PAZ INTERIOR',
        leftEs: 'Bajo control: juicio y acto',
        rightEs: 'Fuera de control: amor fati',
        topEn: 'INNER CITADEL',
        leftEn: 'In control: my judgment',
        rightEn: 'External: accept & transform'
      }
    },
    {
      id: 'maquiavelo', block: 'moderna', branch: 'politica', school: 'realismo_politico',
      eraShort: '1469', dates: '1469–1527', cityEs: 'Florencia', cityEn: 'Florence',
      mx: 444, my: 136,
      photoCredit: 'Retrato de Maquiavelo por Santi di Tito · Palazzo Vecchio (Wikimedia Commons)',
      es: 'Maquiavelo', en: 'Machiavelli',
      thesisEs: 'Funda la ciencia política moderna separando la eficacia estatal de los sermones morales ideales: hay que analizar "la verdad efectiva" del poder.',
      thesisEn: 'Founded modern political science by separating state effectiveness from moralistic sermons: study power’s "effectual truth".',
      conceptsEs: [
        { k: 'Virtù', d: 'Audacia y pericia política ante la crisis.' },
        { k: 'Fortuna', d: 'Azar histórico que desborda como un río.' },
        { k: 'Verdad efectiva', d: 'Cómo actúan realmente humanos y estados.' }
      ],
      conceptsEn: [
        { k: 'Virtù', d: 'Political skill and resolve under crisis.' },
        { k: 'Fortuna', d: 'Unpredictable historical chance like a flood.' },
        { k: 'Effectual Truth', d: 'How people actually behave vs. utopias.' }
      ],
      paradoxTitleEs: 'El León y el Zorro', paradoxTitleEn: 'The Lion and the Fox',
      paradoxEs: 'La fuerza bruta del león no detecta trampas, y la astucia del zorro no espanta lobos: la prudencia estatal requiere dominar ambas caras.',
      paradoxEn: 'The lion’s brute force misses traps, and the fox’s cunning cannot fend off wolves: statecraft needs both.',
      dilemmaCaseEs: 'Un gobernante ingenuo aplica normas angelicales en un entorno corrupto sin diques institucionales y termina destruyendo tanto el orden como a los inocentes.',
      dilemmaCaseEn: 'A naive ruler assumes everyone behaves ideally without institutional safeguards, leading both the state and citizens to ruin.',
      debateEs: 'Rompe con los tratados medievales de "espejos de príncipes" y la política teleológica aristotélica.',
      debateEn: 'Breaks sharply with medieval moralizing "mirrors for princes" and Aristotelian teleological politics.',
      workEs: 'El Príncipe · Discursos sobre la primera década de Tito Livio', workEn: 'The Prince · Discourses on Livy',
      quoteEs: '«Es mucho más seguro ser temido que amado, si ha de faltar una de las dos cosas (sin ser odiado).»', quoteEn: '“It is safer to be feared than loved, if one cannot be both—while avoiding hatred.”',
      schema: {
        kind: 'triad',
        titleEs: 'Dinámica del Poder', titleEn: 'Dynamics of Power',
        topEs: 'ESTABILIDAD DEL ESTADO',
        leftEs: 'Virtù (Zorro + León)',
        rightEs: 'Fortuna (Diques ante azar)',
        topEn: 'STATE STABILITY',
        leftEn: 'Virtù (Fox + Lion)',
        rightEn: 'Fortuna (Flood containment)'
      }
    },
    {
      id: 'descartes', block: 'moderna', branch: 'epistemologia', school: 'racionalismo',
      eraShort: '1596', dates: '1596–1650', cityEs: 'La Haye / Ámsterdam', cityEn: 'La Haye / Amsterdam',
      mx: 486, my: 58,
      photoCredit: 'Retrato de René Descartes por Frans Hals · Louvre (Wikimedia Commons)',
      es: 'Descartes', en: 'Descartes',
      thesisEs: 'Dudar metódicamente de sentidos, sueños y dogmas deja en pie una sola certeza invencible: "Pienso, luego existo" (Cogito ergo sum).',
      thesisEn: 'Methodically doubting senses, dreams, and tradition leaves one unshakable truth: "I think, therefore I am" (Cogito ergo sum).',
      conceptsEs: [
        { k: 'Duda metódica', d: 'Dudar de todo lo dudable hasta tocar roca firme.' },
        { k: 'Cogito ergo sum', d: 'El acto de dudar prueba que el sujeto piensa.' },
        { k: 'Dualismo', d: 'Res cogitans (mente) y Res extensa (materia).' }
      ],
      conceptsEn: [
        { k: 'Methodical Doubt', d: 'Reject anything doubtable to reach bedrock.' },
        { k: 'Cogito ergo sum', d: 'The very act of doubting proves a thinker exists.' },
        { k: 'Substance Dualism', d: 'Thinking mind (res cogitans) vs. extended body.' }
      ],
      paradoxTitleEs: 'El Genio Maligno', paradoxTitleEn: 'The Evil Demon',
      paradoxEs: 'Imagina un genio todopoderoso que falsifica el cielo, tu cuerpo y hasta 2+3=5. Aun engañado, no puede hacer que no existas mientras piensas que dudas.',
      paradoxEn: 'Imagine a powerful deceiver falsifying sky, body, and even math. Even if deceived, it cannot make you cease existing while you doubt.',
      dilemmaCaseEs: '¿Cómo sabes con certeza absoluta que en este instante no estás soñando dentro de una simulación perfecta?',
      dilemmaCaseEn: 'How can you be 100% certain right now that everything you see is not an elaborate dream or simulation?',
      debateEs: 'Inaugura la filosofía moderna desplazando la autoridad escolástica hacia la razón autónoma del sujeto y la geometría analítica.',
      debateEn: 'Launches modern philosophy by shifting authority from medieval dogma to autonomous mathematical reason.',
      workEs: 'Discurso del método · Meditaciones metafísicas', workEn: 'Discourse on the Method · Meditations',
      quoteEs: '«Pienso, luego existo (Cogito, ergo sum).»', quoteEn: '“I think, therefore I am (Cogito, ergo sum).”',
      schema: {
        kind: 'cycle',
        titleEs: 'Método Cartesiano', titleEn: 'Cartesian Method',
        stepsEs: ['1. Duda universal', '2. Genio Maligno', '3. ¡Dudo = Existo!', '4. Ideas claras'],
        stepsEn: ['1. Universal doubt', '2. Evil Demon', '3. Doubt = Exist!', '4. Clear Deduction']
      }
    },
    {
      id: 'spinoza', block: 'moderna', branch: 'metafisica', school: 'racionalismo',
      eraShort: '1632', dates: '1632–1677', cityEs: 'Ámsterdam / La Haya', cityEn: 'Amsterdam / The Hague',
      mx: 540, my: 58,
      photoCredit: 'Retrato de Baruch Spinoza (Wikimedia Commons)',
      es: 'Spinoza', en: 'Spinoza',
      thesisEs: 'Dios y la Naturaleza son una sola Sustancia infinita (Deus sive Natura); cuerpo y mente son dos modos de lo mismo y la libertad nace de comprender las causas.',
      thesisEn: 'God and Nature are one infinite Substance (Deus sive Natura); mind and body are attributes of the same reality, and freedom grows through understanding causes.',
      conceptsEs: [
        { k: 'Deus sive Natura', d: 'Monismo panteísta: Dios es la Naturaleza.' },
        { k: 'Conatus', d: 'Esfuerzo de cada ser por perseverar.' },
        { k: 'Ética geométrica', d: 'Pasiones analizadas como teoremas claros.' }
      ],
      conceptsEn: [
        { k: 'Deus sive Natura', d: 'God or Nature: one single infinite Substance.' },
        { k: 'Conatus', d: 'Every being’s drive to persevere in existing.' },
        { k: 'Geometric Ethics', d: 'Passions studied objectively like geometry.' }
      ],
      paradoxTitleEs: 'La piedra consciente en el aire', paradoxTitleEn: 'The Conscious Falling Stone',
      paradoxEs: 'Si una piedra lanzada al aire pensara, creería que vuela "libremente" hacia abajo porque ignora el impulso de la mano que la lanzó.',
      paradoxEn: 'If a thrown stone became conscious mid-air, it would believe it flies by "free will" merely because it ignores the hand that threw it.',
      dilemmaCaseEs: 'Creemos que decidimos "sin ninguna causa" mientras ignoramos los deseos, hábitos y condiciones que realmente moldean cada impulso.',
      dilemmaCaseEn: 'We fancy ourselves uncaused free agents simply because we ignore the deep causes shaping our desires.',
      debateEs: 'Rechaza el dualismo mente-cuerpo de Descartes y las supersticiones antropomórficas de un Dios caprichoso fuera del mundo.',
      debateEn: 'Refutes Descartes’s mind-body split and rejects an anthropomorphic God acting arbitrarily outside Nature.',
      workEs: 'Ética demostrada según el orden geométrico · Tratado teológico-político', workEn: 'Ethics · Theological-Political Treatise',
      quoteEs: '«No reír, no llorar, no detestar, sino comprender.»', quoteEn: '“Not to laugh, not to lament, not to detest, but to understand.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Monismo de Sustancia', titleEn: 'Substance Monism',
        topEs: 'UNA ÚNICA SUSTANCIA', topSubEs: 'Deus sive Natura · Orden causal necesario',
        topEn: 'ONE INFINITE SUBSTANCE', topSubEn: 'Deus sive Natura · Necessary causal order',
        botEs: 'MODOS Y ATRIBUTOS', botSubEs: 'Pensamiento (mente) = Extensión (cuerpo)',
        botEn: 'MODES & ATTRIBUTES', botSubEn: 'Thought (mind) = Extension (body)'
      }
    },
    {
      id: 'locke', block: 'moderna', branch: 'politica', school: 'empirismo',
      eraShort: '1632', dates: '1632–1704', cityEs: 'Wrington / Oxford', cityEn: 'Wrington / Oxford',
      mx: 562, my: 136,
      photoCredit: 'Retrato de John Locke por Godfrey Kneller · Hermitage (Wikimedia Commons)',
      es: 'John Locke', en: 'John Locke',
      thesisEs: 'La mente nace como una hoja en blanco (tabula rasa) escrita por la experiencia; en política, los individuos poseen derechos naturales previos al Estado y pueden revocar gobiernos injustos.',
      thesisEn: 'The mind begins as a blank slate (tabula rasa) filled by experience; politically, citizens hold natural rights prior to the state and may dissolve tyrannical rule.',
      conceptsEs: [
        { k: 'Tabula rasa', d: 'Sin ideas innatas; todo saber viene de experiencia.' },
        { k: 'Derechos naturales', d: 'Vida, libertad y propiedad inalienables.' },
        { k: 'Tolerancia y consenso', d: 'División de poderes y contrato revocable.' }
      ],
      conceptsEn: [
        { k: 'Tabula Rasa', d: 'No innate ideas; mind is shaped by experience.' },
        { k: 'Natural Rights', d: 'Inalienable life, liberty, and property.' },
        { k: 'Consent of Governed', d: 'Limited power and separation of powers.' }
      ],
      paradoxTitleEs: 'El Príncipe y el Zapatero', paradoxTitleEn: 'The Prince & the Cobbler',
      paradoxEs: 'Si la conciencia de un príncipe despertara en el cuerpo de un zapatero con todos los recuerdos del príncipe, su identidad personal seguiría a la memoria, no al cuerpo.',
      paradoxEn: 'If a prince’s memories and consciousness entered a cobbler’s body, personal identity would follow continuous memory rather than bodily substance.',
      dilemmaCaseEs: '¿Qué te hace ser "la misma persona" que hace diez años si casi todas tus células cambiaron: el cuerpo biológico o la continuidad de tu memoria?',
      dilemmaCaseEn: 'What makes you the same person you were ten years ago after bodily turnover: physical tissue or unbroken psychological memory?',
      debateEs: 'Refuta las "ideas innatas" de Descartes y el absolutismo monárquico de Hobbes/Filmer, inspirando el constitucionalismo moderno.',
      debateEn: 'Counters Descartes’s innate ideas and absolute monarchy, laying foundations for constitutional democracy.',
      workEs: 'Ensayo sobre el entendimiento humano · Segundo tratado sobre el gobierno civil', workEn: 'Essay Concerning Human Understanding · Two Treatises of Government',
      quoteEs: '«Donde no hay ley, no hay libertad.»', quoteEn: '“Where there is no law, there is no freedom.”',
      schema: {
        kind: 'triad',
        titleEs: 'Contrato Liberal', titleEn: 'Liberal Social Contract',
        topEs: 'PODER POR CONSENTIMIENTO',
        leftEs: 'Vida · Libertad · Propiedad',
        rightEs: 'Derecho a revocar tiranía',
        topEn: 'RULE BY CONSENT',
        leftEn: 'Life · Liberty · Property',
        rightEn: 'Right to check tyranny'
      }
    },
    {
      id: 'hume', block: 'moderna', branch: 'epistemologia', school: 'empirismo',
      eraShort: '1711', dates: '1711–1776', cityEs: 'Edimburgo', cityEn: 'Edinburgh',
      mx: 616, my: 214,
      photoCredit: 'Retrato de David Hume por Allan Ramsay (Wikimedia Commons)',
      es: 'David Hume', en: 'David Hume',
      thesisEs: 'Lleva el empirismo al límite: no observamos una "conexión causal necesaria" ni un "yo" permanente, solo sucesiones habituales de impresiones; la razón sirve a las pasiones.',
      thesisEn: 'Pushes empiricism to its limit: we never observe "necessary causation" or a fixed "self", only habitual sequences of impressions; reason is slave to the passions.',
      conceptsEs: [
        { k: 'Problema de la inducción', d: 'El pasado no prueba lógicamente el futuro.' },
        { k: 'Guillotina de Hume', d: 'De "lo que es" no se deduce "lo que debe ser".' },
        { k: 'Yo como haz', d: 'Somos un flujo continuo de percepciones.' }
      ],
      conceptsEn: [
        { k: 'Problem of Induction', d: 'Past repetition does not logically guarantee tomorrow.' },
        { k: 'Is–Ought Gap', d: 'Moral "ought" cannot follow purely from factual "is".' },
        { k: 'Bundle Theory', d: 'No fixed soul—just a fast stream of perceptions.' }
      ],
      paradoxTitleEs: 'Las Bolas de Billar y la Causalidad', paradoxTitleEn: 'Billiard Balls & Causation',
      paradoxEs: 'Vemos la bola A golpear a B y luego moverse B; pero jamás "vemos" ninguna fuerza invisible necesaria, solo conjunción constante que crea expectativa.',
      paradoxEn: 'We see cue ball A strike B and then B move, yet never actually perceive hidden "necessary force"—only constant conjunction breeding habit.',
      dilemmaCaseEs: 'El sol salió 10.000 días seguidos; ¿eso demuestra con necesidad lógica matemática que saldrá mañana, o es una expectativa por costumbre?',
      dilemmaCaseEn: 'The sun rose 10,000 days in a row: does past regularity logically prove tomorrow’s sunrise, or merely habituate expectation?',
      debateEs: 'Despertó a Immanuel Kant de su "sueño dogmático" al demostrar que la metafísica clásica y la física inductiva carecían de prueba racional pura.',
      debateEn: 'Awoke Immanuel Kant from his "dogmatic slumber" by revealing gaps in inductive causation and pure metaphysics.',
      workEs: 'Tratado de la naturaleza humana · Investigación sobre el entendimiento humano', workEn: 'Treatise of Human Nature · Enquiry Concerning Human Understanding',
      quoteEs: '«La razón es, y solo debe ser, esclava de las pasiones (y la costumbre guía la vida).»', quoteEn: '“Reason is, and ought only to be the slave of the passions.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Abismo Es / Debe + Inducción', titleEn: 'Is–Ought & Causation',
        topEs: 'HECHOS EMPÍRICOS (ES)', topSubEs: 'A precede a B por hábito repetido',
        topEn: 'EMPIRICAL FACTS (IS)', topSubEn: 'A precedes B via repeated custom',
        botEs: 'NECESIDAD / MORAL (DEBE)', botSubEs: 'No se deduce sin premisa valorativa',
        botEn: 'NECESSITY / VALUE (OUGHT)', botSubEs: 'Cannot follow without moral/rational link'
      }
    },
    {
      id: 'kant', block: 'moderna', branch: 'epistemologia', school: 'criticismo',
      eraShort: '1724', dates: '1724–1804', cityEs: 'Königsberg', cityEn: 'Königsberg',
      mx: 662, my: 58,
      photoCredit: 'Retrato de Immanuel Kant (Wikimedia Commons)',
      es: 'Immanuel Kant', en: 'Immanuel Kant',
      thesisEs: 'Realiza un "giro copernicano": el conocimiento une intuición sensible y categorías mentales (conocemos fenómenos, no la "cosa en sí"); en ética ordena tratar siempre al humano como fin.',
      thesisEn: 'Executes a "Copernican turn": mind actively structures experience via space, time, and categories (phenomena, not things-in-themselves); ethics commands universalizable duty.',
      conceptsEs: [
        { k: 'Fenómeno / Noúmeno', d: 'Lo que aparece ante nosotros vs. cosa en sí.' },
        { k: 'Imperativo categórico', d: 'Actúa solo según ley universalizable.' },
        { k: 'Sapere aude', d: 'Atrévete a pensar por ti mismo (Ilustración).' }
      ],
      conceptsEn: [
        { k: 'Phenomena / Noumena', d: 'Structured experience vs. thing-in-itself.' },
        { k: 'Categorical Imperative', d: 'Act only on maxims fit for universal law.' },
        { k: 'Sapere Aude', d: 'Dare to use your own understanding.' }
      ],
      paradoxTitleEs: 'El Dilema de la Promesa Falsa', paradoxTitleEn: 'Universalizable False Promise',
      paradoxEs: 'Si quieres pedir dinero prometiendo devolverlo sin intención de hacerlo, imagina qué pasaría si todos hicieran esa ley: nadie volvería a creer promesas y la práctica se autodestruiría.',
      paradoxEn: 'Before making a false promise to borrow money, universalize it: if everyone did so, promises would lose all trust and collapse logically.',
      dilemmaCaseEs: '¿Es ético manipular o mentir a alguien "para lograr un resultado útil", o toda persona tiene dignidad como fin en sí misma nunca reducible a simple medio?',
      dilemmaCaseEn: 'Is using a person merely as a tool justified if results seem good, or does moral law forbid treating rational beings merely as means?',
      debateEs: 'Concilia la pelea entre Racionalismo (Descartes) y Empirismo (Hume): "pensamientos sin contenido son vacíos; intuiciones sin conceptos son ciegas".',
      debateEn: 'Reconciles Rationalism and Empiricism: "thoughts without content are empty; intuitions without concepts are blind".',
      workEs: 'Crítica de la razón pura · Fundamentación de la metafísica de las costumbres', workEn: 'Critique of Pure Reason · Groundwork of the Metaphysics of Morals',
      quoteEs: '«Obra de tal modo que trates a la humanidad siempre como un fin y nunca meramente como un medio.»', quoteEn: '“Act so that you treat humanity always as an end and never merely as a means.”',
      schema: {
        kind: 'triad',
        titleEs: 'Giro Copernicano Kantiano', titleEn: 'Kantian Copernican Turn',
        topEs: 'CONOCIMIENTO (FENÓMENO)',
        leftEs: 'Datos sensibles (Hume)',
        rightEs: 'Categorías a priori (Razón)',
        topEn: 'EXPERIENCE (PHENOMENA)',
        leftEn: 'Sensory input (Empiricism)',
        rightEn: 'A priori categories (Mind)'
      }
    },
    {
      id: 'hegel', block: 'sigloxix', branch: 'metafisica', school: 'dialectica_materialismo',
      eraShort: '1770', dates: '1770–1831', cityEs: 'Stuttgart / Berlín', cityEn: 'Stuttgart / Berlin',
      mx: 720, my: 58,
      photoCredit: 'Retrato de G. W. F. Hegel por Jakob Schlesinger (Wikimedia Commons)',
      es: 'Hegel', en: 'Hegel',
      thesisEs: 'La verdad no es una foto fija, sino un proceso histórico dialéctico: cada idea o institución genera su contradicción y se supera (Aufhebung) hacia mayor libertad consciente.',
      thesisEn: 'Truth is not static—it is the whole historical process unfolding through contradiction and dialectical synthesis (Aufhebung) toward self-conscious freedom.',
      conceptsEs: [
        { k: 'Dialéctica (Aufhebung)', d: 'Superar conservando lo verdadero previo.' },
        { k: 'Amo y Esclavo', d: 'La autoconciencia exige reconocimiento mutuo.' },
        { k: 'Búho de Minerva', d: 'La filosofía comprende la época al atardecer.' }
      ],
      conceptsEn: [
        { k: 'Dialectics (Aufhebung)', d: 'Overcoming while preserving earlier truth.' },
        { k: 'Master–Slave Dialectic', d: 'Selfhood depends on mutual recognition.' },
        { k: 'Owl of Minerva', d: 'Wisdom grasps an era only as dusk falls.' }
      ],
      paradoxTitleEs: 'Dialéctica del Amo y el Esclavo', paradoxTitleEn: 'Master–Slave Dialectic',
      paradoxEs: 'El amo vence y somete al siervo, pero descubre una ironía trágica: el reconocimiento de alguien sometido carece de valor, mientras el esclavo al transformar el mundo gana dominio real.',
      paradoxEn: 'The master dominates the bondsman, only to discover coerced recognition is hollow—while the bondsman gains mastery by shaping material reality.',
      dilemmaCaseEs: 'Exiges admiración de subordinados obligados a aplaudirte; pronto descubres que su elogio vale cero porque solo el reconocimiento libre puede validarte.',
      dilemmaCaseEn: 'Demanding praise from coerced subordinates backfires: only recognition granted by equals has genuine meaning.',
      debateEs: 'Supera la frontera kantiana entre fenómeno y noúmeno sumergiendo la razón misma en el devenir histórico concreto.',
      debateEn: 'Rejects Kant’s rigid split between mind and unknowable thing-in-itself by tracing reason inside world history.',
      workEs: 'Fenomenología del espíritu · Ciencia de la lógica', workEn: 'Phenomenology of Spirit · Science of Logic',
      quoteEs: '«El búho de Minerva solo emprende su vuelo a la caída del crepúsculo.»', quoteEn: '“The owl of Minerva spreads its wings only with the falling of the dusk.”',
      schema: {
        kind: 'cycle',
        titleEs: 'Movimiento Dialéctico', titleEn: 'Dialectical Process',
        stepsEs: ['1. Posición inicial', '2. Negación / Crisis', '3. Contradicción', '4. Aufhebung (Síntesis)'],
        stepsEn: ['1. Initial form', '2. Negation / Crisis', '3. Inner tension', '4. Aufhebung (Synthesis)']
      }
    },
    {
      id: 'schopenhauer', block: 'sigloxix', branch: 'existencia', school: 'vitalismo_pesimismo',
      eraShort: '1788', dates: '1788–1860', cityEs: 'Danzig / Fráncfort', cityEn: 'Danzig / Frankfurt',
      mx: 752, my: 214,
      photoCredit: 'Retrato de Arthur Schopenhauer (Wikimedia Commons)',
      es: 'Schopenhauer', en: 'Schopenhauer',
      thesisEs: 'El mundo es nuestra Representación, pero su fondo íntimo es una Voluntad ciega e insaciable; vivir oscila como un péndulo entre el dolor de la carencia y el tedio tras lograrlo.',
      thesisEn: 'The world is our Representation, yet its hidden core is blind, insatiable Will; human life swings like a pendulum between painful desire and empty boredom.',
      conceptsEs: [
        { k: 'Voluntad ciega', d: 'Impulso irracional sin propósito último.' },
        { k: 'Péndulo dolor-tedio', d: 'Desear duele; poseer aburre pronto.' },
        { k: 'Compasión y Arte', d: 'Quietud temporal ante el egoísmo individual.' }
      ],
      conceptsEn: [
        { k: 'Blind Will', d: 'Striving life-force without ultimate purpose.' },
        { k: 'Pain–Boredom Pendulum', d: 'Wanting pains us; getting soon bores us.' },
        { k: 'Art & Compassion', d: 'Temporary release from egoistic striving.' }
      ],
      paradoxTitleEs: 'El Dilema de los Puercoespines', paradoxTitleEn: 'Hedgehog’s Dilemma',
      paradoxEs: 'En invierno, unos puercoespines se acercan para calentarse, pero sus púas los lastiman; se alejan y pasan frío hasta hallar una distancia cortés tolerable.',
      paradoxEn: 'Cold hedgehogs huddle for warmth, prick each other with quills, pull apart into the cold, and finally settle at polite middle distance.',
      dilemmaCaseEs: 'Consigues una meta por la que luchaste meses y sientes euforia diez minutos antes de que regrese un extraño vacío buscando la siguiente carencia.',
      dilemmaCaseEn: 'Achieving a longed-for goal gives fleeting relief before boredom returns, pushing you into the next anxious chase.',
      debateEs: 'Combate el optimismo racionalista histórico de Hegel e incorpora por primera vez motivos de los Upanishads y el Budismo en Europa.',
      debateEn: 'Fiercely opposes Hegel’s optimistic rationalism and introduces Upanishadic and Buddhist thought to modern Europe.',
      workEs: 'El mundo como voluntad y representación', workEn: 'The World as Will and Representation',
      quoteEs: '«La vida oscila como un péndulo, de un lado a otro, entre el dolor y el aburrimiento.»', quoteEn: '“Life swings like a pendulum backward and forward between pain and boredom.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Voluntad y Velo de Maya', titleEn: 'Will & Representation',
        topEs: 'REPRESENTACIÓN', topSubEs: 'Velo apariencial · Arte contempla sin desear',
        topEn: 'REPRESENTATION', topSubEn: 'Appearance · Art calms desire',
        botEs: 'VOLUNTAD CIEGA', botSubEs: 'Péndulo dolor ↔ aburrimiento · Compasión',
        botEn: 'BLIND WILL', botSubEn: 'Pain ↔ Boredom pendulum · Compassion'
      }
    },
    {
      id: 'kierkegaard', block: 'sigloxix', branch: 'existencia', school: 'existencialismo',
      eraShort: '1813', dates: '1813–1855', cityEs: 'Copenhague', cityEn: 'Copenhagen',
      mx: 794, my: 214,
      photoCredit: 'Retrato de Søren Kierkegaard (Wikimedia Commons)',
      es: 'Kierkegaard', en: 'Kierkegaard',
      thesisEs: 'La filosofía sistemática olvida al individuo concreto que tiene que elegir sin garantías; la angustia es el "vértigo de la libertad" entre los estadios estético, ético y de fe.',
      thesisEn: 'Grand systems forget the solitary individual forced to choose without guarantees; anxiety is the "dizziness of freedom" across aesthetic, ethical, and faith stages.',
      conceptsEs: [
        { k: 'Vértigo de la libertad', d: 'Angustia al notar que todo es posible.' },
        { k: 'Tres estadios', d: 'Estético (placer), Ético (deber), Fe (salto).' },
        { k: 'Verdad subjetiva', d: 'Una verdad por la que vale vivir y morir.' }
      ],
      conceptsEn: [
        { k: 'Dizziness of Freedom', d: 'Anxiety born from facing open possibility.' },
        { k: 'Three Stages', d: 'Aesthetic (pleasure), Ethical (duty), Faith.' },
        { k: 'Subjective Truth', d: 'Commitment lived first-hand, not mere data.' }
      ],
      paradoxTitleEs: 'El vértigo al borde del abismo', paradoxTitleEn: 'Dizziness at the Precipice',
      paradoxEs: 'Al asomarte a un precipicio temes no solo caer por accidente, sino descubrir la perturbadora posibilidad de que eres libre para arrojar tu vida en cualquier dirección.',
      paradoxEn: 'Peering down a cliff triggers dread not merely of slipping, but of realizing your terrifying freedom to choose any action.',
      dilemmaCaseEs: 'Tienes un mapa perfecto de teorías sobre el amor o la vocación, pero el sistema te deja paralizado en el sofá porque ninguna fórmula decide por ti.',
      dilemmaCaseEn: 'Collecting endless objective theories about love or calling still leaves you paralyzed because no system can make your personal commitment.',
      debateEs: 'Desafía de raíz el sistema totalizador de Hegel, reprochándole construir un palacio de conceptos donde ni siquiera vive el individuo real.',
      debateEn: 'Rebels against Hegel’s totalizing system for building a crystal palace of logic while leaving real human existence outside.',
      workEs: 'Temor y temblor · El concepto de la angustia', workEn: 'Fear and Trembling · The Concept of Anxiety',
      quoteEs: '«La angustia es el vértigo de la libertad.»', quoteEn: '“Anxiety is the dizziness of freedom.”',
      schema: {
        kind: 'triad',
        titleEs: 'Estadios de la Existencia', titleEn: 'Stages on Life’s Way',
        topEs: 'ELECCIÓN INDIVIDUAL',
        leftEs: 'Estético (Inmediatez)',
        rightEs: 'Ético y Salto de Fe',
        topEn: 'INDIVIDUAL CHOICE',
        leftEn: 'Aesthetic (Pleasure)',
        rightEn: 'Ethical & Leap of Faith'
      }
    },
    {
      id: 'marx', block: 'sigloxix', branch: 'politica', school: 'dialectica_materialismo',
      eraShort: '1818', dates: '1818–1883', cityEs: 'Tréveris / Londres', cityEn: 'Trier / London',
      mx: 822, my: 136,
      photoCredit: 'Retrato de Karl Marx, 1875 (Wikimedia Commons)',
      es: 'Karl Marx', en: 'Karl Marx',
      thesisEs: 'Invierte la dialéctica hegeliana: no es la conciencia pura la que determina la vida material, sino el modo de producción, el trabajo y los conflictos de clase.',
      thesisEn: 'Turns Hegel’s dialectic right side up: material production, labor, and class conflict shape social consciousness rather than the reverse.',
      conceptsEs: [
        { k: 'Materialismo histórico', d: 'Base económica e instituciones ideológicas.' },
        { k: 'Alienación', d: 'El trabajador queda ajeno al fruto y sentido laboral.' },
        { k: 'Praxis transformadora', d: 'No basta interpretar el mundo; hay que cambiarlo.' }
      ],
      conceptsEn: [
        { k: 'Historical Materialism', d: 'Economic base shaping legal/cultural structures.' },
        { k: 'Alienation', d: 'Estrangement from one’s labor, product, and peers.' },
        { k: 'Transformative Praxis', d: 'Not merely interpreting the world, but changing it.' }
      ],
      paradoxTitleEs: 'Fetichismo de la Mercancía', paradoxTitleEn: 'Commodity Fetishism',
      paradoxEs: 'En el mercado, los objetos parecen relacionarse entre sí con valor mágico propio, ocultando las horas de vida humana social que los produjeron.',
      paradoxEn: 'In markets, objects appear to possess autonomous value of their own, disguising the real human labor relations behind them.',
      dilemmaCaseEs: 'Una persona fabrica piezas idénticas diez horas diarias sin ver el producto final ni decidir cómo se usa, sintiendo su trabajo como tiempo robado a su propia vida.',
      dilemmaCaseEn: 'Workers assemble disconnected parts daily without voice or ownership, experiencing creative labor as external drudgery.',
      debateEs: 'Pone de pie la dialéctica idealista de Hegel y critica la economía política clásica de Adam Smith y David Ricardo por naturalizar leyes históricas.',
      debateEn: 'Inverts Hegel’s idealist dialectic and critiques classical political economy for treating historical capitalism as eternal nature.',
      workEs: 'El Capital · Manuscritos económico-filosóficos', workEn: 'Capital · Economic and Philosophic Manuscripts',
      quoteEs: '«Los filósofos no han hecho más que interpretar el mundo de diversos modos; de lo que se trata es de transformarlo.»', quoteEn: '“Philosophers have hitherto only interpreted the world in various ways; the point is to change it.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Base y Superestructura', titleEn: 'Base & Superstructure',
        topEs: 'SUPERESTRUCTURA', topSubEs: 'Leyes · Ideología · Cultura · Política',
        topEn: 'SUPERSTRUCTURE', topSubEn: 'Law · Culture · Ideology · Politics',
        botEs: 'BASE MATERIAL', botSubEs: 'Fuerzas productivas · Relaciones de trabajo',
        botEn: 'MATERIAL BASE', botSubEn: 'Productive forces · Labor relations'
      }
    },
    {
      id: 'nietzsche', block: 'sigloxix', branch: 'existencia', school: 'vitalismo_pesimismo',
      eraShort: '1844', dates: '1844–1900', cityEs: 'Röcken / Sils Maria', cityEn: 'Röcken / Sils Maria',
      mx: 856, my: 214,
      photoCredit: 'Retrato de Friedrich Nietzsche (Wikimedia Commons)',
      es: 'Nietzsche', en: 'Nietzsche',
      thesisEs: 'Declara la "muerte de Dios" como crisis de valores heredados ("nihilismo") y llama a crear valores afirmativos propios: el Superhombre dice sí a la vida sin más allá.',
      thesisEn: 'Diagnoses the "death of God" as the collapse of inherited absolute values (nihilism) and urges creating life-affirming values via Amor fati.',
      conceptsEs: [
        { k: 'Muerte de Dios', d: 'Caída de fundamentos absolutos heredados.' },
        { k: 'Eterno retorno', d: '¿Vivirías este mismo instante infinitas veces?' },
        { k: 'Amor fati / Übermensch', d: 'Amar el destino y transmutar valores propios.' }
      ],
      conceptsEn: [
        { k: 'Death of God', d: 'Collapse of inherited absolute authorities.' },
        { k: 'Eternal Recurrence', d: 'Could you will this exact moment forever?' },
        { k: 'Amor Fati / Übermensch', d: 'Loving fate and forging self-authored values.' }
      ],
      paradoxTitleEs: 'El Demonio del Eterno Retorno', paradoxTitleEn: 'Demon of Eternal Recurrence',
      paradoxEs: 'Un demonio susurra que tendrás que revivir exactamente tu vida entera—cada alegría, cobardía y dolor—sin nada nuevo por toda la eternidad: ¿maldecirías o celebrarías?',
      paradoxEn: 'A demon tells you that you must relive this exact life—every joy, shame, and pain—infinite times unchanged: would you despair or say yes?',
      dilemmaCaseEs: 'Vives postergando el presente esperando un premio abstracto futuro o siguiendo normas de rebaño; al imaginar repetir hoy para siempre te ves forzado a elegir distinto.',
      dilemmaCaseEn: 'Postponing life for passive conformity collapses the moment you ask: "Would I choose to relive this exact day forever?".',
      debateEs: 'Rompe tanto con el pesimismo resignado de su maestro Schopenhauer como con el universalismo moral racionalista de Sócrates, Platón y Kant.',
      debateEn: 'Breaks both with Schopenhauer’s life-denying pessimism and with Platonic-Kantian universal moralism.',
      workEs: 'Así habló Zaratustra · La gaya ciencia · Genealogía de la moral', workEn: 'Thus Spoke Zarathustra · The Gay Science · Genealogy of Morality',
      quoteEs: '«Llega a ser quien eres (y ama tu destino: Amor fati).»', quoteEn: '“Become who you are—and say yes to fate (Amor fati).”',
      schema: {
        kind: 'cycle',
        titleEs: 'Tres Transformaciones', titleEn: 'Three Metamorphoses',
        stepsEs: ['1. Camello (Carga deberes)', '2. León (Dice NO al dogma)', '3. Crisis Nihilista', '4. Niño (Crea juego y SÍ)'],
        stepsEn: ['1. Camel (Bears duty)', '2. Lion (Defies "Thou shalt")', '3. Nihilist Void', '4. Child (New Yes & play)']
      }
    },
    {
      id: 'wittgenstein', block: 'contemp', branch: 'epistemologia', school: 'analitica_ciencia',
      eraShort: '1889', dates: '1889–1951', cityEs: 'Viena / Cambridge', cityEn: 'Vienna / Cambridge',
      mx: 912, my: 58,
      photoCredit: 'Retrato de Ludwig Wittgenstein, 1929 (Wikimedia Commons)',
      es: 'Wittgenstein', en: 'Wittgenstein',
      thesisEs: 'En su juventud delimitó lo decible con lógica exacta ("de lo que no se puede hablar hay que callar"); en su madurez mostró que el significado de una palabra es su uso en juegos de lenguaje.',
      thesisEn: 'Early on drew strict logical limits ("whereof one cannot speak, stay silent"); later showed word meaning arises from practical use in social language-games.',
      conceptsEs: [
        { k: 'Juegos de lenguaje', d: 'El sentido cambia según la práctica social.' },
        { k: 'Significado = Uso', d: 'No hay esencias ocultas detrás de cada palabra.' },
        { k: 'Terapia conceptual', d: 'Disolver enredos metafísicos aclarando el lenguaje.' }
      ],
      conceptsEn: [
        { k: 'Language-Games', d: 'Meaning shifts with concrete human practices.' },
        { k: 'Meaning as Use', d: 'Words work like tools in a toolbox, not rigid labels.' },
        { k: 'Philosophical Therapy', d: 'Showing the fly the way out of the fly-bottle.' }
      ],
      paradoxTitleEs: 'El Escarabajo en la Caja', paradoxTitleEn: 'The Beetle in a Box',
      paradoxEs: 'Cada persona tiene una caja donde solo ella mira su "escarabajo". Lo privado incomunicable no fija el lenguaje público: la palabra vale por sus reglas compartidas.',
      paradoxEn: 'Everyone holds a private box only they can look into called "beetle". Purely private hidden contents drop out—shared public rules govern meaning.',
      dilemmaCaseEs: '¿Tienen todos los "juegos" (ajedrez, fútbol, solitario, juego de palabras) una única esencia idéntica, o solo "parecidos de familia" superpuestos?',
      dilemmaCaseEn: 'Do chess, soccer, solitaire, and ring-a-rosy share one single essence—or merely overlapping "family resemblances"?',
      debateEs: 'Tras inspirar al Círculo de Viena con el Tractatus, refutó su propia teoría pictórica rígida en las Investigaciones filosóficas.',
      debateEn: 'After inspiring the Vienna Circle with his Tractatus, dismantled his own rigid picture theory in Philosophical Investigations.',
      workEs: 'Tractatus Logico-Philosophicus · Investigaciones filosóficas', workEn: 'Tractatus Logico-Philosophicus · Philosophical Investigations',
      quoteEs: '«Los límites de mi lenguaje significan los límites de mi mundo.»', quoteEn: '“The limits of my language mean the limits of my world.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Primer vs. Segundo Wittgenstein', titleEn: 'Early vs. Later Wittgenstein',
        topEs: 'TRACTATUS (1921)', topSubEs: 'Espejo lógico único · Límites estrictos',
        topEn: 'TRACTATUS (1921)', topSubEn: 'Single logical picture · Strict limits',
        botEs: 'INVESTIGACIONES (1953)', botSubEs: 'Caja de herramientas · Juegos de lenguaje',
        botEn: 'INVESTIGATIONS (1953)', botSubEn: 'Toolbox of uses · Family resemblances'
      }
    },
    {
      id: 'popper', block: 'contemp', branch: 'epistemologia', school: 'analitica_ciencia',
      eraShort: '1902', dates: '1902–1994', cityEs: 'Viena / Londres', cityEn: 'Vienna / London',
      mx: 974, my: 58,
      photoCredit: 'Retrato de Karl Popper (Wikimedia Commons)',
      es: 'Karl Popper', en: 'Karl Popper',
      thesisEs: 'Una teoría es científica no porque podamos acumular casos que la "confirmen", sino porque asume riesgos y es falsable por observación o experimento posible.',
      thesisEn: 'A theory counts as scientific not by piling up confirming anecdotes, but because it makes risky predictions capable of empirical falsification.',
      conceptsEs: [
        { k: 'Falsabilidad', d: 'Criterio de demarcación entre ciencia y mito.' },
        { k: 'Conjetura y refutación', d: 'Aprendemos corrigiendo errores explícitos.' },
        { k: 'Sociedad abierta', d: 'Democracia crítica vs. totalitarismo cerrado.' }
      ],
      conceptsEn: [
        { k: 'Falsifiability', d: 'Demarcates testable science from dogma.' },
        { k: 'Conjecture & Refutation', d: 'Knowledge grows by spotting and correcting error.' },
        { k: 'Open Society', d: 'Free critical institutions vs. closed utopias.' }
      ],
      paradoxTitleEs: 'El Cisne Negro y la Tolerancia', paradoxTitleEn: 'Black Swan & Tolerance Paradox',
      paradoxEs: 'Ver un millón de cisnes blancos nunca verifica "todos son blancos", pero hallar un solo cisne negro refuta la ley. Asimismo, la tolerancia ilimitada con intolerantes destruye la tolerancia.',
      paradoxEn: 'A million white swans never prove "all swans are white", yet one black swan refutes it. Similarly, unlimited tolerance toward intolerance destroys tolerance itself.',
      dilemmaCaseEs: 'Un astrólogo redacta predicciones tan vagas que pase lo que pase dice "acerté". Un físico formula un eclipse exacto en un segundo preciso para poder ser refutado.',
      dilemmaCaseEn: 'A horoscope is worded so vaguely that every outcome fits, whereas a physics claim risks precise failure at a predicted time.',
      debateEs: 'Discute contra el verificacionismo inductivo del Círculo de Viena y contra los historicismos cerrados (Platón, Hegel, Marx) en política.',
      debateEn: 'Challenges Vienna Circle inductivism in science and closed historicist determinism in political theory.',
      workEs: 'La lógica de la investigación científica · La sociedad abierta y sus enemigos', workEn: 'The Logic of Scientific Discovery · The Open Society and Its Enemies',
      quoteEs: '«La verdadera ignorancia no es la ausencia de conocimiento, sino negarse a corregirlo.»', quoteEn: '“True ignorance is not absence of knowledge, but the refusal to acquire and test it.”',
      schema: {
        kind: 'triad',
        titleEs: 'Demarcación Científica', titleEn: 'Falsification Loop',
        topEs: 'HIPÓTESIS ARRIESGADA',
        leftEs: 'Verificacionismo: busca apoyo',
        rightEs: 'Falsacionismo: busca el cisne negro',
        topEn: 'RISKY CONJECTURE',
        leftEn: 'Dogma: seeks easy confirmation',
        rightEn: 'Science: hunts black swans'
      }
    },
    {
      id: 'sartre', block: 'contemp', branch: 'existencia', school: 'existencialismo',
      eraShort: '1905', dates: '1905–1980', cityEs: 'París', cityEn: 'Paris',
      mx: 912, my: 214,
      photoCredit: 'Retrato de Jean-Paul Sartre, 1965 (Wikimedia Commons)',
      es: 'Jean-Paul Sartre', en: 'Jean-Paul Sartre',
      thesisEs: 'En el ser humano "la existencia precede a la esencia": primero existimos y luego nos definimos mediante actos libres; incluso no elegir ya es una elección responsable.',
      thesisEn: 'For humans, "existence precedes essence": first we exist, then we define who we are via free choices—even refusing to choose is a responsible choice.',
      conceptsEs: [
        { k: 'Existencia > Esencia', d: 'Sin guion previo ni naturaleza fija excusante.' },
        { k: 'Condenados a ser libres', d: 'Somos responsables totales de cada acto.' },
        { k: 'Mala fe', d: 'Fingir ser un rol rígido para evitar elegir.' }
      ],
      conceptsEn: [
        { k: 'Existence Precedes Essence', d: 'No pre-written nature excuses our deeds.' },
        { k: 'Condemned to Be Free', d: 'Total responsibility for every decision.' },
        { k: 'Bad Faith', d: 'Acting like a fixed robot to evade freedom.' }
      ],
      paradoxTitleEs: 'El Camarero y la Mala Fe', paradoxTitleEn: 'The Waiter in Bad Faith',
      paradoxEs: 'Un camarero exagera cada gesto de su oficio como si fuera un autómata nacido solo para servir café, fingiendo ante sí mismo que no tiene ninguna libertad fuera de su papel.',
      paradoxEn: 'A café waiter over-performs every robotic gesture of his job as if born strictly to serve coffee, pretending he is a fixed object rather than free.',
      dilemmaCaseEs: 'Un estudiante duda entre quedarse cuidando a su madre enferma o marchar a combatir la ocupación: ninguna tabla ética externa resuelve por él; debe inventar su valor al elegir.',
      dilemmaCaseEn: 'Torn between caring for his sick mother or joining resistance fighters, a student finds no external formula—he invents his own meaning by choosing.',
      debateEs: 'Dialoga con la fenomenología de Husserl y Heidegger, invirtiendo el esencialismo metafísico tradicional desde Aristóteles hasta la teología.',
      debateEn: 'Builds on Husserl’s and Heidegger’s phenomenology while overturning classical essentialism since Aristotle.',
      workEs: 'El ser y la nada · El existencialismo es un humanismo', workEn: 'Being and Nothingness · Existentialism Is a Humanism',
      quoteEs: '«Estamos condenados a ser libres; el ser humano es lo que hace con lo que hicieron de él.»', quoteEn: '“We are condemned to be free; humanity is what it makes of what was made of it.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Libertad vs. Mala Fe', titleEn: 'Freedom vs. Bad Faith',
        topEs: 'SER-PARA-SÍ (CONCIENCIA)', topSubEs: 'Existencia → Elegir → Crear esencia',
        topEn: 'BEING-FOR-ITSELF', topSubEn: 'Exist → Choose → Invent essence',
        botEs: 'MALA FE / AUTOENGAÑO', botSubEs: 'Fingir ser objeto fijo sin elección',
        botEn: 'BAD FAITH (EVASION)', botSubEs: 'Pretending to be a fixed role'
      }
    },
    {
      id: 'beauvoir', block: 'contemp', branch: 'politica', school: 'existencialismo',
      eraShort: '1908', dates: '1908–1986', cityEs: 'París', cityEn: 'Paris',
      mx: 960, my: 136,
      photoCredit: 'Retrato de Simone de Beauvoir (Wikimedia Commons)',
      es: 'Simone de Beauvoir', en: 'Simone de Beauvoir',
      thesisEs: '"No se nace mujer: se llega a serlo"; la libertad no ocurre en el vacío abstracto sino en situaciones encarnadas, culturales y recíprocas: mi libertad necesita la del otro.',
      thesisEn: '"One is not born, but rather becomes, a woman"; human freedom acts within concrete social situations and requires reciprocal freedom for others.',
      conceptsEs: [
        { k: 'Inmanencia / Trascendencia', d: 'Repetición pasiva vs. proyecto creador.' },
        { k: 'El Otro / Alteridad', d: 'Construcción histórica del sujeto subordinado.' },
        { k: 'Ética de la ambigüedad', d: 'Libertad concreta ligada al bien ajeno.' }
      ],
      conceptsEn: [
        { k: 'Immanence vs. Transcendence', d: 'Static repetition vs. open creative project.' },
        { k: 'The Other (Alterity)', d: 'How societies cast groups as secondary objects.' },
        { k: 'Ethics of Ambiguity', d: 'Concrete liberty intertwined with others’ freedom.' }
      ],
      paradoxTitleEs: 'El Segundo Sexo y el Espejo Social', paradoxTitleEn: 'The Second Sex & Situated Freedom',
      paradoxEs: 'Quien crece rodeada de expectativas que presentan la pasividad como "naturaleza biológica" aprende a encarnar un destino construido históricamente como si fuera inevitable.',
      paradoxEn: 'Growing up inside customs that frame passivity as "innate biology" teaches people to live a historically built role as if it were destiny.',
      dilemmaCaseEs: '¿Puede considerarse "plenamente libre" una persona encerrada por leyes o mitos en la rutina doméstica sin acceso real a educación, ingresos ni proyecto propio?',
      dilemmaCaseEn: 'Can someone trapped by custom without education or autonomy be told their lack of agency is a "free biological choice"?',
      debateEs: 'Matiza el existencialismo individualista temprano de Sartre integrando cuerpo, género, situación económica y liberación mutua.',
      debateEn: 'Deepens Sartre’s early existentialism by integrating embodiment, gender, material situation, and mutual liberation.',
      workEs: 'El segundo sexo · Para una moral de la ambigüedad', workEn: 'The Second Sex · The Ethics of Ambiguity',
      quoteEs: '«No se nace mujer: llega una a serlo. Querer ser libre es también querer libres a los demás.»', quoteEn: '“One is not born, but rather becomes, a woman. To will oneself free is also to will others free.”',
      schema: {
        kind: 'triad',
        titleEs: 'Libertad Situada', titleEn: 'Situated Freedom',
        topEs: 'TRASCENDENCIA RECÍPROCA',
        leftEs: 'Situación histórica y cuerpo',
        rightEs: 'Libertad propia + del otro',
        topEn: 'MUTUAL TRANSCENDENCE',
        leftEn: 'Concrete body & history',
        rightEn: 'Self + Others’ liberty'
      }
    },
    {
      id: 'camus', block: 'contemp', branch: 'existencia', school: 'existencialismo',
      eraShort: '1913', dates: '1913–1960', cityEs: 'Argel / París', cityEn: 'Algiers / Paris',
      mx: 992, my: 214,
      photoCredit: 'Retrato de Albert Camus, Premio Nobel (Wikimedia Commons)',
      es: 'Albert Camus', en: 'Albert Camus',
      thesisEs: 'El Absurdo nace del choque entre nuestra sed humana de sentido claro y el silencio del universo. Ni suicidio ni salto irracional: rebelión lúcida, solidaridad y alegría presente.',
      thesisEn: 'The Absurd arises from our human longing for clarity colliding with a silent universe. Neither despair nor blind leap: lucid revolt, solidarity, and present joy.',
      conceptsEs: [
        { k: 'El Absurdo', d: 'Choque entre deseo humano y silencio cósmico.' },
        { k: 'Rebeldía lúcida', d: 'Vivir dignamente sin consuelos falsos.' },
        { k: 'Solidaridad civil', d: 'Me rebelo contra la peste, luego somos.' }
      ],
      conceptsEn: [
        { k: 'The Absurd', d: 'Collision between human need and cosmic silence.' },
        { k: 'Lucid Revolt', d: 'Living fully without false metaphysical escapes.' },
        { k: 'Solidarity', d: '“I rebel—therefore we exist” against cruelty.' }
      ],
      paradoxTitleEs: 'El Mito de Sísifo', paradoxTitleEn: 'The Myth of Sisyphus',
      paradoxEs: 'Condenado a empujar una enorme roca cuesta arriba solo para verla caer de nuevo, Sísifo conquista su destino cuando sonríe consciente durante el descenso: debemos imaginarlo dichoso.',
      paradoxEn: 'Doomed to roll a boulder uphill forever only to watch it roll back, Sisyphus triumphs during his lucid walk down: we must imagine him happy.',
      dilemmaCaseEs: 'Descubres que no hay guion cósmico escrito en las estrellas para justificar tus rutinas. ¿Te paralizas en cinismo o transformas el presente en rebeldía solidaria?',
      dilemmaCaseEn: 'Realizing there is no cosmic script certifying daily work: do you collapse into cynicism, or embrace present solidarity and courage?',
      debateEs: 'Discrepa con Kierkegaard (rechaza el "suicidio filosófico" del salto de fe) y más tarde rompe con Sartre sobre las justificaciones ideológicas de la violencia.',
      debateEn: 'Rejects Kierkegaard’s "philosophical suicide" (irrational leap of faith) and later splits with Sartre over ideological violence.',
      workEs: 'El mito de Sísifo · El extranjero · La peste', workEn: 'The Myth of Sisyphus · The Stranger · The Plague',
      quoteEs: '«En medio del invierno descubrí que había dentro de mí un verano invencible; hay que imaginar a Sísifo dichoso.»', quoteEn: '“In the midst of winter, I found there was, within me, an invincible summer. One must imagine Sisyphus happy.”',
      schema: {
        kind: 'triad',
        titleEs: 'Respuesta al Absurdo', titleEn: 'Answering the Absurd',
        topEs: 'REBELDÍA LÚCIDA (SÍSIFO)',
        leftEs: 'Sed humana de sentido',
        rightEs: 'Silencio del cosmos · Solidaridad',
        topEn: 'LUCID REVOLT (SISYPHUS)',
        leftEn: 'Human cry for meaning',
        rightEn: 'Silent cosmos · Solidarity'
      }
    },
    {
      id: 'confucio', block: 'contemp', branch: 'oriental', school: 'sabiduria_oriental',
      eraShort: '551 a.C.', dates: '551–479 a.C.', cityEs: 'Qufu (Lu, China)', cityEn: 'Qufu (Lu, China)',
      mx: 1032, my: 136,
      photoCredit: 'Fresco de Confucio · Dinastía Han Occidental, Shandong (Wikimedia Commons)',
      es: 'Confucio (Kongzi)', en: 'Confucius (Kongzi)',
      thesisEs: 'Una sociedad justa no se sostiene por castigos duros sino cultivando el carácter (Ren / benevolencia humana), la cortesía ritual respetuosa (Li) y la regla de oro negativa.',
      thesisEn: 'A harmonious society thrives not on harsh punishments, but on cultivated benevolence (Ren), mindful social rituals (Li), and moral example from leaders.',
      conceptsEs: [
        { k: 'Ren (Humanidad)', d: 'Benevolencia empática en cada vínculo.' },
        { k: 'Li (Rito / Respeto)', d: 'Formas cotidianas que armonizan el trato.' },
        { k: 'Junzi (Persona noble)', d: 'Liderazgo por ejemplo moral, no fuerza.' }
      ],
      conceptsEn: [
        { k: 'Ren (Humaneness)', d: 'Empathic care enacted in relationships.' },
        { k: 'Li (Ritual Harmony)', d: 'Respectful customs uniting community.' },
        { k: 'Junzi (Exemplary Person)', d: 'Leading through integrity, not coercion.' }
      ],
      paradoxTitleEs: 'La Rectificación de los Nombres', paradoxTitleEn: 'Rectification of Names',
      paradoxEs: 'Si preguntas qué haría primero al gobernar un reino: "asegurar que cada palabra corresponda a su realidad"—que quien se llama maestro enseñe y quien gobierna sirva.',
      paradoxEn: 'Asked the first step in governing a state: "Ensure names match reality"—so rulers actually protect, teachers actually guide, and promises mean what they say.',
      dilemmaCaseEs: 'Una comunidad tiene miles de multas y vigilancia policial, pero la gente solo evade castigos; en cambio, cuando líderes y vecinos cumplen pequeños ritos de respeto, florece la confianza.',
      dilemmaCaseEn: 'Harsh laws alone teach people how to dodge punishments; mutual trust grows when leaders embody respect and everyday courtesy.',
      debateEs: 'Frente al caos feudal chino de los Reinos Combatientes y frente al autoritarismo punitivo legalista, apuesta por educación ética y familia.',
      debateEn: 'Counters warring-states chaos and harsh Legalist punishments by rooting social order in moral education and care.',
      workEs: 'Analectas (Lunyu)', workEn: 'The Analects (Lunyu)',
      quoteEs: '«No hagas a otros lo que no quieres que te hagan a ti.»', quoteEn: '“Do not impose on others what you yourself do not desire.”',
      schema: {
        kind: 'triad',
        titleEs: 'Armonía Confuciana', titleEn: 'Confucian Harmony',
        topEs: 'JUNZI (EJEMPLO ÉTICO)',
        leftEs: 'Ren: Benevolencia interior',
        rightEs: 'Li: Rito y respeto cívico',
        topEn: 'JUNZI (EXEMPLARY SELF)',
        leftEn: 'Ren: Inner benevolence',
        rightEn: 'Li: Respectful social form'
      }
    },
    {
      id: 'laotse_buda', block: 'contemp', branch: 'oriental', school: 'sabiduria_oriental',
      eraShort: 'VI–V a.C.', dates: 'Siglos VI–V a.C.', cityEs: 'China / India (Lumbini)', cityEn: 'China / India (Lumbini)',
      mx: 1054, my: 214,
      photoCredit: 'Buda en Sarnath (India) · Tradición Taoísta y Budista (Wikimedia Commons)',
      es: 'Lao-Tsé y Buda', en: 'Laozi & the Buddha',
      thesisEs: 'Lao-Tsé enseña fluir con el Tao mediante acción sin forzar (Wu-wei), como el agua que vence la piedra; Buda revela que el apego ante un mundo impermanente origina el sufrimiento.',
      thesisEn: 'Laozi teaches flowing with the Dao via effortless action (Wu-wei) like water; the Buddha diagnoses clinging to impermanent things as the root of suffering (Dukkha).',
      conceptsEs: [
        { k: 'Wu-Wei / Tao', d: 'Actuar en sintonía sin resistencia rígida.' },
        { k: 'Impermanencia (Anicca)', d: 'Todo fenómeno cambia; nada es estático.' },
        { k: 'Camino Medio', d: 'Ni hedonismo ciego ni ascetismo extremo.' }
      ],
      conceptsEn: [
        { k: 'Wu-Wei / Dao', d: 'Effortless alignment without forced friction.' },
        { k: 'Impermanence (Anicca)', d: 'All conditioned things arise and pass away.' },
        { k: 'Middle Way', d: 'Lucid balance between indulgence and self-harm.' }
      ],
      paradoxTitleEs: 'El Sueño de la Mariposa y la Flecha Envenenada', paradoxTitleEn: 'Butterfly Dream & Poisoned Arrow',
      paradoxEs: 'Zhuangzi (taoísta) sueña ser mariposa y al despertar duda si es humano soñando mariposa; Buda recuerda que alguien herido por una flecha debe sacársela antes de especular quién la lanzó.',
      paradoxEn: 'Taoist Zhuangzi wakes wondering if he is a man dreaming a butterfly or vice versa; the Buddha says a man shot by a poisoned arrow must pull it out before debating metaphysics.',
      dilemmaCaseEs: 'Cuanto más fuerzas ansiosamente controlar un río o aferrarte a que nada cambie nunca, más sufres y te bloqueas; al soltar rigidez y ver con lucidez, actúas con eficacia serena.',
      dilemmaCaseEn: 'Forcing control over a flowing river or clinging to permanence creates suffering; releasing rigid grasping restores lucid effectiveness.',
      debateEs: 'Mientras el Taoísmo cuestiona el exceso de normas rituales confucianas, el Budismo refuta la rigidez de castas y la ilusión de un ego separado inmutable.',
      debateEn: 'Daoism playfully counters Confucian over-regulation; Buddhism dissolves rigid caste dogma and the illusion of a permanent isolated ego.',
      workEs: 'Tao Te Ching · Dhammapada (Cuatro Nobles Verdades)', workEn: 'Dao De Jing · Dhammapada (Four Noble Truths)',
      quoteEs: '«Lo blando y dócil (el agua) vence a lo duro; nada en el mundo es permanente excepto el cambio.»', quoteEn: '“Nothing is softer than water, yet nothing overcomes the hard; peace grows when clinging ceases.”',
      schema: {
        kind: 'opposition',
        titleEs: 'Tao (Wu-Wei) & Impermanencia', titleEn: 'Dao (Wu-Wei) & Impermanence',
        topEs: 'APEGO Y RIGIDEZ', topSubEs: 'Forzar contra corriente · Sufrimiento (Dukkha)',
        topEn: 'CLINGING & FORCING', topSubEn: 'Straining against flow · Suffering (Dukkha)',
        botEs: 'WU-WEI Y LUCIDEZ', botSubEs: 'Agua fluida · Impermanencia · Compasión',
        botEn: 'WU-WEI & AWAKENING', botSubEn: 'Water-like flow · Release · Compassion'
      }
    }
  ];

  // Ensure bilingual search and quick ID maps
  var BY_ID = Object.create(null);
  THINKERS.forEach(function (t) { BY_ID[t.id] = t; });

  var COPY = {
    es: {
      pageTitle: 'Atlas de Filosofía y Filósofos — Todologo',
      brandMark: 'ATLAS DE <span>FILOSOFÍA</span><sup>T029</sup>',
      brandSub: 'Corrientes, pensadores, dilemas y genealogía de las ideas',
      homeLabel: 'Volver al inicio de Todologo',
      railTitle: 'Épocas y tradiciones',
      railPath: 'Saca <b>90%+ en Examen</b> en un bloque para ganar su medalla.',
      statAcc: 'Precisión',
      statTime: 'Tiempo',
      statStreak: 'Racha',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Explora corrientes, mapa de influencias, retratos, esquemas mentales y paradojas.',
        practice: 'Entrena con pistas; cada respuesta desbloquea la ficha completa antes de avanzar.',
        test: 'Ronda evaluada sobre todos los pensadores del bloque. 90%+ marca el bloque como dominado.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', thinker: 'Pensador', school: 'Corriente', dilemma: 'Dilema' },
      taskHints: {
        mix: 'Alterna preguntas de pensador, corriente filosófica y dilema o experimento mental.',
        thinker: 'Dada una tesis central, concepto o cita, identifica al filósofo correspondiente.',
        school: 'Identifica la corriente filosófica por su postura nuclear, pregunta o praxis vital.',
        dilemma: 'Reconoce qué pensador formuló cada experimento mental o dilema ético-epistémico.'
      },
      allBranches: 'Todas las ramas',
      allSchools: 'Todas las corrientes (14)',
      searchPh: 'Buscar pensador, concepto o paradoja…',
      searchNone: 'Ningún pensador coincide con el filtro actual.',
      prev: 'Anterior',
      next: 'Siguiente',
      practiceThisBlock: 'Practicar este bloque →',
      nextStep: 'Siguiente',
      viewSummary: 'Ver resumen',
      settings: 'Ajustes',
      howBtn: 'Las 6 ramas',
      done: 'Listo',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      cleanExit: 'Salir de vista limpia',
      keysHint: 'Flechas navegan en Estudio · <kbd>1</kbd>–<kbd>4</kbd> responden · <kbd>Space</kbd> siguiente · <kbd>C</kbd> vista limpia',
      credit: '24 pensadores · 14 corrientes · 6 ramas · offline',
      bestEmpty: 'Sin marca aún',
      bestLabel: function (b) { return 'Mejor marca: <b>' + b.pct + '%</b> (' + b.acc + '/' + b.total + ')'; },
      eyebrowStudy: 'ESTUDIO · ',
      eyebrowPrompt: function (kind, i, tot) {
        var map = { thinker: 'IDENTIFICA AL PENSADOR', school: 'IDENTIFICA LA CORRIENTE', dilemma: 'DILEMA / EXPERIMENTO MENTAL' };
        return (i != null && tot ? (i + 1) + '/' + tot + ' · ' : '') + (map[kind] || kind);
      },
      eyebrowOk: '¡CORRECTO!',
      eyebrowBad: 'REVISA EL CONCEPTO',
      studyHint: 'Clic en un nodo del mapa, filtro o retrato para ampliar el esquema conceptual.',
      quizHint: 'Elige la opción correcta (<kbd>1</kbd>–<kbd>4</kbd>). El mapa oculta los nombres hasta responder.',
      mapLocked: 'Mapa en modo reto: los nombres se revelan al responder.',
      schemaLabel: 'Esquema Conceptual',
      photoLabel: 'Retrato · Ampliar',
      thesisLbl: 'Tesis central:',
      conceptsLbl: 'Conceptos clave',
      paradoxLbl: 'Paradoja / Metáfora:',
      debateLbl: '¿A quién responde?:',
      workLbl: 'Obra clave:',
      guideQ: 'Pregunta:',
      guideRival: 'En contraste con:',
      guidePraxis: 'En la vida diaria:',
      allBranchTitle: 'Mapa General de la Filosofía (6 Ramas · 14 Corrientes)',
      allBranchDesc: 'Explora cómo dialogan las grandes preguntas a lo largo de la historia: las flechas continuas (→) indican influencia directa y las discontinuas (⇢) crítica o ruptura.',
      modalTitle: 'Retrato y esquema conceptual',
      close: 'Cerrar',
      introTitle: 'Mapa de las 6 Grandes Ramas de la Filosofía',
      introBody1: 'Toda corriente filosófica responde alguna de estas 6 preguntas humanas fundamentales:',
      introItems: [
        '<b>Epistemología y Ciencia:</b> ¿Qué podemos conocer con certeza? (Racionalismo vs. Empirismo vs. Falsacionismo).',
        '<b>Ética y Virtud:</b> ¿Qué es una vida buena y cómo actuar? (Sócrates, Aristóteles, Epicuro, Estoicismo, Kant).',
        '<b>Política y Sociedad:</b> ¿Qué legitima el poder y qué hace justa la comunidad? (Maquiavelo, Locke, Marx, Beauvoir).',
        '<b>Metafísica y Ontología:</b> ¿Cuál es la estructura última de lo real, la mente y el cosmos? (Platón, Spinoza, Hegel).',
        '<b>Existencia y Absurdo:</b> ¿Cómo crear sentido siendo libres y mortales? (Schopenhauer, Kierkegaard, Nietzsche, Sartre, Camus).',
        '<b>Sabiduría Oriental:</b> ¿Cómo cultivar armonía social, flujo sin forzar (<i>wu-wei</i>) y lucidez? (Confucio, Lao-Tsé, Buda).'
      ],
      introGo: 'Empezar a explorar',
      summaryTitle: function (pct, passed) { return passed ? '¡Bloque dominado! (' + pct + '%)' : 'Ronda completada (' + pct + '%)'; },
      summaryDesc: function (acc, total, passed) {
        return acc + ' de ' + total + ' aciertos. ' + (passed ? 'Has superado el umbral del 90% y desbloqueado la medalla ✓ en este bloque.' : 'Necesitas 90%+ en modo Examen para marcar el bloque como dominado.');
      },
      retry: 'Otra ronda',
      toStudy: 'Volver a Estudiar'
    },
    en: {
      pageTitle: 'Philosophy & Thinkers Atlas — Todologo',
      brandMark: 'PHILOSOPHY <span>ATLAS</span><sup>T029</sup>',
      brandSub: 'Currents, great thinkers, thought experiments, and historical debates',
      homeLabel: 'Return to Todologo home',
      railTitle: 'Eras & Traditions',
      railPath: 'Score <b>90%+ in Test</b> on a study block to earn its mastery checkmark.',
      statAcc: 'Accuracy',
      statTime: 'Time',
      statStreak: 'Streak',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Browse currents, lineage map, portraits, concept schemas, and famous paradoxes.',
        practice: 'Practice with immediate explanation and full inspector card before moving on.',
        test: 'Graded round over the block. 90%+ earns mastery for the block.'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mix', thinker: 'Thinker', school: 'School', dilemma: 'Dilemma' },
      taskHints: {
        mix: 'Alternates Thinker ID, Philosophical School, and Thought Experiment / Dilemma questions.',
        thinker: 'Identify the philosopher behind a core thesis, signature concept, or famous quote.',
        school: 'Identify the philosophical school from its core claim, guiding question, or daily practice.',
        dilemma: 'Match famous thought experiments and ethical/epistemic dilemmas to their thinker.'
      },
      allBranches: 'All 6 branches',
      allSchools: 'All currents (14)',
      searchPh: 'Search thinker, concept, or paradox…',
      searchNone: 'No philosopher matches the active filter.',
      prev: 'Previous',
      next: 'Next',
      practiceThisBlock: 'Practice this block →',
      nextStep: 'Next',
      viewSummary: 'View summary',
      settings: 'Settings',
      howBtn: 'The 6 branches',
      done: 'Done',
      restart: 'Restart',
      cleanView: 'Clean view',
      cleanExit: 'Exit clean view',
      keysHint: 'Arrows navigate in Study · <kbd>1</kbd>–<kbd>4</kbd> answer · <kbd>Space</kbd> next · <kbd>C</kbd> clean view',
      credit: '24 thinkers · 14 schools · 6 branches · offline',
      bestEmpty: 'No score yet',
      bestLabel: function (b) { return 'Best score: <b>' + b.pct + '%</b> (' + b.acc + '/' + b.total + ')'; },
      eyebrowStudy: 'STUDY · ',
      eyebrowPrompt: function (kind, i, tot) {
        var map = { thinker: 'IDENTIFY THINKER', school: 'IDENTIFY CURRENT', dilemma: 'THOUGHT EXPERIMENT' };
        return (i != null && tot ? (i + 1) + '/' + tot + ' · ' : '') + (map[kind] || kind);
      },
      eyebrowOk: 'CORRECT!',
      eyebrowBad: 'REVIEW THIS IDEA',
      studyHint: 'Click any node on the lineage map, filter by branch/school, or zoom into portraits.',
      quizHint: 'Choose an answer (<kbd>1</kbd>–<kbd>4</kbd>). Map names stay hidden until you answer.',
      mapLocked: 'Challenge mode: thinker names stay masked until answered.',
      schemaLabel: 'Concept Diagram',
      photoLabel: 'Portrait · Zoom',
      thesisLbl: 'Core thesis:',
      conceptsLbl: 'Key concepts',
      paradoxLbl: 'Thought experiment:',
      debateLbl: 'Replies to:',
      workLbl: 'Key work:',
      guideQ: 'Core question:',
      guideRival: 'Contrasts with:',
      guidePraxis: 'Daily practice:',
      allBranchTitle: 'Overview of Philosophy (6 Branches · 14 Schools)',
      allBranchDesc: 'See how major questions evolve across eras: solid arrows (→) show direct influence and dashed arrows (⇢) mark critique or break.',
      modalTitle: 'Portrait & Concept Diagram',
      close: 'Close',
      introTitle: 'The 6 Major Branches of Philosophy',
      introBody1: 'Every philosophical tradition wrestles with one of these six enduring questions:',
      introItems: [
        '<b>Epistemology & Science:</b> What can we know? (Rationalism vs. Empiricism vs. Falsificationism).',
        '<b>Ethics & Virtue:</b> What is a good life and moral duty? (Socrates, Aristotle, Epicurus, Stoics, Kant).',
        '<b>Politics & Society:</b> What justifies power, rights, and justice? (Machiavelli, Locke, Marx, Beauvoir).',
        '<b>Metaphysics & Ontology:</b> What is the ultimate fabric of reality and mind? (Plato, Spinoza, Hegel).',
        '<b>Existence & Absurd:</b> How do we forge meaning in freedom and finitude? (Schopenhauer, Kierkegaard, Nietzsche, Sartre, Camus).',
        '<b>Eastern Wisdom:</b> How do we live in harmony, effortless flow (<i>wu-wei</i>), and clarity? (Confucius, Laozi, Buddha).'
      ],
      introGo: 'Start exploring',
      summaryTitle: function (pct, passed) { return passed ? 'Block mastered! (' + pct + '%)' : 'Round finished (' + pct + '%)'; },
      summaryDesc: function (acc, total, passed) {
        return acc + ' of ' + total + ' correct. ' + (passed ? 'You scored 90%+ and earned mastery ✓ on this block.' : 'Reach 90%+ in Test mode to mark this block as mastered.');
      },
      retry: 'Play again',
      toStudy: 'Back to Study'
    }
  };

  function tr(obj, field) {
    if (!obj) return '';
    return obj[field + (LANG === 'en' ? 'En' : 'Es')] || obj[LANG] || obj.es || '';
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var state = {
    block: STORE.get('block', 'all'),
    mode: STORE.get('mode', 'study'),
    task: STORE.get('task', 'mix'),
    branchFilter: 'all',
    schoolFilter: 'all',
    search: '',
    selectedId: 'socrates',
    bests: STORE.get('bests', {}),
    // quiz runtime
    queue: [],
    qIndex: 0,
    currentQ: null,
    answered: false,
    pickedIdx: -1,
    correct: 0,
    totalAnswered: 0,
    streak: 0,
    startTs: 0,
    timerId: null
  };

  if (!STUDY_BLOCKS.some(function (b) { return b.id === state.block; })) state.block = 'all';
  if (['study', 'practice', 'test'].indexOf(state.mode) === -1) state.mode = 'study';
  if (['mix', 'thinker', 'school', 'dilemma'].indexOf(state.task) === -1) state.task = 'mix';

  // DOM helpers
  function $(id) { return document.getElementById(id); }
  var els = {
    prompt: $('prompt'), pEyebrow: $('pEyebrow'), pName: $('pName'), pMeta: $('pMeta'),
    pBarWrap: $('pBarWrap'), pBar: $('pBar'),
    stageBox: $('stageBox'), felt: $('felt'), actions: $('actions'),
    railList: $('railList'), railTitle: $('railTitle'), railPath: $('railPath'),
    sAcc: $('sAcc'), sTime: $('sTime'), sStreak: $('sStreak'),
    statAccLabel: $('statAccLabel'), statTimeLabel: $('statTimeLabel'), statStreakLabel: $('statStreakLabel'),
    langSel: $('langSel'), langHeading: $('langHeading'),
    modeSeg: $('modeSeg'), modeHeading: $('modeHeading'), modeHint: $('modeHint'),
    taskSeg: $('taskSeg'), taskHeading: $('taskHeading'), taskHint: $('taskHint'),
    best: $('best'), restartBtn: $('restartBtn'), cleanBtn: $('cleanBtn'), cleanExit: $('cleanExit'),
    settingsBtn: $('settingsBtn'), closeSheet: $('closeSheet'), howBtn: $('howBtn'),
    keysHint: $('keysHint'), creditText: $('creditText'),
    brandMark: $('brandMark'), brandSub: $('brandSub'), homeLink: $('homeLink'),
    intro: $('intro'), introTitle: $('introTitle'), introBody1: $('introBody1'), introList: $('introList'), introGo: $('introGo'),
    photoModal: $('photoModal'), photoModalTitle: $('photoModalTitle'), photoModalClose: $('photoModalClose'),
    photoModalImg: $('photoModalImg'), modalPhotoPane: $('modalPhotoPane'), modalSchemaPane: $('modalSchemaPane'),
    photoModalDesc: $('photoModalDesc')
  };

  function getBlockObj(id) {
    return STUDY_BLOCKS.find(function (b) { return b.id === id; }) || STUDY_BLOCKS[0];
  }

  function getBlockThinkers(blockId) {
    var b = getBlockObj(blockId || state.block);
    if (!b.ids) return THINKERS.slice();
    return b.ids.map(function (id) { return BY_ID[id]; }).filter(Boolean);
  }

  function getStudyThinkers() {
    var base = getBlockThinkers(state.block);
    return base.filter(function (t) {
      if (state.branchFilter !== 'all' && t.branch !== state.branchFilter) return false;
      if (state.schoolFilter !== 'all' && t.school !== state.schoolFilter) return false;
      if (state.search.trim()) {
        var q = state.search.trim().toLowerCase();
        var hay = [
          t.es, t.en, t.thesisEs, t.thesisEn, t.paradoxTitleEs, t.paradoxTitleEn,
          t.paradoxEs, t.paradoxEn, SCHOOLS[t.school].es, SCHOOLS[t.school].en,
          BRANCHES[t.branch].es, BRANCHES[t.branch].en, t.workEs, t.workEn
        ].join(' ').toLowerCase();
        t.conceptsEs.forEach(function (c) { hay += ' ' + c.k.toLowerCase() + ' ' + c.d.toLowerCase(); });
        t.conceptsEn.forEach(function (c) { hay += ' ' + c.k.toLowerCase() + ' ' + c.d.toLowerCase(); });
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function ensureValidSelected(visibleList) {
    if (!visibleList.length) return null;
    var ok = visibleList.some(function (t) { return t.id === state.selectedId; });
    if (!ok) state.selectedId = visibleList[0].id;
    return BY_ID[state.selectedId] || visibleList[0];
  }

  /* =====================================================================
   * DIDACTIC CONCEPTUAL SVG DIAGRAMS (per thinker)
   * ===================================================================== */
  function wrapLines(str, max) {
    var words = String(str || '').split(' ');
    var out = [''];
    words.forEach(function (w) {
      var cur = out[out.length - 1];
      if (!cur) out[out.length - 1] = w;
      else if ((cur + ' ' + w).length <= max) out[out.length - 1] = cur + ' ' + w;
      else out.push(w);
    });
    return out.slice(0, 2);
  }

  function svgTextLines(x, y, str, maxChars, fill, size, weight) {
    var lines = wrapLines(str, maxChars);
    if (lines.length === 1) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + fill + '" font-family="IBM Plex Mono,monospace" font-size="' + size + '" font-weight="' + (weight || 600) + '">' + esc(lines[0]) + '</text>';
    }
    return '<text x="' + x + '" y="' + (y - 4) + '" text-anchor="middle" fill="' + fill + '" font-family="IBM Plex Mono,monospace" font-size="' + size + '" font-weight="' + (weight || 600) + '">' + esc(lines[0]) + '</text>' +
      '<text x="' + x + '" y="' + (y + size + 1) + '" text-anchor="middle" fill="' + fill + '" font-family="IBM Plex Mono,monospace" font-size="' + size + '" font-weight="' + (weight || 600) + '">' + esc(lines[1]) + '</text>';
  }

  function buildConceptSchemaSVG(t) {
    var s = t.schema;
    var br = BRANCHES[t.branch];
    var col = br.hex;
    var suf = LANG === 'en' ? 'En' : 'Es';
    var title = s['title' + suf];
    var body = '<rect x="0" y="0" width="240" height="148" rx="8" fill="#09151f"/>' +
      '<text x="120" y="16" text-anchor="middle" fill="#8d9ca9" font-family="IBM Plex Mono,monospace" font-size="8.8" font-weight="600">' + esc(title.toUpperCase()) + '</text>';

    if (s.kind === 'opposition') {
      var top = s['top' + suf], topSub = s['topSub' + suf];
      var bot = s['bot' + suf], botSub = s['botSub' + suf];
      body +=
        '<rect x="14" y="25" width="212" height="45" rx="7" fill="rgba(111,208,232,0.11)" stroke="' + col + '" stroke-width="1.4"/>' +
        '<text x="120" y="42" text-anchor="middle" fill="#ecdec2" font-family="Archivo,sans-serif" font-size="11" font-weight="700">' + esc(top) + '</text>' +
        svgTextLines(120, 57, topSub, 34, '#9ec4da', 8.3, 500) +
        '<path d="M108 75 L120 84 L132 75" fill="none" stroke="#f0cf6a" stroke-width="1.5"/>' +
        '<line x1="65" y1="80" x2="175" y2="80" stroke="#33475a" stroke-width="1" stroke-dasharray="3 3"/>' +
        '<rect x="14" y="89" width="212" height="48" rx="7" fill="rgba(255,142,114,0.10)" stroke="#4c6478" stroke-width="1.3"/>' +
        '<text x="120" y="106" text-anchor="middle" fill="' + col + '" font-family="Archivo,sans-serif" font-size="11" font-weight="700">' + esc(bot) + '</text>' +
        svgTextLines(120, 121, botSub, 34, '#b8c8d6', 8.3, 500);
    } else if (s.kind === 'triad') {
      var topT = s['top' + suf], leftT = s['left' + suf], rightT = s['right' + suf];
      body +=
        '<line x1="120" y1="54" x2="62" y2="108" stroke="' + col + '" stroke-width="1.5" stroke-opacity="0.7"/>' +
        '<line x1="120" y1="54" x2="178" y2="108" stroke="' + col + '" stroke-width="1.5" stroke-opacity="0.7"/>' +
        '<line x1="62" y1="108" x2="178" y2="108" stroke="#4a6378" stroke-width="1.3" stroke-dasharray="3 2"/>' +
        '<rect x="36" y="27" width="168" height="32" rx="7" fill="#132b3c" stroke="' + col + '" stroke-width="1.5"/>' +
        svgTextLines(120, 46, topT, 24, '#ecdec2', 9.2, 700) +
        '<rect x="10" y="92" width="102" height="44" rx="7" fill="#10212f" stroke="#395266" stroke-width="1.3"/>' +
        svgTextLines(61, 114, leftT, 16, '#9fd9f0', 8.2, 600) +
        '<rect x="128" y="92" width="102" height="44" rx="7" fill="#10212f" stroke="#395266" stroke-width="1.3"/>' +
        svgTextLines(179, 114, rightT, 16, '#f0cf6a', 8.2, 600);
    } else if (s.kind === 'spectrum') {
      var L = s['left' + suf], Ls = s['leftSub' + suf];
      var M = s['mid' + suf], Ms = s['midSub' + suf];
      var R = s['right' + suf], Rs = s['rightSub' + suf];
      body +=
        '<line x1="28" y1="74" x2="212" y2="74" stroke="#3a5266" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="42" cy="74" r="7" fill="#18222c" stroke="#ff7a6b" stroke-width="2"/>' +
        '<circle cx="120" cy="74" r="10" fill="#133329" stroke="#5fd39a" stroke-width="2.4"/>' +
        '<circle cx="198" cy="74" r="7" fill="#18222c" stroke="#ff7a6b" stroke-width="2"/>' +
        '<text x="42" y="45" text-anchor="middle" fill="#ff7a6b" font-family="Archivo,sans-serif" font-size="10.5" font-weight="700">' + esc(L) + '</text>' +
        svgTextLines(42, 102, Ls, 12, '#9eb0be', 8, 500) +
        '<text x="120" y="42" text-anchor="middle" fill="#5fd39a" font-family="Archivo,sans-serif" font-size="11.5" font-weight="800">' + esc(M) + '</text>' +
        svgTextLines(120, 105, Ms, 16, '#ecdec2', 8.4, 700) +
        '<text x="198" y="45" text-anchor="middle" fill="#ff7a6b" font-family="Archivo,sans-serif" font-size="10.5" font-weight="700">' + esc(R) + '</text>' +
        svgTextLines(198, 102, Rs, 12, '#9eb0be', 8, 500);
    } else {
      var steps = s['steps' + suf];
      body +=
        '<path d="M68 48 L172 48 M182 58 L182 94 M172 106 L68 106 M58 94 L58 58" stroke="' + col + '" stroke-width="1.3" stroke-dasharray="3 2" opacity="0.65"/>' +
        '<rect x="12" y="28" width="102" height="36" rx="7" fill="#112433" stroke="#395266" stroke-width="1.2"/>' +
        svgTextLines(63, 47, steps[0], 17, '#e8edf0', 8.2, 600) +
        '<rect x="126" y="28" width="102" height="36" rx="7" fill="#112433" stroke="#395266" stroke-width="1.2"/>' +
        svgTextLines(177, 47, steps[1], 17, '#f0cf6a', 8.2, 600) +
        '<rect x="126" y="88" width="102" height="38" rx="7" fill="#112433" stroke="#395266" stroke-width="1.2"/>' +
        svgTextLines(177, 108, steps[2], 17, '#ff8e72', 8.2, 600) +
        '<rect x="12" y="88" width="102" height="38" rx="7" fill="#132e3c" stroke="' + col + '" stroke-width="1.5"/>' +
        svgTextLines(63, 108, steps[3], 17, '#ecdec2', 8.5, 700);
    }

    return '<svg viewBox="0 0 240 148" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(title) + '">' + body + '</svg>';
  }

  function buildPortraitFallbackSVG(t) {
    var br = BRANCHES[t.branch];
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="60" cy="44" r="21" fill="none" stroke="' + br.hex + '" stroke-width="2" opacity="0.8"/>' +
      '<path d="M26 104 C28 78, 92 78, 94 104" fill="none" stroke="' + br.hex + '" stroke-width="2" opacity="0.8"/>' +
      '<text x="60" y="50" text-anchor="middle" fill="#ecdec2" font-family="Archivo,sans-serif" font-size="16" font-weight="800">' + esc(t[LANG].slice(0, 2).toUpperCase()) + '</text>' +
    '</svg>';
  }

  /* =====================================================================
   * PHILOSOPHICAL GENEALOGY & ERAS MAP SVG (ANTI-SPOILER SAFE)
   * ===================================================================== */
  function buildPhilosophyMapSVG(opts) {
    var maskNames = !!opts.maskNames;
    var activeId = opts.activeId || null;
    var highlightBranch = opts.branchFilter || 'all';
    var highlightSchool = opts.schoolFilter || 'all';
    var visibleIds = opts.visibleIds || null;
    var interactive = !!opts.interactive;

    var eras = LANG === 'en'
      ? [
          { x: 135, label: 'ANCIENT GREECE', sub: '5th–3rd c. BCE' },
          { x: 325, label: 'HELLENISTIC / ROME', sub: '3rd c. BCE–2nd c. CE' },
          { x: 550, label: 'MODERNITY / ENLIGHT.', sub: '1500–1804' },
          { x: 790, label: '19TH CENTURY', sub: '1800–1900' },
          { x: 990, label: '20TH C. & EASTERN', sub: 'Global Wisdom' }
        ]
      : [
          { x: 135, label: 'ANTIGÜEDAD', sub: 's. V–III a.C.' },
          { x: 325, label: 'HELENISMO Y ROMA', sub: 's. III a.C.–II d.C.' },
          { x: '550', label: 'MODERNIDAD / ILUSTR.', sub: '1500–1804' },
          { x: 790, label: 'SIGLO XIX', sub: '1800–1900' },
          { x: 990, label: 'SIGLO XX Y ORIENTE', sub: 'Tradición global' }
        ];

    var rows = LANG === 'en'
      ? [
          { y: 58, label: 'METAPHYSICS & KNOWLEDGE', color: '#6fd0e8' },
          { y: 136, label: 'ETHICS & POLITICS', color: '#f0cf6a' },
          { y: 214, label: 'EXISTENCE & WISDOM', color: '#ff8e72' }
        ]
      : [
          { y: 58, label: 'METAFÍSICA Y CIENCIA', color: '#6fd0e8' },
          { y: 136, label: 'ÉTICA Y POLÍTICA', color: '#f0cf6a' },
          { y: 214, label: 'EXISTENCIA Y SABIDURÍA', color: '#ff8e72' }
        ];

    var html = '<svg class="phil-map-svg" viewBox="0 0 1120 264" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<marker id="arrInf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
          '<path d="M0,1 L9,5 L0,9 z" fill="#6fd0e8" opacity="0.72"/>' +
        '</marker>' +
        '<marker id="arrCrit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
          '<path d="M0,1 L9,5 L0,9 z" fill="#ff8e72" opacity="0.78"/>' +
        '</marker>' +
      '</defs>';

    // Horizontal thematic band dividers
    html += '<rect x="0" y="28" width="1120" height="74" fill="rgba(111,208,232,0.03)"/>' +
      '<rect x="0" y="102" width="1120" height="78" fill="rgba(240,207,106,0.03)"/>' +
      '<rect x="0" y="180" width="1120" height="84" fill="rgba(255,142,114,0.03)"/>' +
      '<line x1="0" y1="28" x2="1120" y2="28" stroke="#223140" stroke-width="1"/>' +
      '<line x1="0" y1="102" x2="1120" y2="102" stroke="#223140" stroke-width="1" stroke-dasharray="4 4"/>' +
      '<line x1="0" y1="180" x2="1120" y2="180" stroke="#223140" stroke-width="1" stroke-dasharray="4 4"/>';

    // Vertical era dividers
    [252, 415, 690, 886].forEach(function (vx) {
      html += '<line x1="' + vx + '" y1="28" x2="' + vx + '" y2="262" stroke="#1e2f3d" stroke-width="1"/>';
    });

    eras.forEach(function (e) {
      html += '<text x="' + e.x + '" y="14" text-anchor="middle" fill="#ecdec2" font-family="IBM Plex Mono,monospace" font-size="9" font-weight="700" letter-spacing="0.08em">' + esc(e.label) + '</text>' +
        '<text x="' + e.x + '" y="24" text-anchor="middle" fill="#6f8596" font-family="IBM Plex Mono,monospace" font-size="8">' + esc(e.sub) + '</text>';
    });

    rows.forEach(function (r) {
      html += '<text x="10" y="' + (r.y - 16) + '" fill="' + r.color + '" opacity="0.62" font-family="IBM Plex Mono,monospace" font-size="8.2" font-weight="700">' + esc(r.label) + '</text>';
    });

    // Genealogy arrows
    EDGES.forEach(function (ed) {
      var a = BY_ID[ed.from], b = BY_ID[ed.to];
      if (!a || !b) return;
      var highlighted = activeId && (ed.from === activeId || ed.to === activeId);
      var stroke = ed.kind === 'critique' ? '#ff8e72' : '#6fd0e8';
      var marker = ed.kind === 'critique' ? 'url(#arrCrit)' : 'url(#arrInf)';
      var op = highlighted ? 0.92 : (maskNames ? 0.16 : 0.25);
      var sw = highlighted ? 1.8 : 1.1;
      var dash = ed.kind === 'critique' ? ' stroke-dasharray="4 3"' : '';
      var dx = b.mx - a.mx, dy = b.my - a.my;
      var dist = Math.hypot(dx, dy) || 1;
      var sx = a.mx + (dx / dist) * 14;
      var sy = a.my + (dy / dist) * 14;
      var ex = b.mx - (dx / dist) * 15;
      var ey = b.my - (dy / dist) * 15;
      var mx = (sx + ex) / 2, my = (sy + ey) / 2 - (Math.abs(dy) < 12 ? 12 : 6);
      html += '<path d="M' + sx.toFixed(1) + ',' + sy.toFixed(1) + ' Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + ex.toFixed(1) + ',' + ey.toFixed(1) + '" fill="none" stroke="' + stroke + '" stroke-width="' + sw + '"' + dash + ' opacity="' + op + '" marker-end="' + marker + '"/>';
    });

    // Thinker nodes
    THINKERS.forEach(function (t) {
      var br = BRANCHES[t.branch];
      var isActive = activeId === t.id;
      var isMatchedFilter = (!visibleIds || visibleIds.indexOf(t.id) !== -1) &&
        (highlightBranch === 'all' || t.branch === highlightBranch) &&
        (highlightSchool === 'all' || t.school === highlightSchool);
      var dimClass = !isMatchedFilter ? ' is-dim' : '';
      var selClass = isActive ? ' is-selected' : '';
      var cls = 'phil-node' + dimClass + selClass;

      // Label text: strictly masked as "?" before answering in practice/test!
      var nodeText = maskNames ? (isActive ? '?' : '·') : t[LANG].split(' (')[0];
      var shortName = maskNames ? '?' : nodeText.replace('Jean-Paul ', '').replace('John ', '').replace('Karl ', '').replace('Immanuel ', '').replace('Arthur ', '').replace('Albert ', '').replace('Simone de ', '').replace('Marco ', 'M. ').replace('Lao-Tsé y ', 'Lao/').replace('Laozi & the ', 'Lao/');

      html += '<g class="' + cls + '"' + (interactive ? ' data-id="' + esc(t.id) + '" tabindex="0" role="button" aria-label="' + esc(maskNames ? '?' : t[LANG]) + '"' : '') + '>' +
        '<circle class="node-ring" cx="' + t.mx + '" cy="' + t.my + '" r="' + (isActive ? 11.5 : 8.5) + '" fill="#0d1b26" stroke="' + (isActive ? '#ffffff' : br.hex) + '" stroke-width="' + (isActive ? 2.2 : 1.6) + '"/>' +
        '<circle cx="' + t.mx + '" cy="' + t.my + '" r="' + (isActive ? 5 : 3.5) + '" fill="' + (isActive ? '#f0cf6a' : br.hex) + '"/>';

      if (maskNames) {
        if (isActive) {
          html += '<text x="' + t.mx + '" y="' + (t.my + 22) + '" text-anchor="middle" fill="#f0cf6a" font-family="IBM Plex Mono,monospace" font-size="11" font-weight="700">?</text>';
        }
      } else {
        html += '<rect x="' + (t.mx - 33) + '" y="' + (t.my + 12) + '" width="66" height="14" rx="4" fill="rgba(8,14,20,0.88)"/>' +
          '<text x="' + t.mx + '" y="' + (t.my + 22) + '" text-anchor="middle" fill="' + (isActive ? '#ecdec2' : '#c6d6e3') + '" font-family="Archivo,sans-serif" font-size="9.2" font-weight="' + (isActive ? 800 : 600) + '">' + esc(shortName) + '</text>';
      }
      html += '</g>';
    });

    // Legend
    var legInf = LANG === 'en' ? '→ Direct influence' : '→ Influencia directa';
    var legCrit = LANG === 'en' ? '⇢ Critique / Rupture' : '⇢ Crítica / Ruptura';
    html += '<text x="1096" y="255" text-anchor="end" fill="#8d9ca9" font-family="IBM Plex Mono,monospace" font-size="8.6">' +
      esc(maskNames ? COPY[LANG].mapLocked : legInf + '   ·   ' + legCrit) + '</text>';

    html += '</svg>';
    return html;
  }

  /* =====================================================================
   * RENDER GUIDE, INSPECTOR CARD & MODALS
   * ===================================================================== */
  function buildSchoolGuideHTML() {
    var suf = LANG === 'en' ? 'En' : 'Es';
    if (state.schoolFilter !== 'all' && SCHOOLS[state.schoolFilter]) {
      var sc = SCHOOLS[state.schoolFilter];
      var br = BRANCHES[sc.branch];
      return '<div class="school-guide" style="--gc:' + br.color + '">' +
        '<div class="school-guide-head">' +
          '<b>' + esc(sc[LANG]) + ' <span style="color:var(--muted);font-weight:500">(' + esc(br[LANG]) + ')</span></b>' +
          '<span class="school-guide-q">' + esc(COPY[LANG].guideQ + ' ' + sc['question' + suf]) + '</span>' +
        '</div>' +
        '<p class="school-guide-desc">' + esc(sc['thesis' + suf]) + '</p>' +
        '<div class="school-guide-meta">' +
          '<span><b>' + esc(COPY[LANG].guideRival) + '</b> ' + esc(sc['rival' + suf]) + '</span>' +
          '<span><b>' + esc(COPY[LANG].guidePraxis) + '</b> ' + esc(sc['praxis' + suf]) + '</span>' +
        '</div>' +
      '</div>';
    }
    if (state.branchFilter !== 'all' && BRANCHES[state.branchFilter]) {
      var b = BRANCHES[state.branchFilter];
      return '<div class="school-guide" style="--gc:' + b.color + '">' +
        '<div class="school-guide-head">' +
          '<b>' + esc(b[LANG]) + '</b>' +
          '<span class="school-guide-q">' + esc(b['question' + suf]) + '</span>' +
        '</div>' +
        '<p class="school-guide-desc">' + esc(b['desc' + suf]) + '</p>' +
      '</div>';
    }
    return '<div class="school-guide" style="--gc:var(--scan)">' +
      '<div class="school-guide-head">' +
        '<b>' + esc(COPY[LANG].allBranchTitle) + '</b>' +
      '</div>' +
      '<p class="school-guide-desc">' + esc(COPY[LANG].allBranchDesc) + '</p>' +
    '</div>';
  }

  function buildInspectorHTML(t) {
    if (!t) return '';
    var suf = LANG === 'en' ? 'En' : 'Es';
    var br = BRANCHES[t.branch];
    var sc = SCHOOLS[t.school];
    var concepts = t['concepts' + suf];
    var cChips = concepts.map(function (c) {
      return '<span class="concept-chip"><b>' + esc(c.k) + ':</b> ' + esc(c.d) + '</span>';
    }).join('');

    return '<section class="inspector" style="--bc:' + br.color + '" aria-label="' + esc(t[LANG]) + '">' +
      '<div class="concept-box">' +
        buildConceptSchemaSVG(t) +
        '<small>' + esc(COPY[LANG].schemaLabel) + '</small>' +
      '</div>' +
      '<div class="phil-info">' +
        '<div class="phil-head">' +
          '<h4>' + esc(t[LANG]) + '</h4>' +
          '<span class="phil-dates">' + esc(t.dates + ' · ' + t['city' + suf]) + '</span>' +
          '<span class="phil-badge">' + esc(sc[LANG]) + '</span>' +
          '<span class="phil-badge">' + esc(br[LANG]) + '</span>' +
        '</div>' +
        '<p class="phil-thesis"><b>' + esc(COPY[LANG].thesisLbl) + '</b> ' + esc(t['thesis' + suf]) + '</p>' +
        '<div class="phil-concepts" aria-label="' + esc(COPY[LANG].conceptsLbl) + '">' + cChips + '</div>' +
        '<p class="phil-row"><b class="tag-paradox">' + esc(COPY[LANG].paradoxLbl) + ' ' + esc(t['paradoxTitle' + suf]) + ' — </b>' + esc(t['paradox' + suf]) + '</p>' +
        '<p class="phil-row"><b class="tag-debate">' + esc(COPY[LANG].debateLbl) + '</b> ' + esc(t['debate' + suf]) + '</p>' +
        '<p class="phil-row"><b class="tag-work">' + esc(COPY[LANG].workLbl) + '</b> ' + esc(t['work' + suf]) + ' · <i>' + esc(t['quote' + suf]) + '</i></p>' +
      '</div>' +
      '<figure class="phil-photo-wrap" id="inspectorPhoto" data-id="' + esc(t.id) + '" tabindex="0" role="button" aria-label="' + esc(COPY[LANG].photoLabel) + '">' +
        '<img src="photos/' + esc(t.id) + '.jpg" alt="' + esc(t[LANG]) + '" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">' +
        '<div class="phil-photo-fallback" hidden>' + buildPortraitFallbackSVG(t) + '</div>' +
        '<figcaption class="phil-photo-cap"><span>' + esc(COPY[LANG].photoLabel) + '</span><span>⊕</span></figcaption>' +
      '</figure>' +
    '</section>';
  }

  function openPhotoModal(thinkerId) {
    var t = BY_ID[thinkerId];
    if (!t) return;
    var suf = LANG === 'en' ? 'En' : 'Es';
    els.photoModalTitle.textContent = t[LANG] + ' (' + t.dates + ') — ' + SCHOOLS[t.school][LANG];
    els.photoModalImg.src = 'photos/' + t.id + '.jpg';
    els.photoModalImg.alt = t[LANG];
    els.photoModalImg.hidden = false;
    els.photoModalImg.onerror = function () {
      els.photoModalImg.hidden = true;
      els.modalPhotoPane.innerHTML = buildPortraitFallbackSVG(t);
    };
    if (!els.photoModalImg.parentNode) {
      els.modalPhotoPane.innerHTML = '';
      els.modalPhotoPane.appendChild(els.photoModalImg);
    }
    els.modalSchemaPane.innerHTML = buildConceptSchemaSVG(t);
    els.photoModalDesc.innerHTML = '<b>' + esc(t['paradoxTitle' + suf]) + ':</b> ' + esc(t['paradox' + suf]) +
      '<br><span style="color:var(--muted)">' + esc(t.photoCredit + ' · ' + t['work' + suf]) + '</span>';
    els.photoModal.hidden = false;
  }

  /* =====================================================================
   * QUIZ ENGINE (thinker / school / dilemma / mix)
   * ===================================================================== */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pickDistractors(pool, correctKey, keyFn, labelFn, count) {
    var seen = Object.create(null);
    seen[correctKey] = true;
    var choices = [{ key: correctKey, label: labelFn(correctKey), ok: true }];
    var shuffled = shuffle(pool);
    for (var i = 0; i < shuffled.length && choices.length < count; i++) {
      var k = keyFn(shuffled[i]);
      if (seen[k]) continue;
      seen[k] = true;
      choices.push({ key: k, label: labelFn(k), ok: false });
    }
    return shuffle(choices);
  }

  function makeQuestion(t, qKind) {
    var suf = LANG === 'en' ? 'En' : 'Es';
    if (qKind === 'school') {
      var sc = SCHOOLS[t.school];
      var allSchools = Object.keys(SCHOOLS).map(function (id) { return SCHOOLS[id]; });
      var optsS = pickDistractors(
        allSchools,
        sc.id,
        function (s) { return s.id; },
        function (id) { return SCHOOLS[id][LANG]; },
        4
      );
      return {
        kind: 'school',
        thinkerId: t.id,
        promptTitle: LANG === 'en' ? 'Which philosophical current is this?' : '¿A qué corriente filosófica pertenece?',
        badge: BRANCHES[sc.branch][LANG],
        caseHtml: '<b>«' + esc(sc['question' + suf]) + '»</b><br>' + esc(sc['thesis' + suf]) +
          '<small>' + esc(COPY[LANG].guidePraxis + ' ' + sc['praxis' + suf]) + '</small>',
        options: optsS
      };
    }

    if (qKind === 'dilemma') {
      var optsD = pickDistractors(
        THINKERS,
        t.id,
        function (x) { return x.id; },
        function (id) { return BY_ID[id][LANG]; },
        4
      );
      return {
        kind: 'dilemma',
        thinkerId: t.id,
        promptTitle: t['paradoxTitle' + suf],
        badge: LANG === 'en' ? 'Thought Experiment / Case' : 'Experimento mental / Dilema',
        caseHtml: esc(t['dilemmaCase' + suf]) +
          '<small>' + esc(BRANCHES[t.branch][LANG] + ' · ' + (LANG === 'en' ? 'Who formulated this?' : '¿Qué pensador lo planteó o responde así?')) + '</small>',
        options: optsD
      };
    }

    // Default: thinker
    var optsT = pickDistractors(
      THINKERS,
      t.id,
      function (x) { return x.id; },
      function (id) { return BY_ID[id][LANG]; },
      4
    );
    var c0 = t['concepts' + suf][0];
    return {
      kind: 'thinker',
      thinkerId: t.id,
      promptTitle: LANG === 'en' ? 'Identify the philosopher' : 'Identifica al pensador',
      badge: BRANCHES[t.branch][LANG] + ' · ' + t.eraShort,
      caseHtml: esc(t['thesis' + suf]) +
        '<small>' + esc((LANG === 'en' ? 'Key clue: ' : 'Concepto clave: ') + c0.k + ' — ' + c0.d) + '</small>',
      options: optsT
    };
  }

  function startQuizRound() {
    clearInterval(state.timerId);
    state.timerId = null;
    var pool = getBlockThinkers(state.block);
    var kinds = state.task === 'mix' ? ['thinker', 'school', 'dilemma'] : [state.task];
    var ordered = shuffle(pool);
    state.queue = ordered.map(function (t, i) {
      return makeQuestion(t, kinds[i % kinds.length]);
    });
    state.qIndex = 0;
    state.answered = false;
    state.pickedIdx = -1;
    state.correct = 0;
    state.totalAnswered = 0;
    state.streak = 0;
    state.startTs = Date.now();
    state.timerId = setInterval(updateClock, 1000);
    state.currentQ = state.queue[0] || null;
    renderAll();
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function formatElapsed(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function updateClock() {
    if (state.mode === 'study' || !state.startTs || !state.currentQ) {
      els.sTime.textContent = state.mode === 'study' ? '–' : els.sTime.textContent;
      return;
    }
    els.sTime.textContent = formatElapsed(Date.now() - state.startTs);
  }

  function submitAnswer(optIdx) {
    if (!state.currentQ || state.answered) return;
    var opt = state.currentQ.options[optIdx];
    if (!opt) return;
    state.answered = true;
    state.pickedIdx = optIdx;
    state.totalAnswered++;
    if (opt.ok) {
      state.correct++;
      state.streak++;
    } else {
      state.streak = 0;
    }

    if (state.mode === 'test' && state.qIndex === state.queue.length - 1) {
      stopTimer();
      var pct = Math.round((state.correct / state.queue.length) * 100);
      var prev = state.bests[state.block];
      if (!prev || pct > prev.pct || (pct === prev.pct && state.correct > prev.acc)) {
        state.bests[state.block] = { pct: pct, acc: state.correct, total: state.queue.length };
        STORE.set('bests', state.bests);
      }
    }
    renderAll();
  }

  function advanceQuestion() {
    if (!state.answered) return;
    if (state.qIndex < state.queue.length - 1) {
      state.qIndex++;
      state.currentQ = state.queue[state.qIndex];
      state.answered = false;
      state.pickedIdx = -1;
      renderAll();
    } else {
      stopTimer();
      state.currentQ = null;
      renderAll();
    }
  }

  /* =====================================================================
   * FULL UI RENDERING
   * ===================================================================== */
  function renderStaticText() {
    var c = COPY[LANG];
    document.documentElement.lang = LANG;
    document.title = c.pageTitle;
    els.brandMark.innerHTML = c.brandMark;
    els.brandSub.textContent = c.brandSub;
    els.homeLink.setAttribute('aria-label', c.homeLabel);
    els.railTitle.textContent = c.railTitle;
    els.railPath.innerHTML = c.railPath;
    els.statAccLabel.textContent = c.statAcc;
    els.statTimeLabel.textContent = c.statTime;
    els.statStreakLabel.textContent = c.statStreak;
    els.langHeading.textContent = c.langHeading;
    els.langSel.value = LANG;
    els.modeHeading.textContent = c.modeHeading;
    els.taskHeading.textContent = c.taskHeading;
    els.restartBtn.textContent = c.restart;
    els.cleanBtn.textContent = c.cleanView;
    els.cleanExit.textContent = c.cleanExit;
    els.settingsBtn.textContent = c.settings;
    els.closeSheet.textContent = c.done;
    els.howBtn.textContent = c.howBtn;
    els.keysHint.innerHTML = c.keysHint;
    els.creditText.textContent = c.credit;

    els.introTitle.textContent = c.introTitle;
    els.introBody1.textContent = c.introBody1;
    els.introList.innerHTML = c.introItems.map(function (li) { return '<li>' + li + '</li>'; }).join('');
    els.introGo.textContent = c.introGo;
    els.photoModalClose.textContent = c.close;

    Array.prototype.forEach.call(els.modeSeg.querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = c.modes[v];
      b.setAttribute('aria-pressed', String(state.mode === v));
    });
    els.modeHint.textContent = c.modeHints[state.mode];

    Array.prototype.forEach.call(els.taskSeg.querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = c.tasks[v];
      b.setAttribute('aria-pressed', String(state.task === v));
    });
    els.taskHint.textContent = c.taskHints[state.task];

    var bRecord = state.bests[state.block];
    els.best.innerHTML = bRecord ? c.bestLabel(bRecord) : c.bestEmpty;
  }

  function renderRail() {
    els.railList.innerHTML = STUDY_BLOCKS.map(function (b, idx) {
      var count = b.ids ? b.ids.length : THINKERS.length;
      var best = state.bests[b.id];
      var done = best && best.pct >= 90;
      var emClass = done ? 'done' : (best ? 'next' : '');
      var emText = best ? best.pct + '%' : String(count);
      return '<button class="item" type="button" data-block="' + esc(b.id) + '" aria-pressed="' + String(state.block === b.id) + '">' +
        '<span><i>0' + (idx + 1) + '</i>' + esc(b[LANG]) + '</span>' +
        '<em class="' + emClass + '">' + esc(emText) + '</em>' +
      '</button>';
    }).join('');
  }

  function renderStatsAndPrompt(visibleStudyList) {
    var c = COPY[LANG];
    els.stageBox.classList.remove('flash-ok', 'flash-bad');
    els.prompt.classList.remove('is-ok', 'is-bad');

    if (state.mode === 'study') {
      els.sAcc.textContent = '–';
      els.sTime.textContent = '–';
      els.sStreak.textContent = '0';
      els.pBarWrap.classList.add('is-off');
      var sel = ensureValidSelected(visibleStudyList);
      if (sel) {
        els.pEyebrow.textContent = c.eyebrowStudy + BRANCHES[sel.branch][LANG] + ' · ' + sel.eraShort;
        els.pName.textContent = sel[LANG];
        els.pMeta.textContent = SCHOOLS[sel.school][LANG] + ' · ' + sel.dates;
      } else {
        els.pEyebrow.textContent = c.eyebrowStudy + getBlockObj(state.block)[LANG];
        els.pName.textContent = c.searchNone;
        els.pMeta.textContent = '';
      }
      return;
    }

    els.sAcc.textContent = state.totalAnswered ? Math.round((state.correct / state.totalAnswered) * 100) + '%' : '–';
    els.sStreak.textContent = String(state.streak);
    if (!state.timerId && state.startTs) updateClock();

    if (!state.currentQ) {
      els.pBarWrap.classList.remove('is-off');
      els.pBar.style.width = '100%';
      var pctDone = state.queue.length ? Math.round((state.correct / state.queue.length) * 100) : 0;
      els.pEyebrow.textContent = c.modes[state.mode].toUpperCase();
      els.pName.textContent = c.summaryTitle(pctDone, state.mode === 'test' && pctDone >= 90);
      els.pMeta.textContent = getBlockObj(state.block)[LANG];
      return;
    }

    var q = state.currentQ;
    els.pBarWrap.classList.remove('is-off');
    els.pBar.style.width = Math.round(((state.qIndex + (state.answered ? 1 : 0)) / Math.max(1, state.queue.length)) * 100) + '%';

    if (!state.answered) {
      els.pEyebrow.textContent = c.eyebrowPrompt(q.kind, state.qIndex, state.queue.length);
      els.pName.textContent = q.promptTitle;
      els.pMeta.innerHTML = c.quizHint;
    } else {
      var ok = q.options[state.pickedIdx] && q.options[state.pickedIdx].ok;
      els.prompt.classList.add(ok ? 'is-ok' : 'is-bad');
      els.stageBox.classList.add(ok ? 'flash-ok' : 'flash-bad');
      els.pEyebrow.textContent = ok ? c.eyebrowOk : c.eyebrowBad;
      els.pName.textContent = BY_ID[q.thinkerId][LANG] + ' — ' + SCHOOLS[BY_ID[q.thinkerId].school][LANG];
      els.pMeta.textContent = BRANCHES[BY_ID[q.thinkerId].branch][LANG];
    }
  }

  function renderStageAndDock() {
    var c = COPY[LANG];
    var blockList = getBlockThinkers(state.block);

    if (state.mode === 'study') {
      var visibleList = getStudyThinkers();
      var selected = ensureValidSelected(visibleList);
      var visibleIds = visibleList.map(function (t) { return t.id; });
      renderStatsAndPrompt(visibleList);

      var branchChips = '<button class="branch-chip" type="button" data-branch="all" aria-pressed="' + String(state.branchFilter === 'all') + '" style="--bc:var(--scan)"><i></i>' + esc(c.allBranches) + '</button>' +
        Object.keys(BRANCHES).map(function (bid) {
          var b = BRANCHES[bid];
          return '<button class="branch-chip" type="button" data-branch="' + esc(bid) + '" aria-pressed="' + String(state.branchFilter === bid) + '" style="--bc:' + b.color + '"><i></i>' + esc(b[LANG]) + '</button>';
        }).join('');

      var schoolOptions = '<option value="all">' + esc(c.allSchools) + '</option>' +
        Object.keys(SCHOOLS).map(function (sid) {
          var sc = SCHOOLS[sid];
          return '<option value="' + esc(sid) + '"' + (state.schoolFilter === sid ? ' selected' : '') + '>' + esc(sc[LANG]) + '</option>';
        }).join('');

      var pills = visibleList.map(function (t) {
        var b = BRANCHES[t.branch];
        return '<button class="phil-pill" type="button" data-id="' + esc(t.id) + '" aria-pressed="' + String(selected && selected.id === t.id) + '" style="--bc:' + b.color + '">' +
          '<span class="era">' + esc(t.eraShort) + '</span> ' + esc(t[LANG]) + '</button>';
      }).join('');

      els.felt.innerHTML =
        '<div class="phil-topbar" id="branchBar">' + branchChips + '</div>' +
        '<div class="phil-subfilters">' +
          '<select class="phil-select" id="schoolSel" aria-label="Corriente">' + schoolOptions + '</select>' +
          '<input class="phil-search" id="searchInput" type="search" value="' + esc(state.search) + '" placeholder="' + esc(c.searchPh) + '">' +
        '</div>' +
        buildSchoolGuideHTML() +
        '<div class="phil-map-box" id="mapBox">' +
          buildPhilosophyMapSVG({
            maskNames: false,
            activeId: selected ? selected.id : null,
            branchFilter: state.branchFilter,
            schoolFilter: state.schoolFilter,
            visibleIds: visibleIds,
            interactive: true
          }) +
        '</div>' +
        '<div class="phil-strip" id="philStrip">' + pills + '</div>' +
        (selected ? buildInspectorHTML(selected) : '<div class="quiz-summary"><b>' + esc(c.searchNone) + '</b></div>');

      els.actions.innerHTML =
        '<button class="act" id="prevStudyBtn" type="button">' + esc(c.prev) + ' <kbd>←</kbd></button>' +
        '<button class="act" id="nextStudyBtn" type="button">' + esc(c.next) + ' <kbd>→</kbd></button>' +
        '<button class="act primary" id="studyPracticeBtn" type="button">' + esc(c.practiceThisBlock) + '</button>';

      wireStudyStageEvents(visibleList);
      return;
    }

    // Quiz Mode (Practice or Test)
    stopTimerIfDone();
    renderStatsAndPrompt(blockList);

    if (!state.currentQ) {
      var pct = state.queue.length ? Math.round((state.correct / state.queue.length) * 100) : 0;
      var passed = state.mode === 'test' && pct >= 90;
      els.felt.innerHTML =
        '<div class="quiz-summary">' +
          '<b>' + esc(c.summaryTitle(pct, passed)) + '</b>' +
          '<span>' + esc(c.summaryDesc(state.correct, state.queue.length, passed)) + '</span>' +
          '<div class="row">' +
            '<button class="btn primary" id="summaryRetry" type="button">' + esc(c.retry) + '</button>' +
            '<button class="btn" id="summaryStudy" type="button">' + esc(c.toStudy) + '</button>' +
          '</div>' +
        '</div>';
      els.actions.innerHTML = '';
      var sr = $('summaryRetry'), ss = $('summaryStudy');
      if (sr) sr.onclick = startQuizRound;
      if (ss) ss.onclick = function () { setMode('study'); };
      return;
    }

    var q = state.currentQ;
    var blockIds = blockList.map(function (t) { return t.id; });
    els.felt.innerHTML =
      '<div class="quiz-focus">' +
        '<span class="quiz-badge">' + esc(q.badge) + '</span>' +
        '<div class="quiz-case">' + q.caseHtml + '</div>' +
      '</div>' +
      '<div class="phil-map-box" id="mapBox">' +
        buildPhilosophyMapSVG({
          maskNames: !state.answered,
          activeId: q.thinkerId,
          visibleIds: blockIds,
          interactive: false
        }) +
      '</div>' +
      (state.answered ? buildInspectorHTML(BY_ID[q.thinkerId]) : '');

    if (state.answered) {
      var ph = $('inspectorPhoto');
      if (ph) {
        ph.onclick = function () { openPhotoModal(q.thinkerId); };
        ph.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPhotoModal(q.thinkerId); } };
      }
      var isLast = state.qIndex >= state.queue.length - 1;
      els.actions.innerHTML = q.options.map(function (opt, idx) {
        var cls = 'act';
        if (opt.ok) cls += ' is-right';
        else if (idx === state.pickedIdx) cls += ' is-wrong';
        return '<button class="' + cls + '" type="button" disabled><kbd>' + (idx + 1) + '</kbd>' + esc(opt.label) + '</button>';
      }).join('') +
        '<button class="act primary" id="nextBtn" type="button">' + esc(isLast ? c.viewSummary : c.nextStep) + ' <kbd>Space</kbd></button>';
      var nb = $('nextBtn');
      if (nb) nb.onclick = advanceQuestion;
    } else {
      els.actions.innerHTML = q.options.map(function (opt, idx) {
        return '<button class="act opt-btn" type="button" data-idx="' + idx + '"><kbd>' + (idx + 1) + '</kbd>' + esc(opt.label) + '</button>';
      }).join('');
      Array.prototype.forEach.call(els.actions.querySelectorAll('.opt-btn'), function (b) {
        b.onclick = function () { submitAnswer(Number(b.getAttribute('data-idx'))); };
      });
    }
  }

  function stopTimerIfDone() {
    if (!state.currentQ) stopTimer();
  }

  function wireStudyStageEvents(visibleList) {
    var branchBar = $('branchBar');
    if (branchBar) {
      Array.prototype.forEach.call(branchBar.querySelectorAll('.branch-chip'), function (btn) {
        btn.onclick = function () {
          state.branchFilter = btn.getAttribute('data-branch');
          if (state.branchFilter !== 'all' && state.schoolFilter !== 'all' && SCHOOLS[state.schoolFilter].branch !== state.branchFilter) {
            state.schoolFilter = 'all';
          }
          renderAll();
        };
      });
    }
    var schoolSel = $('schoolSel');
    if (schoolSel) {
      schoolSel.onchange = function () {
        state.schoolFilter = schoolSel.value;
        if (state.schoolFilter !== 'all') state.branchFilter = SCHOOLS[state.schoolFilter].branch;
        else state.branchFilter = 'all';
        renderAll();
      };
    }
    var searchInput = $('searchInput');
    if (searchInput) {
      searchInput.oninput = function () {
        var val = searchInput.value;
        var pos = searchInput.selectionStart;
        state.search = val;
        renderAll();
        var si2 = $('searchInput');
        if (si2) { si2.focus(); try { si2.setSelectionRange(pos, pos); } catch (_) {} }
      };
    }
    var mapBox = $('mapBox');
    if (mapBox) {
      Array.prototype.forEach.call(mapBox.querySelectorAll('.phil-node[data-id]'), function (g) {
        var selectFn = function () {
          state.selectedId = g.getAttribute('data-id');
          renderAll();
        };
        g.onclick = selectFn;
        g.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectFn(); } };
      });
    }
    var strip = $('philStrip');
    if (strip) {
      Array.prototype.forEach.call(strip.querySelectorAll('.phil-pill[data-id]'), function (btn) {
        btn.onclick = function () {
          state.selectedId = btn.getAttribute('data-id');
          renderAll();
        };
      });
    }
    var ph = $('inspectorPhoto');
    if (ph) {
      var id = ph.getAttribute('data-id');
      ph.onclick = function () { openPhotoModal(id); };
      ph.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPhotoModal(id); } };
    }
    var prevBtn = $('prevStudyBtn'), nextBtn = $('nextStudyBtn'), pracBtn = $('studyPracticeBtn');
    if (prevBtn) prevBtn.onclick = function () { stepStudy(-1, visibleList); };
    if (nextBtn) nextBtn.onclick = function () { stepStudy(1, visibleList); };
    if (pracBtn) pracBtn.onclick = function () { setMode('practice'); };
  }

  function stepStudy(delta, visibleList) {
    if (!visibleList || !visibleList.length) return;
    var idx = visibleList.findIndex(function (t) { return t.id === state.selectedId; });
    if (idx < 0) idx = 0;
    idx = (idx + delta + visibleList.length) % visibleList.length;
    state.selectedId = visibleList[idx].id;
    renderAll();
  }

  function renderAll() {
    renderStaticText();
    renderRail();
    renderStageAndDock();
  }

  /* =====================================================================
   * ACTIONS & EVENT WIRING
   * ===================================================================== */
  function setMode(m) {
    if (['study', 'practice', 'test'].indexOf(m) === -1) return;
    state.mode = m;
    STORE.set('mode', m);
    if (m === 'study') {
      stopTimer();
      renderAll();
    } else {
      startQuizRound();
    }
  }

  function setBlock(id) {
    state.block = id;
    STORE.set('block', id);
    var first = getBlockThinkers(id)[0];
    if (first) state.selectedId = first.id;
    if (state.mode === 'study') renderAll();
    else startQuizRound();
  }

  function setTask(t) {
    if (['mix', 'thinker', 'school', 'dilemma'].indexOf(t) === -1) return;
    state.task = t;
    STORE.set('task', t);
    if (state.mode === 'study') renderAll();
    else startQuizRound();
  }

  function setLang(l) {
    if (l !== 'es' && l !== 'en') return;
    LANG = l;
    STORE.set('lang', l);
    try { localStorage.setItem('todologo.lang', l); } catch (_) {}
    if (state.mode !== 'study' && state.currentQ) {
      var kind = state.currentQ.kind;
      var t = BY_ID[state.currentQ.thinkerId];
      state.currentQ = makeQuestion(t, kind);
      state.answered = false;
      state.pickedIdx = -1;
    }
    renderAll();
  }

  function toggleClean(force) {
    CLEAN = typeof force === 'boolean' ? force : !CLEAN;
    document.body.classList.toggle('clean', CLEAN);
  }

  // Rail block clicks
  els.railList.onclick = function (e) {
    var btn = e.target.closest('button.item[data-block]');
    if (!btn) return;
    setBlock(btn.getAttribute('data-block'));
  };

  els.langSel.onchange = function () { setLang(els.langSel.value); };

  Array.prototype.forEach.call(els.modeSeg.querySelectorAll('button'), function (b) {
    b.onclick = function () { setMode(b.getAttribute('data-v')); };
  });
  Array.prototype.forEach.call(els.taskSeg.querySelectorAll('button'), function (b) {
    b.onclick = function () { setTask(b.getAttribute('data-v')); };
  });

  els.restartBtn.onclick = function () {
    if (state.mode === 'study') renderAll();
    else startQuizRound();
  };
  els.cleanBtn.onclick = function () { toggleClean(true); };
  els.cleanExit.onclick = function () { toggleClean(false); };
  els.settingsBtn.onclick = function () { document.body.classList.add('sheet-open'); };
  els.closeSheet.onclick = function () { document.body.classList.remove('sheet-open'); };
  els.howBtn.onclick = function () { els.intro.hidden = false; };
  els.introGo.onclick = function () {
    els.intro.hidden = true;
    STORE.set('introSeen', true);
  };
  els.photoModalClose.onclick = function () { els.photoModal.hidden = true; };
  els.intro.onclick = function (e) { if (e.target === els.intro) els.intro.hidden = true; };
  els.photoModal.onclick = function (e) { if (e.target === els.photoModal) els.photoModal.hidden = true; };

  window.addEventListener('storage', function (e) {
    if (e.key === 'todologo.lang' && (e.newValue === 'es' || e.newValue === 'en') && e.newValue !== LANG) {
      LANG = e.newValue;
      renderAll();
    }
  });

  window.addEventListener('keydown', function (e) {
    var tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (!els.photoModal.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); els.photoModal.hidden = true; }
      return;
    }
    if (!els.intro.hidden) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        els.intro.hidden = true;
        STORE.set('introSeen', true);
      }
      return;
    }

    if (e.key === 'Escape' && CLEAN) { toggleClean(false); return; }
    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      toggleClean();
      return;
    }

    if (state.mode === 'study') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepStudy(-1, getStudyThinkers()); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); stepStudy(1, getStudyThinkers()); }
      return;
    }

    if (!state.answered && /^[1-4]$/.test(e.key)) {
      var idx = Number(e.key) - 1;
      if (state.currentQ && state.currentQ.options[idx]) {
        e.preventDefault();
        submitAnswer(idx);
      }
      return;
    }

    if (state.answered && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      advanceQuestion();
    }
  });

  // Expose pure helpers & catalog cleanly for testing/debugging
  window.__PHILOSOPHY_ATLAS__ = {
    THINKERS: THINKERS,
    SCHOOLS: SCHOOLS,
    BRANCHES: BRANCHES,
    STUDY_BLOCKS: STUDY_BLOCKS,
    buildConceptSchemaSVG: buildConceptSchemaSVG,
    buildPhilosophyMapSVG: buildPhilosophyMapSVG,
    getState: function () { return state; }
  };

  if (state.mode === 'study') renderAll();
  else startQuizRound();

  if (!STORE.get('introSeen', false)) {
    els.intro.hidden = false;
  }
})();
