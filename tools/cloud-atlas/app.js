(function () {
  'use strict';

  var STORE = SiteProgress.tool('cloud-atlas');

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

  var TIERS = {
    high: { es: 'Piso alto (6–13 km)', en: 'High-level (6–13 km)', color: 'var(--t-high)' },
    mid:  { es: 'Piso medio (2–6 km)', en: 'Mid-level (2–6 km)',   color: 'var(--t-mid)' },
    low:  { es: 'Piso bajo (0–2 km)',  en: 'Low-level (0–2 km)',   color: 'var(--t-low)' },
    vert: { es: 'Desarrollo vertical', en: 'Vertical growth',      color: 'var(--t-vert)' },
    spec: { es: 'Especie / fenómeno',  en: 'Species / feature',    color: 'var(--t-spec)' }
  };

  var FORECAST_GROUPS = {
    fair:      { es: 'Estabilidad o buen tiempo',         en: 'Fair or settled weather' },
    frontSoon: { es: 'Cambio de tiempo / frente en 12–24 h', en: 'Weather change / front in 12–24 h' },
    steadyRain:{ es: 'Lluvia o nieve continua',           en: 'Steady continuous rain or snow' },
    storm:     { es: 'Tormenta eléctrica, granizo o ráfagas', en: 'Thunderstorm, hail, or squalls' },
    windWave:  { es: 'Onda de montaña o cizalladura fuerte', en: 'Mountain wave or strong wind shear' }
  };

  var CLOUDS = [
    {
      id: 'ci', code: 'Ci', tier: 'high', altKm: '7–13 km', x: 195, y: 56,
      photo: 'photos/ci.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Mountains_enhance_the_cirrus_clouds_over_the_U_S_Pacific_Northwest_%28CIRA_2019-12-20%29.webm',
      es: 'Cirrus', en: 'Cirrus',
      etymEs: 'Lat. cirrus («rizo / mechón»)', etymEn: 'Lat. cirrus ("curl / lock of hair")',
      compEs: 'Cristales de hielo', compEn: 'Ice crystals',
      scaleEs: 'Filamentos sin sombra', scaleEn: 'Hair-thin, no shadow',
      mechEs: 'Corrientes en chorro (>100 km/h) estiran cristales de hielo en la alta troposfera seca.',
      mechEn: 'Fast upper jet-stream winds (>100 km/h) stretch falling ice crystals into silky streaks.',
      forecastKey: 'frontSoon',
      forecastEs: 'Buen tiempo actual; si se densifican desde el oeste anuncia frente cálido.',
      forecastEn: 'Fair now; thickening westward bands signal an approaching warm front.',
      clueEs: 'Filamentos blancos sedosos (“colas de yegua”) que no tapan el sol ni proyectan sombra.',
      clueEn: 'Wispy, silky hair-like filaments (“mares’ tails”) that cast no shadow on the ground.',
      svg: '<g filter="url(#cGlow)">' +
        '<path d="M16 84 C52 80, 90 62, 132 46 C154 38, 176 36, 196 40" stroke="url(#iceGrad)" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9"/>' +
        '<path d="M26 94 C68 88, 106 70, 150 56 C172 49, 190 50, 204 54" stroke="#e9f7ff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.72"/>' +
        '<path d="M44 68 C84 60, 120 46, 166 32" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.9"/>' +
        '<line x1="126" y1="22" x2="196" y2="22" stroke="#6fd0e8" stroke-width="1.6" stroke-dasharray="3 2"/>' +
        '<path d="M190 18 L198 22 L190 26" stroke="#6fd0e8" stroke-width="1.6" fill="none"/>' +
        '<text x="16" y="24" fill="#9ad8ff" font-family="IBM Plex Mono,monospace" font-size="9">Jet &gt;100 km/h · Hielo</text>' +
      '</g>'
    },
    {
      id: 'cc', code: 'Cc', tier: 'high', altKm: '6–12 km', x: 335, y: 60,
      photo: 'photos/cc.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Fallstreak_Holes_Emerge_in_Clouds_Over_Texas_%28CIRA_2025-02-27_-_labels%29.webm',
      es: 'Cirrocumulus', en: 'Cirrocumulus',
      etymEs: 'Lat. cirrus + cumulus («rizo + montón»)', etymEn: 'Lat. cirrus + cumulus ("curl + heap")',
      compEs: 'Cristales de hielo', compEn: 'Ice crystals',
      scaleEs: '< 1° (< 1 dedo a brazo estirado)', scaleEn: '< 1° (< 1 finger width)',
      mechEs: 'Convección delgada e inestabilidad por ondas de gravedad a gran altitud en aire frío.',
      mechEn: 'Thin high-altitude convection sculpted by gravity waves inside icy upper layers.',
      forecastKey: 'frontSoon',
      forecastEs: 'Inestabilidad en altura; suele preceder cambios de tiempo en 12–24 horas.',
      forecastEn: 'High-altitude instability; often precedes weather shifts within 12–24 hours.',
      clueEs: '“Cielo empedrado” diminuto: gránulos blancos menores que 1 dedo con el brazo estirado.',
      clueEn: '“Mackerel sky” ripples: tiny translucent grains narrower than 1 finger at arm’s length.',
      svg: '<g fill="url(#puffLight)" opacity="0.95">' +
        '<ellipse cx="44" cy="48" rx="12" ry="5"/><ellipse cx="70" cy="46" rx="13" ry="5.5"/><ellipse cx="98" cy="46" rx="14" ry="5.5"/><ellipse cx="127" cy="45" rx="13" ry="5"/><ellipse cx="155" cy="47" rx="12" ry="5"/><ellipse cx="180" cy="49" rx="10" ry="4"/>' +
        '<ellipse cx="36" cy="61" rx="11" ry="4.8"/><ellipse cx="62" cy="59" rx="13" ry="5.5"/><ellipse cx="90" cy="60" rx="14" ry="5.6"/><ellipse cx="119" cy="59" rx="14" ry="5.5"/><ellipse cx="147" cy="60" rx="13" ry="5.2"/><ellipse cx="174" cy="62" rx="11" ry="4.8"/>' +
        '<ellipse cx="50" cy="73" rx="12" ry="5"/><ellipse cx="79" cy="73" rx="14" ry="5.5"/><ellipse cx="109" cy="74" rx="14" ry="5.5"/><ellipse cx="138" cy="73" rx="13" ry="5"/>' +
      '</g>' +
      '<line x1="86" y1="88" x2="112" y2="88" stroke="#f0cf6a" stroke-width="1.6"/>' +
      '<line x1="86" y1="84" x2="86" y2="92" stroke="#f0cf6a" stroke-width="1.4"/><line x1="112" y1="84" x2="112" y2="92" stroke="#f0cf6a" stroke-width="1.4"/>' +
      '<text x="110" y="103" text-anchor="middle" fill="#f0cf6a" font-family="IBM Plex Mono,monospace" font-size="9.5">&lt; 1° · &lt; 1 dedo</text>'
    },
    {
      id: 'cs', code: 'Cs', tier: 'high', altKm: '6–12 km', x: 475, y: 56,
      photo: 'photos/cs.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Near_the_Tubuai_Islands%2C_gravity_waves_propagate_through_thin_cirrus_clouds_%28CIRA_2018-12-07%29.webm',
      es: 'Cirrostratus', en: 'Cirrostratus',
      etymEs: 'Lat. cirrus + stratus («rizo + velo»)', etymEn: 'Lat. cirrus + stratus ("high veil")',
      compEs: 'Cristales hexagonales de hielo', compEn: 'Hexagonal ice crystals',
      scaleEs: 'Halo luminoso de 22°', scaleEn: '22° optical Sun/Moon halo',
      mechEs: 'Ascenso suave a gran escala delante de un frente cálido forma prismas de hielo que refractan a 22°.',
      mechEn: 'Broad gentle warm-front lift produces hexagonal ice prisms refracting sunlight at 22°.',
      forecastKey: 'frontSoon',
      forecastEs: 'Señal clásica de frente cálido cercano: lluvia probable en 12–18 horas.',
      forecastEn: 'Classic warm-front precursor: steady rain likely within 12–18 hours.',
      clueEs: 'Velo blanquecino translúcido que cubre todo el cielo y forma un halo de 22° alrededor del sol o la luna.',
      clueEn: 'Thin milky veil covering the whole sky that creates a 22° halo around the Sun or Moon.',
      svg: '<path d="M8 18 L212 18 L212 96 L8 96 Z" fill="url(#veilGrad)" opacity="0.55"/>' +
        '<circle cx="110" cy="52" r="32" fill="none" stroke="rgba(255,216,138,0.72)" stroke-width="3.2"/>' +
        '<circle cx="110" cy="52" r="30" fill="none" stroke="rgba(135,210,255,0.5)" stroke-width="1.2"/>' +
        '<line x1="110" y1="52" x2="142" y2="52" stroke="#f0cf6a" stroke-width="1.2" stroke-dasharray="2 2"/>' +
        '<circle cx="110" cy="52" r="6.5" fill="#fff7d6" filter="url(#cGlow)"/>' +
        '<text x="110" y="106" text-anchor="middle" fill="#ffe4a3" font-family="IBM Plex Mono,monospace" font-size="9.5">Halo 22° (prismas hielo)</text>'
    },
    {
      id: 'ac', code: 'Ac', tier: 'mid', altKm: '2–6 km', x: 195, y: 132,
      photo: 'photos/ac.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Altocumulus_mackerel_sky_in_Tokyo.webm',
      es: 'Altocumulus', en: 'Altocumulus',
      etymEs: 'Lat. altum + cumulus («medio + montón»)', etymEn: 'Lat. altum + cumulus ("mid + heap")',
      compEs: 'Gotitas subenfriadas e hielo', compEn: 'Supercooled droplets & ice',
      scaleEs: '1°–5° (1–3 dedos estirado)', scaleEn: '1°–5° (1–3 fingers)',
      mechEs: 'Convección en capas medias húmedas; en torres *castellanus* matinales indica inestabilidad tormentosa.',
      mechEn: 'Mid-level moist convection; morning vertical turrets (castellanus) signal afternoon storms.',
      forecastKey: 'frontSoon',
      forecastEs: 'Si aparecen en torres por la mañana en verano (castellanus), anticipan tormentas vespertinas.',
      forecastEn: 'Summer morning towers (castellanus) often trigger afternoon thunderstorms.',
      clueEs: 'Copos gris-blancos sombreados en bandas; cada glóbulo mide ~1 a 3 dedos a brazo estirado.',
      clueEn: 'Shaded white-gray patches in waves or rolls, roughly 1–3 fingers wide at arm’s length.',
      svg: '<g stroke="rgba(110,145,172,0.55)" stroke-width="1">' +
        '<ellipse cx="44" cy="42" rx="22" ry="10" fill="url(#puffMid)"/><ellipse cx="82" cy="39" rx="25" ry="11.5" fill="url(#puffLight)"/>' +
        '<ellipse cx="122" cy="40" rx="26" ry="11.5" fill="url(#puffLight)"/><ellipse cx="162" cy="43" rx="22" ry="10" fill="url(#puffMid)"/>' +
        '<ellipse cx="40" cy="61" rx="21" ry="9" fill="url(#puffMid)"/><ellipse cx="76" cy="59" rx="24" ry="11" fill="url(#puffLight)"/>' +
        '<ellipse cx="114" cy="59" rx="26" ry="11.5" fill="url(#puffLight)"/><ellipse cx="152" cy="61" rx="24" ry="10.5" fill="url(#puffMid)"/>' +
        '<ellipse cx="182" cy="64" rx="18" ry="8.5" fill="url(#puffMid)"/>' +
      '</g>' +
      '<line x1="78" y1="84" x2="140" y2="84" stroke="#6fd0e8" stroke-width="1.6"/>' +
      '<line x1="78" y1="80" x2="78" y2="88" stroke="#6fd0e8" stroke-width="1.4"/><line x1="140" y1="80" x2="140" y2="88" stroke="#6fd0e8" stroke-width="1.4"/>' +
      '<text x="110" y="102" text-anchor="middle" fill="#6fd0e8" font-family="IBM Plex Mono,monospace" font-size="9.5">1°–5° · 1–3 dedos</text>'
    },
    {
      id: 'as', code: 'As', tier: 'mid', altKm: '2–6 km', x: 465, y: 136,
      photo: 'photos/as.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Timelapse_of_Clouds_over_Bellevue_Canyon.webm',
      es: 'Altostratus', en: 'Altostratus',
      etymEs: 'Lat. altum + stratus («medio + manto»)', etymEn: 'Lat. altum + stratus ("mid + layer")',
      compEs: 'Gotitas y cristales de hielo', compEn: 'Water droplets & ice crystals',
      scaleEs: 'Sol difuso, sin sombras ni halo', scaleEn: 'Frosted-glass Sun, no shadows',
      mechEs: 'Aire húmedo cálido remonta una cuña fría en el frente cálido, espesando el velo de Cs a As.',
      mechEn: 'Warm humid air glides up a frontal wedge, thickening high Cirrostratus into a mid gray sheet.',
      forecastKey: 'steadyRain',
      forecastEs: 'Antesala inmediata de precipitación continua cuando sigue bajando la base.',
      forecastEn: 'Immediate prelude to continuous rain as the cloud base continues lowering.',
      clueEs: 'Manto gris azulado uniforme que deja ver el sol como tras un vidrio esmerilado, sin halo ni sombras.',
      clueEn: 'Uniform blue-gray sheet hiding shadows; the Sun shows dimly as if through frosted glass.',
      svg: '<circle cx="110" cy="34" r="13" fill="#ffe7aa" opacity="0.45" filter="url(#cBlur)"/>' +
        '<path d="M10 38 Q62 32 114 38 T210 36 L210 82 Q154 86 108 80 Q54 86 10 80 Z" fill="url(#strataMid)" opacity="0.88"/>' +
        '<path d="M20 72 L76 48" stroke="#f0cf6a" stroke-width="1.6" stroke-dasharray="3 2"/>' +
        '<path d="M70 46 L79 47 L73 54" stroke="#f0cf6a" stroke-width="1.6" fill="none"/>' +
        '<text x="110" y="102" text-anchor="middle" fill="#b8d5e8" font-family="IBM Plex Mono,monospace" font-size="9.5">Sol esmerilado ↗ Frente cálido</text>'
    },
    {
      id: 'ns', code: 'Ns', tier: 'mid', altKm: '0.5–5 km', x: 708, y: 200,
      photo: 'photos/ns.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Moving_clouds_timelapse_1152x694x10fps.ogv',
      es: 'Nimbostratus', en: 'Nimbostratus',
      etymEs: 'Lat. nimbus + stratus («lluvia + manto»)', etymEn: 'Lat. nimbus + stratus ("rain + layer")',
      compEs: 'Gotas de lluvia y nieve', compEn: 'Raindrops & snowflakes',
      scaleEs: 'Base difusa, lluvia sostenida', scaleEn: 'Ragged wet base, steady rain',
      mechEs: 'Saturación profunda de varios kilómetros de espesor en frentes activos; sin chispazos eléctricos.',
      mechEn: 'Deep multi-kilometer frontal cloud saturation generating continuous moderate rain or snow.',
      forecastKey: 'steadyRain',
      forecastEs: 'Lluvia o nevada moderada y persistente durante horas sin aparato eléctrico fuerte.',
      forecastEn: 'Steady, long-lasting moderate rain or snow without severe thunder.',
      clueEs: 'Capa gris oscura gruesa y amorfa de base difusa que bloquea por completo la luz solar.',
      clueEn: 'Thick dark-gray featureless blanket with ragged rain-blurred base blocking all sunlight.',
      svg: '<path d="M12 22 Q64 14 116 20 Q168 14 208 24 L204 68 Q162 76 122 68 Q78 78 14 68 Z" fill="url(#stormGrad)" stroke="#758fa3" stroke-width="1"/>' +
        '<g stroke="#7cd7f0" stroke-width="1.9" stroke-linecap="round" opacity="0.9">' +
          '<line x1="42" y1="70" x2="34" y2="96"/><line x1="66" y1="72" x2="58" y2="98"/><line x1="90" y1="70" x2="82" y2="96"/>' +
          '<line x1="114" y1="72" x2="106" y2="98"/><line x1="138" y1="70" x2="130" y2="96"/><line x1="162" y1="72" x2="154" y2="98"/>' +
        '</g>' +
        '<text x="110" y="109" text-anchor="middle" fill="#8ed5ef" font-family="IBM Plex Mono,monospace" font-size="9">↓ Lluvia continua (sin rayos)</text>'
    },
    {
      id: 'st', code: 'St', tier: 'low', altKm: '0–1.5 km', x: 195, y: 224,
      photo: 'photos/st.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Stratus_and_fog_%28blue%29_formation_and_dissipation_in_Colorado_%28CIRA_2017-05-12%29.webm',
      es: 'Stratus', en: 'Stratus',
      etymEs: 'Lat. stratus («capa extendida»)', etymEn: 'Lat. stratus ("spread out layer")',
      compEs: 'Gotitas de agua', compEn: 'Liquid water droplets',
      scaleEs: 'Velo bajo (<1.5 km) sobre colinas', scaleEn: 'Low blanket (<1.5 km)',
      mechEs: 'Enfriamiento húmedo junto al suelo o niebla elevada atrapada bajo una inversión térmica.',
      mechEn: 'Moist near-ground cooling or lifted fog trapped underneath a low thermal inversion lid.',
      forecastKey: 'fair',
      forecastEs: 'Tiempo gris y húmedo, posible llovizna fina o niebla levantada.',
      forecastEn: 'Cool overcast sky with light mist or drizzle; essentially lifted fog.',
      clueEs: 'Velo gris plano muy bajo que borra cimas de colinas y edificios; sin contornos definidos.',
      clueEn: 'Flat low gray layer that obscures hilltops; uniform base with little or no texture.',
      svg: '<path d="M12 92 L52 60 L96 92 L142 62 L192 92 Z" fill="#13232f"/>' +
        '<line x1="12" y1="38" x2="208" y2="38" stroke="#f0cf6a" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="4 3"/>' +
        '<rect x="8" y="44" width="204" height="24" rx="12" fill="url(#strataLow)" opacity="0.88"/>' +
        '<rect x="18" y="60" width="184" height="16" rx="8" fill="rgba(168,190,204,0.68)" filter="url(#cBlur)"/>' +
        '<text x="110" y="30" text-anchor="middle" fill="#f0cf6a" font-family="IBM Plex Mono,monospace" font-size="9">Tapa de inversión térmica</text>'
    },
    {
      id: 'sc', code: 'Sc', tier: 'low', altKm: '0.5–2 km', x: 330, y: 220,
      photo: 'photos/sc.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Stratocumulus-embedded_gravity_waves_over_Tennessee_%28CIRA_2020-10-30%29.webm',
      es: 'Stratocumulus', en: 'Stratocumulus',
      etymEs: 'Lat. stratus + cumulus («capa en grumos»)', etymEn: 'Lat. stratus + cumulus ("layered heaps")',
      compEs: 'Gotitas de agua', compEn: 'Liquid water droplets',
      scaleEs: '> 5° (> 3 dedos / puño)', scaleEn: '> 5° (> 3 fingers)',
      mechEs: 'Convección baja poco profunda frenada arriba por aire seco estable; la nube más abundante del planeta.',
      mechEn: 'Shallow low convection capped by stable dry air aloft—Earth’s most common cloud deck.',
      forecastKey: 'fair',
      forecastEs: 'Tiempo mayormente seco con claros ocasionales o llovizna débil aislada.',
      forecastEn: 'Mostly dry conditions with occasional breaks of sun or brief light drizzle.',
      clueEs: 'Masas abultadas grises y blancas en panal que cubren casi todo el cielo (> 3 dedos por bloque).',
      clueEn: 'Lumpy white-and-gray rolls or honeycomb patches (> 3 fingers wide each) with blue gaps.',
      svg: '<g>' +
        '<ellipse cx="44" cy="56" rx="30" ry="15" fill="url(#puffMid)"/><ellipse cx="86" cy="48" rx="34" ry="17" fill="url(#puffLight)"/>' +
        '<ellipse cx="132" cy="50" rx="32" ry="16" fill="url(#puffLight)"/><ellipse cx="176" cy="57" rx="28" ry="14" fill="url(#puffMid)"/>' +
        '<path d="M18 68 Q64 74 110 67 Q156 74 202 68" stroke="#5b7a90" stroke-width="5.5" stroke-linecap="round" fill="none"/>' +
      '</g>' +
      '<line x1="56" y1="84" x2="164" y2="84" stroke="#8fd9a8" stroke-width="1.6"/>' +
      '<line x1="56" y1="80" x2="56" y2="88" stroke="#8fd9a8" stroke-width="1.4"/><line x1="164" y1="80" x2="164" y2="88" stroke="#8fd9a8" stroke-width="1.4"/>' +
      '<text x="110" y="102" text-anchor="middle" fill="#8fd9a8" font-family="IBM Plex Mono,monospace" font-size="9.5">&gt; 5° · &gt; 3 dedos / puño</text>'
    },
    {
      id: 'cu', code: 'Cu', tier: 'vert', altKm: '0.6–2.5 km', x: 600, y: 214,
      photo: 'photos/cu.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Cumulus_timelapse_Skupowo-170324.webm',
      es: 'Cumulus', en: 'Cumulus',
      etymEs: 'Lat. cumulus («montón / coliflor»)', etymEn: 'Lat. cumulus ("heap / cauliflower")',
      compEs: 'Gotitas de agua', compEn: 'Liquid water droplets',
      scaleEs: 'Base plana NCL + cúpula blanca', scaleEn: 'Flat LCL base + crisp domes',
      mechEs: 'Burbujas térmicas (↑) ascienden desde suelo calentado hasta enfriarse y condensar justo en la base NCL.',
      mechEn: 'Sun-warmed thermals (↑) rise and cool adiabatically, condensing sharply at the flat LCL altitude.',
      forecastKey: 'fair',
      forecastEs: 'Buen tiempo (“cúmulos de buen tiempo”) si permanecen bajos y aislados.',
      forecastEn: 'Fair weather when small and isolated; if they tower upward, watch for showers.',
      clueEs: 'Cúpulas blancas brillantes en forma de coliflor con base plana oscura iluminada desde arriba.',
      clueEn: 'Crisp cauliflower domes with brilliant white sunlit tops and flat horizontal bases.',
      svg: '<g>' +
        '<path d="M40 76 C32 76, 30 62, 42 54 C42 36, 62 28, 78 36 C86 16, 118 12, 134 28 C150 22, 170 34, 166 52 C182 56, 184 72, 168 76 Z" fill="url(#puffLight)" stroke="#c7dfef" stroke-width="1.2"/>' +
        '<line x1="22" y1="76" x2="198" y2="76" stroke="#f0cf6a" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<path d="M108 102 L108 82" stroke="#f0cf6a" stroke-width="2"/><path d="M103 88 L108 81 L113 88" stroke="#f0cf6a" stroke-width="2" fill="none"/>' +
        '<text x="155" y="96" text-anchor="middle" fill="#f0cf6a" font-family="IBM Plex Mono,monospace" font-size="9">NCL · ↑ Térmica</text>' +
      '</g>'
    },
    {
      id: 'cb', code: 'Cb', tier: 'vert', altKm: '0.5–13 km', x: 822, y: 118,
      photo: 'photos/cb.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Timelapse_CUMULONIMBUS_sobre_Logro%C3%B1o._Convecci%C3%B3n_07-05-2018.webm',
      es: 'Cumulonimbus', en: 'Cumulonimbus',
      etymEs: 'Lat. cumulus + nimbus («torre + lluvia»)', etymEn: 'Lat. cumulus + nimbus ("tower + rain")',
      compEs: 'Gotas abajo, yunque de hielo arriba', compEn: 'Water below, ice anvil top',
      scaleEs: 'Yunque Incus (~12 km) + rayo', scaleEn: 'Tropopause Incus anvil + lightning',
      mechEs: 'Corriente ascendente violenta alcanza la tropopausa, donde el techo estable extiende el yunque de hielo y dispara descargas.',
      mechEn: 'Intense updrafts slam into the tropopause lid, spreading an icy anvil while rain cools downdrafts.',
      forecastKey: 'storm',
      forecastEs: 'Tormentas intensas: chaparrones, rayos, ráfagas descendentes y posible granizo.',
      forecastEn: 'Severe thunderstorms: downpours, lightning, gust fronts, and possible hail.',
      clueEs: 'Torre gigante que cruza toda la troposfera y se aplana arriba formando un yunque fibroso (incus).',
      clueEn: 'Towering storm cloud spanning the whole troposphere with a flat fibrous anvil top (incus).',
      svg: '<g>' +
        '<line x1="12" y1="18" x2="208" y2="18" stroke="#9ad8ff" stroke-opacity="0.55" stroke-dasharray="4 3"/>' +
        '<path d="M26 24 C74 16, 148 16, 198 24 C180 34, 152 38, 144 48 C158 58, 156 76, 142 84 L56 84 C44 76, 48 58, 62 50 C54 38, 38 32, 26 24 Z" fill="url(#cbGrad)" stroke="#d9ecfa" stroke-width="1.2"/>' +
        '<path d="M84 78 L84 42 M79 48 L84 41 L89 48" stroke="#9ad8ff" stroke-width="1.8" fill="none"/>' +
        '<g stroke="#6fd0e8" stroke-width="1.5" stroke-opacity="0.75" stroke-linecap="round"><line x1="66" y1="86" x2="60" y2="104"/><line x1="126" y1="86" x2="120" y2="104"/></g>' +
        '<path d="M106 84 L96 97 L106 97 L98 111" stroke="#f0cf6a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '<text x="110" y="13" text-anchor="middle" fill="#9ad8ff" font-family="IBM Plex Mono,monospace" font-size="8.5">Tropopausa → Yunque (Incus)</text>' +
      '</g>'
    },
    {
      id: 'len', code: 'Ac len', tier: 'spec', altKm: '2–7 km', x: 970, y: 136,
      photo: 'photos/len.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Time-lapse_recording_of_a_lenticular_cloud.webm',
      es: 'Lenticularis', en: 'Lenticular',
      etymEs: 'Lat. lenticularis («como lenteja»)', etymEn: 'Lat. lenticularis ("lens-shaped")',
      compEs: 'Gotitas en onda estacionaria', compEn: 'Stationary mountain-wave droplets',
      scaleEs: 'Inmóvil en cresta a sotavento', scaleEn: 'Stationary over mountain crest',
      mechEs: 'El viento cruza una montaña en ondas estacionarias; condensa al enfriarse en la cresta y evapora al descender.',
      mechEn: 'Strong flow crosses a mountain ridge creating standing lee waves; air condenses only in cool wave crests.',
      forecastKey: 'windWave',
      forecastEs: 'Viento fuerte en altura chocando contra montañas; turbulencia para aeronaves.',
      forecastEn: 'Strong upper-level winds crossing ridges; severe mountain-wave turbulence.',
      clueEs: 'Discos suaves en forma de lente o platillo apilado que permanecen inmóviles a sotavento.',
      clueEn: 'Smooth saucer- or lens-shaped stacks hovering stationary downwind of mountain peaks.',
      svg: '<path d="M14 102 L50 42 L86 102 Z" fill="#1b2c38" stroke="#3c586b" stroke-width="1.2"/>' +
        '<path d="M10 82 Q48 28 84 44 T144 48 T206 72" stroke="#6fd0e8" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>' +
        '<ellipse cx="142" cy="58" rx="42" ry="7.5" fill="url(#puffMid)" stroke="#9fc4db" stroke-width="1"/>' +
        '<ellipse cx="142" cy="45" rx="50" ry="9" fill="url(#puffLight)" stroke="#cde5f5" stroke-width="1.1"/>' +
        '<ellipse cx="142" cy="33" rx="34" ry="7" fill="#f3faff" stroke="#ffffff" stroke-width="0.9"/>' +
        '<text x="148" y="96" text-anchor="middle" fill="#6fd0e8" font-family="IBM Plex Mono,monospace" font-size="9">Onda orográfica (fija)</text>'
    },
    {
      id: 'mam', code: 'Cb mam', tier: 'spec', altKm: '4–8 km', x: 720, y: 68,
      photo: 'photos/mam.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Cumulonimbus-mammatus-Wolken_%C3%BCber_Birkholz_%28Bernau_bei_Berlin%29.webm',
      es: 'Mammatus', en: 'Mammatus',
      etymEs: 'Lat. mamma («bolsa / ubre»)', etymEn: 'Lat. mamma ("pouch / udder")',
      compEs: 'Bolsa descendente de hielo', compEn: 'Sinking ice-laden pockets',
      scaleEs: 'Lóbulos invertidos bajo yunque', scaleEn: 'Downward lobes below anvil',
      mechEs: 'Sublimación de cristales bajo el yunque enfría bolsas densas de aire que se hunden lentamente.',
      mechEn: 'Cooling from sublimating ice inside a storm anvil makes dense pockets sink into smooth pouches.',
      forecastKey: 'storm',
      forecastEs: 'Asociadas a yunques de cumulonimbos maduros con tormenta severa cercana.',
      forecastEn: 'Forms beneath mature cumulonimbus anvils signaling intense storm downdrafts.',
      clueEs: 'Bolsas o lóbulos redondeados colgando boca abajo bajo la base de una tormenta.',
      clueEn: 'Smooth pouch-like lobes bulging downward from the underside of a storm anvil.',
      svg: '<path d="M14 22 L206 22 L206 48 C194 68, 174 68, 164 50 C152 74, 128 74, 116 50 C104 76, 80 76, 68 50 C56 70, 34 70, 14 48 Z" fill="url(#mamGrad)" stroke="#d9c6b0" stroke-width="1.2"/>' +
        '<path d="M44 48 L44 64 M92 50 L92 68 M140 50 L140 68" stroke="#f0cf6a" stroke-width="1.6"/>' +
        '<text x="110" y="98" text-anchor="middle" fill="#ffd8a8" font-family="IBM Plex Mono,monospace" font-size="9">↓ Bolsas frías bajo el yunque</text>'
    },
    {
      id: 'vir', code: 'vir', tier: 'spec', altKm: '2–5 km', x: 330, y: 134,
      photo: 'photos/vir.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Timelapse_of_Clouds_over_Bellevue_Canyon.webm',
      es: 'Virga', en: 'Virga',
      etymEs: 'Lat. virga («vara / estela»)', etymEn: 'Lat. virga ("streak / rod")',
      compEs: 'Lluvia que se evapora', compEn: 'Evaporating rain streaks',
      scaleEs: 'Estelas sin tocar el suelo', scaleEn: 'Shafts vanish before ground',
      mechEs: 'Precipitación atraviesa una capa seca inferior y se evapora al caer, enfriando el aire (ráfagas secas).',
      mechEn: 'Rain falls into dry sub-cloud air and evaporates mid-air, chilling downdrafts into dry gusts.',
      forecastKey: 'windWave',
      forecastEs: 'Aire muy seco bajo la nube; riesgo de ráfagas secas (microrreventón) al enfriarse el aire.',
      forecastEn: 'Dry sub-cloud air evaporating rain; cooling can spark sudden dry microburst gusts.',
      clueEs: 'Cortinas o comas oscuras de precipitación que cuelgan de la base y desaparecen antes de tocar suelo.',
      clueEn: 'Wispy rain shafts trailing beneath a cloud that evaporate mid-air before hitting ground.',
      svg: '<path d="M34 42 C28 28, 52 16, 74 24 C86 10, 126 10, 138 24 C162 20, 186 32, 178 44 Z" fill="url(#puffMid)" stroke="#b8d5e8" stroke-width="1.2"/>' +
        '<g stroke="url(#virgaGrad)" stroke-width="3" stroke-linecap="round" fill="none">' +
          '<path d="M58 46 Q52 64 38 78"/><path d="M84 46 Q76 66 62 82"/><path d="M112 46 Q104 66 90 82"/><path d="M138 46 Q130 64 116 78"/>' +
        '</g>' +
        '<line x1="16" y1="88" x2="204" y2="88" stroke="#ffa657" stroke-opacity="0.55" stroke-dasharray="3 3"/>' +
        '<text x="110" y="103" text-anchor="middle" fill="#ffa657" font-family="IBM Plex Mono,monospace" font-size="9">Aire seco → se evapora antes</text>'
    },
    {
      id: 'kh', code: 'fluc', tier: 'spec', altKm: '2–6 km', x: 600, y: 130,
      photo: 'photos/kh.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Kelvin-Helmholtz_Instability.ogv',
      es: 'Kelvin–Helmholtz', en: 'Kelvin–Helmholtz (Fluctus)',
      etymEs: 'Lat. fluctus («ola / oleaje»)', etymEn: 'Lat. fluctus ("breaking wave")',
      compEs: 'Cizalladura entre dos capas', compEn: 'Two-layer wind shear',
      scaleEs: 'Crestas rizadas periódicas', scaleEn: 'Periodic curling sky waves',
      mechEs: 'Aire superior rápido (v₁) se desliza sobre capa lenta inferior (v₂), enrollando vórtices periódicos.',
      mechEn: 'Fast upper air sliding over a slower denser layer curls the cloud interface into ocean-like vortices.',
      forecastKey: 'windWave',
      forecastEs: 'Fuerte diferencia de velocidad del viento entre dos estratos; turbulencia aérea.',
      forecastEn: 'Strong wind-speed shear across an atmospheric boundary layer; aircraft turbulence.',
      clueEs: 'Olas rizadas perfectamente espaciadas que parecen crestas oceánicas rompiendo en el cielo.',
      clueEn: 'Evenly spaced curling wave crests resembling breaking ocean surf along the cloud top.',
      svg: '<path d="M18 76 Q38 74 48 52 Q58 34 72 42 Q60 54 78 64 Q98 66 108 46 Q118 32 130 42 Q118 54 136 64 Q156 66 166 46 Q176 32 188 42 Q176 54 196 66 L204 78 L18 78 Z" fill="url(#puffLight)" stroke="#ffffff" stroke-width="1.2"/>' +
        '<line x1="28" y1="22" x2="184" y2="22" stroke="#6fd0e8" stroke-width="2"/><path d="M178 18 L187 22 L178 26" stroke="#6fd0e8" stroke-width="1.8" fill="none"/>' +
        '<line x1="28" y1="90" x2="90" y2="90" stroke="#8d9ca9" stroke-width="1.6"/><path d="M84 87 L92 90 L84 93" stroke="#8d9ca9" stroke-width="1.5" fill="none"/>' +
        '<text x="150" y="96" text-anchor="middle" fill="#d2a8ff" font-family="IBM Plex Mono,monospace" font-size="9">v₁ ≫ v₂ Cizalladura</text>'
    },
    {
      id: 'arc', code: 'arc', tier: 'spec', altKm: '0.2–2 km', x: 822, y: 216,
      photo: 'photos/arc.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Arcus_passing_overhead_28_July_2021_Galley_Common.webm',
      es: 'Arcus (Nube estante)', en: 'Arcus (Shelf Cloud)',
      etymEs: 'Lat. arcus («arco / frente»)', etymEn: 'Lat. arcus ("arch / wedge")',
      compEs: 'Cuña fría frontal húmeda', compEn: 'Cold gust-front condensate',
      scaleEs: 'Banda baja delantera de tormenta', scaleEn: 'Low storm-leading horizontal wedge',
      mechEs: 'Aire frío descendente de tormenta barre el suelo y fuerza al aire cálido delantero a subir en cuña condensada.',
      mechEn: 'Cold storm outflow plows along the surface, forcing warm moist inflow upward into a tiered wedge.',
      forecastKey: 'storm',
      forecastEs: 'Ráfagas bruscas de viento inminentes (50–100 km/h), descenso térmico y llegada del aguacero.',
      forecastEn: 'Imminent sudden gust-front squalls (50–100 km/h), sharp cooling, and heavy rain arrival.',
      clueEs: 'Cuña horizontal baja y oscura en forma de estante («shelf cloud») o rodillo delante de una tormenta.',
      clueEn: 'Low menacing horizontal wedge (“shelf” or roll) sweeping in right ahead of storm rain.',
      svg: '<path d="M14 26 L186 26 C198 34, 198 46, 174 52 C156 58, 134 62, 114 66 L14 66 Z" fill="url(#stormGrad)" stroke="#c5d9e8" stroke-width="1.2"/>' +
        '<path d="M24 68 L94 68 L178 44" stroke="#6fd0e8" stroke-width="2" fill="none"/>' +
        '<path d="M170 42 L180 43 L175 51" stroke="#6fd0e8" stroke-width="1.8" fill="none"/>' +
        '<path d="M196 84 C178 72, 162 62, 154 54" stroke="#ffa657" stroke-width="1.8" stroke-dasharray="3 2" fill="none"/>' +
        '<text x="110" y="101" text-anchor="middle" fill="#f0cf6a" font-family="IBM Plex Mono,monospace" font-size="9">→ Frente de ráfaga frío</text>'
    },
    {
      id: 'asp', code: 'asp', tier: 'spec', altKm: '1–3 km', x: 465, y: 218,
      photo: 'photos/asp.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Asperitas_clouds_in_Santa_Barbara_in_2023_-_timelapse.webm',
      es: 'Asperitas', en: 'Asperitas',
      etymEs: 'Lat. asperitas («aspereza / mar agitado»)', etymEn: 'Lat. asperitas ("roughness")',
      compEs: 'Gotitas en ondas caóticas', compEn: 'Turbulent wave cloud base',
      scaleEs: 'Base ondulada como mar invertido', scaleEn: 'Rough inverted sea underside',
      mechEs: 'Ondas de gravedad acopladas con cizalladura ondulan la base inferior de capas bajas/medias sin precipitar.',
      mechEn: 'Intersecting gravity waves and wind shear sculpt chaotic wave troughs across the cloud underside.',
      forecastKey: 'windWave',
      forecastEs: 'Inestabilidad atmosférica tras frente o tormenta lejana; visualmente dramática, rara vez severa en superficie.',
      forecastEn: 'Turbulent post-frontal wave instability; dramatic sky appearance, usually benign at ground.',
      clueEs: 'Ondas irregulares y oscuras vistas desde abajo con iluminación lateral oblicua, como un mar encrespado.',
      clueEn: 'Localized chaotic wave-like billows viewed from beneath like a churning dark ocean surface.',
      svg: '<path d="M12 24 L208 24 L208 62 Q186 46 164 66 Q142 82 118 58 Q96 42 74 68 Q52 80 30 56 Q18 48 12 62 Z" fill="url(#stormGrad)" stroke="#d2e4f0" stroke-width="1.2"/>' +
        '<path d="M32 62 Q52 76 74 64 M118 56 Q142 78 164 62" stroke="#f0cf6a" stroke-opacity="0.7" stroke-width="1.8" fill="none"/>' +
        '<text x="110" y="102" text-anchor="middle" fill="#d2a8ff" font-family="IBM Plex Mono,monospace" font-size="9">Ondas de gravedad en la base</text>'
    },
    {
      id: 'pil', code: 'pil', tier: 'spec', altKm: '3–8 km', x: 720, y: 126,
      photo: 'photos/pil.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Cumulus_timelapse_Skupowo-170324.webm',
      es: 'Pileus (Nube gorro)', en: 'Pileus (Cap Cloud)',
      etymEs: 'Lat. pileus («gorro / birrete»)', etymEn: 'Lat. pileus ("felt cap")',
      compEs: 'Lámina lisa de gotitas o hielo', compEn: 'Smooth thin droplet/ice sheet',
      scaleEs: 'Casquete fino sobre torre cúmulo', scaleEn: 'Thin scarf over rising cumulus',
      mechEs: 'Una torre convectiva empuja rápidamente el aire húmedo situado encima hasta condensar en gorro arqueado.',
      mechEn: 'A surging cumulus tower pushes moist air above upward so fast it condenses as a sleek cap.',
      forecastKey: 'storm',
      forecastEs: 'Señal de corriente ascendente vigorosa: ese cúmulo suele transformarse en Cumulonimbus.',
      forecastEn: 'Strong convective updraft indicator: the underlying cumulus often grows into Cumulonimbus.',
      clueEs: 'Banda lisa o capucha blanca arqueada justo sobre la cima burbujeante de un cúmulo en crecimiento.',
      clueEn: 'Thin smooth horizontal hood clinging tightly right atop a rapidly bubbling cumulus dome.',
      svg: '<path d="M58 90 C54 74, 68 64, 80 68 C88 46, 132 46, 140 68 C154 64, 168 74, 162 90 Z" fill="url(#puffMid)" stroke="#b9d4e7" stroke-width="1.2"/>' +
        '<path d="M56 44 Q110 22 164 44" stroke="#ffffff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.92"/>' +
        '<path d="M62 44 Q110 24 158 44" stroke="#9ad8ff" stroke-width="2" fill="none"/>' +
        '<path d="M110 82 L110 56 M105 62 L110 55 L115 62" stroke="#f0cf6a" stroke-width="2" fill="none"/>' +
        '<text x="110" y="105" text-anchor="middle" fill="#9ad8ff" font-family="IBM Plex Mono,monospace" font-size="9">↑ Torre empuja capa húmeda</text>'
    },
    {
      id: 'nlc', code: 'NLC', tier: 'spec', altKm: '76–85 km', x: 935, y: 8,
      photo: 'photos/nlc.jpg',
      video: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Noctilucent_clouds.webm',
      es: 'Noctilucentes', en: 'Noctilucent (Mesospheric)',
      etymEs: 'Lat. noctilucens («brilla de noche»)', etymEn: 'Lat. noctilucens ("night-shining")',
      compEs: 'Cristales nanométricos sobre polvo meteórico', compEn: 'Nanometer ice on meteoric dust',
      scaleEs: 'Mesosfera (80 km), azul eléctrico', scaleEn: 'Mesosphere (80 km), electric blue',
      mechEs: 'Las nubes más altas de la Tierra (~80 km): hielo estival mesosférico a -120 °C iluminado por el Sol bajo el horizonte.',
      mechEn: 'Earth’s highest clouds (~80 km): polar summer mesospheric ice lit by a below-horizon twilight Sun.',
      forecastKey: 'fair',
      forecastEs: 'Fenómeno óptico veraniego en latitudes medias/altas durante el crepúsculo; no implica precipitación.',
      forecastEn: 'Rare high-latitude summer twilight optical display; completely unrelated to rain or storms.',
      clueEs: 'Filamentos azul eléctrico brillantes visibles en crepúsculo profundo tras ponerse el Sol en verano.',
      clueEn: 'Glowing electric-blue filament ripples shining against dark twilight long after sunset.',
      svg: '<rect x="6" y="10" width="208" height="82" rx="8" fill="#060f1c"/>' +
        '<path d="M16 42 C60 28, 128 46, 198 28" stroke="#7fe4ff" stroke-width="3.2" stroke-linecap="round" fill="none" filter="url(#cGlow)"/>' +
        '<path d="M24 56 C78 44, 140 58, 202 44" stroke="#bfefff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.88"/>' +
        '<path d="M18 68 C86 60, 148 70, 196 60" stroke="#4fbbe0" stroke-width="1.8" fill="none" opacity="0.75"/>' +
        '<line x1="6" y1="88" x2="214" y2="88" stroke="#ffa657" stroke-width="2" opacity="0.6"/>' +
        '<text x="110" y="105" text-anchor="middle" fill="#7fe4ff" font-family="IBM Plex Mono,monospace" font-size="9">80 km Mesosfera · Sol bajo horizonte</text>'
    }
  ];

  var BY_ID = {};
  CLOUDS.forEach(function (c) { BY_ID[c.id] = c; });

  var BLOCKS = [
    {
      id: 'all',
      es: 'Atlas completo (18 nubes)',
      en: 'Full Atlas (18 clouds)',
      match: function () { return true; }
    },
    {
      id: 'high',
      es: 'Nubes altas (Ci, Cc, Cs)',
      en: 'High clouds (Ci, Cc, Cs)',
      match: function (c) { return c.tier === 'high'; }
    },
    {
      id: 'mid',
      es: 'Nubes medias y lluvia (Ac, As, Ns)',
      en: 'Mid & rain clouds (Ac, As, Ns)',
      match: function (c) { return c.tier === 'mid'; }
    },
    {
      id: 'low_vert',
      es: 'Bajas y verticales (St, Sc, Cu, Cb)',
      en: 'Low & vertical (St, Sc, Cu, Cb)',
      match: function (c) { return c.tier === 'low' || c.tier === 'vert'; }
    },
    {
      id: 'spec',
      es: 'Especies y fenómenos clave (8)',
      en: 'Species & special clouds (8)',
      match: function (c) { return c.tier === 'spec'; }
    }
  ];

  var STRINGS = {
    es: {
      brandSub: 'Los 10 géneros OMM, pisos de la troposfera y predicción del tiempo',
      home: 'Volver al catálogo de Todologo',
      railTitle: 'Pisos de estudio',
      railPath: '90%+ en Examen marca el piso como completado.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Explora los pisos de la atmósfera, compara altitudes y revisa su señal climática.',
        practice: 'Entrena sin límite con ficha meteorológica completa tras cada respuesta.',
        test: 'Ronda de 12 preguntas cronometrada.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', identify: 'Silueta', altitude: 'Altura', forecast: 'Tiempo' },
      taskHints: {
        mix: 'Alterna identificación visual, piso atmosférico y pronóstico.',
        identify: 'Reconoce la nube por su silueta vectorial, foto real y pista visual.',
        altitude: 'Clasifica en qué piso o categoría se forma esta nube.',
        forecast: 'Predice qué tiempo o fenómeno anuncia esta formación.'
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
        keysHint: 'Flechas navegan · 1–4 responden · Space siguiente · C vista limpia'
      },
      docTitle: 'Atlas de Nubes · Todologo',
      creditText: 'Clasificación Atlas OMM · 10 géneros + 8 especies/fenómenos',
      allTiers: 'Todas las capas',
      compWord: 'Composición',
      altWord: 'Altitud típica',
      scaleWord: 'Escala / guía:',
      mechWord: 'Formación física:',
      clueWord: 'Pista visual:',
      forecastWord: 'Pronóstico:',
      studyEyebrow: 'Estudio atmosférico ·',
      qIdentifyEyebrow: 'Identificar formación',
      qIdentifyTitle: '¿Qué nube muestran esta silueta y fotografía?',
      qAltEyebrow: 'Piso troposférico',
      qAltTitlePrefix: '¿A qué nivel o grupo pertenece ',
      qForecastEyebrow: 'Lectura meteorológica',
      qForecastTitlePrefix: '¿Qué anuncia principalmente ',
      rightMsg: '¡Correcto! ',
      wrongMsg: 'Era ',
      roundDone: 'Ronda completada',
      roundMeta: 'aciertos en ',
      passedMsg: 'Piso superado (≥90%).',
      retryMsg: 'Necesitas 90%+ en Examen para completar este piso.',
      introTitle: 'Cómo leer el cielo y predecir el tiempo',
      introBody1: 'Todas las nubes combinan tres raíces latinas según su <b>forma</b> y <b>altura</b>:',
      introList: [
        '<li><b>Cirro / Alto / Estrato:</b> <i>Cirro-</i> significa hielo a gran altura (&gt; 6 km); <i>Alto-</i> nivel medio (2–6 km); <i>Estrato</i> capa plana y continua.</li>',
        '<li><b>Cúmulo y Nimbo:</b> <i>Cúmulo</i> indica crecimiento vertical con base plana; <i>Nimbo-</i> señala lluvia o precipitación activa.</li>',
        '<li><b>Lectura meteorológica:</b> de cirros finos a cirroestratos con halo y altoestratos espesos suele venir un frente cálido en 12–24 h.</li>'
      ],
      introGo: 'Empezar'
    },
    en: {
      brandSub: 'WMO 10 genera, troposphere layers & weather forecasting',
      home: 'Back to Todologo catalog',
      railTitle: 'Study Layers',
      railPath: '90%+ en Examen marca el piso como completado.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Explora los pisos de la atmósfera, compara altitudes y revisa su señal climática.',
        practice: 'Entrena sin límite con ficha meteorológica completa tras cada respuesta.',
        test: 'Ronda de 12 preguntas cronometrada.'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', identify: 'Silueta', altitude: 'Altura', forecast: 'Tiempo' },
      taskHints: {
        mix: 'Alterna identificación visual, piso atmosférico y pronóstico.',
        identify: 'Reconoce la nube por su silueta vectorial, foto real y pista visual.',
        altitude: 'Clasifica en qué piso o categoría se forma esta nube.',
        forecast: 'Predice qué tiempo o fenómeno anuncia esta formación.'
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
        keysHint: 'Flechas navegan · 1–4 responden · Space siguiente · C vista limpia'
      },
      docTitle: 'Atlas de Nubes · Todologo',
      creditText: 'Clasificación Atlas OMM · 10 géneros + 8 especies/fenómenos',
      allTiers: 'Todas las capas',
      compWord: 'Composición',
      altWord: 'Altitud típica',
      scaleWord: 'Escala / guía:',
      mechWord: 'Formación física:',
      clueWord: 'Pista visual:',
      forecastWord: 'Pronóstico:',
      studyEyebrow: 'Estudio atmosférico ·',
      qIdentifyEyebrow: 'Identificar formación',
      qIdentifyTitle: '¿Qué nube muestran esta silueta y fotografía?',
      qAltEyebrow: 'Piso troposférico',
      qAltTitlePrefix: '¿A qué nivel o grupo pertenece ',
      qForecastEyebrow: 'Lectura meteorológica',
      qForecastTitlePrefix: '¿Qué anuncia principalmente ',
      rightMsg: '¡Correcto! ',
      wrongMsg: 'Era ',
      roundDone: 'Ronda completada',
      roundMeta: 'aciertos en ',
      passedMsg: 'Bloque superado (≥90%).',
      retryMsg: 'Necesitas 90%+ en Examen para completar este piso.',
      introTitle: 'Cómo leer el cielo y predecir el tiempo',
      introBody1: 'Todas las nubes combinan tres raíces latinas según su <b>forma</b> y <b>altura</b>:',
      introList: [
        '<li><b>Cirro / Alto / Estrato:</b> <i>Cirro-</i> significa hielo a gran altura (&gt; 6 km); <i>Alto-</i> nivel medio (2–6 km); <i>Estrato</i> capa plana y continua.</li>',
        '<li><b>Cúmulo y Nimbo:</b> <i>Cúmulo</i> indica crecimiento vertical con base plana; <i>Nimbo-</i> señala lluvia o precipitación activa.</li>',
        '<li><b>Lectura meteorológica:</b> de cirros finos a cirroestratos con halo y altoestratos espesos suele venir un frente cálido en 12–24 h.</li>'
      ],
      introGo: 'Empezar'
    },
    en: {
      brandSub: 'WMO 10 genera, troposphere layers & weather forecasting',
      home: 'Back to Todologo catalog',
      railTitle: 'Study Layers',
      railPath: 'Score 90%+ in Test mode to mark a layer completed.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Explore troposphere height bands and compare cloud structure and weather signals.',
        practice: 'Unlimited practice with full meteorological inspection after each answer.',
        test: 'Timed 12-question assessment.'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mixed', identify: 'Shape', altitude: 'Altitude', forecast: 'Weather' },
      taskHints: {
        mix: 'Mixes visual cloud ID, altitude tier, and weather prediction.',
        identify: 'Identify the cloud from its vector diagram, real photo, and visual clue.',
        altitude: 'Classify the atmospheric height band for this cloud.',
        forecast: 'Predict what weather pattern this formation announces.'
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
        keysHint: 'Arrows browse · 1–4 answer · Space next · C clean view'
      },
      docTitle: 'Cloud Atlas · Todologo',
      creditText: 'WMO Cloud Atlas · 10 genera + 8 key species/features',
      allTiers: 'All layers',
      compWord: 'Composition',
      altWord: 'Typical altitude',
      scaleWord: 'Field scale:',
      mechWord: 'Formation physics:',
      clueWord: 'Visual clue:',
      forecastWord: 'Forecast:',
      studyEyebrow: 'Atmospheric study ·',
      qIdentifyEyebrow: 'Visual identification',
      qIdentifyTitle: 'Which cloud formation do this diagram and photo show?',
      qAltEyebrow: 'Tropospheric level',
      qAltTitlePrefix: 'Which tier or group contains ',
      qForecastEyebrow: 'Weather reading',
      qForecastTitlePrefix: 'What does this cloud mainly signal: ',
      rightMsg: 'Correct! ',
      wrongMsg: 'Answer: ',
      roundDone: 'Round complete',
      roundMeta: 'correct in ',
      passedMsg: 'Layer mastered (≥90%).',
      retryMsg: 'Score 90%+ in Test mode to mark this layer completed.',
      introTitle: 'Reading the Sky & Predicting Weather',
      introBody1: 'Cloud names combine simple Latin roots describing <b>height</b> and <b>shape</b>:',
      introList: [
        '<li><b>Cirro / Alto / Stratus:</b> <i>Cirro-</i> means high ice (&gt; 6 km); <i>Alto-</i> mid-level (2–6 km); <i>Stratus</i> flat uniform sheet.</li>',
        '<li><b>Cumulus & Nimbus:</b> <i>Cumulus</i> means vertical heap with flat base; <i>Nimbus-</i> marks active precipitation.</li>',
        '<li><b>Weather progression:</b> fine cirrus thickening to halo cirrostratus then altostratus typically signals a warm front in 12–24 h.</li>'
      ],
      introGo: 'Start'
    }
  };

  var state = {
    block: STORE.get('block', 'all'),
    mode: STORE.get('mode', 'study'),
    task: STORE.get('task', 'mix'),
    tierFilter: 'all',
    selectedId: STORE.get('selectedId', 'ci'),
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
    flashTimer: null
  };

  if (!BLOCKS.some(function (b) { return b.id === state.block; })) state.block = 'all';
  if (!BY_ID[state.selectedId]) state.selectedId = 'ci';

  var $ = function (id) { return document.getElementById(id); };
  function S() { return STRINGS[LANG] || STRINGS.es; }
  function cName(c) { return LANG === 'en' ? c.en : c.es; }
  function tierName(t) { return (TIERS[t] && TIERS[t][LANG]) || t; }
  function tierColor(t) { return (TIERS[t] && TIERS[t].color) || 'var(--scan)'; }

  function activePool() {
    var blk = BLOCKS.filter(function (b) { return b.id === state.block; })[0] || BLOCKS[0];
    return CLOUDS.filter(blk.match);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
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
      ? 'CLOUD <span>ATLAS</span><sup>T027</sup>'
      : 'ATLAS DE <span>NUBES</span><sup>T027</sup>';
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
      var countTxt = best ? (best.pct + '%') : String(CLOUDS.filter(b.match).length);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', state.block === b.id ? 'true' : 'false');
      btn.innerHTML =
        '<span><i>' + String(idx + 1).padStart(2, '0') + '</i>' + (LANG === 'en' ? b.en : b.es) + '</span>' +
        '<em class="' + statusCls + '">' + countTxt + '</em>';

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
        if (!state.answered) submitAnswer(idx);
      });
      box.appendChild(btn);
    });

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
      var c = BY_ID[state.selectedId] || CLOUDS[0];
      $('pEyebrow').textContent = s.studyEyebrow + ' ' + c.code + ' · ' + c.altKm;
      $('pName').textContent = cName(c);
      $('pMeta').textContent = tierName(c.tier) + ' · ' + (LANG === 'en' ? c.compEn : c.compEs);
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
      $('pEyebrow').textContent = state.lastOk ? s.rightMsg.trim() : (s.wrongMsg + target.code);
      $('pName').textContent = (state.lastOk ? s.rightMsg : s.wrongMsg) + cName(target) + ' (' + target.code + ')';
      $('pMeta').textContent = target.altKm + ' · ' + (LANG === 'en' ? target.forecastEn : target.forecastEs);
    } else {
      $('pEyebrow').textContent = q.eyebrow;
      $('pName').textContent = q.title;
      $('pMeta').textContent = q.meta;
    }
    renderDockActions();
  }

  function buildTierFilterBar() {
    var s = S();
    var bar = document.createElement('div');
    bar.className = 'sky-topbar';

    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'tier-chip';
    allBtn.style.setProperty('--tc', 'var(--scan)');
    allBtn.setAttribute('aria-pressed', state.tierFilter === 'all' ? 'true' : 'false');
    allBtn.innerHTML = '<i></i><span>' + s.allTiers + '</span>';
    allBtn.addEventListener('click', function () {
      state.tierFilter = 'all';
      renderStage();
    });
    bar.appendChild(allBtn);

    Object.keys(TIERS).forEach(function (k) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tier-chip';
      chip.style.setProperty('--tc', TIERS[k].color);
      chip.setAttribute('aria-pressed', state.tierFilter === k ? 'true' : 'false');
      chip.innerHTML = '<i></i><span>' + tierName(k) + '</span>';
      chip.addEventListener('click', function () {
        state.tierFilter = state.tierFilter === k ? 'all' : k;
        renderStage();
      });
      bar.appendChild(chip);
    });
    return bar;
  }

  function cloudSvgDefs() {
    return '<defs>' +
      '<filter id="cGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="cBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="3.2"/></filter>' +
      '<linearGradient id="puffLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="58%" stop-color="#dfeff9"/><stop offset="100%" stop-color="#98b8cf"/></linearGradient>' +
      '<linearGradient id="puffMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e3f1fa"/><stop offset="60%" stop-color="#acc8dc"/><stop offset="100%" stop-color="#6b899f"/></linearGradient>' +
      '<linearGradient id="cbGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f7fbff"/><stop offset="35%" stop-color="#bdd7ea"/><stop offset="72%" stop-color="#6a8499"/><stop offset="100%" stop-color="#3c5061"/></linearGradient>' +
      '<linearGradient id="stormGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#89a3b8"/><stop offset="55%" stop-color="#586f82"/><stop offset="100%" stop-color="#364857"/></linearGradient>' +
      '<linearGradient id="strataMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b6cfdf"/><stop offset="100%" stop-color="#6a8599"/></linearGradient>' +
      '<linearGradient id="strataLow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d2e4ee"/><stop offset="100%" stop-color="#87a3b5"/></linearGradient>' +
      '<linearGradient id="mamGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6b8399"/><stop offset="65%" stop-color="#b59786"/><stop offset="100%" stop-color="#e6b891"/></linearGradient>' +
      '<linearGradient id="iceGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#9ad8ff" stop-opacity="0.3"/><stop offset="60%" stop-color="#eef8ff"/><stop offset="100%" stop-color="#ffffff"/></linearGradient>' +
      '<linearGradient id="veilGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d7efff" stop-opacity="0.15"/><stop offset="50%" stop-color="#e6f5ff" stop-opacity="0.45"/><stop offset="100%" stop-color="#c4e5ff" stop-opacity="0.1"/></linearGradient>' +
      '<linearGradient id="virgaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8ed5ef" stop-opacity="0.9"/><stop offset="100%" stop-color="#8ed5ef" stop-opacity="0.05"/></linearGradient>' +
    '</defs>';
  }

  var DIAG_POS = {
    nlc: { x: 935, y: 8,   s: 0.33 },
    ci:  { x: 195, y: 56,  s: 0.36 },
    cc:  { x: 335, y: 60,  s: 0.36 },
    cs:  { x: 475, y: 56,  s: 0.36 },
    mam: { x: 720, y: 68,  s: 0.34 },
    ac:  { x: 195, y: 132, s: 0.36 },
    vir: { x: 330, y: 134, s: 0.36 },
    as:  { x: 465, y: 136, s: 0.36 },
    kh:  { x: 600, y: 130, s: 0.36 },
    pil: { x: 720, y: 126, s: 0.34 },
    cb:  { x: 822, y: 118, s: 0.45 },
    len: { x: 970, y: 136, s: 0.36 },
    st:  { x: 195, y: 224, s: 0.36 },
    sc:  { x: 330, y: 220, s: 0.36 },
    asp: { x: 465, y: 218, s: 0.36 },
    cu:  { x: 600, y: 214, s: 0.36 },
    ns:  { x: 708, y: 200, s: 0.38 },
    arc: { x: 822, y: 216, s: 0.36 }
  };

  function buildTroposphereDiagram(poolSet) {
    var box = document.createElement('div');
    box.className = 'sky-diagram';

    var labels = LANG === 'en'
      ? {
          meso: '76–85 km · -85 °C · Mesosphere',
          tropo: '12 km · -55 °C · Tropopause',
          high: '6 km · -15 °C · Ice zone',
          low: '2 km · 0 °C · Low base',
          sfc: '0 km · +15 °C',
          front: 'Warm front lift slope',
          ridge: 'Orographic wave ridge'
        }
      : {
          meso: '76–85 km · -85 °C · Mesosfera',
          tropo: '12 km · -55 °C · Tropopausa',
          high: '6 km · -15 °C · Zona hielo',
          low: '2 km · 0 °C · Base baja',
          sfc: '0 km · +15 °C',
          front: 'Rampa frente cálido',
          ridge: 'Cresta onda orográfica'
        };

    var hotspots = CLOUDS.map(function (c) {
      var pos = DIAG_POS[c.id] || { x: c.x, y: c.y, s: 0.36 };
      var sc = pos.s || 0.36;
      var active = !!poolSet[c.id] && (state.tierFilter === 'all' || c.tier === state.tierFilter);
      var selected = c.id === state.selectedId;
      var cls = 'cloud-hotspot' + (!active ? ' is-dim' : '') + (selected ? ' is-selected' : '');
      return '<g class="' + cls + '" data-cid="' + c.id + '" transform="translate(' + pos.x + ',' + pos.y + ') scale(' + sc + ')">' +
        '<rect x="6" y="-12" width="208" height="122" rx="14" fill="transparent"/>' +
        '<g class="cloud-gfx">' +
          c.svg +
          '<rect x="74" y="-8" width="74" height="22" rx="11" fill="#0a0f14" fill-opacity="0.9" stroke="' + (selected ? '#f0cf6a' : '#33475a') + '" stroke-width="2"/>' +
          '<text x="111" y="7" text-anchor="middle" fill="' + (selected ? '#f0cf6a' : '#ecdec2') + '" font-family="IBM Plex Mono,monospace" font-size="13" font-weight="700">' + c.code + '</text>' +
        '</g>' +
      '</g>';
    }).join('');

    box.innerHTML =
      '<svg class="sky-svg" viewBox="0 0 1120 310" role="img" aria-label="Atmospheric cloud layers diagram">' +
        '<defs>' +
          '<linearGradient id="skyBg" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#050b16"/>' +
            '<stop offset="16%" stop-color="#091829"/>' +
            '<stop offset="48%" stop-color="#112f49"/>' +
            '<stop offset="82%" stop-color="#1b4b6c"/>' +
            '<stop offset="100%" stop-color="#0c1d28"/>' +
          '</linearGradient>' +
          '<radialGradient id="sunGlow" cx="12%" cy="18%" r="25%">' +
            '<stop offset="0%" stop-color="#fff0c2" stop-opacity="0.42"/>' +
            '<stop offset="45%" stop-color="#6fd0e8" stop-opacity="0.1"/>' +
            '<stop offset="100%" stop-color="#102b43" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        cloudSvgDefs() +
        '<rect width="1120" height="310" fill="url(#skyBg)"/>' +
        '<rect width="1120" height="310" fill="url(#sunGlow)"/>' +
        '<line x1="0" y1="42" x2="1120" y2="42" stroke="#d2a8ff" stroke-opacity="0.28" stroke-dasharray="4 4"/>' +
        '<text x="12" y="28" fill="#d2a8ff" fill-opacity="0.82" font-family="IBM Plex Mono,monospace" font-size="10">' + labels.meso + '</text>' +
        '<line x1="0" y1="114" x2="1120" y2="114" stroke="#9ad8ff" stroke-opacity="0.24" stroke-dasharray="5 5"/>' +
        '<text x="12" y="60" fill="#9ad8ff" fill-opacity="0.8" font-family="IBM Plex Mono,monospace" font-size="10">' + labels.tropo + '</text>' +
        '<line x1="0" y1="196" x2="1120" y2="196" stroke="#6fd0e8" stroke-opacity="0.24" stroke-dasharray="5 5"/>' +
        '<text x="12" y="130" fill="#6fd0e8" fill-opacity="0.82" font-family="IBM Plex Mono,monospace" font-size="10">' + labels.high + '</text>' +
        '<line x1="0" y1="268" x2="1120" y2="268" stroke="#8fd9a8" stroke-opacity="0.24" stroke-dasharray="5 5"/>' +
        '<text x="12" y="210" fill="#8fd9a8" fill-opacity="0.82" font-family="IBM Plex Mono,monospace" font-size="10">' + labels.low + '</text>' +
        '<text x="12" y="288" fill="#f0cf6a" fill-opacity="0.8" font-family="IBM Plex Mono,monospace" font-size="10">' + labels.sfc + '</text>' +
        '<!-- Warm front lift curve linking Ns -> As -> Cs -> Ci -->' +
        '<path d="M745 258 Q560 175 235 72" stroke="#f0cf6a" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="6 5" fill="none"/>' +
        '<text x="580" y="192" fill="#f0cf6a" fill-opacity="0.52" font-family="IBM Plex Mono,monospace" font-size="9">' + labels.front + '</text>' +
        '<!-- Orographic standing wave streamlines above ridge -->' +
        '<path d="M915 220 Q960 160 1005 152 T1105 186" stroke="#6fd0e8" stroke-opacity="0.28" stroke-width="1.4" stroke-dasharray="3 3" fill="none"/>' +
        hotspots +
        '<path d="M0 310 L0 288 L180 282 L380 290 L610 282 L820 288 L945 276 L1012 214 L1076 276 L1120 272 L1120 310 Z" fill="#0b161f" stroke="#2d495b" stroke-width="1.2"/>' +
        '<text x="1012" y="301" text-anchor="middle" fill="#8d9ca9" font-family="IBM Plex Mono,monospace" font-size="9.5">' + labels.ridge + '</text>' +
      '</svg>';

    Array.prototype.forEach.call(box.querySelectorAll('.cloud-hotspot'), function (el) {
      el.addEventListener('click', function () {
        var cid = el.getAttribute('data-cid');
        if (!BY_ID[cid]) return;
        state.selectedId = cid;
        STORE.set('selectedId', cid);
        renderStage();
      });
    });

    return box;
  }

  function buildCloudStrip(pool) {
    var strip = document.createElement('div');
    strip.className = 'cloud-strip';
    pool.forEach(function (c) {
      if (state.tierFilter !== 'all' && c.tier !== state.tierFilter) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cloud-pill';
      btn.style.setProperty('--tc', tierColor(c.tier));
      btn.setAttribute('aria-pressed', state.selectedId === c.id ? 'true' : 'false');
      btn.innerHTML = '<span class="code">' + c.code + '</span><span>' + cName(c) + '</span>';
      btn.addEventListener('click', function () {
        state.selectedId = c.id;
        STORE.set('selectedId', c.id);
        renderStage();
      });
      strip.appendChild(btn);
    });
    return strip;
  }

  var activeRafs = [];
  var modalCloud = null;
  var modalBlind = false;

  function stopCloudAnims() {
    while (activeRafs.length) {
      var id = activeRafs.pop();
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id);
    }
  }

  function startCloudCanvas(canvas, cid) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var W = canvas.width;
    var H = canvas.height;
    var start = Date.now();
    var alive = true;

    function puff(x, y, rx, ry, col) {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }

    function drawFrame() {
      if (!alive) return;
      var t = (Date.now() - start) / 1000;
      var g = ctx.createLinearGradient(0, 0, 0, H);
      if (cid === 'nlc') {
        g.addColorStop(0, '#040914'); g.addColorStop(0.7, '#0d2240'); g.addColorStop(1, '#4c3832');
      } else if (cid === 'mam' || cid === 'asp') {
        g.addColorStop(0, '#101b27'); g.addColorStop(0.65, '#3b3242'); g.addColorStop(1, '#7a5244');
      } else if (cid === 'ns' || cid === 'arc' || cid === 'cb') {
        g.addColorStop(0, '#0a1622'); g.addColorStop(0.6, '#1a3245'); g.addColorStop(1, '#0e1d26');
      } else {
        g.addColorStop(0, '#0b2238'); g.addColorStop(0.7, '#194a6e'); g.addColorStop(1, '#265c7e');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (cid === 'ci') {
        for (var i = 0; i < 6; i++) {
          var ox = ((t * (26 + i * 5) + i * 70) % (W + 140)) - 140;
          ctx.beginPath();
          ctx.moveTo(ox, H * (0.28 + i * 0.1));
          ctx.bezierCurveTo(ox + 50, H * (0.22 + i * 0.1), ox + 90, H * (0.16 + i * 0.1), ox + 135, H * (0.19 + i * 0.1));
          ctx.strokeStyle = 'rgba(232,247,255,0.72)';
          ctx.lineWidth = 3.2 - i * 0.3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      } else if (cid === 'cc') {
        for (var r = 0; r < 5; r++) {
          for (var c = -1; c < 10; c++) {
            var x = ((c * 34 + t * 14 + r * 12) % (W + 40)) - 20;
            var y = H * 0.25 + r * H * 0.12 + Math.sin(t * 2 + c) * 2.5;
            puff(x, y, 11, 4.5, 'rgba(240,248,255,0.84)');
          }
        }
      } else if (cid === 'cs') {
        var sx = W * 0.5, sy = H * 0.45;
        ctx.beginPath(); ctx.arc(sx, sy, 14, 0, Math.PI * 2); ctx.fillStyle = '#fff5d4'; ctx.fill();
        ctx.beginPath(); ctx.arc(sx, sy, H * 0.34, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,220,150,' + (0.42 + 0.16 * Math.sin(t * 1.4)) + ')'; ctx.lineWidth = 4; ctx.stroke();
        var vx = ((t * 22) % (W + 120)) - W;
        ctx.fillStyle = 'rgba(225,244,255,0.22)'; ctx.fillRect(vx, 0, W * 0.9, H);
      } else if (cid === 'ac') {
        for (var k = -1; k < 7; k++) {
          var ax = ((k * 56 + t * 18) % (W + 60)) - 30;
          puff(ax, H * 0.42 + Math.sin(k + t) * 4, 24, 10, 'rgba(130,158,180,0.85)');
          puff(ax - 3, H * 0.38 + Math.sin(k + t) * 4, 22, 9, 'rgba(245,250,255,0.92)');
        }
        for (var k2 = -1; k2 < 6; k2++) {
          var ax2 = ((k2 * 62 + t * 20 + 20) % (W + 60)) - 30;
          puff(ax2, H * 0.65, 25, 10.5, 'rgba(235,245,255,0.88)');
        }
      } else if (cid === 'as') {
        ctx.beginPath(); ctx.arc(W * 0.5, H * 0.36, 15, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,235,180,0.45)'; ctx.fill();
        var sh = (Math.sin(t * 0.8) * 0.5 + 0.5);
        ctx.fillStyle = 'rgba(132,158,176,' + (0.62 + sh * 0.2) + ')';
        ctx.fillRect(0, H * 0.18, W, H * 0.52);
        for (var b = 0; b < 4; b++) {
          var bx = ((t * 26 + b * 95) % (W + 90)) - 90;
          puff(bx + 45, H * 0.32 + b * 14, 52, 9, 'rgba(180,204,220,0.28)');
        }
      } else if (cid === 'ns') {
        ctx.fillStyle = '#334656'; ctx.fillRect(0, 0, W, H * 0.46);
        for (var p = 0; p < 5; p++) puff(((p * 75 + t * 18) % (W + 80)) - 40, H * 0.44, 50, 16, '#2a3c4b');
        ctx.strokeStyle = 'rgba(126,216,242,0.75)'; ctx.lineWidth = 1.6;
        for (var rp = 0; rp < 26; rp++) {
          var rx = (rp * 23) % W;
          var ry = H * 0.44 + ((t * 160 + rp * 37) % (H * 0.58));
          ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 5, ry + 14); ctx.stroke();
        }
      } else if (cid === 'st') {
        ctx.fillStyle = '#10202b';
        ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W * 0.28, H * 0.58); ctx.lineTo(W * 0.58, H); ctx.lineTo(W * 0.84, H * 0.62); ctx.lineTo(W, H); ctx.fill();
        var stx = ((t * 24) % W);
        for (var s2 = -1; s2 <= 1; s2++) puff(stx + s2 * W * 0.65, H * 0.54, W * 0.42, H * 0.14, 'rgba(205,222,234,0.82)');
      } else if (cid === 'sc') {
        for (var i2 = -1; i2 < 6; i2++) {
          var sx2 = ((i2 * 66 + t * 22) % (W + 70)) - 35;
          puff(sx2, H * 0.52, 34, 16, 'rgba(165,190,208,0.86)');
          puff(sx2, H * 0.46, 30, 14, 'rgba(240,248,255,0.9)');
        }
      } else if (cid === 'cu') {
        var grow = 0.85 + 0.2 * Math.sin(t * 1.3);
        ctx.strokeStyle = 'rgba(240,207,106,0.5)'; ctx.lineWidth = 1.6;
        for (var ar = 0; ar < 3; ar++) {
          var ay = H - ((t * 36 + ar * 28) % (H * 0.35));
          ctx.beginPath(); ctx.moveTo(W * (0.38 + ar * 0.12), ay); ctx.lineTo(W * (0.38 + ar * 0.12), ay - 12); ctx.stroke();
        }
        var cx = W * 0.5, cy = H * 0.66;
        puff(cx - 32, cy - 8 * grow, 24 * grow, 20 * grow, '#e2f1fa');
        puff(cx + 30, cy - 8 * grow, 24 * grow, 20 * grow, '#dcecf7');
        puff(cx, cy - 22 * grow, 30 * grow, 26 * grow, '#ffffff');
        ctx.fillStyle = '#5f7e94'; ctx.fillRect(cx - 56, cy + 4, 112, 8);
      } else if (cid === 'cb') {
        var flash = (Math.floor(t * 1.4) % 4 === 0 && (t * 1.4) % 1 < 0.16);
        puff(W * 0.5, H * 0.22, W * 0.36, 16, '#eef7ff');
        puff(W * 0.5, H * 0.42, 42, 24, '#92afc4');
        puff(W * 0.5, H * 0.58, 48, 20, '#445a6b');
        ctx.strokeStyle = 'rgba(111,208,232,0.7)'; ctx.lineWidth = 1.6;
        for (var cr = 0; cr < 14; cr++) {
          var rx2 = W * 0.36 + cr * 6;
          var ry2 = H * 0.62 + ((t * 170 + cr * 29) % (H * 0.38));
          ctx.beginPath(); ctx.moveTo(rx2, ry2); ctx.lineTo(rx2 - 4, ry2 + 12); ctx.stroke();
        }
        if (flash) {
          ctx.beginPath(); ctx.moveTo(W * 0.52, H * 0.62); ctx.lineTo(W * 0.47, H * 0.78); ctx.lineTo(W * 0.53, H * 0.78); ctx.lineTo(W * 0.48, H * 0.96);
          ctx.strokeStyle = '#ffdf78'; ctx.lineWidth = 3; ctx.stroke();
        }
      } else if (cid === 'len') {
        ctx.fillStyle = '#182936'; ctx.beginPath(); ctx.moveTo(W * 0.08, H); ctx.lineTo(W * 0.28, H * 0.48); ctx.lineTo(W * 0.48, H); ctx.fill();
        ctx.strokeStyle = 'rgba(111,208,232,0.45)'; ctx.lineWidth = 1.6;
        for (var sw = 0; sw < 5; sw++) {
          var wx = ((t * 65 + sw * 65) % (W + 50)) - 25;
          var wy = H * 0.52 - Math.sin((wx / W) * Math.PI * 2) * 18;
          ctx.beginPath(); ctx.arc(wx, wy, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#8ce4ff'; ctx.fill();
        }
        puff(W * 0.64, H * 0.46, 46, 9, '#b5cfe0');
        puff(W * 0.64, H * 0.36, 54, 10, '#ecf7ff');
        puff(W * 0.64, H * 0.27, 36, 7.5, '#ffffff');
      } else if (cid === 'mam') {
        ctx.fillStyle = '#2c3d4c'; ctx.fillRect(0, 0, W, H * 0.34);
        for (var mb = 0; mb < 5; mb++) {
          var drop = Math.sin(t * 1.5 + mb * 0.9) * 5;
          puff(W * (0.14 + mb * 0.18), H * 0.38 + drop, 26, 22 + drop * 0.4, '#b88f7a');
        }
      } else if (cid === 'vir') {
        puff(W * 0.5, H * 0.26, W * 0.3, 18, '#a4bfd1');
        ctx.strokeStyle = 'rgba(142,213,239,0.65)'; ctx.lineWidth = 2.2;
        for (var vr = 0; vr < 7; vr++) {
          var vx2 = W * 0.26 + vr * W * 0.08;
          var evap = ((t * 48 + vr * 16) % (H * 0.38));
          ctx.beginPath(); ctx.moveTo(vx2, H * 0.34); ctx.quadraticCurveTo(vx2 - 8, H * 0.5, vx2 - 16, H * 0.38 + evap); ctx.stroke();
        }
      } else if (cid === 'kh') {
        var ph = (t * 28) % 62;
        ctx.fillStyle = '#eaf6ff';
        ctx.beginPath(); ctx.moveTo(0, H * 0.72);
        for (var wx2 = -62; wx2 < W + 62; wx2 += 62) {
          var cx2 = wx2 + ph;
          ctx.quadraticCurveTo(cx2 + 18, H * 0.66, cx2 + 28, H * 0.36);
          ctx.quadraticCurveTo(cx2 + 38, H * 0.22, cx2 + 44, H * 0.34);
          ctx.quadraticCurveTo(cx2 + 34, H * 0.48, cx2 + 62, H * 0.68);
        }
        ctx.lineTo(W, H * 0.72); ctx.fill();
      } else if (cid === 'arc') {
        var shx = ((t * 24) % 90) - 30;
        ctx.fillStyle = '#334859'; ctx.fillRect(0, 0, W * 0.72 + shx, H * 0.48);
        puff(W * 0.64 + shx, H * 0.38, 66, 20, '#6a8499');
        puff(W * 0.7 + shx, H * 0.44, 52, 13, '#b8cfdf');
        ctx.strokeStyle = '#6fd0e8'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(W * 0.4, H * 0.78); ctx.lineTo(W * 0.72 + shx, H * 0.78); ctx.stroke();
      } else if (cid === 'asp') {
        for (var rowA = 0; rowA < 3; rowA++) {
          ctx.beginPath();
          ctx.moveTo(0, H * (0.28 + rowA * 0.18));
          for (var ax3 = 0; ax3 <= W; ax3 += 14) {
            ctx.lineTo(ax3, H * (0.34 + rowA * 0.16) + Math.sin(ax3 * 0.05 + t * 2.2 + rowA) * 12);
          }
          ctx.strokeStyle = rowA === 1 ? '#f0cf6a' : '#89a7bd';
          ctx.lineWidth = 4; ctx.stroke();
        }
      } else if (cid === 'pil') {
        var surge = Math.sin(t * 2) * 8;
        puff(W * 0.5, H * 0.68 - surge * 0.4, 42, 34, '#c2d8e8');
        ctx.beginPath();
        ctx.moveTo(W * 0.24, H * 0.44 - surge * 0.6);
        ctx.quadraticCurveTo(W * 0.5, H * 0.18 - surge, W * 0.76, H * 0.44 - surge * 0.6);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
      } else if (cid === 'nlc') {
        for (var n = 0; n < 6; n++) {
          ctx.beginPath();
          ctx.moveTo(0, H * (0.24 + n * 0.1));
          for (var nx = 0; nx <= W; nx += 16) {
            ctx.lineTo(nx, H * (0.24 + n * 0.1) + Math.sin(nx * 0.03 + t * 1.6 + n) * 5);
          }
          ctx.strokeStyle = 'rgba(127,228,255,' + (0.78 - n * 0.09) + ')';
          ctx.lineWidth = 2.6; ctx.stroke();
        }
      }

      if (typeof requestAnimationFrame === 'function') {
        var rid = requestAnimationFrame(drawFrame);
        activeRafs.push(rid);
      }
    }

    drawFrame();
  }

  function showModalMode(c, blind, mode) {
    var img = $('photoModalImg');
    var vid = $('modalVideo');
    var cvs = $('modalCanvas');
    var tabs = $('modalTabRow');
    var animBtn = $('tabAnimBtn');
    var vidBtn = $('tabVideoBtn');
    var isVideoMode = mode === 'video' || mode === 'realvideo';

    stopCloudAnims();
    if (vid) { try { vid.pause(); } catch (_) {} }

    tabs.hidden = !isVideoMode;
    if (!isVideoMode) {
      img.hidden = false;
      cvs.hidden = true;
      vid.hidden = true;
      img.src = c.photo;
      img.alt = blind ? (LANG === 'en' ? 'Cloud photo' : 'Fotografía de nube') : cName(c);
      $('photoModalTitle').textContent = blind
        ? (LANG === 'en' ? 'Reference sky photo' : 'Fotografía real de cielo')
        : (cName(c) + ' (' + c.code + ') · ' + c.altKm);
      $('photoModalDesc').textContent = blind
        ? 'Wikimedia Commons'
        : ((LANG === 'en' ? c.mechEn : c.mechEs) + ' — Wikimedia Commons.');
      return;
    }

    $('photoModalTitle').textContent = blind
      ? (LANG === 'en' ? 'Live cloud dynamics simulation' : 'Dinámica física de formación')
      : (cName(c) + ' (' + c.code + ') · ' + (LANG === 'en' ? 'Time-lapse & physics' : 'Timelapse y dinámica'));
    animBtn.textContent = LANG === 'en' ? 'Physics simulation (offline)' : 'Simulación física (offline)';
    vidBtn.textContent = LANG === 'en' ? 'Real sky video (Wikimedia)' : 'Timelapse real (Wikimedia)';
    vidBtn.hidden = !c.video;

    if (mode === 'realvideo' && c.video) {
      img.hidden = true;
      cvs.hidden = true;
      vid.hidden = false;
      animBtn.className = 'btn';
      vidBtn.className = 'btn primary';
      vid.src = c.video;
      $('photoModalDesc').textContent = (LANG === 'en' ? 'Wikimedia Commons time-lapse · ' : 'Timelapse real Wikimedia Commons · ') + (blind ? '' : cName(c));
    } else {
      img.hidden = true;
      vid.hidden = true;
      cvs.hidden = false;
      animBtn.className = 'btn primary';
      vidBtn.className = 'btn';
      startCloudCanvas(cvs, c.id);
      $('photoModalDesc').textContent = blind
        ? (LANG === 'en' ? 'Physical evolution time-lapse' : 'Evolución física animada')
        : (LANG === 'en' ? c.mechEn : c.mechEs);
    }
  }

  function openPhotoZoom(c, blind, initialMode) {
    modalCloud = c;
    modalBlind = !!blind;
    $('photoModalClose').textContent = LANG === 'en' ? 'Close' : 'Cerrar';
    $('photoModal').hidden = false;
    showModalMode(c, modalBlind, initialMode === 'video' ? 'video' : 'photo');
  }

  function buildInspectorCard(c) {
    var s = S();
    var card = document.createElement('div');
    card.className = 'cloud-card';
    card.style.setProperty('--tc', tierColor(c.tier));

    var schemaLbl = LANG === 'en' ? 'Annotated diagram' : 'Esquema didáctico';
    var photoCap = LANG === 'en' ? 'Real photo · Zoom' : 'Foto real · Ampliar';
    var videoCap = LANG === 'en' ? 'Video / Motion · Play' : 'Vídeo / Dinámica · ▶';
    var etym = LANG === 'en' ? c.etymEn : c.etymEs;
    var scale = LANG === 'en' ? c.scaleEn : c.scaleEs;
    var mech = LANG === 'en' ? c.mechEn : c.mechEs;

    card.innerHTML =
      '<div class="cloud-preview">' +
        '<svg viewBox="0 0 220 116" aria-hidden="true">' + cloudSvgDefs() + c.svg + '</svg>' +
        '<small>' + schemaLbl + '</small>' +
      '</div>' +
      '<div class="cloud-info">' +
        '<div class="cloud-head">' +
          '<h4>' + cName(c) + '</h4>' +
          '<span class="wmo-badge">' + c.code + ' · ' + tierName(c.tier) + '</span>' +
          (etym ? '<span class="cloud-etym">' + etym + '</span>' : '') +
        '</div>' +
        '<div class="cloud-tags">' +
          '<span>' + s.altWord + ': ' + c.altKm + '</span>' +
          '<span>' + s.compWord + ': ' + (LANG === 'en' ? c.compEn : c.compEs) + '</span>' +
          (scale ? '<span>' + s.scaleWord + ' ' + scale + '</span>' : '') +
        '</div>' +
        '<p class="cloud-mech"><b>' + s.mechWord + '</b> ' + mech + '</p>' +
        '<p class="cloud-desc"><b>' + s.clueWord + '</b> ' + (LANG === 'en' ? c.clueEn : c.clueEs) + '</p>' +
        '<p class="cloud-clue"><b>' + s.forecastWord + '</b> ' + (LANG === 'en' ? c.forecastEn : c.forecastEs) + '</p>' +
      '</div>' +
      '<div class="cloud-media-pair">' +
        '<figure class="cloud-photo-wrap">' +
          '<img src="' + c.photo + '" alt="' + cName(c) + '" loading="lazy">' +
          '<figcaption class="cloud-photo-cap"><span>' + photoCap + '</span><span>⊕</span></figcaption>' +
        '</figure>' +
        '<figure class="cloud-video-wrap">' +
          '<canvas class="cloud-live-canvas" width="240" height="160"></canvas>' +
          '<figcaption class="cloud-photo-cap"><span>' + videoCap + '</span><span>▶</span></figcaption>' +
        '</figure>' +
      '</div>';

    var fig = card.querySelector('.cloud-photo-wrap');
    if (fig) fig.addEventListener('click', function () { openPhotoZoom(c, false, 'photo'); });
    var vfig = card.querySelector('.cloud-video-wrap');
    if (vfig) {
      startCloudCanvas(vfig.querySelector('canvas'), c.id);
      vfig.addEventListener('click', function () { openPhotoZoom(c, false, 'video'); });
    }

    return card;
  }

  function buildQuizFocusCard(q) {
    var c = q.target;
    var blind = q.kind === 'identify' && !state.answered;
    var box = document.createElement('div');
    box.className = 'quiz-focus';

    var schemaLbl = LANG === 'en' ? 'Annotated diagram' : 'Esquema didáctico';
    var photoCap = blind
      ? (LANG === 'en' ? 'Real sky · Zoom' : 'Cielo real · Ampliar')
      : (cName(c) + ' · ⊕');
    var videoCap = LANG === 'en' ? 'Time-lapse · Play' : 'Timelapse · ▶';

    var subClue = q.kind === 'identify'
      ? (LANG === 'en' ? c.clueEn : c.clueEs)
      : (q.kind === 'altitude'
          ? (c.code + ' — ' + (LANG === 'en' ? c.compEn : c.compEs))
          : (c.code + ' (' + c.altKm + ') — ' + (LANG === 'en' ? c.clueEn : c.clueEs)));

    box.innerHTML =
      '<div class="quiz-focus-media">' +
        '<div class="qf-panel">' +
          '<svg viewBox="0 0 220 116" aria-hidden="true">' + cloudSvgDefs() + c.svg + '</svg>' +
          '<small>' + schemaLbl + '</small>' +
        '</div>' +
        '<figure class="cloud-photo-wrap">' +
          '<img src="' + c.photo + '" alt="' + (blind ? (LANG === 'en' ? 'Reference cloud photograph' : 'Fotografía de referencia') : cName(c)) + '">' +
          '<figcaption class="cloud-photo-cap"><span>' + photoCap + '</span><span>⊕</span></figcaption>' +
        '</figure>' +
        '<figure class="cloud-video-wrap">' +
          '<canvas class="cloud-live-canvas" width="240" height="160"></canvas>' +
          '<figcaption class="cloud-photo-cap"><span>' + videoCap + '</span><span>▶</span></figcaption>' +
        '</figure>' +
      '</div>' +
      '<div class="quiz-clue-box">' + subClue + '</div>';

    var fig = box.querySelector('.cloud-photo-wrap');
    if (fig) fig.addEventListener('click', function () { openPhotoZoom(c, blind, 'photo'); });
    var vfig = box.querySelector('.cloud-video-wrap');
    if (vfig) {
      startCloudCanvas(vfig.querySelector('canvas'), c.id);
      vfig.addEventListener('click', function () { openPhotoZoom(c, blind, 'video'); });
    }

    return box;
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
    box.className = 'quiz-summary';
    box.innerHTML =
      '<b>' + s.roundDone + ' · ' + acc + '%</b>' +
      '<span>' + state.roundRight + ' / ' + state.roundTarget + ' ' + s.roundMeta + fmtClock(timeSec) + '</span>';

    var again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn primary';
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
  }

  function renderStage() {
    stopCloudAnims();
    var felt = $('felt');
    felt.innerHTML = '';
    var pool = activePool();
    var poolSet = {};
    pool.forEach(function (c) { poolSet[c.id] = true; });

    if (state.mode === 'study') {
      felt.appendChild(buildTierFilterBar());
      felt.appendChild(buildTroposphereDiagram(poolSet));
      felt.appendChild(buildCloudStrip(pool));
      felt.appendChild(buildInspectorCard(BY_ID[state.selectedId] || CLOUDS[0]));
      renderTopPrompt();
      return;
    }

    if (state.mode === 'test' && state.roundAsk > state.roundTarget) {
      renderRoundSummary(felt);
      return;
    }

    if (state.question) {
      if (state.answered) {
        felt.appendChild(buildInspectorCard(state.question.target));
      } else {
        felt.appendChild(buildQuizFocusCard(state.question));
      }
    }
    renderTopPrompt();
  }

  function pickKind() {
    if (state.task !== 'mix') return state.task;
    var kinds = ['identify', 'altitude', 'forecast'];
    return kinds[Math.floor(Math.random() * kinds.length)];
  }

  function makeQuestion() {
    var s = S();
    var pool = activePool();
    var target = pool[Math.floor(Math.random() * pool.length)];
    var kind = pickKind();

    if (kind === 'identify') {
      var distractors = shuffle(CLOUDS.filter(function (c) { return c.id !== target.id; })).slice(0, 3);
      var opts = shuffle([target].concat(distractors)).map(function (c) {
        return { label: cName(c) + ' (' + c.code + ')', isRight: c.id === target.id };
      });
      return {
        kind: 'identify',
        target: target,
        options: opts,
        pickedIdx: -1,
        eyebrow: s.qIdentifyEyebrow,
        title: s.qIdentifyTitle,
        meta: s.altWord + ': ' + target.altKm
      };
    }

    if (kind === 'altitude') {
      var tierKeys = Object.keys(TIERS);
      var wrongTiers = shuffle(tierKeys.filter(function (k) { return k !== target.tier; })).slice(0, 3);
      var tierOpts = shuffle([target.tier].concat(wrongTiers)).map(function (k) {
        return { label: tierName(k), isRight: k === target.tier };
      });
      return {
        kind: 'altitude',
        target: target,
        options: tierOpts,
        pickedIdx: -1,
        eyebrow: s.qAltEyebrow,
        title: s.qAltTitlePrefix + cName(target) + '?',
        meta: target.code + ' · ' + (LANG === 'en' ? target.compEn : target.compEs)
      };
    }

    var fcKeys = Object.keys(FORECAST_GROUPS);
    var wrongFc = shuffle(fcKeys.filter(function (k) { return k !== target.forecastKey; })).slice(0, 3);
    var fcOpts = shuffle([target.forecastKey].concat(wrongFc)).map(function (k) {
      return { label: FORECAST_GROUPS[k][LANG], isRight: k === target.forecastKey };
    });
    return {
      kind: 'forecast',
      target: target,
      options: fcOpts,
      pickedIdx: -1,
      eyebrow: s.qForecastEyebrow,
      title: s.qForecastTitlePrefix + cName(target) + '?',
      meta: target.code + ' · ' + target.altKm
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

  function submitAnswer(idx) {
    state.question.pickedIdx = idx;
    state.answered = true;
    state.lastOk = !!(state.question.options[idx] && state.question.options[idx].isRight);
    recordOutcome(state.lastOk);
    flashStage(state.lastOk);
    renderStage();
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

    $('restartBtn').addEventListener('click', function () {
      if (state.mode === 'study') {
        state.tierFilter = 'all';
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

    function closeModal() {
      $('photoModal').hidden = true;
      var vid = $('modalVideo');
      if (vid) { try { vid.pause(); } catch (_) {} }
      renderStage();
    }

    $('photoModalClose').addEventListener('click', closeModal);
    $('photoModal').addEventListener('click', function (e) {
      if (e.target === $('photoModal')) closeModal();
    });
    if ($('tabAnimBtn')) {
      $('tabAnimBtn').addEventListener('click', function () {
        if (modalCloud) showModalMode(modalCloud, modalBlind, 'video');
      });
    }
    if ($('tabVideoBtn')) {
      $('tabVideoBtn').addEventListener('click', function () {
        if (modalCloud) showModalMode(modalCloud, modalBlind, 'realvideo');
      });
    }
    if ($('modalVideo')) {
      $('modalVideo').addEventListener('error', function () {
        if (modalCloud) {
          showModalMode(modalCloud, modalBlind, 'video');
          $('photoModalDesc').textContent = (LANG === 'en'
            ? 'Remote video unavailable offline; showing physics time-lapse simulation. '
            : 'Vídeo remoto no disponible sin conexión; mostrando simulación física en vivo. ') + (LANG === 'en' ? modalCloud.mechEn : modalCloud.mechEs);
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) return;
      if (e.key === 'Escape' && !$('photoModal').hidden) { closeModal(); return; }
      if (!$('intro').hidden) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          $('intro').hidden = true;
          STORE.set('seenIntro', true);
        }
        return;
      }
      if (e.key === 'c' || e.key === 'C') { toggleClean(); return; }
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
      } else if (state.question) {
        var k = Number(e.key) - 1;
        if (k >= 0 && k < state.question.options.length) {
          submitAnswer(k);
        }
      }
    });
  }

  function init() {
    applyStaticLabels();
    renderRail();
    bindEvents();
    if (!STORE.get('seenIntro', false)) $('intro').hidden = false;
    if (state.mode === 'study') renderStage();
    else startRoundOrQuestion(true);
  }

  init();
})();
