/* ============================================================
   nakayoshi  共通ツールバー

   使い方
     各ページの </body> の直前に、次の1行を入れてください。
       <script src="tools.js" defer></script>

   入っているもの
     ・🖨 印刷
     ・📤 共有
     ・🔗 リンクをコピー
     ・🌓 明るい表示／暗い表示
     ・🔤 文字の大きさ（小・中・大）

   設定はこの端末に保存され、どのページでも引き継がれます。
   ============================================================ */
(function () {
  'use strict';

  var TKEY = 'nk-theme';   /* light / dark */
  var SKEY = 'nk-size';    /* s / m / l */

  var SIZES = { s: 0.9, m: 1, l: 1.18 };

  /* ---------- 保存と読み出し ---------- */
  function getTheme() {
    try { return localStorage.getItem(TKEY) || 'light'; } catch (e) { return 'light'; }
  }
  function getSize() {
    try { return localStorage.getItem(SKEY) || 'm'; } catch (e) { return 'm'; }
  }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- 見た目 ---------- */
  var CSS = [
    /* 暗い表示。写真や図は色を変えず、まわりだけ暗くする */
    'html.nk-dark{background:#1a1f26}',
    'html.nk-dark body{background:#1a1f26;color:#e4e9ef}',
    'html.nk-dark .fn-card,html.nk-dark .nkm-in,html.nk-dark .nkm-panel,',
    'html.nk-dark .qa,html.nk-dark .sec,html.nk-dark .toc{',
    'background:#242b34 !important;border-color:#39434f !important;color:#e4e9ef}',
    'html.nk-dark .box,html.nk-dark .mc-i,html.nk-dark .nkm-i,html.nk-dark .ga-box,',
    'html.nk-dark .rt a,html.nk-dark .nkm-step{',
    'background:#2b333d !important;border-color:#3d4855 !important;color:#e4e9ef}',
    'html.nk-dark .sheet-in,html.nk-dark .top-in{background:#242b34}',
    'html.nk-dark .ehead{background:#11151a}',
    'html.nk-dark .foot,html.nk-dark .spot-note,html.nk-dark .rt-ad,',
    'html.nk-dark .mt,html.nk-dark .neru,html.nk-dark .date{color:#9aa7b5 !important}',
    'html.nk-dark .spot-note{background:#242b34;border-color:#39434f}',
    'html.nk-dark .tbl th,html.nk-dark .nkm-in th{background:#2b333d;color:#9fd0e8}',
    'html.nk-dark .tbl td,html.nk-dark .nkm-in td{border-color:#3d4855}',
    'html.nk-dark .mc-i.on{background:#2a3a2c !important;border-color:#4a6b4e !important}',
    /* 写真とチラシは元の色のまま見せる */
    'html.nk-dark img{filter:none}',

    /* 文字の大きさ */
    'html.nk-s{font-size:90%}',
    'html.nk-m{font-size:100%}',
    'html.nk-l{font-size:118%}',
    '.nk-zoom{zoom:var(--nk-scale,1)}',
    '@supports not (zoom:1){.nk-zoom{transform:scale(var(--nk-scale,1));',
    'transform-origin:top center;width:calc(100% / var(--nk-scale,1));margin-inline:auto}}',

    /* ツールバー */
    '.nkt{position:fixed;left:0;right:0;bottom:0;z-index:880;',
    'background:rgba(255,255,255,.96);border-top:1px solid #dde5ee;',
    'backdrop-filter:blur(8px);',
    'padding:7px 10px calc(7px + env(safe-area-inset-bottom,0px));',
    'display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap}',
    'html.nk-dark .nkt{background:rgba(26,31,38,.96);border-top-color:#39434f}',
    '.nkt-b{display:inline-flex;align-items:center;gap:5px;',
    'padding:9px 13px;border:1px solid #dde5ee;border-radius:99px;',
    'background:#fff;color:#4a5a6e;font-family:inherit;font-size:12.5px;',
    'cursor:pointer;white-space:nowrap;line-height:1}',
    '.nkt-b:hover{border-color:#f07d1a;color:#d1541f}',
    '.nkt-b:active{transform:translateY(1px)}',
    '.nkt-b:focus-visible{outline:3px solid #f07d1a;outline-offset:2px}',
    '.nkt-b .ic{font-size:15px}',
    'html.nk-dark .nkt-b{background:#2b333d;border-color:#3d4855;color:#c7d2de}',
    'html.nk-dark .nkt-b:hover{border-color:#f0a35a;color:#f0a35a}',
    '.nkt-sz{display:inline-flex;border:1px solid #dde5ee;border-radius:99px;overflow:hidden}',
    'html.nk-dark .nkt-sz{border-color:#3d4855}',
    '.nkt-sz button{border:none;background:#fff;color:#4a5a6e;font-family:inherit;',
    'cursor:pointer;padding:9px 11px;line-height:1}',
    'html.nk-dark .nkt-sz button{background:#2b333d;color:#c7d2de}',
    '.nkt-sz button.on{background:#f07d1a;color:#fff}',
    '.nkt-sz button:focus-visible{outline:2px solid #f07d1a;outline-offset:-2px}',
    '.nkt-sz .z1{font-size:11px}.nkt-sz .z2{font-size:13.5px}.nkt-sz .z3{font-size:16px}',

    /* 下に隠れないよう余白を足す */
    'body{padding-bottom:70px}',
    '@media(max-width:430px){',
    '.nkt{gap:5px;padding:6px 8px calc(6px + env(safe-area-inset-bottom,0px))}',
    '.nkt-b{padding:8px 10px;font-size:11.5px}',
    '.nkt-b .tx{display:none}',       /* 狭い画面では絵文字だけ */
    '.nkt-b .ic{font-size:17px}',
    'body{padding-bottom:64px}}',

    /* お知らせ */
    '.nkt-toast{position:fixed;left:50%;bottom:78px;transform:translateX(-50%) translateY(14px);',
    'background:#2d3a4a;color:#fff;padding:11px 20px;border-radius:99px;font-size:13px;',
    'z-index:1200;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}',
    '.nkt-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}',

    /* 印刷のとき */
    '@media print{',
    '.nkt,.nkt-toast,.nkm-btn,.nkm-ov,.nkm-modal,.ehead,#nk-gate,',
    '.ga-btn,.mc-reset,.btns,.spot-note,.hot,.spot{display:none !important}',
    'html,body{background:#fff !important;color:#000 !important}',
    'html.nk-dark body,html.nk-dark .fn-card,html.nk-dark .box{',
    'background:#fff !important;color:#000 !important;border-color:#ccc !important}',
    '.fn-card,.sheet,.sheet-in{break-inside:avoid;page-break-inside:avoid;',
    'box-shadow:none !important;opacity:1 !important;transform:none !important}',
    'img{max-width:100% !important}',
    'a[href^="http"]::after{content:" (" attr(href) ")";font-size:9px;color:#666}',
    '}'
  ].join('');

  /* ---------- 適用 ---------- */
  function applyTheme(v) {
    document.documentElement.classList.toggle('nk-dark', v === 'dark');
    var b = document.getElementById('nktTheme');
    if (b) {
      b.querySelector('.ic').textContent = (v === 'dark') ? '☀️' : '🌙';
      var tx = b.querySelector('.tx');
      if (tx) tx.textContent = (v === 'dark') ? '明るく' : '暗く';
      b.setAttribute('aria-label', (v === 'dark') ? '明るい表示にする' : '暗い表示にする');
    }
    /* 地図があれば色を合わせる（ほかのページで使っていても壊れないように） */
    if (typeof window.dwaOnThemeChange === 'function') {
      try { window.dwaOnThemeChange(v !== 'dark'); } catch (e) {}
    }
  }

  function applySize(v) {
    var html = document.documentElement;
    html.classList.remove('nk-s', 'nk-m', 'nk-l');
    html.classList.add('nk-' + v);
    html.style.setProperty('--nk-scale', SIZES[v] || 1);
    var bs = document.querySelectorAll('.nkt-sz button');
    for (var i = 0; i < bs.length; i++) {
      bs[i].classList.toggle('on', bs[i].getAttribute('data-s') === v);
    }
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
  }

  /* ---------- 動き ---------- */
  function toast(msg) {
    var t = document.getElementById('nktToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function pageTitle() {
    var h = document.querySelector('h1');
    if (h && h.textContent.trim()) return h.textContent.trim();
    return (document.title || 'nakayoshi').split('｜')[0];
  }

  window.nktPrint = function () {
    /* メニューなどが開いていたら閉じてから印刷する */
    if (typeof window.nkmClose === 'function') { try { window.nkmClose(); } catch (e) {} }
    setTimeout(function () { window.print(); }, 120);
  };

  window.nktShare = function () {
    var url = location.href.split('#')[0];
    var text = pageTitle() + '｜みんなで遊びましょー nakayoshi\n';
    if (navigator.share) {
      navigator.share({ title: pageTitle(), text: text, url: url }).catch(function () {});
      return;
    }
    copy(text + url, '共有メッセージをコピーしました');
  };

  window.nktCopy = function () {
    copy(location.href.split('#')[0], 'リンクをコピーしました');
  };

  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(function () { toast(done); })
        .catch(function () { fallback(text, done); });
    } else {
      fallback(text, done);
    }
  }
  function fallback(text, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      toast(done);
    } catch (e) {
      prompt('以下をコピーしてください', text);
    }
  }

  window.nktTheme = function () {
    var next = (getTheme() === 'dark') ? 'light' : 'dark';
    save(TKEY, next);
    applyTheme(next);
  };

  window.nktSize = function (v) {
    save(SKEY, v);
    applySize(v);
  };

  /* ---------- 組み立て ---------- */
  var built = false;
  function build() {
    if (built || document.getElementById('nktBar')) return;
    built = true;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var bar = document.createElement('div');
    bar.className = 'nkt';
    bar.id = 'nktBar';
    bar.innerHTML =
      '<button type="button" class="nkt-b" onclick="nktPrint()" aria-label="印刷する">' +
        '<span class="ic">🖨</span><span class="tx">印刷</span></button>' +
      '<button type="button" class="nkt-b" onclick="nktShare()" aria-label="共有する">' +
        '<span class="ic">📤</span><span class="tx">共有</span></button>' +
      '<button type="button" class="nkt-b" onclick="nktCopy()" aria-label="リンクをコピーする">' +
        '<span class="ic">🔗</span><span class="tx">リンク</span></button>' +
      '<button type="button" class="nkt-b" id="nktTheme" onclick="nktTheme()" aria-label="表示を切り替える">' +
        '<span class="ic">🌙</span><span class="tx">暗く</span></button>' +
      '<span class="nkt-sz" role="group" aria-label="文字の大きさ">' +
        '<button type="button" class="z1" data-s="s" onclick="nktSize(\'s\')" aria-label="文字を小さく">小</button>' +
        '<button type="button" class="z2" data-s="m" onclick="nktSize(\'m\')" aria-label="文字を標準に">中</button>' +
        '<button type="button" class="z3" data-s="l" onclick="nktSize(\'l\')" aria-label="文字を大きく">大</button>' +
      '</span>';
    document.body.appendChild(bar);

    var tz = document.createElement('div');
    tz.className = 'nkt-toast';
    tz.id = 'nktToast';
    document.body.appendChild(tz);

    applyTheme(getTheme());
    applySize(getSize());
  }

  /* 画面ができる前でも、表示設定だけは先に当てておく（ちらつき防止） */
  (function pre() {
    var html = document.documentElement;
    if (getTheme() === 'dark') html.classList.add('nk-dark');
    var sz = getSize();
    html.classList.add('nk-' + sz);
    html.style.setProperty('--nk-scale', SIZES[sz] || 1);
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
    window.addEventListener('load', build);
  } else {
    build();
  }
})();
