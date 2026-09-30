/**
 * data.js — Datos turísticos del Ecuador
 * Proyecto: Ecuador Patrimonio Vivo
 * Descripción: Todos los datos de lugares, regiones y relatos
 * están centralizados aquí para facilitar su edición.
 *
 * CÓMO EDITAR:
 *  - Para agregar un lugar: copia un objeto del array y modifica sus campos.
 *  - Para agregar imágenes: pon el nombre del archivo en el campo "imagen"
 *    (ej. "img/cotopaxi.jpg") y completa creditoImagen y licencia.
 *  - Los campos marcados "POR COMPLETAR" o "POR VERIFICAR" deben ser
 *    revisados por el equipo antes de publicar.
 */

// ─────────────────────────────────────────────────────────────
// COLORES IDENTIFICADORES POR REGIÓN (para el placeholder CSS)
// ─────────────────────────────────────────────────────────────
const REGION_COLORES = {
  "Costa":     { inicio: "#1a6fad", fin: "#38b6ff" },
  "Sierra":    { inicio: "#2d7a3a", fin: "#6fcf7a" },
  "Amazonía":  { inicio: "#7b4d12", fin: "#e8a44a" },
  "Insular":   { inicio: "#0a4d6e", fin: "#00b4d8" }
};

// ─────────────────────────────────────────────────────────────
// RELATOS ILUSTRATIVOS (solo 4 ejemplos marcados claramente)
// ─────────────────────────────────────────────────────────────
const RELATOS_EJEMPLO = [
  {
    id: "relato-001",
    lugar_id: "cotopaxi-parque",
    texto: "Desde niño vi cómo el Cotopaxi nos cuida. Los abuelos decían que cuando la montaña habla con humo, hay que ofrecerle flores de campo y chicha. Hoy sigo esa costumbre cada enero, antes de que los turistas suban.",
    narrador: "Habitante de Latacunga (nombre reservado)",
    fuente: "POR COMPLETAR — entrevista de campo pendiente",
    esIlustrativo: true
  },
  {
    id: "relato-002",
    lugar_id: "otavalo-mercado",
    texto: "El Yamor no es solo una fiesta, es el momento en que toda la familia vuelve. Mi mamá hace la chicha de siete granos durante tres días; ese olor me recuerda quién soy y de dónde vengo.",
    narrador: "Artesana de Otavalo (nombre reservado)",
    fuente: "POR COMPLETAR — entrevista de campo pendiente",
    esIlustrativo: true
  },
  {
    id: "relato-003",
    lugar_id: "banos-agua-santa",
    texto: "La Virgen de Agua Santa es nuestra protectora. El 16 de noviembre, todos salimos en procesión con velas. Aunque me fui a estudiar a Quito, jamás he faltado a esa noche.",
    narrador: "Joven de Baños de Agua Santa (nombre reservado)",
    fuente: "POR COMPLETAR — entrevista de campo pendiente",
    esIlustrativo: true
  },
  {
    id: "relato-004",
    lugar_id: "zaruma-ciudad",
    texto: "La casas de madera de Zaruma tienen alma. Mi abuelo construyó la nuestra hace ochenta años con madera de guayacán. Cada balcón tallado cuenta una historia que ningún libro ha escrito.",
    narrador: "Adulto mayor de Zaruma (nombre reservado)",
    fuente: "POR COMPLETAR — entrevista de campo pendiente",
    esIlustrativo: true
  }
];

