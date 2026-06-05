<?php
/**
 * Sign Here — Contact Form Mailer
 * Pure PHP, no third-party services required.
 *
 * SETUP: Change $recipient below to your email address.
 * Upload this file to your web host alongside your HTML files.
 */

// ── CONFIG ──────────────────────────────────────────────
$recipient   = 'addesign.creatives@gmail.com';
$site_name   = 'Sign Here Signs & Printing';
$allowed_origin = '*'; // Change to your domain e.g. 'https://yourdomain.com'
// ────────────────────────────────────────────────────────

// CORS headers so the fetch() from your HTML page can reach this file
header('Access-Control-Allow-Origin: ' . $allowed_origin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── READ & SANITIZE INPUT ───────────────────────────────
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Fallback to $_POST if not JSON
if (!$data) {
    $data = $_POST;
}

function clean($value) {
    return htmlspecialchars(strip_tags(trim((string)$value)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($data['from_name']  ?? '');
$email   = clean($data['from_email'] ?? '');
$phone   = clean($data['phone']      ?? '');
$subject = clean($data['subject']    ?? '');
$message = clean($data['message']    ?? '');

// ── VALIDATION ──────────────────────────────────────────
$errors = [];

if (empty($name))    $errors[] = 'Name is required.';
if (empty($email))   $errors[] = 'Email is required.';
if (empty($message)) $errors[] = 'Message is required.';

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address.';
}

// Basic spam check — honeypot field (if JS sends a 'website' field, it's a bot)
if (!empty($data['website'])) {
    http_response_code(200); // Return success to fool bots
    echo json_encode(['ok' => true]);
    exit;
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => implode(' ', $errors)]);
    exit;
}

// ── BUILD EMAIL ─────────────────────────────────────────
$mail_subject = '[' . $site_name . '] New Enquiry: ' . ($subject ?: 'General');

$mail_body  = "You have received a new message from your website contact form.\n";
$mail_body .= str_repeat('-', 50) . "\n\n";
$mail_body .= "Name:    {$name}\n";
$mail_body .= "Email:   {$email}\n";
$mail_body .= "Phone:   " . ($phone ?: 'Not provided') . "\n";
$mail_body .= "Subject: " . ($subject ?: 'General Enquiry') . "\n\n";
$mail_body .= "Message:\n{$message}\n\n";
$mail_body .= str_repeat('-', 50) . "\n";
$mail_body .= "Sent from: {$site_name} website\n";
$mail_body .= "Reply directly to this email to respond to {$name}.\n";

// Headers — sets Reply-To so you can hit reply in Gmail to answer the customer
$headers  = "From: {$site_name} <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'signhere.ca') . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// ── SEND ────────────────────────────────────────────────
$sent = mail($recipient, $mail_subject, $mail_body, $headers);

if ($sent) {
    http_response_code(200);
    echo json_encode(['ok' => true]);
} else {
    // mail() failed — likely server not configured for outgoing mail
    // Ask your host to enable PHP mail() or use SMTP (see README)
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Mail server error. Please contact us directly at ' . $recipient
    ]);
}
