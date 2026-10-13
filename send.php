<?php
/* NARTI lead form -> email
   Receives the hero form on the service pages and emails it to the owner.
   Replies with JSON for fetch() requests, or redirects back for plain form posts. */

declare(strict_types=1);

const TO_EMAIL   = 'shujaatshakeeb26@gmail.com';
const FROM_EMAIL = 'noreply@nartiairconservice.com';
const SITE_NAME  = 'NARTI Aircon Service';

$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'fetch';

function respond(bool $ok, string $msg, bool $isAjax): void {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['ok' => $ok, 'message' => $msg]);
    } else {
        $back = $_SERVER['HTTP_REFERER'] ?? '/';
        if (strpos($back, 'https://nartiairconservice.com') !== 0) { $back = '/'; }
        $back = strtok($back, '#?');
        header('Location: ' . $back . '?sent=' . ($ok ? '1' : '0') . '#top');
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

/* Spam guards: hidden honeypot field must stay empty */
if (!empty($_POST['website'])) {
    respond(true, 'Thank you.', $isAjax);
}

/* Clean a single-line value: strip tags and control characters (blocks header injection) */
function clean(string $key, int $max): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = strip_tags($v);
    $v = preg_replace('/[\r\n\t\x00-\x1F\x7F]+/u', ' ', $v) ?? '';
    return mb_substr($v, 0, $max);
}
function cleanText(string $key, int $max): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = strip_tags($v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $v) ?? '';
    return mb_substr($v, 0, $max);
}

$name    = clean('name', 80);
$phone   = clean('phone', 20);
$address = clean('address', 160);
$email   = clean('email', 120);
$message = cleanText('message', 1500);
$service = clean('service', 60);
$page    = clean('page', 200);

if ($name === '' || $phone === '' || $address === '' || $message === '') {
    respond(false, 'Please fill in your name, phone, address and the issue.', $isAjax);
}
if (!preg_match('/^[0-9+()\-\s]{7,20}$/', $phone)) {
    respond(false, 'Please enter a valid phone number.', $isAjax);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address, or leave it empty.', $isAjax);
}

/* Save the lead first, so it is never lost even if the email fails */
require_once __DIR__ . '/leads/db.php';
$leadId = null;
$db = narti_db();
if ($db) {
    try {
        $st = $db->prepare('INSERT INTO leads (created_at, service, name, phone, address, email, message, page, ip, email_sent)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)');
        $st->execute([date('Y-m-d H:i:s'), $service, $name, $phone, $address, $email, $message, $page,
                      substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45)]);
        $leadId = (int)$db->lastInsertId();
    } catch (Throwable $e) {
        error_log('NARTI lead save: ' . $e->getMessage());
    }
}

$subject = 'New aircond enquiry: ' . ($service !== '' ? $service : 'Website') . ' - ' . $name;
$body  = "New enquiry from the website\n";
$body .= "--------------------------------\n";
$body .= "Service:  {$service}\n";
$body .= "Name:     {$name}\n";
$body .= "Phone:    {$phone}\n";
$body .= "Address:  {$address}\n";
$body .= "Email:    " . ($email !== '' ? $email : '(not given)') . "\n\n";
$body .= "Issue:\n{$message}\n\n";
$body .= "--------------------------------\n";
$body .= "Page: {$page}\n";
$body .= "Sent: " . date('Y-m-d H:i') . "\n";

$headers  = 'From: ' . SITE_NAME . ' <' . FROM_EMAIL . ">\r\n";
if ($email !== '') {
    $headers .= 'Reply-To: ' . $email . "\r\n";
}
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

/* Prefer authenticated SMTP (Gmail trusts it); fall back to PHP mail() */
$cfg = narti_config() ?? [];
$sent = false;
if (!empty($cfg['smtp_host'])) {
    require_once __DIR__ . '/leads/smtp.php';
    $sent = narti_smtp_send($cfg, (string)($cfg['notify_email'] ?? TO_EMAIL), $subject, $body, $email);
}
if (!$sent) {
    $sent = mail((string)($cfg['notify_email'] ?? TO_EMAIL), '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM_EMAIL);
}

if ($db && $leadId) {
    try { $db->prepare('UPDATE leads SET email_sent = ? WHERE id = ?')->execute([$sent ? 1 : 0, $leadId]); } catch (Throwable $e) {}
}
$ok = $sent || $leadId;

respond((bool)$ok, $ok
    ? 'Thank you. Your request has been sent and our team will contact you shortly.'
    : 'Sorry, the request could not be sent. Please call or WhatsApp us instead.', $isAjax);
