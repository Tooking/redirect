(function () {
  function getTargetUrl() {
    var q = new URLSearchParams(window.location.search);
    return q.get('url') || q.get('to') || q.get('u') || (window.REDIRECT_CONFIG && window.REDIRECT_CONFIG.defaultUrl) || null;
  }

  function getDevice() {
    var ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    return 'pc';
  }

  function inTelegramWebView() {
    if (!window.Telegram || !window.Telegram.WebApp || typeof window.Telegram.WebApp.openLink !== 'function') return false;
    // Реально внутри Telegram только если есть initData (её передаёт клиент Telegram). Во внешнем браузере initData пустой.
    var initData = window.Telegram.WebApp.initData || '';
    return typeof initData === 'string' && initData.length > 0;
  }

  var url = getTargetUrl();
  var device = getDevice();

  // Уже во внешнем браузере — сразу редирект на цель (принудительно не в Telegram)
  if (url && !inTelegramWebView()) {
    window.location.replace(url);
    return;
  }

  function run() {
    var msg = document.getElementById('message');
    var btn = document.getElementById('open-browser-btn');
    var card = document.querySelector('.redirect-card');

    if (card) card.setAttribute('data-device', device);

    if (!url) {
      if (msg) msg.textContent = 'Ссылка не задана. Добавьте ?url=... или config.defaultUrl';
      return;
    }

    if (inTelegramWebView()) {
      // Принудительно во внешний браузер: openLink всегда открывает снаружи Telegram (не зависит от настроек)
      if (msg) {
        if (device === 'ios') msg.textContent = 'Нажмите кнопку — откроется в Safari';
        else if (device === 'android') msg.textContent = 'Нажмите кнопку — откроется в браузере';
        else msg.textContent = 'Нажмите кнопку — откроется во внешнем браузере';
      }
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.onclick = function () { window.Telegram.WebApp.openLink(url); };
      }
      if (window.Telegram.WebApp.ready) window.Telegram.WebApp.ready();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
