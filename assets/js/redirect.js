// redirect.js — редирект на целевую ссылку
(function () {
  var delay = 0;

  function getTargetUrl() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get('url') || params.get('to') || params.get('u');
    if (fromQuery) {
      try {
        decodeURIComponent(fromQuery);
      } catch (e) {}
      return fromQuery;
    }
    if (window.REDIRECT_CONFIG && window.REDIRECT_CONFIG.defaultUrl) {
      return window.REDIRECT_CONFIG.defaultUrl;
    }
    return null;
  }

  function setMessage(text) {
    var el = document.getElementById('message');
    if (el) el.textContent = text;
  }

  function showFallback(url) {
    var link = document.getElementById('fallback-link');
    if (link) {
      link.href = url;
      link.style.display = 'inline-flex';
    }
  }

  function redirect(url) {
    if (!url) {
      setMessage('Ссылка не задана. Укажите ?url=... или настройте config.js');
      return;
    }
    setMessage('Перенаправление через ' + (delay / 1000) + ' сек…');
    showFallback(url);
    setTimeout(function () {
      window.location.replace(url);
    }, delay);
  }

  function init() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ attrs: { class: 'icon', 'stroke-width': 2 } });
    }
    var url = getTargetUrl();
    redirect(url);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
