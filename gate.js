/* ============================================================
   nakayoshi  かんたんログイン

   使い方
     各ページの <head> の中で、いちばん先に読み込んでください。
       <script src="gate.js"></script>

   できること
     合言葉を入れるまで、ページの中身を見せません。
     「ログインを維持する」にチェックを入れると、
     同じ端末では次回から入力不要になります（30日間）。
     外した場合は、タブを閉じるまでの一時的な記録になります。

   ⚠️ ご承知おきください
     これはブラウザの中だけで動く仕組みです。
     画面を見せない「のれん」のようなもので、
     本格的な認証ではありません。
     技術のある人が本気で見ようとすれば、回避できます。
     そのため、外に出てはいけない情報は載せないでください。
   ============================================================ */
(function () {
  'use strict';

  /* 読み込まれたことの印。
     ログイン画面が出ないときは、ブラウザの開発者ツールのコンソールで
     window.nkGateLoaded と入力して true が返るか確かめてください。
     false や undefined なら、gate.js が置かれていないか、
     ファイル名・置き場所が違っています。 */
  window.nkGateLoaded = true;

  var KEY   = 'nk-gate';
  var SALT  = 'nakayoshi-2026';
  /* 合言葉そのものは書かず、照合用の値だけを持たせています */
  var HASH  = '7d66edfe409637bdede160828c7e04250b3527d50b6142c3571f8141f87175f3';
  var DAYS  = 30;

  /* ---- すでに通っているか ----
     「ログインを維持する」にチェックがあれば localStorage に、
     無ければ sessionStorage に記録します。
     sessionStorage はタブを閉じると消えるので、
     共用の端末でもあとに残りません。 */
  function passed() {
    try {
      if (sessionStorage.getItem(KEY)) return true;   /* 今回かぎりの記録 */
    } catch (e) {}
    try {
      var v = localStorage.getItem(KEY);              /* 維持する設定での記録 */
      if (!v) return false;
      var t = parseInt(v, 10);
      if (!t) return false;
      if (Date.now() - t > DAYS * 86400000) {         /* 期限切れ */
        localStorage.removeItem(KEY);
        return false;
      }
      return true;
    } catch (e) { return false; }
  }

  function remember(keep) {
    var now = String(Date.now());
    if (keep) {
      try { localStorage.setItem(KEY, now); } catch (e) {}
      try { sessionStorage.removeItem(KEY); } catch (e) {}
    } else {
      try { sessionStorage.setItem(KEY, now); } catch (e) {}
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  }

  /* 前回の選択を覚えておき、次も同じ状態で出す */
  function lastKeep() {
    try { return localStorage.getItem(KEY + '-keep') !== '0'; } catch (e) { return true; }
  }
  function saveKeep(keep) {
    try { localStorage.setItem(KEY + '-keep', keep ? '1' : '0'); } catch (e) {}
  }

  /* ログアウト。メニューから呼び出します */
  window.nkGateLogout = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  /* URLの末尾に #logout を付けて開くと、合言葉を入れ直せます */
  if (location.hash === '#logout') {
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }

  if (passed()) return;

  /* ---- 中身を隠す ---- */
  var hide = document.createElement('style');
  hide.id = 'nk-hide';
  hide.textContent = 'body>*:not(#nk-gate){visibility:hidden !important}' +
                     'body{overflow:hidden !important}';
  (document.head || document.documentElement).appendChild(hide);

  /* ---- 照合 ---- */
  function sha256(text) {
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      var buf = new TextEncoder().encode(text);
      return window.crypto.subtle.digest('SHA-256', buf).then(function (d) {
        var a = Array.prototype.slice.call(new Uint8Array(d));
        return a.map(function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      });
    }
    /* 暗号機能が使えない環境（file:// など）向けの控え */
    return Promise.resolve(null);
  }

  function check(input) {
    return sha256(SALT + input).then(function (h) {
      if (h === null) return input === atob('dHVib21pZ3VtaQ==');  /* 予備の照合 */
      return h === HASH;
    });
  }

  /* ---- 画面を作る ---- */
  var built = false;
  function build() {
    /* 読み込みの行き違いで二度呼ばれても、画面は一つだけにする */
    if (built || document.getElementById('nk-gate')) return;
    built = true;
    var css = document.createElement('style');
    css.textContent = [
      '#nk-gate{position:fixed;inset:0;z-index:99999;display:flex;',
      'align-items:center;justify-content:center;padding:22px;',
      'background:linear-gradient(160deg,#dce9f7 0%,#e8f0e2 100%);',
      "font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;",
      'overflow-y:auto}',
      '#nk-gate .bx{width:100%;max-width:380px;background:#fff;border-radius:22px;',
      'padding:34px 26px 28px;box-shadow:0 18px 48px rgba(60,90,130,.22);text-align:center;',
      'animation:nkUp .8s cubic-bezier(.16,1,.3,1)}',
      '@keyframes nkUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}',
      '#nk-gate .ch{font-size:52px;line-height:1;margin-bottom:14px;display:block;',
      'animation:nkSway 3.4s ease-in-out infinite}',
      '@keyframes nkSway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}',
      '#nk-gate h1{font-size:25px;font-weight:700;color:#f07d1a;margin-bottom:6px;letter-spacing:.02em}',
      '#nk-gate .sub{font-size:12.5px;color:#7b8a9e;line-height:1.8;margin-bottom:22px}',
      '#nk-gate label{display:block;font-size:12.5px;color:#5a6a7e;text-align:left;',
      'margin-bottom:6px;font-weight:700}',
      '#nk-gate input{width:100%;padding:15px 16px;font-size:17px;',
      'border:2px solid #c9d8ea;border-radius:13px;background:#f7fafd;',
      'font-family:inherit;color:#2d3a4a;text-align:center;letter-spacing:.08em}',
      '#nk-gate input:focus{outline:none;border-color:#f07d1a;background:#fff}',
      '#nk-gate .btn{width:100%;margin-top:13px;padding:16px;border:none;border-radius:99px;',
      'background:#e03a3a;color:#fff;font-size:16px;font-weight:700;font-family:inherit;',
      'cursor:pointer;box-shadow:0 5px 16px rgba(224,58,58,.3)}',
      '#nk-gate .btn:hover{filter:brightness(1.08)}',
      '#nk-gate .btn:active{transform:translateY(1px)}',
      '#nk-gate .btn:disabled{opacity:.6;cursor:wait}',
      '#nk-gate .keep{display:flex;align-items:flex-start;gap:9px;margin-top:14px;',
      'padding:11px 13px;background:#f7fafd;border:1px solid #dbe6f1;border-radius:11px;',
      'cursor:pointer;text-align:left}',
      '#nk-gate .keep:hover{border-color:#f07d1a}',
      '#nk-gate .keep input{width:20px;height:20px;margin:1px 0 0;flex:0 0 auto;',
      'accent-color:#e03a3a;cursor:pointer;padding:0;border:none;background:none}',
      '#nk-gate .keep input:focus-visible{outline:2px solid #f07d1a;outline-offset:2px}',
      '#nk-gate .keep .kt{flex:1;min-width:0}',
      '#nk-gate .keep .kt b{display:block;font-size:13.5px;color:#2d3a4a;font-weight:700}',
      '#nk-gate .keep .kt small{display:block;font-size:11px;color:#8c9bb0;',
      'line-height:1.7;margin-top:2px}',
      '#nk-gate .msg{min-height:20px;margin-top:12px;font-size:13px;color:#d93025;font-weight:700}',
      '#nk-gate .note{margin-top:20px;padding-top:16px;border-top:1px solid #e4ecf4;',
      'font-size:11.5px;color:#8c9bb0;line-height:1.85}',
      '#nk-gate .note a{color:#c0392b;font-weight:700;text-decoration:none}',
      '#nk-gate .shake{animation:nkShake .4s}',
      '@keyframes nkShake{0%,100%{transform:translateX(0)}',
      '25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}',
      '@media(prefers-reduced-motion:reduce){',
      '#nk-gate .bx,#nk-gate .ch,#nk-gate .shake{animation:none}}'
    ].join('');
    document.head.appendChild(css);

    var g = document.createElement('div');
    g.id = 'nk-gate';
    g.innerHTML =
      '<div class="bx">' +
        '<span class="ch">🍒</span>' +
        '<h1>nakayoshi</h1>' +
        '<p class="sub">みんなで遊びましょー<br>合言葉を入れてください</p>' +
        '<label for="nk-pw">あいことば</label>' +
        '<input id="nk-pw" type="password" autocomplete="current-password" ' +
          'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
          'inputmode="latin" placeholder="••••••••••">' +
        '<label class="keep" for="nk-keep">' +
          '<input type="checkbox" id="nk-keep">' +
          '<span class="kt"><b>ログインを維持する</b>' +
          '<small>次からは合言葉なしで開けます（30日間）。' +
          '共用の端末ではチェックを外してください。</small></span>' +
        '</label>' +
        '<button class="btn" id="nk-go" type="button">入る</button>' +
        '<p class="msg" id="nk-msg"></p>' +
        '<p class="note">合言葉がわからない方は、こちらまで<br>' +
          '<a href="tel:09081263532">090-8126-3532</a>　/　' +
          '<a href="mailto:m.k.s.m0822@gmail.com">m.k.s.m0822@gmail.com</a></p>' +
      '</div>';
    document.body.appendChild(g);

    var pw   = document.getElementById('nk-pw');
    var keep = document.getElementById('nk-keep');
    var go   = document.getElementById('nk-go');
    var msg = document.getElementById('nk-msg');
    var bx  = g.querySelector('.bx');
    var ng  = 0;

    function open_() {
      var k = keep.checked;
      saveKeep(k);
      remember(k);
      g.style.transition = 'opacity .45s';
      g.style.opacity = '0';
      setTimeout(function () {
        if (g.parentNode) g.parentNode.removeChild(g);
        var h = document.getElementById('nk-hide');
        if (h && h.parentNode) h.parentNode.removeChild(h);
        document.body.style.overflow = '';
      }, 460);
    }

    function wrong() {
      ng++;
      bx.classList.remove('shake');
      void bx.offsetWidth;            /* 連続で間違えても毎回ゆれるように */
      bx.classList.add('shake');
      msg.textContent = ng >= 3
        ? '合言葉が違うようです。下の連絡先までお問い合わせください。'
        : 'ちがうみたい。もう一度どうぞ。';
      pw.value = '';
      pw.focus();
    }

    function submit() {
      var v = pw.value.trim();
      if (!v) { pw.focus(); return; }
      go.disabled = true;
      msg.textContent = '';
      check(v).then(function (ok) {
        go.disabled = false;
        if (ok) open_(); else wrong();
      }).catch(function () {
        go.disabled = false;
        wrong();
      });
    }

    keep.checked = lastKeep();   /* 前回の選択を引き継ぐ */

    go.addEventListener('click', submit);
    pw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    keep.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    setTimeout(function () { pw.focus(); }, 180);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
    /* defer や async で読み込まれ、すでに読み終えていた場合の保険 */
    window.addEventListener('load', build);
  } else {
    build();
  }
})();
