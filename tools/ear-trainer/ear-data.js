// Generated dataset — 48 musical intervals, chords, progressions & staff-reading items
window.EAR_DATA = {
  "CATEGORIES": [
    {
      "id": "intervals",
      "es": "Intervalos (Oído)",
      "en": "Intervals (Ear)",
      "era": "12 intervalos"
    },
    {
      "id": "chords",
      "es": "Acordes y Tríadas",
      "en": "Chords & Triads",
      "era": "12 acordes"
    },
    {
      "id": "progressions-modes",
      "es": "Progresiones y Escalas",
      "en": "Progressions & Scales",
      "era": "12 patrones"
    },
    {
      "id": "staff-notes",
      "es": "Partitura: Clave de Sol y Fa",
      "en": "Staff Reading: Treble & Bass",
      "era": "12 notas"
    }
  ],
  "LOOKALIKES": [
    ["m2", "M2", "m3", "M3"],
    ["P4", "TT", "P5", "P8"],
    ["m6", "M6", "m7", "M7"],
    ["maj-triad", "min-triad", "dim-triad", "aug-triad"],
    ["sus2-chord", "sus4-chord", "add9-chord"],
    ["dom7-chord", "maj7-chord", "min7-chord", "m7b5-chord", "dim7-chord"],
    ["prog-authentic", "prog-plagal", "prog-deceptive", "prog-jazz-251"],
    ["prog-pop-axis", "prog-blues-145", "prog-andalusian"],
    ["scale-major", "scale-natural-minor", "scale-harmonic-minor", "scale-dorian", "scale-pentatonic"],
    ["treble-c4", "treble-e4", "treble-g4", "treble-a4", "treble-c5", "treble-f5"],
    ["bass-c4", "bass-a3", "bass-f3", "bass-d3", "bass-c3", "bass-g2"]
  ],
  "MODELS": [
    {
      "id": "m2",
      "name": { "es": "2ª Menor (Semitono)", "en": "Minor 2nd (Half Step)" },
      "shortCode": "m2",
      "caseToken": "m2",
      "category": "intervals",
      "semitones": [60, 61],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 1, "acc": "flat", "col": 1 }],
      "formula": "1 semitono (0.5 tonos)",
      "songCue": { "es": "Tema principal de Tiburón (Jaws) · semitono tenso", "en": "Jaws theme · tense half-step crunch" },
      "pop": true,
      "aka": ["2a menor", "segunda menor", "minor 2nd", "minor second", "semitono", "half step"],
      "wiki": "Minor_second",
      "fact": {
        "es": "La distancia mínima del sistema temperado (1 semitono, como Mi–Fa o Do–Re♭). Produce máxima fricción armónica al tocarse simultáneamente.",
        "en": "Smallest interval in 12-tone equal temperament (1 semitone, e.g. C–Db). Creates sharp tension harmonically and urgency melodically."
      }
    },
    {
      "id": "M2",
      "name": { "es": "2ª Mayor (Tono entero)", "en": "Major 2nd (Whole Step)" },
      "shortCode": "M2",
      "caseToken": "M2",
      "category": "intervals",
      "semitones": [60, 62],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 1, "col": 1 }],
      "formula": "2 semitonos (1 tono)",
      "songCue": { "es": "Inicio de 'Cumpleaños Feliz' o 'Frère Jacques'", "en": "Opening of 'Happy Birthday' or 'Frère Jacques'" },
      "pop": true,
      "aka": ["2a mayor", "segunda mayor", "major 2nd", "major second", "tono", "whole step"],
      "wiki": "Major_second",
      "fact": {
        "es": "Equivale a 2 semitonos (ej. Do–Re): el paso diatónico natural entre la tónica y el segundo grado de la escala mayor.",
        "en": "Span of 2 semitones (e.g. C–D): the smooth stepwise motion between the first two degrees of the major scale."
      }
    },
    {
      "id": "m3",
      "name": { "es": "3ª Menor", "en": "Minor 3rd" },
      "shortCode": "m3",
      "caseToken": "m3",
      "category": "intervals",
      "semitones": [60, 63],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 1 }],
      "formula": "3 semitonos (1.5 tonos)",
      "songCue": { "es": "'Smoke on the Water' · 'Greensleeves' · modo oscuro/introspectivo", "en": "'Smoke on the Water' · 'Greensleeves' · dark/minor color" },
      "pop": true,
      "aka": ["3a menor", "tercera menor", "minor 3rd", "minor third"],
      "wiki": "Minor_third",
      "fact": {
        "es": "Define el carácter menor de un acorde (ej. Do–Mi♭). Su contraste con la 3ª mayor es el cimiento del entrenamiento auditivo.",
        "en": "Defines minor chord quality (e.g. C–Eb, 3 semitones). Telling minor from major thirds is the core milestone of ear training."
      }
    },
    {
      "id": "M3",
      "name": { "es": "3ª Mayor", "en": "Major 3rd" },
      "shortCode": "M3",
      "caseToken": "M3",
      "category": "intervals",
      "semitones": [60, 64],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 1 }],
      "formula": "4 semitonos (2 tonos)",
      "songCue": { "es": "'Oh When the Saints' · 'Las Cuatro Estaciones (Primavera)'", "en": "'Oh When the Saints' · Vivaldi 'Spring'" },
      "pop": true,
      "aka": ["3a mayor", "tercera mayor", "major 3rd", "major third"],
      "wiki": "Major_third",
      "fact": {
        "es": "Luminosa y estable (ej. Do–Mi, 4 semitonos); determina junto a la 5ª justa la sonoridad abierta de la tríada mayor.",
        "en": "Bright and consonant (4 semitones, e.g. C–E); gives major chords and keys their open, sunny harmonic identity."
      }
    },
    {
      "id": "P4",
      "name": { "es": "4ª Justa", "en": "Perfect 4th" },
      "shortCode": "P4",
      "category": "intervals",
      "semitones": [60, 65],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 3, "col": 1 }],
      "formula": "5 semitonos (2.5 tonos)",
      "songCue": { "es": "Marcha Nupcial ('Here Comes the Bride') / Himno de Harry Potter", "en": "'Here Comes the Bride' / 'Amazing Grace'" },
      "pop": true,
      "aka": ["4a justa", "cuarta justa", "perfect 4th", "perfect fourth", "4j"],
      "wiki": "Perfect_fourth",
      "fact": {
        "es": "Intervalo de 5 semitonos (Do–Fa), inversión exacta de la 5ª justa. Es el salto característico de las marchas solemnes y las cuerdas estándar del bajo/guitarra.",
        "en": "5-semitone interval (e.g. C–F), inversion of the perfect 5th and standard tuning distance between adjacent guitar and bass strings."
      }
    },
    {
      "id": "TT",
      "name": { "es": "Tritono (4ª Aum / 5ª Dism)", "en": "Tritone (Aug 4th / Dim 5th)" },
      "shortCode": "TT",
      "category": "intervals",
      "semitones": [60, 66],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 3, "acc": "sharp", "col": 1 }],
      "formula": "6 semitonos (3 tonos · divide octava en 2)",
      "songCue": { "es": "Intro de 'Los Simpson' / 'Maria' (West Side Story)", "en": "'The Simpsons' theme / 'Maria' (West Side Story)" },
      "pop": true,
      "aka": ["tritono", "tritone", "4a aumentada", "5a disminuida", "augmented 4th", "diminished 5th", "diabolus in musica"],
      "wiki": "Tritone",
      "fact": {
        "es": "Parte la octava exactamente por la mitad (6 semitonos, Do–Fa♯). Su inestabilidad impulsa las resoluciones de dominante V7 -> I.",
        "en": "Divides the 12-semitone octave symmetrically in half (6 semitones); its tension drives dominant V7 chord resolutions."
      }
    },
    {
      "id": "P5",
      "name": { "es": "5ª Justa", "en": "Perfect 5th" },
      "shortCode": "P5",
      "category": "intervals",
      "semitones": [60, 67],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 4, "col": 1 }],
      "formula": "7 semitonos (3.5 tonos · razón 3:2)",
      "songCue": { "es": "Fanfarria de 'Star Wars' · 'Estrellita dónde estás'", "en": "'Star Wars' main theme · 'Twinkle Twinkle Little Star'" },
      "pop": true,
      "aka": ["5a justa", "quinta justa", "perfect 5th", "perfect fifth", "5j", "power chord"],
      "wiki": "Perfect_fifth",
      "fact": {
        "es": "La consonancia más sólida tras la octava (Do–Sol, razón acústica 3:2). Base de los 'power chords' en rock y del círculo de quintas.",
        "en": "Strongest consonance after the octave (ratio 3:2, e.g. C–G); powers rock power chords and the Circle of Fifths."
      }
    },
    {
      "id": "m6",
      "name": { "es": "6ª Menor", "en": "Minor 6th" },
      "shortCode": "m6",
      "caseToken": "m6",
      "category": "intervals",
      "semitones": [60, 68],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 5, "acc": "flat", "col": 1 }],
      "formula": "8 semitonos (4 tonos)",
      "songCue": { "es": "'The Entertainer' (salto tras anacrusa) / 'Love Story'", "en": "'The Entertainer' / 'In My Life' (Beatles)" },
      "pop": false,
      "aka": ["6a menor", "sexta menor", "minor 6th", "minor sixth"],
      "wiki": "Minor_sixth",
      "fact": {
        "es": "Salto ancho melancólico de 8 semitonos (Do–La♭), equivalente armónico a una tríada menor en primera inversión.",
        "en": "Expressive bittersweet 8-semitone leap (C–Ab), inversion of the major 3rd."
      }
    },
    {
      "id": "M6",
      "name": { "es": "6ª Mayor", "en": "Major 6th" },
      "shortCode": "M6",
      "caseToken": "M6",
      "category": "intervals",
      "semitones": [60, 69],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 5, "col": 1 }],
      "formula": "9 semitonos (4.5 tonos)",
      "songCue": { "es": "'My Bonnie Lies Over the Ocean' · tono clásico NBC", "en": "'My Bonnie Lies Over the Ocean' · NBC chime" },
      "pop": true,
      "aka": ["6a mayor", "sexta mayor", "major 6th", "major sixth"],
      "wiki": "Major_sixth",
      "fact": {
        "es": "Salto abierto y nostálgico de 9 semitonos (Do–La), inversión de la 3ª menor y sello lírico de baladas románticas.",
        "en": "Warm, soaring 9-semitone interval (C–A), inversion of the minor 3rd."
      }
    },
    {
      "id": "m7",
      "name": { "es": "7ª Menor", "en": "Minor 7th" },
      "shortCode": "m7",
      "caseToken": "m7",
      "category": "intervals",
      "semitones": [60, 70],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 6, "acc": "flat", "col": 1 }],
      "formula": "10 semitonos (5 tonos)",
      "songCue": { "es": "Tema original de 'Star Trek' · 'Somewhere' (West Side Story)", "en": "Original 'Star Trek' theme · 'The Winner Takes It All'" },
      "pop": false,
      "aka": ["7a menor", "septima menor", "minor 7th", "minor seventh", "b7"],
      "wiki": "Minor_seventh",
      "fact": {
        "es": "Intervalo blusero/jazzero de 10 semitonos (Do–Si♭), un tono completo por debajo de la octava superior.",
        "en": "Bluesy, soulful 10-semitone interval (C–Bb), sitting one whole step below the octave."
      }
    },
    {
      "id": "M7",
      "name": { "es": "7ª Mayor", "en": "Major 7th" },
      "shortCode": "M7",
      "caseToken": "M7",
      "category": "intervals",
      "semitones": [60, 71],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 6, "col": 1 }],
      "formula": "11 semitonos (5.5 tonos)",
      "songCue": { "es": "'Take On Me' (A-ha, en puente ascendente) · 'Pure Imagination'", "en": "'Take On Me' chorus · 'Pure Imagination'" },
      "pop": false,
      "aka": ["7a mayor", "septima mayor", "major 7th", "major seventh", "maj7 interval"],
      "wiki": "Major_seventh",
      "fact": {
        "es": "Salto amplio de 11 semitonos (Do–Si) a un semitono de la octava: genera un brillo moderno, onírico y cinematográfico.",
        "en": "Wide 11-semitone leap (C–B) stopping one half-step shy of the octave—dreamy and wistful."
      }
    },
    {
      "id": "P8",
      "name": { "es": "8ª Justa (Octava)", "en": "Perfect Octave" },
      "shortCode": "P8",
      "category": "intervals",
      "semitones": [60, 72],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 7, "col": 1 }],
      "formula": "12 semitonos (frecuencia 2:1)",
      "songCue": { "es": "'Somewhere Over the Rainbow' (compás 1: 'Some-where')", "en": "'Somewhere Over the Rainbow' ('Some-where')" },
      "pop": true,
      "aka": ["8a justa", "octava", "octave", "perfect octave", "8va"],
      "wiki": "Octave",
      "fact": {
        "es": "Duplica exactamente la frecuencia (ej. Do4 261.6 Hz -> Do5 523.3 Hz), percibiéndose como la 'misma' nota más aguda.",
        "en": "Exact 2:1 frequency ratio (12 semitones); the ear perceives both pitches as identical note classes an octave apart."
      }
    },

    {
      "id": "maj-triad",
      "name": { "es": "Tríada Mayor", "en": "Major Triad" },
      "shortCode": "Maj",
      "category": "chords",
      "semitones": [60, 64, 67],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 0 }, { "step": 4, "col": 0 }],
      "formula": "1 – 3 – 5 (3M + 3m)",
      "songCue": { "es": "Sonoridad luminosa, estable y resuelta", "en": "Bright, stable, resolved triad" },
      "pop": true,
      "aka": ["triada mayor", "acorde mayor", "major triad", "major chord"],
      "wiki": "Major_chord",
      "fact": {
        "es": "Superpone una 3ª mayor abajo (Do–Mi) y una 3ª menor arriba (Mi–Sol), reflejando los primeros armónicos naturales.",
        "en": "Stacks a major 3rd below a minor 3rd (1–3–5, e.g. C–E–G), echoing the natural overtone series."
      }
    },
    {
      "id": "min-triad",
      "name": { "es": "Tríada Menor", "en": "Minor Triad" },
      "shortCode": "min",
      "category": "chords",
      "semitones": [60, 63, 67],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 0 }, { "step": 4, "col": 0 }],
      "formula": "1 – ♭3 – 5 (3m + 3M)",
      "songCue": { "es": "Sonoridad melancólica, seria o emotiva", "en": "Melancholic, somber, darker triad" },
      "pop": true,
      "aka": ["triada menor", "acorde menor", "minor triad", "minor chord"],
      "wiki": "Minor_chord",
      "fact": {
        "es": "Invierte las dos terceras respecto al mayor: 3ª menor abajo (Do–Mi♭) y 3ª mayor arriba (Mi♭–Sol), conservando la 5ª justa.",
        "en": "Flips the thirds (1–b3–5, e.g. C–Eb–G): minor 3rd at the bottom, major 3rd on top, anchoring a perfect 5th."
      }
    },
    {
      "id": "dim-triad",
      "name": { "es": "Tríada Disminuida", "en": "Diminished Triad" },
      "shortCode": "dim / °",
      "category": "chords",
      "semitones": [60, 63, 66],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 0 }, { "step": 4, "acc": "flat", "col": 0 }],
      "formula": "1 – ♭3 – ♭5 (3m + 3m)",
      "songCue": { "es": "Tensión de película muda / suspenso apretado", "en": "Silent-film suspense / tight tritonal crunch" },
      "pop": true,
      "aka": ["triada disminuida", "acorde disminuido", "diminished triad", "diminished chord", "dim"],
      "wiki": "Diminished_triad",
      "fact": {
        "es": "Apila dos 3ª menores (Do–Mi♭–Sol♭), generando un tritono entre fundamental y 5ª disminuida con fuerte impulso a resolver.",
        "en": "Stacks two minor thirds (1–b3–b5), framing a dissonant tritone between root and diminished fifth."
      }
    },
    {
      "id": "aug-triad",
      "name": { "es": "Tríada Aumentada", "en": "Augmented Triad" },
      "shortCode": "aug / +",
      "category": "chords",
      "semitones": [60, 64, 68],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 0 }, { "step": 4, "acc": "sharp", "col": 0 }],
      "formula": "1 – 3 – ♯5 (3M + 3M)",
      "songCue": { "es": "Ensueño espacial / simétrico sin centro tonal", "en": "Dreamlike, floating symmetric harmony" },
      "pop": true,
      "aka": ["triada aumentada", "acorde aumentado", "augmented triad", "augmented chord", "aug"],
      "wiki": "Augmented_triad",
      "fact": {
        "es": "Apila dos 3ª mayores iguales (Do–Mi–Sol♯), dividiendo la octava en tres partes simétricas: cualquier inversión suena igual.",
        "en": "Stacks two major thirds (1–3–#5), partitioning the octave into three equal intervals."
      }
    },
    {
      "id": "sus2-chord",
      "name": { "es": "Acorde Sus2 (Suspendido 2ª)", "en": "Suspended 2nd (sus2)" },
      "shortCode": "sus2",
      "category": "chords",
      "semitones": [60, 62, 67],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 1, "col": 0 }, { "step": 4, "col": 0 }],
      "formula": "1 – 2 – 5 (sin tercera)",
      "songCue": { "es": "Abierto, aéreo y ambiguo (ni mayor ni menor)", "en": "Open, airy, modern pop/folk ambiguity" },
      "pop": false,
      "aka": ["sus2", "acorde sus2", "suspendido 2", "suspended 2nd"],
      "wiki": "Suspended_chord",
      "fact": {
        "es": "Omite la 3ª (neutralizando mayor/menor) y la sustituye por la 2ª mayor (Do–Re–Sol), muy popular en guitarra pop y folk.",
        "en": "Replaces the 3rd with a major 2nd (1–2–5), removing major/minor coloration for an open ringing sound."
      }
    },
    {
      "id": "sus4-chord",
      "name": { "es": "Acorde Sus4 (Suspendido 4ª)", "en": "Suspended 4th (sus4)" },
      "shortCode": "sus4",
      "category": "chords",
      "semitones": [60, 65, 67],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 3, "col": 0 }, { "step": 4, "col": 0 }],
      "formula": "1 – 4 – 5 (tensión que pide bajar a 3)",
      "songCue": { "es": "'Pinball Wizard' (The Who) · 'A Hard Day's Night'", "en": "'Pinball Wizard' · classic 4->3 resolution pull" },
      "pop": true,
      "aka": ["sus4", "acorde sus4", "suspendido 4", "suspended 4th"],
      "wiki": "Suspended_chord",
      "fact": {
        "es": "Sustituye la 3ª por la 4ª justa (Do–Fa–Sol), creando expectativa contrapuntística clásica para descender a la 3ª mayor.",
        "en": "Suspends the 4th (1–4–5) against the 5th, creating a classic expectation to resolve down onto the major 3rd."
      }
    },
    {
      "id": "dom7-chord",
      "name": { "es": "Séptima de Dominante (7)", "en": "Dominant 7th (7)" },
      "shortCode": "V7",
      "category": "chords",
      "semitones": [60, 64, 67, 70],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 0 }, { "step": 4, "col": 0 }, { "step": 6, "acc": "flat", "col": 0 }],
      "formula": "1 – 3 – 5 – ♭7 (tríada M + 7ª menor)",
      "songCue": { "es": "Alma del Blues, Rock 'n' Roll y cadencia V7 -> I", "en": "Signature Blues / Jazz turnaround dominant push" },
      "pop": true,
      "aka": ["dom7", "dominante", "septima de dominante", "dominant 7th", "acorde 7"],
      "wiki": "Dominant_seventh_chord",
      "fact": {
        "es": "Combina tríada mayor estable con 7ª menor: el tritono interno entre 3ª y ♭7 (Mi–Si♭) exige resolver hacia el acorde de tónica.",
        "en": "Major triad plus a minor 7th (1–3–5–b7); the tritone between 3rd and b7 powers blues harmony and V7->I cadences."
      }
    },
    {
      "id": "maj7-chord",
      "name": { "es": "Séptima Mayor (maj7)", "en": "Major 7th (maj7)" },
      "shortCode": "Maj7",
      "category": "chords",
      "semitones": [60, 64, 67, 71],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 0 }, { "step": 4, "col": 0 }, { "step": 6, "col": 0 }],
      "formula": "1 – 3 – 5 – 7 (tríada M + 7ª mayor)",
      "songCue": { "es": "Bossa nova ('Garota de Ipanema'), lo-fi y jazz suave", "en": "Bossa nova / lush nostalgic jazz-pop color" },
      "pop": true,
      "aka": ["maj7", "septima mayor acorde", "major 7th chord", "major seventh chord"],
      "wiki": "Major_seventh_chord",
      "fact": {
        "es": "Tríada mayor con 7ª mayor (Do–Mi–Sol–Si): elegante, cálido y sofisticado; estándar del jazz, R&B y bossa nova.",
        "en": "Major triad topped with a major 7th (1–3–5–7); velvety and contemplative, quintessential in bossa nova and jazz."
      }
    },
    {
      "id": "min7-chord",
      "name": { "es": "Séptima Menor (m7)", "en": "Minor 7th (m7)" },
      "shortCode": "min7",
      "category": "chords",
      "semitones": [60, 63, 67, 70],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 0 }, { "step": 4, "col": 0 }, { "step": 6, "acc": "flat", "col": 0 }],
      "formula": "1 – ♭3 – 5 – ♭7",
      "songCue": { "es": "Neo-soul, funk suave y grado ii7 en jazz", "en": "Smooth funk, neo-soul & jazz ii7 chord" },
      "pop": true,
      "aka": ["m7", "min7", "menor 7", "minor 7th chord", "septima menor acorde"],
      "wiki": "Minor_seventh_chord",
      "fact": {
        "es": "Tríada menor con 7ª menor (Do–Mi♭–Sol–Si♭): suaviza la dureza de la tríada menor y fluye naturalmente hacia V7.",
        "en": "Minor triad plus minor 7th (1–b3–5–b7); mellows the minor triad and acts as the classic ii7 pre-dominant in jazz."
      }
    },
    {
      "id": "m7b5-chord",
      "name": { "es": "Semidisminuido (m7♭5 / ø7)", "en": "Half-Diminished 7th (m7b5)" },
      "shortCode": "m7♭5",
      "category": "chords",
      "semitones": [60, 63, 66, 70],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 0 }, { "step": 4, "acc": "flat", "col": 0 }, { "step": 6, "acc": "flat", "col": 0 }],
      "formula": "1 – ♭3 – ♭5 – ♭7 (ø7)",
      "songCue": { "es": "'Autumn Leaves' (iiø7 menor) · acorde de Tristán", "en": "'Autumn Leaves' (minor ii chord) · jazz longing" },
      "pop": false,
      "aka": ["m7b5", "semidisminuido", "half diminished", "half-diminished"],
      "wiki": "Half-diminished_seventh_chord",
      "fact": {
        "es": "Tríada disminuida más 7ª menor (Do–Mi♭–Sol♭–Si♭). Es el viiø7 natural del modo mayor y el iiø7 clave en progresiones menores ii–V–i.",
        "en": "Diminished triad with a minor 7th (1–b3–b5–b7); serves as ii7 in minor-key ii–V–i turnarounds."
      }
    },
    {
      "id": "dim7-chord",
      "name": { "es": "Séptima Disminuida (dim7 / °7)", "en": "Fully Diminished 7th (dim7)" },
      "shortCode": "dim7",
      "category": "chords",
      "semitones": [60, 63, 66, 69],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 0 }, { "step": 4, "acc": "flat", "col": 0 }, { "step": 6, "acc": "flat", "col": 0 }],
      "formula": "1 – ♭3 – ♭5 – ♭♭7 (simétrico 3m×3)",
      "songCue": { "es": "Doble tritono simétrico · paso cromático barroco/jazz", "en": "Double tritone symmetry · Baroque & tango tension" },
      "pop": false,
      "aka": ["dim7", "disminuido 7", "fully diminished", "septima disminuida"],
      "wiki": "Diminished_seventh_chord",
      "fact": {
        "es": "Apila tres 3ª menores creando dos tritonos cruzados: solo existen 3 acuerdos dim7 distintos en toda la música occidental por su simetría.",
        "en": "Stacks three minor 3rds enclosing two tritones; symmetric every 3 semitones so only three unique pitch collections exist."
      }
    },
    {
      "id": "add9-chord",
      "name": { "es": "Mayor add9", "en": "Major add9" },
      "shortCode": "add9",
      "category": "chords",
      "semitones": [60, 64, 67, 74],
      "playMode": "harmonic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 0 }, { "step": 4, "col": 0 }, { "step": 8, "col": 0 }],
      "formula": "1 – 3 – 5 – 9 (sin 7ª)",
      "songCue": { "es": "'Every Breath You Take' · brillo cristalino sin 7ª", "en": "'Every Breath You Take' · shimmering 9th sparkle" },
      "pop": false,
      "aka": ["add9", "mayor add9", "major add9"],
      "wiki": "Ninth_chord",
      "fact": {
        "es": "Conserva la 3ª mayor (a diferencia de sus2) y añade la 9ª arriba (Do–Mi–Sol–Re5) sin séptima: luminoso, moderno y expansivo.",
        "en": "Keeps the major 3rd while adding the 9th above (1–3–5–9) without a 7th—crystalline pop/ambient shimmer."
      }
    },

    {
      "id": "prog-authentic",
      "name": { "es": "Cadencia Auténtica (V – I)", "en": "Authentic Cadence (V – I)" },
      "shortCode": "V – I",
      "category": "progressions-modes",
      "semitones": [[67, 71, 74], [60, 64, 67]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 4, "col": 0 }, { "step": 6, "col": 0 }, { "step": 0, "col": 1 }, { "step": 2, "col": 1 }],
      "formula": "Dominante V -> Tónica I",
      "songCue": { "es": "El punto final definitivo de la armonía tonal clásica", "en": "Definitive tonal period (V -> I full stop)" },
      "pop": true,
      "aka": ["cadencia autentica", "authentic cadence", "cadencia perfecta", "v-i"],
      "wiki": "Cadence#Authentic_cadence",
      "fact": {
        "es": "La sensible (Si) asciende por semitono hacia la tónica (Do) mientras el bajo cae por 5ª justa (Sol -> Do): máxima sensación de cierre.",
        "en": "Leading tone (B->C) and descending root 5th (G->C) deliver the strongest sense of harmonic arrival in Western music."
      }
    },
    {
      "id": "prog-plagal",
      "name": { "es": "Cadencia Plagal (IV – I)", "en": "Plagal Cadence (IV – I)" },
      "shortCode": "IV – I",
      "category": "progressions-modes",
      "semitones": [[65, 69, 72], [60, 64, 67]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 3, "col": 0 }, { "step": 5, "col": 0 }, { "step": 0, "col": 1 }, { "step": 2, "col": 1 }],
      "formula": "Subdominante IV -> Tónica I",
      "songCue": { "es": "El clásico 'Amén' coral · cálido y sin tritono", "en": "Classic church 'Amen' cadence · warm & gentle" },
      "pop": true,
      "aka": ["cadencia plagal", "plagal cadence", "cadencia amen", "iv-i"],
      "wiki": "Cadence#Plagal_cadence",
      "fact": {
        "es": "Conocida como la 'cadencia del Amén': resuelve suavemente desde el IV grado (Fa) hacia I (Do) conservando la tónica en común.",
        "en": "Known as the 'Amen cadence': gently settles from IV (F) to I (C) sharing the tonic pitch without dominant tension."
      }
    },
    {
      "id": "prog-deceptive",
      "name": { "es": "Cadencia Rota / Evitada (V – vi)", "en": "Deceptive Cadence (V – vi)" },
      "shortCode": "V – vi",
      "category": "progressions-modes",
      "semitones": [[67, 71, 74], [69, 72, 76]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 4, "col": 0 }, { "step": 6, "col": 0 }, { "step": 5, "col": 1 }, { "step": 7, "col": 1 }],
      "formula": "Dominante V -> Relativo menor vi",
      "songCue": { "es": "Sorpresa emocional al esperar I y caer en menor vi", "en": "Harmonic plot twist swapping expected I for minor vi" },
      "pop": true,
      "aka": ["cadencia rota", "deceptive cadence", "cadencia evitada", "v-vi"],
      "wiki": "Cadence#Deceptive_cadence",
      "fact": {
        "es": "El oído espera llegar a I tras el V, pero el bajo sube de paso (Sol -> La) hacia el relativo menor vi, prolongando el discurso.",
        "en": "Sets up V->I resolution then steps up to the relative minor vi instead, extending the phrase with bittersweet surprise."
      }
    },
    {
      "id": "prog-pop-axis",
      "name": { "es": "Progresión Pop (I – V – vi – IV)", "en": "Pop Axis Progression (I–V–vi–IV)" },
      "shortCode": "I–V–vi–IV",
      "category": "progressions-modes",
      "semitones": [[60, 64, 67], [67, 71, 74], [69, 72, 76], [65, 69, 72]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 4, "col": 1 }, { "step": 5, "col": 2 }, { "step": 3, "col": 3 }],
      "formula": "Do – Sol – Lam – Fa (C–G–Am–F)",
      "songCue": { "es": "'Let It Be' · 'Don't Stop Believing' · 'No Woman No Cry'", "en": "'Let It Be' · 'Someone Like You' · hundreds of hits" },
      "pop": true,
      "aka": ["progresion pop", "four chords", "axis of awesome", "i-v-vi-iv"],
      "wiki": "I%E2%80%93V%E2%80%93vi%E2%80%93IV_progression",
      "fact": {
        "es": "La rueda de cuatro acordes más omnipresente del pop-rock moderno (C–G–Am–F), alternando reposo, empuje, melancolía y elevación.",
        "en": "Most ubiquitous 4-chord pop loop (C–G–Am–F), cycling smoothly through tonic stability, tension, minor pathos, and lift."
      }
    },
    {
      "id": "prog-jazz-251",
      "name": { "es": "Turnaround Jazz (ii – V – I)", "en": "Jazz ii – V – I Progression" },
      "shortCode": "ii–V–I",
      "category": "progressions-modes",
      "semitones": [[62, 65, 69, 72], [67, 71, 74, 77], [60, 64, 67, 71]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 1, "col": 0 }, { "step": 4, "col": 1 }, { "step": 0, "col": 2 }, { "step": 2, "col": 2 }],
      "formula": "Dm7 – G7 – Cmaj7",
      "songCue": { "es": "'Autumn Leaves' · 'Fly Me to the Moon' · columna del Jazz", "en": "Cornerstone cadence of nearly every Jazz standard" },
      "pop": true,
      "aka": ["ii-v-i", "2-5-1", "turnaround jazz", "jazz cadence"],
      "wiki": "Ii%E2%80%93V%E2%80%93I_progression",
      "fact": {
        "es": "Encadena movimiento descendente de fundamentales por 5ª justa (Re->Sol->Do) con voces guía que bajan por semitono hacia la tónica maj7.",
        "en": "Cycles down in fifths (Dm7->G7->Cmaj7) while guide tones (3rds/7ths) resolve smoothly downward by half step."
      }
    },
    {
      "id": "prog-blues-145",
      "name": { "es": "Estructura Blues (I7 – IV7 – V7)", "en": "12-Bar Blues Cadence (I–IV–V)" },
      "shortCode": "I7–IV7–V7",
      "category": "progressions-modes",
      "semitones": [[60, 64, 67, 70], [65, 69, 72, 75], [67, 71, 74, 77], [60, 64, 67, 70]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 3, "col": 1 }, { "step": 4, "col": 2 }, { "step": 0, "col": 3 }],
      "formula": "C7 – F7 – G7 – C7",
      "songCue": { "es": "Blues de 12 compases / Rock 'n' Roll clásico años 50", "en": "12-bar Blues & classic 1950s Rock 'n' Roll" },
      "pop": false,
      "aka": ["blues", "i-iv-v", "blues 12 compases", "12-bar blues"],
      "wiki": "Twelve-bar_blues",
      "fact": {
        "es": "Usa acordes de 7ª dominante en los tres pilares tonales (I7, IV7, V7), rompiendo la regla clásica para dar color blusero.",
        "en": "Builds all three primary chords (I, IV, V) as dominant 7th chords, creating unmistakable blues grit."
      }
    },
    {
      "id": "prog-andalusian",
      "name": { "es": "Cadencia Andaluza (iv – III – II – I)", "en": "Andalusian Cadence (iv–III–II–I)" },
      "shortCode": "Am–G–F–E",
      "category": "progressions-modes",
      "semitones": [[69, 72, 76], [67, 71, 74], [65, 69, 72], [64, 68, 71]],
      "playMode": "sequence",
      "clef": "treble",
      "notes": [{ "step": 5, "col": 0 }, { "step": 4, "col": 1 }, { "step": 3, "col": 2 }, { "step": 2, "col": 3 }],
      "formula": "Bajo descendente grado por grado (La–Sol–Fa–Mi)",
      "songCue": { "es": "Flamenco · 'Hit the Road Jack' · 'Sultans of Swing' final", "en": "Flamenco · 'Hit the Road Jack' · 'Stairway' walkdown" },
      "pop": true,
      "aka": ["cadencia andaluza", "andalusian cadence", "progresion flamenca", "am g f e"],
      "wiki": "Andalusian_cadence",
      "fact": {
        "es": "Descenso tetracórdico icónico del flamenco y pop rock (Am–G–F–E): el acorde mayor sobre Mi funciona como dominante frigia.",
        "en": "Iconic descending tetrachord bassline (Am–G–F–E) rooted in flamenco and Phrygian-dominant rock ballads."
      }
    },
    {
      "id": "scale-major",
      "name": { "es": "Escala Mayor (Jónica)", "en": "Major Scale (Ionian)" },
      "shortCode": "Jónica / Maj",
      "category": "progressions-modes",
      "semitones": [60, 62, 64, 65, 67, 69, 71, 72],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "col": 1 }, { "step": 3, "col": 2 }, { "step": 6, "col": 3 }],
      "formula": "T – T – st – T – T – T – st",
      "songCue": { "es": "Do-Re-Mi-Fa-Sol-La-Si-Do · base diatónica", "en": "Do-Re-Mi · bright canonical Western major scale" },
      "pop": true,
      "aka": ["escala mayor", "major scale", "jonica", "ionian"],
      "wiki": "Major_scale",
      "fact": {
        "es": "El patrón maestro de intervalos (Tono-Tono-Semitono-Tono-Tono-Tono-Semitono), representado por las teclas blancas de Do a Do.",
        "en": "Master W–W–H–W–W–W–H pattern corresponding to all white piano keys from C to C."
      }
    },
    {
      "id": "scale-natural-minor",
      "name": { "es": "Escala Menor Natural (Eólica)", "en": "Natural Minor Scale (Aeolian)" },
      "shortCode": "Eólica / min",
      "category": "progressions-modes",
      "semitones": [60, 62, 63, 65, 67, 68, 70, 72],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 1 }, { "step": 5, "acc": "flat", "col": 2 }, { "step": 6, "acc": "flat", "col": 3 }],
      "formula": "1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7",
      "songCue": { "es": "Tono melancólico épico sin sensible elevada", "en": "Epic/melancholic rock minor without raised 7th" },
      "pop": true,
      "aka": ["menor natural", "escala menor natural", "natural minor", "eolica", "aeolian"],
      "wiki": "Minor_scale#Natural_minor_scale",
      "fact": {
        "es": "Rebaja el 3º, 6º y 7º grado respecto a la escala mayor; equivalente a tocar solo teclas blancas empezando en La.",
        "en": "Flattens the 3rd, 6th, and 7th degrees; equivalent to white keys starting on A."
      }
    },
    {
      "id": "scale-harmonic-minor",
      "name": { "es": "Escala Menor Armónica", "en": "Harmonic Minor Scale" },
      "shortCode": "Min Armónica",
      "category": "progressions-modes",
      "semitones": [60, 62, 63, 65, 67, 68, 71, 72],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 1 }, { "step": 5, "acc": "flat", "col": 2 }, { "step": 6, "col": 3 }],
      "formula": "1 – 2 – ♭3 – 4 – 5 – ♭6 – 7 (salto de 3 semitonos)",
      "songCue": { "es": "Giro exótico de ♭6 a ♮7 · Bach, tango y metal neoclásico", "en": "Exotic augmented-2nd leap (b6 to 7) · classical/tango" },
      "pop": false,
      "aka": ["menor armonica", "escala menor armonica", "harmonic minor"],
      "wiki": "Minor_scale#Harmonic_minor_scale",
      "fact": {
        "es": "Eleva el 7º grado de la menor natural para crear un acorde V7 dominante real; su intervalo de 2ª aumentada entre ♭6 y ♮7 es inconfundible.",
        "en": "Raises the 7th degree to restore a true V7 dominant pull, introducing a dramatic 3-semitone gap between b6 and natural 7."
      }
    },
    {
      "id": "scale-dorian",
      "name": { "es": "Modo Dórico", "en": "Dorian Mode" },
      "shortCode": "Dórico",
      "category": "progressions-modes",
      "semitones": [60, 62, 63, 65, 67, 69, 70, 72],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 2, "acc": "flat", "col": 1 }, { "step": 5, "col": 2 }, { "step": 6, "acc": "flat", "col": 3 }],
      "formula": "1 – 2 – ♭3 – 4 – 5 – ♮6 – ♭7",
      "songCue": { "es": "'So What' (Miles Davis) · 'Oye Como Va' · 'Scarborough Fair'", "en": "'So What' · 'Scarborough Fair' · 'Get Lucky'" },
      "pop": false,
      "aka": ["dorico", "modo dorico", "dorian", "dorian mode"],
      "wiki": "Dorian_mode",
      "fact": {
        "es": "Escala menor suavizada y luminosa gracias a su 6ª mayor natural (como las teclas blancas desde Re). Favorito del jazz modal, funk y música celta.",
        "en": "Minor scale brightened by a raised natural 6th (white keys from D): backbone of modal jazz, Santana, funk, and Celtic ballads."
      }
    },
    {
      "id": "scale-pentatonic",
      "name": { "es": "Escala Pentatónica Mayor", "en": "Major Pentatonic Scale" },
      "shortCode": "Penta (5 notas)",
      "category": "progressions-modes",
      "semitones": [60, 62, 64, 67, 69, 72],
      "playMode": "melodic",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 0 }, { "step": 1, "col": 1 }, { "step": 4, "col": 2 }, { "step": 5, "col": 3 }],
      "formula": "1 – 2 – 3 – 5 – 6 (sin semitonos disonantes)",
      "songCue": { "es": "'My Girl' · teclas negras del piano · universal en todas las culturas", "en": "'My Girl' · black keys of piano · universal 5-note scale" },
      "pop": true,
      "aka": ["pentatonica", "escala pentatonica", "pentatonic", "major pentatonic"],
      "wiki": "Pentatonic_scale",
      "fact": {
        "es": "Elimina el 4º y 7º grado (eliminando el tritono), por lo que todas sus 5 notas suenan consonantes entre sí en improvisación folk, rock y música oriental.",
        "en": "Omits the 4th and 7th degrees (removing half-step clashes), creating an open 5-note vocabulary shared across folk, blues, rock, and East Asian music."
      }
    },

    {
      "id": "treble-c4",
      "name": { "es": "Do Central C4 (Clave de Sol)", "en": "Middle C · C4 (Treble Clef)" },
      "shortCode": "C4 · Sol",
      "category": "staff-notes",
      "semitones": [60],
      "playMode": "note",
      "clef": "treble",
      "notes": [{ "step": 0, "col": 1 }],
      "formula": "261.6 Hz · Línea adicional inferior (Sol)",
      "songCue": { "es": "Ojo: línea adicional justo debajo de la 1ª línea Mi4", "en": "First ledger line sitting just below the Treble staff" },
      "pop": true,
      "aka": ["do central sol", "c4 treble", "do4 sol", "do central clave de sol", "c4 sol", "do4"],
      "wiki": "C_(musical_note)#Middle_C",
      "fact": {
        "es": "El punto de referencia central del piano (261.6 Hz): en Clave de Sol descansa atravesado por la primera línea adicional debajo del pentagrama.",
        "en": "Central keyboard anchor (261.6 Hz); in Treble clef it sits centered on the first ledger line directly below the 5-line staff."
      }
    },
    {
      "id": "treble-e4",
      "name": { "es": "Mi4 E4 (Clave de Sol · 1ª línea)", "en": "E4 (Treble · 1st Line)" },
      "shortCode": "E4 · Mi4",
      "category": "staff-notes",
      "semitones": [64],
      "playMode": "note",
      "clef": "treble",
      "notes": [{ "step": 2, "col": 1 }],
      "formula": "329.6 Hz · 1ª línea inferior de Sol (E–G–B–D–F)",
      "songCue": { "es": "Primera línea inferior de la Clave de Sol ('Mi–Sol–Si–Re–Fa')", "en": "Bottom Treble line ('Every Good Boy Does Fine')" },
      "pop": true,
      "aka": ["mi4", "e4", "e4 treble", "mi4 sol"],
      "wiki": "Musical_note",
      "fact": {
        "es": "La línea más baja del pentagrama en Clave de Sol; recuerda las cinco líneas de abajo arriba: Mi–Sol–Si–Re–Fa (E–G–B–D–F).",
        "en": "Bottom line of the Treble staff; memorize Treble lines upward as E–G–B–D–F."
      }
    },
    {
      "id": "treble-g4",
      "name": { "es": "Sol4 G4 (Clave de Sol · 2ª línea)", "en": "G4 (Treble · 2nd Line)" },
      "shortCode": "G4 · Sol4",
      "category": "staff-notes",
      "semitones": [67],
      "playMode": "note",
      "clef": "treble",
      "notes": [{ "step": 4, "col": 1 }],
      "formula": "392.0 Hz · 2ª línea (ancla de la Clave de Sol)",
      "songCue": { "es": "El caracol de la Clave de Sol (𝄞) envuelve exactamente esta 2ª línea", "en": "The Treble G-clef spiral curls directly around this 2nd line" },
      "pop": true,
      "aka": ["sol4", "g4", "g4 treble", "sol4 sol"],
      "wiki": "Treble_clef",
      "fact": {
        "es": "Por eso se llama 'Clave de Sol': la espiral central del signo 𝄞 señala directamente la 2ª línea desde abajo bautizando esa nota como Sol4.",
        "en": "Why it's called the G-clef: the inner curl of the Treble clef pins the 2nd line as G4 (392 Hz)."
      }
    },
    {
      "id": "treble-a4",
      "name": { "es": "La4 A4 · 440 Hz (Clave de Sol · 2º espacio)", "en": "A4 · 440 Hz (Treble · 2nd Space)" },
      "shortCode": "A4 · 440 Hz",
      "category": "staff-notes",
      "semitones": [69],
      "playMode": "note",
      "clef": "treble",
      "notes": [{ "step": 5, "col": 1 }],
      "formula": "440.0 Hz · 2º espacio (diapasón de afinación)",
      "songCue": { "es": "Espacios de Sol hacia arriba: F–A–C–E (Fa–La–Do–Mi)", "en": "Treble spaces spell F–A–C–E (2nd space = A4 = 440 Hz)" },
      "pop": true,
      "aka": ["la4", "a4", "a4 440", "la4 440", "a4 treble"],
      "wiki": "A440_(pitch_standard)",
      "fact": {
        "es": "Referencia internacional de afinación orquestal ISO 16 (440 Hz). Ocupa el segundo espacio en Clave de Sol ('F-A-C-E').",
        "en": "International concert pitch standard (ISO 16: A = 440 Hz), sitting in the 2nd space of the Treble staff (F–A–C–E)."
      }
    },
    {
      "id": "treble-c5",
      "name": { "es": "Do5 C5 (Clave de Sol · 3er espacio)", "en": "C5 (Treble · 3rd Space)" },
      "shortCode": "C5 · Do5",
      "category": "staff-notes",
      "semitones": [72],
      "playMode": "note",
      "clef": "treble",
      "notes": [{ "step": 7, "col": 1 }],
      "formula": "523.3 Hz · 3er espacio (una octava sobre C4)",
      "songCue": { "es": "Tercer espacio desde abajo ('F-A-C-E')", "en": "3rd Treble space ('F-A-C-E')" },
      "pop": false,
      "aka": ["do5", "c5", "c5 treble", "do5 sol"],
      "wiki": "C_(musical_note)",
      "fact": {
        "es": "Ancla rápida una octava por encima del Do central: su posición limpia en el 3er espacio ayuda a leer intervalos agudos al instante.",
        "en": "Octave above middle C sitting cleanly in the 3rd Treble space—a vital sight-reading landmark."
      }
    },
    {
      "id": "treble-f5",
      "name": { "es": "Fa5 F5 (Clave de Sol · 5ª línea)", "en": "F5 (Treble · Top 5th Line)" },
      "shortCode": "F5 · Fa5",
      "category": "staff-notes",
      "semitones": [77],
      "playMode": "note",
      "clef": "treble",
      "notes": [{ "step": 10, "col": 1 }],
      "formula": "698.5 Hz · 5ª línea superior de Sol",
      "songCue": { "es": "Última línea arriba ('Every Good Boy Does Fine')", "en": "Top line of the Treble staff ('...Fine')" },
      "pop": false,
      "aka": ["fa5", "f5", "f5 treble", "fa5 sol"],
      "wiki": "F_(musical_note)",
      "fact": {
        "es": "Límite superior del pentagrama en Clave de Sol (5ª línea, Fa5), simétrico al Mi4 en la 1ª línea inferior.",
        "en": "Top line of the Treble staff (F5, 698.5 Hz), bookending E4 on the bottom line."
      }
    },
    {
      "id": "bass-c4",
      "name": { "es": "Do Central C4 (Clave de Fa)", "en": "Middle C · C4 (Bass Clef)" },
      "shortCode": "C4 · Fa",
      "category": "staff-notes",
      "semitones": [60],
      "playMode": "note",
      "clef": "bass",
      "notes": [{ "step": 0, "col": 1 }],
      "formula": "261.6 Hz · Línea adicional superior (Fa)",
      "songCue": { "es": "Mismo Do central C4, pero por encima del pentagrama en Clave de Fa", "en": "Exact same Middle C (C4), placed one ledger line above Bass staff" },
      "pop": true,
      "aka": ["do central fa", "c4 bass", "do4 fa", "do central clave de fa", "c4 fa"],
      "wiki": "C_(musical_note)#Middle_C",
      "fact": {
        "es": "Misma tecla física (261.6 Hz) que el C4 de Sol, pero en Clave de Fa flota en la primera línea adicional superior conectando ambas manos.",
        "en": "Identical piano key (261.6 Hz) as Treble C4, sitting one ledger line above the Bass staff to bridge left and right hands."
      }
    },
    {
      "id": "bass-a3",
      "name": { "es": "La3 A3 (Clave de Fa · 5ª línea)", "en": "A3 (Bass · Top 5th Line)" },
      "shortCode": "A3 · La3",
      "category": "staff-notes",
      "semitones": [57],
      "playMode": "note",
      "clef": "bass",
      "notes": [{ "step": -2, "col": 1 }],
      "formula": "220.0 Hz · 5ª línea superior de Fa",
      "songCue": { "es": "Líneas de Clave de Fa: Sol–Si–Re–Fa–La (G–B–D–F–A)", "en": "Top Bass line ('Good Boys Do Fine Always')" },
      "pop": false,
      "aka": ["la3", "a3", "a3 bass", "la3 fa"],
      "wiki": "A_(musical_note)",
      "fact": {
        "es": "Línea superior del pentagrama de graves (220 Hz, una octava exacta debajo de La4=440 Hz).",
        "en": "Top line of the Bass staff (220 Hz, exactly one octave below concert A4 = 440 Hz)."
      }
    },
    {
      "id": "bass-f3",
      "name": { "es": "Fa3 F3 (Clave de Fa · 4ª línea)", "en": "F3 (Bass · 4th Line)" },
      "shortCode": "F3 · Fa3",
      "category": "staff-notes",
      "semitones": [53],
      "playMode": "note",
      "clef": "bass",
      "notes": [{ "step": -4, "col": 1 }],
      "formula": "174.6 Hz · 4ª línea (entre los dos puntos de Clave de Fa)",
      "songCue": { "es": "Los dos puntos de la Clave de Fa (𝄢) enmarcan esta 4ª línea", "en": "The two dots of the Bass F-clef straddle this 4th line" },
      "pop": true,
      "aka": ["fa3", "f3", "f3 bass", "fa3 fa"],
      "wiki": "Bass_clef",
      "fact": {
        "es": "Por eso se llama 'Clave de Fa': el signo 𝄢 nace sobre la 4ª línea y coloca sus dos puntitos arriba y abajo de Fa3.",
        "en": "Why it's called the F-clef: the two dots above and below the 4th line pinpoint F3 (174.6 Hz)."
      }
    },
    {
      "id": "bass-d3",
      "name": { "es": "Re3 D3 (Clave de Fa · 3ª línea)", "en": "D3 (Bass · 3rd Line)" },
      "shortCode": "D3 · Re3",
      "category": "staff-notes",
      "semitones": [50],
      "playMode": "note",
      "clef": "bass",
      "notes": [{ "step": -6, "col": 1 }],
      "formula": "146.8 Hz · Línea central del pentagrama de Fa",
      "songCue": { "es": "3ª línea central ('Good Boys Do Fine Always')", "en": "Middle 3rd line of Bass clef ('...Do...')" },
      "pop": false,
      "aka": ["re3", "d3", "d3 bass", "re3 fa"],
      "wiki": "D_(musical_note)",
      "fact": {
        "es": "Línea media simétrica en Clave de Fa (Re3), referencia rápida para mano izquierda de piano, violonchelo y trombón.",
        "en": "Exact center line of the Bass staff (D3), a quick symmetry anchor for piano left hand and cello."
      }
    },
    {
      "id": "bass-c3",
      "name": { "es": "Do3 C3 (Clave de Fa · 2º espacio)", "en": "C3 (Bass · 2nd Space)" },
      "shortCode": "C3 · Do3",
      "category": "staff-notes",
      "semitones": [48],
      "playMode": "note",
      "clef": "bass",
      "notes": [{ "step": -7, "col": 1 }],
      "formula": "130.8 Hz · 2º espacio (All Cows Eat Grass)",
      "songCue": { "es": "Espacios de Fa hacia arriba: La–Do–Mi–Sol (A–C–E–G)", "en": "Bass spaces upward: 'All Cows Eat Grass' (2nd = C3)" },
      "pop": true,
      "aka": ["do3", "c3", "c3 bass", "do3 fa"],
      "wiki": "C_(musical_note)",
      "fact": {
        "es": "Situado una octava por debajo del Do central, ocupa el 2º espacio desde abajo en Clave de Fa.",
        "en": "One octave below Middle C, sitting in the 2nd space of the Bass staff ('All Cows Eat Grass')."
      }
    },
    {
      "id": "bass-g2",
      "name": { "es": "Sol2 G2 (Clave de Fa · 1ª línea)", "en": "G2 (Bass · Bottom 1st Line)" },
      "shortCode": "G2 · Sol2",
      "category": "staff-notes",
      "semitones": [43],
      "playMode": "note",
      "clef": "bass",
      "notes": [{ "step": -10, "col": 1 }],
      "formula": "98.0 Hz · 1ª línea inferior de Clave de Fa",
      "songCue": { "es": "1ª línea inferior ('Good Boys Do Fine Always')", "en": "Bottom 1st line of Bass staff ('Good...')" },
      "pop": false,
      "aka": ["sol2", "g2", "g2 bass", "sol2 fa"],
      "wiki": "G_(musical_note)",
      "fact": {
        "es": "Nota más grave dentro de las 5 líneas de Clave de Fa (98 Hz), equivalente a la nota Sol de la cuerda 6 traste 3 en guitarra o cuerda 4 de bajo trasponer.",
        "en": "Lowest line of the Bass staff (98 Hz); reading upward in Bass uses lines G–B–D–F–A."
      }
    }
  ]
};
