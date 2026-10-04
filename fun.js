/* ============================================================
   nakayoshi  おたのしみ機能

   使い方
     告知ページ（nakayoshi.html）の </body> の直前に入れてください。
       <script src="fun.js" defer></script>

   入っているもの
     ① 開催日までのカウントダウン
     ② 当日の天気と、決行の見通し
     ③ 持ち物チェックリスト
     ④ 集合場所への道案内
     ⑤ 今日の遊びガチャ
   ============================================================ */
(function () {
  'use strict';

  /* ---- 設定（変更するのはここだけ） ---- */
  var EVENT = {
    date: '2026-10-18',            /* 開催日 */
    startHour: 9,                  /* 集合時刻 */
    endHour: 17,                   /* 解散時刻 */
    lat: 35.1569,                  /* 丹波自然運動公園のおおよその位置 */
    lon: 135.4194,
    addr: '京都府船井郡京丹波町曽根崩下代110-7',
    name: '京都府立丹波自然運動公園'
  };

  /* ---- 遊びのたね ---- */
  var ASOBI = [
    { e: '🏃', t: '鬼ごっこ', d: '定番。広い芝生なら「氷鬼」にすると長く遊べます' },
    { e: '👮', t: 'どろけい', d: '人数が多いほど盛り上がります。牢屋の場所を決めてから' },
    { e: '🧍', t: 'だるまさんがころんだ', d: '小さい子も一緒にできます' },
    { e: '🙈', t: 'かくれんぼ', d: '範囲を先に決めること。遊具のまわりだけでも十分' },
    { e: '🤸', t: 'アスレチック制覇', d: 'わくわくアスレチックパークへ。全部まわれるかな' },
    { e: '🛝', t: 'ジャイアントスライダー何回いける？', d: '数をかぞえて競争。大人も本気で' },
    { e: '🍃', t: '葉っぱ集め', d: '10月は紅葉の季節。いちばんきれいな1枚を探そう' },
    { e: '🌰', t: 'どんぐり拾い', d: '帽子つきを見つけたら当たり。持ち帰る数を決めて' },
    { e: '🪨', t: '宝さがし', d: '大人が小石や葉っぱを隠して、子どもが探します' },
    { e: '🤝', t: '手つなぎ鬼', d: 'つかまった人が手をつないで増えていきます' },
    { e: '🦵', t: 'ケンケン相撲', d: '片足立ちで押し合い。土の広場がおすすめ' },
    { e: '🎏', t: 'しっぽ取り', d: 'タオルやひもをズボンにはさんで。奪われたら負け' },
    { e: '🧺', t: 'お弁当さきに食べちゃう', d: 'おなかがすいたら迷わず。遊ぶのは食べてから' },
    { e: '🌀', t: '大縄とび', d: '何回とべるか。大人が回し手を交代で' },
    { e: '🐛', t: '虫さがし', d: 'つかまえたら逃がしてあげよう。写真だけでもOK' },
    { e: '🏞', t: '園内たんけん', d: '地図を見ながら。南門から北門まで歩いてみる' },
    { e: '🎨', t: '色さがし', d: '「赤いもの」を3つ。身のまわりをよく見る遊び' },
    { e: '💤', t: 'ちょっと休憩', d: 'レジャーシートで寝ころぶ。これも大事な時間' },
    { e: '🤹', t: 'まねっこリレー', d: '前の人の動きをまねしてつなぐ。笑えます' },
    { e: '📸', t: '変な顔で記念写真', d: 'いちばん変な顔の人が優勝' }
  ];

  /* ---- 持ち物 ---- */
  var MOCHI = [
    ['🥤', '飲み物', 'いつもより多めに'],
    ['🍱', '昼食', 'レストハウスもありますが持参が安心'],
    ['🍪', 'お菓子', 'みんなで分けられるものだと嬉しい'],
    ['🧺', 'レジャーシート', '休憩と荷物置きに'],
    ['🩹', '絆創膏（数枚）', 'すり傷はよくあります'],
    ['💊', '保険証・お薬手帳', '万が一医療にかかるとき'],
    ['☂️', '雨具', 'カッパだと両手が空きます'],
    ['👕', '着替え', '汗と泥。子どもの分は必ず'],
    ['🧴', '日焼け止め・虫よけ', '10月でも日差しはあります'],
    ['🪑', '椅子・タープ', '古谷さんが用意（各自でも）']
  ];

  /* ---------- 見た目 ---------- */
  var CSS = [
    '.fn{max-width:820px;margin:0 auto 20px;padding:0 14px}',
    '.fn-card{background:#fff;border:1px solid #e3ead4;border-radius:16px;',
    'padding:18px 18px 16px;box-shadow:0 6px 20px rgba(40,60,20,.08);',
    'opacity:0;transform:translateY(32px);',
    'transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}',
    '.fn-card.up{opacity:1;transform:none}',
    '.fn-t{display:flex;align-items:center;gap:8px;font-size:15.5px;font-weight:700;',
    'color:#4a5c36;margin-bottom:12px}',
    '.fn-t .ic{font-size:19px}',

    /* カウントダウン */
    '.cd{text-align:center;padding:4px 0 2px}',
    '.cd .big{font-family:inherit;font-size:54px;font-weight:900;line-height:1;color:#f07d1a;',
    'letter-spacing:-.02em}',
    '.cd .big small{font-size:22px;font-weight:700;margin-left:4px}',
    '.cd .sub{font-size:14px;color:#6a7a58;margin-top:9px;line-height:1.75}',
    '.cd .neru{font-size:13px;color:#8a9a78;margin-top:4px}',
    '.cd.today .big{color:#e03a3a;font-size:40px}',
    '.cd .date{font-size:12.5px;color:#9aa888;margin-top:10px;',
    'padding-top:10px;border-top:1px dashed #e3ead4}',

    /* 天気 */
    '.wx{display:flex;align-items:center;gap:14px}',
    '.wx .em{font-size:46px;line-height:1;flex-shrink:0}',
    '.wx .bd{flex:1;min-width:0}',
    '.wx .st{font-size:17px;font-weight:700;color:#4a5c36;line-height:1.4}',
    '.wx .mt{font-size:13px;color:#6a7a58;margin-top:4px;line-height:1.7}',
    '.wx-judge{margin-top:12px;padding:11px 13px;border-radius:11px;font-size:13.5px;',
    'line-height:1.75;font-weight:700}',
    '.wx-judge.go{background:#eef7e4;border:1px solid #cbe3ad;color:#3f6b1f}',
    '.wx-judge.may{background:#fff6e5;border:1px solid #f3d9a0;color:#9a6a00}',
    '.wx-judge.in{background:#eaf1f8;border:1px solid #c3d6ea;color:#1f5a8b}',
    '.wx-judge small{display:block;font-weight:400;font-size:12px;margin-top:4px;opacity:.85}',
    '.wx-load{font-size:13px;color:#9aa888;text-align:center;padding:12px 0}',

    /* 持ち物 */
    '.mc{display:grid;gap:7px}',
    '.mc-i{display:flex;align-items:center;gap:11px;padding:11px 13px;',
    'background:#fafcf6;border:1px solid #e8efdc;border-radius:11px;cursor:pointer;',
    'transition:background .15s,border-color .15s}',
    '.mc-i:hover{border-color:#b8d48a}',
    '.mc-i input{width:21px;height:21px;flex-shrink:0;accent-color:#6aa832;cursor:pointer;margin:0}',
    '.mc-i .em{font-size:19px;flex-shrink:0}',
    '.mc-i .tx{flex:1;min-width:0}',
    '.mc-i .tx b{display:block;font-size:14px;font-weight:700;color:#3d4a2e}',
    '.mc-i .tx small{display:block;font-size:11.5px;color:#8a9a78;margin-top:2px;line-height:1.6}',
    '.mc-i.on{background:#eef7e4;border-color:#cbe3ad}',
    '.mc-i.on .tx b{text-decoration:line-through;color:#8a9a78}',
    '.mc-bar{margin-top:12px;display:flex;align-items:center;gap:10px}',
    '.mc-bar .tr{flex:1;height:8px;background:#e8efdc;border-radius:99px;overflow:hidden}',
    '.mc-bar .tr i{display:block;height:100%;width:0;border-radius:99px;',
    'background:linear-gradient(90deg,#9ccc5a,#6aa832);transition:width .4s ease}',
    '.mc-bar .n{font-size:12.5px;font-weight:700;color:#4a5c36;white-space:nowrap}',
    '.mc-reset{display:block;margin:10px auto 0;background:none;border:none;',
    'color:#9aa888;font-size:12px;font-family:inherit;cursor:pointer;text-decoration:underline}',
    '.mc-reset:hover{color:#6a7a58}',

    /* 道案内 */
    '.rt{display:grid;gap:8px}',
    '.rt a{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:13px;',
    'background:#eef4fa;border:1px solid #c9ddee;text-decoration:none;color:#1f4a6b;',
    'transition:border-color .15s,transform .15s}',
    '.rt a:hover{border-color:#5a9ec9;transform:translateX(3px)}',
    '.rt a .ic{font-size:21px;flex-shrink:0}',
    '.rt a .tx{flex:1;min-width:0;font-size:14px;font-weight:700}',
    '.rt a .tx small{display:block;font-size:11.5px;font-weight:400;color:#6a8ca8;margin-top:2px}',
    '.rt-ad{margin-top:11px;font-size:12px;color:#8a9a78;line-height:1.75;text-align:center}',

    /* 遊びガチャ */
    '.ga{text-align:center}',
    '.ga-box{min-height:112px;display:flex;flex-direction:column;align-items:center;',
    'justify-content:center;padding:14px 10px;background:#fffbf2;',
    'border:2px dashed #f3d9a0;border-radius:14px;margin-bottom:12px}',
    '.ga-em{font-size:44px;line-height:1;margin-bottom:8px}',
    '.ga-t{font-size:19px;font-weight:700;color:#d1541f;line-height:1.4}',
    '.ga-d{font-size:12.5px;color:#8a7a58;margin-top:6px;line-height:1.7}',
    '.ga-hint{font-size:13.5px;color:#a89878}',
    '.ga-btn{width:100%;padding:16px;border:none;border-radius:99px;background:#f07d1a;',
    'color:#fff;font-family:inherit;font-size:16px;font-weight:700;cursor:pointer;',
    'box-shadow:0 5px 16px rgba(240,125,26,.3)}',
    '.ga-btn:hover{filter:brightness(1.07)}',
    '.ga-btn:active{transform:translateY(1px)}',
    '.ga-btn:disabled{opacity:.7;cursor:wait}',
    '@keyframes gaPop{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}',
    '.ga-box.pop .ga-em,.ga-box.pop .ga-t,.ga-box.pop .ga-d{animation:gaPop .45s cubic-bezier(.16,1,.3,1)}',

    '@media(prefers-reduced-motion:reduce){',
    '.fn-card{opacity:1;transform:none;transition:none}',
    '.ga-box.pop .ga-em,.ga-box.pop .ga-t,.ga-box.pop .ga-d{animation:none}}'
  ].join('');

  /* ---------- 共通 ---------- */
  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function card(id, icon, title, inner) {
    return el('<div class="fn-card" id="' + id + '">' +
      '<div class="fn-t"><span class="ic">' + icon + '</span><span>' + title + '</span></div>' +
      inner + '</div>');
  }

  /* 開催日を、時間帯に左右されない「暦の日付」として読む。
     端末が日本時間でなくても、日付がずれないようにするため */
  function eventDate() {
    var p = EVENT.date.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  /* 日本時間の「いま」。端末が海外の時間帯でも、活動の時間で判断するため */
  function nowJst() {
    var d = new Date();
    return new Date(d.getTime() + (d.getTimezoneOffset() + 540) * 60000);
  }

  /* 開催日までの日数。0=当日、マイナス=終了後 */
  function daysLeft() {
    var now = nowJst();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((eventDate() - today) / 86400000);
  }

  /* ---------- ① カウントダウン ---------- */
  function buildCd() {
    var n = daysLeft();
    var t = eventDate();
    var w = ['日', '月', '火', '水', '木', '金', '土'][t.getDay()];
    var ds = (t.getMonth() + 1) + '月' + t.getDate() + '日（' + w + '）';
    var body, cls = '';

    if (n > 0) {
      body = '<div class="big">あと' + n + '<small>日</small></div>' +
             '<div class="neru">あと' + n + '回ねたら、みんなで遊べるよ</div>';
      if (n <= 3) {
        body += '<div class="sub">そろそろ持ち物の準備を。下のチェックリストをどうぞ</div>';
      } else if (n <= 14) {
        body += '<div class="sub">天気がだんだん分かってきます。こまめにのぞいてみてください</div>';
      }
    } else if (n === 0) {
      cls = ' today';
      var h = nowJst().getHours();
      if (h < EVENT.startHour) {
        body = '<div class="big">今日だよ！</div>' +
               '<div class="sub">集合は9時〜10時。気をつけてお越しください</div>';
      } else if (h < EVENT.endHour) {
        body = '<div class="big">遊んでる最中！</div>' +
               '<div class="sub">解散は16時〜17時。けがのないように</div>';
      } else {
        body = '<div class="big">おつかれさま！</div>' +
               '<div class="sub">今日はありがとうございました。またあそぼうね</div>';
      }
    } else {
      body = '<div class="big">ありがとう</div>' +
             '<div class="sub">この活動は終わりました。次のご案内をお待ちください</div>';
    }
    body += '<div class="date">' + ds + '　' + EVENT.name + '</div>';
    return card('fnCd', '🗓️', '開催日まで', '<div class="cd' + cls + '">' + body + '</div>');
  }

  /* ---------- ② 天気 ---------- */
  var WX = {
    0: ['☀️', '快晴'], 1: ['🌤', 'おおむね晴れ'], 2: ['⛅', '晴れ時々くもり'], 3: ['☁️', 'くもり'],
    45: ['🌫', 'きり'], 48: ['🌫', 'きり'],
    51: ['🌦', '霧雨'], 53: ['🌦', '霧雨'], 55: ['🌧', '強い霧雨'],
    61: ['🌦', '小雨'], 63: ['🌧', '雨'], 65: ['🌧', '強い雨'],
    71: ['🌨', '雪'], 73: ['🌨', '雪'], 75: ['❄️', '大雪'],
    80: ['🌦', 'にわか雨'], 81: ['🌧', 'にわか雨'], 82: ['⛈', '激しいにわか雨'],
    95: ['⛈', '雷雨'], 96: ['⛈', '雷雨'], 99: ['⛈', '激しい雷雨']
  };

  function buildWx() {
    var c = card('fnWx', '☀️', '当日の天気', '<div class="wx-load" id="wxBody">天気を調べています…</div>');
    setTimeout(function () { loadWx(); }, 80);
    return c;
  }

  function loadWx() {
    var box = document.getElementById('wxBody');
    if (!box) return;
    var n = daysLeft();
    if (n < 0) { box.innerHTML = '<div class="wx-load">この活動は終わりました</div>'; return; }
    if (n > 15) {
      box.innerHTML = '<div class="wx-load">天気予報は開催の2週間ほど前から出ます。<br>' +
                      'もう少しお待ちください</div>';
      return;
    }
    var url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + EVENT.lat + '&longitude=' + EVENT.lon +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max' +
      '&timezone=Asia%2FTokyo&start_date=' + EVENT.date + '&end_date=' + EVENT.date;

    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('取得できません');
      return r.json();
    }).then(function (j) {
      var d = j.daily;
      if (!d || !d.weathercode || !d.weathercode.length) throw new Error('データなし');
      var code = d.weathercode[0];
      var hi = Math.round(d.temperature_2m_max[0]);
      var lo = Math.round(d.temperature_2m_min[0]);
      var mm = d.precipitation_sum[0];
      var pp = d.precipitation_probability_max[0];
      var w = WX[code] || ['🌈', '—'];

      /* 決行の見通し。チラシの基準（小雨→決行、雨量が多い→室内）に合わせる */
      var jc, jt, js;
      if (mm == null) { jc = 'may'; jt = '判断は当日の朝に'; js = '雨量の予報が取れませんでした'; }
      else if (mm < 1) {
        jc = 'go'; jt = '◎ 決行の見込みです';
        js = '雨はほとんど降らない予報です（' + mm + 'mm）';
      } else if (mm < 5) {
        jc = 'go'; jt = '○ 決行の見込みです';
        js = '小雨の予報です（' + mm + 'mm）。雨具をお持ちください';
      } else if (mm < 15) {
        jc = 'may'; jt = '△ 当日の朝に判断します';
        js = 'やや雨量が多い予報です（' + mm + 'mm）。室内遊びに変わる可能性があります';
      } else {
        jc = 'in'; jt = '☂ 室内遊びになりそうです';
        js = '雨量が多い予報です（' + mm + 'mm）。KIRInokoへの変更を検討します';
      }

      box.innerHTML =
        '<div class="wx">' +
          '<span class="em">' + w[0] + '</span>' +
          '<span class="bd"><span class="st">' + w[1] + '</span>' +
          '<span class="mt">最高 ' + hi + '℃ / 最低 ' + lo + '℃' +
          (pp != null ? '　降水確率 ' + pp + '%' : '') + '</span></span>' +
        '</div>' +
        '<div class="wx-judge ' + jc + '">' + jt + '<small>' + js + '</small></div>' +
        '<div class="rt-ad">※ 自動で取得した予報です。最終的な判断は当日の朝にご連絡します</div>';
    }).catch(function () {
      box.innerHTML = '<div class="wx-load">天気を取得できませんでした。<br>' +
        '通信の状態をご確認ください</div>';
    });
  }

  /* ---------- ③ 持ち物チェック ---------- */
  var MKEY = 'nk-mochi';

  function buildMc() {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(MKEY) || '{}'); } catch (e) {}
    var h = '<div class="mc">';
    for (var i = 0; i < MOCHI.length; i++) {
      var m = MOCHI[i], on = !!saved[i];
      h += '<label class="mc-i' + (on ? ' on' : '') + '" data-i="' + i + '">' +
        '<input type="checkbox"' + (on ? ' checked' : '') + '>' +
        '<span class="em">' + m[0] + '</span>' +
        '<span class="tx"><b>' + m[1] + '</b><small>' + m[2] + '</small></span></label>';
    }
    h += '</div>' +
      '<div class="mc-bar"><span class="tr"><i id="mcBar"></i></span>' +
      '<span class="n" id="mcN">0 / ' + MOCHI.length + '</span></div>' +
      '<button type="button" class="mc-reset" onclick="nkMochiReset()">チェックをぜんぶ外す</button>';
    var c = card('fnMc', '✅', '持ち物チェック', h);
    setTimeout(function () { bindMc(); }, 0);
    return c;
  }

  function bindMc() {
    var items = document.querySelectorAll('.mc-i');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('change', function () {
        var on = this.querySelector('input').checked;
        this.classList.toggle('on', on);
        saveMc();
      });
    }
    updMc();
  }
  function saveMc() {
    var o = {}, items = document.querySelectorAll('.mc-i');
    for (var i = 0; i < items.length; i++) {
      if (items[i].querySelector('input').checked) o[items[i].getAttribute('data-i')] = 1;
    }
    try { localStorage.setItem(MKEY, JSON.stringify(o)); } catch (e) {}
    updMc();
  }
  function updMc() {
    var items = document.querySelectorAll('.mc-i');
    var n = 0;
    for (var i = 0; i < items.length; i++) if (items[i].querySelector('input').checked) n++;
    var bar = document.getElementById('mcBar');
    var lbl = document.getElementById('mcN');
    if (bar) bar.style.width = (items.length ? n / items.length * 100 : 0) + '%';
    if (lbl) lbl.textContent = (n === items.length && items.length)
      ? 'ぜんぶ そろった！' : (n + ' / ' + items.length);
  }
  window.nkMochiReset = function () {
    var items = document.querySelectorAll('.mc-i');
    for (var i = 0; i < items.length; i++) {
      items[i].querySelector('input').checked = false;
      items[i].classList.remove('on');
    }
    saveMc();
  };

  /* ---------- ④ 道案内 ---------- */
  function buildRt() {
    var q = encodeURIComponent(EVENT.addr);
    var h = '<div class="rt">' +
      '<a href="https://www.google.com/maps/dir/?api=1&destination=' + q +
        '&travelmode=driving" target="_blank" rel="noopener">' +
        '<span class="ic">🚗</span><span class="tx">車でのルート' +
        '<small>いまいる場所から案内します</small></span></a>' +
      '<a href="https://www.google.com/maps/dir/?api=1&destination=' + q +
        '&travelmode=transit" target="_blank" rel="noopener">' +
        '<span class="ic">🚃</span><span class="tx">電車・バスでのルート' +
        '<small>JR園部駅から桧山行きバスで約20分</small></span></a>' +
      '<a href="https://www.google.com/maps/search/?api=1&query=' + q +
        '" target="_blank" rel="noopener">' +
        '<span class="ic">📍</span><span class="tx">地図で場所を見る' +
        '<small>まわりの様子を確かめる</small></span></a>' +
      '</div>' +
      '<div class="rt-ad">' + EVENT.name + '<br>' + EVENT.addr + '<br>' +
      '駐車場は無料です（正門・南門・北門のいずれからも入れます）</div>';
    return card('fnRt', '🚗', '集合場所への道案内', h);
  }

  /* ---------- ⑤ 遊びガチャ ---------- */
  function buildGa() {
    var h = '<div class="ga">' +
      '<div class="ga-box" id="gaBox"><span class="ga-hint">ボタンを押すと、遊びがひとつ出てきます</span></div>' +
      '<button type="button" class="ga-btn" id="gaBtn" onclick="nkGacha()">🎲 遊びをひく</button>' +
      '</div>';
    return card('fnGa', '🎲', '今日の遊びガチャ', h);
  }

  var gaLast = -1;
  window.nkGacha = function () {
    var box = document.getElementById('gaBox');
    var btn = document.getElementById('gaBtn');
    if (!box || !btn) return;
    btn.disabled = true;

    /* 同じものが続けて出ないようにする */
    var i;
    do { i = Math.floor(Math.random() * ASOBI.length); }
    while (ASOBI.length > 1 && i === gaLast);
    gaLast = i;

    /* 少しだけ回してから止める */
    var n = 0;
    var spin = setInterval(function () {
      var k = Math.floor(Math.random() * ASOBI.length);
      box.innerHTML = '<span class="ga-em">' + ASOBI[k].e + '</span>';
      if (++n >= 7) {
        clearInterval(spin);
        var a = ASOBI[i];
        box.classList.remove('pop');
        void box.offsetWidth;
        box.classList.add('pop');
        box.innerHTML = '<span class="ga-em">' + a.e + '</span>' +
                        '<span class="ga-t">' + a.t + '</span>' +
                        '<span class="ga-d">' + a.d + '</span>';
        btn.disabled = false;
        btn.textContent = '🎲 もう一回ひく';
      }
    }, 70);
  };

  /* ---------- 組み立て ---------- */
  var built = false;
  function build() {
    if (built || document.getElementById('fnWrap')) return;
    built = true;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var wrap = document.createElement('div');
    wrap.className = 'fn';
    wrap.id = 'fnWrap';
    wrap.appendChild(buildCd());
    wrap.appendChild(buildWx());
    wrap.appendChild(buildMc());
    wrap.appendChild(buildRt());
    wrap.appendChild(buildGa());

    /* 1枚目の告知の下に置く */
    var sh1 = document.getElementById('sh1');
    var btns = document.querySelector('.btns');
    var anchor = btns || sh1;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
    } else {
      document.body.appendChild(wrap);
    }

    /* 画面に入ったら順に立ち上げる */
    var cards = wrap.querySelectorAll('.fn-card');
    function show(e) { e.classList.add('up'); }
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < cards.length; i++) show(cards[i]);
      return;
    }
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) {
        if (!es[i].isIntersecting) continue;
        show(es[i].target);
        io.unobserve(es[i].target);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    for (var j = 0; j < cards.length; j++) io.observe(cards[j]);
    setTimeout(function () {
      for (var k = 0; k < cards.length; k++) {
        var r = cards[k].getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) { show(cards[k]); io.unobserve(cards[k]); }
      }
    }, 60);
    setTimeout(function () {
      for (var m = 0; m < cards.length; m++) show(cards[m]);
    }, 6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
    window.addEventListener('load', build);
  } else {
    build();
  }
})();
