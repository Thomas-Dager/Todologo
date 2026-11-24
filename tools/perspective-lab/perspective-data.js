// Generated dataset — 44 perspective, horizon, composition & lighting-volume concepts
window.PERSPECTIVE_DATA = {
  "CATEGORIES": [
    {
      "id": "vanishing-points",
      "es": "Puntos de Fuga y Geometría 3D",
      "en": "Vanishing Points & 3D Geometry",
      "era": "11 conceptos"
    },
    {
      "id": "horizon-camera",
      "es": "Horizonte, Cámara y Profundidad",
      "en": "Horizon, Camera & Depth Cues",
      "era": "11 conceptos"
    },
    {
      "id": "composition-golden",
      "es": "Composición, Tercios y Proporción Áurea",
      "en": "Composition, Thirds & Golden Ratio",
      "era": "11 conceptos"
    },
    {
      "id": "light-shadow",
      "es": "Luz, Sombra y Lectura de Volúmenes",
      "en": "Light, Shadow & Form Modeling",
      "era": "11 conceptos"
    }
  ],
  "LOOKALIKES": [
    ["one-point", "two-point", "three-point-nadir", "three-point-zenith", "curvilinear-5p", "isometric-axon"],
    ["foreshortening", "ellipse-minor-axis", "diagonal-subdivision", "inclined-planes", "cone-of-vision"],
    ["eye-level-horizon", "low-horizon", "high-horizon", "worms-eye", "birds-eye", "dutch-angle"],
    ["station-point", "atmospheric-persp", "color-temperature-depth", "overlap-occlusion", "scale-diminution"],
    ["rule-of-thirds", "golden-ratio-phi", "golden-triangles", "rabatment", "dynamic-symmetry"],
    ["leading-lines", "triangular-pyramid", "radial-composition", "negative-space", "visual-weight-balance", "frame-within-frame"],
    ["terminator-line", "core-shadow", "reflected-bounce-light", "cast-shadow-convergence", "ambient-occlusion"],
    ["highlight-specular", "halftone-gradient", "rembrandt-lighting", "rim-backlight", "chiaroscuro-tenebrism", "subsurface-scattering"]
  ],
  "MODELS": [
    {
      "id": "one-point",
      "name": { "es": "Perspectiva Frontal (1 Punto de Fuga)", "en": "One-Point Perspective (1P)" },
      "shortCode": "1P · PF1",
      "category": "vanishing-points",
      "diagramKind": "1p",
      "rule": { "es": "Plano frontal paralelo; profundidad converge al centro único", "en": "Front face parallel; depth rays converge to 1 center VP" },
      "pop": true,
      "aka": ["1 punto de fuga", "un punto de fuga", "perspectiva frontal", "one point perspective", "1p"],
      "wiki": "Perspective_(graphical)#One-point_perspective",
      "fact": {
        "es": "Verticales y horizontales permanecen paralelas al marco; únicamente las líneas de profundidad convergen hacia un único punto de fuga sobre la línea de horizonte.",
        "en": "Verticals and horizontals stay parallel to the frame while all depth orthogonals converge cleanly toward one single vanishing point on the horizon."
      }
    },
    {
      "id": "two-point",
      "name": { "es": "Perspectiva Oblicua (2 Puntos de Fuga)", "en": "Two-Point Perspective (2P)" },
      "shortCode": "2P · PF1/PF2",
      "category": "vanishing-points",
      "diagramKind": "2p",
      "rule": { "es": "Arista frontal vertical; caras laterales fugan a PF izq y der", "en": "Vertical front edge; both side faces converge to Left & Right VPs" },
      "pop": true,
      "aka": ["2 puntos de fuga", "dos puntos de fuga", "perspectiva oblicua", "two point perspective", "2p"],
      "wiki": "Perspective_(graphical)#Two-point_perspective",
      "fact": {
        "es": "El cubo se mira desde una esquina: solo las verticales se mantienen rectas y paralelas al papel, mientras ambos ejes horizontales fugan hacia puntos izq/der.",
        "en": "Subject viewed corner-on: verticals remain plumb and parallel, while both horizontal sets recede toward left and right vanishing points on the horizon."
      }
    },
    {
      "id": "three-point-nadir",
      "name": { "es": "Perspectiva Picado / Aérea (3 Puntos Nadir)", "en": "Three-Point Bird's-Eye (Nadir VP)" },
      "shortCode": "3P · Nadir",
      "category": "vanishing-points",
      "diagramKind": "3p-nadir",
      "rule": { "es": "Tres puntos de fuga: dos en horizonte y el 3º abajo (nadir)", "en": "Two horizon VPs plus a 3rd downward Nadir VP below" },
      "pop": true,
      "aka": ["3 puntos nadir", "tres puntos picado", "three point nadir", "nadir perspective", "3p nadir"],
      "wiki": "Perspective_(graphical)#Three-point_perspective",
      "fact": {
        "es": "Al mirar rascacielos desde lo alto, las líneas verticales dejan de ser paralelas y se estrechan convergiendo hacia un tercer punto abajo en el suelo (nadir).",
        "en": "Looking steeply downward causes vertical edges to taper and converge toward a third Nadir vanishing point deep below the horizon."
      }
    },
    {
      "id": "three-point-zenith",
      "name": { "es": "Contrapicado Heroico (3 Puntos Cenit)", "en": "Three-Point Heroic Low-Angle (Zenith VP)" },
      "shortCode": "3P · Cenit",
      "category": "vanishing-points",
      "diagramKind": "3p-zenith",
      "rule": { "es": "Tres puntos de fuga: horizonte bajo y 3er punto arriba (cenit)", "en": "Low horizon plus 3rd upward Zenith VP overhead" },
      "pop": true,
      "aka": ["3 puntos cenit", "tres puntos contrapicado", "three point zenith", "zenith perspective", "3p zenith"],
      "wiki": "Perspective_(graphical)#Three-point_perspective",
      "fact": {
        "es": "La cámara mira desde abajo hacia el cielo: los muros de monumentos y torres convergen hacia el cenit superior magnificando la escala.",
        "en": "Looking upward from street level funnels vertical walls toward an overhead Zenith vanishing point, lending heroic monumental scale."
      }
    },
    {
      "id": "curvilinear-5p",
      "name": { "es": "Perspectiva Curvilínea / Ojo de Pez (5 Puntos)", "en": "Curvilinear / Fisheye Perspective (5P)" },
      "shortCode": "5P · Esférica",
      "category": "vanishing-points",
      "diagramKind": "5p-curv",
      "rule": { "es": "Proyección hemisférica de gran angular con líneas arqueadas", "en": "Wide-angle spherical grid curving straight lines near edges" },
      "pop": false,
      "aka": ["5 puntos", "perspectiva curvilinea", "ojo de pez", "fisheye perspective", "5p"],
      "wiki": "Curvilinear_perspective",
      "fact": {
        "es": "Abarca hasta 180° curvando horizontales y verticales hacia cinco puntos cardinales (arriba, abajo, izquierda, derecha y centro), popularizada por Escher.",
        "en": "Captures a 180° hemisphere using curved grid lines converging toward 5 cardinal points—famous in M. C. Escher's self-portraits."
      }
    },
    {
      "id": "isometric-axon",
      "name": { "es": "Proyección Isométrica / Axonométrica", "en": "Isometric / Axonometric Projection" },
      "shortCode": "0P · 30° Paralela",
      "category": "vanishing-points",
      "diagramKind": "iso",
      "rule": { "es": "Cero puntos de fuga: ejes paralelos a 30° sin escorzo", "en": "Zero VPs: parallel 30-degree edges with no convergence" },
      "pop": true,
      "aka": ["isometrica", "proyeccion isometrica", "axonometrica", "isometric projection", "isometric"],
      "wiki": "Isometric_projection",
      "fact": {
        "es": "Las paralelas reales permanecen paralelas en pantalla sin achicarse con la distancia (ángulos simétricos de 120° entre tres ejes); estándar en planos CAD y videojuegos tácticos.",
        "en": "Parallel edges stay strictly parallel with uniform scale across depth (120° axes at ±30°), standard in CAD blueprints and tactical games."
      }
    },
    {
      "id": "foreshortening",
      "name": { "es": "Escorzo (Foreshortening)", "en": "Foreshortening" },
      "shortCode": "Escorzo · Eje Z",
      "category": "vanishing-points",
      "diagramKind": "foreshorten",
      "rule": { "es": "Compresión aparente de longitud cuando un volumen apunta a cámara", "en": "Visual compression when cylinder/limb points toward viewer" },
      "pop": true,
      "aka": ["escorzo", "foreshortening"],
      "wiki": "Foreshortening",
      "fact": {
        "es": "Al apuntar un brazo o cilindro hacia el espectador, su longitud se comprime drásticamente y las secciones transversales se superponen en anillos cercanos.",
        "en": "Objects aimed straight toward the camera appear radically shortened along the Z-axis, stacking cross-section contours tightly."
      }
    },
    {
      "id": "ellipse-minor-axis",
      "name": { "es": "Elipses en Perspectiva y Eje Menor", "en": "Ellipses & Minor Axis Alignment" },
      "shortCode": "Eje Menor ⊥",
      "category": "vanishing-points",
      "diagramKind": "ellipse",
      "rule": { "es": "El eje menor de toda elipse coincide con el eje del cilindro hacia el PF", "en": "Ellipse minor axis must align directly with the cylinder's center axis" },
      "pop": true,
      "aka": ["elipse eje menor", "elipses en perspectiva", "minor axis", "ellipse perspective"],
      "wiki": "Perspective_(graphical)#Drawing_circles",
      "fact": {
        "es": "Regla de oro para dibujar ruedas, tazas o cohetes: la línea central del cilindro hacia su punto de fuga debe formar siempre 90° con el diámetro ancho (eje mayor) de la elipse.",
        "en": "Golden rule for wheels and cylinders: the minor axis of any circular cross-section aligns with the central spine vanishing toward the VP."
      }
    },
    {
      "id": "diagonal-subdivision",
      "name": { "es": "Método de las Diagonales (Espaciado)", "en": "Diagonal Subdivision & Spacing" },
      "shortCode": "X + Centro -> Red",
      "category": "vanishing-points",
      "diagramKind": "diagonals",
      "rule": { "es": "Cruzar diagonales ubica el centro exacto en escorzo para repetir postes/arcos", "en": "Intersecting diagonals find foreshortened midpoints to repeat bays" },
      "pop": false,
      "aka": ["metodo diagonales", "subdivision en perspectiva", "diagonal method", "foreshortened spacing"],
      "wiki": "Perspective_(graphical)#Equal_divisions",
      "fact": {
        "es": "Uniendo vértices opuestos en X se halla el centro óptico real desplazado hacia atrás; proyectando por ese centro se replican postes de luz o baldosas con ritmo exacto.",
        "en": "Drawing an X across a foreshortened rectangle yields its true depth midpoint, enabling geometrically accurate fence-post or tile repetition."
      }
    },
    {
      "id": "inclined-planes",
      "name": { "es": "Planos Inclinados y PF Auxiliar", "en": "Inclined Planes & Auxiliary VP" },
      "shortCode": "Rampas · PF Aux",
      "category": "vanishing-points",
      "diagramKind": "incline",
      "rule": { "es": "Pendientes y tejados fugan sobre o debajo del PF original en vertical", "en": "Slopes vanish vertically directly above or below the horizon VP" },
      "pop": false,
      "aka": ["planos inclinados", "punto de fuga auxiliar", "inclined planes", "auxiliary vanishing point"],
      "wiki": "Vanishing_point",
      "fact": {
        "es": "Si una rampa o tejado sube hacia el fondo, sus bordes paralelos no fugan al horizonte sino a un Punto Auxiliar trazado verticalmente por encima del punto de fuga original.",
        "en": "Upward stairs or pitched roofs vanish to an auxiliary VP traced strictly on a vertical line directly above the parent horizon VP."
      }
    },
    {
      "id": "cone-of-vision",
      "name": { "es": "Cono de Visión de 60° y Distorsión", "en": "60° Cone of Vision & Edge Distortion" },
      "shortCode": "FOV 60° · No Warping",
      "category": "vanishing-points",
      "diagramKind": "cone",
      "rule": { "es": "Colocar puntos de fuga muy cerca estira grotescamente ángulos fuera de 60°", "en": "VPs placed too close distort corners outside the 60° cone" },
      "pop": false,
      "aka": ["cono de vision", "cone of vision", "distortion 60", "distorsion perspectiva"],
      "wiki": "Station_point",
      "fact": {
        "es": "La vista humana percibe sin deformación natural un cono central de ~60°; situar PF1 y PF2 demasiado juntos dentro del lienzo produce cubos antinaturalmente agudos.",
        "en": "Placing left and right VPs inside a narrow frame compresses the 90° corner beyond our natural ~60° cone of vision, skewing cubes sharply."
      }
    },

    {
      "id": "eye-level-horizon",
      "name": { "es": "Horizonte a Nivel de Ojos (Natural)", "en": "Eye-Level Horizon Line" },
      "shortCode": "LH = Nivel Ojos",
      "category": "horizon-camera",
      "diagramKind": "horizon-eye",
      "rule": { "es": "Toda cabeza a tu misma estatura yace atravesada por la Línea de Horizonte", "en": "Everyone standing on flat ground shares their eye line with the HL" },
      "pop": true,
      "aka": ["nivel de ojos", "linea de horizonte", "eye level", "horizon line"],
      "wiki": "Horizon#In_art_and_photography",
      "fact": {
        "es": "La Línea de Horizonte siempre equivale exactamente a la altura de tus ojos o cámara: en terreno plano, todas las personas de igual altura alinean sus ojos sobre ella.",
        "en": "The horizon line marks camera altitude: every standing person of equal height on flat ground aligns their eyes right across it."
      }
    },
    {
      "id": "low-horizon",
      "name": { "es": "Horizonte Bajo (Cielo Dominante)", "en": "Low Horizon Composition" },
      "shortCode": "LH Tercio Inf",
      "category": "horizon-camera",
      "diagramKind": "horizon-low",
      "rule": { "es": "LH en el tercio inferior para exaltar nubes, vastedad y monumentos", "en": "Lowers HL to emphasize vast skies, freedom, or towering height" },
      "pop": true,
      "aka": ["horizonte bajo", "low horizon"],
      "wiki": "Landscape_painting",
      "fact": {
        "es": "Bajar el horizonte al cuarto inferior dedica ~75% del cuadro al cielo o figuras erguidas, transmitiendo grandeza, soledad cósmica o aire épico.",
        "en": "Dropping the horizon near the bottom reserves ~75% of the frame for sweeping skies and towering figures."
      }
    },
    {
      "id": "high-horizon",
      "name": { "es": "Horizonte Alto (Plano Terrestre)", "en": "High Horizon (Top-Down Ground)" },
      "shortCode": "LH Tercio Sup",
      "category": "horizon-camera",
      "diagramKind": "horizon-high",
      "rule": { "es": "Sube LH para priorizar terreno, multitudes o mesas de trabajo", "en": "Raises HL to map terrain paths, crowds, or tabletop scenes" },
      "pop": true,
      "aka": ["horizonte alto", "high horizon"],
      "wiki": "High-angle_shot",
      "fact": {
        "es": "Al subir el horizonte hacia el borde superior se despliega todo el plano del suelo (Brueghel y narrativa gráfica), ideal para leer recorridos o aglomeraciones.",
        "en": "Raising the horizon opens the ground plane like a map—ideal for landscapes with winding paths, crowds, or isometric layouts."
      }
    },
    {
      "id": "worms-eye",
      "name": { "es": "Vista de Gusano (Contrapicado Extremo)", "en": "Worm's-Eye View (Low Angle)" },
      "shortCode": "Cámara Suelo ↑",
      "category": "horizon-camera",
      "diagramKind": "worms-eye",
      "rule": { "es": "Cámara a ras del piso mirando arriba; muestra bases y suelas", "en": "Ground-level lens looking upward revealing undersides" },
      "pop": false,
      "aka": ["vista de gusano", "contrapicado", "worms eye", "worm's-eye view"],
      "wiki": "Worm%27s-eye_view",
      "fact": {
        "es": "Sitúa al espectador por debajo del sujeto, maximizando poder, amenaza o escala arquitectónica y revelando cornisas y caras inferiores de volúmenes.",
        "en": "Places the viewer below ground plane looking skyward, dramatizing power and exposing overhangs and soffits."
      }
    },
    {
      "id": "birds-eye",
      "name": { "es": "Vista de Pájaro / Cenital (Picado Alto)", "en": "Bird's-Eye / Overhead View" },
      "shortCode": "Cámara Aérea ↓",
      "category": "horizon-camera",
      "diagramKind": "birds-eye",
      "rule": { "es": "Mirada elevada desde arriba; revela azoteas, trazados y vulnerabilidad", "en": "Elevated overhead angle showing rooftops & spatial layout" },
      "pop": false,
      "aka": ["vista de pajaro", "picado", "cenital", "birds eye", "bird's-eye view"],
      "wiki": "Bird%27s-eye_view",
      "fact": {
        "es": "Expone techos, calles y patrones geométricos ocultos desde el nivel peatonal; en narrativa visual disminuye al personaje frente a su entorno.",
        "en": "Looks steeply down over rooftops and plazas, emphasizing spatial geography or making subjects feel small."
      }
    },
    {
      "id": "dutch-angle",
      "name": { "es": "Plano Holandés / Horizonte Inclinado", "en": "Dutch Angle / Canted Horizon" },
      "shortCode": "Roll ∠ ≠ 0°",
      "category": "horizon-camera",
      "diagramKind": "dutch",
      "rule": { "es": "Inclina la Línea de Horizonte en diagonal para crear tensión o vértigo", "en": "Tilts camera roll axis to evoke unease, speed, or disorientation" },
      "pop": true,
      "aka": ["plano holandes", "plano aberrante", "dutch angle", "dutch tilt", "canted angle"],
      "wiki": "Dutch_angle",
      "fact": {
        "es": "Rompe la horizontalidad gravitacional rotando el eje Z de la cámara (típico del cine expresionista alemán y cómics de acción) para transmitir desequilibrio.",
        "en": "Rolls the horizon into an unstable diagonal (classic in German Expressionism and action cinema) to transmit chaos or tension."
      }
    },
    {
      "id": "station-point",
      "name": { "es": "Punto de Estación y Focal (Gran Angular vs Tele)", "en": "Station Point & Focal Length" },
      "shortCode": "PE · mm Lens",
      "category": "horizon-camera",
      "diagramKind": "station",
      "rule": { "es": "Acercar la cámara exagera fugas (24mm); alejarla las aplana (200mm)", "en": "Close PE exaggerates convergence; distant tele flattens depth" },
      "pop": false,
      "aka": ["punto de estacion", "focal", "station point", "focal length perspective"],
      "wiki": "Station_point",
      "fact": {
        "es": "La distancia física entre el observador y el objeto es quien controla la compresión de perspectiva: un teleobjetivo aplana planos porque te obliga a pararte lejos.",
        "en": "Perspective distortion depends on Station Point distance: moving in close with 24mm dramatically expands depth compared to standing far back with 200mm."
      }
    },
    {
      "id": "atmospheric-persp",
      "name": { "es": "Perspectiva Atmosférica (Aérea)", "en": "Atmospheric / Aerial Perspective" },
      "shortCode": "Contraste ↓ · Azul ↑",
      "category": "horizon-camera",
      "diagramKind": "aerial",
      "rule": { "es": "A mayor lejanía disminuye el contraste y los oscuros viran al color del cielo", "en": "Distance lowers contrast, softens edges & shifts darks toward sky blue" },
      "pop": true,
      "aka": ["perspectiva atmosferica", "perspectiva aerea", "atmospheric perspective", "aerial perspective"],
      "wiki": "Aerial_perspective",
      "fact": {
        "es": "Descrita por Leonardo da Vinci: las partículas del aire dispersan luz azul y lavan los negros lejanos hacia tonos claros desaturados y bordes difusos.",
        "en": "Formulated by Leonardo da Vinci: atmospheric scattering lifts shadow values toward hazy sky tones while softening distant edges and contrast."
      }
    },
    {
      "id": "color-temperature-depth",
      "name": { "es": "Profundidad por Temperatura Cálido / Frío", "en": "Color Temperature Depth Cue" },
      "shortCode": "Cálido Adelante · Frío Atrás",
      "category": "horizon-camera",
      "diagramKind": "warm-cool",
      "rule": { "es": "Cálidos saturados avanzan al primer plano; fríos desaturados retroceden", "en": "Saturated warm hues advance; desaturated cool hues recede" },
      "pop": false,
      "aka": ["temperatura de color", "calido frio", "warm cool depth", "chromostereopsis"],
      "wiki": "Color_theory",
      "fact": {
        "es": "Pintores paisajistas contrastan ocres y naranjas vibrantes en primer plano contra grises azulados y violetas en la cordillera del fondo para crear volumen instantáneo.",
        "en": "Landscape masters anchor foregrounds in rich warm ochres and greens while pushing distant hills into cool blues and lavenders."
      }
    },
    {
      "id": "overlap-occlusion",
      "name": { "es": "Superposición de Contornos (Oclusión)", "en": "Overlap & Contour Occlusion" },
      "shortCode": "T-Junctions",
      "category": "horizon-camera",
      "diagramKind": "overlap",
      "rule": { "es": "El contorno continuo de un objeto tapa al trasero revelando orden Z", "en": "T-junction contours clearly place foreground shapes in front of rear ones" },
      "pop": true,
      "aka": ["superposicion", "oclusion", "overlap", "occlusion depth"],
      "wiki": "Depth_perception#Occlusion",
      "fact": {
        "es": "Incluso en un dibujo plano sin sombra ni punto de fuga, las intersecciones en 'T' donde un borde interrumpe a otro bastan para ordenar qué plano está más cerca.",
        "en": "Even without shading or vanishing lines, unbroken foreground outlines creating 'T-junctions' establish immediate spatial order."
      }
    },
    {
      "id": "scale-diminution",
      "name": { "es": "Gradiente de Tamaño y Detalle", "en": "Size & Texture Gradient" },
      "category": "horizon-camera",
      "diagramKind": "scale",
      "rule": { "es": "Objetos idénticos encogen proporcionalmente hacia LH y pierden microdetalle", "en": "Repeating elements shrink steadily toward HL & simplify texture" },
      "pop": false,
      "aka": ["gradiente de tamano", "escala", "size gradient", "texture gradient"],
      "wiki": "Depth_perception#Texture_gradient",
      "fact": {
        "es": "El ojo deduce profundidad al comparar adoquines o árboles similares haciéndose más pequeños y densos cuanto más se aproximan a la línea del horizonte.",
        "en": "As identical trees, tiles, or figures shrink and simplify texture toward the horizon, the eye immediately measures depth."
      }
    },

    {
      "id": "rule-of-thirds",
      "name": { "es": "Regla de los Tercios (3×3)", "en": "Rule of Thirds (3×3 Grid)" },
      "shortCode": "1/3 · 4 Puntos",
      "category": "composition-golden",
      "diagramKind": "thirds",
      "rule": { "es": "Divide el cuadro en 3×3 y ubica el foco en una de las 4 intersecciones", "en": "Divide frame 3×3; anchor focal points along intersections" },
      "pop": true,
      "aka": ["regla de los tercios", "tercios", "rule of thirds"],
      "wiki": "Rule_of_thirds",
      "fact": {
        "es": "Evita centrar rígidamente sujetos estáticos: alinear ojos o horizontes en tercios genera movimiento orgánico manteniendo equilibrio natural.",
        "en": "Dividing width and height by thirds creates four sweet-spot intersections that feel more dynamic and breathable than dead-center framing."
      }
    },
    {
      "id": "golden-ratio-phi",
      "name": { "es": "Proporción Áurea (φ = 1.618) y Espiral", "en": "Golden Ratio (Phi 1.618) & Spiral" },
      "shortCode": "φ 1 : 1.618",
      "category": "composition-golden",
      "diagramKind": "golden",
      "rule": { "es": "División continua 1 : 1.618 con espiral logarítmica guiando al punto focal", "en": "1 : 1.618 subdivision curling smoothly into focal eye" },
      "pop": true,
      "aka": ["proporcion aurea", "numero aureo", "espiral fibonacci", "golden ratio", "golden spiral", "phi"],
      "wiki": "Golden_ratio",
      "fact": {
        "es": "Frente al tercio exacto (0.333), la sección áurea (0.382 / 0.618) concentra levemente el foco hacia el centro mediante rectángulos sucesivos 1:1.618.",
        "en": "Subtly tighter than thirds (38.2% vs 33.3%), the Golden Section subdivides squares recursively into a logarithmic spiral converging on the focal point."
      }
    },
    {
      "id": "golden-triangles",
      "name": { "es": "Triángulos Áureos (Diagonales Recíprocas)", "en": "Golden Triangles (Reciprocal Grid)" },
      "shortCode": "Diagonal + ⊥",
      "category": "composition-golden",
      "diagramKind": "golden-tri",
      "rule": { "es": "Traza diagonal principal y dos perpendiculares desde las esquinas opuestas", "en": "Main diagonal intersected at 90° by rays from opposite corners" },
      "pop": true,
      "aka": ["triangulos aureos", "diagonales reciprocas", "golden triangles"],
      "wiki": "Diagonal_(geometry)",
      "fact": {
        "es": "Herramienta clásica para composiciones dinámicas con diagonales fuertes: la esquina superior/inferior cae exactamente a 90° sobre la diagonal cruzada.",
        "en": "Ideal for action diagonals: drop two perpendicular lines from opposite corners onto a main diagonal to place energetic focal anchors."
      }
    },
    {
      "id": "rabatment",
      "name": { "es": "Rebatimiento del Cuadrado (Rabatment)", "en": "Rabatment of the Rectangle" },
      "shortCode": "Cuadrado L/R",
      "category": "composition-golden",
      "diagramKind": "rabatment",
      "rule": { "es": "Pliega el lado menor sobre el largo formando dos cuadrados internos", "en": "Rotate short side into long side forming twin inner squares" },
      "pop": false,
      "aka": ["rebatimiento", "rabatment"],
      "wiki": "Rabatment_of_the_rectangle",
      "fact": {
        "es": "Secreto compositivo de Vermeer, Degas y Cartier-Bresson: el lado corto del lienzo se traslada al largo revelando bordes verticales ocultos donde encajan figuras.",
        "en": "Favored by Vermeer and Degas: projecting a canvas's height along its width reveals hidden left/right square boundaries for structural harmony."
      }
    },
    {
      "id": "dynamic-symmetry",
      "name": { "es": "Simetría Dinámica (Armadura √2, √φ)", "en": "Dynamic Symmetry Armature" },
      "shortCode": "Armadura √2",
      "category": "composition-golden",
      "diagramKind": "symmetry",
      "rule": { "es": "Rejilla de diagonales principales, recíprocas y barrocas", "en": "Armature of main, reciprocal, and baroque crossing diagonals" },
      "pop": false,
      "aka": ["simetria dinamica", "dynamic symmetry", "armadura compositiva"],
      "wiki": "Dynamic_symmetry",
      "fact": {
        "es": "Sistematizada por Jay Hambidge a partir de ánforas griegas: alinear elementos paralelos o perpendiculares a las diagonales de la armadura unifica toda la escena.",
        "en": "Formalized by Jay Hambidge: aligning limbs, shadows, and architecture parallel to main and reciprocal diagonals creates rhythmic unity."
      }
    },
    {
      "id": "leading-lines",
      "name": { "es": "Líneas Directoras (Leading Lines)", "en": "Leading Lines" },
      "shortCode": "Rutas -> Foco",
      "category": "composition-golden",
      "diagramKind": "leading",
      "rule": { "es": "Caminos, barandas o miradas guían el ojo del espectador al protagonista", "en": "Roads, fences, or gazes steer the viewer's eye toward subject" },
      "pop": true,
      "aka": ["lineas directoras", "lineas guia", "leading lines"],
      "wiki": "Composition_(visual_arts)#Lines",
      "fact": {
        "es": "Aprovecha rutas reales o implícitas (ríos, escaleras, brazos o miradas entre personajes) para conducir sin esfuerzo el recorrido visual hacia el clímax del cuadro.",
        "en": "Uses roads, railings, shorelines, or implied eye-lines to steer the viewer's gaze deliberately to the primary subject."
      }
    },
    {
      "id": "triangular-pyramid",
      "name": { "es": "Composición Piramidal / Triangular", "en": "Pyramidal / Triangular Composition" },
      "shortCode": "Δ Base Sólida",
      "category": "composition-golden",
      "diagramKind": "pyramid",
      "rule": { "es": "Agrupa figuras en pirámide estable con vértice superior claro", "en": "Arranges subjects into a stable triangle anchored on wide base" },
      "pop": true,
      "aka": ["composicion piramidal", "triangular", "pyramid composition", "triangular composition"],
      "wiki": "Composition_(visual_arts)",
      "fact": {
        "es": "Preferida en el Renacimiento (La Gioconda, La Virgen de las Rocas): la base ancha ancla solidez monumental mientras el vértice corona la jerarquía.",
        "en": "High Renaissance hallmark (Mona Lisa, Raphael): a wide base exudes stability while the apex draws focus upward to the main face."
      }
    },
    {
      "id": "radial-composition",
      "name": { "es": "Composición Radial / Centrípeta", "en": "Radial Composition" },
      "shortCode": "Ejes desde Centro",
      "category": "composition-golden",
      "diagramKind": "radial",
      "rule": { "es": "Líneas y elementos irradian como rayos desde un núcleo central", "en": "Spokes and visual accents radiate outward from a single core" },
      "pop": false,
      "aka": ["composicion radial", "radial composition", "centripeta"],
      "wiki": "Radial_balance",
      "fact": {
        "es": "Cúpulas, rosetones o escenas de acción donde todos los ejes apuntan a un mismo centro explosivo (o convergen hacia él como imán).",
        "en": "Rose windows, action impacts, or ceilings where spokes radiate from—or pull inexorably into—a singular central hub."
      }
    },
    {
      "id": "negative-space",
      "name": { "es": "Espacio Negativo y Respiración Visual", "en": "Negative Space & Notan" },
      "shortCode": "Vacío Activo",
      "category": "composition-golden",
      "diagramKind": "negative",
      "rule": { "es": "Amplia área vacía rodea al sujeto para destacar silueta y quietud", "en": "Generous empty area isolates the silhouette and slows visual noise" },
      "pop": true,
      "aka": ["espacio negativo", "negative space", "notan", "ma japones"],
      "wiki": "Negative_space",
      "fact": {
        "es": "El 'Ma' en estética japonesa y el diseño minimalista tratan el vacío como forma activa que multiplica el peso emocional de un sujeto diminuto.",
        "en": "Treating empty background (Japanese 'Ma') as an active shape amplifies silhouette readability, scale, and quiet mood."
      }
    },
    {
      "id": "visual-weight-balance",
      "name": { "es": "Equilibrio Asimétrico (Balanza de Masas)", "en": "Asymmetric Visual Weight" },
      "shortCode": "Gran Masa <-> Pequeño Contraste",
      "category": "composition-golden",
      "diagramKind": "balance",
      "rule": { "es": "Un elemento pequeño muy contrastado o cerca del borde equilibra gran masa", "en": "Small high-contrast accent far out balances a large calm mass" },
      "pop": false,
      "aka": ["equilibrio asimetrico", "peso visual", "visual balance", "asymmetric balance"],
      "wiki": "Balance_(art)",
      "fact": {
        "es": "Como una palanca física: una gran masa gris cercana al centro puede equilibrarse con un pequeño acento rojo vibrante situado cerca del borde opuesto.",
        "en": "Works like a seesaw lever: a massive muted shape near center balances a tiny vibrant highlight positioned far toward the opposite edge."
      }
    },
    {
      "id": "frame-within-frame",
      "name": { "es": "Encuadre dentro del Encuadre (Subframing)", "en": "Frame within a Frame" },
      "shortCode": "[ Ventana / Arco ]",
      "category": "composition-golden",
      "diagramKind": "frame",
      "rule": { "es": "Arcos, puertas o ramas enmarcan al protagonista añadiendo capas", "en": "Doorways, arches, or foliage frame the subject inside the frame" },
      "pop": false,
      "aka": ["encuadre dentro del encuadre", "subencuadre", "frame within a frame", "subframing"],
      "wiki": "Framing_(visual_arts)",
      "fact": {
        "es": "Recurso fotográfico y pictórico clásico (ej. Las Meninas o arcos de Vermeer): sitúa un marco oscuro en primer plano para aislar al sujeto iluminado atrás.",
        "en": "Classic depth device using dark foreground archways, mirrors, or windows to spotlight and layer the illuminated subject beyond."
      }
    },

    {
      "id": "terminator-line",
      "name": { "es": "Línea del Terminador (Luz vs Sombra)", "en": "Shadow Terminator Line" },
      "shortCode": "Luz | Sombra",
      "category": "light-shadow",
      "diagramKind": "terminator",
      "rule": { "es": "Frontera donde los rayos de luz tangentes dejan de tocar la forma", "en": "Boundary edge where tangent light rays graze past the form" },
      "pop": true,
      "aka": ["terminador", "linea del terminador", "shadow terminator", "terminator line"],
      "wiki": "Terminator_(solar)",
      "fact": {
        "es": "El divisor fundamental del claroscuro: separa la familia iluminada de la familia en sombra; suele ser nítida en bordes duros y suave en curvas amplias.",
        "en": "Fundamental split between light family and shadow family—sharp on crisp corners, gently feathered across curving spheres or cylinders."
      }
    },
    {
      "id": "core-shadow",
      "name": { "es": "Núcleo de Sombra (Core Shadow)", "en": "Core Shadow Band" },
      "shortCode": "Valor Más Oscuro",
      "category": "light-shadow",
      "diagramKind": "core",
      "rule": { "es": "Banda más oscura justo en el terminador, antes de recibir luz rebotada", "en": "Darkest band right on the terminator untouched by main or bounce light" },
      "pop": true,
      "aka": ["nucleo de sombra", "core shadow", "sombra propia"],
      "wiki": "Shading",
      "fact": {
        "es": "Contrario a lo que intuyen principiantes, la parte más oscura de una esfera NO está en su borde trasero sino en la franja del terminador donde no llega ni luz directa ni rebote.",
        "en": "Surprisingly, a sphere's darkest value isn't its rear edge—it sits along the terminator band where neither direct light nor ground bounce reaches."
      }
    },
    {
      "id": "reflected-bounce-light",
      "name": { "es": "Luz Reflejada / Rebote del Entorno", "en": "Reflected / Bounce Light" },
      "shortCode": "Rebote Suelo",
      "category": "light-shadow",
      "diagramKind": "bounce",
      "rule": { "es": "Aclara suavemente el dorso en sombra sin igualar jamás la zona iluminada", "en": "Gently illuminates shadow backside while staying darker than halftones" },
      "pop": true,
      "aka": ["luz reflejada", "rebote de luz", "reflected light", "bounce light"],
      "wiki": "Global_illumination",
      "fact": {
        "es": "La luz rebota en la mesa o piso e ilumina sutilmente el dorso sombreado; regla clave de valor: jamás hagas el rebote más claro que el medio tono iluminado.",
        "en": "Light bouncing off surrounding surfaces softly tints the shadow underside—crucially, keep bounce light strictly darker than any lit halftone."
      }
    },
    {
      "id": "cast-shadow-convergence",
      "name": { "es": "Sombra Proyectada y Fuga de Luz", "en": "Cast Shadow Projection" },
      "shortCode": "Base -> Suelo",
      "category": "light-shadow",
      "diagramKind": "cast",
      "rule": { "es": "Ancla objetos al suelo; rayos desde foco de luz y su proyección base", "en": "Anchors objects to ground; edges radiate from light base point" },
      "pop": true,
      "aka": ["sombra proyectada", "sombra arrojada", "cast shadow"],
      "wiki": "Shadow",
      "fact": {
        "es": "Sin sombra proyectada los objetos parecen flotar; su borde se mantiene duro cerca del punto de contacto y se difumina al alejarse con luz difusa.",
        "en": "Grounds solid forms onto planes—crisp and dark near the object's foot, gradually softening as the shadow stretches away."
      }
    },
    {
      "id": "ambient-occlusion",
      "name": { "es": "Oclusión Ambiental (Sombra de Contacto)", "en": "Ambient Occlusion (Contact Shadow)" },
      "shortCode": "Grietas · Contacto",
      "category": "light-shadow",
      "diagramKind": "ao",
      "rule": { "es": "Oscurecimiento profundo en rendijas y uniones donde no entra luz ambiental", "en": "Deep crevice darkening where ambient sky/bounce rays cannot escape" },
      "pop": true,
      "aka": ["oclusion ambiental", "sombra de contacto", "ambient occlusion", "contact shadow"],
      "wiki": "Ambient_occlusion",
      "fact": {
        "es": "Incluso en días totalmente nublados sin sol directo, debajo de una llanta, pliegue de ropa o esquina cerrada aparece esta línea oscura que da peso físico.",
        "en": "Even under overcast skies, tight crevices, folds, and ground contact seams darken sharply because ambient light rays get trapped."
      }
    },
    {
      "id": "highlight-specular",
      "name": { "es": "Brillo Especular vs Difuso", "en": "Specular Highlight vs Diffuse" },
      "shortCode": "Reflejo Cámara",
      "category": "light-shadow",
      "diagramKind": "specular",
      "rule": { "es": "Único punto que depende del ángulo del observador hacia el foco de luz", "en": "Mirror-like bright spot shifting with viewer camera position" },
      "pop": false,
      "aka": ["brillo especular", "especular", "highlight", "specular highlight"],
      "wiki": "Specular_highlight",
      "fact": {
        "es": "Mientras la sombra propia depende solo de dónde está el sol, el brillo especular es un reflejo de la fuente de luz y se desplaza si tú cambias de ángulo.",
        "en": "Unlike matte shading fixed to the light angle, a specular highlight mirrors the light source directly toward the viewer's eye."
      }
    },
    {
      "id": "halftone-gradient",
      "name": { "es": "Medio Tono y Coseno de Lambert", "en": "Halftone Roll-Off (Lambert's Law)" },
      "shortCode": "CentroLuz -> Terminador",
      "category": "light-shadow",
      "diagramKind": "halftone",
      "rule": { "es": "Brillo proporcional al ángulo entre normal de superficie y rayo luminoso", "en": "Surface brightness follows cosine of angle between normal & light" },
      "pop": false,
      "aka": ["medio tono", "ley de lambert", "halftone", "lambert cosine"],
      "wiki": "Lambertian_reflectance",
      "fact": {
        "es": "Las caras que miran de frente a la lámpara reciben densidad máxima de fotones; al girar oblicuamente hacia el terminador nace el degradado de medios tonos.",
        "en": "Planes facing light squarely receive maximum energy; as normals tilt toward the terminator, illumination rolls smoothly through halftones."
      }
    },
    {
      "id": "rembrandt-lighting",
      "name": { "es": "Iluminación Rembrandt (Triángulo en Mejilla)", "en": "Rembrandt Lighting Triangle" },
      "shortCode": "Key 45° · Δ Mejilla",
      "category": "light-shadow",
      "diagramKind": "rembrandt",
      "rule": { "es": "Luz lateral alta a 45° deja un triángulo luminoso bajo el ojo en sombra", "en": "45° high key light creates an illuminated triangle on the shadow cheek" },
      "pop": true,
      "aka": ["iluminacion rembrandt", "triangulo rembrandt", "rembrandt lighting"],
      "wiki": "Rembrandt_lighting",
      "fact": {
        "es": "Clásico retrato dramático de estudio y pintura barroca: cuando la sombra de la nariz se une a la de la mejilla deja atrapado un pequeño triángulo iluminado bajo el ojo.",
        "en": "Signature portrait setup where nose shadow meets cheek shadow, leaving a crisp triangle of light under the far eye."
      }
    },
    {
      "id": "rim-backlight",
      "name": { "es": "Contraluz y Luz de Recorte (Rim Light)", "en": "Rim Light / Backlighting" },
      "shortCode": "Borde Trasero",
      "category": "light-shadow",
      "diagramKind": "rim",
      "rule": { "es": "Fuente detrás del sujeto dibuja un filamento luminoso que despega la silueta", "en": "Rear light traces a crisp glowing halo edge separating form from dark" },
      "pop": true,
      "aka": ["contraluz", "luz de recorte", "rim light", "backlight"],
      "wiki": "Backlighting_(lighting)",
      "fact": {
        "es": "Esencial en cine noir, retrato y concept art: separa personajes oscuros de fondos sombríos trazando un perfil luminoso preciso.",
        "en": "Placed behind the subject to trace a crisp glowing contour edge, cleanly separating dark silhouettes from dark backgrounds."
      }
    },
    {
      "id": "chiaroscuro-tenebrism",
      "name": { "es": "Claroscuro y Tenebrismo (Alto Contraste)", "en": "Chiaroscuro & Tenebrism" },
      "shortCode": "Key Fuerte / Fondo Negro",
      "category": "light-shadow",
      "diagramKind": "tenebrism",
      "rule": { "es": "Dramatismo extremo entre luces concentradas y tinieblas profundas", "en": "Severe high-contrast spotlighting carving shapes out of deep dark" },
      "pop": false,
      "aka": ["claroscuro", "tenebrismo", "chiaroscuro", "tenebrism"],
      "wiki": "Chiaroscuro",
      "fact": {
        "es": "Llevado al extremo por Caravaggio y Artemisia Gentileschi ('spotlight effect'): elimina medios tonos neutros para enfocar todo el drama en rostros y manos.",
        "en": "Extreme baroque spotlight contrast championed by Caravaggio and Gentileschi, emerging crisp illuminated gestures out of pitch black."
      }
    },
    {
      "id": "subsurface-scattering",
      "name": { "es": "Dispersión Subsuperficial (Translucidez)", "en": "Subsurface Scattering (SSS)" },
      "shortCode": "Brillo Interno Cálido",
      "category": "light-shadow",
      "diagramKind": "sss",
      "rule": { "es": "La luz penetra piel, orejas, cera o hojas tiñendo de rojo cálido el borde", "en": "Light penetrates thin skin, wax, or leaves giving warm saturated bleed" },
      "pop": false,
      "aka": ["dispersion subsuperficial", "sss", "translucidez", "subsurface scattering"],
      "wiki": "Subsurface_scattering",
      "fact": {
        "es": "Explica por qué el terminador en piel viva, orejas a contraluz o uvas nunca es gris neutro sino más saturado y rojizo/anaranjado que el medio tono.",
        "en": "Why living skin, ears backlit by sun, wax, and leaves show a saturated warm orange-red glow along their terminator rather than dead grey."
      }
    }
  ]
};
