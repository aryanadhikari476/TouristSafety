<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // PHPMailer installed via Composer

function sendConfirmationEmail($toEmail, $toName) {
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'aryanadhikari.476@gmail.com';       // your email
        $mail->Password   = 'your_app_password_here';          // Use Gmail App Password (not regular password)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('aryanadhikari.476@gmail.com', 'Your App Name');
        $mail->addAddress($toEmail, $toName);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Welcome to Our App!';
        $mail->Body    = "
            <html>
            <body>
                <h2>Welcome to Our App!</h2>
                <p>Hi $toName,</p>
                <p>Thank you for registering at our website!</p>
                <p>Your account has been successfully created with the email: <strong>$toEmail</strong></p>
                <p>You can now log in and start using our services.</p>
                <br>
                <p>Best regards,<br>Your App Team</p>
            </body>
            </html>
        ";
        $mail->AltBody = "Hi $toName, Thank you for registering at our website! Your account has been successfully created.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
