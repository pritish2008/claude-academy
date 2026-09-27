/**
 * Claude Power-Up: progress receiver for Google Sheets.
 *
 * Paste this whole file into Extensions → Apps Script in your Google Sheet,
 * then deploy it as a web app (see README.md in this folder). The training
 * sends each person's progress here, and this keeps two tabs up to date:
 *   People: one row per person
 *   Levels: one row per person per level
 *
 * If the script wasn't opened from a Google Sheet, it makes its own Sheet,
 * called "Claude Power-Up progress", the first time it's used. Open the web
 * app link in a browser to see which Sheet it fills and when progress last
 * arrived.
 */

// Must match `key` under `sheet` in assets/js/brand.js.
var KEY = 'bds-pu-7k3q9x2m';
var NEW_SHEET_NAME = 'Claude Power-Up progress';

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

/** Open the web app link in a browser: it links to the Sheet and says when progress last arrived. */
function doGet() {
  var props = PropertiesService.getScriptProperties();
  var lines = [];
  try {
    var url = locked(function () {
      var ss = book();
      tab(ss, 'People', PEOPLE, 7);
      tab(ss, 'Levels', LEVELS, 8);
      return ss.getUrl();
    });
    lines.push('<a href="' + esc(url) + '" target="_blank" rel="noopener">Open your Google Sheet</a>');
  } catch (err) {
    lines.push('Problem opening the Google Sheet: ' + esc(err.message));
  }
  var saved = Number(props.getProperty('lastSaved')) || 0;
  lines.push(saved ? 'Last progress saved: ' + esc(ago(saved)) : 'No progress has arrived yet.');
  var problem = props.getProperty('lastProblem');
  if (problem) lines.push('Last problem: ' + esc(problem));
  var html =
    '<div style="font:16px/1.7 Arial,sans-serif;padding:24px;max-width:640px">' +
    '<h2 style="margin:0 0 12px">Claude Power-Up progress receiver is running.</h2>' +
    '<p style="margin:0">' + lines.join('<br>') + '</p></div>';
  return HtmlService.createHtmlOutput(html).setTitle('Claude Power-Up progress');
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

  var props = PropertiesService.getScriptProperties();
  try {
    locked(function () {
      save(book(), data);
    });
  } catch (err) {
    console.error(err);
    props.setProperty('lastProblem', when(Date.now()) + ': ' + err.message);
    return reply('problem: ' + err.message);
  }
  props.setProperty('lastSaved', String(Date.now()));
  props.deleteProperty('lastProblem');
  return reply('ok');
}

/** The Sheet to fill: the one this script was opened from, or one it made itself. */
function book() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('sheetId');
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      // Deleted or out of reach: make a new one.
    }
  }
  ss = SpreadsheetApp.create(NEW_SHEET_NAME);
  props.setProperty('sheetId', ss.getId());
  return ss;
}

/** Run fn while no other report is being saved, so two can't clash. */
function locked(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
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

function when(ms) {
  return Utilities.formatDate(new Date(ms), Session.getScriptTimeZone(), 'd MMM yyyy, h:mm a');
}

function ago(ms) {
  var min = Math.floor((Date.now() - ms) / 60000);
  if (min < 1) return 'just now (' + when(ms) + ')';
  if (min < 60) return min + (min === 1 ? ' minute' : ' minutes') + ' ago (' + when(ms) + ')';
  return when(ms);
}

function esc(v) {
  return String(v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
