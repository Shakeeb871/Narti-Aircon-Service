<?php
/* Minimal authenticated SMTP sender (SSL on 465 or STARTTLS on 587).
   Used when smtp_* settings exist in narti-config.php; otherwise send.php falls back to mail(). */

declare(strict_types=1);

function narti_smtp_send(array $c, string $to, string $subject, string $body, string $replyTo = ''): bool {
    $host = (string)($c['smtp_host'] ?? '');
    $port = (int)($c['smtp_port'] ?? 465);
    $user = (string)($c['smtp_user'] ?? '');
    $pass = (string)($c['smtp_pass'] ?? '');
    $from = (string)($c['smtp_from'] ?? $user);
    $name = (string)($c['smtp_from_name'] ?? 'NARTI Aircon Service');
    if ($host === '' || $user === '' || $pass === '') return false;

    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true]]);
    $remote = ($port === 465 ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) { error_log("NARTI smtp connect: $errstr"); return false; }
    stream_set_timeout($fp, 15);

    $read = static function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $data;
    };
    $cmd = static function (string $c, array $ok) use ($fp, $read): bool {
        if ($c !== '') fwrite($fp, $c . "\r\n");
        $r = $read();
        $good = in_array((int)substr($r, 0, 3), $ok, true);
        if (!$good) error_log('NARTI smtp: ' . trim(preg_replace('/AUTH.*/', 'AUTH ***', $c)) . ' -> ' . trim($r));
        return $good;
    };

    $ehlo = 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
    if (!$cmd('', [220]) || !$cmd($ehlo, [250])) { fclose($fp); return false; }
    if ($port !== 465) {
        if (!$cmd('STARTTLS', [220]) || !stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT) || !$cmd($ehlo, [250])) { fclose($fp); return false; }
    }
    if (!$cmd('AUTH LOGIN', [334]) || !$cmd(base64_encode($user), [334]) || !$cmd(base64_encode($pass), [235])) { fclose($fp); return false; }
    if (!$cmd('MAIL FROM:<' . $from . '>', [250]) || !$cmd('RCPT TO:<' . $to . '>', [250, 251]) || !$cmd('DATA', [354])) { fclose($fp); return false; }

    $headers  = 'From: =?UTF-8?B?' . base64_encode($name) . '?= <' . $from . ">\r\n";
    $headers .= 'To: <' . $to . ">\r\n";
    if ($replyTo !== '') $headers .= 'Reply-To: <' . $replyTo . ">\r\n";
    $headers .= 'Subject: =?UTF-8?B?' . base64_encode($subject) . "?=\r\n";
    $headers .= 'Date: ' . date('r') . "\r\n";
    $headers .= 'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . substr(strrchr($from, '@') ?: '@localhost', 1) . ">\r\n";
    $headers .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n";
    $msg = $headers . "\r\n" . chunk_split(base64_encode($body)) . "\r\n.";
    $ok = $cmd($msg, [250]);
    $cmd('QUIT', [221]);
    fclose($fp);
    return $ok;
}
