/**
 * Claude Power-Up: progress receiver for Google Sheets.
 *
 * Paste this whole file into Extensions → Apps Script in your Google Sheet,
 * then deploy it as a web app (see README.md in this folder). The training
 * sends each person's progress here, and this keeps two tabs up to date:
 *   People: one row per person
 *   Levels: one row per person per level
 */

// Must match `key` under `sheet` in assets/js/brand.js.
var KEY = 'bds-pu-7k3q9x2m';

var PEOPLE = [
  'Name',
  'Email',
  'Progress %',
  'Levels done',
  'Now on',
  'Active time (min)',
  'Pace',
  'Rushed steps',
  'Quiz score %',
  'Best prompt score',
  'XP',
  'Rank',
  'Certificate',
  'Started',
  'Last active',
  'Person ID'
];

var LEVELS = [
  'Name',
  'Level',
  'Title',
  'Status',
  'Steps done',
  'Active time (min)',
  'Time needed to read (min)',
  'Pace',
  'Rushed steps',
  'Quiz score %',
  'XP',
  'Finished',
  'Person ID',
  'Level ID'
];

/** Open the web app link in a browser to check it's working. */
function doGet() {
  return ContentService.createTextOutput('Claude Power-Up progress receiver is running.');
}

function doPost(e) {
  var raw = e && e.postData && e.postData.contents;
  if (!raw || raw.length > 200000) return reply('ignored');
  var data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    return reply('bad data');
  }
  if (!data || data.key !== KEY || !data.person || !data.person.id) return reply('ignored');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    save(SpreadsheetApp.getActiveSpreadsheet(), data);
  } finally {
    lock.releaseLock();
  }
  return reply('ok');
}

function save(ss, data) {
  var p = data.person;
  var people = tab(ss, 'People', PEOPLE, 7);
  upsert(people, [text(p.id)], [
    text(p.name) || '(no name)',
    text(p.email),
    num(p.progress),
    text(p.levelsDone),
    text(p.nowOn),
    num(p.activeMin),
    text(p.pace),
    text(p.rushed),
    num(p.quizScore),
    num(p.bestPrompt),
    num(p.xp),
    text(p.rank),
    date(p.certificate),
    date(p.started),
    date(p.lastActive),
    text(p.id)
  ]);

  var levels = tab(ss, 'Levels', LEVELS, 8);
  (data.levels || []).forEach(function (l) {
    upsert(levels, [text(p.id), text(l.id)], [
      text(p.name) || '(no name)',
      text(l.level),
      text(l.title),
      text(l.status),
      num(l.stepsDone) + ' of ' + num(l.steps),
      num(l.activeMin),
      num(l.expectedMin),
      text(l.pace),
      num(l.rushed),
      num(l.quizScore),
      num(l.xp) + ' of ' + num(l.xpMax),
      date(l.finished),
      text(p.id),
      text(l.id)
    ]);
  });
}

/** Find the row whose ID columns (the last ones) match, and replace it; otherwise add it. */
function upsert(sheet, ids, row) {
  var width = row.length;
  var first = width - ids.length + 1;
  var last = sheet.getLastRow();
  if (last >= 2) {
    var keys = sheet.getRange(2, first, last - 1, ids.length).getValues();
    for (var i = 0; i < keys.length; i++) {
      var match = true;
      for (var j = 0; j < ids.length; j++) {
        if (String(keys[i][j]) !== ids[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        sheet.getRange(i + 2, 1, 1, width).setValues([row]);
        return;
      }
    }
  }
  sheet.appendRow(row);
}

/** Get a tab, creating it with headers and colours the first time. */
function tab(ss, name, headers, paceColumn) {
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;
  sheet = ss.insertSheet(name);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#eef0ff');
  sheet.setFrozenRows(1);
  var pace = sheet.getRange(2, paceColumn, 1000, 1);
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Rushing').setBackground('#fde2e4').setFontColor('#9b1c2c').setRanges([pace]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Thorough').setBackground('#dcf5e8').setFontColor('#0b6b47').setRanges([pace]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Good pace').setBackground('#eef0ff').setRanges([pace]).build()
  ]);
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  return sheet;
}

function text(v) {
  return v === undefined || v === null ? '' : String(v).slice(0, 300);
}

function num(v) {
  return typeof v === 'number' && isFinite(v) ? v : v === '' || v === undefined || v === null ? '' : Number(v) || 0;
}

function date(v) {
  if (!v) return '';
  var d = new Date(v);
  return isNaN(d.getTime()) ? '' : d;
}

function reply(msg) {
  return ContentService.createTextOutput(msg);
}
