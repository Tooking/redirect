// redirect.js — открытие ссылки во внешнем браузере (без PHP: только клиентский редирект)
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
      // iOS/Android внутри Telegram: по нажатию открываем целевую ссылку во внешнем браузере
      setMessage(isIOS() ? 'Нажмите кнопку — откроется в Safari' : 'Нажмите кнопку — откроется во внешнем браузере');
      var btn = document.getElementById('open-browser-btn');
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.onclick = function () {
          window.Telegram.WebApp.openLink(url);
        };
      }
      if (window.Telegram.WebApp.ready) {
        window.Telegram.WebApp.ready();
      }
      return;
    }

    // Уже во внешнем браузере — сразу редирект на целевую страницу (без PHP)
    setMessage('Открытие…');
    window.location.replace(url);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
