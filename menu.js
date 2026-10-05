/* ============================================================
   nakayoshi  共通メニュー

   使い方
     各ページの </body> の直前に、次の1行を入れてください。
       <script src="menu.js" defer></script>

   入っているもの
     ・右上のメニューボタンと引き出し
     ・アーカイブ
     ・お問い合わせ
     ・プライバシーポリシー
     ・アプリとしてインストール

   どのページでも同じものが出るので、
   各ページ側に同じ内容を書く必要はありません。
   ============================================================ */
(function () {
  'use strict';

  var TEL  = '090-8126-3532';
  var TELR = '09081263532';
  var MAIL = 'm.k.s.m0822@gmail.com';
  var NAME = '古谷 浩二';
  var LKEY = 'nk-line';   /* LINEの宛先を、この端末に覚えておく */

  function lineUrl() {
    try { return localStorage.getItem(LKEY) || ''; } catch (e) { return ''; }
  }
  function saveLine(v) {
    try {
      if (v) localStorage.setItem(LKEY, v);
      else localStorage.removeItem(LKEY);
    } catch (e) {}
  }

  /* 入力されたものを、開けるURLに整える。
     「@abc123」のようなIDでも、URLでも受け取れるようにする */
  function normalizeLine(v) {
    v = (v || '').trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    if (v.charAt(0) === '@') return 'https://line.me/R/ti/p/' + encodeURIComponent(v);
    if (/^[\w.-]+$/.test(v)) return 'https://line.me/R/ti/p/' + encodeURIComponent('@' + v);
    return '';
  }

  /* インストールの案内をOSに合わせて出し分ける */
  function osKind() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'pc';
  }

  /* すでにアプリとして開いているか */
  function installed() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  }

  /* Chrome などが出す「インストールできます」を受け取っておく */
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    var b = document.getElementById('nkm-install-now');
    if (b) b.style.display = '';
  });
  window.addEventListener('appinstalled', function () {
    deferred = null;
    toast('ホーム画面に追加しました');
  });

  /* ---------- 見た目 ---------- */
  var CSS = [
    /* メニューボタン */
    '.nkm-btn{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:12px;',
    'z-index:900;width:48px;height:48px;border:none;border-radius:50%;',
    'background:#fff;color:#e03a3a;cursor:pointer;',
    'box-shadow:0 4px 16px rgba(60,90,130,.26);',
    'display:flex;align-items:center;justify-content:center;gap:4px;',
    'flex-direction:column;padding:0}',
    '.nkm-btn:hover{background:#fff6f6}',
    '.nkm-btn:active{transform:scale(.94)}',
    '.nkm-btn:focus-visible{outline:3px solid #e03a3a;outline-offset:3px}',
    '.nkm-btn i{display:block;width:20px;height:2.5px;background:#e03a3a;border-radius:2px;',
    'transition:transform .25s,opacity .2s}',
    '.nkm-btn.on i:nth-child(1){transform:translateY(6.5px) rotate(45deg)}',
    '.nkm-btn.on i:nth-child(2){opacity:0}',
    '.nkm-btn.on i:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}',

    /* 引き出し */
    '.nkm-ov{position:fixed;inset:0;z-index:950;display:none;',
    'background:rgba(40,60,85,.5);backdrop-filter:blur(2px)}',
    '.nkm-ov.open{display:block}',
    '.nkm-panel{position:absolute;top:0;right:0;height:100%;width:min(88vw,320px);',
    'background:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;',
    'padding:calc(20px + env(safe-area-inset-top,0px)) 16px calc(32px + env(safe-area-inset-bottom,0px));',
    'box-shadow:-8px 0 30px rgba(30,50,75,.28);',
    'transform:translateX(100%);transition:transform .32s cubic-bezier(.16,1,.3,1)}',
    '.nkm-ov.open .nkm-panel{transform:translateX(0)}',
    '.nkm-head{display:flex;align-items:center;gap:10px;padding:4px 2px 16px;',
    'border-bottom:1px solid #eef2f7;margin-bottom:14px}',
    '.nkm-head .ch{font-size:30px;line-height:1}',
    '.nkm-head .tt{flex:1;min-width:0}',
    '.nkm-head .tt b{display:block;font-size:19px;color:#f07d1a;font-weight:700;line-height:1.2}',
    '.nkm-head .tt small{display:block;font-size:10.5px;color:#9aa8b8;margin-top:3px}',
    '.nkm-x{background:none;border:none;font-size:21px;color:#9aa8b8;cursor:pointer;',
    'line-height:1;padding:5px}',
    '.nkm-x:hover{color:#2d3a4a}',
    '.nkm-sec{font-size:10px;letter-spacing:.14em;color:#a8b5c4;margin:16px 2px 7px;font-weight:700}',
    '.nkm-i{display:flex;align-items:center;gap:12px;width:100%;',
    'padding:14px 14px;margin-bottom:6px;border:1px solid #e4ecf4;border-radius:13px;',
    'background:#fafcfe;color:#2d3a4a;font-family:inherit;font-size:14.5px;font-weight:700;',
    'text-align:left;text-decoration:none;cursor:pointer;',
    'transition:border-color .15s,transform .15s}',
    '.nkm-i:hover{border-color:#f07d1a;transform:translateX(3px)}',
    '.nkm-i:focus-visible{outline:3px solid #f07d1a;outline-offset:2px}',
    '.nkm-i .ic{font-size:20px;flex-shrink:0}',
    '.nkm-i .tx{flex:1;min-width:0}',
    '.nkm-i .tx small{display:block;font-size:11px;color:#9aa8b8;font-weight:400;margin-top:2px;line-height:1.6}',
    '.nkm-i.hi{background:#fdf2f2;border-color:#f3c6c6;color:#c0392b}',
    '.nkm-i.hi:hover{border-color:#e03a3a}',
    '.nkm-foot{text-align:center;font-size:10.5px;color:#a8b5c4;',
    'padding:18px 6px 0;line-height:1.9;border-top:1px solid #eef2f7;margin-top:16px}',

    /* ダイアログ */
    '.nkm-modal{position:fixed;inset:0;z-index:1000;display:none;',
    'background:rgba(40,60,85,.55);padding:18px;overflow-y:auto;-webkit-overflow-scrolling:touch}',
    '.nkm-modal.open{display:block}',
    '.nkm-in{max-width:580px;margin:34px auto;background:#fff;border-radius:18px;',
    'padding:24px 22px calc(24px + env(safe-area-inset-bottom,0px));position:relative;',
    'box-shadow:0 18px 50px rgba(30,50,75,.35)}',
    '.nkm-in .cl{position:absolute;top:13px;right:15px;background:none;border:none;',
    'font-size:22px;color:#8c9bb0;cursor:pointer;line-height:1;padding:4px}',
    '.nkm-in .cl:hover{color:#2d3a4a}',
    '.nkm-in h2{font-size:19px;font-weight:700;margin-bottom:6px;color:#2d3a4a;',
    'display:flex;align-items:center;gap:8px}',
    '.nkm-in .lead{font-size:12.5px;color:#7b8a9e;line-height:1.8;margin-bottom:18px}',
    '.nkm-in h3{font-size:14.5px;font-weight:700;color:#c0392b;margin:20px 0 7px}',
    '.nkm-in p{font-size:14px;line-height:1.95;margin-bottom:10px}',
    '.nkm-in ul{margin:0 0 10px 20px}',
    '.nkm-in li{font-size:13.5px;line-height:1.9;margin-bottom:5px}',
    '.nkm-in .note{font-size:12.5px;color:#7b8a9e;line-height:1.85}',
    '.nkm-in table{width:100%;border-collapse:collapse;margin:10px 0 14px;font-size:13px}',
    '.nkm-in th,.nkm-in td{border:1px solid #dbe5f0;padding:9px 11px;text-align:left;line-height:1.75}',
    '.nkm-in th{background:#f2f7fc;width:36%;font-weight:700;color:#4a5a6e}',

    /* 連絡先 */
    '.nkm-ct{display:grid;gap:10px;margin:4px 0 6px}',
    '.nkm-ct a{display:flex;align-items:center;gap:13px;padding:16px 18px;border-radius:14px;',
    'background:#fdf2f2;border:2px solid #f3c6c6;text-decoration:none;color:#2d3a4a;',
    'transition:border-color .15s,transform .15s}',
    '.nkm-ct a:hover{border-color:#e03a3a;transform:translateX(3px)}',
    '.nkm-ct a:focus-visible{outline:3px solid #e03a3a;outline-offset:2px}',
    '.nkm-ct .ic{font-size:24px;flex-shrink:0}',
    '.nkm-ct .tx{flex:1;min-width:0}',
    '.nkm-ct .tx b{display:block;font-size:17px;font-weight:700;word-break:break-all}',
    '.nkm-ct .tx small{display:block;font-size:11.5px;color:#8c7070;margin-top:3px}',
    /* LINEの追加方法 */
    '.ln-howto{margin:12px 0 0;font-size:13px;text-align:center}',
    '.ln-howto a{color:#06935f;font-weight:700;text-decoration:underline;',
    'text-underline-offset:3px;cursor:pointer}',
    '.ln-howto a:hover{color:#047a4e}',
    '.ln-howto .hint{display:block;font-size:11px;color:#9aa8b8;margin-top:3px}',
    '.ln-guide{max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.4,0,.2,1)}',
    '.ln-guide.open{max-height:3400px;margin-top:14px}',
    '.ln-tabs{display:flex;gap:6px;margin-bottom:12px}',
    '.ln-tab{flex:1;padding:11px 6px;border:1.5px solid #dbe6f1;border-radius:11px;',
    'background:#fff;color:#4a5a6e;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}',
    '.ln-tab:hover{border-color:#06c755}',
    '.ln-tab.on{background:#06935f;border-color:#06935f;color:#fff}',
    '.ln-tab:focus-visible{outline:3px solid #06c755;outline-offset:2px}',
    '.ln-pane{display:none}.ln-pane.on{display:block}',
    '.ln-lead{font-size:13px;color:#6a7a8a;line-height:1.85;margin-bottom:14px}',
    '.ln-step{display:flex;gap:11px;margin-bottom:14px}',
    '.ln-sn{width:26px;height:26px;flex-shrink:0;border-radius:50%;background:#06935f;',
    'color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;',
    'justify-content:center;margin-top:1px}',
    '.ln-sb{flex:1;min-width:0}',
    '.ln-st{font-size:13.5px;line-height:1.85;color:#2d3a4a}',
    '.ln-fig{margin-top:9px}',
    /* 画面の絵（文字だけで描くので、画像の読み込みが要りません） */
    '.ph{border:2px solid #cfd9e4;border-radius:13px;overflow:hidden;background:#fff;',
    'max-width:260px;box-shadow:0 3px 10px rgba(60,90,130,.1)}',
    '.ph-top{background:#eef3f8;padding:8px 11px;font-size:11.5px;font-weight:700;',
    'color:#5a6a7e;border-bottom:1px solid #dfe7ef;text-align:center}',
    '.ph-body{padding:6px}',
    '.ph-row{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;',
    'font-size:12.5px;color:#4a5a6e;line-height:1.5}',
    '.ph-row.hi{background:#e8f8ef;color:#046b44;font-weight:700;',
    'box-shadow:inset 0 0 0 1.5px #06c755}',
    '.ph-ic{font-size:15px;flex-shrink:0;width:22px;text-align:center}',
    '.ph-cap{font-size:11px;color:#9aa8b8;margin-top:5px}',
    '.ln-note{font-size:12.5px;line-height:1.9;color:#5a6a7e;background:#f5faf7;',
    'border:1px solid #cfe8da;border-radius:11px;padding:12px 14px;margin-top:4px}',
    '.ln-note code{background:#fff;border:1px solid #d8e6de;border-radius:5px;',
    'padding:1px 6px;font-size:11.5px;word-break:break-all}',
    '.ln-note b{color:#c0392b}',
    '.nkm-ct .ln-set{position:relative;background:#eefaf0;border-color:#b9e3c4}',
    '.nkm-ct .ln-set:hover{border-color:#06c755}',
    '.nkm-ct .ln-edit{flex-shrink:0;background:#fff;border:1px solid #b9e3c4;',
    'border-radius:99px;padding:6px 12px;font-size:11.5px;font-family:inherit;',
    'color:#2a7a44;cursor:pointer}',
    '.nkm-ct .ln-edit:hover{border-color:#06c755;color:#06c755}',
    '.nkm-ct .ln-none{display:flex;align-items:center;gap:13px;width:100%;',
    'padding:16px 18px;border-radius:14px;background:#f5f8f6;border:2px dashed #cfdcd4;',
    'color:#6a7a70;font-family:inherit;text-align:left;cursor:pointer}',
    '.nkm-ct .ln-none:hover{border-color:#06c755;color:#2a7a44}',
    '.nkm-ct .ln-none .tx b{display:block;font-size:15px;font-weight:700}',
    '.nkm-ct .ln-none .tx small{display:block;font-size:11.5px;margin-top:3px}',
    '.nkm-name{text-align:center;font-size:13.5px;color:#5a6a7e;padding:12px 0 2px;line-height:1.8}',
    '.nkm-name b{font-size:16px;color:#2d3a4a}',

    /* アーカイブの空表示 */
    '.nkm-empty{text-align:center;padding:34px 16px 20px}',
    '.nkm-empty .em{font-size:46px;display:block;margin-bottom:12px}',
    '.nkm-empty p{font-size:15px;line-height:2;color:#5a6a7e}',
    '.nkm-empty .sm{font-size:12.5px;color:#8c9bb0;margin-top:10px}',

    /* インストール */
    '.nkm-step{display:flex;gap:12px;padding:13px 14px;margin-bottom:8px;',
    'background:#f7fafd;border:1px solid #dbe6f1;border-radius:12px}',
    '.nkm-step .n{width:24px;height:24px;flex-shrink:0;border-radius:50%;background:#e03a3a;',
    'color:#fff;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center}',
    '.nkm-step .s{flex:1;min-width:0;font-size:13.5px;line-height:1.8}',
    '.nkm-go{display:block;width:100%;margin:6px 0 14px;padding:16px;border:none;',
    'border-radius:99px;background:#e03a3a;color:#fff;font-family:inherit;font-size:16px;',
    'font-weight:700;cursor:pointer;box-shadow:0 5px 16px rgba(224,58,58,.3)}',
    '.nkm-go:hover{filter:brightness(1.08)}',

    /* お知らせ */
    '.nkm-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(16px);',
    'background:#2d3a4a;color:#fff;padding:12px 22px;border-radius:99px;font-size:13.5px;',
    'z-index:1200;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}',
    '.nkm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}',

    '@media(prefers-reduced-motion:reduce){',
    '.nkm-panel,.nkm-i,.nkm-ct a,.nkm-btn i{transition:none}}'
  ].join('');

  /* ---------- 中身 ---------- */
  function installHtml() {
    var k = osKind();
    var h = '';
    if (installed()) {
      h += '<p>すでにアプリとして開いています。ありがとうございます。</p>';
      return h;
    }
    h += '<p>ホーム画面に追加しておくと、アプリのように1タップで開けます。' +
         'インストールと言っても、容量はほとんど使いません。</p>' +
         '<button class="nkm-go" id="nkm-install-now" style="display:none" ' +
         'onclick="nkmInstallNow()">このままホーム画面に追加する</button>';
    if (k === 'ios') {
      h += '<h3>iPhone・iPad（Safari）</h3>' +
           step(1, '画面の下にある<b>共有ボタン</b>（□に↑のしるし）を押します') +
           step(2, 'メニューを下にたどって<b>「ホーム画面に追加」</b>を選びます') +
           step(3, '右上の<b>「追加」</b>を押すと完了です') +
           '<p class="note">※ Safari以外のブラウザでは追加できないことがあります。' +
           'うまくいかない場合はSafariで開いてお試しください。</p>';
    } else if (k === 'android') {
      h += '<h3>Android（Chrome）</h3>' +
           step(1, '右上の<b>メニュー（⋮）</b>を押します') +
           step(2, '<b>「ホーム画面に追加」</b>または<b>「アプリをインストール」</b>を選びます') +
           step(3, '<b>「追加」</b>を押すと完了です');
    } else {
      h += '<h3>パソコン（Chrome・Edge）</h3>' +
           step(1, 'アドレスバーの右端にある<b>インストールのしるし</b>を押します') +
           step(2, '<b>「インストール」</b>を押すと完了です') +
           '<p class="note">※ しるしが出ない場合は、メニューから「アプリ」→' +
           '「このサイトをアプリとしてインストール」を選んでください。</p>';
    }
    h += '<p class="note">追加したアイコンを消したいときは、' +
         'ほかのアプリと同じように長押しして削除できます。</p>';
    return h;
  }

  function step(n, s) {
    return '<div class="nkm-step"><span class="n">' + n + '</span><span class="s">' + s + '</span></div>';
  }

  /* お問い合わせ */
  function contactHtml() {
    return [
      '<h2><span>✉️</span>お問い合わせ</h2>',
      '<p class="lead">タップするとそのまま発信・メール作成ができます。</p>',
      '<div class="nkm-ct">',
        '<a href="tel:' + TELR + '"><span class="ic">📞</span>',
        '<span class="tx"><b>' + TEL + '</b><small>タップで電話をかけられます</small></span></a>',
        '<a href="mailto:' + MAIL + '?subject=%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%EF%BC%88nakayoshi%EF%BC%89">',
        '<span class="ic">✉️</span>',
        '<span class="tx"><b>' + MAIL + '</b><small>タップでメールを作成できます</small></span></a>',
        lineRow(),
      '</div>',
      '<p class="ln-howto"><a href="#" onclick="return nkmLineHow()">追加方法はこちら</a>' +
      '<span class="hint">　LINEのURLの調べ方を図でご案内します</span></p>',
      '<div class="ln-guide" id="lnGuide">' + lineGuideHtml() + '</div>',
      '<p class="nkm-name">みんなで遊びましょー nakayoshi<br><b>' + NAME + '</b></p>',

      '<h3>こんなときにご連絡ください</h3>',
      '<ul>',
        '<li>LINEがつながらないとき</li>',
        '<li>当日の持ち物や集合場所について知りたいとき</li>',
        '<li>お子さまのアレルギーや持病など、事前にお伝えいただきたいことがあるとき</li>',
        '<li>開催の有無を確かめたいとき（天候が心配なとき）</li>',
        '<li>写真の掲載について、ご相談があるとき</li>',
      '</ul>',
      '<p class="note">お電話が出られないことがあります。',
      'その場合はメールをいただければ、折り返しご連絡します。</p>',

      '<div style="margin-top:18px;padding-top:16px;border-top:1px solid #eef2f7">',
      '<button class="nkm-i" onclick="nkmOpen(\'nkm-priv\')" style="margin:0">',
      '<span class="ic">🔒</span><span class="tx">プライバシーポリシー',
      '<small>個人情報の取り扱いについて</small></span></button>',
      '</div>'
    ].join('');
  }

  /* LINEの行。未設定なら設定を促す */
  function lineRow() {
    var u = lineUrl();
    if (u) {
      return '<a href="' + u + '" target="_blank" rel="noopener" class="ln-set">' +
        '<span class="ic">💬</span>' +
        '<span class="tx"><b>LINE</b><small>タップでLINEが開きます</small></span>' +
        '<button type="button" class="ln-edit" onclick="event.preventDefault();' +
        'event.stopPropagation();nkmLineEdit()">変更</button></a>';
    }
    return '<button type="button" class="ln-none" onclick="nkmLineEdit()">' +
      '<span class="ic">💬</span>' +
      '<span class="tx"><b>LINE（未設定）</b>' +
      '<small>タップしてLINEの宛先を登録できます</small></span></button>';
  }

  /* LINEのURLの調べ方。図は文字だけで描いているので、画像の読み込みは不要 */
  function phone(title, rows, cap) {
    var h = '<div class="ph"><div class="ph-top">' + title + '</div><div class="ph-body">';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      h += '<div class="ph-row' + (r[2] ? ' hi' : '') + '">' +
           '<span class="ph-ic">' + r[0] + '</span><span>' + r[1] + '</span></div>';
    }
    h += '</div></div>';
    if (cap) h += '<div class="ph-cap">' + cap + '</div>';
    return h;
  }

  function lineGuideHtml() {
    var h = '';

    h += '<div class="ln-tabs">' +
      '<button type="button" class="ln-tab on" onclick="nkmLineTab(\'me\',this)">👤 個人のLINE</button>' +
      '<button type="button" class="ln-tab" onclick="nkmLineTab(\'gr\',this)">👥 グループLINE</button>' +
      '</div>';

    /* --- 個人 --- */
    h += '<div class="ln-pane on" id="lnPaneMe">' +
      '<p class="ln-lead">自分のLINEに直接つないでもらうURLです。' +
      'iPhone・Androidとも手順は同じです。</p>' +

      stepRow(1, 'LINEを開いて、<b>ホーム</b>の右上にある<b>人型のアイコン</b>をタップ',
        phone('ホーム', [['🔍', '検索'], ['👤＋', '友だち追加　← ここ', 1], ['⚙️', '設定']])) +

      stepRow(2, '<b>QRコード</b>をタップ',
        phone('友だち追加', [['📷', 'QRコード　← ここ', 1], ['🔗', '招待'], ['🔢', '検索']])) +

      stepRow(3, '<b>マイQRコード</b>をタップ',
        phone('QRコード', [['⬜', 'カメラが開きます'], ['🪪', 'マイQRコード　← ここ', 1]])) +

      stepRow(4, '<b>シェア</b>（共有）をタップして、<b>リンクをコピー</b>を選ぶ',
        phone('マイQRコード', [['▦', '自分のQRコード'], ['📤', 'シェア　← ここ', 1],
                              ['🔗', 'リンクをコピー', 1]])) +

      stepRow(5, '上の<b>「LINE（未設定）」</b>をタップして、コピーしたURLを貼り付け', '') +

      '<div class="ln-note">コピーされるのは <code>https://line.me/ti/p/〜</code> ' +
      'のような文字列です。これをそのまま貼り付けてください。<br>' +
      '公式アカウントをお持ちなら、<code>@</code> から始まるIDだけでも大丈夫です。</div>' +
      '</div>';

    /* --- グループ --- */
    h += '<div class="ln-pane" id="lnPaneGr">' +
      '<p class="ln-lead">グループに直接参加してもらうURLです。' +
      '参加希望の方をまとめて迎えたいときに向いています。</p>' +

      stepRow(1, '<b>グループのトーク画面</b>を開いて、右上の<b>≡</b>（メニュー）をタップ',
        phone('みんなで遊びましょー', [['💬', 'トークの画面'], ['≡', 'メニュー　← ここ', 1]])) +

      stepRow(2, '<b>招待</b>をタップ',
        phone('グループ', [['👥', 'メンバー'], ['➕', '招待　← ここ', 1], ['🖼', 'アルバム']])) +

      stepRow(3, '<b>招待リンク</b>（またはリンクで招待）を選ぶ',
        phone('招待方法', [['🔗', '招待リンク　← ここ', 1], ['📷', 'QRコード'], ['🆔', 'LINE ID']])) +

      stepRow(4, '表示されたURLを<b>コピー</b>',
        phone('招待リンク', [['🔗', 'https://line.me/ti/g/〜'], ['📋', 'コピー　← ここ', 1]])) +

      stepRow(5, '上の<b>「LINE（未設定）」</b>をタップして、コピーしたURLを貼り付け', '') +

      '<div class="ln-note">コピーされるのは <code>https://line.me/ti/g/〜</code> ' +
      'のような文字列です。<br>' +
      '<b>ご注意：</b>このURLを知っている人は誰でもグループに入れます。' +
      '公開する範囲にはご配慮ください。リンクは設定から作り直すこともできます。</div>' +
      '</div>';

    return h;
  }

  function stepRow(n, txt, fig) {
    return '<div class="ln-step"><div class="ln-sn">' + n + '</div>' +
           '<div class="ln-sb"><div class="ln-st">' + txt + '</div>' +
           (fig ? '<div class="ln-fig">' + fig + '</div>' : '') + '</div></div>';
  }

  /* プライバシーポリシー */
  function privacyHtml() {
    return [
      '<h2><span>🔒</span>プライバシーポリシー</h2>',
      '<p class="lead">お預かりする情報の取り扱いについて</p>',

      '<p>みんなで遊びましょー（以下「当グループ」）は、参加者および',
      'お問い合わせいただいた方の個人情報を、次のとおり取り扱います。</p>',

      '<h3>1. 取得する情報</h3>',
      '<p>当グループが取得するのは、次のものに限ります。</p>',
      '<table>',
      '<tr><th>お問い合わせ時</th><td>お名前、電話番号、メールアドレス、お問い合わせの内容</td></tr>',
      '<tr><th>参加申込時</th><td>お名前、連絡先、参加人数、お子さまの年齢、',
      '安全のために必要な範囲でのアレルギー・持病などの情報</td></tr>',
      '<tr><th>活動中</th><td>活動の様子を記録した写真・動画</td></tr>',
      '</table>',
      '<p class="note">このサイトを見るだけでは、個人を特定する情報は一切取得しません。',
      '会員登録もアカウントも不要です。</p>',

      '<h3>2. 利用する目的</h3>',
      '<ul><li>お問い合わせへの回答</li><li>活動のご案内、開催・中止のご連絡</li>',
      '<li>当日の安全管理（けがや急病への対応）</li><li>活動の記録と報告</li></ul>',
      '<p>これ以外の目的には使いません。</p>',

      '<h3>3. 写真・動画の取り扱い</h3>',
      '<p>活動の様子を撮影し、記録や紹介のために使わせていただくことがあります。',
      '<b>お子さまが写ったものを公開する場合は、事前に保護者の方へご確認します。</b></p>',
      '<p>すでに公開されているものについて、掲載をやめてほしいというご連絡をいただいた場合は、',
      '速やかに取り下げます。お問い合わせ先までお知らせください。</p>',

      '<h3>4. 第三者への提供</h3>',
      '<p>ご本人の同意なく、第三者へ提供することはありません。ただし次の場合を除きます。</p>',
      '<ul><li>法令にもとづく開示を求められた場合</li>',
      '<li>生命や身体に危険が及ぶおそれがあり、ご本人の同意を得ることが難しい場合',
      '（救急搬送時に、医療機関へ持病やアレルギーをお伝えする場合など）</li></ul>',

      '<h3>5. 管理と保管</h3>',
      '<p>お預かりした情報は、紛失や漏えいが起きないよう注意して管理します。',
      '利用する目的がなくなったものは、速やかに消去します。</p>',

      '<h3>6. 端末に保存するもの</h3>',
      '<p>このサイトは、合言葉を入力済みかどうかと、見た目の設定だけを',
      'お使いのブラウザに保存します。個人を特定する情報は含みません。',
      'ブラウザの閲覧データを削除すると、これらも消えます。</p>',

      '<h3>7. 外部のサービスについて</h3>',
      '<p>このサイトから、公園などの外部サイトへのリンクを掲載しています。',
      'リンク先での情報の取り扱いについては、それぞれのサイトの方針が適用されます。</p>',

      '<h3>8. 開示・訂正・削除のご希望</h3>',
      '<p>ご自身の情報について、内容の確認、訂正、削除をご希望の場合は、',
      'お問い合わせ先までご連絡ください。ご本人であることを確認のうえ、対応します。</p>',

      '<h3>9. お問い合わせ先</h3>',
      '<p>みんなで遊びましょー nakayoshi<br>代表　' + NAME + '<br>',
      '電話　<a href="tel:' + TELR + '" style="color:#c0392b;font-weight:700">' + TEL + '</a><br>',
      'メール　<a href="mailto:' + MAIL + '" style="color:#c0392b;font-weight:700;word-break:break-all">' + MAIL + '</a></p>',

      '<p class="note">このポリシーは、必要に応じて見直すことがあります。<br>制定日：2026年10月</p>'
    ].join('');
  }

  /* ---------- 組み立て ---------- */
  var built = false;
  function build() {
    if (built || document.getElementById('nkm-ov')) return;
    built = true;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nkm-btn';
    btn.id = 'nkm-btn';
    btn.setAttribute('aria-label', 'メニュー');
    btn.innerHTML = '<i></i><i></i><i></i>';
    btn.onclick = toggle;
    document.body.appendChild(btn);

    var ov = document.createElement('div');
    ov.className = 'nkm-ov';
    ov.id = 'nkm-ov';
    ov.onclick = function (e) { if (e.target === ov) close(); };
    ov.innerHTML =
      '<nav class="nkm-panel">' +
        '<div class="nkm-head">' +
          '<span class="ch">🍒</span>' +
          '<span class="tt"><b>nakayoshi</b><small>みんなで遊びましょー</small></span>' +
          '<button class="nkm-x" onclick="nkmClose()" aria-label="閉じる">✕</button>' +
        '</div>' +

        '<div class="nkm-sec">// あそぶ</div>' +
        '<a class="nkm-i" href="index.html"><span class="ic">🏠</span>' +
          '<span class="tx">ホーム<small>トップページへ</small></span></a>' +
        '<a class="nkm-i hi" href="nakayoshi.html"><span class="ic">🍒</span>' +
          '<span class="tx">Let\u2019s play<small>いまの活動のご案内</small></span></a>' +
        '<button class="nkm-i" onclick="nkmOpen(\'nkm-arch\')"><span class="ic">📚</span>' +
          '<span class="tx">アーカイブ<small>これまでの活動の記録</small></span></button>' +

        '<div class="nkm-sec">// このサイトについて</div>' +
        '<button class="nkm-i" onclick="nkmOpen(\'nkm-info\')"><span class="ic">✉️</span>' +
          '<span class="tx">お問い合わせ<small>電話・メール</small></span></button>' +
        '<button class="nkm-i" onclick="nkmOpen(\'nkm-priv\')"><span class="ic">🔒</span>' +
          '<span class="tx">プライバシーポリシー<small>個人情報の取り扱い</small></span></button>' +
        '<button class="nkm-i" onclick="nkmOpen(\'nkm-app\')"><span class="ic">📲</span>' +
          '<span class="tx">アプリとしてインストール<small>ホーム画面に追加する</small></span></button>' +

        '<div class="nkm-sec">// その他</div>' +
        '<button class="nkm-i" onclick="nkmLogout()"><span class="ic">🚪</span>' +
          '<span class="tx">ログアウト<small>合言葉を入れ直します</small></span></button>' +

        '<div class="nkm-foot">&copy; 2026 Koji Furutani.<br>All Rights Reserved.</div>' +
      '</nav>';
    document.body.appendChild(ov);

    document.body.appendChild(modal('nkm-arch',
      '<h2><span>📚</span>アーカイブ</h2>' +
      '<p class="lead">これまでの活動の記録</p>' +
      '<div class="nkm-empty"><span class="em">🍒</span>' +
      '<p>まだアーカイブはありません</p>' +
      '<p class="sm">これから少しずつ、遊んだ記録をためていきます。<br>どうぞお楽しみに。</p></div>'));

    document.body.appendChild(modal('nkm-info', contactHtml()));
    document.body.appendChild(modal('nkm-priv', privacyHtml()));

    document.body.appendChild(modal('nkm-app',
      '<h2><span>📲</span>アプリとしてインストール</h2>' +
      '<p class="lead">ホーム画面に追加して、すぐ開けるようにします</p>' +
      installHtml()));

    var tz = document.createElement('div');
    tz.className = 'nkm-toast';
    tz.id = 'nkm-toast';
    document.body.appendChild(tz);

    /* すでに案内を受け取っていれば、ボタンを出す */
    if (deferred) {
      var b = document.getElementById('nkm-install-now');
      if (b) b.style.display = '';
    }
  }

  function modal(id, inner) {
    var m = document.createElement('div');
    m.className = 'nkm-modal';
    m.id = id;
    m.onclick = function (e) { if (e.target === m) closeModal(id); };
    m.innerHTML = '<div class="nkm-in">' +
      '<button class="cl" onclick="nkmCloseModal(\'' + id + '\')" aria-label="閉じる">✕</button>' +
      inner + '</div>';
    return m;
  }

  /* ---------- 開閉 ---------- */
  function toggle() {
    var ov = document.getElementById('nkm-ov');
    var btn = document.getElementById('nkm-btn');
    var open = !ov.classList.contains('open');
    ov.classList.toggle('open', open);
    btn.classList.toggle('on', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function close() {
    document.getElementById('nkm-ov').classList.remove('open');
    document.getElementById('nkm-btn').classList.remove('on');
    document.body.style.overflow = '';
  }
  function open(id) {
    close();
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }
  function toast(msg) {
    var t = document.getElementById('nkm-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  /* ---------- 外から呼べるように ---------- */
  window.nkmOpen        = open;
  window.nkmClose       = close;
  window.nkmCloseModal  = closeModal;
  window.nkmToggle      = toggle;
  /* もとのページで使っていた呼び名も残す */
  window.openM = function (id) {
    open(id === 'mArch' ? 'nkm-arch' : (id === 'mInfo' ? 'nkm-info' : id));
  };
  window.closeM = function (id) {
    closeModal(id === 'mArch' ? 'nkm-arch' : (id === 'mInfo' ? 'nkm-info' : id));
  };

  /* LINEの宛先を登録・変更する */
  window.nkmLineHow = function () {
    var g = document.getElementById('lnGuide');
    var a = document.querySelector('.ln-howto a');
    if (!g) return false;
    var open = !g.classList.contains('open');
    g.classList.toggle('open', open);
    if (a) a.textContent = open ? '追加方法を閉じる' : '追加方法はこちら';
    if (open) setTimeout(function () {
      g.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
    return false;
  };

  window.nkmLineTab = function (k, btn) {
    document.getElementById('lnPaneMe').classList.toggle('on', k === 'me');
    document.getElementById('lnPaneGr').classList.toggle('on', k === 'gr');
    var bs = document.querySelectorAll('.ln-tab');
    for (var i = 0; i < bs.length; i++) bs[i].classList.remove('on');
    if (btn) btn.classList.add('on');
  };

  window.nkmLineEdit = function () {
    var cur = '';
    try { cur = localStorage.getItem(LKEY) || ''; } catch (e) {}
    var v = prompt(
      'LINEの宛先を入力してください。\n\n' +
      '・公式アカウントのID（例: @nakayoshi）\n' +
      '・友だち追加のURL（https://line.me/... など）\n\n' +
      '空のまま決定すると、登録を消します。',
      cur);
    if (v === null) return;                 /* 取り消し */
    var u = normalizeLine(v);
    if (v.trim() && !u) { alert('うまく読み取れませんでした。\n@から始まるIDか、httpsで始まるURLを入れてください。'); return; }
    saveLine(u);
    var box = document.getElementById('nkm-info');
    if (box) {
      var inner = box.querySelector('.nkm-in');
      if (inner) inner.innerHTML =
        '<button class="cl" onclick="nkmCloseModal(\'nkm-info\')" aria-label="閉じる">✕</button>' + contactHtml();
    }
    toast(u ? 'LINEを登録しました' : 'LINEの登録を消しました');
  };

  window.nkmLogout = function () {
    if (!confirm('ログアウトします。次に開くときは合言葉の入力が必要です。')) return;
    if (typeof window.nkGateLogout === 'function') {
      window.nkGateLogout();
    } else {
      try { localStorage.removeItem('nk-gate'); } catch (e) {}
      try { sessionStorage.removeItem('nk-gate'); } catch (e) {}
      location.reload();
    }
  };

  window.nkmInstallNow = function () {
    if (!deferred) { toast('この画面からは追加できません。手順をご覧ください'); return; }
    deferred.prompt();
    deferred.userChoice.then(function (r) {
      if (r && r.outcome === 'accepted') toast('ホーム画面に追加しました');
      deferred = null;
      var b = document.getElementById('nkm-install-now');
      if (b) b.style.display = 'none';
    }).catch(function () {});
  };

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    close();
    closeModal('nkm-arch');
    closeModal('nkm-info');
    closeModal('nkm-priv');
    closeModal('nkm-app');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
