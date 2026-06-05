/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  HUB DE EMPLEADOS — Electronics México
 *  Setup de hojas de Google Sheets
 *
 *  CÓMO USAR:
 *  1. Abre tu Google Sheet del Hub.
 *  2. Menú: Extensiones → Apps Script.
 *  3. Borra el contenido por defecto y pega TODO este archivo.
 *  4. Guarda (💾) — dale un nombre como "Setup Hub".
 *  5. Cierra la pestaña de Apps Script y refresca el Sheet.
 *  6. Verás un nuevo menú "🌐 Hub" en la barra superior.
 *  7. Haz click en: 🌐 Hub → Inicializar todas las hojas.
 *  8. Autoriza los permisos cuando te lo pida.
 *  9. ¡Listo! Las hojas se crearán con formato profesional.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ━━━ Paleta corporativa (igual al hub web) ━━━
var COLORES = {
  fondoEncabezado: '#0F172A',   // Navy oscuro
  textoEncabezado: '#FFFFFF',   // Blanco
  bordeFila: '#CBD5E1',         // Gris claro para bordes
  rayasAlternas: '#F1F5F9',     // Gris muy claro para zebra
  acentoAzul: '#3B82F6',
  acentoVerde: '#10B981',
  acentoAmbar: '#F59E0B',
  acentoRosa: '#F472B6',
  acentoLila: '#A78BFA'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ MENÚ PERSONALIZADO (se ejecuta al abrir el sheet)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌐 Hub')
    .addItem('🚀 Inicializar todas las hojas', 'inicializarHub')
    .addSeparator()
    .addItem('Formatear hoja HUB', 'formatearHUB')
    .addItem('Crear/actualizar Calendario', 'crearCalendario')
    .addItem('Crear/actualizar Anuncios', 'crearAnuncios')
    .addItem('Crear/actualizar Accesos Rápidos', 'crearAccesosRapidos')
    .addItem('Crear/actualizar Novedades', 'crearNovedades')
    .addItem('Crear/actualizar Cumpleaños', 'crearCumpleanos')
    .addToUi();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ FUNCIÓN PRINCIPAL ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function inicializarHub() {
  formatearHUB();
  crearCalendario();
  crearAnuncios();
  crearAccesosRapidos();
  crearNovedades();
  crearCumpleanos();

  SpreadsheetApp.getUi().alert(
    '✅ Hub inicializado',
    'Todas las hojas se crearon correctamente y se aplicó el formato profesional.\n\n' +
    'Recuerda compartir el sheet como "Cualquier persona con el enlace puede ver" ' +
    'para que el Hub web pueda leer los datos.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ HOJA 1: HUB (principal — ya existe) ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function formatearHUB() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('HUB');

  // Si no existe, crearla
  if (!sheet) {
    sheet = ss.insertSheet('HUB', 0);
    sheet.getRange('A1:C1').setValues([['TITULO', 'DESCRIPCION', 'URL']]);
  }

  aplicarFormatoEncabezado(sheet, 3);
  configurarColumnas(sheet, [
    { letra: 'A', ancho: 200 },  // TITULO
    { letra: 'B', ancho: 320 },  // DESCRIPCION
    { letra: 'C', ancho: 500 }   // URL
  ]);
  aplicarRayasZebra(sheet, 3);
  protegerEncabezado(sheet);
  agregarValidacionURL(sheet, 'C');

  // Mover esta hoja al principio si no lo está
  ss.setActiveSheet(sheet);
  ss.moveActiveSheet(1);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ HOJA 2: CALENDARIO ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function crearCalendario() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = 'CALENDARIO';
  var sheet = ss.getSheetByName(nombre);

  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.getRange('A1:E1').setValues([['FECHA', 'TITULO', 'HORA_INICIO', 'HORA_FIN', 'DESCRIPCION']]);
    // Datos de ejemplo
    sheet.getRange('A2:E4').setValues([
      [new Date(new Date().getFullYear(), new Date().getMonth(), 21), 'Día de capacitación', '10:00', '12:00', 'Sala de juntas — todas las áreas'],
      [new Date(new Date().getFullYear(), new Date().getMonth(), 30), 'Reunión de equipo',   '16:00', '17:00', 'Revisión mensual de objetivos'],
      [new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5), 'Aniversario empresa', '',  '',     '15 años de Electronics México 🎉']
    ]);
  }

  aplicarFormatoEncabezado(sheet, 5);
  configurarColumnas(sheet, [
    { letra: 'A', ancho: 120 },
    { letra: 'B', ancho: 220 },
    { letra: 'C', ancho: 100 },
    { letra: 'D', ancho: 100 },
    { letra: 'E', ancho: 350 }
  ]);

  // Formato de fecha en columna A
  sheet.getRange('A2:A').setNumberFormat('dd/mm/yyyy');
  // Formato de hora en C y D
  sheet.getRange('C2:D').setNumberFormat('hh:mm');

  aplicarRayasZebra(sheet, 5);
  protegerEncabezado(sheet);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ HOJA 3: ANUNCIOS ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function crearAnuncios() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = 'ANUNCIOS';
  var sheet = ss.getSheetByName(nombre);

  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.getRange('A1:E1').setValues([['TITULO', 'SUBTITULO', 'CATEGORIA', 'URL_DETALLE', 'LEIDO']]);
    sheet.getRange('A2:E4').setValues([
      ['Nuevo sistema de vacaciones', 'Conoce los cambios aquí',                'VACACIONES', '', 'NO'],
      ['Encuesta de satisfacción',     'Tu opinión nos importa',                 'ENCUESTA',   '', 'NO'],
      ['Campaña de reciclaje',         'Participa y ayuda al medio ambiente',    'EVENTO',     '', 'NO']
    ]);
  }

  aplicarFormatoEncabezado(sheet, 5);
  configurarColumnas(sheet, [
    { letra: 'A', ancho: 260 },
    { letra: 'B', ancho: 320 },
    { letra: 'C', ancho: 130 },
    { letra: 'D', ancho: 350 },
    { letra: 'E', ancho: 80  }
  ]);

  // Validación dropdown para CATEGORIA
  var categorias = ['VACACIONES', 'ENCUESTA', 'EVENTO', 'AVISO', 'CAPACITACION', 'GENERAL'];
  var ruleCat = SpreadsheetApp.newDataValidation().requireValueInList(categorias).build();
  sheet.getRange('C2:C').setDataValidation(ruleCat);

  // Validación dropdown para LEIDO
  var ruleLeido = SpreadsheetApp.newDataValidation().requireValueInList(['SI', 'NO']).build();
  sheet.getRange('E2:E').setDataValidation(ruleLeido);

  // Centrar columna LEIDO
  sheet.getRange('E2:E').setHorizontalAlignment('center');

  aplicarRayasZebra(sheet, 5);
  protegerEncabezado(sheet);
  agregarValidacionURL(sheet, 'D');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ HOJA 4: ACCESOS_RAPIDOS ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function crearAccesosRapidos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = 'ACCESOS_RAPIDOS';
  var sheet = ss.getSheetByName(nombre);

  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.getRange('A1:C1').setValues([['TITULO', 'ICONO', 'URL']]);
    sheet.getRange('A2:C5').setValues([
      ['Directorio de empleados',  'address-book',     ''],
      ['Políticas de la empresa',  'file-contract',    ''],
      ['Centro de ayuda',          'circle-question',  ''],
      ['Documentos importantes',   'folder-open',      '']
    ]);
  }

  aplicarFormatoEncabezado(sheet, 3);
  configurarColumnas(sheet, [
    { letra: 'A', ancho: 280 },
    { letra: 'B', ancho: 160 },
    { letra: 'C', ancho: 450 }
  ]);
  aplicarRayasZebra(sheet, 3);
  protegerEncabezado(sheet);
  agregarValidacionURL(sheet, 'C');

  // Comentario informativo sobre los íconos
  sheet.getRange('B1').setNote('Nombre del ícono de Font Awesome (sin el "fa-"). Ej: "calendar-days", "robot", "umbrella-beach". Ver lista: fontawesome.com/icons');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ HOJA 5: NOVEDADES ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function crearNovedades() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = 'NOVEDADES';
  var sheet = ss.getSheetByName(nombre);

  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.getRange('A1:D1').setValues([['TITULO', 'DESCRIPCION', 'IMAGEN_URL', 'URL_MAS_INFO']]);
    sheet.getRange('A2:D3').setValues([
      ['Actualizaciones de la empresa', 'Conoce las últimas actualizaciones y mejoras del Hub.', '', ''],
      ['Plataforma de capacitación',    'Nuevos cursos disponibles este mes.',                    '', '']
    ]);
  }

  aplicarFormatoEncabezado(sheet, 4);
  configurarColumnas(sheet, [
    { letra: 'A', ancho: 240 },
    { letra: 'B', ancho: 400 },
    { letra: 'C', ancho: 350 },
    { letra: 'D', ancho: 350 }
  ]);
  aplicarRayasZebra(sheet, 4);
  protegerEncabezado(sheet);
  agregarValidacionURL(sheet, 'C');
  agregarValidacionURL(sheet, 'D');

  sheet.getRange('C1').setNote('URL pública de la imagen destacada (opcional). Si está vacío, se muestra un placeholder.');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ HOJA 6: CUMPLEAÑOS ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function crearCumpleanos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = 'CUMPLEANOS';
  var sheet = ss.getSheetByName(nombre);

  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.getRange('A1:D1').setValues([['NOMBRE', 'FECHA', 'DEPARTAMENTO', 'AVATAR_URL']]);

    // Generar 3 fechas en el mes actual
    var hoy = new Date();
    var año = hoy.getFullYear();
    var mes = hoy.getMonth();

    sheet.getRange('A2:D4').setValues([
      ['María López',       new Date(año, mes, 23), 'Recursos Humanos', ''],
      ['Carlos Hernández',  new Date(año, mes, 27), 'Ventas',           ''],
      ['Laura Martínez',    new Date(año, mes, 31), 'Operaciones',      '']
    ]);
  }

  aplicarFormatoEncabezado(sheet, 4);
  configurarColumnas(sheet, [
    { letra: 'A', ancho: 200 },
    { letra: 'B', ancho: 120 },
    { letra: 'C', ancho: 180 },
    { letra: 'D', ancho: 350 }
  ]);
  sheet.getRange('B2:B').setNumberFormat('dd/mm');

  aplicarRayasZebra(sheet, 4);
  protegerEncabezado(sheet);
  agregarValidacionURL(sheet, 'D');

  sheet.getRange('D1').setNote('URL pública de la foto (opcional). Si está vacío, se generan iniciales con color automático.');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ FUNCIONES DE FORMATO REUTILIZABLES ━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function aplicarFormatoEncabezado(sheet, numCols) {
  var rango = sheet.getRange(1, 1, 1, numCols);
  rango.setBackground(COLORES.fondoEncabezado)
       .setFontColor(COLORES.textoEncabezado)
       .setFontWeight('bold')
       .setFontSize(11)
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle')
       .setBorder(true, true, true, true, false, false, COLORES.fondoEncabezado, SpreadsheetApp.BorderStyle.SOLID);

  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  // Limpiar columnas extras (más allá de las que necesitamos)
  var maxCols = sheet.getMaxColumns();
  if (maxCols > numCols) {
    sheet.deleteColumns(numCols + 1, maxCols - numCols);
  }
}

