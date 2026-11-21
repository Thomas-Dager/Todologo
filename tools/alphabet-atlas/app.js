/* Alfabetos del Mundo (T024) — Todologo
 * 6 sistemas de escritura fonéticos: Griego, Cirílico, Hangul, Hiragana completo (46 moras + Romaji), Hebreo y Árabe.
 * Incluye fonología articulada (IPA + posición de lengua/labios), traductor / transliterador en vivo con Romaji y audio SpeechSynthesis.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const saved = window.SiteProgress
    ? SiteProgress.tool('alphabet-atlas')
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
      docTitle: 'Alfabetos del Mundo — Todologo',
      brandMark: 'ALFABETOS <span>DEL MUNDO</span><sup>T024</sup>',
      brandSub: 'Fonología, Romaji, traductor fonético y lectura de 6 escrituras',
      railTitle: 'Alfabetos, en orden',
      railPath: 'Estudia la fonología, prueba el traductor y logra 90%+ en el Examen para marcar con ✓.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Pulsa cualquier letra para ver cómo colocar la boca y usa el traductor fonético abajo.',
        practice: 'Entrena reconocimiento de letras, Romaji/romanización y palabras reales.',
        test: '12 preguntas contrarreloj. Consigue 90% o más para marcar este alfabeto con ✓.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', chars: 'Letras', words: 'Palabras' },
      statAcc: 'Precisión',
      statTime: 'Tiempo',
      statStreak: 'Racha',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      cleanExit: 'Salir de vista limpia',
      settings: 'Ajustes',
      howItWorks: 'Cómo funciona',
      closeSheet: 'Listo',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> para elegir · <kbd>Espacio</kbd> siguiente',
      credit: 'Aprender un alfabeto fonético lleva menos de una hora si entiendes dónde suena cada símbolo en tu boca. Parte de Todologo.',
      goPractice: 'Practicar este alfabeto →',
      nextBtn: 'Siguiente',
      tryAgain: 'Intentar de nuevo',
      testDone: 'Examen completado',
      passedMsg: '¡Dominado! Lograste al menos 90% de precisión.',
      retryMsg: 'Necesitas 90% (11/12) para marcar este alfabeto. ¡Inténtalo otra vez!',
      bestNone: 'Sin marca de examen todavía en este alfabeto.',
      bestFmt: (pct, s) => `Mejor examen: <b>${pct}%</b> en ${s}s`,
      correctExcl: '¡Correcto!',
      wrongExcl: (ans) => `Era: ${ans}`,
      wordsHeading: 'Palabras reales con Romaji / romanización y pronunciación',
      phonoTitle: 'Fonología y articulación (pulsa cualquier letra para inspeccionar)',
      speakBtn: '🔊 Escuchar',
      transTitle: 'Traductor y transliterador con Romaji',
      transPlaceholder: 'Escribe una palabra en español (hola, agua, gracias...) o en romaji / texto nativo...',
      transPhrasesLbl: 'Frases útiles (clic para traducir y ver Romaji):',
      transModePhrase: 'Traducción exacta de vocabulario',
      transModeRom: 'Conversión fonética letra por letra (Transliteración / Romaji)',
      romLbl: 'Romaji / Romanización:',
      sayLbl: 'Cómo debería sonar:',
      approxVoiceNote: ' · voz fonética aproximada (sin paquete nativo en el sistema)',
      nativeVoiceNote: ' · voz nativa del navegador'
    },
    en: {
      docTitle: 'World Alphabets — Todologo',
      brandMark: 'WORLD <span>ALPHABETS</span><sup>T024</sup>',
      brandSub: 'Phonology, Romaji, phonetic translator & reading across 6 scripts',
      railTitle: 'Scripts, in order',
      railPath: 'Study phonology, try the translator, and score 90%+ on the Test for a ✓.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Click any glyph to inspect mouth/tongue placement and try the phonetic translator.',
        practice: 'Practice character recognition, Romaji/romanization, and real-word reading.',
        test: '12 timed questions. Score 90% or higher to earn a ✓ on this script.'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mixed', chars: 'Characters', words: 'Real words' },
      statAcc: 'Accuracy',
      statTime: 'Time',
      statStreak: 'Streak',
      restart: 'Restart',
      cleanView: 'Clean view',
      cleanExit: 'Exit clean view',
      settings: 'Settings',
      howItWorks: 'How it works',
      closeSheet: 'Done',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> to pick · <kbd>Space</kbd> next',
      credit: 'Learning a phonetic script takes under an hour once you map each symbol to exact tongue and lip articulation. Part of Todologo.',
      goPractice: 'Practice this script →',
      nextBtn: 'Next',
      tryAgain: 'Run again',
      testDone: 'Test complete',
      passedMsg: 'Mastered! You scored 90% or higher.',
      retryMsg: 'Score 90% (11/12) to earn a tick on this script. Give it another run!',
      bestNone: 'No test score saved for this script yet.',
      bestFmt: (pct, s) => `Best test: <b>${pct}%</b> in ${s}s`,
      correctExcl: 'Correct!',
      wrongExcl: (ans) => `Answer: ${ans}`,
      wordsHeading: 'Real words with Romaji / romanization & phonetic reading',
      phonoTitle: 'Phonology & articulation (click any glyph to inspect)',
      speakBtn: '🔊 Listen',
      transTitle: 'Phonetic Translator & Romaji Transliterator',
      transPlaceholder: 'Type an English/Spanish word (hello, water, thanks...) or romaji / native text...',
      transPhrasesLbl: 'Useful phrases (click to translate):',
      transModePhrase: 'Direct vocabulary translation',
      transModeRom: 'Letter-by-letter phonetic conversion (Transliteration / Romaji)',
      romLbl: 'Romaji / Romanization:',
      sayLbl: 'How it should sound:',
      approxVoiceNote: ' · approximated voice (native TTS pack not installed)',
      nativeVoiceNote: ' · native browser voice'
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

  // ---------------- Web Speech Audio + Offline Fallback (desactivado temporalmente) ----------------
  // Cambia ENABLE_AUDIO a true para reactivar la reproducción de voz y los botones 🔊.
  const ENABLE_AUDIO = false;
  let lastVoiceMode = '';
  function speakText(nativeText, fallbackPhonetic, bcp47) {
    if (!ENABLE_AUDIO) return '';
    const ss = window.speechSynthesis;
    if (!ss || typeof window.SpeechSynthesisUtterance !== 'function') {
      beepFallback();
      return '';
    }
    try { ss.cancel(); } catch (_) {}
    const voices = ss.getVoices ? ss.getVoices() : [];
    const prefix = (bcp47 || '').split('-')[0].toLowerCase();
    const match = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
    const u = new window.SpeechSynthesisUtterance(match ? nativeText : (fallbackPhonetic || nativeText));
    u.lang = match ? match.lang : (LANG === 'en' ? 'en-US' : 'es-ES');
    if (match) u.voice = match;
    u.rate = 0.88;
    try { ss.speak(u); } catch (_) { beepFallback(); }
    lastVoiceMode = match ? 'native' : 'approx';
    return lastVoiceMode;
  }

  function beepFallback() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 520;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  // ---------------- Fonología por letra + Romaji + Traductor ----------------
  // chars: [glyph, name, romaji/sound, mnemonic, ipa, articulationEs, articulationEn]
  // words: [native, romaji, phoneticSay, meaningEs, meaningEn]
  // dict:  [esKeys[], enKeys[], native, romaji, sayGuide, meanEs, meanEn]
  const SCRIPTS = [
    {
      id: 'greek',
      tts: 'el-GR',
      title: { es: 'Griego (Ελληνικά)', en: 'Greek (Ελληνικά)' },
      sub: {
        es: 'Las 24 letras griegas: fonología moderna/clásica, IPA y lectura viva.',
        en: 'All 24 Greek letters with phonology, IPA and live reading.'
      },
      phonoSummary: {
        es: '<b>Rasgos fonológicos del griego moderno:</b> <code>Η, Ι, Υ</code> convergen hacia /i/; <code>Θ</code> suena como la «z» castellana /θ/; <code>Δ</code> suena como la «d» suave entre vocales /ð/; <code>Γ</code> delante de e/i suaviza a «y» /ʝ/; y <code>Ρ</code> siempre vibra como «r» suave.',
        en: '<b>Modern Greek phonology:</b> <code>Η, Ι, Υ</code> merge toward /i/; <code>Θ</code> is English voiceless "th" /θ/; <code>Δ</code> is voiced "th" as in "this" /ð/; <code>Ρ</code> is a tapped "r" /r/; <code>Χ</code> is a raspy velar/palatal /x/.'
      },
      ruleHtml: {
        es: '<b>Truco clave:</b> Muchas letras coinciden con el latín (<code>Α, Β, Ε, Ζ, Ι, Κ, Μ, Ν, Ο, Τ</code>), pero vigila las trampas visuales: <code>Η η (Eta = I)</code>, <code>Ρ ρ (Ro = R)</code>, <code>Χ χ (Ji = J/Kh)</code> y <code>Β β (Vita = V labial)</code>.',
        en: '<b>Key trick:</b> Many glyphs match Latin (<code>Α, Β, Ε, Ζ, Ι, Κ, Μ, Ν, Ο, Τ</code>), but watch out for visual traps: <code>Η η (/i/)</code>, <code>Ρ ρ (/r/)</code>, <code>Χ χ (/x/)</code> and <code>Β β (/v/)</code>.'
      },
      chars: [
        ['Α α', 'Alfa', 'a', 'Origen de nuestra A', '/a/', 'A abierta clara como en «casa».', 'Open front vowel like "a" in "father".'],
        ['Β β', 'Beta (Vita)', 'v / b', 'Origen de nuestra B', '/v/', 'En griego moderno suena como «v» labiodental (en clásico «b»).', 'Voiced labiodental "v" in Modern Greek (like "vine").'],
        ['Γ γ', 'Gamma', 'g / y', 'Ángulo recto en esquina superior', '/ɣ ~ ʝ/', 'Suave como la «g» de «agua» (y como «y» ante e/i).', 'Soft voiced velar fricative; "y" before e/i.'],
        ['Δ δ', 'Delta', 'd / dh', 'Triángulo como el delta de un río', '/ð/', 'Exactamente la «d» intervocálica de «cada» o «th» de «this».', 'Voiced dental fricative like "th" in "this".'],
        ['Ε ε', 'Épsilon', 'e', 'E corta', '/e/', 'Vocal media «e» clara como en «mesa».', 'Mid-open "e" as in "bet".'],
        ['Ζ ζ', 'Dzeta', 'z', 'Zigzag de la Z', '/z/', 'Sibilante sonora vibrante como una abeja (/z/).', 'Voiced "z" as in "zoo".'],
        ['Η η', 'Eta', 'i / e', 'Parece H pero es vocal (I en moderno)', '/i/', 'En griego actual suena exactamente como /i/.', 'Pronounced /i/ ("ee") in Modern Greek.'],
        ['Θ θ', 'Theta', 'th / z', 'Círculo con lengua en medio', '/θ/', 'Punta de la lengua entre dientes: «z» española o «th» de «think».', 'Tongue tip between teeth: "th" in "think".'],
        ['Ι ι', 'Iota', 'i', 'La letra más pequeña («ni una iota»)', '/i/', 'Vocal cerrada /i/ limpia.', 'High front /i/ ("ee").'],
        ['Κ κ', 'Kappa', 'k', 'Sonido K directo', '/k/', 'Oclusiva velar sorda sin aspiración fuerte.', 'Unaspirated crisp "k".'],
        ['Λ λ', 'Lambda', 'l', 'Tejado triangular (longitud de onda λ)', '/l/', 'Lateral alveolar como nuestra «l» en «luna».', 'Clear alveolar "l".'],
        ['Μ μ', 'Mi (Mu)', 'm', 'Prefijo micro (μ)', '/m/', 'Bilabial nasal «m» normal.', 'Bilabial nasal "m".'],
        ['Ν ν', 'Ni (Nu)', 'n', 'En minúscula parece una v pero suena N', '/n/', 'Alveolar nasal «n».', 'Alveolar nasal "n".'],
        ['Ξ ξ', 'Xi', 'x / ks', 'Tres barras horizontales = sonido doble KS', '/ks/', 'Secuencia seca «k+s» como en «taxi».', 'Double consonant cluster "ks" as in "taxi".'],
        ['Ο ο', 'Ómicron', 'o', '«O pequeña»', '/o/', 'O media redondeada como en «oro».', 'Pure rounded "o".'],
        ['Π π', 'Pi', 'p', 'Dos columnas y dintel (3.1416)', '/p/', 'Bilabial «p» pura sin soplo de aire.', 'Unaspirated "p" without air puff.'],
        ['Ρ ρ', 'Ro (Rho)', 'r', '¡Falsa amiga! Parece P pero suena R', '/r/', 'Vibrante simple como «r» de «pero» o doble al principio.', 'Tapped or lightly rolled "r".'],
        ['Σ σ/ς', 'Sigma', 's', 'Símbolo de sumatoria matemática', '/s/', 'S sorda tensa («ς» solo al final de palabra).', 'Crisp voiceless "s" ("ς" only at word end).'],
        ['Τ τ', 'Tau', 't', 'Cruz en forma de T', '/t/', 'Dental «t» seca sin aspiración.', 'Clean dental "t".'],
        ['Υ υ', 'Ípsilon', 'i / y', 'Origen de Y / U', '/i/', 'En griego moderno suena igual que /i/.', 'Sounds like /i/ ("ee") in Modern Greek.'],
        ['Φ φ', 'Fi (Phi)', 'f', 'Círculo atravesado (proporción áurea φ)', '/f/', 'Fricativa labiodental «f» (dientes superiores sobre labio inferior).', 'Labiodental "f" as in "photo".'],
        ['Χ χ', 'Ji (Chi)', 'kh / j', 'Cruz en aspa, sonido J fuerte', '/x ~ ç/', 'Fuerte como nuestra «j» de «jamón» o algo más suave ante e/i.', 'Guttural "ch" as in Bach / Loch.'],
        ['Ψ ψ', 'Psi', 'ps', 'Tridente de Poseidón (Psicología)', '/ps/', 'Se pronuncian juntas la p y la s («ps»).', 'Pronounce both "p" and "s" smoothly.'],
        ['Ω ω', 'Omega', 'o', '«Gran O», última letra y símbolo de Ohmio', '/o/', 'Hoy suena igual que ómicron: una «o» clara.', 'Today pronounced cleanly like "o".']
      ],
      words: [
        ['ΑΘΗΝΑ', 'Athína', 'a-THÍ-na (/aˈθina/)', 'Atenas', 'Athens'],
        ['ΦΙΛΟΣΟΦΙΑ', 'Filosofía', 'fi-lo-so-FÍ-a', 'Filosofía (amor al saber)', 'Philosophy'],
        ['ΚΟΣΜΟΣ', 'Kósmos', 'KÓS-mos (/ˈkozmos/)', 'Orden / Universo', 'Cosmos / Order'],
        ['ΛΟΓΟΣ', 'Lógos', 'LÓ-gos (/ˈloɣos/)', 'Palabra / Razón', 'Word / Reason'],
        ['ΘΕΑΤΡΟ', 'Théatro', 'THÉ-a-tro (/ˈθeatro/)', 'Teatro', 'Theater'],
        ['ΔΗΜΟΚΡΑΤΙΑ', 'Dimokratía', 'di-mo-kra-TÍ-a', 'Democracia', 'Democracy'],
        ['ΩΚΕΑΝΟΣ', 'Okeanós', 'o-ke-a-NÓS', 'Océano', 'Ocean'],
        ['ΨΥΧΗ', 'Psijí', 'psi-JÍ (/psiˈçi/)', 'Alma / Mente', 'Soul / Mind'],
        ['ΑΛΦΑΒΗΤΟ', 'Alfávito', 'al-FÁ-vi-to', 'Alfabeto', 'Alphabet'],
        ['ΜΟΥΣΙΚΗ', 'Musikí', 'mu-si-KÍ', 'Música', 'Music'],
        ['ΙΣΤΟΡΙΑ', 'Istoría', 'is-to-RÍ-a', 'Historia', 'History'],
        ['ΕΛΛΑΔΑ', 'Elláda', 'e-LÁ-da', 'Grecia', 'Greece']
      ],
      dict: [
        [['hola', 'saludo', 'buenas'], ['hello', 'hi'], 'Γεια σου', 'Geia sou', 'YÁ-su (/ˈʝasu/)', 'Hola', 'Hello'],
        [['gracias', 'muchas gracias'], ['thanks', 'thank you'], 'Ευχαριστώ', 'Efcharistó', 'ef-ja-ris-TÓ', 'Gracias', 'Thank you'],
        [['agua'], ['water'], 'Νερό', 'Neró', 'ne-RÓ', 'Agua', 'Water'],
        [['cafe', 'café'], ['coffee'], 'Καφές', 'Kafés', 'ka-FÉS', 'Café', 'Coffee'],
        [['por favor'], ['please'], 'Παρακαλώ', 'Parakaló', 'pa-ra-ka-LÓ', 'Por favor', 'Please'],
        [['si', 'sí'], ['yes'], 'Ναι', 'Nai', 'NE (¡atención: Nai = Sí!)', 'Sí', 'Yes'],
        [['no'], ['no'], 'Όχι', 'Óchi', 'Ó-ji', 'No', 'No'],
        [['amor'], ['love'], 'Αγάπη', 'Agápi', 'a-GÁ-pi', 'Amor', 'Love'],
        [['amigo'], ['friend'], 'Φίλος', 'Fílos', 'FÍ-los', 'Amigo', 'Friend'],
        [['buenos dias', 'buenos días'], ['good morning'], 'Καλημέρα', 'Kaliméra', 'ka-li-MÉ-ra', 'Buenos días', 'Good morning']
      ],
      transMap: {
        a: 'α', b: 'β', c: 'κ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'χ', i: 'ι', j: 'χ', k: 'κ',
        l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'π', q: 'κ', r: 'ρ', s: 'σ', t: 'τ', u: 'υ', v: 'β',
        w: 'ου', x: 'ξ', y: 'υ', z: 'ζ', ch: 'χ', th: 'θ', ps: 'ψ', ph: 'φ', ks: 'ξ'
      }
    },
    {
      id: 'cyrillic',
      tts: 'ru-RU',
      title: { es: 'Cirílico (Кириллица)', en: 'Cyrillic (Кириллица)' },
      sub: {
        es: 'Fonología rusa/eslava, falsas amigas, romanización y audio en vivo.',
        en: 'Slavic/Russian phonology, false friends, romanization & live speech.'
      },
      phonoSummary: {
        es: '<b>Regla fonológica vital del ruso:</b> La letra <code>О</code> solo suena «o» cuando lleva el acento; en sílabas átonas se pronuncia como una «a» relajada (<i>akanye</i>, ej. <code>Москва́ → Maskvá</code>). Además <code>Ж</code> es como la «ll» porteña vibrante /ʐ/ y <code>Ш</code> suena como «sh» inglesa retrofleja.',
        en: '<b>Crucial Russian phonology rule:</b> Unstressed <code>О</code> weakens to "a" (<i>akanye</i>: <code>Москва́ → Maskvá</code>). <code>Ж</code> is a deep "zh" (/ʐ/, like "measure"), while <code>Х</code> is strong guttural "kh" (/x/).'
      },
      ruleHtml: {
        es: '<b>Las 6 «Falsas Amigas» que debes memorizar primero:</b><br><code>В = V</code>, <code>Е = Ye</code>, <code>Н = N</code>, <code>Р = R</code>, <code>С = S</code>, <code>У = U</code>, <code>Х = J/Kh</code>. En cambio <code>Б</code> es la verdadera <b>B</b> y <code>П</code> es la verdadera <b>P</b>.',
        en: '<b>The 6 "False Friends" first:</b><br><code>В = V</code>, <code>Е = Ye</code>, <code>Н = N</code>, <code>Р = R</code>, <code>С = S</code>, <code>У = U</code>, <code>Х = Kh</code>. True <b>B</b> is <code>Б</code> and true <b>P</b> is <code>П</code>.'
      },
      chars: [
        ['А а', 'A', 'a', 'Amiga verdadera = A', '/a/', 'Vocal abierta «a».', 'Open "a" like in "father".'],
        ['Б б', 'Be', 'b', 'Barriga abajo y visera arriba = B', '/b/', 'Bilabial sonora «b» fuerte (como «boca»).', 'Hard voiced bilabial "b".'],
        ['В в', 'Ve', 'v', 'Falsa amiga: parece B pero suena V', '/v/', 'Labiodental sonora: dientes sobre labio inferior vibrante.', 'Labiodental "v" as in "vine".'],
        ['Г г', 'Gue', 'g', 'Igual a la Gamma griega (Г) = G', '/ɡ/', 'Siempre oclusiva suave «ga, gue, gui» (nunca j).', 'Hard "g" as in "go".'],
        ['Д д', 'De', 'd', 'Casa con dos patas sobre la mesa = D', '/d/', 'Dental «d» firme.', 'Clean dental "d".'],
        ['Е е', 'Ye', 'ye / e', 'Suena Ye / E', '/je ~ ʲe/', 'Al inicio suena «ye»; tras consonante la suaviza («palataliza»).', 'Sounds "ye" initially; softens preceding consonant.'],
        ['Ж ж', 'Zhe', 'zh', 'Escarabajo simétrico = ZH sonora', '/ʐ/', 'Como la «sh» pero haciendo vibrar la garganta (o «j» francesa).', 'Like "s" in "measure" or "treasure".'],
        ['З з', 'Ze', 'z', 'Parece el número 3 pero es Z sonora', '/z/', 'Como una «s» haciendo vibrar las cuerdas vocales.', 'Voiced "z" as in "zoo".'],
        ['И и', 'I', 'i', 'N invertida en espejo = vocal I', '/i/', 'Vocal «i» limpia y aguda.', 'High "ee" sound.'],
        ['Й й', 'I corta', 'y / j', 'I con tilde curva arriba', '/j/', 'Semivocal breve como la «y» de «rey» u «hoy».', 'Short glide "y" as in "boy".'],
        ['К к', 'Ka', 'k', 'Amiga verdadera = K', '/k/', 'Oclusiva «k» sin soplo de aire.', 'Unaspirated crisp "k".'],
        ['Л л', 'El', 'l', 'Tienda de campaña (Lambda) = L', '/ɫ ~ lʲ/', '«L» algo más oscura y trasera ante vocales duras.', 'Dark "l" before hard vowels.'],
        ['М м', 'Em', 'm', 'Amiga verdadera = M', '/m/', 'Bilabial nasal «m».', 'Bilabial "m".'],
        ['Н н', 'En', 'n', 'Falsa amiga: parece H pero suena N', '/n/', 'Alveolar nasal «n».', 'Alveolar "n".'],
        ['О о', 'O', 'o (átona a)', 'Amiga verdadera = O', '/o ~ ɐ/', 'Suena «o» si lleva acento; «a» suave si es átona.', 'Pure "o" when stressed; weakens to "a" when unstressed.'],
        ['П п', 'Pe', 'p', 'Portería de fútbol (Pi griega) = P', '/p/', 'Bilabial «p» firme.', 'Unaspirated "p".'],
        ['Р р', 'Er', 'r', 'Falsa amiga: parece P pero suena R', '/r/', 'Vibrante alveolar como la «r/rr» española.', 'Rolled alveolar "r".'],
        ['С с', 'Es', 's', 'Falsa amiga: parece C pero suena S', '/s/', 'S sorda siempre (como en «sol»).', 'Crisp voiceless "s".'],
        ['Т т', 'Te', 't', 'Amiga verdadera = T', '/t/', 'Dental «t» firme.', 'Unaspirated "t".'],
        ['У у', 'U', 'u', 'Falsa amiga: parece y pero suena U', '/u/', 'Vocal cerrada con labios bien redondeados «u».', 'Rounded "oo" as in "moon".'],
        ['Ф ф', 'Ef', 'f', 'Círculo partido (Fi griega) = F', '/f/', 'Fricativa labiodental «f».', 'Labiodental "f".'],
        ['Х х', 'Ja (Kha)', 'kh / j', 'Falsa amiga: parece X pero suena J', '/x/', 'Fricativa velar como «j» española en «jota».', 'Guttural "ch" as in Bach.'],
        ['Ц ц', 'Tse', 'ts', 'U cuadrada con patita = TS', '/ts/', 'Africada «t+s» juntas en un solo golpe (como «pizza»).', 'Sharp "ts" as in "cats".'],
        ['Ч ч', 'Che', 'ch', 'Parece un 4 o una silla = CH', '/tɕ/', '«Ch» muy suave y palatal (con lengua alta).', 'Soft palatal "ch" as in "cheese".'],
        ['Ш ш', 'Sha', 'sh', 'Tridente cuadrado = SH', '/ʂ/', 'Sonido «sh» retroflejo con punta de lengua atrás.', 'Deep "sh" as in "shoe".'],
        ['Э э', 'E', 'e', 'E abierta mirando a la izquierda', '/ɛ/', '«E» seca sin «y» delante.', 'Pure open "e" without "y" glide.'],
        ['Ю ю', 'Yu', 'yu', 'I + O unidas = YU', '/ju/', '«Y + u» (como «you» en inglés).', '"You" sound.'],
        ['Я я', 'Ya', 'ya', 'R en espejo = YA', '/ja/', '«Y + a» («Yo» en ruso).', '"Ya" as in "yard".']
      ],
      words: [
        ['МОСКВА', 'Moskvá', 'mas-KVÁ (/mɐskˈva/)', 'Moscú', 'Moscow'],
        ['РЕСТОРАН', 'Restorán', 'ries-ta-RÁN', 'Restaurante', 'Restaurant'],
        ['КОСМОС', 'Kósmos', 'KÓS-mas', 'Espacio / Cosmos', 'Space / Cosmos'],
        ['МЕТРО', 'Metró', 'mie-TRÓ', 'Metro subterráneo', 'Subway / Metro'],
        ['ТЕАТР', 'Teátr', 'tie-ÁTR', 'Teatro', 'Theater'],
        ['БИБЛИОТЕКА', 'Bibliotéka', 'bi-bli-a-TIÉ-ka', 'Biblioteca', 'Library'],
        ['ПРИВЕТ', 'Privét', 'pri-VIÉT (/prʲɪˈvʲet/)', 'Hola (informal)', 'Hi / Hello'],
        ['СПАСИБО', 'Spasíbo', 'spa-SÍ-ba (/spɐˈsʲibə/)', 'Gracias', 'Thank you'],
        ['МУЗЫКА', 'Múzyka', 'MÚ-zy-ka', 'Música', 'Music'],
        ['ВОДА', 'Vodá', 'va-DÁ', 'Agua', 'Water'],
        ['РОССИЯ', 'Rossíya', 'ra-SÍ-ya', 'Rusia', 'Russia'],
        ['ПЛАНЕТА', 'Planéta', 'pla-NIÉ-ta', 'Planeta', 'Planet']
      ],
      dict: [
        [['hola', 'saludo'], ['hello', 'hi'], 'Привет', 'Privét', 'pri-VIÉT', 'Hola (informal)', 'Hi / Hello'],
        [['buenos dias', 'buenos días'], ['good morning'], 'Доброе утро', 'Dóbroye útro', 'DÓ-bra-ye Ú-tra', 'Buenos días', 'Good morning'],
        [['gracias'], ['thanks', 'thank you'], 'Спасибо', 'Spasíbo', 'spa-SÍ-ba', 'Gracias', 'Thank you'],
        [['agua'], ['water'], 'Вода', 'Vodá', 'va-DÁ', 'Agua', 'Water'],
        [['cafe', 'café'], ['coffee'], 'Кофе', 'Kófe', 'KÓ-fie', 'Café', 'Coffee'],
        [['por favor'], ['please'], 'Пожалуйста', 'Pozháluysta', 'pa-ZHÁ-lus-ta', 'Por favor', 'Please'],
        [['si', 'sí'], ['yes'], 'Да', 'Da', 'DA', 'Sí', 'Yes'],
        [['no'], ['no'], 'Нет', 'Net', 'NIÉT', 'No', 'No'],
        [['amigo'], ['friend'], 'Друг', 'Drug', 'DRUK', 'Amigo', 'Friend'],
        [['amor'], ['love'], 'Любовь', 'Lyubóv', 'liu-BÓF', 'Amor', 'Love']
      ],
      transMap: {
        a: 'а', b: 'б', c: 'к', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'х', i: 'и', j: 'ж', k: 'к',
        l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'к', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в',
        w: 'в', x: 'кс', y: 'й', z: 'з', ch: 'ч', sh: 'ш', ya: 'я', yu: 'ю', ye: 'е', zh: 'ж', ts: 'ц'
      }
    },
    {
      id: 'hangul',
      tts: 'ko-KR',
      title: { es: 'Hangul Coreano (한글)', en: 'Korean Hangul (한글)' },
      sub: {
        es: 'Alfabeto anatómico: cómo suena cada consonante simple, aspirada y vocal.',
        en: 'Featural alphabet: simple vs aspirated consonants, vowels & live voice.'
      },
      phonoSummary: {
        es: '<b>Fonología coreana (el secreto del aire):</b> Las consonantes básicas (<code>ㄱ g/k, ㄷ d/t, ㅂ b/p, ㅈ j</code>) son suaves al inicio de palabra y sonoras entre vocales; sus hermanas con un trazo extra (<code>ㅋ k, ㅌ t, ㅍ p, ㅊ ch</code>) llevan un <b>fuerte golpe de aire</b>. La <code>ㄹ</code> nunca es tan fuerte como nuestra «rr»: suena entre una «r» suave de «pero» y una «l».',
        en: '<b>Korean phonology (breath control):</b> Plain stops (<code>ㄱ, ㄷ, ㅂ, ㅈ</code>) are slack initially and voiced between vowels; extra-stroke letters (<code>ㅋ, ㅌ, ㅍ, ㅊ</code>) release a strong burst of air. <code>ㅇ</code> is completely silent initially and sounds "-ng" at syllable end.'
      },
      ruleHtml: {
        es: '<b>Diseñado científicamente en 1443:</b> Cada consonante dibuja la lengua o labios vista de perfil (<code>ㄱ = lengua atrás</code>, <code>ㄴ = punta arriba</code>, <code>ㅁ = labios cuadrados</code>, <code>ㅇ = garganta abierta</code>).',
        en: '<b>Scientifically designed in 1443:</b> Consonants diagram speech organs (<code>ㄱ = tongue back</code>, <code>ㄴ = tongue tip</code>, <code>ㅁ = lips</code>, <code>ㅇ = open throat</code>).'
      },
      chars: [
        ['ㄱ', 'Giyeok', 'g / k', 'Lengua curvada atrás = G/K', '/k ~ ɡ/', 'Suave entre k y g al inicio; g sonora en medio de vocales.', 'Light voiceless k initially; soft g between vowels.'],
        ['ㄴ', 'Nieun', 'n', 'Lengua tocando encía superior = N', '/n/', 'Alveolar «n» idéntica al español.', 'Clean alveolar "n".'],
        ['ㄷ', 'Digeut', 'd / t', 'Puerta (Door) = D/T', '/t ~ d/', 'Entre t y d suave al inicio; d sonora en medio.', 'Light d/t initially; voiced d mid-word.'],
        ['ㄹ', 'Rieul', 'r / l', 'Serpiente zigzagueante = R/L', '/ɾ ~ l/', '«R» suave como «cara» entre vocales; «l» si cierra sílaba.', 'Light tap "r" between vowels; "l" at syllable end.'],
        ['ㅁ', 'Mieum', 'm', 'Boca cuadrada (Mouth) = M', '/m/', 'Bilabial nasal «m».', 'Bilabial "m".'],
        ['ㅂ', 'Bieup', 'b / p', 'Cubo (Bucket) = B/P', '/p ~ b/', 'Entre p y b suave al inicio; b sonora entre vocales.', 'Soft p/b initially; voiced b between vowels.'],
        ['ㅅ', 'Siot', 's / sh', 'Diente = S', '/s ~ ɕ/', '«S» suave (y suena como «sh» delante de i/y).', 'Breathy "s" ("sh" before "i").'],
        ['ㅇ', 'Ieung', 'muda / -ng', 'Círculo: muda al inicio, -NG final', '/∅ ~ ŋ/', 'Silenciosa delante de vocal; «-ng» nasal al final.', 'Silent as initial; "-ng" as in "song" at end.'],
        ['ㅈ', 'Jieut', 'j / ch', 'Sombrero sobre S = J', '/tɕ ~ dʑ/', 'Como «ch/y» suave sonora inglesa de «jeans».', 'Soft "j" as in "jeans".'],
        ['ㅊ', 'Chieut', 'ch', 'ㅈ con antena = CH aspirada', '/tɕʰ/', '«Ch» explosiva expulsando aire fuerte.', 'Strongly aspirated "ch".'],
        ['ㅋ', 'Kieuk', 'k', 'ㄱ con trazo extra = K fuerte', '/kʰ/', '«K» acompañada de un claro soplo de aire.', 'Strongly aspirated "k" with burst of air.'],
        ['ㅌ', 'Tieut', 't', 'ㄷ con barra central = T fuerte', '/tʰ/', '«T» explosiva con soplo de aire.', 'Strongly aspirated "t".'],
        ['ㅍ', 'Pieup', 'p', 'Dos pilares = P fuerte', '/pʰ/', '«P» explosiva con soplo de aire.', 'Strongly aspirated "p".'],
        ['ㅎ', 'Hieuh', 'h', 'Hombre con sombrero = H', '/h/', '«H» aspirada inglesa suave (como suspiro, no j fuerte).', 'Soft glottal "h" breath.'],
        ['ㅏ', 'A', 'a', 'Trazo hacia la derecha = A', '/a/', 'Vocal «a» abierta y clara.', 'Open "a" as in "father".'],
        ['ㅓ', 'Eo', 'eo / o', 'Trazo hacia la izquierda = EO', '/ʌ/', 'Abre la boca como para decir «a» pero redondea un poco como «o».', 'Unrounded open "uh/aw" as in "cup".'],
        ['ㅗ', 'O', 'o', 'Trazo hacia arriba = O', '/o/', '«O» bien cerrada con labios en círculo.', 'Rounded "o".'],
        ['ㅜ', 'U', 'u', 'Trazo hacia abajo = U', '/u/', '«U» bien cerrada.', 'Rounded "oo".'],
        ['ㅡ', 'Eu', 'eu', 'Suelo llano = EU', '/ɯ/', 'Pon los labios estirados en sonrisa e intenta decir «u».', 'Spread lips wide while trying to say "oo".'],
        ['ㅣ', 'I', 'i', 'Árbol vertical = I', '/i/', 'Vocal «i» limpia.', 'High front "ee".']
      ],
      words: [
        ['한국', 'Hanguk', 'han-GUK (/hanɡuk̚/)', 'Corea', 'Korea'],
        ['서울', 'Seoul', 'SO-ul (/sʌul/)', 'Seúl', 'Seoul'],
        ['김치', 'Gimchi', 'KIM-chi (/kimtɕʰi/)', 'Kimchi', 'Kimchi'],
        ['태권도', 'Taekwondo', 'te-kuón-DO', 'Taekwondo', 'Taekwondo'],
        ['비빔밥', 'Bibimbap', 'pi-bim-BAP', 'Bibimbap (arroz mezclado)', 'Bibimbap'],
        ['나무', 'Namu', 'NA-mu', 'Árbol', 'Tree'],
        ['바다', 'Bada', 'PA-da', 'Mar', 'Sea'],
        ['사랑', 'Sarang', 'sa-RANG (/saɾaŋ/)', 'Amor', 'Love'],
        ['커피', 'Keopi', 'KO-pi', 'Café', 'Coffee'],
        ['친구', 'Chingu', 'chin-GU', 'Amigo', 'Friend'],
        ['하늘', 'Haneul', 'ja-NÜL', 'Cielo', 'Sky'],
        ['음악', 'Eumak', 'üm-AK', 'Música', 'Music']
      ],
      dict: [
        [['hola', 'saludo'], ['hello', 'hi'], '안녕하세요', 'Annyeonghaseyo', 'an-niong-ha-se-YO', 'Hola (cortés)', 'Hello (polite)'],
        [['gracias'], ['thanks', 'thank you'], '감사합니다', 'Gamsahamnida', 'kam-sa-ham-ni-DA', 'Gracias', 'Thank you'],
        [['agua'], ['water'], '물', 'Mul', 'MUL', 'Agua', 'Water'],
        [['cafe', 'café'], ['coffee'], '커피', 'Keopi', 'KO-pi', 'Café', 'Coffee'],
        [['si', 'sí'], ['yes'], '네', 'Ne', 'NE', 'Sí', 'Yes'],
        [['no'], ['no'], '아니요', 'Aniyo', 'a-ni-YO', 'No', 'No'],
        [['amor', 'te amo'], ['love', 'i love you'], '사랑해', 'Saranghae', 'sa-rang-JE', 'Te quiero / Amor', 'Love / I love you'],
        [['amigo'], ['friend'], '친구', 'Chingu', 'chin-GU', 'Amigo', 'Friend'],
        [['por favor'], ['please'], '주세요', 'Juseyo', 'chu-se-YO', 'Por favor (deme)', 'Please give me'],
        [['corea'], ['korea'], '한국', 'Hanguk', 'han-GUK', 'Corea', 'Korea']
      ],
      transMap: null // Uses custom Hangul syllable block assembler below
    },
    {
      id: 'hiragana',
      tts: 'ja-JP',
      title: { es: 'Hiragana Japonés (ひらがな)', en: 'Japanese Hiragana (ひらがな)' },
      sub: {
        es: 'Las 46 moras base del silabario japonés con Romaji completo, fonología y audio.',
        en: 'All 46 core Japanese Hiragana syllables with full Romaji, phonology & voice.'
      },
      phonoSummary: {
        es: '<b>Fonología japonesa (para hispanohablantes es facilísima):</b> Sus 5 vocales coinciden casi con el español, excepto la <code>u (う)</code> sin sacar los labios; la <code>r (ら, り, る, れ, ろ)</code> siempre es suave como «pero» (nunca doble «rr»); la <code>h</code> es suave aspirada salvo en <code>ふ (fu)</code> donde soplas suavemente entre ambos labios; y <code>し (shi)</code> + <code>ち (chi)</code> + <code>つ (tsu)</code> tienen sonido propio.',
        en: '<b>Japanese phonology (mora timing):</b> Vowels are crisp and pure (<code>u</code> has relaxed, unprotruded lips). Every syllable gets equal beat length! <code>r</code> is an alveolar tap (between l/r/d), <code>し</code> is "shi", <code>つ</code> is "tsu", and <code>ふ</code> blows softly between both lips ("fu").'
      },
      ruleHtml: {
        es: '<b>Tabla completa de 46 silabogramas (Gojūon) + Romaji:</b> Cada carácter representa un golpe rítmico exacto (<i>mora</i>). Escribe cualquier palabra en <b>Romaji</b> abajo (p. ej. <code>konnichiwa</code>, <code>sakura</code>, <code>tokyo</code>, <code>arigato</code>) para pasarla a Hiragana y escucharla.',
        en: '<b>Full 46-mora Gojūon chart + Romaji:</b> Every glyph represents one fixed beat (mora). Type any <b>Romaji</b> below (e.g. <code>konnichiwa</code>, <code>sakura</code>, <code>arigato</code>) to convert to Hiragana and hear it spoken.'
      },
      chars: [
        ['あ', 'a', 'a', 'A cursiva con lazo', '/a/', '«a» clara y breve.', 'Clean short "a".'],
        ['い', 'i', 'i', 'Dos palos verticales (ii)', '/i/', '«i» limpia.', 'Clean "ee".'],
        ['う', 'u', 'u', 'U ladeada con tilde', '/ɯ/', '«u» relajada sin proyectar los labios hacia adelante.', 'Unrounded "oo" with relaxed lips.'],
        ['え', 'e', 'e', 'Ave corriendo = E', '/e/', '«e» abierta clara.', 'Crisp "e" as in "met".'],
        ['お', 'o', 'o', 'Palo de golf + bola = O', '/o/', '«o» corta sin diptongo.', 'Pure short "o".'],
        ['か', 'ka', 'ka', 'Hoja de katana', '/ka/', '«ka» seca sin aspiración fuerte.', 'Clean "ka".'],
        ['き', 'ki', 'ki', 'Llave antigua (Key)', '/ki/', '«ki» limpia.', 'Clean "key".'],
        ['く', 'ku', 'ku', 'Pico de cuco (<)', '/kɯ/', '«ku» relajada.', 'Crisp "ku".'],
        ['け', 'ke', 'ke', 'Barril (Keg)', '/ke/', '«ke» limpia.', 'Crisp "ke".'],
        ['こ', 'ko', 'ko', 'Dos gusanos (KOi)', '/ko/', '«ko» limpia.', 'Crisp "ko".'],
        ['さ', 'sa', 'sa', 'Una barra sobre curva (SA)', '/sa/', '«sa» sorda.', 'Crisp "sa".'],
        ['し', 'shi', 'shi', 'Anzuelo curvo (no existe «si»)', '/ɕi/', 'Palatal «sh+i» suave («shi»).', 'Soft palatal "shi" (never "see").'],
        ['す', 'su', 'su', 'Espiral colgando (SUing)', '/sɯ/', '«su» muy breve (a veces casi muda al final de palabra, ej. desu).', 'Short "su" (often whispered word-finally).'],
        ['せ', 'se', 'se', 'Cruz atravesada (SE)', '/se/', '«se» directa.', 'Clean "se".'],
        ['そ', 'so', 'so', 'Zigzag cosido (SOw)', '/so/', '«so» directa.', 'Clean "so".'],
        ['た', 'ta', 'ta', 'Parece una t y una a juntas', '/ta/', '«ta» dental limpia.', 'Clean "ta".'],
        ['ち', 'chi', 'chi', 'Parece un 5 (CHEer)', '/tɕi/', '«chi» palatal (no existe «ti» nativo).', 'Palatal "chi".'],
        ['つ', 'tsu', 'tsu', 'Ola TSUnami', '/tsɯ/', 'Africada «t+su» en un golpe rápido.', 'Crisp "ts" + short "u" ("tsunami").'],
        ['て', 'te', 'te', 'Parece una T curva', '/te/', '«te» limpia.', 'Clean "te".'],
        ['と', 'to', 'to', 'Espina en dedo (TOe)', '/to/', '«to» limpia.', 'Clean "to".'],
        ['な', 'na', 'na', 'Cruz con nudo abajo', '/na/', '«na» limpia.', 'Clean "na".'],
        ['に', 'ni', 'ni', 'Rodilla (KNee = ni)', '/ɲi/', '«ni» suave.', 'Clean "ni".'],
        ['ぬ', 'nu', 'nu', 'Fideos enrollados (NOOdles)', '/nɯ/', '«nu» limpia.', 'Clean "nu".'],
        ['ね', 'ne', 'ne', 'Gato enroscado (NEko)', '/ne/', '«ne» limpia.', 'Clean "ne".'],
        ['の', 'no', 'no', 'Señal circular de NO', '/no/', '«no» limpia (partícula posesiva).', 'Clean "no".'],
        ['は', 'ha', 'ha (wa)', 'Trazo + lazo = HA', '/ha/', '«ha» aspirada suave; suena «wa» cuando marca el tema de la frase.', 'Breathy "ha"; pronounced "wa" as topic particle.'],
        ['ひ', 'hi', 'hi', 'Sonrisa «hi-hi»', '/çi/', 'Suave «ji» palatal con aire.', 'Light palatal "hee" (like "huge").'],
        ['ふ', 'fu', 'fu', 'Montaña con humo (FUji)', '/ɸɯ/', 'Soplo bilabial entre ambos labios sin morder el labio inferior.', 'Blow softly through both lips ("fu/hu").'],
        ['へ', 'he', 'he', 'Tejado en punta (HEaven)', '/he/', '«he» suave; suena «e» como partícula de dirección.', 'Light "he"; pronounced "e" as direction particle.'],
        ['ほ', 'ho', 'ho', 'Igual a は pero con dos barras', '/ho/', '«ho» aspirada suave.', 'Breathy "ho".'],
        ['ま', 'ma', 'ma', 'Mástil y dos velas', '/ma/', '«ma» limpia.', 'Clean "ma".'],
        ['み', 'mi', 'mi', 'Número 21 («Who, ME?»)', '/mi/', '«mi» limpia.', 'Clean "me".'],
        ['む', 'mu', 'mu', 'Vaca «MUU»', '/mɯ/', '«mu» limpia.', 'Clean "mu".'],
        ['め', 'me', 'me', 'Ojo (ME)', '/me/', '«me» limpia.', 'Clean "me".'],
        ['も', 'mo', 'mo', 'Anzuelo con dos cebos', '/mo/', '«mo» limpia.', 'Clean "mo".'],
        ['や', 'ya', 'ya', 'YAk con cuerno', '/ja/', '«ya» suave.', 'Clean "ya".'],
        ['ゆ', 'yu', 'yu', 'Pez curvado (yū)', '/jɯ/', '«yu» limpia.', 'Clean "you".'],
        ['よ', 'yo', 'yo', 'Yoyo colgado', '/jo/', '«yo» limpia.', 'Clean "yo".'],
        ['ら', 'ra', 'ra', 'Conejo (RAbbit)', '/ɾa/', '«r» siempre suave (como en «cara», nunca «rr» fuerte).', 'Tapped soft "r" (never English/heavy rolled r).'],
        ['り', 'ri', 'ri', 'Dos juncos en río (RIver)', '/ɾi/', '«ri» suave.', 'Tapped "ri".'],
        ['る', 'ru', 'ru', 'Ruta con bucle final', '/ɾɯ/', '«ru» suave.', 'Tapped "ru".'],
        ['れ', 're', 're', 'Silla doblada a la derecha', '/ɾe/', '«re» suave.', 'Tapped "re".'],
        ['ろ', 'ro', 'ro', 'Como る sin bucle final', '/ɾo/', '«ro» suave.', 'Tapped "ro".'],
        ['わ', 'wa', 'wa', 'Cisne blanco nadando', '/wa/', '«wa» suave sin consonante fuerte.', 'Soft "wa".'],
        ['を', 'wo / o', 'wo / o', 'Hombre sobre bloque (partícula)', '/o/', 'Hoy suena casi siempre «o» pura (partícula de objeto).', 'Pronounced "o" today (direct-object marker).'],
        ['ん', 'n', 'n', 'Idéntica a una n cursiva', '/ɴ/', '«n» final (suena «m» antes de b/p/m).', 'Moraic nasal "-n" ("m" before p/b/m).']
      ],
      words: [
        ['さくら', 'sakura', 'SA-ku-ra (/sakɯɾa/)', 'Cerezo en flor', 'Cherry blossom'],
        ['すし', 'sushi', 'SU-shi (/sɯɕi/)', 'Sushi', 'Sushi'],
        ['にほん', 'nihon', 'ni-HON (/ɲihoɴ/)', 'Japón', 'Japan'],
        ['こころ', 'kokoro', 'ko-KO-ro', 'Corazón / Espíritu', 'Heart / Mind'],
        ['ありがとう', 'arigatō', 'a-ri-ga-TŌ', 'Gracias', 'Thank you'],
        ['ねこ', 'neko', 'NE-ko', 'Gato', 'Cat'],
        ['そら', 'sora', 'SO-ra', 'Cielo', 'Sky'],
        ['みず', 'mizu', 'MI-zu', 'Agua', 'Water'],
        ['やま', 'yama', 'YA-ma', 'Montaña', 'Mountain'],
        ['つき', 'tsuki', 'TSU-ki', 'Luna', 'Moon'],
        ['かわ', 'kawa', 'KA-wa', 'Río', 'River'],
        ['ほし', 'hoshi', 'JO-shi', 'Estrella', 'Star']
      ],
      dict: [
        [['hola', 'buenos dias', 'buenas tardes'], ['hello', 'hi'], 'こんにちは', 'Konnichiwa', 'kon-ni-chi-WA', 'Hola / Buenas tardes', 'Hello / Good afternoon'],
        [['gracias'], ['thanks', 'thank you'], 'ありがとうございます', 'Arigatō gozaimasu', 'a-ri-ga-TŌ go-zai-MAS', 'Muchas gracias', 'Thank you very much'],
        [['agua'], ['water'], 'みず', 'Mizu', 'MI-zu', 'Agua', 'Water'],
        [['amor'], ['love'], 'あい', 'Ai', 'Á-i', 'Amor', 'Love'],
        [['gato'], ['cat'], 'ねこ', 'Neko', 'NE-ko', 'Gato', 'Cat'],
        [['por favor'], ['please'], 'おねがいします', 'Onegaishimasu', 'o-ne-gai-shi-MAS', 'Por favor', 'Please'],
        [['si', 'sí'], ['yes'], 'はい', 'Hai', 'JÁ-i', 'Sí', 'Yes'],
        [['no'], ['no'], 'いいえ', 'Iie', 'Í-i-e', 'No', 'No'],
        [['amigo'], ['friend'], 'ともだち', 'Tomodachi', 'to-mo-DA-chi', 'Amigo', 'Friend'],
        [['buenos días', 'buen dia'], ['good morning'], 'おはようございます', 'Ohayō gozaimasu', 'o-ha-YŌ go-zai-MAS', 'Buenos días', 'Good morning']
      ],
      transMap: null // Uses genuine full Romaji <-> Hiragana syllable converter below
    },
    {
      id: 'hebrew',
      tts: 'he-IL',
      title: { es: 'Hebreo (אלפבית עברי)', en: 'Hebrew (אלפבית עברי)' },
      sub: {
        es: 'Las 22 consonantes hebreas, fonología moderna, romanización y audio.',
        en: 'All 22 Hebrew consonants, modern phonology, romanization & audio.'
      },
      phonoSummary: {
        es: '<b>Fonología del hebreo moderno:</b> Se lee siempre de <b>derecha a izquierda</b>. Tres letras duplican sonido según lleven punto interno (<i>daguesh</i>): <code>ב (b/v)</code>, <code>כ (k/j)</code> y <code>פ (p/f)</code>. La <code>ח</code> y <code>כ</code> suenan como nuestra «j» fuerte (/χ/), y la <code>ר (Resh)</code> se articula en la garganta como la «r» francesa.',
        en: '<b>Modern Hebrew phonology:</b> Read <b>right-to-left</b>. Three stops shift to fricatives without a center dot (<i>dagesh</i>): <code>ב b/v</code>, <code>כ k/kh</code>, <code>פ p/f</code>. <code>ח</code> is a guttural "kh" (/χ/) and <code>ר</code> is a uvular French-style "r" (/ʁ/).'
      },
      ruleHtml: {
        es: '<b>Abjad consonántico (←):</b> Las vocales cotidianas no se escriben salvo con <i>matres lectionis</i> (<code>ו = o/u</code>, <code>י = i/y</code>). Cinco letras cambian forma al final (<i>sofit</i>): <code>ך, ם, ן, ף, ץ</code>.',
        en: '<b>Consonantal Abjad (←):</b> Everyday text omits short vowels except <code>ו (o/u)</code> and <code>י (i/y)</code>. Five letters change shape at word end (<i>sofit</i>): <code>ך, ם, ן, ף, ץ</code>.'
      },
      chars: [
        ['א', 'Álef', 'muda / vocal', 'Primera letra, portadora silenciosa de vocal', '/ʔ ~ ∅/', 'No tiene sonido propio; adopta el de su vocal.', 'Silent vowel carrier / glottal onset.'],
        ['ב', 'Bet / Vet', 'b / v', 'Casa (Bayit): base cuadrada derecha', '/b ~ v/', '«b» si lleva punto; «v» labiodental si no.', '"b" when dotted, "v" otherwise.'],
        ['ג', 'Guímel', 'g', 'Camello dando un paso', '/ɡ/', '«g» suave siempre (como en «gato»).', 'Hard "g" as in "go".'],
        ['ד', 'Dálet', 'd', 'Puerta con techo saliente', '/d/', 'Dental «d» firme.', 'Clean "d".'],
        ['ה', 'He', 'h', 'Ventana abierta arriba', '/h/', '«h» aspirada suave al inicio; muda al final de palabra.', 'Light breathy "h"; silent at word end.'],
        ['ו', 'Vav', 'v / o / u', 'Gancho vertical simple', '/v ~ o ~ u/', 'Consonante «v» o vocal «o / u» en lectura diaria.', 'Consonant "v" or vowel marker "o / u".'],
        ['ז', 'Zayin', 'z', 'Espada vertical', '/z/', 'Sibilante sonora vibrante como abeja (/z/).', 'Voiced "z" as in "zoo".'],
        ['ח', 'Jet (Het)', 'kh / j', 'Puerta cerrada = J fuerte', '/χ/', 'Fuerte en el velo/úvula como nuestra «j» de «jamón».', 'Strong guttural "ch" as in Bach.'],
        ['ט', 'Tet', 't', 'Cesta curvada', '/t/', 'Dental «t» seca.', 'Crisp "t".'],
        ['י', 'Yod', 'y / i', 'La letra más pequeña', '/j ~ i/', '«y» consonántica o vocal «i».', '"y" glide or vowel "ee".'],
        ['כ ך', 'Kaf / Jaf', 'k / kh', 'Palma redondeada (final ך)', '/k ~ χ/', '«k» con punto; «j» fuerte sin punto o al final (ך).', '"k" when dotted; guttural "kh" otherwise.'],
        ['ל', 'Lámed', 'l', 'Sobresale por encima del renglón', '/l/', 'Alveolar «l» limpia.', 'Clear "l".'],
        ['מ ם', 'Mem', 'm', 'Cerrada en cuadrado al final (ם)', '/m/', 'Bilabial nasal «m».', 'Bilabial "m".'],
        ['נ ן', 'Nun', 'n', 'Baja largo al final (ן)', '/n/', 'Alveolar nasal «n».', 'Alveolar "n".'],
        ['ס', 'Sámej', 's', 'Círculo cerrado = S', '/s/', '«s» sorda limpia.', 'Crisp voiceless "s".'],
        ['ע', 'Ayin', 'muda / gutural', 'Dos ramas unidas abajo', '/∅ ~ ʕ/', 'Muda hoy (como Álef) o levemente faríngea.', 'Silent today (or slight pharyngeal catch).'],
        ['פ ף', 'Pe / Fe', 'p / f', 'Boca con espiral (final ף)', '/p ~ f/', '«p» al inicio de palabra; «f» sin punto o al final (ף).', '"p" word-initially; "f" otherwise.'],
        ['צ ץ', 'Tsadi', 'ts', 'Y doblada (final ץ) = TS', '/ts/', '«t+s» juntas en un golpe (como en «pizza»).', 'Sharp "ts" as in "cats".'],
        ['ק', 'Qof', 'k', 'Pata izquierda desciende', '/k/', 'Suena hoy exactamente como «k».', 'Pronounced identically to "k" today.'],
        ['ר', 'Resh', 'r', 'Esquina redondeada sin saliente', '/ʁ/', 'Uvular gutural suave (como la «r» francesa).', 'Uvular French/German-style "r".'],
        ['ש', 'Shin / Sin', 'sh / s', 'Tres llamas de fuego = SH/S', '/ʃ ~ s/', '«sh» con punto a la derecha; «s» si el punto va a la izquierda.', '"sh" normally; "s" with left dot.'],
        ['ת', 'Tav', 't', 'Sello final con pie izquierdo', '/t/', 'Dental «t» limpia.', 'Clean "t".']
      ],
      words: [
        ['שלום', 'Shalom', 'sha-LÓM (/ʃaˈlom/)', 'Paz / Hola', 'Peace / Hello'],
        ['תודה', 'Todá', 'to-DÁ (/toˈda/)', 'Gracias', 'Thank you'],
        ['ישראל', 'Yisrael', 'yis-ra-ÉL', 'Israel', 'Israel'],
        ['אמת', 'Emet', 'e-MÉT', 'Verdad', 'Truth'],
        ['מים', 'Mayim', 'MÁ-yim', 'Agua', 'Water'],
        ['אור', 'Or', 'OR', 'Luz', 'Light'],
        ['ספר', 'Séfer', 'SÉ-fer', 'Libro', 'Book'],
        ['חיים', 'Jayim (Chaim)', 'ja-YÍM (/χaˈjim/)', 'Vida', 'Life'],
        ['לחם', 'Léjem', 'LÉ-jem', 'Pan', 'Bread'],
        ['שמש', 'Shémesh', 'SHÉ-mesh', 'Sol', 'Sun'],
        ['לילה', 'Láila', 'LÁI-la', 'Noche', 'Night'],
        ['מוזיקה', 'Músika', 'MÚ-si-ka', 'Música', 'Music']
      ],
      dict: [
        [['hola', 'paz'], ['hello', 'peace'], 'שלום', 'Shalom', 'sha-LÓM', 'Hola / Paz', 'Hello / Peace'],
        [['gracias'], ['thanks', 'thank you'], 'תודה', 'Todá', 'to-DÁ', 'Gracias', 'Thank you'],
        [['agua'], ['water'], 'מים', 'Mayim', 'MÁ-yim', 'Agua', 'Water'],
        [['cafe', 'café'], ['coffee'], 'קפה', 'Kafé', 'ka-FÉ', 'Café', 'Coffee'],
        [['por favor'], ['please'], 'בבקשה', 'Bevakashá', 'be-va-ka-SHÁ', 'Por favor', 'Please'],
        [['si', 'sí'], ['yes'], 'כן', 'Ken', 'KEN', 'Sí', 'Yes'],
        [['no'], ['no'], 'לא', 'Lo', 'LO', 'No', 'No'],
        [['amor'], ['love'], 'אהבה', 'Ahavá', 'a-ha-VÁ', 'Amor', 'Love'],
        [['libro'], ['book'], 'ספר', 'Séfer', 'SÉ-fer', 'Libro', 'Book'],
        [['buenos dias', 'buenos días'], ['good morning'], 'בוקר טוב', 'Bóker tov', 'BÓ-ker TOV', 'Buenos días', 'Good morning']
      ],
      transMap: {
        a: 'א', b: 'ב', c: 'ק', d: 'ד', e: 'א', f: 'פ', g: 'ג', h: 'ה', i: 'י', j: 'ח', k: 'ק',
        l: 'ל', m: 'מ', n: 'נ', o: 'ו', p: 'פ', q: 'ק', r: 'ר', s: 'ס', t: 'ת', u: 'ו', v: 'ו',
        w: 'ו', x: 'קס', y: 'י', z: 'ז', sh: 'ש', ts: 'צ', ch: 'ח'
      }
    },
    {
      id: 'arabic',
      tts: 'ar-SA',
      title: { es: 'Árabe (الأبجدية العربية)', en: 'Arabic (الأبجدية العربية)' },
      sub: {
        es: 'Sistema de «barcas y puntos» de derecha a izquierda, fonología gutural y audio.',
        en: '"Boats and dots" script read right-to-left, emphatic phonology & live voice.'
      },
      phonoSummary: {
        es: '<b>Fonología distintiva del árabe:</b> El árabe tiene sonidos ricos en la garganta que no existen en español: <code>ح (Ḥā)</code> es una «h» suspirada desde la faringe; <code>خ (Khā)</code> es nuestra «j»; <code>ق (Qāf)</code> es una «k» profunda en la úvula; y <code>ع (ʿAyn)</code> contrae suavemente la faringe dando cuerpo sonoro a la vocal. Solo escribe las vocales largas (<code>ا ā, و ū, ي ī</code>).',
        en: '<b>Distinctive Arabic phonology:</b> Contrast front stops against deep throat consonants: <code>ح (Ḥā)</code> is a tense pharyngeal sigh; <code>خ (Khā)</code> equals Spanish j / Bach ch; <code>ق (Qāf)</code> is a deep uvular "k"; <code>ع (ʿAyn)</code> voices a constricted pharynx. Everyday text writes only long vowels (<code>ا ā, و ū, ي ī</code>).'
      },
      ruleHtml: {
        es: '<b>El secreto de las «barcas» y los puntos (←):</b> Mismo cuerpo base + puntos arriba/abajo: <code>ب (b) · ت (t) · ث (th)</code>; <code>ج (j) · ح (ḥ) · خ (kh)</code>. Se escribe y lee ligado de derecha a izquierda.',
        en: '<b>Boats & dots (←):</b> Shared base shapes swap sounds via dots: <code>ب (b) · ت (t) · ث (th)</code>; <code>ج (j) · ح (ḥ) · خ (kh)</code>. Written cursively right-to-left.'
      },
      chars: [
        ['ا', 'Álif', 'a / ā', 'Columna vertical simple', '/aː/', 'Vocal «a» larga y clara.', 'Long open "aa".'],
        ['ب', 'Bā', 'b', 'Barca con 1 punto debajo', '/b/', 'Bilabial sonora «b» firme.', 'Crisp voiced "b".'],
        ['ت', 'Tā', 't', 'Barca con 2 puntos arriba', '/t/', 'Dental «t» limpia.', 'Clean dental "t".'],
        ['ث', 'Thā', 'th / z', 'Barca con 3 puntos arriba', '/θ/', 'Exacta a la «z» española o «th» de «think».', 'Voiceless "th" as in "think".'],
        ['ج', 'Jīm', 'j / y', 'Gancho con 1 punto dentro', '/dʒ ~ ʒ/', 'Como «y» fuerte o «j» inglesa («jam»).', 'Soft "j" as in "jam" (or French "j").'],
        ['ح', 'Ḥā', 'h faríngea', 'Gancho limpio sin punto', '/ħ/', 'Suspiro tenso empañando un cristal desde el fondo de la garganta.', 'Tense breathy whisper deep in the pharynx (like fogging a mirror).'],
        ['خ', 'Khā', 'j / kh', 'Gancho con 1 punto arriba', '/x/', 'Como la «j» castellana de «jamón».', 'Strong guttural "ch" as in Bach.'],
        ['د', 'Dāl', 'd', 'Ángulo corto abierto a la izquierda', '/d/', 'Dental «d» firme.', 'Clean "d".'],
        ['ذ', 'Dhāl', 'dh', 'Como Dāl + 1 punto arriba', '/ð/', 'Como la «d» suave de «cada» o «th» de «this».', 'Voiced "th" as in "this".'],
        ['ر', 'Rā', 'r', 'Tobogán curvo = R', '/r/', 'Vibrante alveolar como «r» española.', 'Lightly rolled alveolar "r".'],
        ['ز', 'Zāy', 'z', 'Como Rā + 1 punto arriba = Z', '/z/', 'Sibilante sonora vibrante (/z/).', 'Voiced "z" as in "zoo".'],
        ['س', 'Sīn', 's', 'Tres dientes suaves = S', '/s/', '«s» ligera con lengua delante.', 'Light front "s".'],
        ['ش', 'Shīn', 'sh', 'Tres dientes + 3 puntos = SH', '/ʃ/', 'Sonido «sh» como en «show».', 'Clean "sh" as in "shoe".'],
        ['ص', 'Ṣād', 'ṣ enfática', 'Lazo ovalado sin punto', '/sˤ/', '«s» profunda bajando el dorso de la lengua (oscurece la vocal).', 'Emphatic dark "s" with lowered tongue back.'],
        ['ط', 'Ṭā', 'ṭ enfática', 'Lazo con mástil alto', '/tˤ/', '«t» pesada/oscura presionando hacia atrás.', 'Emphatic heavy "t".'],
        ['ع', 'ʿAyn', 'ʿa (faríngea)', 'Parece un 3 invertido', '/ʕ/', 'Constricción sonora en la garganta unida a la vocal.', 'Voiced pharyngeal constriction ("ah" from deep throat).'],
        ['ف', 'Fā', 'f', 'Cuello con 1 punto arriba = F', '/f/', 'Fricativa labiodental «f».', 'Clean "f".'],
        ['ق', 'Qāf', 'q', 'Cuenco hondo con 2 puntos = Q', '/q/', 'Como una «k» articulada bien atrás en la úvula.', 'Deep uvular "k" struck behind soft palate.'],
        ['ك', 'Kāf', 'k', 'Ángulo alto con S dentro = K', '/k/', '«k» ligera frontal normal.', 'Light front "k".'],
        ['ل', 'Lām', 'l', 'Anzuelo alto = L', '/l/', '«l» alveolar clara.', 'Clear "l".'],
        ['م', 'Mīm', 'm', 'Círculo con cola abajo = M', '/m/', 'Bilabial nasal «m».', 'Bilabial "m".'],
        ['ن', 'Nūn', 'n', 'Cuenco con 1 punto arriba = N', '/n/', 'Alveolar nasal «n».', 'Alveolar "n".'],
        ['ه', 'Hā', 'h suave', 'Lazo pequeño cerrado = H', '/h/', '«h» inglesa muy suave sin raspar.', 'Soft airy "h".'],
        ['و', 'Wāw', 'w / ū', 'Coma grande en espiral = W/U', '/w ~ uː/', 'Semivocal «w» («huevo») o vocal «u» larga.', '"w" glide or long "oo".'],
        ['ي', 'Yā', 'y / ī', 'Cisne con 2 puntos abajo = Y/I', '/j ~ iː/', '«y» consonántica o vocal «i» larga.', '"y" glide or long "ee".']
      ],
      words: [
        ['سلام', 'Salām', 'sa-LĀM (/saˈlaːm/)', 'Paz / Saludo', 'Peace / Greeting'],
        ['كتاب', 'Kitāb', 'ki-TĀB', 'Libro', 'Book'],
        ['شمس', 'Shams', 'SHAMS', 'Sol', 'Sun'],
        ['قمر', 'Qamar', 'QA-mar (/ˈqamar/)', 'Luna', 'Moon'],
        ['بحر', 'Baḥr', 'BA-ḥr', 'Mar', 'Sea'],
        ['نور', 'Nūr', 'NŪR', 'Luz', 'Light'],
        ['بيت', 'Bayt', 'BÁIT', 'Casa', 'House'],
        ['قهوة', 'Qahwa', 'QAH-wa', 'Café', 'Coffee'],
        ['ماء', 'Māʾ', 'MĀ', 'Agua', 'Water'],
        ['شكرا', 'Shukran', 'SHÚK-ran', 'Gracias', 'Thank you'],
        ['حب', 'Ḥubb', 'ḤUBB', 'Amor', 'Love'],
        ['موسيقى', 'Mūsīqā', 'mu-SĪ-qā', 'Música', 'Music']
      ],
      dict: [
        [['hola', 'paz', 'saludo'], ['hello', 'hi', 'peace'], 'مرحبا / سلام', 'Marḥaban / Salām', 'mar-ḤA-ban / sa-LĀM', 'Hola / Paz', 'Hello / Peace'],
        [['gracias'], ['thanks', 'thank you'], 'شكرا', 'Shukran', 'SHÚK-ran', 'Gracias', 'Thank you'],
        [['agua'], ['water'], 'ماء', 'Māʾ', 'MĀ', 'Agua', 'Water'],
        [['cafe', 'café'], ['coffee'], 'قهوة', 'Qahwa', 'QAH-wa', 'Café', 'Coffee'],
        [['por favor'], ['please'], 'من فضلك', 'Min faḍlak', 'min FÁD-lak', 'Por favor', 'Please'],
        [['si', 'sí'], ['yes'], 'نعم', 'Naʿam', 'na-ʿAM', 'Sí', 'Yes'],
        [['no'], ['no'], 'لا', 'Lā', 'LĀ', 'No', 'No'],
        [['amor'], ['love'], 'حب', 'Ḥubb', 'ḤUBB', 'Amor', 'Love'],
        [['libro'], ['book'], 'كتاب', 'Kitāb', 'ki-TĀB', 'Libro', 'Book'],
        [['buenos dias', 'buenos días'], ['good morning'], 'صباح الخير', 'Ṣabāḥ al-khayr', 'sa-BĀḤ al-JAIR', 'Buenos días', 'Good morning']
      ],
      transMap: {
        a: 'ا', b: 'ب', c: 'ك', d: 'د', e: 'ي', f: 'ف', g: 'ج', h: 'ه', i: 'ي', j: 'خ', k: 'ك',
        l: 'ل', m: 'م', n: 'ن', o: 'و', p: 'ب', q: 'ق', r: 'ر', s: 'س', t: 'ت', u: 'و', v: 'ف',
        w: 'و', x: 'كس', y: 'ي', z: 'ز', sh: 'ش', th: 'ث', kh: 'خ', dh: 'ذ'
      }
    }
  ];

  // ---------------- Motores de Transliteración / Romaji ----------------
  const HIRA_ROMAJI_MAP = {
    kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ', sha: 'しゃ', shu: 'しゅ', sho: 'しょ',
    cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
    hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ', mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
    rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
    tsu: 'つ', shi: 'し', chi: 'ち', fu: 'ふ',
    ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
    sa: 'さ', su: 'す', se: 'せ', so: 'そ',
    ta: 'た', te: 'て', to: 'と',
    na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
    ha: 'は', hi: 'ひ', he: 'へ', ho: 'ほ',
    ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
    ya: 'や', yu: 'ゆ', yo: 'よ',
    ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
    wa: 'わ', wo: 'を',
    ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
    za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
    da: 'だ', de: 'で', do: 'ど',
    ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
    pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
    a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お', n: 'ん'
  };
  const HIRA_TO_ROMAJI = {};
  Object.keys(HIRA_ROMAJI_MAP).forEach((r) => { HIRA_TO_ROMAJI[HIRA_ROMAJI_MAP[r]] = r; });
  const HIRA_EXTRA = { 'っ': '(doble)', 'ー': 'ː' };

  function romajiToHiragana(raw) {
    let s = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let out = '';
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (!/[a-z]/.test(ch)) { out += ch; i++; continue; }
      // Double consonant -> sokuon っ (except nn)
      if (i + 1 < s.length && s[i] === s[i + 1] && ch !== 'n' && !'aeiou'.includes(ch)) {
        out += 'っ';
        i++;
        continue;
      }
      if (s.slice(i, i + 3) && HIRA_ROMAJI_MAP[s.slice(i, i + 3)]) {
        out += HIRA_ROMAJI_MAP[s.slice(i, i + 3)];
        i += 3;
        continue;
      }
      if (s.slice(i, i + 2) && HIRA_ROMAJI_MAP[s.slice(i, i + 2)]) {
        out += HIRA_ROMAJI_MAP[s.slice(i, i + 2)];
        i += 2;
        continue;
      }
      if (ch === 'n' && (i + 1 === s.length || !'aeiouy'.includes(s[i + 1]))) {
        out += 'ん';
        i++;
        continue;
      }
      if (HIRA_ROMAJI_MAP[ch]) {
        out += HIRA_ROMAJI_MAP[ch];
      } else {
        // Approximate stray Latin consonant with closest -u mora
        out += HIRA_ROMAJI_MAP[ch + 'u'] || ch;
      }
      i++;
    }
    return out;
  }

  function hiraganaToRomaji(raw) {
    let out = '';
    let i = 0;
    while (i < raw.length) {
      if (raw[i] === 'っ' && i + 1 < raw.length) {
        const nextR = HIRA_TO_ROMAJI[raw[i + 1]] || '';
        if (nextR) out += nextR[0];
        i++;
        continue;
      }
      const di = raw.slice(i, i + 2);
      if (HIRA_TO_ROMAJI[di]) { out += HIRA_TO_ROMAJI[di]; i += 2; continue; }
      if (HIRA_TO_ROMAJI[raw[i]]) { out += HIRA_TO_ROMAJI[raw[i]]; i++; continue; }
      out += HIRA_EXTRA[raw[i]] || raw[i];
      i++;
    }
    return out;
  }

  // Korean Hangul Jamo Assembler for Latin -> Hangul syllabic blocks
  const KO_L = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const KO_V = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const KO_T = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const KO_ROM_C = { ch: 'ㅊ', ng: 'ㅇ', g: 'ㄱ', k: 'ㅋ', n: 'ㄴ', d: 'ㄷ', t: 'ㅌ', r: 'ㄹ', l: 'ㄹ', m: 'ㅁ', b: 'ㅂ', p: 'ㅍ', s: 'ㅅ', j: 'ㅈ', h: 'ㅎ', c: 'ㅋ', f: 'ㅍ', v: 'ㅂ', z: 'ㅈ' };
  const KO_ROM_V = { eo: 'ㅓ', eu: 'ㅡ', ae: 'ㅐ', ya: 'ㅑ', yo: 'ㅛ', yu: 'ㅠ', ye: 'ㅖ', wa: 'ㅘ', wo: 'ㅝ', a: 'ㅏ', e: 'ㅔ', i: 'ㅣ', o: 'ㅗ', u: 'ㅜ', y: 'ㅣ' };

  function latinToHangul(raw) {
    const s = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let out = '';
    let i = 0;
    while (i < s.length) {
      if (!/[a-z]/.test(s[i])) { out += s[i++]; continue; }
      let lead = 'ㅇ';
      const c2 = s.slice(i, i + 2);
      if (KO_ROM_C[c2]) { lead = KO_ROM_C[c2]; i += 2; }
      else if (KO_ROM_C[s[i]]) { lead = KO_ROM_C[s[i]]; i++; }

      let vowel = 'ㅡ';
      const v2 = s.slice(i, i + 2);
      if (KO_ROM_V[v2]) { vowel = KO_ROM_V[v2]; i += 2; }
      else if (KO_ROM_V[s[i]]) { vowel = KO_ROM_V[s[i]]; i++; }

      let tail = '';
      if (i < s.length && /[a-z]/.test(s[i])) {
        const nxt = s[i + 1] || '';
        const t2 = s.slice(i, i + 2);
        if (t2 === 'ng' && (!nxt || !KO_ROM_V[s[i + 2]])) {
          tail = 'ㅇ'; i += 2;
        } else if (KO_ROM_C[s[i]] && (!nxt || !KO_ROM_V[nxt])) {
          tail = KO_ROM_C[s[i]]; i++;
        }
      }
      const li = KO_L.indexOf(lead), vi = KO_V.indexOf(vowel), ti = KO_T.indexOf(tail);
      if (li >= 0 && vi >= 0 && ti >= 0) {
        out += String.fromCharCode(0xac00 + li * 588 + vi * 28 + ti);
      } else {
        out += lead + vowel + tail;
      }
    }
    return out;
  }

  function transliterateText(sc, raw) {
    const txt = (raw || '').trim();
    if (!txt) return { native: '—', rom: '—', say: '—', modeLabel: '' };
    const L = t();
    const norm = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Match vocabulary/phrase dictionary first
    const hit = sc.dict.find((entry) =>
      entry[0].some((k) => k === norm || k.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === norm) ||
      entry[1].some((k) => k === norm)
    );
    if (hit) {
      return {
        native: hit[2],
        rom: hit[3],
        say: hit[4] + ' — ' + (LANG === 'en' ? hit[6] : hit[5]),
        modeLabel: L.transModePhrase
      };
    }

    // 2. If user typed native script glyphs, show Romaji/romanization
    const isLatin = /^[a-z0-9\s.,!?'"-]+$/i.test(norm);
    if (!isLatin) {
      if (sc.id === 'hiragana') {
        const rom = hiraganaToRomaji(txt);
        return { native: txt, rom, say: rom.toUpperCase(), modeLabel: L.transModeRom };
      }
      // Match reverse from known script chars
      let romOut = '';
      for (const ch of txt) {
        const found = sc.chars.find((row) => row[0].split(/\s+|\/| /)[0].toLowerCase() === ch.toLowerCase());
        romOut += found ? found[2].split('/')[0].trim() : ch;
      }
      return { native: txt, rom: romOut, say: romOut, modeLabel: L.transModeRom };
    }

    // 3. Convert Latin / Romaji input -> native script
    let native = '';
    if (sc.id === 'hiragana') {
      native = romajiToHiragana(norm);
    } else if (sc.id === 'hangul') {
      native = latinToHangul(norm);
    } else {
      const map = sc.transMap || {};
      let i = 0;
      while (i < norm.length) {
        const di = norm.slice(i, i + 2);
        if (map[di]) { native += map[di]; i += 2; }
        else if (map[norm[i]]) { native += map[norm[i]]; i++; }
        else { native += norm[i]; i++; }
      }
    }
    return {
      native,
      rom: txt,
      say: txt,
      modeLabel: L.transModeRom
    };
  }

  const TEST_LEN = 12;

  const state = {
    scriptIdx: 0,
    mode: saved.get('mode', 'study'),
    task: saved.get('task', 'chars'),
    bests: saved.get('bests', {}),
    selectedCharIdx: 0,
    translatorText: '',
    right: 0,
    total: 0,
    streak: 0,
    t0: 0,
    frozen: null,
    answered: false
  };

  function currentScript() {
    return SCRIPTS[state.scriptIdx] || SCRIPTS[0];
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
    $('taskHeading').textContent = L.taskHeading;
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

    document.querySelectorAll('#taskSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.tasks[v];
      b.setAttribute('aria-pressed', String(v === state.task));
    });

    renderRail();
    renderBest();
  }

  function renderRail() {
    const box = $('railList');
    box.innerHTML = '';
    let nextMarked = false;
    SCRIPTS.forEach((sc, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', String(idx === state.scriptIdx));
      const best = state.bests[sc.id];
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
      btn.innerHTML = `<span><i>${idx + 1}</i>${sc.title[LANG]}</span><em class="${tagClass}">${tagText}</em>`;
      btn.addEventListener('click', () => {
        state.scriptIdx = idx;
        state.selectedCharIdx = 0;
        state.translatorText = '';
        resetSession();
        renderAll();
      });
      box.appendChild(btn);
    });
  }

  function renderBest() {
    const sc = currentScript();
    const best = state.bests[sc.id];
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

  function renderPhonologyBox(sc) {
    const L = t();
    const idx = Math.min(state.selectedCharIdx, sc.chars.length - 1);
    const ch = sc.chars[idx] || sc.chars[0];
    const art = LANG === 'en' ? ch[6] : ch[5];
    const cleanSpeak = ch[0].split(/\s+|\/| /)[0];

    return `
      <div class="phono-box">
        <div class="box-head">
          <h4>${L.phonoTitle}</h4>
        </div>
        <div class="rule-banner" style="padding:9px 12px;border-left:0">${sc.phonoSummary[LANG]}</div>
        <div class="phono-detail" id="phonoDetail">
          <div class="phono-big">${ch[0]}</div>
          <div class="phono-meta">
            <b>${ch[1]} [${ch[2]}]</b>
            <span class="ipa-tag">IPA ${ch[4]}</span>
            <span>${art}</span>
          </div>
          <button type="button" class="speak-btn" id="speakCharBtn" ${ENABLE_AUDIO ? '' : 'hidden'}>${L.speakBtn}</button>
        </div>
      </div>`;
  }

  function renderTranslatorBox(sc) {
    const L = t();
    const defaultVal = state.translatorText || (sc.id === 'hiragana' ? 'sakura' : (LANG === 'en' ? 'hello' : 'hola'));
    const res = transliterateText(sc, defaultVal);
    const chipsHtml = sc.dict.slice(0, 8).map((entry, idx) => {
      const label = LANG === 'en' ? entry[1][0] : entry[0][0];
      return `<button type="button" class="phrase-chip" data-pidx="${idx}">${label}</button>`;
    }).join('');

    return `
      <div class="translator-box">
        <div class="box-head">
          <h4>${L.transTitle}</h4>
          <span style="font-size:11px;color:var(--muted)" id="transModeTag">${res.modeLabel}</span>
        </div>
        <div class="trans-controls">
          <input type="text" class="trans-input" id="transInput" value="${defaultVal.replace(/"/g, '&quot;')}" placeholder="${L.transPlaceholder}">
          <button type="button" class="speak-btn" id="transSpeakBtn" ${ENABLE_AUDIO ? '' : 'hidden'}>${L.speakBtn}</button>
        </div>
        <div class="trans-out" id="transOut">
          <div class="trans-native" id="transNative">${res.native}</div>
          <div class="trans-rom" id="transRom">${L.romLbl} ${res.rom}</div>
          <div class="trans-how" id="transSay">${L.sayLbl} ${res.say}</div>
        </div>
        <div style="font-size:11px;color:var(--muted)">${L.transPhrasesLbl}</div>
        <div class="phrase-chips" id="phraseChips">${chipsHtml}</div>
      </div>`;
  }

  // ---------------- MODO ESTUDIAR ----------------
  function renderStudy() {
    const sc = currentScript();
    const L = t();
    $('felt').classList.add('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    setPrompt({
      eyebrow: `${sc.title[LANG]} · ${L.modes.study}`,
      name: sc.title[LANG],
      meta: sc.sub[LANG],
      bar: null,
      status: null
    });

    const charsHtml = sc.chars
      .map(
        ([ch, name, sound, tip, ipa], idx) => `
        <div class="glyph-card ${idx === state.selectedCharIdx ? 'is-active' : ''}" data-cidx="${idx}">
          <div class="glyph-char">${ch}</div>
          <div class="glyph-name">${name}</div>
          <div class="glyph-sound">[${sound}]</div>
          <div class="glyph-ipa">${ipa}</div>
          <div class="glyph-tip">${tip}</div>
        </div>`
      )
      .join('');

    const wordsHtml = sc.words
      .map(
        ([w, rom, say, mEs, mEn], idx) => `
        <div class="word-card">
          <div class="word-top">
            <div class="word-script">${w}</div>
            <button type="button" class="speak-btn subtle" data-widx="${idx}" title="${L.speakBtn}" ${ENABLE_AUDIO ? '' : 'hidden'}>🔊</button>
          </div>
          <div class="word-rom">${rom}</div>
          <div class="word-say">${say}</div>
          <div class="word-mean">${LANG === 'en' ? mEn : mEs}</div>
        </div>`
      )
      .join('');

    $('felt').innerHTML = `
      <div class="alpha-wrap">
        <div class="rule-banner">${sc.ruleHtml[LANG]}</div>
        ${renderPhonologyBox(sc)}
        <div class="glyph-grid">${charsHtml}</div>
        ${renderTranslatorBox(sc)}
        <div class="rule-banner"><b>${L.wordsHeading}:</b></div>
        <div class="words-list">${wordsHtml}</div>
      </div>
    `;

    bindStudyInteractions(sc);

    const act = $('actions');
    act.innerHTML = '';
    const goBtn = document.createElement('button');
    goBtn.type = 'button';
    goBtn.className = 'act primary';
    goBtn.textContent = L.goPractice;
    goBtn.addEventListener('click', () => setMode('practice'));
    act.appendChild(goBtn);
  }

  function bindStudyInteractions(sc) {
    const L = t();
    document.querySelectorAll('.glyph-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.getAttribute('data-cidx'));
        state.selectedCharIdx = idx;
        document.querySelectorAll('.glyph-card').forEach((el, i) => el.classList.toggle('is-active', i === idx));
        const ch = sc.chars[idx];
        const art = LANG === 'en' ? ch[6] : ch[5];
        const detail = $('phonoDetail');
        if (detail) {
          detail.querySelector('.phono-big').textContent = ch[0];
          detail.querySelector('.phono-meta b').textContent = `${ch[1]} [${ch[2]}]`;
          detail.querySelector('.ipa-tag').textContent = `IPA ${ch[4]}`;
          detail.querySelector('.phono-meta span:last-child').textContent = art;
        }
        speakText(ch[0].split(/\s+|\/| /)[0], ch[2].split('/')[0].trim(), sc.tts);
      });
    });

    const spkChar = $('speakCharBtn');
    if (spkChar) {
      spkChar.addEventListener('click', () => {
        const ch = sc.chars[state.selectedCharIdx] || sc.chars[0];
        speakText(ch[0].split(/\s+|\/| /)[0], ch[2].split('/')[0].trim(), sc.tts);
      });
    }

    document.querySelectorAll('.word-card button[data-widx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const w = sc.words[Number(btn.getAttribute('data-widx'))];
        if (w) speakText(w[0], w[1], sc.tts);
      });
    });

    const transIn = $('transInput');
    const updateTranslator = (val, shouldSpeak) => {
      state.translatorText = val;
      const res = transliterateText(sc, val);
      if ($('transNative')) $('transNative').textContent = res.native;
      if ($('transRom')) $('transRom').textContent = `${L.romLbl} ${res.rom}`;
      if ($('transSay')) $('transSay').textContent = `${L.sayLbl} ${res.say}`;
      if ($('transModeTag')) $('transModeTag').textContent = res.modeLabel;
      if (shouldSpeak && res.native !== '—') {
        speakText(res.native, res.rom, sc.tts);
      }
    };

    if (transIn) {
      transIn.addEventListener('input', (e) => updateTranslator(e.target.value, false));
    }
    const transSpk = $('transSpeakBtn');
    if (transSpk) {
      transSpk.addEventListener('click', () => {
        const res = transliterateText(sc, transIn ? transIn.value : '');
        if (res.native !== '—') {
          const mode = speakText(res.native, res.rom, sc.tts);
          if ($('transModeTag') && mode) {
            $('transModeTag').textContent = res.modeLabel + (mode === 'native' ? L.nativeVoiceNote : L.approxVoiceNote);
          }
        }
      });
    }
    document.querySelectorAll('#phraseChips .phrase-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const entry = sc.dict[Number(chip.getAttribute('data-pidx'))];
        if (!entry) return;
        const word = LANG === 'en' ? entry[1][0] : entry[0][0];
        if (transIn) transIn.value = word;
        updateTranslator(word, true);
      });
    });
  }

  const HE_FINAL_MAP = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
  const AR_BASE_MAP = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ى': 'ي', 'ة': 'ه', 'ؤ': 'و', 'ئ': 'ي' };

  function buildWordChips(sc, word) {
    const tokens = [];
    if (sc.id === 'hiragana') {
      let i = 0;
      while (i < word.length) {
        if (word[i] === 'っ' && i + 1 < word.length) {
          const nxt = HIRA_TO_ROMAJI[word[i + 1]] || HIRA_EXTRA[word[i + 1]] || '';
          tokens.push(`<span class="bk-chip">っ [${nxt ? nxt[0] + '·' : 'pausa'}]</span>`);
          i++;
          continue;
        }
        const di = word.slice(i, i + 2);
        if (HIRA_TO_ROMAJI[di]) {
          tokens.push(`<span class="bk-chip">${di} [${HIRA_TO_ROMAJI[di]}]</span>`);
          i += 2;
          continue;
        }
        const one = word[i];
        const rom = HIRA_TO_ROMAJI[one] || HIRA_EXTRA[one];
        if (rom) tokens.push(`<span class="bk-chip">${one} [${rom}]</span>`);
        i++;
      }
      return tokens.join('');
    }

    const findCharRow = (sym) =>
      sc.chars.find((row) =>
        row[0]
          .split(/\s+|\/| /)
          .some((tok) => tok && tok.toLowerCase() === sym.toLowerCase())
      );

    if (sc.id === 'hangul') {
      for (const ch of word) {
        const code = ch.charCodeAt(0);
        if (code >= 0xac00 && code <= 0xd7a3) {
          const idx = code - 0xac00;
          const li = Math.floor(idx / 588);
          const vi = Math.floor((idx % 588) / 28);
          const ti = idx % 28;
          const jamos = [KO_L[li], KO_V[vi], KO_T[ti]].filter(Boolean);
          const parts = jamos.map((j) => {
            const row = findCharRow(j);
            return row ? `${j} ${row[2].split('/')[0].trim()}` : j;
          });
          tokens.push(`<span class="bk-chip">${ch} (${parts.join(' + ')})</span>`);
        }
      }
      return tokens.join('');
    }

    if (sc.id === 'hebrew' || sc.id === 'arabic') {
      const combRe = sc.id === 'hebrew' ? /[\u0591-\u05C7]/ : /[\u064B-\u065F\u0670]/;
      const chars = Array.from(word);
      for (let i = 0; i < chars.length; i++) {
        const base = chars[i];
        if (combRe.test(base) || /\s/.test(base)) continue;
        let cluster = base;
        while (i + 1 < chars.length && combRe.test(chars[i + 1])) {
          cluster += chars[++i];
        }
        const lookup = sc.id === 'hebrew' ? (HE_FINAL_MAP[base] || base) : (AR_BASE_MAP[base] || base);
        const row = findCharRow(base) || findCharRow(lookup);
        const sound = row ? row[2].split('/')[0].trim() : '?';
        tokens.push(`<span class="bk-chip">${cluster} [${sound}]</span>`);
      }
      return tokens.join('');
    }

    for (const rawCh of word) {
      if (/\s|[.,!?-]/.test(rawCh)) continue;
      let norm = rawCh.toLowerCase();
      if (sc.id === 'greek') {
        norm = norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (norm === 'ς') norm = 'σ';
      }
      const row = findCharRow(norm);
      const sound = row ? row[2].split('/')[0].trim() : '?';
      tokens.push(`<span class="bk-chip">${rawCh} [${sound}]</span>`);
    }
    return tokens.join('');
  }

  // ---------------- MODO PRACTICAR Y EXAMEN ----------------
  function nextQuestion() {
    const sc = currentScript();
    const L = t();
    $('felt').classList.remove('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    if (state.mode === 'test' && state.total >= TEST_LEN) {
      finishTest();
      return;
    }

    state.answered = false;
    const kind = state.task === 'mix' ? pick(['chars', 'words']) : state.task;
    const progressMeta =
      state.mode === 'test' ? `${state.total + 1} / ${TEST_LEN} · ${sc.sub[LANG]}` : sc.sub[LANG];

    if (kind === 'chars') {
      const target = pick(sc.chars);
      const others = shuffle(sc.chars.filter((x) => x[0] !== target[0])).slice(0, 3);
      const options = shuffle([target, ...others]);
      const askSound = Math.random() < 0.6;

      setPrompt({
        eyebrow: `${sc.title[LANG]} · ${L.modes[state.mode]}`,
        name: askSound
          ? (LANG === 'es' ? `¿Qué letra y sonido es «${target[0]}»?` : `Which letter and sound is "${target[0]}"?`)
          : (LANG === 'es' ? `¿Qué carácter representa «${target[1]} [${target[2]}]»?` : `Which character represents "${target[1]} [${target[2]}]"?`),
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      $('felt').innerHTML = `
        <div class="alpha-wrap">
          <div class="quiz-box">
            <div class="quiz-glyph">${askSound ? target[0] : `${target[1]} [${target[2]}]`}</div>
            <div class="quiz-sub" id="qHint">&nbsp;</div>
            <button type="button" class="speak-btn subtle" id="qSpeakBtn" ${ENABLE_AUDIO ? '' : 'hidden'}>${L.speakBtn}</button>
          </div>
          <div class="quiz-breakdown" id="qBreak" hidden></div>
        </div>
      `;

      const qs = $('qSpeakBtn');
      if (qs) qs.addEventListener('click', () => speakText(target[0].split(/\s+|\/| /)[0], target[2].split('/')[0].trim(), sc.tts));

      const act = $('actions');
      act.innerHTML = '';
      options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'act';
        const label = askSound ? `${opt[1]} [${opt[2]}]` : opt[0];
        b.innerHTML = `${label} <kbd>${idx + 1}</kbd>`;
        b.addEventListener('click', () => {
          if (state.answered) return;
          const ok = opt[0] === target[0];
          const art = LANG === 'en' ? target[6] : target[5];
          $('qHint').textContent = `${target[0]} · ${target[1]} [${target[2]}] · IPA ${target[4]}`;
          const br = $('qBreak');
          if (br) {
            br.innerHTML = `
              <h5>${LANG === 'en' ? 'Phonology & articulation' : 'Fonología y articulación'}</h5>
              <p><b>${target[0]}</b> · ${target[1]} · <b>[${target[2]}]</b> · IPA <code>${target[4]}</code></p>
              <p>${art}</p>
              <p><b>${LANG === 'en' ? 'Key anchor:' : 'Referencia rápida:'}</b> ${target[3]}</p>
            `;
            br.hidden = false;
          }
          finalizeChoice(ok, b, `${target[0]} = ${target[1]} [${target[2]}]`, options.indexOf(target));
        });
        act.appendChild(b);
      });
    } else {
      const target = pick(sc.words);
      const others = shuffle(sc.words.filter((x) => x[0] !== target[0])).slice(0, 3);
      const options = shuffle([target, ...others]);

      setPrompt({
        eyebrow: `${sc.title[LANG]} · ${L.modes[state.mode]}`,
        name: LANG === 'es' ? `Lee esta palabra (Romaji / lectura)` : `Read this word (Romaji / reading)`,
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      $('felt').innerHTML = `
        <div class="alpha-wrap">
          <div class="quiz-box">
            <div class="quiz-glyph">${target[0]}</div>
            <div class="quiz-sub" id="qHint">&nbsp;</div>
            <button type="button" class="speak-btn subtle" id="qSpeakBtn" ${ENABLE_AUDIO ? '' : 'hidden'}>${L.speakBtn}</button>
          </div>
          <div class="quiz-breakdown" id="qBreak" hidden></div>
        </div>
      `;

      const qs = $('qSpeakBtn');
      if (qs) qs.addEventListener('click', () => speakText(target[0], target[1], sc.tts));

      const act = $('actions');
      act.innerHTML = '';
      options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'act';
        b.innerHTML = `${opt[1]} <kbd>${idx + 1}</kbd>`;
        b.addEventListener('click', () => {
          if (state.answered) return;
          const ok = opt[0] === target[0];
          const mean = LANG === 'en' ? target[4] : target[3];
          $('qHint').textContent = `${target[0]} → ${target[1]} (${target[2]}) · ${mean}`;
          const br = $('qBreak');
          if (br) {
            const chips = buildWordChips(sc, target[0]);
            const dirNote = (sc.id === 'hebrew' || sc.id === 'arabic')
              ? (LANG === 'en' ? '<p><b>Reading order:</b> right to left (←).</p>' : '<p><b>Sentido de lectura:</b> derecha a izquierda (←).</p>')
              : (sc.id === 'hangul'
                ? (LANG === 'en' ? '<p><b>Syllable blocks:</b> lead + vowel (+ tail).</p>' : '<p><b>Bloques silábicos:</b> inicial + vocal (+ cierre).</p>')
                : '');
            br.innerHTML = `
              <h5>${LANG === 'en' ? 'Word breakdown' : 'Desglose de lectura'}</h5>
              <p><b>${target[0]}</b> → <b>${target[1]}</b> · (${target[2]}) · <em>${mean}</em></p>
              ${chips ? `<div class="bk-chips">${chips}</div>` : ''}
              ${dirNote}
            `;
            br.hidden = false;
          }
          speakText(target[0], target[1], sc.tts);
          finalizeChoice(ok, b, `${target[0]} = ${target[1]}`, options.indexOf(target));
        });
        act.appendChild(b);
      });
    }
  }

  function finalizeChoice(isRight, clickedBtn, rightLabel, rightIdx) {
    if (state.answered) return;
    state.answered = true;
    const L = t();

    document.querySelectorAll('#actions .act').forEach((b, i) => {
      b.disabled = true;
      if (i === rightIdx) b.classList.add('is-right');
      else if (b === clickedBtn && !isRight) b.classList.add('is-wrong');
    });

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
      meta: state.mode === 'test' ? `${state.total} / ${TEST_LEN}` : currentScript().title[LANG],
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
    const sc = currentScript();
    const pct = Math.round((100 * state.right) / TEST_LEN);
    const timeSec = Math.round(state.frozen);
    const passed = pct >= 90;

    const prev = state.bests[sc.id];
    if (!prev || pct > prev.pct || (pct === prev.pct && timeSec < prev.time)) {
      state.bests[sc.id] = { pct, time: timeSec };
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
      <div class="alpha-wrap">
        <div class="quiz-box">
          <div class="quiz-glyph">${pct}%</div>
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

  document.querySelectorAll('#taskSeg button').forEach((b) => {
    b.addEventListener('click', () => {
      state.task = b.getAttribute('data-v');
      saved.set('task', state.task);
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
    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;
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
