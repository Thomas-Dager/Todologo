/* Entrenador de Cálculo Mental (T020) — Todologo
 * Siete técnicas progresivas de cálculo mental de izquierda a derecha, con guías detalladas, ejemplos y práctica.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const saved = window.SiteProgress
    ? SiteProgress.tool('mental-math')
    : { get: (k, d) => d, set: () => {} };

  // ---------------- Idioma (Nativo Español + Inglés sincronizado con Todologo) ----------------
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
      docTitle: 'Entrenador de Cálculo Mental — Todologo',
      brandMark: 'CÁLCULO <span>MENTAL</span><sup>T020</sup>',
      brandSub: 'Aritmética rápida de izquierda a derecha, qué es, para qué sirve y cómo se hace',
      railTitle: 'Técnicas, en orden',
      railPath: 'Recorre las técnicas en orden. Una marca ✓ significa que lograste 90% o más en el Examen.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Lee para qué sirve cada técnica, por qué funciona y cómo se hace paso a paso con ejemplos vivos.',
        practice: 'Resuelve a tu ritmo con pista opcional y explicación completa tras cada respuesta.',
        test: '12 operaciones contrarreloj sin pistas. Consigue 90% o más para marcar esta técnica como dominada.'
      },
      inputHeading: 'Respuesta',
      inputs: { choices: '4 opciones', keypad: 'Teclado' },
      inputHints: {
        choices: 'Elige entre 4 resultados o pulsa las teclas 1 a 4.',
        keypad: 'Escribe el resultado con tu teclado numérico y pulsa Enter.'
      },
      diffHeading: 'Dificultad',
      diffs: { normal: 'Normal', hard: 'Avanzado' },
      statAcc: 'Precisión',
      statTime: 'Tiempo',
      statStreak: 'Racha',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      cleanExit: 'Salir de vista limpia',
      settings: 'Ajustes',
      howItWorks: 'Cómo funciona',
      closeSheet: 'Listo',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> o números + <kbd>Enter</kbd> para responder · <kbd>Espacio</kbd> siguiente',
      credit: 'El secreto del cálculo mental es operar siempre de izquierda a derecha (de las cifras más grandes a las más pequeñas) para mantener un único subtotal vivo en la memoria. Parte de Todologo.',
      newExample: 'Otro ejemplo resuelto',
      goPractice: 'Practicar esta técnica →',
      nextBtn: 'Siguiente',
      hintBtn: 'Ver pista',
      checkBtn: 'Comprobar',
      tryAgain: 'Intentar otro',
      testDone: 'Examen completado',
      passedMsg: '¡Dominado! Lograste al menos 90% de precisión.',
      retryMsg: 'Necesitas 90% (11/12) para marcar este ejercicio. ¡Vuelve a intentarlo!',
      bestNone: 'Sin marca de examen todavía en este ejercicio.',
      bestFmt: (pct, s) => `Mejor examen: <b>${pct}%</b> en ${s}s`,
      stepLabel: (i) => `Paso ${i}`,
      finalStep: 'Resultado mental',
      correctExcl: '¡Correcto!',
      wrongExcl: (ans) => `Era ${ans}`,
      guideUses: '¿Para qué sirve en la vida real?',
      guideWhy: '¿Por qué funciona este truco?',
      guideHow: '¿Cómo se hace paso a paso?',
      guideTrap: 'Error frecuente que debes evitar',
      takeawayLabel: 'Idea clave:'
    },
    en: {
      docTitle: 'Mental Math Trainer — Todologo',
      brandMark: 'MENTAL <span>MATH</span><sup>T020</sup>',
      brandSub: 'Fast left-to-right arithmetic: why it works, real uses & how to do it',
      railTitle: 'Techniques, in order',
      railPath: 'Work down the list in order. A ✓ means you scored 90% or higher on the Test.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Read what each technique is useful for, why the math works, and trace live step-by-step examples.',
        practice: 'Solve at your own pace with an optional hint and full step breakdown after every answer.',
        test: '12 timed problems without hints. Score 90% or higher to earn a checkmark on this drill.'
      },
      inputHeading: 'Answer mode',
      inputs: { choices: '4 choices', keypad: 'Keypad' },
      inputHints: {
        choices: 'Pick from 4 options or press keys 1–4.',
        keypad: 'Type the exact number and press Enter.'
      },
      diffHeading: 'Difficulty',
      diffs: { normal: 'Normal', hard: 'Hard' },
      statAcc: 'Accuracy',
      statTime: 'Time',
      statStreak: 'Streak',
      restart: 'Restart',
      cleanView: 'Clean view',
      cleanExit: 'Exit clean view',
      settings: 'Settings',
      howItWorks: 'How it works',
      closeSheet: 'Done',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> or digits + <kbd>Enter</kbd> to answer · <kbd>Space</kbd> next',
      credit: 'The secret to mental math is always working left-to-right (largest place values first) so you only hold a single running total in working memory. Part of Todologo.',
      newExample: 'Another solved example',
      goPractice: 'Practice this technique →',
      nextBtn: 'Next',
      hintBtn: 'Show hint',
      checkBtn: 'Submit',
      tryAgain: 'Run again',
      testDone: 'Test complete',
      passedMsg: 'Mastered! You scored 90% or higher.',
      retryMsg: 'Score 90% (11/12) to earn a tick on this drill. Give it another run!',
      bestNone: 'No test score saved for this drill yet.',
      bestFmt: (pct, s) => `Best test: <b>${pct}%</b> in ${s}s`,
      stepLabel: (i) => `Step ${i}`,
      finalStep: 'Mental result',
      correctExcl: 'Correct!',
      wrongExcl: (ans) => `Answer: ${ans}`,
      guideUses: 'What is it used for in real life?',
      guideWhy: 'Why does the trick work?',
      guideHow: 'How to do it step by step',
      guideTrap: 'Common pitfall to avoid',
      takeawayLabel: 'Key takeaway:'
    }
  };

  const t = () => UI[LANG] || UI.es;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ---------------- Las 7 técnicas de Cálculo Mental ----------------
  const DRILLS = [
    {
      id: 'add-ltr',
      title: { es: 'Sumas izq. a der.', en: 'Left-to-right addition' },
      sub: {
        es: 'Suma primero las cifras más grandes (centenas y decenas) y actualiza un único subtotal.',
        en: 'Add the largest place values first and keep only one running total in memory.'
      },
      ruleHtml: {
        es: '<b>Nunca sumes de derecha a izquierda en la cabeza.</b> En papel empezamos por las unidades para anotar las llevadas; en la mente eso obliga a recordar el resultado al revés. Si descompones el segundo número y sumas de mayor a menor (<code>468 + 357 → 468 + 300 + 50 + 7</code>), tu cabeza solo retiene un número vivo cada segundo: <code>468 → 768 → 818 → 825</code>.',
        en: '<b>Never add right-to-left in your head.</b> Paper math starts with units to track carries, forcing your brain to assemble the answer backwards. Split the second number left-to-right (<code>468 + 357 → 468 + 300 + 50 + 7</code>) so you only track one running total: <code>468 → 768 → 818 → 825</code>.'
      },
      usesHtml: {
        es: '<ul><li><b>Compras y supermercado:</b> ir sumando productos del carrito al vuelo para saber el gasto aproximado desde el primer segundo.</li><li><b>Facturas, presupuestos y horarios:</b> sumar importes o minutos sin sacar el teléfono ni perder el orden de magnitud.</li><li><b>Detectar errores:</b> al calcular primero centenas ya sabes al instante en qué rango cae el total real.</li></ul>',
        en: '<ul><li><b>Grocery shopping & bills:</b> keep a running total in your cart with instant ballpark accuracy.</li><li><b>Budgets & time tracking:</b> total line items or durations without grabbing your phone.</li><li><b>Sanity checking:</b> adding hundreds first gives the magnitude right away so typos jump out.</li></ul>'
      },
      whyHtml: {
        es: 'Por la <b>propiedad asociativa</b>, <code>a + (c + d + u) = ((a + c) + d) + u</code>. Sumar un múltiplo exacto de <code>100</code> o <code>10</code> solo cambia una única cifra del número actual, evitando saturar la memoria de trabajo con varios dígitos pendientes de llevar.',
        en: 'By the <b>associative property</b>, <code>a + (h + t + u) = ((a + h) + t) + u</code>. Adding exact multiples of <code>100</code> or <code>10</code> alters just one digit at a time, freeing working memory from juggling multiple carries.'
      },
      howHtml: {
        es: '1) Elige el número más grande como base inicial. 2) Separa el segundo número en bloques redondos (centenas, decenas, unidades). 3) Ve «diciéndote» mentalmente el subtotal actualizado tras cada salto en lugar de repetir toda la suma.',
        en: '1) Start from the larger number as your anchor. 2) Break the second number into hundreds, tens, and units. 3) Re-state only the new running total after each jump instead of repeating the original numbers.'
      },
      trapHtml: {
        es: 'Intentar retener los dígitos originales mientras sumas. En cuanto calcules <code>468 + 300 = 768</code>, <b>suelta por completo el 468 y el 300</b>: a partir de ese instante solo existe <code>768 + 57</code>.',
        en: 'Holding onto old numbers after adding them. Once you compute <code>468 + 300 = 768</code>, <b>drop 468 and 300 completely</b>; your brain only cares about <code>768 + 57</code>.'
      },
      table: {
        headers: { es: ['Operación', 'Descomposición', 'Flujo mental'], en: ['Problem', 'Split', 'Mental flow'] },
        rows: [
          ['57 + 38', '57 + 30 + 8', '57 → 87 → 95'],
          ['348 + 275', '348 + 200 + 70 + 5', '348 → 548 → 618 → 623'],
          ['684 + 459', '684 + 400 + 50 + 9', '684 → 1084 → 1134 → 1143']
        ]
      },
      gen(hard) {
        if (!hard) {
          const a = rand(34, 98), b = rand(26, 89);
          const b10 = Math.floor(b / 10) * 10, b1 = b % 10;
          const s1 = a + b10, ans = s1 + b1;
          return {
            expr: `${a} + ${b}`,
            ans,
            hint: LANG === 'es' ? `Parte ${b} en ${b10} + ${b1}. Haz primero ${a} + ${b10}.` : `Split ${b} into ${b10} + ${b1}. Start with ${a} + ${b10}.`,
            takeaway: LANG === 'es' ? `Al sumar primero las ${b10} decenas obtienes ${s1} al instante y solo queda ajustar +${b1}.` : `Adding the ${b10} tens first lands on ${s1} cleanly, leaving just +${b1}.`,
            steps: [
              { math: `${a} + ${b10} = ${s1}`, desc: LANG === 'es' ? `Suma primero las decenas (${b10}) sin tocar unidades` : `Add the tens (${b10}) first without altering units` },
              { math: `${s1} + ${b1} = ${ans}`, desc: LANG === 'es' ? `Añade las ${b1} unidades finales al subtotal ${s1}` : `Add the final ${b1} units to ${s1}`, final: true }
            ]
          };
        } else {
          const a = rand(145, 689), b = rand(135, 589);
          const b100 = Math.floor(b / 100) * 100;
          const b10 = Math.floor((b % 100) / 10) * 10;
          const b1 = b % 10;
          const s1 = a + b100, s2 = s1 + b10, ans = s2 + b1;
          return {
            expr: `${a} + ${b}`,
            ans,
            hint: LANG === 'es' ? `Empieza por ${a} + ${b100} y luego suma ${b10 + b1}.` : `Start with ${a} + ${b100}, then add ${b10 + b1}.`,
            takeaway: LANG === 'es' ? `Tres micro-pasos (${a} → ${s1} → ${s2} → ${ans}) mantienen un único número en memoria.` : `Three simple hops (${a} → ${s1} → ${s2} → ${ans}) hold only one number in memory.`,
            steps: [
              { math: `${a} + ${b100} = ${s1}`, desc: LANG === 'es' ? 'Suma primero solo las centenas' : 'Add the hundreds first' },
              { math: `${s1} + ${b10} = ${s2}`, desc: LANG === 'es' ? `Suma las ${b10} decenas al nuevo subtotal` : `Add ${b10} tens to the running total` },
              { math: `${s2} + ${b1} = ${ans}`, desc: LANG === 'es' ? 'Cierra sumando las unidades sueltas' : 'Finish with the final units', final: true }
            ]
          };
        }
      }
    },
    {
      id: 'sub-comp',
      title: { es: 'Restas por complemento', en: 'Complement subtraction' },
      sub: {
        es: 'Transforma una resta incómoda en una resta redonda más una pequeña suma.',
        en: 'Turn an awkward subtraction into a round subtraction plus a tiny addition.'
      },
      ruleHtml: {
        es: '<b>Restar cifras acabadas en 7, 8 o 9 obliga a «pedir prestado» y provoca errores.</b> En lugar de hacer <code>532 − 188</code> directamente, pásate un poco restando <code>200</code> (<code>532 − 200 = 332</code>) y devuelve los <code>12</code> que restaste de más: <code>332 + 12 = 344</code>. Para restar desde <code>1000</code>, aplica <b>«todos a 9 y el último a 10»</b>.',
        en: '<b>Subtracting numbers ending in 7, 8, or 9 causes borrowing mistakes.</b> Instead of computing <code>532 − 188</code> directly, overshoot by subtracting <code>200</code> (<code>332</code>) and add back the <code>12</code> extra you removed → <code>344</code>.'
      },
      usesHtml: {
        es: '<ul><li><b>Calcular vuelto en efectivo:</b> si pagas con un billete de 1000 algo que cuesta 638, el complemento 9-9-10 da <code>362</code> en medio segundo.</li><li><b>Descuentos y márgenes:</b> calcular diferencias entre precios (ej. de <code>450</code> a <code>289</code>) sin dudar en las llevadas.</li><li><b>Tiempos y fechas:</b> diferencia de minutos hasta la hora exacta o años entre dos fechas.</li></ul>',
        en: '<ul><li><b>Making change quickly:</b> paying 1000 for 638 yields <code>362</code> instantly via 9-9-10 complements.</li><li><b>Comparing prices & gaps:</b> find margins or balances without tedious borrowing.</li><li><b>Elapsed time & years:</b> jump to the nearest round hour or century and adjust back.</li></ul>'
      },
      whyHtml: {
        es: 'Porque sumar y restar el mismo ajuste no cambia la distancia entre dos números: si <code>b = R − c</code>, entonces <code>a − b = a − (R − c) = (a − R) + c</code>. Como <code>R</code> termina en ceros, restarlo es trivial y luego solo haces una suma pequeña.',
        en: 'Shifting by an exact amount preserves the result: if <code>b = R − c</code>, then <code>a − b = a − (R − c) = (a − R) + c</code>. Subtracting round <code>R</code> is instant, turning a messy borrow into a tiny addition.'
      },
      howHtml: {
        es: '1) Mira cuánto le falta al número que resta para llegar a la siguiente decena o centena redonda (ese es su complemento <code>c</code>). 2) Resta el número redondo de la base. 3) <b>Suma</b> el complemento <code>c</code> al resultado.',
        en: '1) Find how much the subtracted number lacks to hit the next multiple of 10 or 100 (the complement <code>c</code>). 2) Subtract that round number. 3) <b>Add back</b> the complement <code>c</code>.'
      },
      trapHtml: {
        es: 'Restar el complemento al final en vez de sumarlo. Recuerda esta imagen mental: <i>si le quitaste dinero de más en el paso 2, tienes que devolvérselo sumándolo en el paso 3</i>.',
        en: 'Subtracting the overshoot at the end instead of adding it back. Think of money: <i>if you took too much away in step 2, you must give the change back by adding in step 3</i>.'
      },
      table: {
        headers: { es: ['Operación', 'Redondeo', 'Cálculo rápido'], en: ['Problem', 'Rounding', 'Fast calculation'] },
        rows: [
          ['1000 − 638', 'Todos de 9, último de 10', '(9−6)(9−3)(10−8) = 362'],
          ['143 − 68', 'Resta 70 y devuelve 2', '143 − 70 = 73 → + 2 = 75'],
          ['624 − 289', 'Resta 300 y devuelve 11', '624 − 300 = 324 → + 11 = 335']
        ]
      },
      gen(hard) {
        if (!hard) {
          const bTens = rand(3, 8) * 10;
          const comp = rand(1, 4);
          const b = bTens - comp;
          const a = b + rand(28, 125);
          const s1 = a - bTens, ans = s1 + comp;
          return {
            expr: `${a} − ${b}`,
            ans,
            hint: LANG === 'es' ? `En vez de restar ${b}, resta ${bTens} y luego devuelve ${comp}.` : `Instead of subtracting ${b}, subtract ${bTens} and add back ${comp}.`,
            takeaway: LANG === 'es' ? `Restar ${bTens} dejó ${s1}; al devolver el exceso (+${comp}) llegas sin llevar nada a ${ans}.` : `Subtracting ${bTens} gave ${s1}; returning the ${comp} overshoot lands cleanly on ${ans}.`,
            steps: [
              { math: `${b} = ${bTens} − ${comp}`, desc: LANG === 'es' ? `Redondea ${b} a ${bTens} (sobran ${comp})` : `Round ${b} up to ${bTens} (overshoot by ${comp})` },
              { math: `${a} − ${bTens} = ${s1}`, desc: LANG === 'es' ? 'Resta el múltiplo de 10 sin pedir prestado' : 'Subtract the clean multiple of 10' },
              { math: `${s1} + ${comp} = ${ans}`, desc: LANG === 'es' ? `Devuelve los ${comp} que restaste de más` : `Add back the ${comp} overshoot`, final: true }
            ]
          };
        } else {
          const bHund = rand(2, 6) * 100;
          const comp = rand(4, 24);
          const b = bHund - comp;
          const a = b + rand(140, 480);
          const s1 = a - bHund, ans = s1 + comp;
          return {
            expr: `${a} − ${b}`,
            ans,
            hint: LANG === 'es' ? `Redondea ${b} a ${bHund}: resta ${bHund} y suma la diferencia (${comp}).` : `Round ${b} to ${bHund}: subtract ${bHund} and add back ${comp}.`,
            takeaway: LANG === 'es' ? `${b} está a solo ${comp} de ${bHund}, lo que convierte una resta difícil en ${s1} + ${comp}.` : `${b} is just ${comp} shy of ${bHund}, turning a tough subtraction into ${s1} + ${comp}.`,
            steps: [
              { math: `${b} = ${bHund} − ${comp}`, desc: LANG === 'es' ? `Calcula el complemento de ${b} hasta ${bHund}` : `Find how far ${b} is below ${bHund}` },
              { math: `${a} − ${bHund} = ${s1}`, desc: LANG === 'es' ? 'Resta las centenas redondas al instante' : 'Subtract round hundreds immediately' },
              { math: `${s1} + ${comp} = ${ans}`, desc: LANG === 'es' ? `Suma el complemento (+${comp}) para compensar` : `Add back the complement (+${comp})`, final: true }
            ]
          };
        }
      }
    },
    {
      id: 'mult-tricks',
      title: { es: 'Multiplicar ×11, ×5, ×25, ×99', en: 'Multiply ×11, ×5, ×25, ×99' },
      sub: {
        es: 'Sustituye multiplicaciones pesadas por mitades, cuartos, sumas o desplazamientos de coma.',
        en: 'Replace heavy multiplications with simple halves, quarters, sums, or decimal shifts.'
      },
      ruleHtml: {
        es: '<b>Cuatro atajos clásicos de uso diario:</b><br>• <code>AB × 11</code>: abre <code>A</code> y <code>B</code> y mete <code>A + B</code> en el centro (si suma ≥ 10, lleva 1 a la izquierda).<br>• <code>N × 5</code>: mitad de <code>N</code> × 10 (equivale a <code>N × 10 ÷ 2</code>).<br>• <code>N × 25</code>: cuarta parte de <code>N</code> × 100 (cada resto suma <code>25</code>).<br>• <code>N × 99</code>: <code>N × 100 − N</code>.',
        en: '<b>Four everyday shortcuts:</b><br>• <code>AB × 11</code>: split <code>A</code> and <code>B</code> and place <code>A + B</code> between them (carry 1 if ≥ 10).<br>• <code>N × 5</code>: half of <code>N</code> × 10.<br>• <code>N × 25</code>: quarter of <code>N</code> × 100 (each remainder adds <code>25</code>).<br>• <code>N × 99</code>: <code>N × 100 − N</code>.'
      },
      usesHtml: {
        es: '<ul><li><b>Precios psicológicos (.99) y docenas:</b> calcular 18 artículos a 99 o 11 unidades de un producto sin calculadora.</li><li><b>Conversión de tiempo y dinero:</b> cuartos de hora, monedas de 25 centavos, múltiplos de 5 minutos o billetes de 5.</li><li><b>Desgloses decimales rápidos:</b> <code>× 5</code> y <code>× 25</code> se reutilizan constantemente en porcentajes y fracciones (<code>0.25</code>).</li></ul>',
        en: '<ul><li><b>Retail prices & batches:</b> compute totals for 99-cent/99-dollar prices or 11-unit packs fast.</li><li><b>Quarters & 5-unit scales:</b> tally 25-cent coins, quarter hours, or 5-point increments on sight.</li><li><b>Building block for fractions:</b> multiplying by 5 and 25 powers quick decimal conversions too.</li></ul>'
      },
      whyHtml: {
        es: 'Todos reescriben el multiplicador con potencias de 10: <code>× 11 = ×(10 + 1)</code> (por eso se suma el dígito desplazado con el original en el centro), <code>× 5 = × 10 ÷ 2</code>, <code>× 25 = × 100 ÷ 4</code> y <code>× 99 = ×(100 − 1)</code>.',
        en: 'Each rewrites the multiplier using powers of 10: <code>×11 = ×(10 + 1)</code> (adding shifted digits places their sum in the middle), <code>×5 = ×10 ÷ 2</code>, <code>×25 = ×100 ÷ 4</code>, and <code>×99 = ×(100 − 1)</code>.'
      },
      howHtml: {
        es: 'Para <code>N × 25</code> divide <code>N</code> dos veces por la mitad (<code>÷ 2 ÷ 2</code>) y multiplica por 100. Para <code>AB × 11</code> suma <code>A + B</code>; si supera 9, deja la cifra de las unidades en medio y suma 1 al primer dígito <code>A</code>.',
        en: 'For <code>N × 25</code> halve <code>N</code> twice (<code>÷ 2 ÷ 2</code>) and tack on two zeros (or +25/+50/+75 for remainders 1/2/3). For <code>AB × 11</code> insert <code>A + B</code>, carrying 1 left whenever the middle sum exceeds 9.'
      },
      trapHtml: {
        es: 'En <code>78 × 11</code> escribir <code>7158</code> en vez de llevar <code>1</code> al <code>7</code> → <code>858</code>. Y en <code>N × 25</code> olvidar que si <code>N</code> es impar o sobra resto al dividir entre 4, cada unidad de resto vale <b>+25</b>.',
        en: 'In <code>78 × 11</code>, writing <code>7158</code> instead of carrying <code>1</code> into <code>7</code> → <code>858</code>. In <code>N × 25</code>, forgetting that remainders of 1, 2, or 3 mod 4 add 25, 50, or 75.'
      },
      table: {
        headers: { es: ['Regla', 'Ejemplo', 'Atajo mental'], en: ['Rule', 'Example', 'Mental shortcut'] },
        rows: [
          ['× 11', '63 × 11', '6 | (6+3) | 3 → 693'],
          ['× 11 (con llevada)', '78 × 11', '7 | 15 | 8 → (7+1) | 5 | 8 = 858'],
          ['× 25', '84 × 25', '84 ÷ 4 = 21 → × 100 = 2100'],
          ['× 99', '36 × 99', '3600 − 36 = 3564']
        ]
      },
      gen(hard) {
        const kind = pick(hard ? ['11', '25', '99', '5'] : ['11', '25', '5']);
        if (kind === '11') {
          const n = rand(hard ? 45 : 12, hard ? 96 : 85);
          const d1 = Math.floor(n / 10), d2 = n % 10, mid = d1 + d2, ans = n * 11;
          return {
            expr: `${n} × 11`,
            ans,
            hint: LANG === 'es' ? `Separa ${d1} y ${d2}, y mete ${d1} + ${d2} en el medio.` : `Split ${d1} and ${d2}, putting ${d1} + ${d2} in the middle.`,
            takeaway: LANG === 'es' ? `Multiplicar por 11 equivale a ${n * 10} + ${n}: sumar el vecino de al lado da el dígito central.` : `Multiplying by 11 is ${n * 10} + ${n}: adding adjacent digits yields the center figure.`,
            steps: [
              { math: `${d1} + ${d2} = ${mid}`, desc: LANG === 'es' ? 'Suma los dos dígitos para obtener la cifra central' : 'Add the two digits for the center figure' },
              {
                math: mid >= 10 ? `${d1}+1 | ${mid % 10} | ${d2} = ${ans}` : `${d1} | ${mid} | ${d2} = ${ans}`,
                desc: mid >= 10
                  ? (LANG === 'es' ? `Como ${mid} ≥ 10, deja ${mid % 10} en medio y suma 1 al ${d1}` : `Since ${mid} ≥ 10, keep ${mid % 10} in the middle and carry 1 to ${d1}`)
                  : (LANG === 'es' ? 'Coloca esa suma justo entre los dígitos originales' : 'Insert the sum between the original digits'),
                final: true
              }
            ]
          };
        } else if (kind === '25') {
          const q = rand(hard ? 12 : 4, hard ? 48 : 28);
          const rem = hard ? rand(0, 3) : 0;
          const n = q * 4 + rem;
          const ans = n * 25;
          return {
            expr: `${n} × 25`,
            ans,
            hint: LANG === 'es' ? `Divide ${n} entre 4 (mitad de la mitad) y añade dos ceros.` : `Divide ${n} by 4 (half twice) and multiply by 100.`,
            takeaway: LANG === 'es' ? `Como 25 = 100 ÷ 4, basta sacar un cuarto de ${n} y escalar a centenas.` : `Because 25 = 100 ÷ 4, taking a quarter of ${n} converts multiplication into division by 4.`,
            steps: [
              { math: `${n} ÷ 4 = ${q}${rem ? ` (resto ${rem})` : ''}`, desc: LANG === 'es' ? 'Divide entre 4 sacando mitad dos veces' : 'Divide by 4 by halving twice' },
              { math: `${q * 100}${rem ? ` + ${rem * 25}` : ''} = ${ans}`, desc: LANG === 'es' ? 'Multiplica el cociente por 100' + (rem ? ` y suma ${rem}×25` : '') : 'Multiply quotient by 100' + (rem ? ` and add ${rem}×25` : ''), final: true }
            ]
          };
        } else if (kind === '99') {
          const n = rand(18, 88);
          const ans = n * 99;
          return {
            expr: `${n} × 99`,
            ans,
            hint: LANG === 'es' ? `Piensa en ${n} × 100 menos una vez ${n}.` : `Compute ${n} × 100 minus one ${n}.`,
            takeaway: LANG === 'es' ? `99 es simplemente 100 − 1: primero añade dos ceros (${n * 100}) y resta ${n}.` : `99 is just 100 − 1: append two zeros (${n * 100}) and subtract ${n}.`,
            steps: [
              { math: `${n} × 100 = ${n * 100}`, desc: LANG === 'es' ? 'Multiplica por 100 añadiendo dos ceros' : 'Multiply by 100 first' },
              { math: `${n * 100} − ${n} = ${ans}`, desc: LANG === 'es' ? `Resta ${n} usando el complemento a 100 (${100 - n})` : `Subtract ${n} via its 100-complement (${100 - n})`, final: true }
            ]
          };
        } else {
          const n = rand(hard ? 46 : 16, hard ? 168 : 96);
          const ans = n * 5;
          return {
            expr: `${n} × 5`,
            ans,
            hint: LANG === 'es' ? `Saca la mitad de ${n} y multiplica por 10.` : `Take half of ${n} and multiply by 10.`,
            takeaway: LANG === 'es' ? `Multiplicar por 5 es sacar la mitad de ${n} (${n / 2}) y desplazar la coma.` : `Multiplying by 5 is taking half of ${n} (${n / 2}) and shifting one decimal place.`,
            steps: [
              { math: `${n} ÷ 2 = ${n / 2}`, desc: LANG === 'es' ? 'Calcula la mitad exacta del número' : 'Take half of the number' },
              { math: `${n / 2} × 10 = ${ans}`, desc: LANG === 'es' ? 'Multiplica por 10 (desplaza un lugar)' : 'Multiply by 10 (shift one digit)', final: true }
            ]
          };
        }
      }
    },
    {
      id: 'squares',
      title: { es: 'Cuadrados relámpago', en: 'Lightning squares' },
      sub: {
        es: 'Calcula cuadrados de dos cifras sin multiplicar dígito a dígito.',
        en: 'Compute two-digit squares instantly without long multiplication.'
      },
      ruleHtml: {
        es: '<b>Dos identidades infalibles:</b><br>• <b>Terminados en 5 (<code>N5²</code>):</b> multiplica la decena <code>N</code> por <code>N + 1</code> y escribe <code>25</code> al final (<code>75² → 7×8 = 56 → 5625</code>).<br>• <b>Cualquier cuadrado (<code>A²</code>):</b> usa <code>A² = (A − d)(A + d) + d²</code> eligiendo <code>d</code> para llegar a un múltiplo redondo de 10 o 100 (<code>96² → 92 × 100 + 4² = 9216</code>).',
        en: '<b>Two infallible identities:</b><br>• <b>Ending in 5 (<code>N5²</code>):</b> multiply the leading digit(s) <code>N</code> by <code>N + 1</code> and append <code>25</code> (<code>75² → 7×8 = 56 → 5625</code>).<br>• <b>Any square (<code>A²</code>):</b> use <code>A² = (A − d)(A + d) + d²</code> where <code>d</code> reaches a multiple of 10 or 100 (<code>96² → 92 × 100 + 4² = 9216</code>).'
      },
      usesHtml: {
        es: '<ul><li><b>Áreas, superficies y geometría:</b> calcular metros cuadrados de terrenos o habitaciones cuadradas al momento.</li><li><b>Multiplicar números cercanos entre sí:</b> si sabes los cuadrados, <code>A × B</code> cercano se halla en segundos por diferencia de cuadrados.</li><li><b>Referencia para raíces cuadradas:</b> dominar cuadrados clave (sobre todo <code>15², 25², 35²...</code>) te permite estimar cualquier raíz al vuelo.</li></ul>',
        en: '<ul><li><b>Areas & floor plans:</b> compute square footage or plot areas immediately.</li><li><b>Anchor for near-squares:</b> knowing squares lets you multiply nearby pairs via difference of squares.</li><li><b>Backbone for square roots:</b> knowing <code>15², 25², 35²...</code> lets you locate any square root in seconds.</li></ul>'
      },
      whyHtml: {
        es: 'Para <code>(10N + 5)²</code> el álgebra da <code>100N² + 100N + 25 = 100·N(N+1) + 25</code>: por eso las centenas siempre valen <code>N(N+1)</code> y acaba siempre en <code>25</code>. Y para cualquier número, <code>(A−d)(A+d) = A² − d²</code>, así que sumando <code>d²</code> recuperas exactamente <code>A²</code>.',
        en: 'Expanding <code>(10N + 5)²</code> yields <code>100·N(N+1) + 25</code>, guaranteeing it starts with <code>N(N+1)</code> and ends in <code>25</code>. More generally, <code>(A−d)(A+d) = A² − d²</code>, so adding back <code>d²</code> recovers <code>A²</code>.'
      },
      howHtml: {
        es: '1) Si termina en 5, separa el número anterior al 5, multiplícalo por su consecutivo y pega <code>25</code>. 2) Si está cerca de <code>50</code> (<code>50 ± d</code>), calcula <code>(25 ± d) × 100 + d²</code>. 3) Si está cerca de <code>100</code> (<code>100 − d</code>), haz <code>(A − d) × 100 + d²</code>.',
        en: '1) If ending in 5, multiply the prefix <code>N</code> by <code>N+1</code> and stick <code>25</code> on the end. 2) Near <code>50</code> (<code>50 ± d</code>), compute <code>(25 ± d)×100 + d²</code>. 3) Near <code>100</code> (<code>100 − d</code>), compute <code>(A − d)×100 + d²</code>.'
      },
      trapHtml: {
        es: 'Cuando sumes <code>d²</code> de una sola cifra (como <code>2² = 4</code> en <code>98²</code> o <code>52²</code>), recuerda rellenar con cero a dos posiciones (<code>04</code>): <code>9604</code> y <code>2704</code>, ¡no 964 ni 274!',
        en: 'When <code>d²</code> is single-digit (like <code>2² = 4</code> in <code>98²</code> or <code>52²</code>), pad it to two digits (<code>04</code>): <code>9604</code> and <code>2704</code>, not 964!'
      },
      table: {
        headers: { es: ['Cuadrado', 'Fórmula mental', 'Resultado'], en: ['Square', 'Mental formula', 'Result'] },
        rows: [
          ['35²', '3 × 4 = 12 | 25', '1225'],
          ['85²', '8 × 9 = 72 | 25', '7225'],
          ['54²', '(25 + 4) × 100 + 4²', '2916'],
          ['97²', '(97 − 3) × 100 + 3²', '9409']
        ]
      },
      gen(hard) {
        const mode = (!hard && Math.random() < 0.65) ? 'end5' : pick(['end5', 'near100', 'near50']);
        if (mode === 'end5') {
          const tens = rand(2, hard ? 12 : 9);
          const n = tens * 10 + 5;
          const head = tens * (tens + 1);
          const ans = n * n;
          return {
            expr: `${n}²`,
            ans,
            hint: LANG === 'es' ? `Multiplica ${tens} × ${tens + 1} y añade 25 al final.` : `Multiply ${tens} × ${tens + 1} and append 25.`,
            takeaway: LANG === 'es' ? `Todo cuadrado acabado en 5 empieza por N×(N+1) (${tens}×${tens + 1}=${head}) y termina en 25.` : `Every square ending in 5 starts with N×(N+1) (${head}) and ends in 25.`,
            steps: [
              { math: `${tens} × ${tens + 1} = ${head}`, desc: LANG === 'es' ? `Multiplica la parte inicial (${tens}) por su siguiente (${tens + 1})` : `Multiply leading ${tens} by next integer (${tens + 1})` },
              { math: `${head} | 25 → ${ans}`, desc: LANG === 'es' ? 'Pega el bloque 25 a la derecha' : 'Append 25 to the right', final: true }
            ]
          };
        } else if (mode === 'near100') {
          const d = rand(1, 9);
          const n = 100 - d;
          const left = n - d;
          const ans = n * n;
          return {
            expr: `${n}²`,
            ans,
            hint: LANG === 'es' ? `Está a ${d} de 100: resta ${d} a ${n}, añade dos ceros y suma ${d}².` : `It is ${d} away from 100: take (${n} − ${d})×100 + ${d}².`,
            takeaway: LANG === 'es' ? `Mover uno a 100 y el otro ${d} hacia abajo convierte ${n}² en un producto redondo más ${d}².` : `Shifting to 100 × ${left} turns ${n}² into round hundreds plus ${d}².`,
            steps: [
              { math: `100 − ${n} = ${d}`, desc: LANG === 'es' ? `Mide cuánto falta para llegar a 100` : `Measure distance to 100` },
              { math: `(${n} − ${d}) × 100 = ${left * 100}`, desc: LANG === 'es' ? `Resta la distancia (${left}) y escala por 100` : `Subtract distance (${left}) × 100` },
              { math: `${left * 100} + ${d}² = ${ans}`, desc: LANG === 'es' ? `Suma el cuadrado de esa distancia (+${d * d})` : `Add the distance squared (+${d * d})`, final: true }
            ]
          };
        } else {
          const d = rand(1, 8) * (Math.random() < 0.5 ? 1 : -1);
          const n = 50 + d;
          const hundreds = 25 + d;
          const sq = d * d;
          const ans = n * n;
          return {
            expr: `${n}²`,
            ans,
            hint: LANG === 'es' ? `Usa base 25: ajusta ${d >= 0 ? '+' + d : d} desde 50 y añade ${Math.abs(d)}².` : `Use base 25: adjust by ${d} from 50 and add ${Math.abs(d)}².`,
            takeaway: LANG === 'es' ? `(50 + d)² = 100(25 + d) + d²: por eso siempre partes desde la base fija 25.` : `(50 + d)² = 100(25 + d) + d², which is why 25 acts as your fixed anchor.`,
            steps: [
              { math: `25 ${d >= 0 ? '+ ' + d : '− ' + Math.abs(d)} = ${hundreds}`, desc: LANG === 'es' ? 'Ajusta la base 25 según la distancia a 50' : 'Shift base 25 by the distance from 50' },
              { math: `${hundreds * 100} + ${Math.abs(d)}² = ${ans}`, desc: LANG === 'es' ? `Añade ${sq} (a dos cifras) al bloque de centenas` : `Append ${sq} to the hundreds block`, final: true }
            ]
          };
        }
      }
    },
    {
      id: 'mult-2d',
      title: { es: 'Multiplicación 2×1 y 2×2', en: '2×1 and 2×2 multiplication' },
      sub: {
        es: 'Propiedad distributiva de izquierda a derecha y diferencia de cuadrados simétrica.',
        en: 'Left-to-right distributive split and symmetric difference of squares.'
      },
      ruleHtml: {
        es: 'Para multiplicar <code>47 × 6</code>, ataca primero la cifra grande: <code>40 × 6 = 240</code> y súmale <code>7 × 6 = 42 → 282</code>.<br>Y cuando dos factores están a la misma distancia de una decena (como <code>37 × 43</code> alrededor de <code>40</code>), usa <b>diferencia de cuadrados</b>: <code>40² − 3² = 1600 − 9 = 1591</code>.',
        en: 'To multiply <code>47 × 6</code>, multiply tens first (<code>40 × 6 = 240</code>), then add units (<code>7 × 6 = 42</code>) → <code>282</code>.<br>When two factors sit equidistant from a round base (<code>37 × 43</code> around <code>40</code>), apply <b>difference of squares</b>: <code>40² − 3² = 1591</code>.'
      },
      usesHtml: {
        es: '<ul><li><b>Costes por volumen y salario:</b> calcular cuánto cuesta comprar <code>6</code> licencias de <code>48 €</code> o <code>24 × 18</code> horas de trabajo.</li><li><b>Conversión aproximada o exacta de divisas/unidades:</b> pasar precios o distancias sin calculadora.</li><li><b>Comprobar presupuestos en reuniones:</b> obtener al instante la parte principal (decenas × factor) antes de ajustar el pico.</li></ul>',
        en: '<ul><li><b>Unit cost × quantity:</b> compute 6 items at 48 or 24 × 18 billable hours on the spot.</li><li><b>Unit & currency conversions:</b> scale rates mentally with immediate first-digit precision.</li><li><b>Meeting sanity checks:</b> nail the leading magnitude immediately before refining the remainder.</li></ul>'
      },
      whyHtml: {
        es: 'La multiplicación es <b>distributiva</b> respecto a la suma: <code>(40 + 7) × 6 = 40×6 + 7×6</code>. Y para números simétricos, el área del rectángulo <code>(M − d)(M + d)</code> es idéntica al cuadrado <code>M²</code> quitándole un cuadradito de esquina <code>d²</code>.',
        en: 'Multiplication distributes over addition: <code>(40 + 7) × 6 = 40×6 + 7×6</code>. For symmetric pairs around a midpoint <code>M</code>, the rectangle area <code>(M − d)(M + d)</code> equals the square <code>M²</code> minus the small corner <code>d²</code>.'
      },
      howHtml: {
        es: '1) Mira si los dos números comparten un punto medio redondo (ej. <code>38 × 42 → 40</code>). Si es así, haz <code>medio² − distancia²</code>. 2) Si no, descompón un factor en decenas + unidades, multiplica primero por las decenas y ve sumando las unidades.',
        en: '1) Check if both numbers sit equally around a round midpoint (e.g. <code>38 × 42 → 40</code>); if so, do <code>mid² − offset²</code>. 2) Otherwise split one factor into tens + units and sum left-to-right.'
      },
      trapHtml: {
        es: 'Olvidar un cero al multiplicar por la decena (hacer <code>4 × 6 = 24</code> y sumarle <code>42 = 66</code> en lugar de <code>240 + 42 = 282</code>). Di en voz mental siempre «doscientos cuarenta», no «veinticuatro».',
        en: 'Dropping the zero on the tens partial product (doing <code>24 + 42</code> instead of <code>240 + 42</code>). Always say “two hundred forty” internally, never “twenty-four”.'
      },
      table: {
        headers: { es: ['Producto', 'Descomposición', 'Resultado'], en: ['Product', 'Decomposition', 'Result'] },
        rows: [
          ['68 × 7', '60×7 (420) + 8×7 (56)', '476'],
          ['48 × 52', '50² − 2² = 2500 − 4', '2496'],
          ['34 × 23', '34×20 (680) + 34×3 (102)', '782']
        ]
      },
      gen(hard) {
        if (!hard) {
          const a = rand(23, 96), b = rand(3, 9);
          const a10 = Math.floor(a / 10) * 10, a1 = a % 10;
          const p1 = a10 * b, p2 = a1 * b, ans = p1 + p2;
          return {
            expr: `${a} × ${b}`,
            ans,
            hint: LANG === 'es' ? `Haz primero ${a10} × ${b} y súmale ${a1} × ${b}.` : `Compute ${a10} × ${b} first, then add ${a1} × ${b}.`,
            takeaway: LANG === 'es' ? `Descomponer ${a} en ${a10} + ${a1} reduce un producto de dos cifras a dos tablas básicas.` : `Splitting ${a} into ${a10} + ${a1} turns a two-digit multiplication into two basic tables.`,
            steps: [
              { math: `${a10} × ${b} = ${p1}`, desc: LANG === 'es' ? 'Multiplica primero las decenas (ancla la magnitud)' : 'Multiply the tens first' },
              { math: `${a1} × ${b} = ${p2}`, desc: LANG === 'es' ? 'Multiplica ahora las unidades' : 'Multiply the units next' },
              { math: `${p1} + ${p2} = ${ans}`, desc: LANG === 'es' ? 'Suma ambos productos parciales' : 'Sum both partial products', final: true }
            ]
          };
        } else {
          if (Math.random() < 0.5) {
            const base = rand(2, 8) * 10;
            const d = rand(1, 6);
            const a = base - d, b = base + d, ans = a * b;
            return {
              expr: `${a} × ${b}`,
              ans,
              hint: LANG === 'es' ? `El punto medio es ${base}: prueba con ${base}² − ${d}².` : `Midpoint is ${base}: try ${base}² − ${d}².`,
              takeaway: LANG === 'es' ? `Como ${a} y ${b} equidistan ${d} de ${base}, la diferencia de cuadrados da el producto al instante.` : `Since ${a} and ${b} are ${d} from ${base}, difference of squares solves it in one shot.`,
              steps: [
                { math: `(${base} − ${d})(${base} + ${d})`, desc: LANG === 'es' ? `Ambos están a distancia ${d} del punto medio ${base}` : `Both sit ${d} away from midpoint ${base}` },
                { math: `${base}² − ${d}² = ${base * base} − ${d * d}`, desc: LANG === 'es' ? 'Aplica diferencia de cuadrados' : 'Apply difference of squares' },
                { math: `= ${ans}`, desc: LANG === 'es' ? 'Resta final directa' : 'Direct final subtraction', final: true }
              ]
            };
          } else {
            const a = rand(14, 46), b = rand(12, 34);
            const b10 = Math.floor(b / 10) * 10, b1 = b % 10;
            const p1 = a * b10, p2 = a * b1, ans = p1 + p2;
            return {
              expr: `${a} × ${b}`,
              ans,
              hint: LANG === 'es' ? `Separa ${b} en ${b10} + ${b1} y suma ${a}×${b10} + ${a}×${b1}.` : `Split ${b} into ${b10} + ${b1} and compute ${a}×${b10} + ${a}×${b1}.`,
              takeaway: LANG === 'es' ? `Separar el multiplicador más cómodo (${b} = ${b10} + ${b1}) evita anotar columnas cruzadas.` : `Splitting the friendlier factor (${b} = ${b10} + ${b1}) eliminates cross-column carry clutter.`,
              steps: [
                { math: `${a} × ${b10} = ${p1}`, desc: LANG === 'es' ? `Multiplica ${a} por las decenas (${b10})` : `Multiply ${a} by tens (${b10})` },
                { math: `${a} × ${b1} = ${p2}`, desc: LANG === 'es' ? `Multiplica ${a} por las unidades (${b1})` : `Multiply ${a} by units (${b1})` },
                { math: `${p1} + ${p2} = ${ans}`, desc: LANG === 'es' ? 'Suma los dos parciales' : 'Add both partial products', final: true }
              ]
            };
          }
        }
      }
    },
    {
      id: 'percent',
      title: { es: 'Porcentajes al instante', en: 'Instant percentages' },
      sub: {
        es: 'Ley de reversibilidad (X% de Y = Y% de X) y bloques modulares de 10%, 5% y 1%.',
        en: 'Swap law (X% of Y = Y% of X) and modular 10% / 5% / 1% building blocks.'
      },
      ruleHtml: {
        es: '<b>Los porcentajes son simétricos:</b> <code>16% de 50</code> vale exactamente lo mismo que <code>50% de 16 = 8</code>, y <code>28% de 25 = 25% de 28 = 7</code>.<br>Para cualquier porcentaje general, constrúyelo con tres ladrillos mentales: <code>10%</code> (corre la coma un lugar), <code>5%</code> (mitad del 10%) y <code>1%</code> (corre la coma dos lugares).',
        en: '<b>Percentages are reversible:</b> <code>16% of 50</code> equals <code>50% of 16 = 8</code>, and <code>28% of 25 = 25% of 28 = 7</code>.<br>For general percentages, snap together three bricks: <code>10%</code> (shift 1 digit), <code>5%</code> (half of 10%), and <code>1%</code> (shift 2 digits).'
      },
      usesHtml: {
        es: '<ul><li><b>Rebajas, impuestos e IVA:</b> saber al instante el precio final tras un 15%, 20% o 25% de descuento o propina.</li><li><b>Estadísticas, comisiones e inversiones:</b> traducir cualquier porcentaje sobre cifras redondas al vuelo en reuniones.</li><li><b>Comparar ofertas:</b> decidir en segundos si conviene más un 15% de descuento o un cupón fijo.</li></ul>',
        en: '<ul><li><b>Discounts, tax & tips:</b> calculate 15% tips or 25%–30% markdowns instantly at checkout.</li><li><b>Commissions & analytics:</b> translate percentages cleanly during discussions.</li><li><b>Deal comparison:</b> check whether a percentage cut beats a flat coupon in seconds.</li></ul>'
      },
      whyHtml: {
        es: '«Por ciento» significa dividir entre 100, así que <code>X% de Y = (X × Y) / 100 = (Y × X) / 100 = Y% de X</code>. Como multiplicar es conmutativo, siempre puedes intercambiar los números cuando uno de ellos (<code>50, 25, 20, 10</code>) da una fracción trivial.',
        en: '“Percent” simply means divided by 100, so <code>X% of Y = (X × Y)/100 = Y% of X</code>. Because multiplication commutes, you can always swap the numbers whenever one (like <code>50, 25, 20</code>) is an easy fraction.'
      },
      howHtml: {
        es: '1) Pregunta primero: ¿puedo darle la vuelta? Si ves <code>de 50</code>, <code>de 25</code> o <code>de 20</code>, inviértelo. 2) Si no, calcula el <code>10%</code> dividiendo entre 10, duplícalo/triplícalo si es 20%/30% y suma la mitad del 10% si termina en <code>5%</code>.',
        en: '1) Check if swapping helps: if the base is <code>50, 25, 20</code>, flip it immediately. 2) Otherwise find <code>10%</code> first, scale it up, and add half of 10% if there is a <code>5%</code> remainder.'
      },
      trapHtml: {
        es: 'Confundir un aumento del 20% seguido de una rebaja del 20%: nunca vuelves al precio original, porque el 20% de descuento se aplica sobre el total ya subido (ej. <code>100 → 120 → 96</code>).',
        en: 'Assuming +20% followed by −20% cancels out: the second percentage acts on the bigger number (<code>100 → 120 → 96</code>), not the original.'
      },
      table: {
        headers: { es: ['Pregunta', 'Truco mental', 'Resultado'], en: ['Question', 'Mental trick', 'Result'] },
        rows: [
          ['18% de 50', '50% de 18 (la mitad)', '9'],
          ['36% de 25', '25% de 36 (la cuarta parte)', '9'],
          ['15% de 260', '10% (26) + 5% (13)', '39'],
          ['35% de 80', '30% (24) + 5% (4)', '28']
        ]
      },
      gen(hard) {
        const swapMode = Math.random() < 0.5;
        if (swapMode) {
          const base = pick([50, 25, 20, 75]);
          const mult = base === 50 ? 2 : base === 25 ? 4 : base === 20 ? 5 : 4;
          const x = rand(3, hard ? 32 : 18) * mult;
          const ans = (x * base) / 100;
          const word = LANG === 'es' ? 'de' : 'of';
          return {
            expr: `${x}% ${word} ${base}`,
            ans,
            hint: LANG === 'es' ? `Dales la vuelta: calcula el ${base}% ${word} ${x}.` : `Flip them: compute ${base}% ${word} ${x}.`,
            takeaway: LANG === 'es' ? `Al invertir ${x}% ${word} ${base} en ${base}% ${word} ${x}, conviertes el porcentaje en una fracción directa.` : `Swapping ${x}% ${word} ${base} into ${base}% ${word} ${x} turns it into a clean mental fraction.`,
            steps: [
              { math: `${x}% ${word} ${base} = ${base}% ${word} ${x}`, desc: LANG === 'es' ? 'Aplica la simetría X% de Y = Y% de X' : 'Apply X% of Y = Y% of X symmetry' },
              { math: `${base}% ${word} ${x} = ${ans}`, desc: LANG === 'es' ? `Calcula esa fracción directa de ${x}` : `Take that simple fraction of ${x}`, final: true }
            ]
          };
        } else {
          const pct = pick(hard ? [15, 35, 45, 85, 12] : [15, 20, 30, 15, 25]);
          const n = rand(3, hard ? 24 : 14) * 20;
          const p10 = n / 10;
          const ans = Math.round((pct * n) / 100);
          const word = LANG === 'es' ? 'de' : 'of';
          return {
            expr: `${pct}% ${word} ${n}`,
            ans,
            hint: LANG === 'es' ? `Calcula primero el 10% de ${n} (${p10}) y construye ${pct}% por bloques.` : `Find 10% of ${n} (${p10}) first, then build ${pct}% from blocks.`,
            takeaway: LANG === 'es' ? `Anclarte en el 10% (${p10}) y su mitad (${p10 / 2} para el 5%) permite armar cualquier porcentaje sin fórmula.` : `Anchoring at 10% (${p10}) and its half (${p10 / 2} for 5%) lets you assemble any rate cleanly.`,
            steps: [
              { math: `10% ${word} ${n} = ${p10}`, desc: LANG === 'es' ? 'Halla el 10% quitando un cero / corriendo un decimal' : 'Find 10% by shifting one decimal place' },
              { math: `${pct}% = ${ans}`, desc: LANG === 'es' ? `Escala el 10% y ajusta con mitad (${p10 / 2}) si hace falta` : `Scale 10% and adjust with half (${p10 / 2}) as needed`, final: true }
            ]
          };
        }
      }
    },
    {
      id: 'roots-72',
      title: { es: 'Raíces exactas y Regla del 72', en: 'Exact Roots & Rule of 72' },
      sub: {
        es: 'Adivina raíces cuadradas exactas de 4 cifras y calcula en cuántos años se duplica un capital.',
        en: 'Extract exact 4-digit square roots and compute investment doubling times.'
      },
      ruleHtml: {
        es: '<b>Para hallar <code>√N</code> de un cuadrado perfecto de 3 o 4 cifras (ej. <code>√3136</code>):</b><br>1. Toma las primeras cifras (<code>31</code>): cae entre <code>5²=25</code> y <code>6²=36</code>, así que la decena es <b>5</b>.<br>2. Mira la última cifra (<code>6</code>): solo <code>4²</code> y <code>6²</code> acaban en 6. Usa <code>55² = 3025</code> como pivote: como <code>3136 &gt; 3025</code>, elige la mayor: <b>56</b>.<br><b>Regla del 72:</b> al <code>r%</code> anual compuesto, tu dinero se duplica en <code>72 ÷ r</code> años.',
        en: '<b>To extract <code>√N</code> of a 3–4 digit perfect square (e.g. <code>√3136</code>):</b><br>1. Check the leading digits (<code>31</code>): between <code>5²=25</code> and <code>6²=36</code>, so tens digit is <b>5</b>.<br>2. Look at the last digit (<code>6</code>): unit is <code>4</code> or <code>6</code>. Compare against <code>55² = 3025</code>: since <code>3136 &gt; 3025</code>, pick <b>56</b>.<br><b>Rule of 72:</b> at <code>r%</code> annual return, money doubles in <code>72 ÷ r</code> years.'
      },
      usesHtml: {
        es: '<ul><li><b>Finanzas personales e inflación (Regla del 72):</b> calcular cuántos años tarda un fondo al 6% en duplicarse (12 años) o cuánto tarda la inflación del 4% en partir tu ahorro a la mitad (18 años).</li><li><b>Geometría e ingeniería:</b> hallar el lado de una parcela o área cuadrada al vuelo.</li><li><b>Truco clásico de cálculo rápido:</b> resuelve raíces de 4 dígitos en 3 segundos comparando solo la cabeza y la cola.</li></ul>',
        en: '<ul><li><b>Investing & inflation (Rule of 72):</b> know how many years a 6% return takes to double (12 yrs), or 4% inflation to halve purchasing power (18 yrs).</li><li><b>Dimensions from area:</b> find side lengths from square plots without a calculator.</li><li><b>Speed math classic:</b> solve 4-digit square roots in 3 seconds using leading + trailing digit clues.</li></ul>'
      },
      whyHtml: {
        es: 'En raíces, <code>(10d + u)²</code> crece con <code>d²</code> en las centenas y su última cifra depende únicamente de <code>u²</code>. Para la Regla del 72, la ecuación exacta de interés compuesto es <code>(1 + r)^t = 2 ⇒ t ≈ ln(2)/r ≈ 0.693/r</code>; ajustado ligeramente al alza para interés discreto da <code>72</code>, que además es divisible por <code>2, 3, 4, 6, 8, 9, 12, 18, 24</code>.',
        en: 'In square roots, the hundreds determine the tens digit and the units digit determines the trailing digit mod 10 (pairs sum to 10: 1/9, 2/8, 3/7, 4/6). In finance, compounding solves <code>(1+r)^t = 2 ⇒ t ≈ 0.693/r</code>; nudged to <code>72</code> because discrete compounding sits near ~72% and 72 divides cleanly by 2, 3, 4, 6, 8, 9, 12.'
      },
      howHtml: {
        es: '1) Si ves <code>√N</code>: encuentra qué cuadrado no pasa de los dos primeros dígitos (decena); mira el dígito final para sacar el par candidato y compáralo con <code>N5²</code> (técnica #4). 2) Si ves «Años al r%»: simplemente divide <code>72 ÷ r</code>.',
        en: '1) For <code>√N</code>: bracket the leading digits to get the tens place; use the last digit to narrow to 2 candidates; test against <code>N5²</code>. 2) For doubling time at <code>r%</code>: compute <code>72 ÷ r</code>.'
      },
      trapHtml: {
        es: 'En raíces terminadas en <code>5</code> (única opción 5) o <code>0</code> no hay ambigüedad; en el resto hay dos candidatos (ej. <code>2</code> u <code>8</code> si acaba en <code>4</code>). Nunca elijas al azar: calcula en medio segundo <code>N5² = N(N+1)|25</code> para decidir al 100% si es mayor o menor.',
        en: 'Only numbers ending in 0 or 5 have a unique unit digit; all others have two candidates (e.g., 2 or 8 when ending in 4). Never guess—compute the midpoint <code>N5²</code> in half a second to know for sure.'
      },
      table: {
        headers: { es: ['Expresión', 'Pista de decena y unidad', 'Resultado'], en: ['Expression', 'Clue & logic', 'Result'] },
        rows: [
          ['√1764', '17 ≥ 4² (40s) · 1764 < 45² (2025) → menor (2)', '42'],
          ['√4096', '40 ≥ 6² (60s) · 4096 < 65² (4225) → menor (4)', '64'],
          ['72 ÷ 8% (duplicar)', 'Regla del 72 al 8% compuesto anual', '9 años'],
          ['72 ÷ 6% (duplicar)', 'Regla del 72 al 6% compuesto anual', '12 años']
        ]
      },
      gen(hard) {
        if (Math.random() < 0.35) {
          const rates = hard ? [4, 6, 8, 9, 12, 18, 3] : [6, 8, 9, 12];
          const rate = pick(rates);
          const ans = 72 / rate;
          const expr = LANG === 'es' ? `Duplicar al ${rate}% anual` : `Double at ${rate}% / yr`;
          return {
            expr,
            ans,
            hint: LANG === 'es' ? `Divide 72 entre la tasa anual (${rate}%).` : `Divide 72 by the annual rate (${rate}%).`,
            takeaway: LANG === 'es' ? `Por la Regla del 72, a un ${rate}% anual compuesto tu capital se duplica en ~${ans} años.` : `By the Rule of 72, a ${rate}% compound annual return doubles capital in ~${ans} years.`,
            steps: [
              { math: `72 ÷ ${rate} = ${ans}`, desc: LANG === 'es' ? `Aplica la Regla del 72: divide 72 entre ${rate}` : `Apply Rule of 72: divide 72 by ${rate}` },
              { math: `≈ ${ans} ${LANG === 'es' ? 'años' : 'years'}`, desc: LANG === 'es' ? 'Tiempo aproximado para multiplicar por 2 el capital' : 'Approximate years to double initial capital', final: true }
            ]
          };
        }

        const root = rand(hard ? 32 : 14, hard ? 96 : 65);
        const sq = root * root;
        const tens = Math.floor(root / 10);
        const unit = root % 10;
        const mid5 = tens * 10 + 5;
        const midSq = mid5 * mid5;
        return {
          expr: `√${sq}`,
          ans: root,
          hint: LANG === 'es' ? `Decena: mira las primeras cifras (${Math.floor(sq / 100)}); pivote medio: ${mid5}² = ${midSq}.` : `Tens: check leading digits (${Math.floor(sq / 100)}); midpoint pivot: ${mid5}² = ${midSq}.`,
          takeaway: LANG === 'es' ? `Cruzando las primeras cifras (${tens}0s) con la última (${sq % 10}) y el pivote ${mid5}²=${midSq}, hallas ${root} sin dividir.` : `Combining leading digits (${tens}0s), last digit (${sq % 10}), and ${mid5}²=${midSq} nails ${root} instantly.`,
          steps: [
            { math: `${tens * 10}² = ${tens * tens * 100} ≤ ${sq}`, desc: LANG === 'es' ? `La raíz está en la decena del ${tens * 10}` : `Root lies in the ${tens * 10}s` },
            { math: `${mid5}² = ${midSq} ${sq >= midSq ? '≤' : '>'} ${sq}`, desc: LANG === 'es' ? `Compara con la mitad (${mid5}²) y mira el último dígito (${sq % 10}) → ${unit}` : `Compare with midpoint (${mid5}²) and trailing digit (${sq % 10}) → ${unit}` },
            { math: `√${sq} = ${root}`, desc: LANG === 'es' ? 'Une decena y unidad' : 'Combine tens and unit digit', final: true }
          ]
        };
      }
    },
    {
      id: 'div-fast',
      title: { es: 'División rápida ÷5, ÷25 y mitades', en: 'Fast division ÷5, ÷25 & halving' },
      sub: {
        es: 'Divide mentalmente duplicando arriba y abajo o partiendo por bloques exactos.',
        en: 'Divide mentally by doubling top and bottom or splitting clean multiples.'
      },
      ruleHtml: {
        es: '<b>Nunca dividas por 5 ni por 25 haciendo la caja mental:</b><br>• <code>N ÷ 5</code>: duplica <code>N</code> y divide entre 10 (corre la coma un lugar): <code>340 ÷ 5 → 680 ÷ 10 = 68</code>.<br>• <code>N ÷ 25</code>: multiplica <code>N</code> por 4 y divide entre 100: <code>350 ÷ 25 → 1400 ÷ 100 = 14</code>.<br>• <b>División por bloques:</b> parte el dividendo en un múltiplo evidente + el resto (<code>176 ÷ 8 = 160÷8 + 16÷8 = 22</code>).',
        en: '<b>Never do long division in your head for ÷5 or ÷25:</b><br>• <code>N ÷ 5</code>: double <code>N</code> and divide by 10 (<code>340 ÷ 5 → 680 ÷ 10 = 68</code>).<br>• <code>N ÷ 25</code>: multiply <code>N</code> by 4 and divide by 100 (<code>350 ÷ 25 → 1400 ÷ 100 = 14</code>).<br>• <b>Chunk splitting:</b> break into a friendly multiple + remainder (<code>176 ÷ 8 = 160÷8 + 16÷8 = 22</code>).'
      },
      usesHtml: {
        es: '<ul><li><b>Repartir gastos o cuentas entre personas:</b> dividir al instante una cena o factura entre 4, 5, 6 u 8 comensales.</li><li><b>Calcular promedios y ritmos:</b> kilómetros por hora, coste por unidad o páginas por día.</li><li><b>Conversión de escalas:</b> pasar de base 5 o 25 a porcentajes o base 100 sin esfuerzo.</li></ul>',
        en: '<ul><li><b>Splitting bills among friends:</b> divide dinner checks cleanly by 4, 5, 6, or 8 people.</li><li><b>Averages & unit costs:</b> compute speed, cost per unit, or daily pace on the fly.</li><li><b>Scale conversions:</b> convert scores out of 25 or 5 to clean percentages effortlessly.</li></ul>'
      },
      whyHtml: {
        es: 'Multiplicar numerador y denominador por el mismo factor no altera el cociente: <code>N / 5 = (2N) / 10</code> y <code>N / 25 = (4N) / 100</code>. Así cambias una división incómoda por una multiplicación fácil (doblar o cuadruplicar) y quitar ceros.',
        en: 'Scaling numerator and denominator equally leaves the ratio unchanged: <code>N / 5 = (2N)/10</code> and <code>N / 25 = (4N)/100</code>. You swap hard division for effortless doubling.'
      },
      howHtml: {
        es: '1) Si divides entre <code>5</code>, multiplica el número por <code>2</code> y quita el último cero. 2) Si divides entre <code>25</code>, dobla dos veces (<code>×4</code>) y quita dos ceros. 3) Con otros divisores (<code>4, 6, 8</code>), busca primero el múltiplo redondo más cercano por debajo y suma el resto dividido.',
        en: '1) Dividing by <code>5</code>: double and drop one zero. 2) Dividing by <code>25</code>: double twice and drop two zeros. 3) For <code>4, 6, 8</code>: split off the largest round multiple first, then divide the small remainder.'
      },
      trapHtml: {
        es: 'Para <code>÷ 25</code> olvidar que hay que doblar <b>dos veces</b> (multiplicar por 4), no una sola vez. Comprueba siempre la magnitud: <code>400 ÷ 25 = 16</code>, nunca 80.',
        en: 'For <code>÷ 25</code>, forgetting to double <b>twice</b> (×4), not just once! Always check scale: <code>400 ÷ 25 = 16</code>, not 80.'
      },
      table: {
        headers: { es: ['División', 'Atajo mental', 'Resultado'], en: ['Division', 'Mental shortcut', 'Result'] },
        rows: [
          ['235 ÷ 5', '(235 × 2) ÷ 10 = 470 ÷ 10', '47'],
          ['650 ÷ 25', '(650 × 4) ÷ 100 = 2600 ÷ 100', '26'],
          ['216 ÷ 8', '160÷8 (20) + 56÷8 (7)', '27']
        ]
      },
      gen(hard) {
        const mode = pick(['div5', 'div25', 'chunk']);
        if (mode === 'div5') {
          const ans = rand(hard ? 24 : 12, hard ? 98 : 49);
          const n = ans * 5;
          return {
            expr: `${n} ÷ 5`,
            ans,
            hint: LANG === 'es' ? `Duplica ${n} y quita un cero (÷ 10).` : `Double ${n} and drop one zero (÷ 10).`,
            takeaway: LANG === 'es' ? `Dividir entre 5 siempre es idéntico a multiplicar por 2 (${n * 2}) y dividir entre 10.` : `Dividing by 5 is identical to doubling (${n * 2}) and dividing by 10.`,
            steps: [
              { math: `${n} × 2 = ${n * 2}`, desc: LANG === 'es' ? 'Duplica el dividendo mentalmente' : 'Double the number mentally' },
              { math: `${n * 2} ÷ 10 = ${ans}`, desc: LANG === 'es' ? 'Quita el cero final (divide por 10)' : 'Drop the trailing zero (divide by 10)', final: true }
            ]
          };
        } else if (mode === 'div25') {
          const ans = rand(hard ? 14 : 6, hard ? 48 : 26);
          const n = ans * 25;
          return {
            expr: `${n} ÷ 25`,
            ans,
            hint: LANG === 'es' ? `Multiplica ${n} × 4 (dobla dos veces) y quita dos ceros.` : `Multiply ${n} × 4 (double twice) and drop two zeros.`,
            takeaway: LANG === 'es' ? `Como 4 veces 25 son 100, cuadruplicar ${n} te da las centenas exactas del resultado.` : `Since four 25s make 100, quadrupling ${n} gives the exact answer in hundreds.`,
            steps: [
              { math: `${n} × 4 = ${n * 4}`, desc: LANG === 'es' ? 'Dobla dos veces el número' : 'Double the number twice' },
              { math: `${n * 4} ÷ 100 = ${ans}`, desc: LANG === 'es' ? 'Divide por 100 quitando dos ceros' : 'Divide by 100 by dropping two zeros', final: true }
            ]
          };
        } else {
          const div = pick([4, 6, 8]);
          const q1 = rand(1, 3) * 10;
          const q2 = rand(2, 9);
          const ans = q1 + q2;
          const p1 = q1 * div;
          const p2 = q2 * div;
          const n = p1 + p2;
          return {
            expr: `${n} ÷ ${div}`,
            ans,
            hint: LANG === 'es' ? `Separa ${n} en un múltiplo limpio (${p1}) más el resto (${p2}).` : `Split ${n} into a friendly multiple (${p1}) plus ${p2}.`,
            takeaway: LANG === 'es' ? `Partir ${n} en ${p1} + ${p2} convierte la división en dos tablas directas.` : `Splitting ${n} into ${p1} + ${p2} turns division into two basic times tables.`,
            steps: [
              { math: `${n} = ${p1} + ${p2}`, desc: LANG === 'es' ? `Separa un múltiplo redondo de ${div}` : `Split off an easy multiple of ${div}` },
              { math: `${p1}÷${div} = ${q1}, ${p2}÷${div} = ${q2}`, desc: LANG === 'es' ? 'Divide cada bloque por separado' : 'Divide each chunk separately' },
              { math: `${q1} + ${q2} = ${ans}`, desc: LANG === 'es' ? 'Suma los dos cocientes' : 'Add both quotients', final: true }
            ]
          };
        }
      }
    }
  ];

  // ---------------- Estado de la sesión ----------------
  const state = {
    drillIdx: 0,
    mode: saved.get('mode', 'study'),
    inputMode: saved.get('inputMode', 'choices'),
    diff: saved.get('diff', 'normal'),
    bests: saved.get('bests', {}),
    right: 0,
    total: 0,
    streak: 0,
    t0: 0,
    frozen: null,
    currentProb: null,
    answered: false,
    hintShown: false,
    typedBuf: ''
  };

  const TEST_LEN = 12;

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

  // ---------------- Render de interfaz y traducción ----------------
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
    $('inputHeading').textContent = L.inputHeading;
    $('diffHeading').textContent = L.diffHeading;
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

    document.querySelectorAll('#inputSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.inputs[v];
      b.setAttribute('aria-pressed', String(v === state.inputMode));
    });
    $('inputHint').textContent = L.inputHints[state.inputMode] || '';

    document.querySelectorAll('#diffSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.diffs[v];
      b.setAttribute('aria-pressed', String(v === state.diff));
    });

    renderRail();
    renderBest();
  }

  function renderRail() {
    const box = $('railList');
    box.innerHTML = '';
    let nextSuggestedMarked = false;
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
      } else if (!nextSuggestedMarked) {
        nextSuggestedMarked = true;
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

  function setPrompt({ eyebrow, name, meta, tip, bar, status }) {
    const p = $('prompt');
    p.classList.toggle('is-ok', status === 'ok');
    p.classList.toggle('is-bad', status === 'bad');
    $('pEyebrow').textContent = eyebrow || '';
    $('pName').textContent = name || '';
    $('pMeta').textContent = meta || '\u00a0';
    $('pBarWrap').classList.toggle('is-off', bar == null);
    if (bar != null) $('pBar').style.width = Math.round(bar * 100) + '%';
    $('pTip').hidden = !tip;
    $('pTip').innerHTML = tip || '';
  }

  function renderStepsHTML(steps, takeaway) {
    const L = t();
    const grid = `<div class="steps-grid">${steps
      .map(
        (s, idx) => `
      <div class="step-card ${s.final ? 'final' : ''}">
        <div class="step-num">${s.final ? L.finalStep : L.stepLabel(idx + 1)}</div>
        <div class="step-math">${s.math}</div>
        <div class="step-desc">${s.desc}</div>
      </div>`
      )
      .join('')}</div>`;
    const note = takeaway ? `<div class="step-takeaway"><b>${L.takeawayLabel}</b> ${takeaway}</div>` : '';
    return grid + note;
  }

  // ---------------- Modo ESTUDIAR ----------------
  function renderStudy() {
    const d = currentDrill();
    const L = t();
    const sample = d.gen(state.diff === 'hard');
    $('felt').classList.add('is-top');

    setPrompt({
      eyebrow: `${d.title[LANG]} · ${L.modes.study}`,
      name: d.title[LANG],
      meta: d.sub[LANG],
      bar: null,
      status: null
    });

    const ths = d.table.headers[LANG].map((h) => `<th>${h}</th>`).join('');
    const trs = d.table.rows
      .map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="n">${r[2]}</td></tr>`)
      .join('');

    $('felt').innerHTML = `
      <div class="study-wrap">
        <div class="rule-banner">${d.ruleHtml[LANG]}</div>

        <div class="guide-grid">
          <div class="guide-box uses">
            <h4>${L.guideUses}</h4>
            ${d.usesHtml[LANG]}
          </div>
          <div class="guide-box why">
            <h4>${L.guideWhy}</h4>
            <p>${d.whyHtml[LANG]}</p>
          </div>
        </div>

        <div class="guide-box">
          <h4>${L.guideHow}</h4>
          <p>${d.howHtml[LANG]}</p>
        </div>

        <div class="problem-box">
          <span class="problem-expr">${sample.expr}</span>
          <span class="problem-eq">=</span>
          <span class="answer-slot is-ok">${sample.ans}</span>
        </div>
        ${renderStepsHTML(sample.steps, sample.takeaway)}

        <div class="guide-box trap">
          <h4>${L.guideTrap}</h4>
          <p>${d.trapHtml[LANG]}</p>
        </div>

        <table class="facts">
          <thead><tr>${ths}</tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </div>
    `;

    const act = $('actions');
    act.innerHTML = '';
    const b1 = document.createElement('button');
    b1.type = 'button';
    b1.className = 'act';
    b1.textContent = L.newExample;
    b1.addEventListener('click', () => renderStudy());

    const b2 = document.createElement('button');
    b2.type = 'button';
    b2.className = 'act primary';
    b2.textContent = L.goPractice;
    b2.addEventListener('click', () => {
      setMode('practice');
    });
    act.append(b1, b2);
  }

  // ---------------- Generar opciones plausibles ----------------
  function makeChoices(ans) {
    const set = new Set([ans]);
    const deltas = [10, -10, 2, -2, 100, -100, 1, -1, 12, -12, 5, -5, 20, -20];
    for (const d of deltas) {
      if (set.size >= 4) break;
      const cand = ans + d;
      if (cand > 0 && Math.abs(cand % 10) === Math.abs(ans % 10) && Math.random() < 0.7) {
        set.add(cand);
      }
    }
    while (set.size < 4) {
      const offset = pick([-20, -10, -4, -2, -1, 1, 2, 4, 10, 20]);
      const cand = Math.max(1, ans + offset);
      set.add(cand);
    }
    return Array.from(set).sort((a, b) => a - b);
  }

  // ---------------- Modo PRACTICAR y EXAMEN ----------------
  function nextQuestion() {
    const d = currentDrill();
    const L = t();
    $('felt').classList.remove('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    if (state.mode === 'test' && state.total >= TEST_LEN) {
      finishTest();
      return;
    }

    state.currentProb = d.gen(state.diff === 'hard');
    state.answered = false;
    state.hintShown = false;
    state.typedBuf = '';

    const progressMeta =
      state.mode === 'test'
        ? `${state.total + 1} / ${TEST_LEN} · ${d.sub[LANG]}`
        : d.sub[LANG];

    setPrompt({
      eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
      name: state.currentProb.expr,
      meta: progressMeta,
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: null
    });

    renderQuestionStage();
  }

  function renderQuestionStage() {
    const prob = state.currentProb;
    const L = t();
    const isKeypad = state.inputMode === 'keypad';

    let keypadHtml = '';
    if (isKeypad && !state.answered) {
      keypadHtml = `
        <div class="keypad" id="numpad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
            .map((n) => `<button type="button" data-k="${n}">${n}</button>`)
            .join('')}
          <button type="button" data-k="back">⌫</button>
          <button type="button" class="enter" data-k="enter">${L.checkBtn}</button>
        </div>
      `;
    }

    const hintHtml = state.hintShown && prob.hint
      ? `<div class="hint-banner">${prob.hint}</div>`
      : '';

    $('felt').innerHTML = `
      <div class="math-board">
        <div class="problem-box">
          <span class="problem-expr">${prob.expr}</span>
          <span class="problem-eq">=</span>
          <span class="answer-slot" id="ansSlot">${state.typedBuf || '?'}</span>
        </div>
        <div id="hintSlot" style="width:100%">${hintHtml}</div>
        ${keypadHtml}
        <div id="breakdownSlot" style="width:100%"></div>
      </div>
    `;

    if (isKeypad && !state.answered) {
      document.querySelectorAll('#numpad button').forEach((btn) => {
        btn.addEventListener('click', () => handleKeypadKey(btn.getAttribute('data-k')));
      });
    }

    const act = $('actions');
    act.innerHTML = '';
    if (!isKeypad && !state.answered) {
      const choices = makeChoices(prob.ans);
      choices.forEach((val, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'act num';
        b.dataset.val = String(val);
        b.innerHTML = `${val} <kbd>${idx + 1}</kbd>`;
        b.addEventListener('click', () => submitAnswer(val, b));
        act.appendChild(b);
      });
    }
    if (state.mode === 'practice' && !state.answered && prob.hint) {
      const hBtn = document.createElement('button');
      hBtn.type = 'button';
      hBtn.className = 'act';
      hBtn.textContent = L.hintBtn;
      hBtn.addEventListener('click', () => {
        state.hintShown = true;
        const slot = $('hintSlot');
        if (slot) slot.innerHTML = `<div class="hint-banner">${prob.hint}</div>`;
        hBtn.disabled = true;
      });
      act.appendChild(hBtn);
    }
  }

  function handleKeypadKey(k) {
    if (state.answered) return;
    if (/^[0-9]$/.test(k)) {
      if (state.typedBuf.length < 7) state.typedBuf += k;
      const slot = $('ansSlot');
      if (slot) slot.textContent = state.typedBuf || '?';
    } else if (k === 'back') {
      state.typedBuf = state.typedBuf.slice(0, -1);
      const slot = $('ansSlot');
      if (slot) slot.textContent = state.typedBuf || '?';
    } else if (k === 'enter') {
      if (!state.typedBuf) return;
      submitAnswer(Number(state.typedBuf), null);
    }
  }

  function submitAnswer(userVal, clickedBtn) {
    if (state.answered) return;
    state.answered = true;
    const prob = state.currentProb;
    const isRight = Number(userVal) === prob.ans;
    const L = t();
    const d = currentDrill();

    state.total++;
    if (isRight) {
      state.right++;
      state.streak++;
    } else {
      state.streak = 0;
    }
    updateStats();

    const slot = $('ansSlot');
    if (slot) {
      slot.textContent = String(prob.ans);
      slot.classList.add(isRight ? 'is-ok' : 'is-bad');
    }

    const np = $('numpad');
    if (np) np.hidden = true;

    $('stageBox').classList.add(isRight ? 'flash-ok' : 'flash-bad');

    setPrompt({
      eyebrow: isRight ? L.correctExcl : L.wrongExcl(prob.ans),
      name: `${prob.expr} = ${prob.ans}`,
      meta:
        state.mode === 'test'
          ? `${state.total} / ${TEST_LEN}`
          : `${d.title[LANG]}`,
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: isRight ? 'ok' : 'bad'
    });

    const bSlot = $('breakdownSlot');
    if (bSlot) {
      bSlot.innerHTML = renderStepsHTML(prob.steps, prob.takeaway);
    }

    document.querySelectorAll('#actions .act.num').forEach((btn) => {
      btn.disabled = true;
      const v = Number(btn.dataset.val);
      if (v === prob.ans) btn.classList.add('is-right');
      else if (btn === clickedBtn && !isRight) btn.classList.add('is-wrong');
    });

    // Disable hint button if present
    Array.from($('actions').querySelectorAll('button')).forEach((b) => {
      if (!b.classList.contains('num')) b.remove();
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
      <div class="math-board">
        <div class="problem-box">
          <span class="problem-expr">${pct}%</span>
          <span class="problem-eq">·</span>
          <span class="answer-slot ${passed ? 'is-ok' : 'is-bad'}">${fmtClock(timeSec)}</span>
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

  // ---------------- Eventos de controles y teclado ----------------
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

  document.querySelectorAll('#inputSeg button').forEach((b) => {
    b.addEventListener('click', () => {
      state.inputMode = b.getAttribute('data-v');
      saved.set('inputMode', state.inputMode);
      renderAll();
    });
  });

  document.querySelectorAll('#diffSeg button').forEach((b) => {
    b.addEventListener('click', () => {
      state.diff = b.getAttribute('data-v');
      saved.set('diff', state.diff);
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

    if (state.inputMode === 'choices') {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const btns = document.querySelectorAll('#actions .act.num');
        if (btns[idx]) {
          e.preventDefault();
          btns[idx].click();
        }
      }
    } else {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeypadKey(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeypadKey('back');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleKeypadKey('enter');
      }
    }
  });

  resetSession();
  renderAll();
})();
