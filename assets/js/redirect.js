// redirect.js — открытие ссылки во внешнем браузере: Android — редирект через redirect.php, iOS — кнопка Web App
(function () {
  function getTargetUrl() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get('url') || params.get('to') || params.get('u');
    if (fromQuery) return fromQuery;
    if (window.REDIRECT_CONFIG && window.REDIRECT_CONFIG.defaultUrl) {
      return window.REDIRECT_CONFIG.defaultUrl;
    }
    return null;
  }

  /** Ссылка на наш redirect.php с целевым url — во внешнем браузере даёт мгновенный 302 */
  function getRedirectUrl(targetUrl) {
    var base = window.location.pathname.replace(/\/[^/]*$/, '/') || '/';
    var origin = window.location.origin;
    return origin + base + 'redirect.php?url=' + encodeURIComponent(targetUrl);
  }

  function setMessage(text) {
    var el = document.getElementById('message');
    if (el) el.textContent = text;
  }

  function isMiniApp() {
    return window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === 'function';
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function init() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ attrs: { class: 'icon', 'stroke-width': 2 } });
    }

    var url = getTargetUrl();
    if (!url) {
      setMessage('Ссылка не задана. Укажите ?url=... или настройте config.js');
      return;
    }

    if (isMiniApp()) {
      // iOS/Android внутри Telegram: только по нажатию открываем во внешнем браузере наш redirect.php → там 302
      setMessage(isIOS() ? 'Нажмите кнопку — откроется в Safari' : 'Нажмите кнопку — откроется во внешнем браузере');
      var btn = document.getElementById('open-browser-btn');
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.onclick = function () {
          window.Telegram.WebApp.openLink(getRedirectUrl(url));
        };
      }
      if (window.Telegram.WebApp.ready) {
        window.Telegram.WebApp.ready();
      }
      return;
    }

    // Уже во внешнем браузере (например Android с настройкой «открывать ссылки снаружи»): мгновенный редирект через redirect.php
    setMessage('Открытие…');
    window.location.replace(getRedirectUrl(url));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
