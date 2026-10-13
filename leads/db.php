<?php
/* Shared database helper for send.php and the leads page.
   Settings live in narti-config.php one level ABOVE the website folder, never in the repo. */

declare(strict_types=1);

function narti_config_paths(): array {
    $site = dirname(__DIR__);                                   // website folder (where index.html lives)
    $home = getenv('HOME') ?: (function_exists('posix_getpwuid') ? (posix_getpwuid(posix_geteuid())['dir'] ?? '') : '');
    $docRoot = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
    $paths = [
        dirname($site) . '/narti-config.php',                   // one level above the website folder
        $docRoot !== '' ? dirname($docRoot) . '/narti-config.php' : '',
        $home !== '' ? rtrim($home, '/') . '/narti-config.php' : '',
        dirname($site, 2) . '/narti-config.php',                // two levels above
        $site . '/private/narti-config.php',                    // fallback inside a blocked folder
    ];
    return array_values(array_unique(array_filter($paths)));
}

function narti_config(): ?array {
    static $cfg = false;
    if ($cfg !== false) return $cfg;
    foreach (narti_config_paths() as $p) {
        if (@is_file($p) && @is_readable($p)) { $c = require $p; $cfg = is_array($c) ? $c : null; return $cfg; }
    }
    $cfg = null;
    return null;
}

function narti_db(): ?PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $c = narti_config();
    if (!$c) return null;
    try {
        $dsn = $c['dsn'] ?? sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $c['db_host'] ?? 'localhost', $c['db_name'] ?? '');
        $pdo = new PDO($dsn, $c['db_user'] ?? null, $c['db_pass'] ?? null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $isMysql = str_starts_with($dsn, 'mysql');
        $pdo->exec($isMysql
            ? 'CREATE TABLE IF NOT EXISTS leads (
                 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                 created_at DATETIME NOT NULL,
                 service VARCHAR(60) NOT NULL DEFAULT "",
                 name VARCHAR(80) NOT NULL,
                 phone VARCHAR(20) NOT NULL,
                 address VARCHAR(160) NOT NULL,
                 email VARCHAR(120) NOT NULL DEFAULT "",
                 message TEXT NOT NULL,
                 page VARCHAR(200) NOT NULL DEFAULT "",
                 ip VARCHAR(45) NOT NULL DEFAULT "",
                 email_sent TINYINT(1) NOT NULL DEFAULT 0,
                 INDEX (created_at)
               ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
            : 'CREATE TABLE IF NOT EXISTS leads (
                 id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, service TEXT DEFAULT "",
                 name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, email TEXT DEFAULT "",
                 message TEXT NOT NULL, page TEXT DEFAULT "", ip TEXT DEFAULT "", email_sent INTEGER DEFAULT 0)');
        return $pdo;
    } catch (Throwable $e) {
        error_log('NARTI db: ' . $e->getMessage());
        return null;
    }
}