// ─────────────────────────────────────────────────────────────
// LUGARES TURÍSTICOS — 24 provincias, mínimo 2 por provincia
// ─────────────────────────────────────────────────────────────
const LUGARES = [

  // ══════════════════════════════
  //          R E G I Ó N   C O S T A
  // ══════════════════════════════

  // --- ESMERALDAS ---
  {
    id: "atacames-playa",
    nombre: "Playa de Atacames",
    provincia: "Esmeraldas",
    region: "Costa",
    descripcion: "Atacames es uno de los balnearios más populares del Ecuador, conocido por su arena fina, vida nocturna vibrante y la calidez de su gente afroecuatoriana.",
    patrimonio: "La marimba esmeraldeña, instrumento de origen africano declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO, se toca en fiestas y rituales de esta región.",
    latitud: 0.8696,
    longitud: -79.8480,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "mompiche-playa",
    nombre: "Mompiche",
    provincia: "Esmeraldas",
    region: "Costa",
    descripcion: "Mompiche es un pueblo pesquero de ensueño, rodeado de manglares y reconocido internacionalmente por sus olas perfectas para el surf.",
    patrimonio: "La pesca artesanal con canoa de madera es una tradición centenaria que los habitantes de Mompiche han transmitido de generación en generación.",
    latitud: 0.5303,
    longitud: -80.0297,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- MANABÍ ---
  {
    id: "machalilla-parque",
    nombre: "Parque Nacional Machalilla",
    provincia: "Manabí",
    region: "Costa",
    descripcion: "El único parque nacional costero del Ecuador protege bosques tropicales secos, playas vírgenes e Isla de la Plata, llamada la 'Galápagos pobre' por su fauna única.",
    patrimonio: "La cultura Manta prehispánica habitó esta zona; sus cerámicas y figurillas son parte del Patrimonio Arqueológico Nacional. POR VERIFICAR detalles exactos.",
    latitud: -1.5500,
    longitud: -80.8000,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "montecristi-ciudad",
    nombre: "Montecristi",
    provincia: "Manabí",
    region: "Costa",
    descripcion: "Ciudad histórica cuna del sombrero de paja toquilla, mal llamado 'sombrero Panamá'. Montecristi es también la tierra del expresidente Eloy Alfaro.",
    patrimonio: "El tejido del sombrero de paja toquilla de Montecristi está inscrito en la Lista Representativa del Patrimonio Cultural Inmaterial de la Humanidad de la UNESCO desde 2012.",
    latitud: -1.0444,
    longitud: -80.7561,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- SANTA ELENA ---
  {
    id: "salinas-balneario",
    nombre: "Salinas",
    provincia: "Santa Elena",
    region: "Costa",
    descripcion: "Salinas es el balneario más exclusivo de Ecuador, famoso por su malecón, pesca deportiva, y el avistamiento de ballenas jorobadas entre junio y septiembre.",
    patrimonio: "La Fiesta de San Pedro y San Pablo (29 de junio) reúne a pescadores en procesión por el mar, tradición viva de la identidad marinera de Salinas.",
    latitud: -2.2167,
    longitud: -80.9667,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "montanita-pueblo",
    nombre: "Montañita",
    provincia: "Santa Elena",
    region: "Costa",
    descripcion: "Montañita es el epicentro del surf en Ecuador y un destino de mochileros internacional, con una mezcla única de cultura local y cosmopolita.",
    patrimonio: "El Carnaval de Montañita fusiona danza, música tropical y tradiciones indígenas peninsulares en una celebración declarada de interés cultural municipal.",
    latitud: -1.8333,
    longitud: -80.7500,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- GUAYAS ---
  {
    id: "malecon2000-guayaquil",
    nombre: "Malecón 2000",
    provincia: "Guayas",
    region: "Costa",
    descripcion: "El Malecón Simón Bolívar de Guayaquil es una moderna franja fluvial sobre el río Guayas que integra museos, jardines, monumentos históricos y el embarcadero hacia Durán.",
    patrimonio: "El Barrio Las Peñas, junto al malecón, es el barrio más antiguo de Guayaquil, con casas de madera coloridas y el Cerro Santa Ana, declarados patrimonio cultural de la ciudad.",
    latitud: -2.1962,
    longitud: -79.8862,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "santay-isla",
    nombre: "Isla Santay",
    provincia: "Guayas",
    region: "Costa",
    descripcion: "Isla Santay es un área protegida frente a Guayaquil, hogar de cocodrilos americanos y aves migratorias, accesible por puente peatonal desde la ciudad.",
    patrimonio: "La comunidad de la Isla Santay mantiene prácticas de pesca artesanal y convivencia con la naturaleza que son modelo de turismo comunitario sostenible en Ecuador.",
    latitud: -2.2500,
    longitud: -79.8167,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- LOS RÍOS ---
  {
    id: "vinces-ciudad",
    nombre: "Vinces",
    provincia: "Los Ríos",
    region: "Costa",
    descripcion: "Vinces, llamada 'el París chiquito', fue un próspero puerto cacaotero a inicios del siglo XX cuya arquitectura republicana europea aún sorprende a los visitantes.",
    patrimonio: "La Fiesta del Cacao de Vinces celebra cada año la herencia de la Era del Cacao fino de aroma, que hizo del Ecuador la primera potencia cacaotera mundial.",
    latitud: -1.5647,
    longitud: -79.7439,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "ruta-cacao",
    nombre: "Ruta del Cacao",
    provincia: "Los Ríos",
    region: "Costa",
    descripcion: "La Ruta del Cacao atraviesa fincas centenarias de cacao Nacional Fino de Aroma, permitiendo conocer el proceso desde el árbol hasta el chocolate más reconocido del mundo.",
    patrimonio: "El cacao fino de aroma ecuatoriano (variedad Nacional) es Patrimonio Agroalimentario del Ecuador; sus rituales de cosecha y fermentación son saberes ancestrales.",
    latitud: -1.6000,
    longitud: -79.6500,
    imagen: "",
    busquedaImagen: ["cacao pods Ecuador", "Theobroma cacao Ecuador", "Los Ríos Ecuador Vinces"],
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- EL ORO ---
  {
    id: "zaruma-ciudad",
    nombre: "Zaruma",
    provincia: "El Oro",
    region: "Costa",
    descripcion: "Zaruma es una ciudad minera colonial enclavada en los Andes, conocida por sus casas de madera tallada con balcones que se asoman a profundas quebradas.",
    patrimonio: "La arquitectura vernácula de madera de Zaruma, con sus balcones calados y fachadas de colores, está declarada Patrimonio Cultural del Estado ecuatoriano.",
    latitud: -3.6833,
    longitud: -79.6167,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: "relato-004"
  },
  {
    id: "jambeli-isla",
    nombre: "Isla Jambelí",
    provincia: "El Oro",
    region: "Costa",
    descripcion: "Jambelí es una isla rodeada de bosques de manglar en el archipiélago de Jambelí, con playas tranquilas y comunidades de pescadores artesanales.",
    patrimonio: "La pesca artesanal de concha prieta y camarón en los manglares de Jambelí es un saber local ancestral vinculado a la identidad orense.",
    latitud: -3.3833,
    longitud: -80.1000,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- SANTO DOMINGO DE LOS TSÁCHILAS ---
  {
    id: "tsachilas-comunidad",
    nombre: "Comunidades Tsáchilas",
    provincia: "Santo Domingo de los Tsáchilas",
    region: "Costa",
    descripcion: "Las comunidades Tsáchilas conservan viva su cultura ancestral: pintura corporal con achiote, medicina tradicional y shamanismo reconocidos por el Estado ecuatoriano.",
    patrimonio: "La medicina tradicional Tsáchila y el uso ritual del achiote para la pintura corporal son Patrimonio Cultural Inmaterial del Ecuador.",
    latitud: -0.2522,
    longitud: -79.1719,
    imagen: "img/tsachilas.jpg",
    busquedaImagen: ["Tsáchila Santo Domingo Ecuador", "Tsachila indigenous Ecuador", "Santo Domingo de los Tsáchilas"],
    creditoImagen: "Imagen proporcionada por el equipo del proyecto",
    licencia: "Uso educativo",
    relato: null
  },
  {
    id: "toachi-rio",
    nombre: "Río Toachi",
    provincia: "Santo Domingo de los Tsáchilas",
    region: "Costa",
    descripcion: "El río Toachi es uno de los destinos de rafting y kayak más emocionantes del Ecuador, con rápidos de clase III y IV que atraviesan bosques nublados.",
    patrimonio: "El río Toachi es parte del territorio ancestral Tsáchila y sus riberas son escenario de rituales de purificación y convivencia comunitaria.",
    latitud: -0.3000,
    longitud: -79.2000,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // ══════════════════════════════
  //     R E G I Ó N   S I E R R A
  // ══════════════════════════════

  // --- CARCHI ---
  {
    id: "angel-reserva",
    nombre: "Reserva Ecológica El Ángel",
    provincia: "Carchi",
    region: "Sierra",
    descripcion: "La Reserva El Ángel alberga la mayor extensión de frailejones del Ecuador, plantas gigantes de los páramos altoandinos que producen agua vital para la región.",
    patrimonio: "Los frailejones son parte de la identidad cultural carchense; las comunidades los llaman 'guardianes del agua' y su protección es una práctica ancestral.",
    latitud: 0.6667,
    longitud: -77.9167,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "laguna-verde-carchi",
    nombre: "Laguna Verde",
    provincia: "Carchi",
    region: "Sierra",
    descripcion: "La Laguna Verde de El Ángel impresiona por su color turquesa intenso, resultado de algas microscópicas, en medio de un paisaje de páramo de alta montaña.",
    patrimonio: "POR VERIFICAR — la laguna tiene significado ritual para las comunidades indígenas del Carchi; datos específicos pendientes de investigación etnográfica.",
    latitud: 0.6500,
    longitud: -77.9333,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- IMBABURA ---
  {
    id: "otavalo-mercado",
    nombre: "Mercado de Otavalo",
    provincia: "Imbabura",
    region: "Sierra",
    descripcion: "El Mercado de Otavalo, conocido como la Plaza de los Ponchos, es el mercado artesanal indígena más grande de América del Sur y un símbolo de identidad kichwa.",
    patrimonio: "Los tejidos, tapices y artesanías otavaleñas son Patrimonio Cultural Material del Ecuador; la Fiesta del Yamor en septiembre es una celebración de gratitud a la cosecha.",
    latitud: 0.2308,
    longitud: -78.2636,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: "relato-002"
  },
  {
    id: "cuicocha-laguna",
    nombre: "Laguna de Cuicocha",
    provincia: "Imbabura",
    region: "Sierra",
    descripcion: "Cuicocha es una laguna volcánica de aguas azul-verde dentro de la caldera del volcán Cotacachi, con dos islotes habitados por patos silvestres y vegetación endémica.",
    patrimonio: "Para el pueblo kichwa Cotacachi, Cuicocha (lago de los cuyes en kichwa) es un lugar sagrado vinculado a ritos de agradecimiento a la Pachamama.",
    latitud: 0.3083,
    longitud: -78.3636,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- PICHINCHA ---
  {
    id: "quito-centro-historico",
    nombre: "Centro Histórico de Quito",
    provincia: "Pichincha",
    region: "Sierra",
    descripcion: "El Centro Histórico de Quito fue el primer sitio declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1978, con el conjunto de iglesias y conventos barrocos mejor conservado de América Latina.",
    patrimonio: "La Quiteña o Quito Barroco integra arte, arquitectura, música sacra y festividades religiosas como la Procesión de Jesús del Gran Poder, tradición de más de cuatro siglos.",
    latitud: -0.2200,
    longitud: -78.5125,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "mitad-mundo-monumento",
    nombre: "Ciudad Mitad del Mundo",
    provincia: "Pichincha",
    region: "Sierra",
    descripcion: "El monumento a la Mitad del Mundo marca la línea ecuatorial a 22 km de Quito. Alberga un museo etnográfico con exposiciones sobre las culturas indígenas del Ecuador.",
    patrimonio: "La cultura Cara o Caranqui construyó estructuras astronómicas en torno a la línea ecuatorial siglos antes de la llegada española; su legado es Patrimonio Arqueológico Nacional.",
    latitud: -0.0022,
    longitud: -78.4558,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- COTOPAXI ---
  {
    id: "cotopaxi-parque",
    nombre: "Parque Nacional Cotopaxi",
    provincia: "Cotopaxi",
    region: "Sierra",
    descripcion: "El Parque Nacional Cotopaxi protege el volcán activo más alto del mundo (5.897 m s.n.m.), con páramos, lagunas y una diversidad de flora y fauna andina.",
    patrimonio: "El Cotopaxi es un Apu (deidad montaña) para las comunidades indígenas de la Sierra central; sus faldas son escenario de rituales agrícolas y ceremonias de conexión con la Pachamama.",
    latitud: -0.6836,
    longitud: -78.4375,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: "relato-001"
  },
  {
    id: "quilotoa-laguna",
    nombre: "Laguna del Quilotoa",
    provincia: "Cotopaxi",
    region: "Sierra",
    descripcion: "La Laguna del Quilotoa es un cráter volcánico lleno de agua de color esmeralda, rodeado de comunidades indígenas que producen pinturas en tagua y artesanías únicas.",
    patrimonio: "Las pinturas de Tigua, elaboradas por artistas indígenas de la zona en cuero de borrego con escenas del mundo andino, son un arte naif declarado Patrimonio Cultural del Ecuador.",
    latitud: -0.8586,
    longitud: -78.9006,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- TUNGURAHUA ---
  {
    id: "banos-agua-santa",
    nombre: "Baños de Agua Santa",
    provincia: "Tungurahua",
    region: "Sierra",
    descripcion: "Baños es la 'puerta de la Amazonía', una ciudad de aventura con aguas termales, cascadas majestuosas y la vista permanente del volcán Tungurahua.",
    patrimonio: "La devoción a la Virgen de Agua Santa y la elaboración de la melcocha (caramelo de panela estirado a mano) son tradiciones culturales vivas e identitarias de Baños.",
    latitud: -1.3961,
    longitud: -78.4244,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: "relato-003"
  },
  {
    id: "pailon-diablo",
    nombre: "Pailón del Diablo",
    provincia: "Tungurahua",
    region: "Sierra",
    descripcion: "El Pailón del Diablo es una de las cascadas más impresionantes del Ecuador, con 80 metros de caída libre del río Pastaza, accesible desde Baños de Agua Santa.",
    patrimonio: "La Ruta de las Cascadas que conecta Baños con Puyo es un corredor cultural donde conviven comunidades quichuas, colono-mestizas y saberes sobre plantas medicinales.",
    latitud: -1.4583,
    longitud: -78.3972,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- BOLÍVAR ---
  {
    id: "salinas-guaranda",
    nombre: "Salinas de Guaranda",
    provincia: "Bolívar",
    region: "Sierra",
    descripcion: "Salinas es un pequeño pueblo serrano que se convirtió en modelo mundial de economía solidaria, con cooperativas de queso, chocolates artesanales y turismo comunitario.",
    patrimonio: "El modelo cooperativo de Salinas, liderado por la comunidad, integra saberes ancestrales de la minga (trabajo colectivo) con economía moderna, siendo referente latinoamericano.",
    latitud: -1.3919,
    longitud: -79.0264,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "guaranda-ciudad",
    nombre: "Guaranda",
    provincia: "Bolívar",
    region: "Sierra",
    descripcion: "Guaranda, 'Ciudad de las Siete Colinas', es capital de Bolívar y famosa por el Carnaval de Guaranda, considerado el más auténtico del Ecuador serrano.",
    patrimonio: "El Carnaval de Guaranda, con su canto, danza, juego con agua y la bebida tradicional del pájaro azul, es Patrimonio Cultural Inmaterial del Ecuador.",
    latitud: -1.5947,
    longitud: -78.9981,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- CHIMBORAZO ---
  {
    id: "chimborazo-volcan",
    nombre: "Volcán Chimborazo",
    provincia: "Chimborazo",
    region: "Sierra",
    descripcion: "El Chimborazo (6.263 m s.n.m.) es el punto de la Tierra más cercano al Sol por su ubicación en la línea ecuatorial. Su majestuosa cima nevada domina el paisaje de la Sierra central.",
    patrimonio: "Para los pueblos Puruhá, el Chimborazo es el 'Taita Chimborazo' (Padre Chimborazo), una deidad protectora cuya nieve se usaba en rituales y la que los hieleros aún cosechan artesanalmente.",
    latitud: -1.4691,
    longitud: -78.8174,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "nariz-diablo-tren",
    nombre: "Nariz del Diablo",
    provincia: "Chimborazo",
    region: "Sierra",
    descripcion: "La Nariz del Diablo es la obra de ingeniería ferroviaria más espectacular del Ecuador: un tren que desciende en zigzag por una pared rocosa casi vertical entre Alausí y Sibambe.",
    patrimonio: "El ferrocarril ecuatoriano es Patrimonio Cultural del Estado; su construcción a inicios del siglo XX unificó a la nación y es símbolo de identidad nacional.",
    latitud: -2.1981,
    longitud: -78.8514,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- CAÑAR ---
  {
    id: "ingapirca-ruinas",
    nombre: "Ingapirca",
    provincia: "Cañar",
    region: "Sierra",
    descripcion: "Ingapirca es el complejo arqueológico incaico más importante del Ecuador, con el Templo del Sol o Castillo como pieza central de arquitectura inca-cañari.",
    patrimonio: "Ingapirca es un Patrimonio Arqueológico del Estado ecuatoriano que evidencia la fusión de las culturas Cañari e Inca, con rituales solsticiales que aún celebra la comunidad local.",
    latitud: -2.5453,
    longitud: -78.8972,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "culebrillas-laguna",
    nombre: "Laguna de Culebrillas",
    provincia: "Cañar",
    region: "Sierra",
    descripcion: "La laguna de Culebrillas está a 3.800 m s.n.m. en los páramos de Cañar y fue un lugar sagrado para los incas; por sus orillas pasa el Camino del Inca (Qhapaq Ñan).",
    patrimonio: "El Qhapaq Ñan (Camino del Inca) que bordea Culebrillas es Patrimonio Mundial de la UNESCO desde 2014 (junto a otros países andinos).",
    latitud: -2.3667,
    longitud: -78.9667,
    imagen: "img/culebrillas.jpg",
    creditoImagen: "Imagen proporcionada por el equipo del proyecto",
    licencia: "Uso educativo",
    relato: null
  },

  // --- AZUAY ---
  {
    id: "cuenca-centro-historico",
    nombre: "Centro Histórico de Cuenca",
    provincia: "Azuay",
    region: "Sierra",
    descripcion: "El Centro Histórico de Cuenca es Patrimonio de la Humanidad (UNESCO, 1999) por su arquitectura colonial republicana, sus cúpulas azules y sus ríos que la atraviesan.",
    patrimonio: "La artesanía en cerámica, joyería en filigrana de plata y la producción del sombrero de paja toquilla son saberes patrimoniales vivos de la ciudad de Cuenca.",
    latitud: -2.8970,
    longitud: -79.0050,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "cajas-parque",
    nombre: "Parque Nacional El Cajas",
    provincia: "Azuay",
    region: "Sierra",
    descripcion: "El Cajas es un laberinto de más de 230 lagunas de glaciar a 4.000 m de altitud, con bosques de papel (polylepis) y truchas salvajes que atraen a pescadores y fotógrafos.",
    patrimonio: "El páramo del Cajas tiene vestigios de caminos incaicos y fue fuente de agua sagrada para los Cañaris. Su sistema hídrico abastece a Cuenca hasta hoy.",
    latitud: -2.7833,
    longitud: -79.2333,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- LOJA ---
  {
    id: "vilcabamba-valle",
    nombre: "Vilcabamba",
    provincia: "Loja",
    region: "Sierra",
    descripcion: "Vilcabamba, 'el Valle de la Longevidad', es famoso internacionalmente por la longevidad de sus habitantes y su microclima excepcional a 1.500 m s.n.m.",
    patrimonio: "POR VERIFICAR — las prácticas de medicina natural y dieta ancestral de los pobladores de Vilcabamba son objeto de estudio etnobotánico. Datos exactos pendientes.",
    latitud: -4.2625,
    longitud: -79.2206,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "saraguro-pueblo",
    nombre: "Saraguro",
    provincia: "Loja",
    region: "Sierra",
    descripcion: "Saraguro es una ciudad kichwa cuyo pueblo indígena mantiene con orgullo su vestimenta tradicional de color negro, su medicina ancestral y su música ritual.",
    patrimonio: "La vestimenta negra del pueblo Saraguro, elaborada con lana de oveja hilada a mano, es Patrimonio Cultural Inmaterial del Ecuador y símbolo de identidad colectiva.",
    latitud: -3.6333,
    longitud: -79.2333,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // ══════════════════════════════════
  //   R E G I Ó N   A M A Z O N Í A
  // ══════════════════════════════════

  // --- SUCUMBÍOS ---
  {
    id: "cuyabeno-reserva",
    nombre: "Reserva de Producción Faunística Cuyabeno",
    provincia: "Sucumbíos",
    region: "Amazonía",
    descripcion: "Cuyabeno es una de las reservas más biodiversas del planeta, con una red de lagunas habitadas por delfines de río rosados, caimanes y más de 500 especies de aves.",
    patrimonio: "Las comunidades Siona y Secoya que habitan Cuyabeno poseen un patrimonio intangible de conocimiento botánico de la selva que incluye más de 1.000 plantas medicinales. POR VERIFICAR cifra exacta.",
    latitud: 0.0000,
    longitud: -76.2000,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "sanrafael-cascada",
    nombre: "Cascada San Rafael",
    provincia: "Sucumbíos",
    region: "Amazonía",
    descripcion: "La cascada de San Rafael fue históricamente la más alta del Ecuador (145 m); en 2020 parte del lecho cedió, alterando su forma. Es un destino de trekking en la selva nororiental.",
    patrimonio: "POR VERIFICAR — el área tiene significado cultural para comunidades Cofán cercanas. Datos etnográficos pendientes de investigación.",
    latitud: -0.1167,
    longitud: -77.5833,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- NAPO ---
  {
    id: "jumandy-cavernas",
    nombre: "Cavernas del Jumandy",
    provincia: "Napo",
    region: "Amazonía",
    descripcion: "Las Cavernas del Jumandy, cerca de Archidona, son un sistema de cuevas subterráneas atravesadas por un río de aguas cristalinas, con balneario y tubing en su interior.",
    patrimonio: "Las cavernas llevan el nombre del cacique Jumandy, líder quichua que encabezó la gran sublevación indígena de 1578 contra la colonia española, símbolo de resistencia amazónica.",
    latitud: -0.9167,
    longitud: -77.8000,
    imagen: "",
    busquedaImagen: ["Cavernas del Jumandy Archidona", "Jumandy caves Napo Ecuador", "Archidona Napo Ecuador"],
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "papallacta-aguas",
    nombre: "Papallacta",
    provincia: "Napo",
    region: "Amazonía",
    descripcion: "Papallacta, en la puerta de la Amazonía, ofrece las aguas termales de mayor altitud del Ecuador (3.300 m s.n.m.), rodeadas de paisaje de páramo nublado.",
    patrimonio: "La ruta étnica del Quijos prehispánico pasa por Papallacta; los Quijos fueron un pueblo amazónico aliado y luego opositor de los Incas. POR VERIFICAR datos históricos exactos.",
    latitud: -0.3667,
    longitud: -78.1500,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- ORELLANA ---
  {
    id: "yasuni-parque",
    nombre: "Parque Nacional Yasuní",
    provincia: "Orellana",
    region: "Amazonía",
    descripcion: "El Yasuní es el punto de mayor biodiversidad del planeta por hectárea, hogar del pueblo Tagaeri-Taromenane en aislamiento voluntario, en el corazón de la Amazonía ecuatoriana.",
    patrimonio: "El pueblo Waorani y los grupos Tagaeri-Taromenane en aislamiento voluntario son Patrimonio Vivo de la humanidad; sus conocimientos del ecosistema amazónico son únicos e irremplazables.",
    latitud: -1.0000,
    longitud: -75.7500,
    imagen: "img/yasuni.jpg",
    creditoImagen: "Imagen proporcionada por el equipo del proyecto",
    licencia: "Uso educativo",
    relato: null
  },
  {
    id: "coca-ciudad",
    nombre: "Puerto Francisco de Orellana (Coca)",
    provincia: "Orellana",
    region: "Amazonía",
    descripcion: "Coca es la capital de Orellana y puerta de entrada al Yasuní y el Río Napo, uno de los afluentes más importantes del Amazonas, con un dinámico puerto fluvial.",
    patrimonio: "El río Napo fue navegado por Francisco de Orellana en 1542 en la primera expedición al Amazonas; ese viaje histórico es parte del patrimonio narrativo de Ecuador.",
    latitud: -0.4619,
    longitud: -76.9881,
    imagen: "img/coca.jpg",
    creditoImagen: "Imagen proporcionada por el equipo del proyecto",
    licencia: "Uso educativo",
    relato: null
  },

  // --- PASTAZA ---
  {
    id: "puyo-ciudad",
    nombre: "Puyo",
    provincia: "Pastaza",
    region: "Amazonía",
    descripcion: "Puyo es la capital amazónica más accesible del Ecuador continental, punto de partida para explorar la selva y conocer culturas Achuar, Shuar y Waorani.",
    patrimonio: "La cerámica Napo-Kichwa de Puyo, con diseños geométricos en rojo y negro, es una expresión artística ancestral femenina de gran valor cultural.",
    latitud: -1.4897,
    longitud: -77.9978,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "omaere-parque",
    nombre: "Parque Etnobotánico Omaere",
    provincia: "Pastaza",
    region: "Amazonía",
    descripcion: "Omaere es un parque urbano en Puyo que exhibe las plantas y técnicas constructivas de cinco pueblos amazónicos: Waorani, Shiwiar, Shuar, Achuar y Kichwa.",
    patrimonio: "Omaere preserva el conocimiento etnobotánico de los pueblos amazónicos: el uso medicinal, alimenticio y ritual de más de 300 especies de plantas. POR VERIFICAR cifra exacta.",
    latitud: -1.4939,
    longitud: -77.9942,
    imagen: "",
    busquedaImagen: ["Omaere Puyo Pastaza", "Parque Omaere Puyo", "Puyo Pastaza Ecuador"],
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- MORONA SANTIAGO ---
  {
    id: "macas-ciudad",
    nombre: "Macas",
    provincia: "Morona Santiago",
    region: "Amazonía",
    descripcion: "Macas, capital de Morona Santiago, es la ciudad amazónica con mayor presencia de la cultura Shuar, con artesanías en plumas, semillas y cerámica.",
    patrimonio: "La cultura Shuar es reconocida por su resistencia histórica, su música ritual (anent), sus prácticas curanderiles y la elaboración de artesanías con materiales naturales de la selva.",
    latitud: -2.3072,
    longitud: -78.1186,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "sangay-parque",
    nombre: "Parque Nacional Sangay",
    provincia: "Morona Santiago",
    region: "Amazonía",
    descripcion: "El Parque Sangay, Patrimonio Natural de la Humanidad (UNESCO, 1983), alberga tres volcanes activos, selvas tropicales y páramos, con una biodiversidad extraordinaria.",
    patrimonio: "El Sangay fue la frontera natural entre el mundo andino y amazónico para las culturas Puruhá y Shuar; sus caminos prehispánicos aún son transitados por comunidades locales.",
    latitud: -2.0000,
    longitud: -78.3333,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // --- ZAMORA CHINCHIPE ---
  {
    id: "podocarpus-parque",
    nombre: "Parque Nacional Podocarpus",
    provincia: "Zamora Chinchipe",
    region: "Amazonía",
    descripcion: "Podocarpus alberga el único bosque de podocarpus (pino del sur) en Ecuador y es uno de los 10 sitios de mayor endemismo de aves en el mundo.",
    patrimonio: "El pueblo Shuar de Zamora Chinchipe tiene en el territorio del Podocarpus su área ancestral de caza y recolección, con conocimientos botánicos únicos sobre su flora.",
    latitud: -4.0667,
    longitud: -79.1333,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "tapichalaca-reserva",
    nombre: "Reserva Tapichalaca",
    provincia: "Zamora Chinchipe",
    region: "Amazonía",
    descripcion: "Tapichalaca es una reserva privada de la Fundación Jocotoco, mundialmente famosa por ser el único hábitat del jocotoco o perdiz de antifaz, especie casi extinta.",
    patrimonio: "POR VERIFICAR — la reserva está en territorio Saraguro-Shuar; datos sobre prácticas culturales locales pendientes de investigación etnográfica.",
    latitud: -4.5167,
    longitud: -79.1333,
    imagen: "",
    busquedaImagen: ["Reserva Tapichalaca Zamora Chinchipe", "Tapichalaca Jocotoco", "Zamora Chinchipe Ecuador"],
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },

  // ══════════════════════════════════
  //   R E G I Ó N   I N S U L A R
  // ══════════════════════════════════

  // --- GALÁPAGOS ---
  {
    id: "tortuga-bay-galapagos",
    nombre: "Tortuga Bay — Santa Cruz",
    provincia: "Galápagos",
    region: "Insular",
    descripcion: "Tortuga Bay es una de las playas más bellas y vírgenes del mundo, en Santa Cruz, con iguanas marinas, pelícanos, piqueros de patas azules y tiburones de punta blanca en sus aguas.",
    patrimonio: "Las Islas Galápagos fueron declaradas Patrimonio Natural de la Humanidad (UNESCO, 1978) y reserva de la biosfera; su ecosistema único inspiró la Teoría de la Evolución de Darwin.",
    latitud: -0.7667,
    longitud: -90.3333,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  },
  {
    id: "kicker-rock-galapagos",
    nombre: "Kicker Rock (León Dormido) — San Cristóbal",
    provincia: "Galápagos",
    region: "Insular",
    descripcion: "Kicker Rock es una formación de lava de 150 metros de altura en San Cristóbal, rodeada por aguas habitadas por tiburones de Galápagos, mantarrayas y tortugas marinas.",
    patrimonio: "San Cristóbal fue la primera isla habitada por colonos ecuatorianos en Galápagos; su historia de colonización y conservación es parte del Patrimonio Cultural del Archipiélago.",
    latitud: -0.8722,
    longitud: -89.6000,
    imagen: "",
    creditoImagen: "POR COMPLETAR",
    licencia: "POR COMPLETAR",
    relato: null
  }

]; // fin LUGARES

// ─────────────────────────────────────────────────────────────
// TEXTO DE LA SECCIÓN "SOBRE EL PROYECTO"
// ─────────────────────────────────────────────────────────────
const PROYECTO = {
  nombre: "Ecuador Patrimonio Vivo",
  slogan: "Conoce, valora y preserva la riqueza cultural de tu país",
  objetivo: "Preservar y difundir el patrimonio cultural ecuatoriano mediante una plataforma digital accesible, fomentando el turismo responsable y el orgullo por la identidad nacional.",
  publicoObjetivo: "Estudiantes universitarios, docentes, turistas nacionales e internacionales, y comunidades locales que deseen conocer y promover la riqueza cultural del Ecuador.",
  beneficios: [
    "Centraliza información cultural y turística de las 24 provincias en un solo sitio.",
    "Conecta al visitante con la identidad patrimonial de cada destino.",
    "Facilita la planificación del viaje con enlaces directos a mapas y hoteles.",
    "Integra voces de moradores reales para humanizar el patrimonio.",
    "Es de código abierto y editable por estudiantes como herramienta educativa."
  ],
  // Integrantes del equipo: un nombre por línea, formato "Apellidos Nombres".
  // Para agregar o quitar a alguien, copia o borra una línea completa
  // (con sus comillas y la coma final). Se ordenan solos alfabéticamente.
  equipo: [
    "Acosta Solina Ana Nicole",
    "Álvarez López Milena Nicole",
    "Andrade Soledispa Abraham Gerardo",
    "Jácome Granada César David",
    "Paucar Salazar Jefferson Alexander",
    "Peña Chica Byron Gabriel",
    "Quiñonez Galarza Aarón Alexander",
    "Ron Guerrero Johanna Gabriela",
    "Sancan Sancan Adams Joel",
    "Villamarín Villamarín José Luis"
  ],  universidad: "Universidad Estatal de Milagro (UNEMI) · Facultad de Ciencias e Ingeniería (FACI) · Tecnología de la Información · Tercer semestre, curso C3",
  materia: "Apreciación del Arte y Cultura",
  anio: 2026
};