function configurarColumnas(sheet, configs) {
  configs.forEach(function(c) {
    var colNum = c.letra.charCodeAt(0) - 64;  // A=1, B=2, etc.
    sheet.setColumnWidth(colNum, c.ancho);
  });
}

function aplicarRayasZebra(sheet, numCols) {
  // Eliminar reglas previas para no duplicar
  var rangoData = sheet.getRange(2, 1, sheet.getMaxRows() - 1, numCols);
  var bandings = rangoData.getBandings();
  bandings.forEach(function(b) { b.remove(); });

  // Aplicar banding "Light"
  var banding = rangoData.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  banding.setHeaderRowColor(null);  // ya tenemos formato de encabezado custom
  banding.setFirstRowColor('#FFFFFF');
  banding.setSecondRowColor(COLORES.rayasAlternas);

  // Bordes finos
  rangoData.setBorder(false, false, false, false, true, true, '#E2E8F0', SpreadsheetApp.BorderStyle.SOLID);

  // Texto vertical centrado y padding
  rangoData.setVerticalAlignment('middle');
  rangoData.setFontSize(10);

  // Altura de filas un poco más amplia
  for (var r = 2; r <= 50 && r <= sheet.getLastRow(); r++) {
    sheet.setRowHeight(r, 28);
  }
}

function protegerEncabezado(sheet) {
  // Protege la fila 1 para que no se borre por error
  var prot = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).protect();
  prot.setDescription('Encabezados — no editar');
  prot.setWarningOnly(true);  // solo advertencia, no bloqueo completo
}

function agregarValidacionURL(sheet, columnaLetra) {
  var colNum = columnaLetra.charCodeAt(0) - 64;
  var rango = sheet.getRange(2, colNum, sheet.getMaxRows() - 1, 1);
  // Solo agregar nota informativa (no validación estricta porque a veces los formularios tienen URLs complejas)
  if (!sheet.getRange(1, colNum).getNote()) {
    sheet.getRange(1, colNum).setNote('Pega aquí la URL completa (debe empezar con https://). Déjalo vacío si aún no está disponible.');
  }
}
