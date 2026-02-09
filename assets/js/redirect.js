(function () {
  function getTargetUrl() {
    var q = new URLSearchParams(window.location.search);
    return q.get('url') || q.get('to') || q.get('u') || (window.REDIRECT_CONFIG && window.REDIRECT_CONFIG.defaultUrl) || null;
  }

  function inTelegramWebView() {
    return window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === 'function';
  }

  var url = getTargetUrl();

  // Во внешнем браузере — редирект сразу, до отрисовки страницы
  if (url && !inTelegramWebView()) {
    window.location.replace(url);
    return;
  }

  function run() {
    var msg = document.getElementById('message');
    var btn = document.getElementById('open-browser-btn');

    if (!url) {
      if (msg) msg.textContent = 'Ссылка не задана. Добавьте ?url=... или config.defaultUrl';
      return;
    }

    if (inTelegramWebView()) {
      if (msg) msg.textContent = 'Нажмите кнопку — откроется во внешнем браузере с нужной страницей';
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
