<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $to = "addesign.creatives@gmail.com";

    $fullname = htmlspecialchars($_POST['fullname']);
    $email    = htmlspecialchars($_POST['email']);
    $phone    = htmlspecialchars($_POST['phone']);
    $service  = htmlspecialchars($_POST['service']);
    $message  = htmlspecialchars($_POST['message']);

    $subject = "New Website Inquiry - " . $service;

    $body = "
    Full Name: $fullname

    Email Address: $email

    Phone Number: $phone

    Service Interested In: $service

    Message:
    $message
    ";

    $headers  = "From: noreply@yourdomain.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "<h2>Thank you!</h2>";
        echo "<p>Your message has been sent successfully.</p>";
    } else {
        echo "<h2>Error</h2>";
        echo "<p>Unable to send message. Please try again later.</p>";
    }
}
?>