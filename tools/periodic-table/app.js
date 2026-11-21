(function () {
  'use strict';

  var STORE = SiteProgress.tool('periodic-table');

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

  var FAMILIES = {
    nonmetal:   { es: 'No metal reactivo',    en: 'Reactive nonmetal',   color: 'var(--c-nonmetal)' },
    noble:      { es: 'Gas noble',            en: 'Noble gas',           color: 'var(--c-noble)' },
    alkali:     { es: 'Metal alcalino',       en: 'Alkali metal',        color: 'var(--c-alkali)' },
    alkaline:   { es: 'Alcalinotérreo',       en: 'Alkaline earth',      color: 'var(--c-alkaline)' },
    metalloid:  { es: 'Metaloide',            en: 'Metalloid',           color: 'var(--c-metalloid)' },
    halogen:    { es: 'Halógeno',             en: 'Halogen',             color: 'var(--c-halogen)' },
    transition: { es: 'Metal de transición',  en: 'Transition metal',    color: 'var(--c-transition)' },
    post:       { es: 'Metal postransicional',en: 'Post-transition metal', color: 'var(--c-post)' },
    lanthanide: { es: 'Lantánido',            en: 'Lanthanide',          color: 'var(--c-lanthanide)' },
    actinide:   { es: 'Actínido',             en: 'Actinide',            color: 'var(--c-actinide)' }
  };

  var STATES = {
    gas:     { es: 'Gas',     en: 'Gas' },
    liquid:  { es: 'Líquido', en: 'Liquid' },
    solid:   { es: 'Sólido',  en: 'Solid' },
    unknown: { es: 'Sintético / desconocido', en: 'Synthetic / unknown' }
  };

  // [Z, sym, es, en, mass, row, col, fam, state, shells, useEs, useEn]
  var RAW_ELEMENTS = [
    [1, 'H', 'Hidrógeno', 'Hydrogen', '1.008', 1, 1, 'nonmetal', 'gas', [1], 'Combustible de cohetes, síntesis de amoníaco y pilas de combustible.', 'Rocket fuel, ammonia synthesis, and fuel cells.'],
    [2, 'He', 'Helio', 'Helium', '4.0026', 1, 18, 'noble', 'gas', [2], 'Refrigerante criogénico para imanes de resonancia magnética y globos.', 'Cryogenic coolant for MRI magnets and lifting gas in balloons.'],
    [3, 'Li', 'Litio', 'Lithium', '6.94', 2, 1, 'alkali', 'solid', [2, 1], 'Baterías recargables de ion-litio y estabilizador en aleaciones ligeras.', 'Rechargeable lithium-ion batteries and lightweight aerospace alloys.'],
    [4, 'Be', 'Berilio', 'Beryllium', '9.0122', 2, 2, 'alkaline', 'solid', [2, 2], 'Ventanas de rayos X, espejos espaciales y aleaciones de cobre antichispas.', 'X-ray tube windows, space telescope mirrors, and non-sparking alloys.'],
    [5, 'B', 'Boro', 'Boron', '10.81', 2, 13, 'metalloid', 'solid', [2, 3], 'Vidrio borosilicato (Pyrex), fibra de vidrio y barras de control nuclear.', 'Borosilicate glass (Pyrex), fiberglass, and nuclear control rods.'],
    [6, 'C', 'Carbono', 'Carbon', '12.011', 2, 14, 'nonmetal', 'solid', [2, 4], 'Base de la química orgánica, grafito, diamante, acero y fibra de carbono.', 'Backbone of organic life, graphite, diamond, steel, and carbon fiber.'],
    [7, 'N', 'Nitrógeno', 'Nitrogen', '14.007', 2, 15, 'nonmetal', 'gas', [2, 5], '78 % de la atmósfera, fertilizantes nitrogenados y criogenia líquida.', '78% of Earth’s atmosphere, fertilizers, and liquid-nitrogen cryogenics.'],
    [8, 'O', 'Oxígeno', 'Oxygen', '15.999', 2, 16, 'nonmetal', 'gas', [2, 6], 'Respiración celular, combustión, fabricación de acero y soporte médico.', 'Cellular respiration, combustion, steelmaking, and medical supply.'],
    [9, 'F', 'Flúor', 'Fluorine', '18.998', 2, 17, 'halogen', 'gas', [2, 7], 'Fluoruros dentales, recubrimientos de teflón y enriquecimiento de uranio.', 'Dental fluoride, PTFE (Teflon) coatings, and uranium processing.'],
    [10, 'Ne', 'Neón', 'Neon', '20.180', 2, 18, 'noble', 'gas', [2, 8], 'Tubos luminosos rojo-anaranjados y láseres de helio-neón.', 'Red-orange luminous discharge signs and helium-neon lasers.'],
    [11, 'Na', 'Sodio', 'Sodium', '22.990', 3, 1, 'alkali', 'solid', [2, 8, 1], 'Sal de mesa (NaCl), alumbrado de vapor amarillo y refrigerante nuclear.', 'Table salt (NaCl), yellow street lamps, and nuclear reactor coolant.'],
    [12, 'Mg', 'Magnesio', 'Magnesium', '24.305', 3, 2, 'alkaline', 'solid', [2, 8, 2], 'Centro de la clorofila, aleaciones ultraligeras y bengalas brillantes.', 'Core of chlorophyll molecules, lightweight alloys, and bright flares.'],
    [13, 'Al', 'Aluminio', 'Aluminum', '26.982', 3, 13, 'post', 'solid', [2, 8, 3], 'Fuselajes aeronáuticos, latas, cables eléctricos y láminas reflectantes.', 'Aircraft structures, beverage cans, power lines, and foil.'],
    [14, 'Si', 'Silicio', 'Silicon', '28.085', 3, 14, 'metalloid', 'solid', [2, 8, 4], 'Microchips semiconductores, paneles solares, vidrio y siliconas.', 'Semiconductor microchips, solar panels, glass, and silicones.'],
    [15, 'P', 'Fósforo', 'Phosphorus', '30.974', 3, 15, 'nonmetal', 'solid', [2, 8, 5], 'ADN y ATP biológico, fertilizantes fosfatados y cerillas de seguridad.', 'Biological DNA/ATP, phosphate fertilizers, and safety matches.'],
    [16, 'S', 'Azufre', 'Sulfur', '32.06', 3, 16, 'nonmetal', 'solid', [2, 8, 6], 'Ácido sulfúrico industrial, vulcanización del caucho y fungicidas.', 'Sulfuric acid production, rubber vulcanization, and fungicides.'],
    [17, 'Cl', 'Cloro', 'Chlorine', '35.45', 3, 17, 'halogen', 'gas', [2, 8, 7], 'Desinfección de agua potable, plásticos PVC y blanqueadores.', 'Drinking-water disinfection, PVC plastics, and bleaches.'],
    [18, 'Ar', 'Argón', 'Argon', '39.948', 3, 18, 'noble', 'gas', [2, 8, 8], 'Atmósfera inerte en soldadura TIG, bombillas y ventanas aislantes.', 'Inert shielding gas in TIG welding, bulbs, and double-pane windows.'],
    [19, 'K', 'Potasio', 'Potassium', '39.098', 4, 1, 'alkali', 'solid', [2, 8, 8, 1], 'Impulso nervioso en células, fertilizantes NPK y vidrio templado.', 'Nerve impulse signaling, NPK fertilizers, and toughened glass.'],
    [20, 'Ca', 'Calcio', 'Calcium', '40.078', 4, 2, 'alkaline', 'solid', [2, 8, 8, 2], 'Huesos, dientes, cemento Portland, cal y contracción muscular.', 'Bones, teeth, Portland cement, lime, and muscle contraction.'],
    [21, 'Sc', 'Escandio', 'Scandium', '44.956', 4, 3, 'transition', 'solid', [2, 8, 9, 2], 'Aleaciones aeroespaciales con aluminio y lámparas de estadio.', 'Aerospace aluminum alloys and high-intensity stadium lamps.'],
    [22, 'Ti', 'Titanio', 'Titanium', '47.867', 4, 4, 'transition', 'solid', [2, 8, 10, 2], 'Implantes médicos biocompatibles, aeronáutica y pigmento blanco TiO₂.', 'Biocompatible medical implants, aerospace, and white TiO₂ pigment.'],
    [23, 'V', 'Vanadio', 'Vanadium', '50.942', 4, 5, 'transition', 'solid', [2, 8, 11, 2], 'Aceros de alta resistencia para herramientas y baterías de flujo redox.', 'High-strength tool steels and grid-scale redox flow batteries.'],
    [24, 'Cr', 'Cromo', 'Chromium', '51.996', 4, 6, 'transition', 'solid', [2, 8, 13, 1], 'Acero inoxidable anticorrosivo, cromado brillante y pigmentos rubí.', 'Corrosion-resistant stainless steel, chrome plating, and ruby color.'],
    [25, 'Mn', 'Manganeso', 'Manganese', '54.938', 4, 7, 'transition', 'solid', [2, 8, 13, 2], 'Endurecimiento del acero ferroviario y cátodos de baterías.', 'Tough railway steel alloys and lithium-ion battery cathodes.'],
    [26, 'Fe', 'Hierro', 'Iron', '55.845', 4, 8, 'transition', 'solid', [2, 8, 14, 2], 'Acero estructural, hemoglobina sanguínea e imanes permanentes.', 'Structural steel, blood hemoglobin, and permanent magnets.'],
    [27, 'Co', 'Cobalto', 'Cobalt', '58.933', 4, 9, 'transition', 'solid', [2, 8, 15, 2], 'Superaleaciones de turbinas, baterías de ion-litio y pigmento azul cobalto.', 'Jet-turbine superalloys, lithium-ion batteries, and cobalt-blue pigment.'],
    [28, 'Ni', 'Níquel', 'Nickel', '58.693', 4, 10, 'transition', 'solid', [2, 8, 16, 2], 'Acero inoxidable, monedas, baterías y catalizadores de hidrogenación.', 'Stainless steel, coins, batteries, and hydrogenation catalysts.'],
    [29, 'Cu', 'Cobre', 'Copper', '63.546', 4, 11, 'transition', 'solid', [2, 8, 18, 1], 'Cableado eléctrico, tuberías, bronce y aleaciones antimicrobianas.', 'Electrical wiring, plumbing, bronze, and antimicrobial alloys.'],
    [30, 'Zn', 'Zinc', 'Zinc', '65.38', 4, 12, 'transition', 'solid', [2, 8, 18, 2], 'Galvanizado anticorrosivo del acero, latón y enzimas celulares.', 'Galvanizing steel against rust, brass alloys, and cellular enzymes.'],
    [31, 'Ga', 'Galio', 'Gallium', '69.723', 4, 13, 'post', 'solid', [2, 8, 18, 3], 'Se funde en la mano (30 °C); diodos LED azules y chips GaAs.', 'Melts in your hand (30 °C); blue LEDs and high-speed GaAs chips.'],
    [32, 'Ge', 'Germanio', 'Germanium', '72.630', 4, 14, 'metalloid', 'solid', [2, 8, 18, 4], 'Fibra óptica, lentes infrarrojas y primeros transistores.', 'Fiber-optic cores, infrared optics, and early transistors.'],
    [33, 'As', 'Arsénico', 'Arsenic', '74.922', 4, 15, 'metalloid', 'solid', [2, 8, 18, 5], 'Semiconductores GaAs, dopante electrónico y conservantes industriales.', 'GaAs high-frequency semiconductors and electronic dopants.'],
    [34, 'Se', 'Selenio', 'Selenium', '78.971', 4, 16, 'nonmetal', 'solid', [2, 8, 18, 6], 'Células fotovoltaicas, decolorante del vidrio y micronutriente esencial.', 'Photovoltaic cells, glass decolorizer, and essential trace nutrient.'],
    [35, 'Br', 'Bromo', 'Bromine', '79.904', 4, 17, 'halogen', 'liquid', [2, 8, 18, 7], 'Único no metal líquido a 25 °C; retardantes de llama y haluros de plata.', 'Only liquid nonmetal at room temp; flame retardants and silver bromide.'],
    [36, 'Kr', 'Kriptón', 'Krypton', '83.798', 4, 18, 'noble', 'gas', [2, 8, 18, 8], 'Flashes fotográficos de alta velocidad y ventanas de triple acristalamiento.', 'High-speed camera flashes and insulated triple-pane windows.'],
    [37, 'Rb', 'Rubidio', 'Rubidium', '85.468', 5, 1, 'alkali', 'solid', [2, 8, 18, 8, 1], 'Relojes atómicos de alta precisión y experimentos de condensado cuántico.', 'Precision atomic clocks and laser-cooled quantum experiments.'],
    [38, 'Sr', 'Estroncio', 'Strontium', '87.62', 5, 2, 'alkaline', 'solid', [2, 8, 18, 8, 2], 'Fuegos artificiales de color rojo intenso y relojes atómicos ópticos.', 'Deep-red fireworks and next-generation optical lattice clocks.'],
    [39, 'Y', 'Itrio', 'Yttrium', '88.906', 5, 3, 'transition', 'solid', [2, 8, 18, 9, 2], 'Láseres YAG, fósforos de pantallas LED y superconductores YBCO.', 'YAG lasers, LED display phosphors, and YBCO superconductors.'],
    [40, 'Zr', 'Circonio', 'Zirconium', '91.224', 5, 4, 'transition', 'solid', [2, 8, 18, 10, 2], 'Revestimiento de combustible nuclear, cerámicas dentales y circonio cúbico.', 'Nuclear fuel cladding, dental ceramics, and cubic zirconia.'],
    [41, 'Nb', 'Niobio', 'Niobium', '92.906', 5, 5, 'transition', 'solid', [2, 8, 18, 12, 1], 'Imanes superconductores de aceleradores de partículas y aceros de oleoductos.', 'Superconducting magnets in particle accelerators and pipeline steel.'],
    [42, 'Mo', 'Molibdeno', 'Molybdenum', '95.95', 5, 6, 'transition', 'solid', [2, 8, 18, 13, 1], 'Aceros refractarios, lubricantes MoS₂ y enzimas fijadoras de nitrógeno.', 'High-temp steel alloys, MoS₂ lubricants, and nitrogenase enzymes.'],
    [43, 'Tc', 'Tecnecio', 'Technetium', '98', 5, 7, 'transition', 'solid', [2, 8, 18, 13, 2], 'Elemento más ligero sin isótopos estables; trazador Tc-99m en medicina nuclear.', 'Lightest element with no stable isotopes; Tc-99m medical imaging tracer.'],
    [44, 'Ru', 'Rutenio', 'Ruthenium', '101.07', 5, 8, 'transition', 'solid', [2, 8, 18, 15, 1], 'Contactos eléctricos resistentes al desgaste y catalizadores químicos.', 'Wear-resistant electrical contacts and organometallic catalysts.'],
    [45, 'Rh', 'Rodio', 'Rhodium', '102.91', 5, 9, 'transition', 'solid', [2, 8, 18, 16, 1], 'Catalizadores de escape automotriz y baño brillante para joyería.', 'Automotive catalytic converters and tarnish-proof jewelry plating.'],
    [46, 'Pd', 'Paladio', 'Palladium', '106.42', 5, 10, 'transition', 'solid', [2, 8, 18, 18], 'Convertidores catalíticos, purificación de hidrógeno y odontología.', 'Catalytic converters, hydrogen purification membranes, and dentistry.'],
    [47, 'Ag', 'Plata', 'Silver', '107.87', 5, 11, 'transition', 'solid', [2, 8, 18, 18, 1], 'Mayor conductividad eléctrica y térmica; espejos, contactos y joyería.', 'Highest electrical and thermal conductivity; mirrors, contacts, and jewelry.'],
    [48, 'Cd', 'Cadmio', 'Cadmium', '112.41', 5, 12, 'transition', 'solid', [2, 8, 18, 18, 2], 'Células solares CdTe, puntos cuánticos y baterías Ni-Cd (en desuso).', 'CdTe thin-film solar panels, quantum dots, and legacy Ni-Cd cells.'],
    [49, 'In', 'Indio', 'Indium', '114.82', 5, 13, 'post', 'solid', [2, 8, 18, 18, 3], 'Óxido ITO transparente en pantallas táctiles y soldaduras de bajo punto de fusión.', 'Transparent ITO touchscreens and low-melting-point solders.'],
    [50, 'Sn', 'Estaño', 'Tin', '118.71', 5, 14, 'post', 'solid', [2, 8, 18, 18, 4], 'Soldadura electrónica sin plomo, hojalata alimentaria y bronce.', 'Lead-free electronics solder, food-can tinplate, and bronze.'],
    [51, 'Sb', 'Antimonio', 'Antimony', '121.76', 5, 15, 'metalloid', 'solid', [2, 8, 18, 18, 5], 'Retardantes de llama textiles, aleaciones de baterías de plomo y diodos.', 'Flame retardants, lead-acid battery grid alloys, and IR detectors.'],
    [52, 'Te', 'Telurio', 'Tellurium', '127.60', 5, 16, 'metalloid', 'solid', [2, 8, 18, 18, 6], 'Paneles solares CdTe, refrigeración termoeléctrica y metalurgia.', 'CdTe solar cells, thermoelectric coolers, and steel machinability.'],
    [53, 'I', 'Yodo', 'Iodine', '126.90', 5, 17, 'halogen', 'solid', [2, 8, 18, 18, 7], 'Hormonas tiroideas, antisépticos médicos y sal yodada.', 'Thyroid hormones, medical antiseptics, and iodized table salt.'],
    [54, 'Xe', 'Xenón', 'Xenon', '131.29', 5, 18, 'noble', 'gas', [2, 8, 18, 18, 8], 'Propulsores iónicos espaciales, faros de arco y anestesia médica.', 'Spacecraft ion thrusters, arc lamps, and medical anesthesia.'],
    [55, 'Cs', 'Cesio', 'Cesium', '132.91', 6, 1, 'alkali', 'solid', [2, 8, 18, 18, 8, 1], 'Define el segundo en el Sistema Internacional (relojes atómicos de Cs-133).', 'Defines the SI second via Cs-133 atomic clock transitions.'],
    [56, 'Ba', 'Bario', 'Barium', '137.33', 6, 2, 'alkaline', 'solid', [2, 8, 18, 18, 8, 2], 'Contraste radiográfico digestivo (BaSO₄) y pirotecnia verde.', 'Medical X-ray digestive contrast (BaSO₄) and green fireworks.'],
    [57, 'La', 'Lantano', 'Lanthanum', '138.91', 9, 4, 'lanthanide', 'solid', [2, 8, 18, 18, 9, 2], 'Lentes de cámaras de alto índice de refracción y electrodos NiMH.', 'High-refractive-index camera lenses and NiMH hybrid car batteries.'],
    [58, 'Ce', 'Cerio', 'Cerium', '140.12', 9, 5, 'lanthanide', 'solid', [2, 8, 18, 19, 9, 2], 'Piedras de encendedor (mischmetal), pulido de vidrio y catalizadores.', 'Lighter flints (ferrocerium), optical glass polishing, and converters.'],
    [59, 'Pr', 'Praseodimio', 'Praseodymium', '140.91', 9, 6, 'lanthanide', 'solid', [2, 8, 18, 21, 8, 2], 'Gafas protectoras de soldador, imanes de alta fuerza y esmaltes amarillos.', 'Welder safety goggles, strong magnets, and yellow ceramic glazes.'],
    [60, 'Nd', 'Neodimio', 'Neodymium', '144.24', 9, 7, 'lanthanide', 'solid', [2, 8, 18, 22, 8, 2], 'Los imanes permanentes más potentes (NdFeB) en motores eléctricos y audio.', 'Strongest permanent magnets (NdFeB) for EV motors and speakers.'],
    [61, 'Pm', 'Prometio', 'Promethium', '145', 9, 8, 'lanthanide', 'solid', [2, 8, 18, 23, 8, 2], 'Único lantánido sin isótopos estables; baterías nucleares en miniatura.', 'Only radioactive-only lanthanide; miniature betavoltaic batteries.'],
    [62, 'Sm', 'Samario', 'Samarium', '150.36', 9, 9, 'lanthanide', 'solid', [2, 8, 18, 24, 8, 2], 'Imanes SmCo estables a altas temperaturas y terapia oncológica.', 'High-temperature SmCo permanent magnets and targeted cancer therapy.'],
    [63, 'Eu', 'Europio', 'Europium', '151.96', 9, 10, 'lanthanide', 'solid', [2, 8, 18, 25, 8, 2], 'Fósforos fluorescentes rojos y azules en billetes euro y LEDs.', 'Red and blue fluorescent phosphors in euro banknotes and LEDs.'],
    [64, 'Gd', 'Gadolinio', 'Gadolinium', '157.25', 9, 11, 'lanthanide', 'solid', [2, 8, 18, 25, 9, 2], 'Agentes de contraste paramagnéticos para resonancia magnética (MRI).', 'Paramagnetic intravenous contrast agents for MRI scans.'],
    [65, 'Tb', 'Terbio', 'Terbium', '158.93', 9, 12, 'lanthanide', 'solid', [2, 8, 18, 27, 8, 2], 'Fósforos verdes en iluminación eficiente y actuadores magnetostrictivos.', 'Green phosphors in energy-efficient lighting and Terfenol actuators.'],
    [66, 'Dy', 'Disprosio', 'Dysprosium', '162.50', 9, 13, 'lanthanide', 'solid', [2, 8, 18, 28, 8, 2], 'Aditivo en imanes de neodimio para resistir calor en aerogeneradores.', 'Additive in NdFeB magnets to prevent demagnetization at high heat.'],
    [67, 'Ho', 'Holmio', 'Holmium', '164.93', 9, 14, 'lanthanide', 'solid', [2, 8, 18, 29, 8, 2], 'Posee el mayor momento magnético atómico; láseres quirúrgicos.', 'Highest magnetic moment of any element; medical surgical lasers.'],
    [68, 'Er', 'Erbio', 'Erbium', '167.26', 9, 15, 'lanthanide', 'solid', [2, 8, 18, 30, 8, 2], 'Amplificadores ópticos de fibra submarina que impulsan Internet.', 'Optical fiber amplifiers (EDFA) powering long-haul Internet cables.'],
    [69, 'Tm', 'Tulio', 'Thulium', '168.93', 9, 16, 'lanthanide', 'solid', [2, 8, 18, 31, 8, 2], 'Fuentes portátiles de rayos X y láseres médicos de estado sólido.', 'Portable medical X-ray sources and surgical solid-state lasers.'],
    [70, 'Yb', 'Iterbio', 'Ytterbium', '173.05', 9, 17, 'lanthanide', 'solid', [2, 8, 18, 32, 8, 2], 'Láseres de fibra industrial, relojes ópticos y aceros inoxidables.', 'High-power industrial fiber lasers and optical atomic clocks.'],
    [71, 'Lu', 'Lutecio', 'Lutetium', '174.97', 9, 18, 'lanthanide', 'solid', [2, 8, 18, 32, 9, 2], 'Centelleadores para tomografía PET y refinación petroquímica.', 'PET medical scanner scintillator crystals and petroleum catalysts.'],
    [72, 'Hf', 'Hafnio', 'Hafnium', '178.49', 6, 4, 'transition', 'solid', [2, 8, 18, 32, 10, 2], 'Aislantes high-k en microprocesadores modernos y barras nucleares.', 'High-k gate dielectrics in modern CPUs and nuclear control rods.'],
    [73, 'Ta', 'Tantalio', 'Tantalum', '180.95', 6, 5, 'transition', 'solid', [2, 8, 18, 32, 11, 2], 'Condensadores electrónicos compactos e implantes óseos inertes.', 'Compact SMD capacitors in phones and inert surgical implants.'],
    [74, 'W', 'Wolframio', 'Tungsten', '183.84', 6, 6, 'transition', 'solid', [2, 8, 18, 32, 12, 2], 'Mayor punto de fusión entre los metales (3422 °C); filamentos y carburos.', 'Highest melting point of all metals (3422 °C); filaments and carbide tools.'],
    [75, 'Re', 'Renio', 'Rhenium', '186.21', 6, 7, 'transition', 'solid', [2, 8, 18, 32, 13, 2], 'Álabes monocristalinos de motores a reacción y termopares extremos.', 'Single-crystal jet-engine turbine blades and high-temp thermocouples.'],
    [76, 'Os', 'Osmio', 'Osmium', '190.23', 6, 8, 'transition', 'solid', [2, 8, 18, 32, 14, 2], 'Elemento natural más denso (22.59 g/cm³); puntas de pluma y contactos.', 'Densest naturally occurring element (22.59 g/cm³); pen nibs and alloys.'],
    [77, 'Ir', 'Iridio', 'Iridium', '192.22', 6, 9, 'transition', 'solid', [2, 8, 18, 32, 15, 2], 'Ultra resistente a la corrosión; bujías aeronáuticas y capa K-Pg de meteoritos.', 'Extreme corrosion resistance; spark plugs and asteroid K-Pg boundary layer.'],
    [78, 'Pt', 'Platino', 'Platinum', '195.08', 6, 10, 'transition', 'solid', [2, 8, 18, 32, 17, 1], 'Catalizadores de escape y pilas de combustible, quimioterapia y joyería.', 'Catalytic converters, hydrogen fuel cells, cisplatin chemo, and jewelry.'],
    [79, 'Au', 'Oro', 'Gold', '196.97', 6, 11, 'transition', 'solid', [2, 8, 18, 32, 18, 1], 'Conectores electrónicos inoxidables, escudos térmicos espaciales y reserva.', 'Tarnish-free microelectronic contacts, space thermal foil, and bullion.'],
    [80, 'Hg', 'Mercurio', 'Mercury', '200.59', 6, 12, 'transition', 'liquid', [2, 8, 18, 32, 18, 2], 'Único metal líquido a temperatura ambiente; barómetros y lámparas fluorescentes.', 'Only metal that is liquid at room temperature; barometers and fluorescent lamps.'],
    [81, 'Tl', 'Talio', 'Thallium', '204.38', 6, 13, 'post', 'solid', [2, 8, 18, 32, 18, 3], 'Detectores infrarrojos, vidrios de alto índice y gammagrafía cardíaca.', 'Infrared optical crystals, specialized glass, and cardiac imaging.'],
    [82, 'Pb', 'Plomo', 'Lead', '207.2', 6, 14, 'post', 'solid', [2, 8, 18, 32, 18, 4], 'Blindaje contra radiación X/gamma y baterías de ácido-plomo.', 'X-ray and gamma radiation shielding and automotive lead-acid batteries.'],
    [83, 'Bi', 'Bismuto', 'Bismuth', '208.98', 6, 15, 'post', 'solid', [2, 8, 18, 32, 18, 5], 'Cristales iridiscentes en escalera, sustituto atóxico del plomo y antiácidos.', 'Iridescent hopper crystals, non-toxic lead replacement, and Pepto-Bismol.'],
    [84, 'Po', 'Polonio', 'Polonium', '209', 6, 16, 'post', 'solid', [2, 8, 18, 32, 18, 6], 'Descubierto por Marie y Pierre Curie; eliminadores industriales de estática.', 'Discovered by Marie and Pierre Curie; industrial anti-static brushes.'],
    [85, 'At', 'Ástato', 'Astatine', '210', 6, 17, 'halogen', 'solid', [2, 8, 18, 32, 18, 7], 'Elemento natural más escaso en la corteza terrestre; radiofármacos alfa.', 'Rarest naturally occurring element on Earth; targeted alpha-therapy research.'],
    [86, 'Rn', 'Radón', 'Radon', '222', 6, 18, 'noble', 'gas', [2, 8, 18, 32, 18, 8], 'Gas noble radiactivo que emana del subsuelo granítico; vigilancia ambiental.', 'Radioactive noble gas seeping from granite bedrock; indoor safety monitoring.'],
    [87, 'Fr', 'Francio', 'Francium', '223', 7, 1, 'alkali', 'solid', [2, 8, 18, 32, 18, 8, 1], 'Altamente radiactivo y efímero (vida media 22 min); espectroscopia atómica.', 'Extremely short-lived radioactive alkali metal (22 min half-life); physics research.'],
    [88, 'Ra', 'Radio', 'Radium', '226', 7, 2, 'alkaline', 'solid', [2, 8, 18, 32, 18, 8, 2], 'Históricas pinturas luminiscentes e investigación nuclear temprana; terapia Ra-223.', 'Historical luminous dials and modern Ra-223 bone-metastasis therapy.'],
    [89, 'Ac', 'Actinio', 'Actinium', '227', 10, 4, 'actinide', 'solid', [2, 8, 18, 32, 18, 9, 2], 'Brilla suavemente en azul en la oscuridad; fuentes de neutrones y Ac-225 médico.', 'Glows pale blue in the dark; neutron sources and Ac-225 cancer therapy.'],
    [90, 'Th', 'Torio', 'Thorium', '232.04', 10, 5, 'actinide', 'solid', [2, 8, 18, 32, 18, 10, 2], 'Mantos de lámparas de gas, electrodos TIG y reactores nucleares de torio.', 'Gas lantern mantles, TIG welding electrodes, and molten-salt reactor research.'],
    [91, 'Pa', 'Protactinio', 'Protactinium', '231.04', 10, 6, 'actinide', 'solid', [2, 8, 18, 32, 20, 9, 2], 'Intermediario radiactivo de desintegración usado para datar sedimentos marinos.', 'Rare radioactive decay intermediate used in ocean-sediment radiometric dating.'],
    [92, 'U', 'Uranio', 'Uranium', '238.03', 10, 7, 'actinide', 'solid', [2, 8, 18, 32, 21, 9, 2], 'Combustible principal de centrales nucleares (U-235) y datación geológica.', 'Primary fuel in nuclear power reactors (U-235) and geological dating.'],
    [93, 'Np', 'Neptunio', 'Neptunium', '237', 10, 8, 'actinide', 'solid', [2, 8, 18, 32, 22, 9, 2], 'Primer elemento transuránico sintetizado; precursor de Pu-238 espacial.', 'First synthetic transuranium element; precursor for spacecraft Pu-238.'],
    [94, 'Pu', 'Plutonio', 'Plutonium', '244', 10, 9, 'actinide', 'solid', [2, 8, 18, 32, 24, 8, 2], 'Generadores termoeléctricos (Pu-238) en sondas Voyager, Cassini y Perseverance.', 'Radioisotope power (Pu-238) aboard Voyager, Cassini, and Mars rovers.'],
    [95, 'Am', 'Americio', 'Americium', '243', 10, 10, 'actinide', 'solid', [2, 8, 18, 32, 25, 8, 2], 'Detectores domésticos de humo por ionización (Am-241).', 'Ionization chamber source inside household smoke detectors (Am-241).'],
    [96, 'Cm', 'Curio', 'Curium', '247', 10, 11, 'actinide', 'solid', [2, 8, 18, 32, 25, 9, 2], 'Espectrómetros de partículas alfa APXS en rovers marcianos.', 'Alpha particle X-ray spectrometers (APXS) aboard Mars rovers.'],
    [97, 'Bk', 'Berkelio', 'Berkelium', '247', 10, 12, 'actinide', 'solid', [2, 8, 18, 32, 27, 8, 2], 'Blanco clave en aceleradores para sintetizar elementos superpesados como Ts.', 'Target material in particle accelerators to synthesize superheavy elements.'],
    [98, 'Cf', 'Californio', 'Californium', '251', 10, 13, 'actinide', 'solid', [2, 8, 18, 32, 28, 8, 2], 'Potente emisor de neutrones (Cf-252) para arranque de reactores y escáneres.', 'Intense neutron source (Cf-252) for reactor startup and mineral analysis.'],
    [99, 'Es', 'Einstenio', 'Einsteinium', '252', 10, 14, 'actinide', 'solid', [2, 8, 18, 32, 29, 8, 2], 'Descubierto en restos de pruebas termonucleares en 1952; investigación química.', 'Discovered in 1952 test debris; studied in microgram-scale coordination chemistry.'],
    [100, 'Fm', 'Fermio', 'Fermium', '257', 10, 15, 'actinide', 'solid', [2, 8, 18, 32, 30, 8, 2], 'Elemento más pesado obtenible por bombardeo de neutrones en reactores.', 'Heaviest element reachable by neutron bombardment inside nuclear reactors.'],
    [101, 'Md', 'Mendelevio', 'Mendelevium', '258', 10, 16, 'actinide', 'solid', [2, 8, 18, 32, 31, 8, 2], 'Nombrado por Dmitri Mendeléyev; producido átomo a átomo en aceleradores.', 'Named after Dmitri Mendeleev; produced atom-by-atom in cyclotrons.'],
    [102, 'No', 'Nobelio', 'Nobelium', '259', 10, 17, 'actinide', 'solid', [2, 8, 18, 32, 32, 8, 2], 'Nombrado por Alfred Nobel; exhibe estado de oxidación +2 inesperadamente estable.', 'Named after Alfred Nobel; exhibits an unusually stable +2 oxidation state.'],
    [103, 'Lr', 'Lawrencio', 'Lawrencium', '266', 10, 18, 'actinide', 'solid', [2, 8, 18, 32, 32, 8, 3], 'Último actínido; nombrado en honor a Ernest Lawrence, inventor del ciclotrón.', 'Final actinide; named for Ernest Lawrence, inventor of the cyclotron.'],
    [104, 'Rf', 'Rutherfordio', 'Rutherfordium', '267', 7, 4, 'transition', 'unknown', [2, 8, 18, 32, 32, 10, 2], 'Primer elemento transactínido; nombrado en honor a Ernest Rutherford.', 'First transactinide element; named in honor of Ernest Rutherford.'],
    [105, 'Db', 'Dubnio', 'Dubnium', '268', 7, 5, 'transition', 'unknown', [2, 8, 18, 32, 32, 11, 2], 'Nombrado por el centro nuclear ruso de Dubná; vida media de horas en Db-268.', 'Named after the Joint Institute in Dubna; Db-268 lives over a day.'],
    [106, 'Sg', 'Seaborgio', 'Seaborgium', '269', 7, 6, 'transition', 'unknown', [2, 8, 18, 32, 32, 12, 2], 'Nombrado en vida de Glenn T. Seaborg; forma compuestos hexacarbonílicos.', 'Named for Glenn T. Seaborg; forms volatile hexacarbonyl complexes.'],
    [107, 'Bh', 'Bohrio', 'Bohrium', '270', 7, 7, 'transition', 'unknown', [2, 8, 18, 32, 32, 13, 2], 'Nombrado en honor a Niels Bohr; química comparable al renio.', 'Named after Niels Bohr; exhibits group-7 chemistry like rhenium.'],
    [108, 'Hs', 'Hasio', 'Hassium', '277', 7, 8, 'transition', 'unknown', [2, 8, 18, 32, 32, 14, 2], 'Nombrado por el estado alemán de Hesse; forma tetróxido volátil HsO₄.', 'Named for the German state of Hesse; forms volatile tetroxide HsO₄.'],
    [109, 'Mt', 'Meitnerio', 'Meitnerium', '278', 7, 9, 'transition', 'unknown', [2, 8, 18, 32, 32, 15, 2], 'Nombrado en homenaje a Lise Meitner, pionera de la fisión nuclear.', 'Honors Lise Meitner, co-discoverer of nuclear fission.'],
    [110, 'Ds', 'Darmstatio', 'Darmstadtium', '281', 7, 10, 'transition', 'unknown', [2, 8, 18, 32, 32, 16, 2], 'Sintetizado en GSI Darmstadt, Alemania; análogo superpesado del platino.', 'Synthesized at GSI Darmstadt; superheavy group-10 homolog of platinum.'],
    [111, 'Rg', 'Roentgenio', 'Roentgenium', '282', 7, 11, 'transition', 'unknown', [2, 8, 18, 32, 32, 17, 2], 'Nombrado por Wilhelm Röntgen, descubridor de los rayos X.', 'Named after Wilhelm Röntgen, discoverer of X-rays.'],
    [112, 'Cn', 'Copernicio', 'Copernicium', '285', 7, 12, 'transition', 'unknown', [2, 8, 18, 32, 32, 18, 2], 'Nombrado por Nicolás Copérnico; efectos relativistas lo hacen casi noble.', 'Named after Nicolaus Copernicus; relativistic effects make it unusually volatile.'],
    [113, 'Nh', 'Nihonio', 'Nihonium', '286', 7, 13, 'post', 'unknown', [2, 8, 18, 32, 32, 18, 3], 'Primer elemento descubierto en Asia (RIKEN, Japón); de “Nihon”.', 'First element discovered in Asia (RIKEN, Japan); named after “Nihon”.'],
    [114, 'Fl', 'Flerovio', 'Flerovium', '289', 7, 14, 'post', 'unknown', [2, 8, 18, 32, 32, 18, 4], 'Nombrado por el Laboratorio Flerov; cercano a la isla de estabilidad nuclear.', 'Named for the Flerov Laboratory; probes the nuclear island of stability.'],
    [115, 'Mc', 'Moscovio', 'Moscovium', '290', 7, 15, 'post', 'unknown', [2, 8, 18, 32, 32, 18, 5], 'Nombrado por la región de Moscú; sintetizado fusionando Am-243 y Ca-48.', 'Named after Moscow Oblast; made by fusing Am-243 with Ca-48.'],
    [116, 'Lv', 'Livermorio', 'Livermorium', '293', 7, 16, 'post', 'unknown', [2, 8, 18, 32, 32, 18, 6], 'Nombrado por el Lawrence Livermore National Laboratory en California.', 'Named after Lawrence Livermore National Laboratory in California.'],
    [117, 'Ts', 'Teneso', 'Tennessine', '294', 7, 17, 'halogen', 'unknown', [2, 8, 18, 32, 32, 18, 7], 'Nombrado por Tennessee; por efectos relativistas muestra rasgos metaloides.', 'Named after Tennessee; relativistic effects give it metalloid character.'],
    [118, 'Og', 'Oganesón', 'Oganesson', '294', 7, 18, 'noble', 'unknown', [2, 8, 18, 32, 32, 18, 8], 'Elemento 118, en honor a Yuri Oganesián; único grupo 18 presumiblemente sólido.', 'Element 118, honoring Yuri Oganessian; expected solid due to relativistic effects.']
  ];

  var ELEMENTS = RAW_ELEMENTS.map(function (r) {
    return {
      z: r[0],
      sym: r[1],
      es: r[2],
      en: r[3],
      mass: r[4],
      row: r[5],
      col: r[6],
      fam: r[7],
      state: r[8],
      shells: r[9],
      useEs: r[10],
      useEn: r[11],
      period: r[5] <= 7 ? r[5] : (r[5] === 9 ? 6 : 7),
      group: r[5] <= 7 ? r[6] : 3
    };
  });

  var BY_Z = {};
  ELEMENTS.forEach(function (el) { BY_Z[el.z] = el; });

  var ELEMENT_PHOTOS = {
    1: ["https://upload.wikimedia.org/wikipedia/commons/d/d9/Hydrogenglow.jpg", "Vial of glowing ultrapure hydrogen, H2. Original size in cm: 1 x 5"],
    2: ["https://upload.wikimedia.org/wikipedia/commons/0/00/Helium-glow.jpg", "Vial of glowing ultrapure helium. Original size in cm: 1 x 5"],
    3: ["https://upload.wikimedia.org/wikipedia/commons/e/e2/0.5_grams_lithium_under_argon.jpg", "0.5 Grams Lithium under Argon. Original size of the largest piece in cm: 0.3 x 4"],
    4: ["https://upload.wikimedia.org/wikipedia/commons/e/e2/Beryllium_%28Be%29.jpg", "Pure Beryllium bead, 2.5 grams. Original size in cm: 1 x 1.5"],
    5: ["https://upload.wikimedia.org/wikipedia/commons/a/a2/Boron.jpg", "Pure Crystalline Boron, front and back side. Original size in cm: 2 x 3"],
    6: ["https://upload.wikimedia.org/wikipedia/commons/6/68/Pure_Carbon.png", "Element 6 - Carbon"],
    7: ["https://upload.wikimedia.org/wikipedia/commons/2/2d/Nitrogen-glow.jpg", "Vial of Glowing Ultrapure Nitrogen, N2. Original size in cm: 1 x 5"],
    8: ["https://upload.wikimedia.org/wikipedia/commons/a/a0/Liquid_oxygen_in_a_beaker_%28cropped_and_retouched%29.jpg", "Liquid Oxygen in a Beaker"],
    9: ["https://upload.wikimedia.org/wikipedia/commons/2/2c/Fluoro_liquido_a_-196%C2%B0C_1.jpg", "Liquid Fluorine at -196°C"],
    10: ["https://upload.wikimedia.org/wikipedia/commons/f/f8/Neon-glow.jpg", "Vial of Glowing Ultrapure neon. Original size in cm: 1 x 5"],
    11: ["https://upload.wikimedia.org/wikipedia/commons/2/27/Na_%28Sodium%29.jpg", "Na (Sodium) Metal"],
    12: ["https://upload.wikimedia.org/wikipedia/commons/3/3f/Magnesium_crystals.jpg", "Magnesium crystals"],
    13: ["https://upload.wikimedia.org/wikipedia/commons/3/3e/Aluminium.jpg", "Pure aluminium foil. Original size in cm: 5 x 5"],
    14: ["https://upload.wikimedia.org/wikipedia/commons/2/2c/Silicon.jpg", "Chunk of Ultrapure Silicon, 2 x 2 cm"],
    15: ["https://upload.wikimedia.org/wikipedia/commons/6/6d/Phosphorus-purple.jpg", "Purple Phosphorus"],
    16: ["https://upload.wikimedia.org/wikipedia/commons/2/23/Native_sulfur_%28Vodinskoe_Deposit%3B_quarry_near_Samara%2C_Russia%29_9.jpg", "Native Sulfur From Russia"],
    17: ["https://upload.wikimedia.org/wikipedia/commons/9/9a/Chlorine-sample-flip.jpg", "A Sample of Chlorine"],
    18: ["https://upload.wikimedia.org/wikipedia/commons/5/53/Argon-glow.jpg", "Vial of glowing ultrapure argon. Original size in cm: 1 x 5"],
    19: ["https://upload.wikimedia.org/wikipedia/commons/b/b3/Potassium.JPG", "Potassium Pieces"],
    20: ["https://upload.wikimedia.org/wikipedia/commons/7/72/Calcium.jpg", "Calcium Grains, grain size about 1 mm"],
    21: ["https://upload.wikimedia.org/wikipedia/commons/f/f5/Scandium%2C_Sc.jpg", "Crystal of Scandium. About 1g"],
    22: ["https://upload.wikimedia.org/wikipedia/commons/e/ec/Titanium.jpg", "Titanium Crystal made with the van Arkel-de Booer Process. 87 grams, Original size in cm: 2.5 x 4"],
    23: ["https://upload.wikimedia.org/wikipedia/commons/0/0a/Vanadium-pieces.jpg", "Pieces of Pure Vanadium with Oxide Layer"],
    24: ["https://upload.wikimedia.org/wikipedia/commons/a/a1/Chromium.jpg", "Piece of Chromium Metal"],
    25: ["https://upload.wikimedia.org/wikipedia/commons/6/64/Manganese_element.jpg", "Two Pieces of Manganese Metal"],
    26: ["https://images-of-elements.com/iron-2.jpg", "Fragments of an iron meteorite, about 92% iron. Original size in cm: 0.4 - 0.8"],
    27: ["https://upload.wikimedia.org/wikipedia/commons/6/62/Cobalt_ore_2.jpg", "Fractions from cobalt, 7 and 4 grams. Original size in cm: 2 x 2"],
    28: ["https://upload.wikimedia.org/wikipedia/commons/5/57/Nickel_chunk.jpg", "Nickel Chunk"],
    29: ["https://upload.wikimedia.org/wikipedia/commons/f/f0/NatCopper.jpg", "Macro of Native Copper about 4 cm in size"],
    30: ["https://upload.wikimedia.org/wikipedia/commons/b/ba/Zinc_%2830_Zn%29.jpg", "30 grams Zinc, front and back side. Original size in cm: 3"],
    31: ["https://upload.wikimedia.org/wikipedia/commons/b/b1/Solid_gallium_%28Ga%29.jpg", "Solid gallium at room temperature"],
    32: ["https://upload.wikimedia.org/wikipedia/commons/0/08/Polycrystalline-germanium.jpg", "12 Grams Polycrystalline Germanium, 2x3 cm"],
    33: ["https://upload.wikimedia.org/wikipedia/commons/3/3b/Arsenic_%2833_As%29.jpg", "Ultrapure Metallic Arsenic under Argon, 1 - 2 grams"],
    34: ["https://upload.wikimedia.org/wikipedia/commons/7/7f/Selenium.jpg", "Ultrapure Black Amorphous Selenium, 3 - 4 grams"],
    35: ["https://upload.wikimedia.org/wikipedia/commons/8/87/Bromine-ampoule.jpg", "99.5% pure liquid Bromine in a glass ampoule"],
    36: ["https://upload.wikimedia.org/wikipedia/commons/9/9c/Krypton-glow.jpg", "Vial of Glowing Ultrapure Krypton"],
    37: ["https://upload.wikimedia.org/wikipedia/commons/c/c9/Rb5.JPG", "Rubidium Metal Sample"],
    38: ["https://upload.wikimedia.org/wikipedia/commons/8/84/Strontium-1.jpg", "Strontium Pieces under Paraffin Oil"],
    39: ["https://upload.wikimedia.org/wikipedia/commons/9/90/Piece_of_Yttrium.jpg", "6.21g Yttrium, 99% purity"],
    40: ["https://upload.wikimedia.org/wikipedia/commons/1/1d/Zirconium-pieces.jpg", "Two pieces of Zirconium, 1 cm each"],
    41: ["https://upload.wikimedia.org/wikipedia/commons/c/c2/Niobium_strips.JPG", "Niobium strips"],
    42: ["https://upload.wikimedia.org/wikipedia/commons/f/f0/Molybdenum.jpg", "99.9% Pure Molybdenum Crystal, 2 x 3 cm"],
    43: ["https://upload.wikimedia.org/wikipedia/commons/a/ab/Technetium-sample-cropped.jpg", "Technetium-99 sample inside sealed glass ampoule"],
    44: ["https://upload.wikimedia.org/wikipedia/commons/a/a8/Ruthenium_crystal.jpg", "Ruthenium Crystal, 0.6 grams"],
    45: ["https://upload.wikimedia.org/wikipedia/commons/5/54/Rhodium_%28Rh%29.jpg", "Pure Rhodium Bead, 1 gram"],
    46: ["https://upload.wikimedia.org/wikipedia/commons/d/d7/Palladium_%2846_Pd%29.jpg", "Palladium Crystal, about 1 gram"],
    47: ["https://upload.wikimedia.org/wikipedia/commons/e/e4/Silver-nugget.jpg", "Natural silver nugget, 1 cm long"],
    48: ["https://images-of-elements.com/cadmium-4.jpg", "48 Cd Cadmium"],
    49: ["https://images-of-elements.com/indium-2.jpg", "1.5 x 1.5 cm liquid indium"],
    50: ["https://upload.wikimedia.org/wikipedia/commons/6/6a/Tin-2.jpg", "Tin blob"],
    51: ["https://upload.wikimedia.org/wikipedia/commons/5/5c/Antimony-4.jpg", "Antimony crystal, 2 grams, 1 cm"],
    52: ["https://upload.wikimedia.org/wikipedia/commons/c/c1/Tellurium2.jpg", "Metallic tellurium, diameter 3.5 cm"],
    53: ["https://upload.wikimedia.org/wikipedia/commons/c/c2/Iodine-sample.jpg", "Iodine Sample"],
    54: ["https://upload.wikimedia.org/wikipedia/commons/5/5d/Xenon-glow.jpg", "Vial of glowing ultrapure xenon"],
    55: ["https://upload.wikimedia.org/wikipedia/commons/3/3d/Cesium.jpg", "Cesium metal"],
    56: ["https://upload.wikimedia.org/wikipedia/commons/f/f5/Barium_%2856_Ba%29.jpg", "1.5 Grams Barium with Grey Oxide Layer under Argon"],
    57: ["https://upload.wikimedia.org/wikipedia/commons/f/f7/Lanthanum.jpg", "Pure Lanthanum piece, 1 cm"],
    58: ["https://upload.wikimedia.org/wikipedia/commons/0/0d/Cerium2.jpg", "Ultrapure Cerium under Argon, 1.5 grams"],
    59: ["https://upload.wikimedia.org/wikipedia/commons/c/c7/Praseodymium.jpg", "1.5 Grams Praseodymium under Argon"],
    60: ["https://upload.wikimedia.org/wikipedia/commons/c/c9/Neodymium_%2860_Nd%29.jpg", "Ultrapure Neodymium under Argon, 5 grams"],
    61: ["https://upload.wikimedia.org/wikipedia/commons/5/5b/Promethium.jpg", "Simulated promethium sample (too radioactive for macro photos)"],
    62: ["https://upload.wikimedia.org/wikipedia/commons/8/88/Samarium-2.jpg", "Ultrapure Sublimated Samarium, 2 grams"],
    63: ["https://upload.wikimedia.org/wikipedia/commons/6/6a/Europium.jpg", "Weakly Oxidized Europium, 1.5 grams"],
    64: ["https://upload.wikimedia.org/wikipedia/commons/c/c2/Gadolinium-2.jpg", "Pure (99.95%) Amorphous Gadolinium, 12 grams"],
    65: ["https://upload.wikimedia.org/wikipedia/commons/9/9a/Terbium-2.jpg", "Pure Terbium, 3 grams"],
    66: ["https://upload.wikimedia.org/wikipedia/commons/5/55/Dysprosium-2.jpg", "Pure Dysprosium Dendrites"],
    67: ["https://upload.wikimedia.org/wikipedia/commons/0/0a/Holmium2.jpg", "Ultrapure Holmium, 17 grams"],
    68: ["https://upload.wikimedia.org/wikipedia/commons/2/2a/Erbium-2.jpg", "9.5 Grams Pure Erbium"],
    69: ["https://upload.wikimedia.org/wikipedia/commons/6/6b/Thulium-2.jpg", "Ultrapure Crystalline Thulium, 22.3 grams"],
    70: ["https://upload.wikimedia.org/wikipedia/commons/c/ce/Ytterbium-3.jpg", "Ytterbium, 0.5 x 1 cm"],
    71: ["https://upload.wikimedia.org/wikipedia/commons/e/e8/Lutetium.jpg", "Pure Lutetium piece, 1 cm"],
    72: ["https://upload.wikimedia.org/wikipedia/commons/1/17/Hafnium_%2872_Hf%29.jpg", "Electrolytic Hafnium, 22 grams"],
    73: ["https://upload.wikimedia.org/wikipedia/commons/6/61/Tantalum.jpg", "Piece of tantalum, 1 cm"],
    74: ["https://upload.wikimedia.org/wikipedia/commons/c/c8/Tungsten_rod_with_oxidised_surface.jpg", "Tungsten rod with oxidised surface, 80 grams"],
    75: ["https://upload.wikimedia.org/wikipedia/commons/d/d9/Pure_rhenium_bead%2C_arc_melted%2C_21_grams._Original_size_in_cm_-_1.5_x_1.7.jpg", "Pure Rhenium Bead, arc melted, 21 grams"],
    76: ["https://upload.wikimedia.org/wikipedia/commons/3/3c/Osmium-bead.jpg", "Pure Osmium Bead"],
    77: ["https://upload.wikimedia.org/wikipedia/commons/a/a8/Iridium-2.jpg", "Pieces of Pure Iridium, 1 gram"],
    78: ["https://upload.wikimedia.org/wikipedia/commons/6/68/Platinum_crystals.jpg", "Crystals of Pure Platinum"],
    79: ["https://upload.wikimedia.org/wikipedia/commons/8/8a/Gold_%2879_Au%29.jpg", "Ultrapure Gold Leaf"],
    80: ["https://upload.wikimedia.org/wikipedia/commons/b/be/Hydrargyrum_%2880_Hg%29.jpg", "6 grams pure mercury"],
    81: ["https://upload.wikimedia.org/wikipedia/commons/5/55/Thallium_%2881_Tl%29.jpg", "8 grams pure thallium under argon"],
    82: ["https://upload.wikimedia.org/wikipedia/commons/6/63/Lead-2.jpg", "Ultrapure Lead Bead"],
    83: ["https://upload.wikimedia.org/wikipedia/commons/a/a5/Bismuth-2.jpg", "Bismuth Hopper Crystal"],
    84: ["https://images-of-elements.com/polonium.jpg", "Illustration of silvery radioactive polonium"],
    85: ["https://images-of-elements.com/astatine.jpg", "Illustration of radioactive dark astatine crystals"],
    86: ["https://images-of-elements.com/radon.jpg", "Illustration of red-glowing radon discharge"],
    87: ["https://images-of-elements.com/francium.jpg", "Illustration of ephemeral alkali francium"],
    88: ["https://upload.wikimedia.org/wikipedia/commons/b/bb/Radium226.jpg", "Radium electroplated on copper foil"],
    89: ["https://upload.wikimedia.org/wikipedia/commons/2/27/Actinium_sample_%2831481701837%29.png", "Actinium-225 glowing blue in vial at ORNL"],
    90: ["https://upload.wikimedia.org/wikipedia/commons/f/f7/Thorium-1.jpg", "Thorium Metal in Ampoule"],
    91: ["https://upload.wikimedia.org/wikipedia/commons/a/af/Protactinium-233.jpg", "Protactinium-233 glowing from radioactive emission"],
    92: ["https://upload.wikimedia.org/wikipedia/commons/b/b2/Ames_Process_uranium_biscuit.jpg", "Uranium metal biscuit via Ames Process"],
    93: ["https://upload.wikimedia.org/wikipedia/commons/e/e5/Neptunium2.jpg", "Neptunium-237 sphere"],
    94: ["https://upload.wikimedia.org/wikipedia/commons/0/0f/Plutonium_ring.jpg", "Plutonium Ring"],
    95: ["https://upload.wikimedia.org/wikipedia/commons/e/ee/Americium_microscope.jpg", "Am-241 disc under microscope"],
    96: ["https://images-of-elements.com/s/curium-glow.jpg", "Glowing curium sample"],
    97: ["https://upload.wikimedia.org/wikipedia/commons/f/fc/Berkelium.jpg", "Berkelium solution used to synthesize Ts"],
    98: ["https://upload.wikimedia.org/wikipedia/commons/9/93/Californium.jpg", "Disc of californium-249 metal"],
    99: ["https://upload.wikimedia.org/wikipedia/commons/5/55/Einsteinium.jpg", "300 micrograms of Einsteinium-253"],
    100: ["https://upload.wikimedia.org/wikipedia/commons/5/58/Ivy_Mike_-_mushroom_cloud.jpg", "Fermium first identified in 1952 Ivy Mike debris"],
    101: ["https://images-of-elements.com/s/mendelevium.jpg", "Illustration of radioactive mendelevium"],
    102: ["https://images-of-elements.com/nobelium.jpg", "Illustration of radioactive nobelium"],
    103: ["https://images-of-elements.com/lawrencium.jpg", "Illustration of radioactive lawrencium"],
    104: ["https://images-of-elements.com/s/rutherfordium.jpg", "Particle track trace illustration for rutherfordium"]
  };

  var FAMILY_TOPICS = {
    all: {
      badgeEs: 'Ley Periódica · Filas 1–7 y Columnas 1–18',
      badgeEn: 'Periodic Law · Periods 1–7 & Groups 1–18',
      es: 'Las 7 filas (periodos) indican cuántas capas de electrones rodean al núcleo. Las 18 columnas (grupos) reúnen elementos con electrones de valencia equivalentes y comportamiento químico similar: a la izquierda dominan metales que ceden electrones; a la derecha, no metales que los comparten o capturan.',
      en: 'The 7 rows (periods) tell how many electron shells surround the nucleus. The 18 columns (groups) align elements with matching valence electrons and chemical behavior: metals on the left readily lose electrons, while nonmetals on the right share or gain them.',
      traitsEs: ['Periodos = capas e⁻', 'Grupos = valencia similar', 'Bloques s, p, d y f'],
      traitsEn: ['Periods = electron shells', 'Groups = similar valence', 's, p, d & f orbital blocks']
    },
    nonmetal: {
      badgeEs: 'Bloque s/p · C, H, N, O, P, S, Se',
      badgeEn: 's/p-block · H, C, N, O, P, S, Se',
      es: 'Elementos no metálicos esenciales para la vida y las moléculas orgánicas. Tienen alta electronegatividad, no conducen la electricidad ni presentan brillo metálico, y tienden a compartir electrones (enlaces covalentes) o ganarlos.',
      en: 'Essential nonmetallic elements forming organic life, atmospheres, and acids. High electronegativity keeps valence electrons tight—making them insulators that form covalent bonds or negative ions.',
      traitsEs: ['Forman enlaces covalentes', 'Aislantes térmicos y eléctricos', 'Gases o sólidos quebradizos'],
      traitsEn: ['Form covalent networks', 'Poor conductors / insulators', 'Gases or brittle solids']
    },
    noble: {
      badgeEs: 'Grupo 18 · He, Ne, Ar, Kr, Xe, Rn, Og',
      badgeEn: 'Group 18 · He, Ne, Ar, Kr, Xe, Rn, Og',
      es: 'Gases monoatómicos con su capa electrónica externa llena (2 e⁻ en el helio, octeto de 8 e⁻ en los demás). Esa estabilidad los vuelve casi inertes químicamente y brillantes al excitarlos en tubos de descarga.',
      en: 'Monatomic gases whose outermost shell is completely full (duplet in He, octet of 8 in the rest). This closed-shell stability makes them extraordinarily unreactive and useful as inert shields or glowing lamps.',
      traitsEs: ['Capa de valencia completa', 'Reactividad casi nula', 'Incoloros e inodoros (STP)'],
      traitsEn: ['Full valence electron shell', 'Virtually unreactive', 'Monatomic gases at STP']
    },
    alkali: {
      badgeEs: 'Grupo 1 (sin H) · Li, Na, K, Rb, Cs, Fr',
      badgeEn: 'Group 1 (excl. H) · Li, Na, K, Rb, Cs, Fr',
      es: 'Metales blandísimos y plateados con 1 único electrón de valencia (ns¹) que pierden con facilidad explosiva al tocar el agua, generando hidrógeno gaseoso e hidróxidos alcalinos. En la naturaleza solo aparecen combinados en sales.',
      en: 'Very soft silvery metals carrying a single loose outer electron (ns¹). They react vigorously—even explosively—with water to release hydrogen and alkaline hydroxides, never existing pure in nature.',
      traitsEs: ['1 electrón de valencia (+1)', 'Se cortan con cuchillo', 'Reacción violenta con agua'],
      traitsEn: ['1 outer valence electron (+1)', 'Soft enough to cut', 'React violently with water']
    },
    alkaline: {
      badgeEs: 'Grupo 2 · Be, Mg, Ca, Sr, Ba, Ra',
      badgeEn: 'Group 2 · Be, Mg, Ca, Sr, Ba, Ra',
      es: 'Metales reactivos con 2 electrones en su capa externa que forman cationes +2. Son más duros y densos que los alcalinos, abundan en minerales carbonatados como calizas o huesos (Ca) y colorean intensamente llamas pirotécnicas.',
      en: 'Reactive metals with 2 valence electrons readily forming +2 cations. Harder and higher-melting than alkalis, they build coral, bone, and rock minerals (Ca, Mg) and burn with vivid flame colors.',
      traitsEs: ['2 electrones de valencia (+2)', 'Base mineral y biológica', 'Llamas de colores vivos'],
      traitsEn: ['2 valence electrons (+2)', 'Structural rocks & bone', 'Bright pyrotechnic flames']
    },
    metalloid: {
      badgeEs: 'Escalera B–Si–Ge–As–Sb–Te',
      badgeEn: 'Staircase B–Si–Ge–As–Sb–Te',
      es: 'Frontera diagonal entre metales y no metales con conductividad eléctrica intermedia que aumenta con la temperatura o dopantes. Gracias a esa propiedad modulable, el silicio y el germanio sostienen toda la microelectrónica.',
      en: 'Staircase border elements balancing metallic luster and nonmetallic brittleness. Their tunable intermediate conductivity rises with heat or impurities—making silicon and germanium the bedrock of microchips.',
      traitsEs: ['Semiconductores modulables', 'Aspecto metálico pero frágiles', 'Puente químico ácido/básico'],
      traitsEn: ['Tunable semiconductors', 'Shiny yet brittle solids', 'Amphoteric reactivity']
    },
    halogen: {
      badgeEs: 'Grupo 17 · F, Cl, Br, I, At, Ts',
      badgeEn: 'Group 17 · F, Cl, Br, I, At, Ts',
      es: '«Formadores de sales»: no metales muy reactivos con 7 electrones de valencia a solo 1 electrón del octeto estable. Capturan electrones agresivamente para formar haluros (-1) como el NaCl y abarcan los tres estados físicos a 25 °C.',
      en: '“Salt formers”: fiercely reactive nonmetals with 7 valence electrons—just 1 short of a full octet. They grab electrons to make halide salts (-1) and uniquely span gas (F, Cl), liquid (Br), and solid (I) at room temperature.',
      traitsEs: ['7 e⁻ externos (valencia -1)', 'Moléculas diatómicas (Cl₂, I₂)', 'Máxima afinidad electrónica'],
      traitsEn: ['7 valence e⁻ (form -1 ions)', 'Diatomic elements (F₂–I₂)', 'Span gas, liquid & solid']
    },
    transition: {
      badgeEs: 'Bloque d · Grupos 3–12',
      badgeEn: 'd-block · Groups 3–12',
      es: 'Metales duros, dúctiles y buenos conductores que llenan subcapas internas d. Esa estructura les permite adoptar múltiples estados de oxidación, originar compuestos intensamente coloreados y actuar como catalizadores industriales y biológicos.',
      en: 'Dense, malleable conductors filling inner d orbitals. Because d and s electrons sit close in energy, transition metals adopt multiple oxidation states, form vibrant colored ions, magnets, and vital industrial catalysts.',
      traitsEs: ['Orbitales d parcialmente llenos', 'Compuestos muy coloreados', 'Magnetismo y catálisis'],
      traitsEn: ['Partially filled d orbitals', 'Colorful ions & complexes', 'Magnetism & catalysis']
    },
    post: {
      badgeEs: 'Bloque p metálico · Al, Ga, In, Sn, Pb, Bi…',
      badgeEn: 'Metallic p-block · Al, Ga, In, Sn, Pb, Bi…',
      es: 'Metales situados a la derecha de los de transición y antes de la escalera de metaloides. Suelen ser más blandos y con puntos de fusión mucho menores (soldaduras de estaño o galio líquido en la mano) y propiedades químicas anfóteras.',
      en: 'Metals positioned right of transition elements along the metalloid line. Generally softer with low melting points—from liquid-on-skin gallium to tin/indium solders—and weaker metallic bonding than d-block metals.',
      traitsEs: ['Puntos de fusión bajos', 'Blandos y maleables', 'Electrones externos en capa p'],
      traitsEn: ['Lower melting points', 'Soft & low hardness', 'p-orbital valence metals']
    },
    lanthanide: {
      badgeEs: 'Serie 4f · Lantano (57) al Lutecio (71)',
      badgeEn: '4f Series · Lanthanum (57) to Lutetium (71)',
      es: '«Tierras raras»: 15 metales del periodo 6 cuyos electrones adicionales entran en la profunda subcapa 4f, sin alterar la capa externa. Por eso exhiben química casi idéntica (+3), magnetismo extremo (NdFeB) y emisión luminosa pura (Eu, Er).',
      en: '“Rare earths”: 15 Period-6 metals filling buried 4f orbitals inside unchanged outer shells. This shields valence electrons—giving nearly identical +3 chemistry, unmatched permanent magnets (Nd), and sharp optical lasers (Er, Eu).',
      traitsEs: ['Llenan la subcapa interna 4f', 'Química uniforme (+3)', 'Imanes, fibra óptica y LEDs'],
      traitsEn: ['Filling buried 4f subshell', 'Uniform +3 ion chemistry', 'Supermagnets, optics & LEDs']
    },
    actinide: {
      badgeEs: 'Serie 5f · Actinio (89) al Lawrencio (103)',
      badgeEn: '5f Series · Actinium (89) to Lawrencium (103)',
      es: 'Serie de 15 elementos pesados del periodo 7 que completan la subcapa 5f; todos sus isótopos son radiactivos por núcleos enormes e inestables. Solo torio y uranio abundan en la corteza; del neptunio en adelante se producen en reactores o aceleradores.',
      en: '15 heavy Period-7 metals filling 5f orbitals, every isotope unstable and radioactive. Only thorium and uranium persist naturally at scale; transuranics like plutonium and americium are forged in reactors for nuclear power, probes, and detectors.',
      traitsEs: ['Todos radiactivos (sin estables)', 'Subcapa interna 5f', 'Energía nuclear y trazadores'],
      traitsEn: ['100% radioactive nuclei', '5f orbital series', 'Fission fuel & RTG probes']
    }
  };

  var BLOCKS = [
    {
      id: 'all',
      es: 'Tabla completa (1–118)',
      en: 'Full Table (1–118)',
      subEs: 'Todos los elementos',
      subEn: 'All 118 elements',
      match: function () { return true; }
    },
    {
      id: 'first20',
      es: 'Primeros 20 (H–Ca)',
      en: 'First 20 (H–Ca)',
      subEs: 'Base de química',
      subEn: 'Core chemistry',
      match: function (el) { return el.z <= 20; }
    },
    {
      id: 'nonmetals',
      es: 'No metales, halógenos y nobles',
      en: 'Nonmetals, halogens & nobles',
      subEs: 'Bloque reactivo e inerte',
      subEn: 'Reactive & noble gases',
      match: function (el) {
        return el.fam === 'nonmetal' || el.fam === 'halogen' || el.fam === 'noble';
      }
    },
    {
      id: 'sblock-metalloids',
      es: 'Alcalinos, alcalinotérreos y metaloides',
      en: 'Alkalis, alkaline earths & metalloids',
      subEs: 'Grupos 1, 2 y semiconductores',
      subEn: 'Groups 1, 2 & semiconductors',
      match: function (el) {
        return el.fam === 'alkali' || el.fam === 'alkaline' || el.fam === 'metalloid';
      }
    },
    {
      id: 'metals',
      es: 'Metales de transición y postransición',
      en: 'Transition & post-transition metals',
      subEs: 'Bloque d y p metálico',
      subEn: 'd-block & metallic p-block',
      match: function (el) {
        return el.fam === 'transition' || el.fam === 'post';
      }
    },
    {
      id: 'fblock',
      es: 'Lantánidos y actínidos',
      en: 'Lanthanides & actinides',
      subEs: 'Tierras raras y radiactivos',
      subEn: 'Rare earths & actinides',
      match: function (el) {
        return el.fam === 'lanthanide' || el.fam === 'actinide';
      }
    }
  ];

  var STRINGS = {
    es: {
      brandMark: 'Tabla Periódica',
      brandSub: 'Entrenador químico interactivo',
      home: '← Catálogo',
      railTitle: 'Bloques de estudio',
      railPath: '90%+ de acierto marca el bloque como dominado.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Explora los 118 elementos, filtra familias, busca por símbolo o revisa capas electrónicas.',
        practice: 'Entrena sin límite con pistas visuales en la tabla.',
        test: 'Ronda de 12 preguntas cronometrada sin ayudas visibles.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mixto', locate: 'Ubicar', symbol: 'Símbolo', property: 'Uso / Familia' },
      taskHints: {
        mix: 'Combina ubicación en tabla, símbolos, familias químicas y usos reales.',
        locate: 'Encuentra la casilla exacta del elemento en la tabla.',
        symbol: 'Relaciona el nombre o número atómico con su símbolo.',
        property: 'Identifica la familia química o la aplicación real del elemento.'
      },
      searchHeading: 'Buscar elemento',
      searchPlaceholder: 'Ej: Au, Oro, 79, gas…',
      statAccLabel: 'Precisión',
      statTimeLabel: 'Tiempo',
      statStreakLabel: 'Racha',
      actions: {
        study: 'Pulsa cualquier casilla o usa las flechas para recorrer la tabla.',
        waitAns: 'Selecciona la respuesta correcta.',
        waitLocate: 'Haz clic en la casilla correspondiente de la tabla periódica.',
        clean: 'Pantalla limpia',
        cleanExit: 'Salir vista limpia',
        restart: 'Reiniciar ronda',
        settings: 'Ajustes',
        how: 'Guía rápida',
        best: 'Mejor: ',
        bestNone: 'Sin marca aún',
        goPractice: 'Practicar este bloque →',
        nextBtn: 'Siguiente',
        keysHint: 'Flechas navegan en Estudio · 1–4 responden · Space siguiente · C limpia pantalla'
      },
      docTitle: 'Tabla Periódica · Todologo',
      creditText: 'Datos IUPAC · 118 elementos offline',
      allFam: 'Todas las familias',
      studyEyebrow: 'Estudio · Z =',
      studyMetaPrefix: 'Masa ',
      periodWord: 'Período',
      groupWord: 'Grupo',
      shellsWord: 'Capas',
      massWord: 'Masa atómica',
      stateWord: 'Estado (STP)',
      promptLocate: 'Ubicar en tabla',
      promptSymbol: 'Símbolo químico',
      promptProperty: 'Familia química',
      promptUse: 'Aplicación y propiedad',
      promptConcept: 'Concepto de familia',
      qLocatePrefix: 'Encuentra: ',
      qLocateMeta: '',
      qSymbolTitle: '¿Qué símbolo corresponde a ',
      qFamilyTitle: '¿A qué familia pertenece ',
      qUseTitle: '¿Qué elemento destaca por este uso o propiedad?',
      qConceptTitle: '¿Qué grupo o familia química cumple esta definición?',
      photoCap: 'Foto real',
      bohrCap: 'Modelo Bohr',
      closeWord: 'Cerrar',
      noPhotoNote: 'Elemento superpesado sintético: solo se detectan átomos fugaces en aceleradores de partículas.',
      rightMsg: '¡Correcto! ',
      wrongMsg: 'Era ',
      roundDone: 'Ronda completada',
      roundMeta: 'aciertos en ',
      passedMsg: 'Bloque superado (≥90%).',
      retryMsg: 'Necesitas 90%+ en Examen para completar este bloque.',
      introTitle: 'Tabla Periódica Interactiva',
      introBody1: 'Domina los 118 elementos químicos con una tabla real de 18 columnas, diagramas de capas de Bohr y retos progresivos por bloques.',
      introList: [
        '<li><strong>Estudiar:</strong> filtra por familia, busca por nombre/símbolo/Z y analiza la configuración por capas.</li>',
        '<li><strong>Practicar y Examen:</strong> ubica elementos en la cuadrícula, identifica símbolos, familias y aplicaciones reales.</li>',
        '<li><strong>Bloques:</strong> comienza por los primeros 20 o no metales hasta dominar toda la tabla.</li>'
      ],
      introGo: 'Empezar ahora'
    },
    en: {
      brandMark: 'Periodic Table',
      brandSub: 'Interactive Chemistry Trainer',
      home: '← Catalog',
      railTitle: 'Study Blocks',
      railPath: 'Score 90%+ in Test mode to mark a block completed.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Explore all 118 elements, filter families, search by symbol, and inspect Bohr shells.',
        practice: 'Unlimited practice with full element inspection after each answer.',
        test: 'Timed 12-question quiz with element labels masked.'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mixed', locate: 'Locate', symbol: 'Symbol', property: 'Use / Family' },
      taskHints: {
        mix: 'Mixes grid location, chemical symbols, families, and real-world uses.',
        locate: 'Click the exact cell of the requested element on the grid.',
        symbol: 'Match the element name or atomic number to its symbol.',
        property: 'Identify the chemical family or real-world use of the element.'
      },
      searchHeading: 'Find element',
      searchPlaceholder: 'e.g. Au, Gold, 79, noble…',
      statAccLabel: 'Accuracy',
      statTimeLabel: 'Time',
      statStreakLabel: 'Streak',
      actions: {
        study: 'Click any cell or use arrow keys to inspect elements.',
        waitAns: 'Choose the right answer.',
        waitLocate: 'Click the matching cell on the periodic table.',
        clean: 'Clean view',
        cleanExit: 'Exit clean',
        restart: 'Restart round',
        settings: 'Settings',
        how: 'Quick guide',
        best: 'Best: ',
        bestNone: 'No score yet',
        goPractice: 'Practice this block →',
        nextBtn: 'Next',
        keysHint: 'Arrows browse in Study · 1–4 answer · Space next · C toggles clean view'
      },
      docTitle: 'Periodic Table · Todologo',
      creditText: 'IUPAC data · 118 elements offline',
      allFam: 'All families',
      studyEyebrow: 'Study · Z =',
      studyMetaPrefix: 'Mass ',
      periodWord: 'Period',
      groupWord: 'Group',
      shellsWord: 'Shells',
      massWord: 'Atomic mass',
      stateWord: 'State (STP)',
      promptLocate: 'Locate on grid',
      promptSymbol: 'Chemical symbol',
      promptProperty: 'Chemical family',
      promptUse: 'Real-world use',
      promptConcept: 'Family concept',
      qLocatePrefix: 'Find: ',
      qLocateMeta: '',
      qSymbolTitle: 'Which symbol represents ',
      qFamilyTitle: 'Which family contains ',
      qUseTitle: 'Which element matches this use or property?',
      qConceptTitle: 'Which chemical family matches this description?',
      photoCap: 'Real photo',
      bohrCap: 'Bohr model',
      closeWord: 'Close',
      noPhotoNote: 'Synthetic superheavy element: observed atom-by-atom inside particle accelerators.',
      rightMsg: 'Correct! ',
      wrongMsg: 'Answer: ',
      roundDone: 'Round complete',
      roundMeta: 'correct in ',
      passedMsg: 'Block mastered (≥90%).',
      retryMsg: 'Score 90%+ in Test mode to mark this block completed.',
      introTitle: 'Interactive Periodic Table',
      introBody1: 'Master all 118 chemical elements with a full 18-column grid, Bohr electron shell diagrams, and progressive block drills.',
      introList: [
        '<li><strong>Study:</strong> filter by chemical family, search by name/symbol/Z, and inspect electron shells.</li>',
        '<li><strong>Practice & Test:</strong> locate elements on the table, match symbols, families, and real-world uses.</li>',
        '<li><strong>Blocks:</strong> start with the first 20 or nonmetals and build up to the full table.</li>'
      ],
      introGo: 'Start learning'
    }
  };

  var state = {
    block: STORE.get('block', 'first20'),
    mode: STORE.get('mode', 'study'),
    task: STORE.get('task', 'mix'),
    famFilter: 'all',
    showLaw: false,
    search: '',
    selectedZ: STORE.get('selectedZ', 6),
    question: null,
    answered: false,
    streak: 0,
    totalCount: 0,
    rightCount: 0,
    qStart: 0,
    roundTarget: 12,
    roundRight: 0,
    roundAsk: 0,
    roundStart: 0,
    frozenSec: null,
    bests: STORE.get('bests', {}),
    flashTimer: null
  };

  if (!BLOCKS.some(function (b) { return b.id === state.block; })) state.block = 'first20';
  if (!BY_Z[state.selectedZ]) state.selectedZ = 6;

  var $ = function (id) { return document.getElementById(id); };

  function S() { return STRINGS[LANG] || STRINGS.es; }
  function elName(el) { return LANG === 'en' ? el.en : el.es; }
  function famName(fam) { return (FAMILIES[fam] && FAMILIES[fam][LANG]) || fam; }
  function stateName(st) { return (STATES[st] && STATES[st][LANG]) || st; }
  function elUse(el) { return LANG === 'en' ? el.useEn : el.useEs; }

  function activePool() {
    var blk = BLOCKS.filter(function (b) { return b.id === state.block; })[0] || BLOCKS[0];
    return ELEMENTS.filter(blk.match);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function setLang(newLang) {
    LANG = newLang === 'en' ? 'en' : 'es';
    STORE.set('lang', LANG);
    try { localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    applyStaticLabels();
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

  function applyStaticLabels() {
    var s = S();
    document.documentElement.lang = LANG;
    document.title = s.docTitle;
    $('brandMark').innerHTML = LANG === 'en'
      ? 'PERIODIC <span>TABLE</span><sup>T026</sup>'
      : 'TABLA <span>PERIÓDICA</span><sup>T026</sup>';
    $('brandSub').textContent = s.brandSub;
    $('homeLink').setAttribute('aria-label', s.home);
    $('homeLink').setAttribute('title', s.home);
    $('railTitle').textContent = s.railTitle;
    $('railPath').textContent = s.railPath;
    $('langHeading').textContent = s.langHeading;
    $('langSel').value = LANG;
    $('modeHeading').textContent = s.modeHeading;
    $('taskHeading').textContent = s.taskHeading;
    $('searchHeading').textContent = s.searchHeading;
    $('searchIn').placeholder = s.searchPlaceholder;
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
    $('introBody1').textContent = s.introBody1;
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

    $('searchSection').style.display = state.mode === 'study' ? '' : 'none';
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
      var rightTxt = best ? (best.pct + '%') : (b.id === 'all' ? '118' : (b.id === 'first20' ? '20' : '·'));

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
        if (pool.length && !pool.some(function (e) { return e.z === state.selectedZ; })) {
          state.selectedZ = pool[0].z;
          STORE.set('selectedZ', state.selectedZ);
        }
        renderRail();
        updateStatsUI();
        if (state.mode === 'study') {
          renderStage();
        } else {
          startRoundOrQuestion(true);
        }
      });
      box.appendChild(btn);
    });
  }

  function buildBohrSVG(el) {
    var shells = el.shells;
    var rMax = 44;
    var step = shells.length ? (rMax - 14) / Math.max(1, shells.length) : 10;
    var parts = [
      '<svg class="bohr-svg" viewBox="0 0 100 100" aria-hidden="true">',
      '<circle cx="50" cy="50" r="10" fill="' + FAMILIES[el.fam].color + '" fill-opacity="0.25" stroke="' + FAMILIES[el.fam].color + '" stroke-width="1.5"/>',
      '<text x="50" y="53" text-anchor="middle" font-size="9" font-weight="700" fill="var(--bone)" font-family="ui-monospace,monospace">' + el.sym + '</text>'
    ];
    shells.forEach(function (count, idx) {
      var r = 16 + idx * step;
      parts.push('<circle cx="50" cy="50" r="' + r.toFixed(1) + '" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="0.9"/>');
      var shown = Math.min(count, 18);
      for (var k = 0; k < shown; k++) {
        var ang = (Math.PI * 2 * k) / shown - Math.PI / 2;
        var cx = 50 + r * Math.cos(ang);
        var cy = 50 + r * Math.sin(ang);
        parts.push('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="1.9" fill="' + FAMILIES[el.fam].color + '"/>');
      }
    });
    parts.push('</svg>');
    return parts.join('');
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
      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'act';
      prev.innerHTML = '<kbd>←</kbd> ' + (LANG === 'en' ? 'Previous' : 'Anterior');
      prev.addEventListener('click', function () {
        state.showLaw = false;
        state.selectedZ = state.selectedZ <= 1 ? 118 : state.selectedZ - 1;
        STORE.set('selectedZ', state.selectedZ);
        renderStage();
      });

      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'act';
      next.innerHTML = (LANG === 'en' ? 'Next' : 'Siguiente') + ' <kbd>→</kbd>';
      next.addEventListener('click', function () {
        state.showLaw = false;
        state.selectedZ = state.selectedZ >= 118 ? 1 : state.selectedZ + 1;
        STORE.set('selectedZ', state.selectedZ);
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
        btn.innerHTML = '<kbd>' + (idx + 1) + '</kbd> ' + opt.label + (opt.sub ? ' <small style="color:var(--muted)">' + opt.sub + '</small>' : '');
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
      nb.innerHTML = s.actions.nextBtn + ' <kbd>Space</kbd>';
      nb.addEventListener('click', advanceQuestion);
      box.appendChild(nb);
    }
  }

  function renderTopPrompt() {
    var s = S();
    var p = $('prompt');
    p.classList.remove('is-ok', 'is-bad');

    if (state.mode === 'study') {
      var el = BY_Z[state.selectedZ] || ELEMENTS[5];
      $('pEyebrow').textContent = s.studyEyebrow + ' ' + el.z;
      $('pName').textContent = el.sym + ' · ' + elName(el);
      $('pMeta').textContent = famName(el.fam) + ' · ' + s.studyMetaPrefix + el.mass + ' u';
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
      var ok = state.lastOk;
      p.classList.add(ok ? 'is-ok' : 'is-bad');
      $('pEyebrow').textContent = ok ? s.rightMsg.trim() : (q.subkind === 'concept' ? famName(q.target.fam) : (s.wrongMsg + q.target.sym));
      $('pName').textContent = q.subkind === 'concept'
        ? ((ok ? s.rightMsg : s.wrongMsg) + famName(q.target.fam) + ' · ' + q.target.sym + ' (' + elName(q.target) + ')')
        : ((ok ? s.rightMsg : s.wrongMsg) + q.target.sym + ' · ' + elName(q.target) + ' (' + famName(q.target.fam) + ')');
      $('pMeta').textContent = elUse(q.target);
    } else {
      $('pEyebrow').textContent = q.eyebrow;
      $('pName').textContent = q.title;
      $('pMeta').textContent = q.meta;
    }
    renderDockActions();
  }

  function buildPeriodicGrid(poolSet, queryMatch) {
    var wrap = document.createElement('div');
    wrap.className = 'pt-scroll';
    var grid = document.createElement('div');
    grid.className = 'pt-grid';

    var markers = [
      { row: 6, col: 3, text: '57–71', fam: 'lanthanide' },
      { row: 7, col: 3, text: '89–103', fam: 'actinide' }
    ];
    markers.forEach(function (m) {
      var mk = document.createElement('div');
      mk.className = 'el-marker';
      mk.style.gridRow = String(m.row);
      mk.style.gridColumn = String(m.col);
      mk.style.setProperty('--fc', FAMILIES[m.fam].color);
      mk.textContent = m.text;
      grid.appendChild(mk);
    });

    var isLocateQ = state.mode !== 'study' && state.question && state.question.kind === 'locate';
    var hideSymGlobal = state.mode !== 'study' && state.question && !state.answered &&
      ((state.mode === 'test' && isLocateQ) || state.question.subkind === 'family' || state.question.subkind === 'concept');

    ELEMENTS.forEach(function (el) {
      var inBlock = !!poolSet[el.z];
      var inFam = state.famFilter === 'all' || el.fam === state.famFilter;
      var inSearch = !queryMatch || queryMatch(el);
      var dimmed = state.mode === 'study'
        ? !(inBlock && inFam && inSearch)
        : !inBlock;

      var showDetails = state.mode === 'study' || (state.answered && state.question && el.z === state.question.target.z);

      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'el-cell';
      if (!showDetails) cell.classList.add('is-quiz');
      cell.style.gridRow = String(el.row);
      cell.style.gridColumn = String(el.col);
      cell.style.setProperty('--fc', FAMILIES[el.fam].color);
      cell.setAttribute('data-z', String(el.z));

      if (dimmed) cell.classList.add('is-dim');
      if (state.mode === 'study' && el.z === state.selectedZ) cell.classList.add('is-selected');
      if (hideSymGlobal) cell.classList.add('is-masked');

      if (state.question && state.answered && el.z === state.question.target.z) {
        cell.classList.add('is-right');
      } else if (state.question && state.answered && state.question.kind === 'locate' && el.z === state.question.pickedZ) {
        cell.classList.add('is-wrong');
      }

      if (showDetails) {
        cell.innerHTML =
          '<span class="el-z">' + el.z + '</span>' +
          '<span class="el-sym">' + el.sym + '</span>' +
          '<span class="el-name">' + elName(el) + '</span>';
      } else {
        cell.innerHTML = '<span class="el-sym">' + (hideSymGlobal ? '?' : el.sym) + '</span>';
      }

      cell.addEventListener('click', function () {
        if (state.mode === 'study') {
          state.showLaw = false;
          state.selectedZ = el.z;
          STORE.set('selectedZ', el.z);
          renderStage();
          return;
        }
        if (state.question && state.question.kind === 'locate' && !state.answered) {
          if (!inBlock) return;
          submitLocateAnswer(el);
        }
      });

      grid.appendChild(cell);
    });

    wrap.appendChild(grid);
    return wrap;
  }

  function renderFamilyBar() {
    var s = S();
    var bar = document.createElement('div');
    bar.className = 'pt-topbar';

    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'fam-chip';
    allBtn.style.setProperty('--fc', 'var(--scan)');
    allBtn.setAttribute('aria-pressed', state.famFilter === 'all' ? 'true' : 'false');
    allBtn.innerHTML = '<i></i><span>' + s.allFam + '</span>';
    allBtn.addEventListener('click', function () {
      state.famFilter = 'all';
      state.showLaw = true;
      renderStage();
    });
    bar.appendChild(allBtn);

    Object.keys(FAMILIES).forEach(function (k) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'fam-chip';
      chip.style.setProperty('--fc', FAMILIES[k].color);
      chip.setAttribute('aria-pressed', state.famFilter === k ? 'true' : 'false');
      chip.innerHTML = '<i></i><span>' + famName(k) + '</span>';
      chip.addEventListener('click', function () {
        state.famFilter = state.famFilter === k ? 'all' : k;
        state.showLaw = state.famFilter === 'all';
        renderStage();
      });
      bar.appendChild(chip);
    });

    return bar;
  }

  function renderFamilyGuide(currentEl) {
    var showOverview = state.famFilter === 'all' && state.showLaw;
    var fk = showOverview ? 'all' : (state.famFilter !== 'all' ? state.famFilter : currentEl.fam);
    var topic = FAMILY_TOPICS[fk] || FAMILY_TOPICS.all;
    var traits = LANG === 'en' ? topic.traitsEn : topic.traitsEs;
    var box = document.createElement('div');
    box.className = 'family-guide';
    box.style.setProperty('--fc', FAMILIES[fk] ? FAMILIES[fk].color : 'var(--scan)');

    var headTitle = showOverview
      ? (LANG === 'en' ? 'Periodic Law Overview' : 'Ley periódica general')
      : (state.famFilter === 'all' ? famName(fk) + ' (' + elName(currentEl) + ')' : famName(fk));

    box.innerHTML =
      '<div class="fg-head">' +
        '<b>' + headTitle + '</b>' +
        '<span class="fg-badge">' + (LANG === 'en' ? topic.badgeEn : topic.badgeEs) + '</span>' +
        '<div class="fg-traits">' + traits.map(function (tr) { return '<span>' + tr + '</span>'; }).join('') + '</div>' +
      '</div>' +
      '<p class="fg-body">' + (LANG === 'en' ? topic.en : topic.es) + '</p>';
    return box;
  }

  function buildFallbackPhotoDataUri(el) {
    var col = '#6fd0e8';
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160">' +
        '<rect width="240" height="160" fill="#08131d"/>' +
        '<rect x="10" y="10" width="220" height="140" rx="12" fill="#0e202f" stroke="' + col + '" stroke-opacity="0.45" stroke-width="2"/>' +
        '<text x="24" y="34" fill="#8d9ca9" font-family="monospace" font-size="14">Z=' + el.z + '</text>' +
        '<text x="120" y="88" text-anchor="middle" fill="#ecdec2" font-family="sans-serif" font-weight="800" font-size="44">' + el.sym + '</text>' +
        '<text x="120" y="128" text-anchor="middle" fill="#6fd0e8" font-family="monospace" font-size="13">' + el.sym + ' · ' + elName(el) + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function openPhotoZoom(el) {
    var s = S();
    var photo = ELEMENT_PHOTOS[el.z];
    $('photoModalTitle').textContent = el.sym + ' · ' + elName(el) + ' (Z = ' + el.z + ')';
    var zoomImg = $('photoModalImg');
    zoomImg.src = photo ? photo[0] : buildFallbackPhotoDataUri(el);
    zoomImg.alt = elName(el);
    $('photoModalDesc').textContent = photo
      ? (photo[1] + ' — ' + elUse(el))
      : (s.noPhotoNote + ' ' + elUse(el));
    $('photoModalClose').textContent = s.closeWord;
    $('photoModal').hidden = false;
  }

  function renderInspectorCard(el) {
    var s = S();
    var card = document.createElement('div');
    card.className = 'inspector';
    card.style.setProperty('--fc', FAMILIES[el.fam].color);

    var tile = document.createElement('div');
    tile.className = 'insp-tile';
    tile.innerHTML =
      '<div class="z">' + el.z + '</div>' +
      '<div class="sym">' + el.sym + '</div>' +
      '<div class="mass">' + el.mass + ' u</div>';

    var info = document.createElement('div');
    info.className = 'insp-info';
    info.innerHTML =
      '<div class="insp-head">' +
        '<h4>' + elName(el) + '</h4>' +
        '<span class="insp-badge">' + famName(el.fam) + '</span>' +
      '</div>' +
      '<div class="insp-meta">' +
        '<span>' + s.periodWord + ' ' + el.period + ' · ' + s.groupWord + ' ' + el.group + '</span>' +
        '<span>' + s.stateWord + ': ' + stateName(el.state) + '</span>' +
        '<span>' + s.shellsWord + ': ' + el.shells.join(' – ') + '</span>' +
      '</div>' +
      '<p class="insp-use">' + elUse(el) + '</p>';

    var visuals = document.createElement('div');
    visuals.className = 'insp-visuals';

    var photo = ELEMENT_PHOTOS[el.z];
    var fig = document.createElement('figure');
    fig.className = 'el-photo-wrap';
    fig.innerHTML =
      '<img src="' + (photo ? photo[0] : buildFallbackPhotoDataUri(el)) + '" alt="' + elName(el) + '" loading="lazy">' +
      '<figcaption class="el-photo-cap"><span>' + s.photoCap + '</span><span>⊕</span></figcaption>';
    var img = fig.querySelector('img');
    if (img) {
      img.addEventListener('error', function () {
        if (!img.getAttribute('data-fb')) {
          img.setAttribute('data-fb', '1');
          img.src = buildFallbackPhotoDataUri(el);
        }
      });
    }
    fig.addEventListener('click', function () { openPhotoZoom(el); });

    var bohrBox = document.createElement('div');
    bohrBox.className = 'bohr-box';
    bohrBox.innerHTML = buildBohrSVG(el) + '<small>' + s.bohrCap + '</small>';

    visuals.appendChild(fig);
    visuals.appendChild(bohrBox);

    card.appendChild(tile);
    card.appendChild(info);
    card.appendChild(visuals);
    return card;
  }

  function renderChoiceQuizCard(q) {
    var s = S();
    var card = document.createElement('div');
    card.className = 'pt-quiz-card';
    card.innerHTML =
      '<b>' + q.title + '</b>' +
      '<span>' + q.meta + (q.subkind === 'concept' ? '' : (' · ' + s.actions.waitAns)) + '</span>';
    return card;
  }

  function renderStage() {
    var felt = $('felt');
    felt.innerHTML = '';

    var pool = activePool();
    var poolSet = {};
    pool.forEach(function (e) { poolSet[e.z] = true; });

    var query = state.search.trim().toLowerCase();
    var queryMatch = null;
    if (query && state.mode === 'study') {
      queryMatch = function (el) {
        return String(el.z) === query ||
          el.sym.toLowerCase().indexOf(query) !== -1 ||
          el.es.toLowerCase().indexOf(query) !== -1 ||
          el.en.toLowerCase().indexOf(query) !== -1 ||
          famName(el.fam).toLowerCase().indexOf(query) !== -1 ||
          stateName(el.state).toLowerCase().indexOf(query) !== -1;
      };
    }

    if (state.mode === 'study') {
      var curEl = BY_Z[state.selectedZ] || ELEMENTS[5];
      felt.appendChild(renderFamilyBar());
      felt.appendChild(renderFamilyGuide(curEl));
      felt.appendChild(buildPeriodicGrid(poolSet, queryMatch));
      felt.appendChild(renderInspectorCard(curEl));
    } else if (state.roundAsk > state.roundTarget && state.mode === 'test') {
      renderRoundSummary(felt);
    } else {
      felt.appendChild(buildPeriodicGrid(poolSet, null));
      if (state.answered && state.question && state.question.target) {
        felt.appendChild(renderInspectorCard(state.question.target));
      } else if (state.question && state.question.kind !== 'locate') {
        felt.appendChild(renderChoiceQuizCard(state.question));
      }
    }

    renderTopPrompt();
  }

  function renderRoundSummary(container) {
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
    box.className = 'pt-quiz-card';
    box.innerHTML =
      '<b>' + s.roundDone + ' · ' + acc + '%</b>' +
      '<span>' + state.roundRight + ' / ' + state.roundTarget + ' ' + s.roundMeta + fmtClock(timeSec) + '</span>';

    var again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn primary';
    again.textContent = s.actions.restart;
    again.addEventListener('click', function () { startRoundOrQuestion(true); });
    box.appendChild(again);
    container.appendChild(box);

    var pr = $('prompt');
    pr.classList.remove('is-ok', 'is-bad');
    pr.classList.add(passed ? 'is-ok' : 'is-bad');
    $('pEyebrow').textContent = s.modes.test;
    $('pName').textContent = s.roundDone + ' · ' + acc + '%';
    $('pMeta').textContent = passed ? s.passedMsg : s.retryMsg;
    $('pBar').style.width = '100%';
  }

  function pickKind() {
    if (state.task !== 'mix') return state.task;
    var kinds = ['locate', 'symbol', 'property'];
    return kinds[Math.floor(Math.random() * kinds.length)];
  }

  function makeQuestion() {
    var s = S();
    var pool = activePool();
    var target = pool[Math.floor(Math.random() * pool.length)];
    var kind = pickKind();

    if (kind === 'locate') {
      return {
        kind: 'locate',
        target: target,
        pickedZ: null,
        eyebrow: s.promptLocate,
        title: s.qLocatePrefix + elName(target),
        meta: famName(target.fam) + ' · ' + s.periodWord + ' ' + target.period
      };
    }

    if (kind === 'symbol') {
      var distractors = shuffle(ELEMENTS.filter(function (e) { return e.z !== target.z; })).slice(0, 3);
      var opts = shuffle([target].concat(distractors)).map(function (e) {
        return {
          label: e.sym,
          sub: '',
          isRight: e.z === target.z
        };
      });
      return {
        kind: 'symbol',
        target: target,
        options: opts,
        pickedIdx: -1,
        eyebrow: s.promptSymbol,
        title: s.qSymbolTitle + elName(target) + '?',
        meta: famName(target.fam) + ' · ' + s.stateWord + ': ' + stateName(target.state)
      };
    }

    var roll = Math.random();
    if (roll < 0.34) {
      var useDistractors = shuffle(ELEMENTS.filter(function (e) { return e.z !== target.z; })).slice(0, 3);
      var useOpts = shuffle([target].concat(useDistractors)).map(function (e) {
        return {
          label: elName(e),
          sub: '',
          isRight: e.z === target.z
        };
      });
      return {
        kind: 'property',
        subkind: 'use',
        target: target,
        options: useOpts,
        pickedIdx: -1,
        eyebrow: s.promptUse,
        title: s.qUseTitle,
        meta: elUse(target)
      };
    }

    var allFams = Object.keys(FAMILIES);
    if (roll < 0.68) {
      var wrongFams = shuffle(allFams.filter(function (f) { return f !== target.fam; })).slice(0, 3);
      var famOpts = shuffle([target.fam].concat(wrongFams)).map(function (f) {
        return {
          label: famName(f),
          sub: '',
          isRight: f === target.fam
        };
      });
      return {
        kind: 'property',
        subkind: 'family',
        target: target,
        options: famOpts,
        pickedIdx: -1,
        eyebrow: s.promptProperty,
        title: s.qFamilyTitle + elName(target) + '?',
        meta: s.stateWord + ': ' + stateName(target.state)
      };
    }

    var poolFams = [];
    pool.forEach(function (e) {
      if (poolFams.indexOf(e.fam) === -1) poolFams.push(e.fam);
    });
    var chosenFam = poolFams[Math.floor(Math.random() * poolFams.length)] || target.fam;
    var famPoolEls = pool.filter(function (e) { return e.fam === chosenFam; });
    var famRep = famPoolEls.length ? famPoolEls[Math.floor(Math.random() * famPoolEls.length)] : target;
    var topic = FAMILY_TOPICS[chosenFam] || FAMILY_TOPICS.nonmetal;
    var wrongTopicFams = shuffle(allFams.filter(function (f) { return f !== chosenFam; })).slice(0, 3);
    var conceptOpts = shuffle([chosenFam].concat(wrongTopicFams)).map(function (f) {
      return {
        label: famName(f),
        sub: '',
        isRight: f === chosenFam
      };
    });
    return {
      kind: 'property',
      subkind: 'concept',
      target: famRep,
      options: conceptOpts,
      pickedIdx: -1,
      eyebrow: s.promptConcept,
      title: s.qConceptTitle,
      meta: LANG === 'en' ? topic.en : topic.es
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
    renderStage();
  }

  function submitLocateAnswer(el) {
    state.question.pickedZ = el.z;
    finishQuestion(el.z === state.question.target.z);
  }

  function submitChoiceAnswer(idx) {
    state.question.pickedIdx = idx;
    finishQuestion(!!state.question.options[idx].isRight);
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
  }

  function bindEvents() {
    $('langSel').addEventListener('change', function (e) { setLang(e.target.value); });

    window.addEventListener('storage', function (e) {
      if (e.key === 'todologo.lang' && (e.newValue === 'es' || e.newValue === 'en')) {
        setLang(e.newValue);
      }
    });

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

    $('searchIn').addEventListener('input', function (e) {
      state.search = e.target.value || '';
      if (state.mode === 'study') {
        var q = state.search.trim().toLowerCase();
        if (q) {
          var first = ELEMENTS.filter(function (el) {
            return String(el.z) === q || el.sym.toLowerCase() === q || el.es.toLowerCase().indexOf(q) === 0 || el.en.toLowerCase().indexOf(q) === 0;
          })[0];
          if (first) {
            state.selectedZ = first.z;
            STORE.set('selectedZ', first.z);
          }
        }
        renderStage();
      }
    });

    $('restartBtn').addEventListener('click', function () {
      if (state.mode === 'study') {
        state.famFilter = 'all';
        state.search = '';
        $('searchIn').value = '';
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

    $('photoModalClose').addEventListener('click', function () { $('photoModal').hidden = true; });
    $('photoModal').addEventListener('click', function (e) {
      if (e.target === $('photoModal')) $('photoModal').hidden = true;
    });

    document.addEventListener('keydown', function (e) {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) return;
      if (e.key === 'Escape' && !$('photoModal').hidden) {
        $('photoModal').hidden = true;
        return;
      }
      if (!$('intro').hidden) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          $('intro').hidden = true;
          STORE.set('seenIntro', true);
        }
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        toggleClean();
        return;
      }
      if (e.key === 'Escape' && CLEAN) {
        toggleClean(false);
        return;
      }
      if (state.mode === 'study') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          state.showLaw = false;
          state.selectedZ = state.selectedZ >= 118 ? 1 : state.selectedZ + 1;
          STORE.set('selectedZ', state.selectedZ);
          renderStage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          state.showLaw = false;
          state.selectedZ = state.selectedZ <= 1 ? 118 : state.selectedZ - 1;
          STORE.set('selectedZ', state.selectedZ);
          renderStage();
        }
      } else if (state.answered) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          advanceQuestion();
        }
      } else if (state.question && state.question.kind !== 'locate') {
        var idx = Number(e.key) - 1;
        if (idx >= 0 && idx < state.question.options.length) {
          submitChoiceAnswer(idx);
        }
      }
    });
  }

  function init() {
    applyStaticLabels();
    renderRail();
    bindEvents();
    if (!STORE.get('seenIntro', false)) {
      $('intro').hidden = false;
    }
    if (state.mode === 'study') {
      renderStage();
    } else {
      startRoundOrQuestion(true);
    }
  }

  init();
})();
