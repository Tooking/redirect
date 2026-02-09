<?php
// redirect.php — серверный редирект 302 на целевую ссылку (мгновенно во внешнем браузере)
header('Cache-Control: no-store, no-cache');
$url = $_GET['url'] ?? $_GET['to'] ?? $_GET['u'] ?? null;
if ($url && preg_match('#^https?://#i', $url)) {
  header('Location: ' . $url, true, 302);
  exit;
}
header('Location: index.html', true, 302);
exit;
