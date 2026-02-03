<?php
// 🔧 1. ПУТЬ К ПУСТОМУ PDF
$pdf = __DIR__ . '/empty.pdf';

// 🔧 2. КУДА РЕДИРЕКТИТЬ ПОСЛЕ
$redirect = 'https://jut.su';

// обязательные заголовки
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="."');
header('Content-Length: ' . filesize($pdf));

// 🔥 КЛЮЧЕВОЙ КОСТЫЛЬ
header('Refresh: 0; url=' . $redirect);

// отдаём "файл"
readfile($pdf);
exit;
