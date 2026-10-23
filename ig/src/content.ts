import {Slide} from './Post';

export const carousels: Record<string, Slide[]> = {
	'1-comprender': [
		{kind: 'cover', title: 'Comprender tu historia', italic: 'no siempre la transforma.', photo: 'hero-caballo.jpg', sub: 'Desliza para descubrir por qué →'},
		{kind: 'statement', eyebrow: 'Muchas personas conocen su historia', title: 'Pueden explicarla de memoria.', body: ['Pueden explicar su infancia.', 'Pueden describir sus heridas.', 'Pueden identificar sus patrones.']},
		{kind: 'statement', tone: 'dark', title: 'Y, sin embargo, continúan atrapadas en las mismas dinámicas.', size: 84},
		{kind: 'statement', eyebrow: 'Una premisa diferente', title: 'La transformación ocurre cuando la experiencia alcanza aquello que la explicación no consigue tocar.', size: 70},
		{kind: 'photo', photo: 'jimena.jpg', photoPos: '30% 40%', eyebrow: 'Por eso trabajamos con', title: 'el cuerpo y con los caballos.', body: 'Ellos reflejan lo que permanece fuera de la conciencia verbal.'},
		{kind: 'statement', tone: 'terra', title: 'No es interpretar. Es observar.', body: ['La persona ve.', 'La persona siente.', 'La persona experimenta.'], size: 88},
		{kind: 'cta'},
	],
	'2-principios': [
		{kind: 'cover', eyebrow: 'Reconciliaciones Sistémicas con Caballos', title: 'Los 6 principios', italic: 'del método.', sub: 'Guárdalo para volver a leerlo.', photo: 'maika.jpg', photoPos: '50% 62%'},
		{kind: 'principle', n: 1, title: 'La realidad precede a la transformación', body: ['Aceptar no es resignarse.', 'La transformación comienza cuando cesa la lucha contra aquello que ya ocurrió.']},
		{kind: 'principle', n: 2, tone: 'sand', title: 'La vida se recibe', body: ['Reconocer la vida recibida no implica justificar el dolor.', 'Implica reconocer el origen desde el que existimos.']},
		{kind: 'principle', n: 3, title: 'Lo que rechazo fuera aparece dentro', body: ['La reconciliación con los padres es también una reconciliación con uno mismo.']},
		{kind: 'principle', n: 4, tone: 'sand', title: 'El cuerpo expresa lo que la mente desconoce', body: ['La experiencia corporal revela aquello que muchas veces la narrativa oculta.']},
		{kind: 'principle', n: 5, title: 'La transformación ocurre en la experiencia', body: ['Comprender no siempre transforma.', 'La experiencia vivida sí puede hacerlo.']},
		{kind: 'principle', n: 6, tone: 'dark', title: 'El caballo como facilitador fenomenológico', body: ['El caballo no interpreta, no aconseja y no juzga.', 'Simplemente refleja.']},
		{kind: 'cta'},
	],
	'3-pilares': [
		{kind: 'cover', eyebrow: 'Los tres pilares del método', title: 'Sistema, cuerpo', italic: 'y caballo.', photo: 'ojo-caballo.jpg', photoPos: '20% 50%', sub: 'Cuando se encuentran, emerge la reconciliación.'},
		{kind: 'list', eyebrow: 'Pilar 01 · El sistema', title: 'Todo ser humano forma parte de múltiples sistemas.', items: ['Familia', 'Cultura', 'Historia', 'Relaciones'], chips: true},
		{kind: 'list', eyebrow: 'Pilar 02 · El cuerpo', tone: 'sand', title: 'El cuerpo conserva lo que la narrativa no alcanza a expresar.', items: ['La postura', 'La respiración', 'La tensión muscular', 'La distancia interpersonal']},
		{kind: 'statement', eyebrow: 'Pilar 03 · El caballo', tone: 'dark', title: 'No analiza. No interpreta. No juzga.', body: ['Responde a la coherencia entre intención, emoción y presencia.'], size: 84},
		{kind: 'image', eyebrow: 'La integración en la pista', title: 'Donde las tres dimensiones se encuentran', image: 'slide-integracion.jpg', body: 'Cuando sistema, cuerpo y caballo se encuentran, emerge el espacio para la reconciliación.'},
		{kind: 'cta'},
	],
	'4-reconciliar': [
		{kind: 'cover', eyebrow: 'Reconciliar', title: 'Reconciliarse con la historia', italic: 'no es lo que crees.', sub: 'Desliza →', photo: 'jimena.jpg', photoPos: '40% 55%'},
		{kind: 'statement', title: 'No significa aprobar.', size: 104},
		{kind: 'statement', tone: 'sand', title: 'No significa olvidar.', size: 104},
		{kind: 'statement', tone: 'terra', eyebrow: 'Reconciliar significa', title: 'incluir.', size: 160},
		{kind: 'statement', eyebrow: 'Por eso', title: 'Cuando dejamos de rechazar partes de nuestra historia, recuperamos energía para construir nuestro futuro.', size: 66},
		{kind: 'cta'},
	],
	'5-formacion': [
		{kind: 'cover', eyebrow: 'Formación intensiva · Residencial', title: 'Reconciliaciones Sistémicas', italic: 'con Caballos', photo: 'hero-caballo.jpg', sub: '16 al 21 de febrero de 2027 · Vedia, Argentina'},
		{kind: 'list', eyebrow: 'La experiencia', title: 'Seis días de inmersión.', items: ['Un entorno natural cuidadosamente seleccionado', 'Prácticas en pista con caballos', 'Momentos de reflexión e integración', 'Convivencia grupal', 'Tiempo para atravesar tu propio proceso']},
		{kind: 'list', eyebrow: 'Programa', tone: 'sand', title: '¿Qué aprenderás?', items: ['Fundamentos de las reconciliaciones sistémicas', 'Patrones corporales y la historia relacional', 'El caballo como facilitador fenomenológico', 'Coherencia cardíaca y recalibración energética', 'Diseño de experiencias vivenciales']},
		{kind: 'list', eyebrow: '¿Para quién es?', title: 'Profesionales y personas en búsqueda.', items: ['Psicólogos', 'Terapeutas', 'Coaches', 'Educadores', 'Facilitadores', 'Profesionales ecuestres', 'Desarrollo humano', 'Desarrollo personal'], chips: true},
		{kind: 'list', eyebrow: 'Incluye', tone: 'dark', title: 'Todo lo que necesitas.', items: ['Formación presencial intensiva', 'Trabajo práctico con caballos', 'Materiales de estudio', 'Alojamiento y pensión completa', 'Certificado de participación']},
		{kind: 'price'},
		{kind: 'cta'},
	],
	'6-equipo': [
		{kind: 'cover', eyebrow: 'Equipo docente', title: 'Quién guía', italic: 'la formación.', photo: 'jimena.jpg', photoPos: '40% 50%', sub: 'Conócelas →'},
		{kind: 'person', photo: 'jimena.jpg', photoPos: '50% 42%', role: 'Directora · Creadora del método', name: 'Jimena Marchisio', org: 'Fundadora de MindCompass', body: 'Docente universitaria, profesional ecuestre y diseñadora de experiencias de aprendizaje asistidas por caballos.'},
		{kind: 'person', photo: 'maika.jpg', photoPos: '50% 38%', role: 'Docente invitada', name: 'Maika Castillo', org: 'Fundadora de Sentir Caballos', body: 'Acompañamiento humano, sanación con caballos, coherencia cardíaca y reequilibrio energético.'},
		{kind: 'cta'},
	],
};

export const posts: Record<string, Slide> = {
	'1-frase': {kind: 'statement', tone: 'dark', eyebrow: 'Reconciliaciones Sistémicas', title: '“Dejar de luchar con aquello de lo que estamos hechos.”', body: ['La transformación comienza cuando dejamos de pelear con nuestra historia.'], size: 86},
	'2-anuncio': {kind: 'cover', eyebrow: 'Inscripciones abiertas', title: 'Formación intensiva residencial', italic: 'con caballos', photo: 'hero-caballo.jpg', sub: '16 al 21 de febrero de 2027 · Vedia, Argentina · Plazas limitadas'},
	'3-precio': {kind: 'price'},
	'4-caballo': {kind: 'photo', photo: 'jimena.jpg', photoPos: '20% 50%', eyebrow: 'El caballo como espejo', title: 'El caballo muestra lo que la palabra no puede nombrar.', size: 74},
};
