(() => {
  'use strict';

  const DATA = window.PROTOCOLS_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('net-protocols') : null;
  function readSaved(key, fb) { return saved ? saved.get(key, fb) : fb; }
  function writeSaved(key, val) { if (saved) saved.set(key, val); }
  function detectInitialLang() {
    try {
      const shared = window.localStorage && window.localStorage.getItem('todologo.lang');
      if (shared === 'es' || shared === 'en') return shared;
    } catch (_) {}
    const loc = readSaved('lang', null);
    return (loc === 'es' || loc === 'en') ? loc : 'es';
  }

  let LANG = detectInitialLang();

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&/+\-×"'“”‘’().,:·]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compactAlnum(s) {
    return norm(s).replace(/\s+/g, '');
  }

  function digitsOf(s) {
    return String(s || '').replace(/\D/g, '');
  }

  function editDist(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          v = Math.min(v, d[i - 2][j - 2] + cost);
        }
        d[i][j] = v;
      }
    }
    return d[m][n];
  }

  const VAGUE_PROTOCOL = {
    'correo': { es: '¿Envío (SMTP), lectura sincronizada (IMAP) o descarga local (POP3)?', en: 'Mail sending (SMTP), synced mailbox (IMAP), or local download (POP3)?' },
    'email': { es: '¿SMTP, IMAP o POP3?', en: 'SMTP, IMAP, or POP3?' },
    'mail': { es: '¿SMTP, IMAP o POP3?', en: 'SMTP, IMAP, or POP3?' },
    'archivo': { es: '¿FTP, SFTP, FTPS, TFTP, SMB o NFS?', en: 'FTP, SFTP, FTPS, TFTP, SMB, or NFS?' },
    'archivos': { es: '¿FTP, SFTP, FTPS, TFTP, SMB o NFS?', en: 'FTP, SFTP, FTPS, TFTP, SMB, or NFS?' },
    'file': { es: '¿FTP, SFTP, FTPS, TFTP, SMB o NFS?', en: 'FTP, SFTP, FTPS, TFTP, SMB, or NFS?' },
    'files': { es: '¿FTP, SFTP, FTPS, TFTP, SMB o NFS?', en: 'FTP, SFTP, FTPS, TFTP, SMB, or NFS?' },
    'vpn': { es: '¿WireGuard o IPsec?', en: 'WireGuard or IPsec?' },
    'routing': { es: '¿BGP (entre AS) u OSPF (interior IGP)?', en: 'BGP (inter-AS) or OSPF (interior IGP)?' },
    'enrutamiento': { es: '¿BGP (entre AS) u OSPF (interior IGP)?', en: 'BGP (inter-AS) or OSPF (interior IGP)?' },
    'seguridad': { es: 'Especifica el protocolo de seguridad (TLS, IPsec, WireGuard, SSH, Kerberos…).', en: 'Specify the security protocol (TLS, IPsec, WireGuard, SSH, Kerberos…).' },
    'security': { es: 'Especifica el protocolo de seguridad (TLS, IPsec, WireGuard, SSH…).', en: 'Specify the security protocol (TLS, IPsec, WireGuard, SSH…).' },
    'web': { es: '¿HTTP, HTTPS, HTTP/3 (QUIC), WebSocket o gRPC?', en: 'HTTP, HTTPS, HTTP/3 (QUIC), WebSocket, or gRPC?' },
    'ip': { es: '¿IPv4 o IPv6?', en: 'IPv4 or IPv6?' },
    'protocolo': { es: 'Escribe las siglas o nombre exacto del protocolo.', en: 'Enter the exact protocol acronym or name.' },
    'protocol': { es: 'Escribe las siglas o nombre exacto del protocolo.', en: 'Enter the exact protocol acronym or name.' }
  };

  function makeIndex() {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function addRaw(m, raw, fuzzyOk) {
      const k = norm(raw);
      if (!k || k.length < 2 || VAGUE_PROTOCOL[k]) return;
      if (!exact.has(k)) exact.set(k, m);
      const ck = compactAlnum(raw);
      if (ck && ck.length >= 2 && !VAGUE_PROTOCOL[ck] && !exact.has(ck)) {
        exact.set(ck, m);
      }
      if (fuzzyOk && k.length >= 6) {
        const sig = m.id + '|' + k;
        if (!seen.has(sig)) {
          seen.add(sig);
          candidates.push({ item: m, key: k, digits: digitsOf(k) });
        }
      }
    }

    function addNameExpr(m, str) {
      if (!str) return;
      addRaw(m, str, true);
      const noParen = String(str).replace(/\([^)]*\)/g, ' ');
      addRaw(m, noParen, noParen.trim().length >= 6);
      noParen.split(/[&/]/).forEach(part => {
        const trimmed = part.trim();
        if (norm(trimmed).length >= 2) addRaw(m, trimmed, false);
      });
    }

    ITEMS.forEach(m => {
      addNameExpr(m, m.name);
      addRaw(m, m.id, false);
      if (m.fullName) {
        addRaw(m, m.fullName.es, true);
        addRaw(m, m.fullName.en, true);
        addRaw(m, String(m.fullName.es || '').replace(/\([^)]*\)/g, ' '), true);
        addRaw(m, String(m.fullName.en || '').replace(/\([^)]*\)/g, ' '), true);
      }
      (m.aka || []).forEach(a => addRaw(m, a, norm(a).length >= 6));
    });
    return { exact, candidates };
  }

  const INDEX = makeIndex();

  function allPortAliasesSet(m) {
    const set = new Set();
    function add(s) {
      const k = norm(s);
      if (!k) return;
      set.add(k);
      const c = compactAlnum(s);
      if (c) set.add(c);
    }
    add(m.port);
    add(m.portShort);
    (m.portAliases || []).forEach(add);
    return set;
  }

  function looksLikePortInput(q) {
    if (/^\d{1,5}$/.test(q)) return true;
    if (/^(puerto|port|tcp|udp|capa|layer|l|proto|esp)\s*\d{1,5}$/.test(q)) return true;
    if (/^0x[0-9a-f]{4}$/.test(q)) return true;
    return false;
  }

  function checkAnswer(raw, target) {
    const q = norm(raw);
    if (!q) return { status: 'empty' };
    const qCompact = compactAlnum(raw);

    if (S.target === 'port') {
      const directProto = INDEX.exact.get(q) || INDEX.exact.get(qCompact);
      if (directProto && !looksLikePortInput(q)) {
        return {
          status: 'vague',
          msg: LANG === 'en'
            ? 'That is the protocol name — enter its port or layer (e.g. 443, 22, Layer 3).'
            : 'Ese es el nombre del protocolo — escribe su puerto o capa (ej. 443, 22, Capa 3).'
        };
      }
      const allowed = allPortAliasesSet(target);
      const qStripped = q.replace(/^(puerto|port|el)\s+/, '').trim();
      const qProtoTrim = qStripped.replace(/^(tcp|udp)\s+/, '').trim();
      if (allowed.has(q) || allowed.has(qCompact) || allowed.has(qStripped) || allowed.has(qProtoTrim)) {
        return { status: 'right', item: target };
      }
      return { status: 'wrong', matched: null };
    }

    if (VAGUE_PROTOCOL[q] || VAGUE_PROTOCOL[qCompact]) {
      const entry = VAGUE_PROTOCOL[q] || VAGUE_PROTOCOL[qCompact];
      return { status: 'vague', msg: entry[LANG] || entry.es };
    }

    if (looksLikePortInput(q)) {
      return {
        status: 'vague',
        msg: LANG === 'en'
          ? 'That looks like a port or layer number — type the protocol name (e.g. HTTPS, DNS).'
          : 'Eso parece un puerto o capa — escribe el nombre del protocolo (ej. HTTPS, DNS).'
      };
    }

    const direct = INDEX.exact.get(q) || INDEX.exact.get(qCompact);
    if (direct) {
      return direct.id === target.id
        ? { status: 'right', item: target }
        : { status: 'wrong', matched: direct };
    }

    const qDigits = digitsOf(q);
    let bestItem = null;
    let bestDist = 99;
    let targetDist = 99;

    for (let i = 0; i < INDEX.candidates.length; i++) {
      const c = INDEX.candidates[i];
      if ((c.digits || qDigits) && c.digits !== qDigits) continue;
      const limit = c.key.length >= 12 ? 2 : (c.key.length >= 6 ? 1 : 0);
      if (!limit) continue;
      const d = editDist(q, c.key);
      if (d <= limit) {
        if (d < bestDist) { bestDist = d; bestItem = c.item; }
        if (c.item.id === target.id && d < targetDist) { targetDist = d; }
      }
    }

    if (targetDist < 99 && targetDist <= bestDist) return { status: 'right', item: target };
    if (bestItem && bestItem.id !== target.id) return { status: 'wrong', matched: bestItem };
    return { status: 'wrong', matched: null };
  }

  function escRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function maskText(text, m, quizTarget) {
    let out = String(text == null ? '' : text);
    if (!quizTarget) return out;

    if (quizTarget === 'protocol') {
      const tokens = new Set();
      function collect(s) {
        if (!s) return;
        const clean = String(s).trim();
        if (clean.length >= 2) tokens.add(clean);
        const noParen = clean.replace(/\([^)]*\)/g, ' ').trim();
        if (noParen.length >= 2) tokens.add(noParen);
        noParen.split(/[/&]/).forEach(p => {
          const t = p.trim();
          if (t.length >= 2) tokens.add(t);
        });
      }
      collect(m.name);
      if (m.fullName) { collect(m.fullName.es); collect(m.fullName.en); }
      (m.aka || []).forEach(collect);
      const idWord = m.id.replace(/-/g, ' ');
      if (idWord.length >= 2) tokens.add(idWord);

      if (m.id === 'pop3') tokens.add('POP');
      if (m.id === 'ftps') tokens.add('FTP');

      const sorted = Array.from(tokens).sort((a, b) => b.length - a.length);
      sorted.forEach(tok => {
        const safe = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const startsAlnum = /^[A-Za-z0-9]/.test(tok);
        const endsAlnum = /[A-Za-z0-9]$/.test(tok);
        const pattern = tok.length <= 4 && startsAlnum && endsAlnum
          ? '(?<![A-Za-z0-9])' + safe + '(?:v\\d(?:\\.\\d)?)?(?![A-Za-z0-9])'
          : safe;
        try {
          out = out.replace(new RegExp(pattern, 'gi'), '[ ??? ]');
        } catch (_) {
          out = out.replace(new RegExp(safe, 'gi'), '[ ??? ]');
        }
      });
      // Safety pass if acronym appeared glued inside a prefix like [DNS] or DNSSEC for DNS
      if (m.name && /^[A-Za-z0-9]{2,6}$/.test(m.name)) {
        out = out.replace(new RegExp(escRe(m.name), 'gi'), '[ ??? ]');
      }
      return out;
    }

    if (quizTarget === 'port') {
      const exactStrings = [m.port, m.portShort].filter(Boolean).sort((a, b) => b.length - a.length);
      exactStrings.forEach(ps => {
        out = out.replace(new RegExp(escRe(ps), 'gi'), '[ :??? ]');
      });
      const nums = new Set();
      (m.portAliases || []).forEach(a => {
        const s = String(a).trim();
        if (/^\d{2,5}$/.test(s) || /^0x[0-9a-f]{4}$/i.test(s)) nums.add(s);
        if (/^(?:proto|capa|layer)\s+\d+$/i.test(s)) nums.add(s);
      });
      Array.from(nums).sort((a, b) => b.length - a.length).forEach(n => {
        out = out.replace(new RegExp('(?:Puerto\\s+|Port\\s+|:)?\\b' + escRe(n) + '\\b', 'gi'), ':???');
      });
      return out;
    }

    return out;
  }

  const I18N = {
    es: {
      docTitle: 'Protocolos de Red, Web y Puertos — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'PROTOCOLOS <span>DE RED</span>',
      brandSub: 'Domina 48 protocolos (HTTPS, DNS, SSH, TCP, BGP) y puertos',
      railLabel: 'Familias',
      railTitle: 'Familias',
      allCats: 'Todas las familias',
      searchPlaceholder: 'Buscar protocolo, puerto (ej. 443, 22), OSI o RFC…',
      searchAria: 'Buscar protocolo',
      clearSearch: 'Limpiar búsqueda',
      noMatches: 'Sin protocolos que coincidan con tu búsqueda.',
      settings: 'Ajustes',
      cleanExit: 'Salir de vista limpia',
      lblAcc: 'Acierto',
      lblTime: 'Tiempo',
      lblStreak: 'Racha',
      done: 'Listo',
      lblLang: 'Idioma',
      lblMode: 'Modo',
      modeStudy: 'Explorar',
      modePractice: 'Aprender',
      modeTest: 'Examen',
      lblSet: 'Protocolos',
      setPopular: 'Esenciales',
      setAll: 'Todos',
      lblTarget: 'Preguntar por',
      tgtProtocol: 'Protocolo',
      tgtPort: 'Puerto',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanBtn: 'Vista limpia',
      soundYes: 'Sonido: Sí',
      soundNo: 'Sonido: No',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      creditLine: 'Diagramas vectoriales propios según especificaciones IETF RFC / IEEE. Adaptado para Todologo.',
      introTitle: 'Aprende protocolos y puertos',
      intro1: 'Cada ficha incluye la barra de capas OSI (L2 a L7), un diagrama secuencia cliente-servidor y una traza estilo <b>tcpdump / Wireshark</b>.',
      intro2: 'Alterna entre <b>Protocolo</b> (reconoce HTTPS, DNS, SSH o BGP por su traza y puertos) y <b>Puerto</b> (recuerda el puerto TCP/UDP o capa exacta).',
      intro3: 'En escritura distinguimos siglas cercanas como <b>HTTP vs HTTPS</b>, <b>FTP vs SFTP/TFTP</b> o <b>SMTP vs SNMP</b> sin falsos positivos.',
      keysTitle: 'Teclas',
      eyebrowExplore: '{set} · Explorar',
      eyebrowLearn: '{set} · Aprender',
      eyebrowTest: '{set} · Examen',
      eyebrowDetail: '{cat} · Protocolo {idx}/{n}',
      eyebrowSummary: 'Resultado del examen',
      promptProto: '¿Qué protocolo corresponde a este tráfico?',
      promptPort: '¿Qué puerto o capa usa {name}?',
      countModels: '{n} protocolos',
      studyThese: 'Aprender estos',
      allList: 'Todos',
      prev: '← Anterior',
      next: 'Siguiente →',
      hint: 'Pista',
      check: 'Comprobar',
      typeProtoPh: 'Ej. HTTPS, SSH, DNS, BGP, ARP…',
      typePortPh: 'Ej. 443, 22, 53, Capa 3…',
      okEyebrow: '¡Correcto!',
      badEyebrow: 'Era: {name}',
      warnEyebrow: 'Aclara la respuesta',
      specFull: 'Nombre completo',
      specOsi: 'Modelo OSI',
      specTransport: 'Transporte',
      specPort: 'Puerto / ID',
      specSec: 'Seguridad',
      specRfc: 'Estándar',
      wikiLabel: 'Ver en Wikipedia',
      hiddenPort: 'Puerto / Capa: :???',
      bestLabel: 'Mejor marca ({scope}):',
      bestNone: 'Aún sin examen completado aquí.',
      knowLabel: 'Dominados: {k}/{n}',
      resAcc: 'Acierto',
      resTime: 'Tiempo',
      resStreak: 'Mejor racha',
      resPlayAgain: 'Repetir examen',
      resStudyMisses: 'Repasar {n} fallos',
      resExplore: 'Volver a explorar',
      resKeyOk: 'Aciertos: {n}',
      resKeyBad: 'Fallos: {n}',
      resPerfect: '¡Puntaje perfecto sin errores!',
      resClickMiss: 'Toca un fallo para revisar su diagrama.',
      missTitle: 'Protocolos para repasar',
      yourAnswer: 'Tu respuesta: {ans}',
      hintPrefix: 'Pista:',
      help: {
        rail: ['Familias de red', 'Filtra por Web/APIs, Archivos/Correo/Remoto, Seguridad/DNS/Infra o Transporte/IP/Routing.'],
        mode: ['Modos', 'Explorar muestra el catálogo técnico; Aprender repite fallos; Examen evalúa sin pistas.'],
        target: ['Preguntar por', 'Protocolo oculta el nombre y muestra el intercambio de paquetes; Puerto muestra el protocolo y pregunta puerto o capa.'],
        set: ['Conjunto', 'Esenciales selecciona los 25 protocolos clave; Todos abre la colección completa de 48.'],
        answer: ['Responder', 'Elige entre 4 opciones distintas o escribe siglas / puertos directamente.']
      },
      keys: [
        ['1 – 4', 'Elegir opción'],
        ['H', 'Mostrar pista al escribir'],
        ['Enter / →', 'Siguiente protocolo tras responder'],
        ['← / →', 'Navegar tarjetas en Explorar'],
        ['P', 'Pasar de Explorar a Aprender'],
        ['Esc', 'Volver a catálogo o cerrar modal']
      ]
    },
    en: {
      docTitle: 'Network Protocols, Web & Ports — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'NET <span>PROTOCOLS</span>',
      brandSub: 'Master 48 protocols (HTTPS, DNS, SSH, TCP, BGP) & ports',
      railLabel: 'Families',
      railTitle: 'Families',
      allCats: 'All families',
      searchPlaceholder: 'Search protocol, port (e.g. 443, 22), OSI or RFC…',
      searchAria: 'Search protocol',
      clearSearch: 'Clear search',
      noMatches: 'No protocols match your search.',
      settings: 'Settings',
      cleanExit: 'Exit clean view',
      lblAcc: 'Accuracy',
      lblTime: 'Time',
      lblStreak: 'Streak',
      done: 'Done',
      lblLang: 'Language',
      lblMode: 'Mode',
      modeStudy: 'Explore',
      modePractice: 'Learn',
      modeTest: 'Test',
      lblSet: 'Protocols',
      setPopular: 'Core',
      setAll: 'All',
      lblTarget: 'Quiz target',
      tgtProtocol: 'Protocol',
      tgtPort: 'Port',
      lblAnswer: 'Answer',
      ansChoose: 'Multiple choice',
      ansType: 'Typing',
      restart: 'Restart',
      cleanBtn: 'Clean view',
      soundYes: 'Sound: On',
      soundNo: 'Sound: Off',
      keysBtn: 'Keys',
      howBtn: 'How it works',
      creditLine: 'Original vector sequence diagrams based on IETF RFC / IEEE specs. Built for Todologo.',
      introTitle: 'Learn protocols & ports',
      intro1: 'Each card displays the 7-layer OSI indicator, a client-server packet sequence diagram, and a <b>tcpdump / Wireshark</b> line.',
      intro2: 'Switch between <b>Protocol</b> (identify traffic and ports) and <b>Port</b> (recall the exact TCP/UDP port or layer number).',
      intro3: 'Strict acronym checking distinguishes close lookalikes such as <b>HTTP vs HTTPS</b>, <b>FTP vs SFTP/TFTP</b>, and <b>SMTP vs SNMP</b>.',
      keysTitle: 'Shortcuts',
      eyebrowExplore: '{set} · Explore',
      eyebrowLearn: '{set} · Learn',
      eyebrowTest: '{set} · Test',
      eyebrowDetail: '{cat} · Protocol {idx}/{n}',
      eyebrowSummary: 'Exam summary',
      promptProto: 'Which protocol matches this traffic?',
      promptPort: 'Which port or layer does {name} use?',
      countModels: '{n} protocols',
      studyThese: 'Learn these',
      allList: 'All',
      prev: '← Previous',
      next: 'Next →',
      hint: 'Hint',
      check: 'Check',
      typeProtoPh: 'e.g. HTTPS, SSH, DNS, BGP, ARP…',
      typePortPh: 'e.g. 443, 22, 53, Layer 3…',
      okEyebrow: 'Correct!',
      badEyebrow: 'Answer: {name}',
      warnEyebrow: 'Clarify answer',
      specFull: 'Full name',
      specOsi: 'OSI Layer',
      specTransport: 'Transport',
      specPort: 'Port / ID',
      specSec: 'Security',
      specRfc: 'Standard',
      wikiLabel: 'Wikipedia entry',
      hiddenPort: 'Port / Layer: :???',
      bestLabel: 'Best score ({scope}):',
      bestNone: 'No completed test yet for this filter.',
      knowLabel: 'Mastered: {k}/{n}',
      resAcc: 'Accuracy',
      resTime: 'Time',
      resStreak: 'Best streak',
      resPlayAgain: 'Run again',
      resStudyMisses: 'Review {n} misses',
      resExplore: 'Back to explore',
      resKeyOk: 'Correct: {n}',
      resKeyBad: 'Missed: {n}',
      resPerfect: 'Perfect score — zero misses!',
      resClickMiss: 'Click a missed item to study its handshake diagram.',
      missTitle: 'Protocols to review',
      yourAnswer: 'You answered: {ans}',
      hintPrefix: 'Hint:',
      help: {
        rail: ['Protocol families', 'Filter between Web/APIs, Files/Mail/Remote, Security/DNS/Infra, or Transport/IP/Routing.'],
        mode: ['Modes', 'Explore opens searchable diagrams; Learn repeats misses; Test times a full exam.'],
        target: ['Quiz target', 'Protocol masks names and shows handshake traces; Port shows the protocol and quizzes its port or OSI layer.'],
        set: ['Deck size', 'Core highlights essential daily protocols; All covers all 48 specifications.'],
        answer: ['Answer style', 'Select from 4 unique options or type acronyms / ports directly.']
      },
      keys: [
        ['1 – 4', 'Pick an option'],
        ['H', 'Show typing hint'],
        ['Enter / →', 'Advance after answer'],
        ['← / →', 'Step cards in Explore'],
        ['P', 'Jump from Explore to Learn'],
        ['Esc', 'Back to grid or close dialog']
      ]
    }
  };

  function t(key, vars) {
    const table = I18N[LANG] || I18N.es;
    let str = table[key] != null ? table[key] : (I18N.es[key] || key);
    if (vars) Object.keys(vars).forEach(k => { str = String(str).replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
    return str;
  }

  function $(id) { return document.getElementById(id); }
  const el = {
    homeLink: $('homeLink'), toolMark: $('toolMark'), brandSub: $('brandSub'),
    rail: $('rail'), railTitle: $('railTitle'), railList: $('railList'),
    prompt: $('prompt'), pEyebrow: $('pEyebrow'), pName: $('pName'), pMeta: $('pMeta'),
    pBarWrap: $('pBarWrap'), pBar: $('pBar'), reviewPanel: $('reviewPanel'),
    gridBar: $('gridBar'), exploreSearch: $('exploreSearch'), exploreClear: $('exploreClear'), exploreCount: $('exploreCount'),
    stageBox: $('stageBox'), view: $('view'), actions: $('actions'),
    settingsBtn: $('settingsBtn'), cleanExit: $('cleanExit'),
    stats: $('stats'), lblAcc: $('lblAcc'), sAcc: $('sAcc'), lblTime: $('lblTime'), sTime: $('sTime'), lblStreak: $('lblStreak'), sStreak: $('sStreak'),
    panel: $('panel'), closeSheet: $('closeSheet'), lblLang: $('lblLang'), langSel: $('langSel'),
    lblMode: $('lblMode'), modeSeg: $('modeSeg'), lblSet: $('lblSet'), setSeg: $('setSeg'),
    targetBox: $('targetBox'), lblTarget: $('lblTarget'), targetSeg: $('targetSeg'),
    answerBox: $('answerBox'), lblAnswer: $('lblAnswer'), answerSeg: $('answerSeg'),
    restartBtn: $('restartBtn'), cleanBtn: $('cleanBtn'), soundBtn: $('soundBtn'),
    best: $('best'), know: $('know'), keysBtn: $('keysBtn'), howBtn: $('howBtn'), creditLine: $('creditLine'),
    intro: $('intro'), introTitle: $('introTitle'), introClose: $('introClose'), intro1: $('intro1'), intro2: $('intro2'), intro3: $('intro3'),
    keysModal: $('keysModal'), keysTitle: $('keysTitle'), keysClose: $('keysClose'), keysList: $('keysList')
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function catLabel(id) {
    if (id === 'all') return t('allCats');
    const c = CAT_BY_ID[id];
    return c ? (c[LANG] || c.es || c.id) : id;
  }
  function setLabel(v) { return v === 'popular' ? t('setPopular') : t('setAll'); }

  const LOOKUP_LOOKALIKES = Object.create(null);
  (DATA.LOOKALIKES || []).forEach(g => g.forEach(id => {
    if (!LOOKUP_LOOKALIKES[id]) LOOKUP_LOOKALIKES[id] = [];
    g.forEach(o => { if (o !== id && LOOKUP_LOOKALIKES[id].indexOf(o) === -1) LOOKUP_LOOKALIKES[id].push(o); });
  }));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pool(cat, setVal) {
    const useCat = cat != null ? cat : S.category;
    const useSet = setVal != null ? setVal : S.set;
    let list = ITEMS.filter(m => (useCat === 'all' || m.category === useCat) && (useSet !== 'popular' || m.pop));
    if (!list.length) list = ITEMS.filter(m => useCat === 'all' || m.category === useCat);
    return list;
  }

  function choices(target) {
    const out = [target];
    const byPort = S.target === 'port';
    const seenIds = new Set([target.id]);
    const seenPorts = new Set([norm(target.port)]);

    function canUse(cand) {
      if (!cand || seenIds.has(cand.id)) return false;
      if (byPort && seenPorts.has(norm(cand.port))) return false;
      return true;
    }
    function take(cand) {
      seenIds.add(cand.id);
      seenPorts.add(norm(cand.port));
      out.push(cand);
    }

    shuffle((LOOKUP_LOOKALIKES[target.id] || []).slice()).forEach(id => {
      if (out.length < 4 && canUse(BY_ID[id])) take(BY_ID[id]);
    });
    const sameCat = shuffle(ITEMS.filter(m => m.category === target.category && m.id !== target.id));
    for (let i = 0; i < sameCat.length && out.length < 4; i++) {
      if (canUse(sameCat[i])) take(sameCat[i]);
    }
    const rest = shuffle(ITEMS);
    for (let i = 0; i < rest.length && out.length < 4; i++) {
      if (canUse(rest[i])) take(rest[i]);
    }
    return shuffle(out);
  }

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'all'),
    category: readSaved('category', 'all'),
    target: readSaved('target', 'protocol'),
    answer: readSaved('answer', 'choose'),
    sound: readSaved('sound', true),
    known: readSaved('known', {}) || {},
    best: readSaved('best', {}) || {},
    studyAt: null, exploreQuery: '',
    queue: [], deck: [], deckIdx: 0,
    current: null, opts: [], answered: false, hintLevel: 0,
    okCount: 0, totalAnswered: 0, streak: 0, bestStreak: 0, misses: [],
    startTs: 0, elapsedSec: 0, timerId: null, autoNextId: null
  };

  if (S.mode !== 'study' && S.mode !== 'practice' && S.mode !== 'test') S.mode = 'study';
  if (S.set !== 'popular' && S.set !== 'all') S.set = 'all';
  if (S.category !== 'all' && !CAT_BY_ID[S.category]) S.category = 'all';
  if (S.target !== 'protocol' && S.target !== 'port') S.target = 'protocol';
  if (S.answer !== 'choose' && S.answer !== 'type') S.answer = 'choose';

  let audioCtx = null;
  function tone(ok) {
    if (!S.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(ok ? 540 : 210, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);
      else osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.22);
    } catch (_) {}
  }

  function clearTimers() {
    if (S.timerId) { clearInterval(S.timerId); S.timerId = null; }
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
  }
  function fmtTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60), r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function updateStats() {
    el.stats.classList.toggle('is-off', S.mode === 'study');
    el.sAcc.textContent = S.totalAnswered ? Math.round((S.okCount / S.totalAnswered) * 100) + '%' : '–';
    el.sTime.textContent = fmtTime(S.elapsedSec);
    el.sStreak.textContent = String(S.streak);
  }
  function updateProgress() {
    if (S.mode === 'test' && S.deck.length) {
      el.pBarWrap.classList.remove('is-off');
      el.pBar.style.width = Math.min(100, Math.round((S.deckIdx / S.deck.length) * 100)) + '%';
    } else if (S.mode === 'practice') {
      const p = pool(), k = p.filter(m => S.known[m.id]).length;
      el.pBarWrap.classList.remove('is-off');
      el.pBar.style.width = (p.length ? Math.round((k / p.length) * 100) : 0) + '%';
    } else {
      el.pBarWrap.classList.add('is-off');
      el.pBar.style.width = '0%';
    }
  }
  function renderPanelMeta() {
    const scope = S.set + ':' + S.category + ':' + S.target, b = S.best[scope];
    if (b && typeof b.pct === 'number') {
      el.best.innerHTML = esc(t('bestLabel', { scope: catLabel(S.category) })) +
        ' <b>' + b.pct + '%</b> (' + fmtTime(b.time || 0) + ')';
    } else {
      el.best.textContent = t('bestNone');
    }
    const p = pool(), k = p.filter(m => S.known[m.id]).length;
    el.know.textContent = t('knowLabel', { k, n: p.length });
  }

  function renderRail() {
    const allItems = pool('all', S.set), allKnown = allItems.filter(m => S.known[m.id]).length;
    let html = '<button class="rg" type="button" data-cat="all" aria-pressed="' + (S.category === 'all') + '">' +
      '<span class="r-txt"><span>' + esc(t('allCats')) + '</span><span class="r-era">' + esc(t('countModels', { n: allItems.length })) + '</span></span>' +
      '<em' + (allKnown >= allItems.length && allItems.length ? ' class="done"' : '') + '>' + allKnown + '/' + allItems.length + '</em></button>';
    CATEGORIES.forEach(c => {
      const list = pool(c.id, S.set), k = list.filter(m => S.known[m.id]).length;
      html += '<button class="rg" type="button" data-cat="' + esc(c.id) + '" aria-pressed="' + (S.category === c.id) + '">' +
        '<span class="r-txt"><span>' + esc(c[LANG] || c.es) + '</span><span class="r-era">' + esc(c.era || '') + '</span></span>' +
        '<em' + (k >= list.length && list.length ? ' class="done"' : '') + '>' + k + '/' + list.length + '</em></button>';
    });
    el.railList.innerHTML = html;
    el.railList.querySelectorAll('button.rg').forEach(btn => {
      btn.addEventListener('click', () => {
        S.category = btn.getAttribute('data-cat');
        writeSaved('category', S.category);
        if (btn.scrollIntoView) try { btn.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (_) {}
        restart();
      });
    });
  }

  function buildSequenceSvg(m, quizTarget) {
    const nodeA = maskText((m.nodes && m.nodes.a && (m.nodes.a[LANG] || m.nodes.a.es)) || 'Client', m, quizTarget);
    const nodeB = maskText((m.nodes && m.nodes.b && (m.nodes.b[LANG] || m.nodes.b.es)) || 'Server', m, quizTarget);
    const steps = (m.flow || []).slice(0, 3);
    const yRows = [72, 114, 156];

    let rowsSvg = '';
    steps.forEach((step, idx) => {
      const y = yRows[idx] || (72 + idx * 42);
      const rawTxt = step[LANG] || step.es || '';
      const label = maskText(rawTxt, m, quizTarget);
      const dir = step.dir || 'ab';
      const stroke = dir === 'ba' ? '#ecdec2' : (dir === 'bi' ? '#5fd39a' : '#6fd0e8');
      let lineSvg = '';
      if (dir === 'ab') {
        lineSvg = '<line x1="92" y1="' + y + '" x2="462" y2="' + y + '" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round"/>' +
          '<polyline points="455,' + (y - 4) + ' 464,' + y + ' 455,' + (y + 4) + '" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      } else if (dir === 'ba') {
        lineSvg = '<line x1="468" y1="' + y + '" x2="98" y2="' + y + '" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round"/>' +
          '<polyline points="105,' + (y - 4) + ' 96,' + y + ' 105,' + (y + 4) + '" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      } else {
        lineSvg = '<line x1="98" y1="' + y + '" x2="462" y2="' + y + '" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round"/>' +
          '<polyline points="105,' + (y - 4) + ' 96,' + y + ' 105,' + (y + 4) + '" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<polyline points="455,' + (y - 4) + ' 464,' + y + ' 455,' + (y + 4) + '" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      rowsSvg += lineSvg +
        '<rect x="118" y="' + (y - 21) + '" width="324" height="16" rx="4" fill="#0c141d"/>' +
        '<text x="280" y="' + (y - 9) + '" text-anchor="middle" fill="' + stroke + '" font-family="IBM Plex Mono, monospace" font-size="10.2" font-weight="600">' + esc(label) + '</text>';
    });

    return '<svg class="seq-svg" viewBox="0 0 560 190" role="img" aria-label="Sequence Diagram">' +
      '<rect x="18" y="10" width="144" height="28" rx="6" fill="#121d28" stroke="#6fd0e8" stroke-width="1.4"/>' +
      '<text x="90" y="28" text-anchor="middle" fill="#ecdec2" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600">' + esc(nodeA) + '</text>' +
      '<rect x="398" y="10" width="144" height="28" rx="6" fill="#121d28" stroke="#5fd39a" stroke-width="1.4"/>' +
      '<text x="470" y="28" text-anchor="middle" fill="#ecdec2" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600">' + esc(nodeB) + '</text>' +
      '<line x1="90" y1="38" x2="90" y2="178" stroke="#223140" stroke-width="1.8" stroke-dasharray="4 4"/>' +
      '<line x1="470" y1="38" x2="470" y2="178" stroke="#223140" stroke-width="1.8" stroke-dasharray="4 4"/>' +
      rowsSvg +
    '</svg>';
  }

  function buildProtoPlateHtml(m, quizTarget) {
    const dimOsi = quizTarget === 'port' && m.osi < 7;
    let osiHtml = '<div class="osi-strip" aria-label="OSI">';
    for (let l = 7; l >= 1; l--) {
      const active = !dimOsi && m.osi === l;
      osiHtml += '<span' + (active ? ' class="is-on"' : '') + '>L' + l + '</span>';
    }
    osiHtml += '</div>';

    const secText = maskText((m.securityLabel && (m.securityLabel[LANG] || m.securityLabel.es)) || '', m, quizTarget);
    const transportText = maskText((m.transport && (m.transport[LANG] || m.transport.es)) || '', m, quizTarget);
    const portText = quizTarget === 'port' ? t('hiddenPort') : maskText(m.port, m, quizTarget);
    const traceText = maskText((m.trace && (m.trace[LANG] || m.trace.es)) || '', m, quizTarget);

    return '<div class="proto-head">' +
        osiHtml +
        '<div class="proto-badges">' +
          '<span class="pbadge is-' + esc(m.security || 'control') + '">' + esc(secText) + '</span>' +
          '<span class="pbadge">' + esc(transportText) + '</span>' +
          '<span class="pbadge">' + esc(portText) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="seq-box">' + buildSequenceSvg(m, quizTarget) + '</div>' +
      '<div class="pkt-trace"><b>pcap //</b><span>' + esc(traceText) + '</span></div>';
  }

  function buildSpecsHtml(m) {
    const full = (m.fullName && (m.fullName[LANG] || m.fullName.es)) || '';
    const osiL = (m.osiLabel && (m.osiLabel[LANG] || m.osiLabel.es)) || ('L' + m.osi);
    const tr = (m.transport && (m.transport[LANG] || m.transport.es)) || '';
    const sec = (m.securityLabel && (m.securityLabel[LANG] || m.securityLabel.es)) || '';
    const fact = (m.fact && (m.fact[LANG] || m.fact.es)) || '';
    return '<div class="facts">' +
      '<span><b>' + esc(t('specFull')) + ':</b> ' + esc(full) + '</span>' +
      '<span><b>' + esc(t('specOsi')) + ':</b> ' + esc(osiL) + '</span>' +
      '<span><b>' + esc(t('specTransport')) + ':</b> ' + esc(tr) + '</span>' +
      '<span><b>' + esc(t('specPort')) + ':</b> ' + esc(m.port) + '</span>' +
      '<span><b>' + esc(t('specSec')) + ':</b> ' + esc(sec) + '</span>' +
      '<span><b>' + esc(t('specRfc')) + ':</b> ' + esc(m.rfc) + '</span>' +
      '</div>' +
      (fact ? '<p class="fact-note">' + esc(fact) + '</p>' : '');
  }

  function createStagePlate(m, opts) {
    const quiz = !!(opts && opts.quiz);
    const quizTarget = quiz ? S.target : null;
    const wrap = document.createElement('div');
    wrap.className = quiz ? 'show' : 'detail';

    const show = quiz ? wrap : document.createElement('div');
    if (!quiz) { show.className = 'show'; wrap.appendChild(show); }

    const plate = document.createElement('div');
    plate.className = 'proto-plate';
    plate.innerHTML = buildProtoPlateHtml(m, quizTarget);
    show.appendChild(plate);

    if (!quiz) {
      if (m.wiki) {
        const cl = document.createElement('div');
        cl.className = 'credit-line';
        cl.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(m.wiki) + '" target="_blank" rel="noopener noreferrer">' + esc(t('wikiLabel')) + ' ↗</a>';
        show.appendChild(cl);
      }
      const sw = document.createElement('div');
      sw.className = 'spec-wrap';
      sw.innerHTML = buildSpecsHtml(m);
      wrap.appendChild(sw);
    } else {
      wrap.reveal = function () {
        plate.innerHTML = buildProtoPlateHtml(m, null);
        wrap.className = 'detail';
        const innerShow = document.createElement('div');
        innerShow.className = 'show';
        innerShow.appendChild(plate);
        wrap.textContent = '';
        wrap.appendChild(innerShow);
        if (m.wiki) {
          const cl = document.createElement('div');
          cl.className = 'credit-line';
          cl.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(m.wiki) + '" target="_blank" rel="noopener noreferrer">' + esc(t('wikiLabel')) + ' ↗</a>';
          innerShow.appendChild(cl);
        }
        const sw = document.createElement('div');
        sw.className = 'spec-wrap';
        sw.innerHTML = buildSpecsHtml(m);
        wrap.appendChild(sw);
      };
    }
    return wrap;
  }

  function clearPromptFeedback() {
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn', 'is-review');
    el.reviewPanel.hidden = true;
    el.reviewPanel.innerHTML = '';
    el.stageBox.classList.remove('flash-ok', 'flash-bad');
  }
  function flashStage(ok) {
    el.stageBox.classList.remove('flash-ok', 'flash-bad');
    el.stageBox.classList.add(ok ? 'flash-ok' : 'flash-bad');
    setTimeout(() => el.stageBox.classList.remove('flash-ok', 'flash-bad'), 450);
  }

  function filteredGridList(baseList) {
    const q = norm(S.exploreQuery);
    if (!q) return baseList;
    const tokens = q.split(' ').filter(Boolean);
    return baseList.filter(m => {
      const cat = CAT_BY_ID[m.category];
      const hay = norm([
        m.name,
        m.fullName && m.fullName.es, m.fullName && m.fullName.en,
        m.port, m.portShort, (m.portAliases || []).join(' '),
        m.osiLabel && m.osiLabel.es, m.osiLabel && m.osiLabel.en,
        'l' + m.osi, 'capa ' + m.osi, 'layer ' + m.osi,
        m.transport && m.transport.es, m.transport && m.transport.en,
        m.rfc, (m.aka || []).join(' '),
        cat && cat.es, cat && cat.en
      ].join(' '));
      return tokens.every(tok => hay.indexOf(tok) !== -1);
    });
  }

  function studyGrid() {
    S.studyAt = null;
    clearPromptFeedback();
    el.pEyebrow.textContent = t('eyebrowExplore', { set: setLabel(S.set) });
    el.pName.textContent = catLabel(S.category);
    const full = pool();
    const filtered = filteredGridList(full);
    el.pMeta.textContent = t('countModels', { n: full.length });
    el.gridBar.hidden = false;
    el.exploreClear.hidden = !S.exploreQuery.trim();
    el.exploreCount.textContent = filtered.length + ' / ' + full.length;

    const grid = document.createElement('div');
    grid.className = 'grid';

    if (!filtered.length) {
      grid.innerHTML = '<div class="grid-empty">' + esc(t('noMatches')) + '</div>';
    } else {
      const cats = S.category === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === S.category);
      cats.forEach(cat => {
        const rows = filtered.filter(m => m.category === cat.id);
        if (!rows.length) return;
        const head = document.createElement('div');
        head.className = 'head';
        head.innerHTML = '<span>' + esc(cat[LANG] || cat.es) + '</span><span>' + rows.length + '</span>';
        grid.appendChild(head);
        rows.forEach(m => {
          const card = document.createElement('button');
          card.type = 'button';
          card.className = 'pcard' + (S.known[m.id] ? ' is-known' : '');
          card.setAttribute('data-id', m.id);
          const sub = (m.fullName && (m.fullName[LANG] || m.fullName.es)) || m.name;
          card.innerHTML =
            '<div class="thumb">' +
              '<span class="osi-pill">L' + esc(m.osi) + '</span>' +
              '<span class="sec-dot is-' + esc(m.security || 'control') + '"></span>' +
              '<span class="acronym">' + esc(m.name) + '</span>' +
              '<span class="port-tag">' + esc(m.portShort || m.port) + '</span>' +
            '</div>' +
            '<div class="lbl"><b>' + esc(sub) + '</b></div>';
          card.addEventListener('click', () => studyOne(m.id));
          grid.appendChild(card);
        });
      });
    }

    el.view.textContent = '';
    el.view.appendChild(grid);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '<button class="act primary" type="button" id="goLearnBtn"><kbd>P</kbd><span class="txt">' + esc(t('studyThese')) + '</span></button>';
    const gl = $('goLearnBtn');
    if (gl) gl.addEventListener('click', () => setMode('practice'));
    updateStats();
    updateProgress();
  }

  function studyOne(id) {
    const m = BY_ID[id];
    if (!m) return studyGrid();
    S.studyAt = id;
    clearPromptFeedback();
    el.gridBar.hidden = true;
    const list = filteredGridList(pool());
    const idx = list.findIndex(x => x.id === id);
    el.pEyebrow.textContent = t('eyebrowDetail', { cat: catLabel(m.category), idx: (idx >= 0 ? idx : 0) + 1, n: list.length || 1 });
    el.pName.textContent = m.name;
    el.pMeta.textContent = ((m.fullName && (m.fullName[LANG] || m.fullName.es)) || '') + ' · ' + m.port;

    el.view.textContent = '';
    el.view.appendChild(createStagePlate(m, { quiz: false }));

    el.actions.className = 'actions row';
    el.actions.innerHTML =
      '<button class="act" type="button" id="prevCardBtn"><kbd>←</kbd><span class="txt">' + esc(t('prev')) + '</span></button>' +
      '<button class="act" type="button" id="backGridBtn"><kbd>Esc</kbd><span class="txt">' + esc(t('allList')) + '</span></button>' +
      '<button class="act primary" type="button" id="nextCardBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>→</kbd></button>';
    const prevBtn = $('prevCardBtn'), backBtn = $('backGridBtn'), nextBtn = $('nextCardBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => stepStudy(-1));
    if (backBtn) backBtn.addEventListener('click', studyGrid);
    if (nextBtn) nextBtn.addEventListener('click', () => stepStudy(1));
  }

  function stepStudy(delta) {
    const list = filteredGridList(pool());
    if (!list.length) return studyGrid();
    const idx = list.findIndex(x => x.id === S.studyAt);
    const nextIdx = idx < 0 ? 0 : (idx + delta + list.length) % list.length;
    studyOne(list[nextIdx].id);
  }

  function renderQuizQuestion(m) {
    S.current = m;
    S.answered = false;
    S.hintLevel = 0;
    clearPromptFeedback();
    el.gridBar.hidden = true;

    const tgtTag = S.target === 'port' ? t('tgtPort') : t('tgtProtocol');
    el.pEyebrow.textContent = (S.mode === 'test'
      ? t('eyebrowTest', { set: setLabel(S.set) }) + ' · ' + (S.deckIdx + 1) + '/' + S.deck.length
      : t('eyebrowLearn', { set: setLabel(S.set) }) + ' · ' + catLabel(S.category)) + ' · ' + tgtTag;

    if (S.target === 'port') {
      el.pName.textContent = t('promptPort', { name: m.name });
      el.pMeta.textContent = maskText((m.fullName && (m.fullName[LANG] || m.fullName.es)) || '', m, 'port');
    } else {
      el.pName.textContent = t('promptProto');
      el.pMeta.innerHTML = '&nbsp;';
    }

    const wrap = createStagePlate(m, { quiz: true });
    el.view.textContent = '';
    el.view.appendChild(wrap);
    S._activeWrap = wrap;

    if (S.answer === 'choose') {
      S.opts = choices(m);
      el.actions.className = 'actions';
      el.actions.innerHTML = S.opts.map((opt, i) => {
        const label = S.target === 'port' ? opt.port : opt.name;
        return '<button class="act" type="button" data-idx="' + i + '" data-id="' + esc(opt.id) + '">' +
          '<kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(label) + '</span>' +
        '</button>';
      }).join('');
      el.actions.querySelectorAll('button.act').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.getAttribute('data-idx'));
          submitChoice(S.opts[i], btn);
        });
      });
    } else {
      S.opts = [];
      const ph = S.target === 'port' ? t('typePortPh') : t('typeProtoPh');
      el.actions.className = 'actions row';
      el.actions.innerHTML =
        '<div class="typebox">' +
          '<input id="typeIn" type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(ph) + '">' +
          '<button class="act primary" type="button" id="typeGo">' + esc(t('check')) + '</button>' +
          '<button class="act" type="button" id="hintBtn">' + esc(t('hint')) + '</button>' +
        '</div>';
      const inp = $('typeIn'), go = $('typeGo'), hb = $('hintBtn');
      if (go) go.addEventListener('click', submitTyping);
      if (hb) hb.addEventListener('click', showHint);
      if (inp) {
        inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); submitTyping(); } });
        if (inp.focus) try { inp.focus(); } catch (_) {}
      }
    }
    updateStats();
    updateProgress();
  }

  function showHint() {
    if (!S.current || S.answered) return;
    S.hintLevel++;
    const m = S.current;
    let hintStr = '';
    if (S.target === 'port') {
      const tr = (m.transport && (m.transport[LANG] || m.transport.es)) || '';
      hintStr = S.hintLevel === 1
        ? (tr + ' · ' + String(m.port).slice(0, Math.min(5, String(m.port).length)) + '…')
        : String(m.port).replace(/[A-Za-z0-9]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·'));
    } else {
      const nm = m.name;
      hintStr = S.hintLevel === 1
        ? (nm.slice(0, Math.min(2, nm.length)) + '… · ' + m.rfc + ' (L' + m.osi + ')')
        : (m.fullName[LANG] || m.name).replace(/[A-Za-z0-9]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·'));
    }
    el.pMeta.innerHTML = esc(t('hintPrefix')) + ' <span class="letters">' + esc(hintStr) + '</span>';
  }

  function submitChoice(chosen, clickedBtn) {
    if (!S.current || S.answered || !chosen) return;
    const right = S.target === 'port'
      ? norm(chosen.port) === norm(S.current.port)
      : chosen.id === S.current.id;
    const ansLabel = S.target === 'port' ? chosen.port : chosen.name;
    finalizeAnswer(right, ansLabel, clickedBtn);
  }

  function submitTyping() {
    if (!S.current || S.answered) return;
    const inp = $('typeIn');
    const raw = inp ? inp.value : '';
    const res = checkAnswer(raw, S.current);
    if (res.status === 'empty') {
      if (inp && inp.focus) try { inp.focus(); } catch (_) {}
      return;
    }
    if (res.status === 'vague') {
      el.prompt.classList.remove('is-ok', 'is-bad');
      el.prompt.classList.add('is-warn');
      el.pEyebrow.textContent = t('warnEyebrow');
      el.pMeta.textContent = res.msg;
      if (inp && inp.focus) try { inp.focus(); } catch (_) {}
      return;
    }
    finalizeAnswer(res.status === 'right', raw.trim(), null);
  }

  function finalizeAnswer(right, userAns, clickedBtn) {
    const m = S.current;
    S.answered = true;
    S.totalAnswered++;
    tone(right);
    flashStage(right);

    if (right) {
      S.okCount++; S.streak++;
      if (S.streak > S.bestStreak) S.bestStreak = S.streak;
      S.known[m.id] = true;
      writeSaved('known', S.known);
    } else {
      S.streak = 0;
      S.misses.push({ item: m, userAns: userAns || '–' });
    }

    if (S.answer === 'choose') {
      el.actions.querySelectorAll('button.act[data-id]').forEach(b => {
        b.disabled = true;
        const opt = BY_ID[b.getAttribute('data-id')];
        const isTargetBtn = opt && (S.target === 'port' ? norm(opt.port) === norm(m.port) : opt.id === m.id);
        if (isTargetBtn) b.classList.add('is-right');
        else if (clickedBtn && b === clickedBtn && !right) b.classList.add('is-wrong');
      });
    }

    const answerFull = S.target === 'port' ? m.port : m.name;
    el.prompt.classList.remove('is-warn', 'is-ok', 'is-bad');
    el.prompt.classList.add(right ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = right ? t('okEyebrow') : t('badEyebrow', { name: answerFull });
    el.pName.textContent = m.name + ' · ' + m.portShort;
    el.pMeta.textContent = right
      ? ((m.fullName && (m.fullName[LANG] || m.fullName.es)) || m.rfc)
      : (userAns ? t('yourAnswer', { ans: userAns }) : m.rfc);

    if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
    if (S.mode === 'practice') updatePracticeQueue(m, right);

    renderRail();
    renderPanelMeta();
    updateStats();
    updateProgress();

    if (S.mode === 'test') {
      showNextButton();
      if (S.autoNextId) clearTimeout(S.autoNextId);
      S.autoNextId = setTimeout(nextQuestion, 850);
    } else {
      showNextButton();
    }
  }

  function showNextButton() {
    if ($('nextBtn')) return;
    if (S.answer === 'type') {
      el.actions.className = 'actions row';
      el.actions.innerHTML = '<button class="act primary" type="button" id="nextBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd></button>';
    } else {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.id = 'nextBtn'; btn.className = 'act primary'; btn.style.gridColumn = '1 / -1';
      btn.innerHTML = '<span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd>';
      el.actions.appendChild(btn);
    }
    const nb = $('nextBtn');
    if (nb) nb.addEventListener('click', nextQuestion);
  }

  function updatePracticeQueue(m, right) {
    const card = S.queue.find(c => c.item.id === m.id) || { item: m, step: 0 };
    S.queue = S.queue.filter(c => c.item.id !== m.id);
    if (right) {
      card.step++;
      if (card.step < 2) S.queue.splice(Math.min(S.queue.length, 4 + card.step * 2), 0, card);
      else S.queue.push(card);
    } else {
      card.step = 0;
      S.queue.splice(Math.min(S.queue.length, 2), 0, card);
    }
  }

  function nextQuestion() {
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
    if (S.mode === 'test') {
      S.deckIdx++;
      if (S.deckIdx >= S.deck.length) return finishTest();
      renderQuizQuestion(S.deck[S.deckIdx]);
    } else if (S.mode === 'practice') {
      if (!S.queue.length) S.queue = shuffle(pool()).map(item => ({ item, step: 0 }));
      const next = S.queue[0];
      if (!next) return studyGrid();
      renderQuizQuestion(next.item);
    }
  }

  function startTimer() {
    if (S.timerId) clearInterval(S.timerId);
    S.startTs = Date.now();
    S.elapsedSec = 0;
    S.timerId = setInterval(() => {
      S.elapsedSec = Math.floor((Date.now() - S.startTs) / 1000);
      el.sTime.textContent = fmtTime(S.elapsedSec);
    }, 1000);
  }

  function startPractice(customItems) {
    clearTimers();
    S.mode = 'practice';
    writeSaved('mode', 'practice');
    const items = customItems && customItems.length ? customItems : pool();
    S.queue = shuffle(items).map(item => ({ item, step: 0 }));
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer();
    syncControls();
    nextQuestion();
  }

  function startTest() {
    clearTimers();
    S.mode = 'test';
    writeSaved('mode', 'test');
    S.deck = shuffle(pool());
    S.deckIdx = -1;
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer();
    syncControls();
    nextQuestion();
  }

  function finishTest() {
    clearTimers();
    S.current = null; S.answered = false;
    el.gridBar.hidden = true;
    const total = S.deck.length || 1;
    const pct = Math.round((S.okCount / total) * 100);
    const scope = S.set + ':' + S.category + ':' + S.target;
    const prevBest = S.best[scope];
    if (!prevBest || pct > prevBest.pct || (pct === prevBest.pct && S.elapsedSec < prevBest.time)) {
      S.best[scope] = { pct, time: S.elapsedSec };
      writeSaved('best', S.best);
    }

    el.pBarWrap.classList.remove('is-off');
    el.pBar.style.width = '100%';
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn');
    el.prompt.classList.add('is-review');
    el.pEyebrow.textContent = t('eyebrowSummary');

    const missUnique = [], seen = new Set();
    S.misses.forEach(e => { if (!seen.has(e.item.id)) { seen.add(e.item.id); missUnique.push(e); } });

    el.reviewPanel.hidden = false;
    el.reviewPanel.innerHTML =
      '<div class="res-main">' +
        '<div class="res-score"><b>' + S.okCount + '</b><span>/' + total + '</span></div>' +
        '<div class="res-tiles">' +
          '<div><b>' + pct + '%</b><span>' + esc(t('resAcc')) + '</span></div>' +
          '<div><b>' + fmtTime(S.elapsedSec) + '</b><span>' + esc(t('resTime')) + '</span></div>' +
          '<div><b>' + S.bestStreak + '</b><span>' + esc(t('resStreak')) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="res-actions">' +
        '<button class="btn primary" type="button" id="resReplayBtn">' + esc(t('resPlayAgain')) + '</button>' +
        (missUnique.length
          ? '<button class="btn" type="button" id="resMissBtn">' + esc(t('resStudyMisses', { n: missUnique.length })) + '</button>'
          : '<button class="btn" type="button" id="resExploreBtn">' + esc(t('resExplore')) + '</button>') +
      '</div>' +
      '<div class="res-foot">' +
        '<span class="key ok"><i></i><b>' + esc(t('resKeyOk', { n: S.okCount })) + '</b></span>' +
        '<span class="key bad"><i></i><b>' + esc(t('resKeyBad', { n: total - S.okCount })) + '</b></span>' +
        '<span class="rhint">' + esc(missUnique.length ? t('resClickMiss') : t('resPerfect')) + '</span>' +
      '</div>';

    const rpb = $('resReplayBtn'), rmb = $('resMissBtn'), reb = $('resExploreBtn');
    if (rpb) rpb.addEventListener('click', startTest);
    if (rmb) rmb.addEventListener('click', () => startPractice(missUnique.map(x => x.item)));
    if (reb) reb.addEventListener('click', () => setMode('study'));

    const sum = document.createElement('div');
    sum.className = 'summary';
    if (missUnique.length) {
      sum.innerHTML = '<p class="note">' + esc(t('missTitle')) + '</p><div class="misses">' +
        missUnique.map(entry => {
          const m = entry.item;
          return '<button type="button" data-id="' + esc(m.id) + '">' +
            '<div class="thumb">' +
              '<span class="osi-pill">L' + esc(m.osi) + '</span>' +
              '<span class="acronym">' + esc(m.name) + '</span>' +
              '<span class="port-tag">' + esc(m.portShort) + '</span>' +
            '</div>' +
            '<div class="lbl"><b>' + esc(m.name) + '</b><small>' + esc(m.port) + ' · ' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div>' +
          '</button>';
        }).join('') +
      '</div>';
      sum.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          S.mode = 'study';
          writeSaved('mode', 'study');
          syncControls();
          studyOne(btn.getAttribute('data-id'));
        });
      });
    } else {
      sum.innerHTML = '<p class="note">' + esc(t('resPerfect')) + '</p>';
    }
    el.view.textContent = '';
    el.view.appendChild(sum);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '';
    renderPanelMeta();
    updateStats();
  }

  function setMode(m) {
    if (m !== 'study' && m !== 'practice' && m !== 'test') return;
    S.mode = m; writeSaved('mode', m); restart();
  }

  function setTarget(tgt) {
    if (tgt !== 'protocol' && tgt !== 'port') return;
    S.target = tgt;
    writeSaved('target', tgt);
    syncControls();
    if (S.mode !== 'study' && S.current && !S.answered) {
      renderQuizQuestion(S.current);
    }
  }

  function restart() {
    clearTimers();
    syncControls();
    if (S.mode === 'study') { S.current = null; S.elapsedSec = 0; studyGrid(); }
    else if (S.mode === 'practice') startPractice();
    else startTest();
  }

  function applyStaticLabels() {
    document.documentElement.lang = LANG;
    document.title = t('docTitle');
    el.homeLink.setAttribute('aria-label', t('homeLabel'));
    el.homeLink.title = '← ' + t('homeLabel');
    el.toolMark.innerHTML = t('markHtml');
    el.brandSub.textContent = t('brandSub');
    el.rail.setAttribute('aria-label', t('railLabel'));
    el.railTitle.textContent = t('railTitle');
    el.exploreSearch.placeholder = t('searchPlaceholder');
    el.exploreSearch.setAttribute('aria-label', t('searchAria'));
    el.exploreClear.setAttribute('aria-label', t('clearSearch'));
    el.settingsBtn.textContent = t('settings');
    el.cleanExit.textContent = t('cleanExit');
    el.lblAcc.textContent = t('lblAcc');
    el.lblTime.textContent = t('lblTime');
    el.lblStreak.textContent = t('lblStreak');
    el.closeSheet.textContent = t('done');
    const lblLangTag = el.lblLang.querySelector('label');
    if (lblLangTag) lblLangTag.textContent = t('lblLang');
    else el.lblLang.textContent = t('lblLang');
    el.langSel.value = LANG;
    el.lblMode.textContent = t('lblMode');
    const modeBtns = el.modeSeg.querySelectorAll('button');
    if (modeBtns[0]) modeBtns[0].textContent = t('modeStudy');
    if (modeBtns[1]) modeBtns[1].textContent = t('modePractice');
    if (modeBtns[2]) modeBtns[2].textContent = t('modeTest');
    el.lblSet.textContent = t('lblSet');
    const setBtns = el.setSeg.querySelectorAll('button');
    if (setBtns[0]) setBtns[0].textContent = t('setPopular');
    if (setBtns[1]) setBtns[1].textContent = t('setAll');
    el.lblTarget.textContent = t('lblTarget');
    const tgtBtns = el.targetSeg.querySelectorAll('button');
    if (tgtBtns[0]) tgtBtns[0].textContent = t('tgtProtocol');
    if (tgtBtns[1]) tgtBtns[1].textContent = t('tgtPort');
    el.lblAnswer.textContent = t('lblAnswer');
    const ansBtns = el.answerSeg.querySelectorAll('button');
    if (ansBtns[0]) ansBtns[0].textContent = t('ansChoose');
    if (ansBtns[1]) ansBtns[1].textContent = t('ansType');
    el.restartBtn.textContent = t('restart');
    el.cleanBtn.textContent = t('cleanBtn');
    el.soundBtn.textContent = S.sound ? t('soundYes') : t('soundNo');
    el.keysBtn.textContent = t('keysBtn');
    el.howBtn.textContent = t('howBtn');
    el.creditLine.textContent = t('creditLine');
    el.introTitle.textContent = t('introTitle');
    el.intro1.innerHTML = t('intro1');
    el.intro2.innerHTML = t('intro2');
    el.intro3.innerHTML = t('intro3');
    el.keysTitle.textContent = t('keysTitle');
    el.keysList.innerHTML = t('keys').map(p => '<li><kbd>' + esc(p[0]) + '</kbd> ' + esc(p[1]) + '</li>').join('');
  }

  function syncControls() {
    applyStaticLabels();
    el.modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.mode));
    el.setSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.set));
    el.targetSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.target));
    el.answerSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.answer));
    el.answerBox.classList.toggle('is-off', S.mode === 'study');
    el.soundBtn.setAttribute('aria-pressed', S.sound);
    renderRail();
    renderPanelMeta();
    updateStats();
    updateProgress();
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    LANG = next;
    writeSaved('lang', LANG);
    try { if (window.localStorage) window.localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    syncControls();
    if (S.mode === 'study') {
      if (S.studyAt) studyOne(S.studyAt);
      else studyGrid();
    } else if (S.current && !S.answered) {
      renderQuizQuestion(S.current);
    } else if (S.current && S.answered) {
      if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
      const nb = $('nextBtn');
      if (nb && nb.querySelector('.txt')) nb.querySelector('.txt').textContent = t('next');
    }
  }

  let helpBoxEl = null;
  function closeHelpBox() {
    if (helpBoxEl && helpBoxEl.parentNode) helpBoxEl.parentNode.removeChild(helpBoxEl);
    helpBoxEl = null;
    document.querySelectorAll('.help[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  function openHelp(btn) {
    const info = t('help')[btn.getAttribute('data-help')];
    if (!info) return;
    if (helpBoxEl && btn.getAttribute('aria-expanded') === 'true') { closeHelpBox(); return; }
    closeHelpBox();
    btn.setAttribute('aria-expanded', 'true');
    helpBoxEl = document.createElement('div');
    helpBoxEl.className = 'helpbox';
    helpBoxEl.innerHTML = '<b>' + esc(info[0]) + '</b><p>' + esc(info[1]) + '</p>';
    document.body.appendChild(helpBoxEl);
    if (btn.getBoundingClientRect) {
      const r = btn.getBoundingClientRect();
      helpBoxEl.style.top = Math.min(window.innerHeight - 130, Math.max(12, r.bottom + 8)) + 'px';
      helpBoxEl.style.left = Math.min(window.innerWidth - 320, Math.max(12, r.left - 20)) + 'px';
    }
  }

  el.langSel.addEventListener('change', () => setLang(el.langSel.value));
  el.modeSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setMode(b.dataset.v);
  });
  el.setSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!b) return;
    S.set = b.dataset.v; writeSaved('set', S.set); restart();
  });
  el.targetSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setTarget(b.dataset.v);
  });
  el.answerSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!b) return;
    S.answer = b.dataset.v; writeSaved('answer', S.answer);
    if (S.mode !== 'study' && S.current && !S.answered) { syncControls(); renderQuizQuestion(S.current); }
    else syncControls();
  });
  el.restartBtn.addEventListener('click', restart);
  el.cleanBtn.addEventListener('click', () => document.body.classList.add('clean'));
  el.cleanExit.addEventListener('click', () => document.body.classList.remove('clean'));
  el.settingsBtn.addEventListener('click', () => document.body.classList.add('sheet-open'));
  el.closeSheet.addEventListener('click', () => document.body.classList.remove('sheet-open'));
  el.soundBtn.addEventListener('click', () => { S.sound = !S.sound; writeSaved('sound', S.sound); syncControls(); });
  el.exploreSearch.addEventListener('input', () => {
    S.exploreQuery = el.exploreSearch.value || '';
    if (S.mode === 'study' && !S.studyAt) studyGrid();
  });
  el.exploreClear.addEventListener('click', () => {
    S.exploreQuery = ''; el.exploreSearch.value = '';
    if (S.mode === 'study' && !S.studyAt) studyGrid();
    if (el.exploreSearch.focus) try { el.exploreSearch.focus(); } catch (_) {}
  });
  el.howBtn.addEventListener('click', () => { el.intro.hidden = false; });
  el.introClose.addEventListener('click', () => { el.intro.hidden = true; });
  el.intro.addEventListener('click', ev => { if (ev.target === el.intro) el.intro.hidden = true; });
  el.keysBtn.addEventListener('click', () => { el.keysModal.hidden = false; });
  el.keysClose.addEventListener('click', () => { el.keysModal.hidden = true; });
  el.keysModal.addEventListener('click', ev => { if (ev.target === el.keysModal) el.keysModal.hidden = true; });

  document.addEventListener('click', ev => {
    const hBtn = ev.target && ev.target.closest ? ev.target.closest('.help[data-help]') : null;
    if (hBtn) { ev.stopPropagation(); openHelp(hBtn); return; }
    if (helpBoxEl && !helpBoxEl.contains(ev.target)) closeHelpBox();
  });

  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') {
      closeHelpBox();
      if (!el.intro.hidden) { el.intro.hidden = true; return; }
      if (!el.keysModal.hidden) { el.keysModal.hidden = true; return; }
      if (document.body.classList.contains('sheet-open')) { document.body.classList.remove('sheet-open'); return; }
      if (document.body.classList.contains('clean')) { document.body.classList.remove('clean'); return; }
      if (S.mode === 'study' && S.studyAt) { studyGrid(); return; }
    }
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA')) return;

    if (S.mode === 'study') {
      if (S.studyAt && ev.key === 'ArrowLeft') { ev.preventDefault(); stepStudy(-1); }
      else if (S.studyAt && ev.key === 'ArrowRight') { ev.preventDefault(); stepStudy(1); }
      else if (ev.key === 'p' || ev.key === 'P') { ev.preventDefault(); setMode('practice'); }
      return;
    }
    if (S.answered && (ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === ' ')) {
      ev.preventDefault(); nextQuestion(); return;
    }
    if (!S.answered && S.answer === 'choose' && ev.key >= '1' && ev.key <= '4') {
      const idx = Number(ev.key) - 1;
      const btn = el.actions.querySelector('button.act[data-idx="' + idx + '"]');
      if (S.opts[idx] && btn) submitChoice(S.opts[idx], btn);
    } else if (!S.answered && S.answer === 'type' && (ev.key === 'h' || ev.key === 'H')) {
      showHint();
    }
  });

  window.NP = {
    norm, checkAnswer, setLang, setMode, setTarget, restart,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
