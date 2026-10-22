/**
 * Bolso: ponte entre o app e uma planilha sua do Google.
 *
 * Como instalar (resumo, o passo a passo completo está no README):
 *  1. Abra uma planilha nova no Google Planilhas.
 *  2. Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 *  3. Configurações do projeto (engrenagem) > Propriedades do script > Adicionar:
 *       nome: TOKEN   valor: uma senha longa só sua (ex.: 20+ letras e números)
 *  4. Implantar > Nova implantação > Tipo: Aplicativo da Web
 *       Executar como: Eu     Quem pode acessar: Qualquer pessoa
 *  5. Copie o link que termina em /exec e cole no app, junto com o TOKEN.
 */

var SHEET_NAME = 'Lançamentos';
var HEADER = ['data', 'carteira', 'tipo', 'categoria', 'valor', 'parcela', 'id', 'grupo', 'atualizado'];
var ID_COL = 6; // coluna "id" (0 = primeira coluna)

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function authorized_(token) {
  var expected = PropertiesService.getScriptProperties().getProperty('TOKEN');
  return !!expected && String(token || '') === expected;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Leitura: devolve todas as linhas (com cabeçalho) como texto.
function doGet(e) {
  if (!authorized_(e.parameter.token)) return json_({ error: 'Senha incorreta ou TOKEN não configurado no Apps Script.' });
  var sh = getSheet_();
  return json_({ values: sh.getDataRange().getDisplayValues() });
}

// Escrita: aplica os lançamentos alterados (upsert) e remove os apagados (delete).
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: 'Dados inválidos.' }); }
  if (!authorized_(body.token)) return json_({ error: 'Senha incorreta ou TOKEN não configurado no Apps Script.' });

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sh = getSheet_();
    var values = sh.getDataRange().getDisplayValues();
    var del = {};
    (body.delete || []).forEach(function (id) { del[String(id)] = true; });

    var byId = {}, order = [];
    values.slice(1).forEach(function (r) {
      var id = String(r[ID_COL] || '').trim();
      if (!id || del[id]) return;
      if (!(id in byId)) order.push(id);
      byId[id] = r;
    });

    var now = new Date().toISOString();
    (body.upsert || []).forEach(function (r) {
      var id = String(r[ID_COL] || '').trim();
      if (!id) return;
      if (!(id in byId)) order.push(id);
      var row = r.slice(0, HEADER.length - 1);
      row.push(now);
      byId[id] = row;
    });

    var all = order.map(function (id) { return byId[id]; });
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, HEADER.length).clearContent();
    if (all.length) sh.getRange(2, 1, all.length, HEADER.length).setNumberFormat('@').setValues(all);
    return json_({ ok: true, count: all.length });
  } finally {
    lock.releaseLock();
  }
}
