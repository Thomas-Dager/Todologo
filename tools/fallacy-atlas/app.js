/* Falacias y Sesgos Cognitivos (T022) — Todologo
 * 6 familias (24 falacias lógicas y sesgos cognitivos) con estructura formal, ejemplos reales y antídotos.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const saved = window.SiteProgress
    ? SiteProgress.tool('fallacy-atlas')
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
      docTitle: 'Falacias y Sesgos Cognitivos — Todologo',
      brandMark: 'FALACIAS <span>Y SESGOS</span><sup>T022</sup>',
      brandSub: 'Lógica crítica, trampas retóricas y sesgos cognitivos',
      railTitle: 'Familias, en orden',
      railPath: 'Estudia cada familia de 4 conceptos y supera su Examen con 90% o más para marcarla con ✓.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Lee la estructura lógica, un ejemplo claro y cómo desactivar cada falacia o sesgo.',
        practice: 'Analiza casos reales y detecta qué trampa se está cometiendo.',
        test: '10 casos contrarreloj. Consigue 90% (9/10) para dominar esta familia.'
      },
      scopeHeading: 'Opciones de respuesta',
      scopes: { group: 'De esta familia', all: 'Mezclar todas' },
      statAcc: 'Precisión',
      statTime: 'Tiempo',
      statStreak: 'Racha',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      cleanExit: 'Salir de vista limpia',
      settings: 'Ajustes',
      howItWorks: 'Cómo funciona',
      closeSheet: 'Listo',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> para elegir respuesta · <kbd>Espacio</kbd> siguiente caso',
      credit: 'Una falacia es un argumento que parece persuasivo psicológicamente pero cuya conclusión no se sigue de las premisas; un sesgo es un atajo mental automático que distorsiona el juicio. Parte de Todologo.',
      goPractice: 'Practicar casos de esta familia →',
      nextBtn: 'Siguiente caso',
      tryAgain: 'Intentar de nuevo',
      testDone: 'Examen completado',
      passedMsg: '¡Dominado! Lograste al menos 90% de precisión.',
      retryMsg: 'Necesitas 90% (9/10) para marcar esta familia. ¡Vuelve a intentarlo!',
      bestNone: 'Sin marca de examen todavía en esta familia.',
      bestFmt: (pct, s) => `Mejor examen: <b>${pct}%</b> en ${s}s`,
      correctExcl: '¡Exacto!',
      wrongExcl: (ans) => `Era: ${ans}`,
      promptQuestion: '¿Qué falacia o sesgo se comete en este caso?',
      antidoteLabel: 'Cómo responder / Antídoto:'
    },
    en: {
      docTitle: 'Fallacies & Cognitive Biases — Todologo',
      brandMark: 'FALLACIES <span>& BIASES</span><sup>T022</sup>',
      brandSub: 'Critical logic, rhetorical traps and cognitive biases',
      railTitle: 'Families, in order',
      railPath: 'Study each family of 4 concepts and score 90%+ on its Test to earn a ✓.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Inspect the logical structure, clear example and counter-move for each fallacy or bias.',
        practice: 'Analyze real-world scenarios and spot which reasoning trap is at play.',
        test: '10 timed cases. Score 90% (9/10) to master this family.'
      },
      scopeHeading: 'Answer choices',
      scopes: { group: 'From this family', all: 'Mix all 24' },
      statAcc: 'Accuracy',
      statTime: 'Time',
      statStreak: 'Streak',
      restart: 'Restart',
      cleanView: 'Clean view',
      cleanExit: 'Exit clean view',
      settings: 'Settings',
      howItWorks: 'How it works',
      closeSheet: 'Done',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> to select option · <kbd>Space</kbd> next case',
      credit: 'A fallacy is an argument that feels persuasive psychologically while its conclusion fails to follow from its premises; a bias is an automatic mental shortcut that skews judgment. Part of Todologo.',
      goPractice: 'Practice cases in this family →',
      nextBtn: 'Next case',
      tryAgain: 'Run again',
      testDone: 'Test complete',
      passedMsg: 'Mastered! You scored 90% or higher.',
      retryMsg: 'Score 90% (9/10) to earn a tick on this family. Give it another run!',
      bestNone: 'No test score saved for this family yet.',
      bestFmt: (pct, s) => `Best test: <b>${pct}%</b> in ${s}s`,
      correctExcl: 'Spot on!',
      wrongExcl: (ans) => `Answer: ${ans}`,
      promptQuestion: 'Which fallacy or cognitive bias is committed here?',
      antidoteLabel: 'Counter-move / Antidote:'
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

  // ---------------- Base de datos curada de 6 familias × 4 conceptos (24 total) ----------------
  const FAMILIES = [
    {
      id: 'relevance',
      title: { es: 'Ataque y Distracción', en: 'Attack & Red Herrings' },
      sub: {
        es: 'Desviar la atención atacando al interlocutor o deformando su postura.',
        en: 'Derailing the debate by attacking the speaker or distorting their claim.'
      },
      items: [
        {
          id: 'ad-hominem',
          name: { es: 'Ad Hominem', en: 'Ad Hominem' },
          formula: 'A afirma P · A tiene defecto X ⇒ ¬P',
          def: {
            es: 'Atacar el carácter, pasado o motivo de quien habla en lugar de refutar sus datos o razones.',
            en: 'Attacking the speaker’s character, background or motives instead of addressing their argument.'
          },
          counter: {
            es: 'Separa el mensajero del mensaje: «Aunque eso fuera cierto sobre mí, ¿qué dato de la propuesta es incorrecto?»',
            en: 'Separate messenger from message: "Even if that were true about me, which part of the evidence is wrong?"'
          },
          cases: [
            {
              ctx: { es: 'Debate económico', en: 'Economic debate' },
              es: '«El análisis fiscal de Laura carece de validez; recordemos que hace diez años su primera empresa quebró.»',
              en: '"Laura’s tax analysis has no merit; remember that ten years ago her first startup went bankrupt."'
            },
            {
              ctx: { es: 'Junta vecinal', en: 'Neighborhood council' },
              es: '«No podemos tomar en serio la propuesta de iluminación del ingeniero Pérez porque ni siquiera vive en esta cuadra.»',
              en: '"We shouldn’t listen to Engineer Perez’s street-lighting proposal because he doesn’t even live on this block."'
            }
          ]
        },
        {
          id: 'straw-man',
          name: { es: 'Hombre de Paja', en: 'Straw Man' },
          formula: 'A afirma P · B exagera P a P* · B refuta P* ⇒ ¬P',
          def: {
            es: 'Reemplazar la postura real del oponente por una versión exagerada o caricaturesca mucho más fácil de atacar.',
            en: 'Replacing the opponent’s actual position with an exaggerated caricature that is much easier to knock down.'
          },
          counter: {
            es: 'Señala la distorsión con calma: «Yo no propuse eliminar todos los autos, sino peatonalizar dos calles los domingos.»',
            en: 'Point out the distortion calmly: "I didn’t propose banning all cars—only pedestrianizing two streets on Sundays."'
          },
          cases: [
            {
              ctx: { es: 'Presupuesto municipal', en: 'City budget' },
              es: '«El concejal sugiere aumentar un 5% el presupuesto de parques. Parece que prefiere dejar a los hospitales sin ambulancias con tal de plantar flores.»',
              en: '"The councilor suggests raising the parks budget by 5%. Apparently he’d rather leave hospitals without ambulances just to plant flowers."'
            },
            {
              ctx: { es: 'Educación', en: 'Education' },
              es: '«Dices que deberíamos reducir los deberes escolares en primaria; básicamente quieres que los niños crezcan sin disciplina ni esfuerzo.»',
              en: '"You say we should reduce homework in elementary school; basically you want kids to grow up with zero discipline."'
            }
          ]
        },
        {
          id: 'tu-quoque',
          name: { es: 'Tu Quoque (Hipocresía)', en: 'Tu Quoque (Appeal to Hypocrisy)' },
          formula: 'A afirma P · A no cumple P ⇒ ¬P',
          def: {
            es: 'Invalidar una afirmación o consejo señalando que quien lo dice no actúa de forma coherente con ello.',
            en: 'Dismissing a claim or truth by pointing out that the speaker fails to practice it themselves.'
          },
          counter: {
            es: 'Reconoce que la incoherencia personal no altera los hechos: «Mi mal hábito no cambia la evidencia médica sobre el tabaco.»',
            en: 'Note that personal inconsistency does not alter facts: "My bad habit doesn’t change the medical evidence on smoking."'
          },
          cases: [
            {
              ctx: { es: 'Salud médica', en: 'Medical advice' },
              es: '«Mi médico me dijo que debo bajar el consumo de azúcar, pero ayer lo vi comprando dos pasteles en la panadería; así que el azúcar no hace daño.»',
              en: '"My doctor told me to cut down on sugar, yet I saw him buying two pastries yesterday—so sugar clearly isn’t harmful."'
            },
            {
              ctx: { es: 'Ecología', en: 'Environment' },
              es: '«Ese climatólogo viaja en avión a los congresos, por lo tanto sus mediciones sobre el dióxido de carbono son falsas.»',
              en: '"That climate scientist flies to conferences, therefore his atmospheric carbon measurements must be false."'
            }
          ]
        },
        {
          id: 'red-herring',
          name: { es: 'Pista Falsa (Red Herring)', en: 'Red Herring' },
          formula: 'Se discute P · Se introduce tema emocional Q ⇒ Se olvida P',
          def: {
            es: 'Introducir un dato tangencial pero emocionalmente llamativo para desviar la conversación de la pregunta original.',
            en: 'Introducing a tangential, emotionally charged topic to steer attention away from the original question.'
          },
          counter: {
            es: 'Reencauza el foco: «Ese es otro tema importante que podemos ver luego; volvamos a la pregunta sobre el contrato actual.»',
            en: 'Bring focus back: "That’s a separate issue we can discuss later; let’s return to the question about this contract."'
          },
          cases: [
            {
              ctx: { es: 'Rueda de prensa empresarial', en: 'Corporate press conference' },
              es: '«Nos preguntan por el retraso en la entrega del software, pero ¿han pensado en las miles de horas que nuestros ingenieros donan a causas benéficas cada año?»',
              en: '"You ask about the software delivery delay, but have you considered how many hours our engineers volunteer for charity every year?"'
            },
            {
              ctx: { es: 'Auditoría contable', en: 'Accounting audit' },
              es: '«¿Por qué cuestionan esta factura sin comprobante cuando la competencia extranjera está intentando quedarse con nuestro mercado nacional?»',
              en: '"Why are you questioning this undocumented invoice when foreign competitors are trying to take over our national market?"'
            }
          ]
        }
      ]
    },
    {
      id: 'causation',
      title: { es: 'Causalidad y Generalización', en: 'Causation & Generalization' },
      sub: {
        es: 'Confundir correlación con causa o extraer leyes de muestras sesgadas.',
        en: 'Confusing correlation with causation or drawing laws from biased samples.'
      },
      items: [
        {
          id: 'post-hoc',
          name: { es: 'Post Hoc (Falsa Causa)', en: 'Post Hoc (False Cause)' },
          formula: 'A ocurrió antes que B ⇒ A causó B',
          def: {
            es: 'Asumir que porque un evento siguió a otro en el tiempo, el primero fue necesariamente la causa del segundo.',
            en: 'Assuming that because event B followed event A in time, A must have caused B.'
          },
          counter: {
            es: 'Pregunta por el mecanismo causal y variables de confusión (estacionalidad, regresión a la media, azar).',
            en: 'Ask for the causal mechanism and check for confounding variables (seasonality, regression to the mean).'
          },
          cases: [
            {
              ctx: { es: 'Deporte y superstición', en: 'Sports & superstition' },
              es: '«Desde que cambié el color de los cordones de mis zapatillas el lunes, ganamos tres partidos seguidos; los cordones nos dieron la racha.»',
              en: '"Ever since I switched to yellow shoelaces on Monday, we’ve won three games in a row—the laces brought the winning streak."'
            },
            {
              ctx: { es: 'Marketing web', en: 'Web marketing' },
              es: '«Cambiamos la tipografía del pie de página el 1 de diciembre y las ventas subieron un 40% ese mes; la fuente nueva disparó las compras.»',
              en: '"We changed the footer font on December 1st and sales jumped 40% that month; the new font clearly drove the purchases."'
            }
          ]
        },
        {
          id: 'slippery-slope',
          name: { es: 'Pendiente Resbaladiza', en: 'Slippery Slope' },
          formula: 'Si permitimos A ⇒ B ⇒ C ⇒ Catástrofe Z',
          def: {
            es: 'Afirmar sin pruebas que un primer paso moderado desencadenará inevitablemente una cadena de consecuencias extremas.',
            en: 'Claiming without evidence that a moderate first step will inevitably trigger a chain of extreme consequences.'
          },
          counter: {
            es: 'Exige justificar cada eslabón de la cadena por separado y señala dónde existen frenos o límites claros.',
            en: 'Demand evidence for each link in the chain and point out where clear stopping rules exist.'
          },
          cases: [
            {
              ctx: { es: 'Política laboral', en: 'Workplace policy' },
              es: '«Si permitimos que el equipo trabaje desde casa los viernes, en un mes nadie vendrá ningún día, cerraremos la oficina y la empresa desaparecerá antes de fin de año.»',
              en: '"If we let the team work from home on Fridays, within a month nobody will show up any day, we’ll shut the office and the company will collapse by year-end."'
            },
            {
              ctx: { es: 'Reglamento universitario', en: 'University rules' },
              es: '«Si damos diez minutos de tolerancia por lluvia hoy, mañana exigirán aprobar sin hacer exámenes y los títulos ya no valdrán nada.»',
              en: '"If we grant a ten-minute grace period for rain today, tomorrow students will demand passing grades without exams and degrees will be worthless."'
            }
          ]
        },
        {
          id: 'hasty-gen',
          name: { es: 'Generalización Apresurada', en: 'Hasty Generalization' },
          formula: 'Muestra mínima (n=2) tiene X ⇒ Todos tienen X',
          def: {
            es: 'Sacar una conclusión universal sobre todo un grupo basándose en uno o muy pocos casos anecdóticos.',
            en: 'Drawing a sweeping conclusion about an entire population from one or two anecdotal cases.'
          },
          counter: {
            es: 'Pregunta por el tamaño de la muestra (n) y qué tan representativos son esos casos frente al total.',
            en: 'Ask for the sample size (n) and whether those anecdotes represent the broader distribution.'
          },
          cases: [
            {
              ctx: { es: 'Turismo y ciudades', en: 'Travel & cities' },
              es: '«Estuve dos horas haciendo escala en esa ciudad y los dos taxistas con los que hablé fueron groseros; todos los habitantes de ese país son antipáticos.»',
              en: '"I had a two-hour layover in that city and both taxi drivers I spoke with were rude; everyone in that country is unfriendly."'
            },
            {
              ctx: { es: 'Tecnología', en: 'Technology' },
              es: '«Compré un portátil de esa marca en 2018 y le falló la batería; ningún producto de esa marca sirve.»',
              en: '"I bought one laptop from that brand in 2018 and the battery died; nothing they manufacture works."'
            }
          ]
        },
        {
          id: 'texas-sharpshooter',
          name: { es: 'Francotirador de Texas (Cherry Picking)', en: 'Texas Sharpshooter (Cherry Picking)' },
          formula: 'Disparar al azar y pintar la diana alrededor de los aciertos',
          def: {
            es: 'Seleccionar únicamente el subconjunto de datos que respalda nuestra hipótesis e ignorar todos los demás que la contradicen.',
            en: 'Picking only the cluster of data points that fits our hypothesis while ignoring the rest of the dataset.'
          },
          counter: {
            es: 'Pide ver el conjunto completo de datos antes de filtrar: «¿Qué ocurrió en los otros 18 meses o en las demás sucursales?»',
            en: 'Ask to see the full unfiltered dataset: "What happened in the other 18 months or across the remaining branches?"'
          },
          cases: [
            {
              ctx: { es: 'Informe de inversiones', en: 'Investment report' },
              es: '«Nuestro fondo superó al mercado si medimos exclusivamente los martes lluviosos entre marzo y mayo de 2023, ignorando los otros once meses.»',
              en: '"Our fund beat the market if you measure exclusively between March 14 and May 2, ignoring the other ten months of the year."'
            },
            {
              ctx: { es: 'Suplementos nutricionales', en: 'Nutritional supplements' },
              es: '«Hicimos 20 pruebas clínicas: 19 no mostraron efecto, pero publicamos solo la número 14 donde hubo una leve mejora por azar.»',
              en: '"We ran 20 trials: 19 showed zero effect, so we published only trial #14 where a slight improvement appeared by chance."'
            }
          ]
        }
      ]
    },
    {
      id: 'structure',
      title: { es: 'Estructura y Falsos Dilemas', en: 'Structure & False Dilemmas' },
      sub: {
        es: 'Trampas en la forma del argumento, definiciones móviles y opciones artificiales.',
        en: 'Flaws in logical form, shifting definitions and artificial either-or choices.'
      },
      items: [
        {
          id: 'false-dilemma',
          name: { es: 'Falso Dilema (Blanco o Negro)', en: 'False Dilemma (Black-or-White)' },
          formula: 'Plantea «O A o B» cuando existen C, D y E',
          def: {
            es: 'Presentar solo dos opciones extremas como si fueran las únicas posibles, ocultando todo el espectro de alternativas intermedias.',
            en: 'Presenting only two extreme options as if they were the only possibilities, hiding intermediate alternatives.'
          },
          counter: {
            es: 'Introduce explícitamente la tercera opción o el término medio que fue omitido.',
            en: 'Explicitly name a third option or middle ground that was left out.'
          },
          cases: [
            {
              ctx: { es: 'Estrategia de producto', en: 'Product strategy' },
              es: '«O duplicamos el precio mañana mismo o tendremos que despedir a la mitad de la empresa; no existe ningún otro camino.»',
              en: '"Either we double our prices tomorrow morning or we have to lay off half the company; there is no other option."'
            },
            {
              ctx: { es: 'Debate público', en: 'Public debate' },
              es: '«O estás 100% de acuerdo con cada punto de esta reforma o eres enemigo del progreso de la ciudad.»',
              en: '"Either you agree 100% with every clause of this bill or you are an enemy of the city’s progress."'
            }
          ]
        },
        {
          id: 'circular',
          name: { es: 'Petición de Principio (Circular)', en: 'Begging the Question (Circular)' },
          formula: 'P es verdad porque P (con otras palabras)',
          def: {
            es: 'Incluir la conclusión que se quiere demostrar dentro de las propias premisas, dando vueltas en círculo.',
            en: 'Assuming the very conclusion one is trying to prove inside the premises, reasoning in a circle.'
          },
          counter: {
            es: 'Muestra que la premisa y la conclusión dicen lo mismo y pide una evidencia independiente externa.',
            en: 'Show that premise and conclusion restate the same claim and ask for independent evidence.'
          },
          cases: [
            {
              ctx: { es: 'Crítica literaria', en: 'Literary criticism' },
              es: '«Esta novela es un éxito de ventas porque es sumamente popular entre la gente que compra muchos libros.»',
              en: '"This novel is a bestseller because it is extremely popular among book buyers."'
            },
            {
              ctx: { es: 'Debate legal', en: 'Legal argument' },
              es: '«El acusado jamás mentiría bajo juramento porque es un hombre íntegro, y sabemos que es íntegro porque él mismo lo aseguró en su declaración.»',
              en: '"The witness would never lie because he is completely honest, and we know he is honest because he told us so."'
            }
          ]
        },
        {
          id: 'motte-bailey',
          name: { es: 'Castillo y Patio (Motte & Bailey)', en: 'Motte and Bailey' },
          formula: 'Afirmar tesis audaz P* → al ser refutado, replegarse a obviedad P',
          def: {
            es: 'Lanzar una afirmación polémica difícil de defender (el patio) y, cuando alguien la cuestiona, asegurar que solo se decía algo obvio e indiscutible (el castillo).',
            en: 'Making a bold, controversial claim (the bailey) and, when challenged, retreating to a trivial truism (the motte).'
          },
          counter: {
            es: 'Fija ambas posturas por separado: «Nadie discute la versión suave (A); lo que cuestiono es tu afirmación fuerte (B).»',
            en: 'Pin down both claims separately: "Everyone agrees with the mild claim (A); what I’m challenging is your strong claim (B)."'
          },
          cases: [
            {
              ctx: { es: 'Salud y estilo de vida', en: 'Health & lifestyle' },
              es: '«¡Dormir ocho horas cura absolutamente cualquier enfermedad genética! —Bueno, cuando me criticas, yo solo digo que descansar bien ayuda a la salud.»',
              en: '"Sleeping eight hours cures every genetic disease! —Well, when you push back, all I’m saying is that good rest is healthy."'
            },
            {
              ctx: { es: 'Tecnología educativa', en: 'EdTech debate' },
              es: '«Los libros impresos son obsoletos y deben desaparecer de las escuelas. —¿Por qué te opones? Solo digo que las pantallas también pueden ser útiles.»',
              en: '"Printed books are obsolete and should be removed from schools. —Why object? I’m just saying screens can be useful too."'
            }
          ]
        },
        {
          id: 'no-true-scotsman',
          name: { es: 'Ningún verdadero escocés', en: 'No True Scotsman' },
          formula: '«Ningún X hace Y» · «Pero Juan es X y hace Y» ⇒ «Juan no es un verdadero X»',
          def: {
            es: 'Proteger una generalización frente a un contraejemplo real cambiando arbitrariamente la definición del grupo sobre la marcha.',
            en: 'Protecting a universal generalization from a counterexample by arbitrarily redefining membership on the spot.'
          },
          counter: {
            es: 'Pide una definición objetiva previa antes de evaluar los casos, sin mover la portería.',
            en: 'Ask for an objective definition up front instead of moving the goalposts after counterexamples appear.'
          },
          cases: [
            {
              ctx: { es: 'Programación de software', en: 'Software engineering' },
              es: '«Ningún programador serio usa interfaz gráfica para Git. —Pero Ana es arquitecta senior y la usa. —Bueno, entonces Ana no es una programadora verdaderamente seria.»',
              en: '"No serious programmer uses a GUI for Git. —But Ana is a senior architect and uses one. —Then Ana isn’t a truly serious programmer."'
            },
            {
              ctx: { es: 'Gastronomía', en: 'Culinary debate' },
              es: '«Ningún amante del café le pone leche. —Mi abuelo tostaba café en Colombia y lo tomaba con leche. —Entonces no era un verdadero amante del café.»',
              en: '"No coffee lover puts milk in their cup. —My grandfather roasted coffee in Colombia and drank it with milk. —Then he wasn’t a true coffee lover."'
            }
          ]
        }
      ]
    },
    {
      id: 'authority',
      title: { es: 'Autoridad, Grupo y Tradición', en: 'Authority, Crowd & Tradition' },
      sub: {
        es: 'Sustituir la evidencia por popularidad, fama, antigüedad o falta de pruebas.',
        en: 'Replacing evidence with popularity, celebrity status, antiquity or lack of proof.'
      },
      items: [
        {
          id: 'ad-populum',
          name: { es: 'Ad Populum (Efecto Arrastre)', en: 'Ad Populum (Bandwagon)' },
          formula: 'La mayoría cree P ⇒ P es verdadero',
          def: {
            es: 'Concluir que una idea es verdadera o correcta simplemente porque mucha gente la cree o está de moda.',
            en: 'Concluding that a proposition is true or right simply because many people believe or do it.'
          },
          counter: {
            es: 'Recuerda que la popularidad mide adopción social, no veracidad empírica.',
            en: 'Remind that popularity measures social adoption, not empirical truth.'
          },
          cases: [
            {
              ctx: { es: 'Finanzas personales', en: 'Personal finance' },
              es: '«Más de dos millones de usuarios compraron ese activo digital esta semana en redes sociales; es imposible que sea una mala inversión.»',
              en: '"Over two million users bought that digital token this week on social media; it can’t possibly be a bad investment."'
            },
            {
              ctx: { es: 'Salud', en: 'Health claim' },
              es: '«Todo el mundo en el gimnasio toma esta bebida energética antes de correr, así que científicamente debe mejorar la resistencia.»',
              en: '"Everyone at the gym drinks this energy tonic before running, so it must scientifically boost endurance."'
            }
          ]
        },
        {
          id: 'false-authority',
          name: { es: 'Falsa Autoridad (Ad Verecundiam)', en: 'Appeal to False Authority' },
          formula: 'Famoso/Experto fuera de su área afirma P ⇒ P es cierto',
          def: {
            es: 'Apelar al prestigio de una celebridad o de un experto que opina fuera de su disciplina científica real.',
            en: 'Relying on the prestige of a celebrity or an expert speaking outside their actual field of expertise.'
          },
          counter: {
            es: 'Pregunta si la autoridad citada tiene investigación revisada en esa materia específica y cuáles son sus datos.',
            en: 'Ask whether the cited figure has domain expertise in that specific field and what data they rely on.'
          },
          cases: [
            {
              ctx: { es: 'Física y medicina', en: 'Physics & medicine' },
              es: '«Este medallón cuántico cura el insomnio porque lo recomienda en televisión un campeón olímpico de natación.»',
              en: '"This quantum pendant cures insomnia because an Olympic swimming champion endorsed it on television."'
            },
            {
              ctx: { es: 'Ingeniería civil', en: 'Civil engineering' },
              es: '«El diseño estructural del puente es seguro porque un reconocido historiador del arte dijo que sus arcos se ven muy sólidos.»',
              en: '"The bridge’s structural design is safe because a renowned art historian said its arches look very solid."'
            }
          ]
        },
        {
          id: 'appeal-nature',
          name: { es: 'Apelación a la Naturaleza / Tradición', en: 'Appeal to Nature / Tradition' },
          formula: 'X es natural o antiguo ⇒ X es bueno y seguro',
          def: {
            es: 'Asumir que algo es bueno, sano o superior solo por ser «natural» o porque «siempre se ha hecho así».',
            en: 'Assuming something is good, safe or superior merely because it is "natural" or "has always been done this way."'
          },
          counter: {
            es: 'Evalúa el efecto real: el arsénico y la cicuta son 100% naturales, y los antibióticos o gafas son artificiales.',
            en: 'Evaluate actual outcomes: arsenic and hemlock are 100% natural, while eyeglasses and water filtration are artificial.'
          },
          cases: [
            {
              ctx: { es: 'Farmacología', en: 'Pharmacology' },
              es: '«Esta infusión concentrada de hierbas silvestres no puede tener ningún efecto secundario ni toxicidad hepática porque es 100% natural y ancestral.»',
              en: '"This concentrated wild-herb extract cannot possibly have any liver toxicity because it is 100% natural and ancient."'
            },
            {
              ctx: { es: 'Procesos internos', en: 'Company operations' },
              es: '«No debemos automatizar el registro en papel; llevamos 35 años llenando estas tres carpetas a mano y por algo será el mejor método.»',
              en: '"We shouldn’t automate paper filing; we’ve filled out these three binders by hand for 35 years, so it must be the best way."'
            }
          ]
        },
        {
          id: 'ad-ignorantiam',
          name: { es: 'Apelación a la Ignorancia', en: 'Appeal to Ignorance' },
          formula: 'No se ha probado ¬P ⇒ Por lo tanto P es verdad',
          def: {
            es: 'Sostener que una afirmación es verdadera simplemente porque nadie ha podido demostrar aún que es falsa (invirtiendo la carga de la prueba).',
            en: 'Claiming a statement is true simply because nobody has yet proven it false (shifting the burden of proof).'
          },
          counter: {
            es: 'Recuerda el principio de la carga de la prueba: quien afirma la existencia de algo es quien debe aportar la evidencia positiva.',
            en: 'Restore the burden of proof: the person making the positive claim must provide positive evidence.'
          },
          cases: [
            {
              ctx: { es: 'Debate pseudocientífico', en: 'Pseudoscience debate' },
              es: '«Nadie ha podido demostrar al 100% que los amuletos de cuarzo no influyan en la suerte bursátil, por lo tanto es un hecho que funcionan.»',
              en: '"Nobody has 100% proven that quartz amulets don’t influence stock-market luck, so it’s a fact that they work."'
            },
            {
              ctx: { es: 'Investigación sin pruebas', en: 'Unfounded allegation' },
              es: '«Como el comité aún no tiene documentos que descarten una conspiración secreta, eso demuestra que la conspiración existe.»',
              en: '"Since the committee has no documents ruling out a secret conspiracy, that proves the conspiracy is real."'
            }
          ]
        }
      ]
    },
    {
      id: 'decision-biases',
      title: { es: 'Sesgos de Decisión y Dinero', en: 'Decision & Money Biases' },
      sub: {
        es: 'Errores sistemáticos al evaluar costos pasados, azar, precios y riesgos.',
        en: 'Systematic errors when weighing past costs, randomness, prices and risk.'
      },
      items: [
        {
          id: 'sunk-cost',
          name: { es: 'Falacia del Costo Hundido', en: 'Sunk Cost Fallacy' },
          formula: 'Ya invertí X irrecuperable ⇒ Debo seguir invirtiendo en algo malo',
          def: {
            es: 'Continuar con un proyecto, compra o actividad que hoy nos perjudica solo porque ya gastamos tiempo o dinero que no se puede recuperar.',
            en: 'Continuing an endeavor that has negative future value solely because of past, unrecoverable investments of time or money.'
          },
          counter: {
            es: 'Haz la pregunta desde cero: «Si hoy no hubiera gastado nada en esto, ¿entraría hoy con lo que sé ahora?»',
            en: 'Ask the zero-base question: "If I hadn’t spent anything yet, would I start this today knowing what I know now?"'
          },
          cases: [
            {
              ctx: { es: 'Gestión de proyectos', en: 'Project management' },
              es: '«Sabemos que este sistema informático ya quedó obsoleto y nadie lo usará, pero ya llevamos gastados 200.000 dólares, así que debemos invertir otros 100.000 para terminarlo.»',
              en: '"We know this software system is obsolete and no one will use it, but we’ve already spent $200,000 on it, so we must spend another $100,000 to finish it."'
            },
            {
              ctx: { es: 'Vida cotidiana', en: 'Daily life' },
              es: '«La película me está pareciendo insoportable y me duele la cabeza, pero como ya pagué la entrada debo quedarme las dos horas restantes.»',
              en: '"This movie is unbearable and giving me a headache, but since I already paid for the ticket I have to sit through the remaining two hours."'
            }
          ]
        },
        {
          id: 'gamblers-fallacy',
          name: { es: 'Falacia del Jugador (Monte Carlo)', en: 'Gambler’s Fallacy' },
          formula: 'Salieron 6 caras seguidas ⇒ Ahora «toca» cruz (en eventos independientes)',
          def: {
            es: 'Creer que en sucesos aleatorios independientes (monedas, ruleta, dados) los resultados pasados alteran la probabilidad del próximo tiro.',
            en: 'Believing that in independent random events (coins, roulette, dice), past outcomes change the probability of the next trial.'
          },
          counter: {
            es: 'Las monedas y ruletas no tienen memoria: cada lanzamiento independiente vuelve a tener exactamente la misma probabilidad.',
            en: 'Coins and roulette wheels have no memory: every independent trial resets to the exact same probability.'
          },
          cases: [
            {
              ctx: { es: 'Probabilidad y azar', en: 'Probability & chance' },
              es: '«La ruleta ha caído en negro siete veces seguidas; voy a apostar todo al rojo porque estadísticamente ya le toca salir en esta tirada.»',
              en: '"The roulette wheel has landed on black seven times in a row; I’m betting everything on red because it’s statistically due on this spin."'
            },
            {
              ctx: { es: 'Moneda justa', en: 'Fair coin toss' },
              es: '«Lanzamos una moneda justa cuatro veces y salieron cuatro caras; la quinta vez tiene mucha más probabilidad de salir cruz.»',
              en: '"We flipped a fair coin four times and got four heads; the fifth flip is much more likely to land tails."'
            }
          ]
        },
        {
          id: 'anchoring',
          name: { es: 'Sesgo de Anclaje (Anchoring)', en: 'Anchoring Bias' },
          formula: 'Cifra inicial alta A ⇒ Cualquier precio menor B parece «barato»',
          def: {
            es: 'Quedar psicológicamente atado al primer número que vemos, evaluando todo lo posterior en relación con esa ancla inicial.',
            en: 'Relying too heavily on the first number offered (the anchor) when judging value or making estimates.'
          },
          counter: {
            es: 'Ignora el precio «tachado» original y calcula el valor intrínseco o compara con alternativas independientes.',
            en: 'Ignore the crossed-out "original" price and evaluate intrinsic value or compare independent alternatives.'
          },
          cases: [
            {
              ctx: { es: 'Compras y precios', en: 'Retail pricing' },
              es: '«El reloj tenía una etiqueta de 1.200 $ tachada y hoy dice 350 $; aunque un reloj similar vale 150 $, siento que estoy ganando 850 $ si lo compro ya.»',
              en: '"The watch had a crossed-out $1,200 tag and now says $350; even though comparable watches cost $150, it feels like an $850 bargain."'
            },
            {
              ctx: { es: 'Negociación inmobiliaria', en: 'Real estate negotiation' },
              es: '«El vendedor pidió inicialmente una cifra absurda y luego bajó un 15%; el comprador aceptó feliz sin notar que seguía un 25% por encima del mercado.»',
              en: '"The seller opened with an absurdly high asking price and then dropped 15%; the buyer happily accepted without noticing it was still 25% above market."'
            }
          ]
        },
        {
          id: 'framing',
          name: { es: 'Efecto Marco (Framing)', en: 'Framing Effect' },
          formula: '«90% de éxito» vs «10% de fallo» ⇒ Decisiones opuestas ante el mismo dato',
          def: {
            es: 'Cambiar radicalmente nuestra decisión ante una misma realidad estadística según se exprese como ganancia o como pérdida.',
            en: 'Changing our decision on the exact same statistical fact depending on whether it is phrased as a gain or a loss.'
          },
          counter: {
            es: 'Invierte siempre el enunciado antes de decidir: convierte mentalmente el porcentaje de éxito en porcentaje de fallo y viceversa.',
            en: 'Always invert the phrasing before deciding: translate the survival/success rate into the failure rate and vice versa.'
          },
          cases: [
            {
              ctx: { es: 'Comunicación médica', en: 'Medical communication' },
              es: '«Los pacientes rechazan la cirugía cuando se les dice que hay un 8% de complicación, pero la aceptan con entusiasmo cuando se les dice que el 92% sale sin complicaciones.»',
              en: '"Patients refuse the procedure when told there is an 8% complication rate, yet eagerly accept it when told 92% have zero complications."'
            },
            {
              ctx: { es: 'Etiquetado de alimentos', en: 'Food labeling' },
              es: '«El público califica como mucho más saludable la carne etiquetada como "85% libre de grasa" que el mismo paquete etiquetado como "contiene 15% de grasa".»',
              en: '"Shoppers rate meat labeled \'85% fat-free\' as much healthier than the exact same package labeled \'15% fat\'."'
            }
          ]
        }
      ]
    },
    {
      id: 'perception-biases',
      title: { es: 'Sesgos de Percepción y Memoria', en: 'Perception & Memory Biases' },
      sub: {
        es: 'Cómo filtramos datos invisibles, probabilidades base y nuestra propia habilidad.',
        en: 'How we misread invisible data, base rates and our own competence.'
      },
      items: [
        {
          id: 'survivorship',
          name: { es: 'Sesgo de Supervivencia', en: 'Survivorship Bias' },
          formula: 'Mirar solo a los que llegaron a la meta e ignorar a los que cayeron',
          def: {
            es: 'Extraer conclusiones estudiando únicamente los casos exitosos o visibles que superaron un filtro, olvidando a la mayoría silenciosa que fracasó haciendo lo mismo.',
            en: 'Drawing conclusions by studying only the visible winners that passed a filter, while overlooking the silent majority that failed doing the same thing.'
          },
          counter: {
            es: 'Pregunta siempre por el denominador invisible: «¿Cuántos aplicaron esa misma estrategia y quebraron sin escribir un libro?»',
            en: 'Always ask for the invisible denominator: "How many followed that exact same strategy and went broke without writing a book?"'
          },
          cases: [
            {
              ctx: { es: 'Emprendimiento', en: 'Entrepreneurship' },
              es: '«Tres multimillonarios famosos abandonaron la universidad a los 19 años; por lo tanto, dejar los estudios es la clave para fundar una gran empresa.»',
              en: '"Three famous billionaires dropped out of college at 19; therefore dropping out is the secret to building a billion-dollar company."'
            },
            {
              ctx: { es: 'Ingeniería histórica (Wald)', en: 'Historical engineering (Wald)' },
              es: '«Los aviones que regresan de combate tienen impactos en las alas y ninguno en el motor; blindemos solo las alas.» (Ignorando que los golpeados en el motor no regresaron).',
              en: '"Planes returning from battle have bullet holes on the wings and none on the engine, so let’s armor only the wings." (Ignoring that planes hit in the engine never returned).'
            }
          ]
        },
        {
          id: 'confirmation',
          name: { es: 'Sesgo de Confirmación', en: 'Confirmation Bias' },
          formula: 'Buscar y recordar solo lo que apoya mi creencia previa',
          def: {
            es: 'Buscar activamente datos que respalden lo que ya creemos, exigir pruebas imposibles a lo que nos contradice y olvidar los desaciertos.',
            en: 'Actively seeking evidence that supports our preexisting beliefs while discounting or forgetting disconfirming data.'
          },
          counter: {
            es: 'Intenta refutar tu propia hipótesis (falsación): «¿Qué evidencia concreta me haría cambiar de opinión hoy?»',
            en: 'Try to falsify your own hypothesis: "What specific evidence would make me change my mind today?"'
          },
          cases: [
            {
              ctx: { es: 'Investigación en internet', en: 'Online research' },
              es: '«Para saber si el café es malo, busqué en el navegador "¿Por qué el café daña el corazón?" y leí solo los tres blogs que decían que sí.»',
              en: '"To check whether coffee is harmful, I searched \'Why does coffee damage the heart?\' and read only the three blogs that agreed."'
            },
            {
              ctx: { es: 'Superstición de luna llena', en: 'Full-moon belief' },
              es: '«El enfermero recuerda vívidamente cada noche caótica en urgencias en la que había luna llena, pero olvida todas las noches tranquilas con luna llena.»',
              en: '"The ER nurse vividly remembers every chaotic night that happened on a full moon, while forgetting all the quiet full-moon nights."'
            }
          ]
        },
        {
          id: 'base-rate',
          name: { es: 'Falacia de la Tasa Base', en: 'Base Rate Neglect' },
          formula: 'Ignorar la probabilidad previa P(A) y mirar solo el caso aislado',
          def: {
            es: 'Juzgar la probabilidad de un evento fijándose solo en una descripción llamativa o en la precisión de un test, ignorando cuán frecuente o raro es en la población general.',
            en: 'Judging the probability of an event from a vivid description or test accuracy while ignoring how rare or common the category is overall.'
          },
          counter: {
            es: 'Antes de evaluar el detalle, pregunta cuál es la proporción base en la población (Teorema de Bayes).',
            en: 'Before weighing the specific clue, check the prior proportion in the population (Bayes’ rule).'
          },
          cases: [
            {
              ctx: { es: 'Perfiles de personalidad', en: 'Personality profiles' },
              es: '«En una ciudad donde hay 10.000 contadores y solo 5 bibliotecarios, Bruno es tímido y ama ordenar libros; la gente asume que es mucho más probable que sea bibliotecario que contador.»',
              en: '"In a city with 10,000 accountants and only 5 librarians, Bruno is shy and loves sorting books; people assume he is much more likely to be a librarian than an accountant."'
            },
            {
              ctx: { es: 'Cribado estadístico', en: 'Statistical screening' },
              es: '«Una condición afecta a 1 de cada 100.000 personas y el detector tiene un 5% de falsos positivos; al dar positivo, se asume que hay un 95% de certeza de tenerla.»',
              en: '"A condition affects 1 in 100,000 people and a detector has a 5% false-positive rate; when it rings, people assume a 95% chance the person has it."'
            }
          ]
        },
        {
          id: 'dunning-kruger',
          name: { es: 'Efecto Dunning-Kruger', en: 'Dunning-Kruger Effect' },
          formula: 'Mínimo conocimiento ⇒ Máxima confianza inicial («Monte de la ignorancia»)',
          def: {
            es: 'Cuando alguien sabe muy poco sobre una materia compleja, carece precisamente de los conocimientos necesarios para notar sus propios errores y cree dominarla por completo.',
            en: 'When someone knows very little about a complex field, they lack the meta-knowledge needed to recognize their own mistakes and overestimate their mastery.'
          },
          counter: {
            es: 'Pon a prueba la comprensión explicando el mecanismo desde cero o resolviendo un problema sin guía.',
            en: 'Test real depth by explaining the mechanism from first principles or solving an unguided problem.'
          },
          cases: [
            {
              ctx: { es: 'Aprendizaje de disciplinas', en: 'Skill acquisition' },
              es: '«Vi dos videos de diez minutos sobre derecho internacional ayer y ya entiendo todo mejor que los jueces que llevan treinta años estudiando tratados.»',
              en: '"I watched two ten-minute videos on international law yesterday and already understand it better than judges who have studied treaties for thirty years."'
            },
            {
              ctx: { es: 'Ajedrez amateur', en: 'Amateur chess' },
              es: '«Aprendí cómo se mueven las piezas esta tarde; el ajedrez es facilísimo y seguro le gano al campeón del club local.»',
              en: '"I learned how the pieces move this afternoon; chess is super easy and I can surely beat the local club champion."'
            }
          ]
        }
      ]
    }
  ];

  const ALL_ITEMS = FAMILIES.flatMap((f) => f.items);
  const TEST_LEN = 10;

  const state = {
    famIdx: 0,
    mode: saved.get('mode', 'study'),
    scope: saved.get('scope', 'group'),
    bests: saved.get('bests', {}),
    right: 0,
    total: 0,
    streak: 0,
    t0: 0,
    frozen: null,
    answered: false,
    currentCase: null
  };

  function currentFamily() {
    return FAMILIES[state.famIdx] || FAMILIES[0];
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

    document.querySelectorAll('#modeSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.modes[v];
      b.setAttribute('aria-pressed', String(v === state.mode));
    });
    $('modeHint').textContent = L.modeHints[state.mode] || '';

    document.querySelectorAll('#scopeSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.scopes[v];
      b.setAttribute('aria-pressed', String(v === state.scope));
    });

    renderRail();
    renderBest();
  }

  function renderRail() {
    const box = $('railList');
    box.innerHTML = '';
    let nextMarked = false;
    FAMILIES.forEach((f, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', String(idx === state.famIdx));
      const best = state.bests[f.id];
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
      btn.innerHTML = `<span><i>${idx + 1}</i>${f.title[LANG]}</span><em class="${tagClass}">${tagText}</em>`;
      btn.addEventListener('click', () => {
        state.famIdx = idx;
        resetSession();
        renderAll();
      });
      box.appendChild(btn);
    });
  }

  function renderBest() {
    const f = currentFamily();
    const best = state.bests[f.id];
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

  // ---------------- MODO ESTUDIAR ----------------
  function renderStudy() {
    const f = currentFamily();
    const L = t();
    $('felt').classList.add('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    setPrompt({
      eyebrow: `${f.title[LANG]} · ${L.modes.study}`,
      name: f.title[LANG],
      meta: f.sub[LANG],
      bar: null,
      status: null
    });

    const cardsHtml = f.items
      .map((item) => {
        const c = item.cases[0];
        return `
        <article class="fallacy-card">
          <div class="fallacy-head">
            <h4>${item.name[LANG]}</h4>
            <span class="fallacy-formula">${item.formula}</span>
          </div>
          <p class="fallacy-def">${item.def[LANG]}</p>
          <blockquote class="fallacy-quote">${c[LANG]}</blockquote>
          <p class="fallacy-counter"><b>${L.antidoteLabel}</b> ${item.counter[LANG]}</p>
        </article>`;
      })
      .join('');

    $('felt').innerHTML = `<div class="fallacy-wrap">${cardsHtml}</div>`;

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
    const f = currentFamily();
    const L = t();
    $('felt').classList.remove('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    if (state.mode === 'test' && state.total >= TEST_LEN) {
      finishTest();
      return;
    }

    state.answered = false;
    const poolItems = state.scope === 'all' ? ALL_ITEMS : f.items;
    const targetItem = pick(f.items);
    const chosenCase = pick(targetItem.cases);

    let options = [targetItem];
    if (state.scope === 'group') {
      options = shuffle(f.items);
    } else {
      const others = shuffle(poolItems.filter((x) => x.id !== targetItem.id)).slice(0, 3);
      options = shuffle([targetItem, ...others]);
    }

    state.currentCase = { targetItem, chosenCase, options };

    setPrompt({
      eyebrow: `${f.title[LANG]} · ${L.modes[state.mode]}`,
      name: L.promptQuestion,
      meta: state.mode === 'test' ? `${state.total + 1} / ${TEST_LEN} · ${f.sub[LANG]}` : f.sub[LANG],
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: null
    });

    $('felt').innerHTML = `
      <div class="fallacy-wrap">
        <div class="case-box">
          <div class="case-context">${chosenCase.ctx[LANG]}</div>
          <p class="case-text">${chosenCase[LANG]}</p>
        </div>
        <div id="caseFeedback"></div>
      </div>
    `;

    const act = $('actions');
    act.innerHTML = '';
    options.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'act';
      b.innerHTML = `${opt.name[LANG]} <kbd>${idx + 1}</kbd>`;
      b.addEventListener('click', () => submitChoice(opt, b));
      act.appendChild(b);
    });
  }

  function submitChoice(chosenOpt, clickedBtn) {
    if (state.answered) return;
    state.answered = true;
    const { targetItem, options } = state.currentCase;
    const isRight = chosenOpt.id === targetItem.id;
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
      eyebrow: isRight ? L.correctExcl : L.wrongExcl(targetItem.name[LANG]),
      name: targetItem.name[LANG],
      meta: targetItem.formula,
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: isRight ? 'ok' : 'bad'
    });

    $('caseFeedback').innerHTML = `
      <div class="analysis-box ${isRight ? '' : 'is-bad'}">
        <div><b>${targetItem.name[LANG]}:</b> ${targetItem.def[LANG]}</div>
        <div><b>${L.antidoteLabel}</b> ${targetItem.counter[LANG]}</div>
      </div>
    `;

    document.querySelectorAll('#actions .act').forEach((b, idx) => {
      b.disabled = true;
      if (options[idx].id === targetItem.id) b.classList.add('is-right');
      else if (b === clickedBtn && !isRight) b.classList.add('is-wrong');
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
    const f = currentFamily();
    const pct = Math.round((100 * state.right) / TEST_LEN);
    const timeSec = Math.round(state.frozen);
    const passed = pct >= 90;

    const prev = state.bests[f.id];
    if (!prev || pct > prev.pct || (pct === prev.pct && timeSec < prev.time)) {
      state.bests[f.id] = { pct, time: timeSec };
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
      <div class="fallacy-wrap">
        <div class="case-box" style="text-align:center">
          <div class="case-context">${f.title[LANG]}</div>
          <p class="case-text">${pct}% (${state.right}/${TEST_LEN}) · ${fmtClock(timeSec)}</p>
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

  document.querySelectorAll('#scopeSeg button').forEach((b) => {
    b.addEventListener('click', () => {
      state.scope = b.getAttribute('data-v');
      saved.set('scope', state.scope);
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
