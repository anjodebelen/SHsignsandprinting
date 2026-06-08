<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Sanitize inputs
$fullname = isset($_POST['fullname']) ? htmlspecialchars(trim($_POST['fullname'])) : '';
$email    = isset($_POST['email'])    ? htmlspecialchars(trim($_POST['email']))    : '';
$phone    = isset($_POST['phone'])    ? htmlspecialchars(trim($_POST['phone']))    : 'Not provided';
$service  = isset($_POST['service'])  ? htmlspecialchars(trim($_POST['service']))  : 'Not specified';
$message  = isset($_POST['message'])  ? htmlspecialchars(trim($_POST['message']))  : '';

// Server-side validation
if (empty($fullname) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Build email
$to      = 'addesign.creatives@gmail.com';
$subject = 'New Website Enquiry — ' . $service;
$body    = "Full Name:            $fullname\r\n"
         . "Email Address:        $email\r\n"
         . "Phone Number:         $phone\r\n"
         . "Service Interested In: $service\r\n\r\n"
         . "Message:\r\n$message";

$headers  = "From: noreply@signheresigns.ca\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail server error. Please try again or call 306-773-8850.']);
}
