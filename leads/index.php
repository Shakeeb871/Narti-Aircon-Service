<?php
/* NARTI leads page: https://nartiairconservice.com/leads/
   Password comes from narti-config.php (outside the website folder). */

declare(strict_types=1);
require_once __DIR__ . '/db.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');

session_set_cookie_params(['lifetime' => 0, 'path' => '/leads/', 'secure' => !empty($_SERVER['HTTPS']), 'httponly' => true, 'samesite' => 'Strict']);
session_start();

$cfg = narti_config();
$h = static fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');

if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(16)); }
$error = '';

/* Logout */
if (isset($_GET['logout'])) { $_SESSION = []; session_destroy(); header('Location: /leads/'); exit; }

/* Login */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['password'])) {
    $tokenOk = hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''));
    $pass = (string)($cfg['admin_password'] ?? '');
    if ($tokenOk && $pass !== '' && strlen($pass) >= 12 && hash_equals($pass, (string)$_POST['password'])) {
        session_regenerate_id(true);
        $_SESSION['ok'] = true;
        header('Location: /leads/'); exit;
    }
    sleep(2);   // slow down guessing
    $error = 'Wrong password.';
}

$authed = !empty($_SESSION['ok']);
$db = $authed ? narti_db() : null;

/* CSV download */
if ($authed && $db && isset($_GET['csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="narti-leads-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['ID', 'Date', 'Service', 'Name', 'Phone', 'Address', 'Email', 'Issue', 'Email sent', 'Page']);
    foreach ($db->query('SELECT * FROM leads ORDER BY id DESC') as $r) {
        $row = [$r['id'], $r['created_at'], $r['service'], $r['name'], $r['phone'], $r['address'], $r['email'], $r['message'], $r['email_sent'] ? 'Yes' : 'No', $r['page']];
        /* stop spreadsheet formula injection */
        foreach ($row as $i => $v) { if ($i !== 4 && preg_match('/^[=+\-@]/', (string)$v)) { $row[$i] = "'" . $v; } }
        fputcsv($out, $row);
    }
    exit;
}

$rows = [];
$total = 0;
if ($authed && $db) {
    $total = (int)$db->query('SELECT COUNT(*) FROM leads')->fetchColumn();
    $rows = $db->query('SELECT * FROM leads ORDER BY id DESC LIMIT 500')->fetchAll();
}
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Leads | NARTI</title>
<style>
  :root { --navy:#0d2c49; --orange:#bf4c0c; --line:#e3eaf1; --text:#4a5d70; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #f2f6fa; color: var(--navy); }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 24px; box-shadow: 0 10px 28px -18px rgba(13,44,73,.25); }
  h1 { margin: 0 0 4px; font-size: 24px; }
  .muted { color: var(--text); font-size: 14px; }
  .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .btn { display: inline-block; padding: 10px 18px; border-radius: 999px; background: var(--orange); color: #fff; text-decoration: none; font-weight: 700; border: 0; cursor: pointer; font-size: 14px; }
  .btn--ghost { background: #fff; color: var(--navy); border: 1px solid var(--line); }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--text); }
  td.msg { max-width: 320px; white-space: pre-wrap; }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .yes { background: #e7f6ec; color: #1e7a3c; } .no { background: #fdecea; color: #b42318; }
  .login { max-width: 380px; margin: 12vh auto; }
  input[type=password] { width: 100%; height: 44px; padding: 0 12px; border: 1px solid #d5dfe9; border-radius: 10px; font-size: 15px; margin: 12px 0; }
  .err { color: #b42318; font-weight: 600; font-size: 14px; }
  .scroll { overflow-x: auto; }
  a.tel { color: var(--orange); font-weight: 700; text-decoration: none; }
</style>
</head>
<body>
<div class="wrap">
<?php if (!$cfg): ?>
  <div class="card login"><h1>Setup needed</h1>
    <p class="muted">The settings file was not found. Create a file named exactly <b>narti-config.php</b> at this location:</p>
    <p><code style="word-break:break-all"><?= $h(narti_config_paths()[0]) ?></code></p>
    <p class="muted">If your hosting does not allow that folder, put it here instead:</p>
    <p><code style="word-break:break-all"><?= $h(dirname(__DIR__) . '/private/narti-config.php') ?></code></p></div>
<?php elseif (!$authed): ?>
  <form class="card login" method="post">
    <h1>NARTI Leads</h1>
    <p class="muted">Enter the leads page password.</p>
    <input type="hidden" name="csrf" value="<?= $h($_SESSION['csrf']) ?>">
    <input type="password" name="password" autocomplete="current-password" required autofocus>
    <?php if ($error): ?><p class="err"><?= $h($error) ?></p><?php endif; ?>
    <button class="btn" type="submit">Log in</button>
  </form>
<?php else: ?>
  <div class="top">
    <div><h1>Website Leads</h1><p class="muted"><?= $total ?> total<?= $total > 500 ? ', showing the latest 500' : '' ?></p></div>
    <div><a class="btn" href="?csv=1">Download Excel (CSV)</a> <a class="btn btn--ghost" href="?logout=1">Log out</a></div>
  </div>
  <div class="card scroll">
  <?php if (!$db): ?>
    <p class="err">Could not connect to the database. Check the details in narti-config.php.</p>
  <?php elseif (!$rows): ?>
    <p class="muted">No leads yet. New form requests will appear here.</p>
  <?php else: ?>
    <table>
      <thead><tr><th>Date</th><th>Service</th><th>Name</th><th>Phone</th><th>Address</th><th>Email</th><th>Issue</th><th>Email sent</th></tr></thead>
      <tbody>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td><?= $h(date('d M Y, H:i', strtotime($r['created_at']))) ?></td>
          <td><?= $h($r['service']) ?></td>
          <td><?= $h($r['name']) ?></td>
          <td><a class="tel" href="tel:<?= $h(preg_replace('/[^0-9+]/', '', $r['phone'])) ?>"><?= $h($r['phone']) ?></a></td>
          <td><?= $h($r['address']) ?></td>
          <td><?= $h($r['email'] ?: '-') ?></td>
          <td class="msg"><?= $h($r['message']) ?></td>
          <td><span class="tag <?= $r['email_sent'] ? 'yes' : 'no' ?>"><?= $r['email_sent'] ? 'Yes' : 'No' ?></span></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
  </div>
<?php endif; ?>
</div>
</body>
</html>
