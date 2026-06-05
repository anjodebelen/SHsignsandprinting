# Contact Form Setup — Pure PHP (No Third-Party Services)

## How it works
When a visitor submits the form, `js/main.js` sends the data to `mail.php`,
which uses PHP's built-in `mail()` function to email you directly.
No accounts, no APIs, no monthly limits.

---

## ⚠️ GitHub Pages won't work for this
GitHub Pages only serves static files — it cannot run PHP.
You need a web host that supports PHP (virtually all paid hosts do).

---

## Recommended free/cheap hosts that support PHP

| Host | Cost | Notes |
|------|------|-------|
| **InfinityFree** | Free | infinityfree.com — PHP + MySQL, free forever |
| **Hostinger** | ~$3/mo | Fast, reliable, easy cPanel |
| **Namecheap** | ~$2/mo | Good support |
| **000webhost** | Free | Basic, good for testing |

---

## Deployment steps

1. **Upload all files** to your host's `public_html` folder
   (including `mail.php` in the root, same level as `index.html`)

2. **That's it.** The form will work immediately on PHP hosts.

---

## If emails are not arriving

Some hosts disable `mail()` by default. Two options:

### Option A — Ask your host to enable mail()
Contact support and ask: *"Can you enable PHP mail() on my account?"*
Most hosts will do this immediately.

### Option B — Use SMTP instead of mail() (more reliable)
Replace the `mail(...)` call in `mail.php` with PHPMailer + SMTP:

1. Download PHPMailer: https://github.com/PHPMailer/PHPMailer
2. Upload the `src/` folder to your host
3. Replace the `mail()` section in `mail.php` with:

```php
use PHPMailer\PHPMailer\PHPMailer;
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';
require '../PHPMailer/src/Exception.php';

$mailer = new PHPMailer(true);
$mailer->isSMTP();
$mailer->Host       = 'smtp.gmail.com';
$mailer->SMTPAuth   = true;
$mailer->Username   = 'addesign.creatives@gmail.com';
$mailer->Password   = 'YOUR_APP_PASSWORD'; // Gmail App Password (not your login password)
$mailer->SMTPSecure = 'tls';
$mailer->Port       = 587;
$mailer->setFrom('addesign.creatives@gmail.com', 'Sign Here Website');
$mailer->addAddress('addesign.creatives@gmail.com');
$mailer->addReplyTo($email, $name);
$mailer->Subject = $mail_subject;
$mailer->Body    = $mail_body;
$sent = $mailer->send();
```

For Gmail App Password:
→ myaccount.google.com → Security → 2-Step Verification → App Passwords
→ Create one for "Mail" → paste it as YOUR_APP_PASSWORD above

---

## File structure
```
public_html/
├── index.html
├── mail.php          ← handles form submissions
├── css/
├── js/
├── images/
└── pages/
    ├── contact.html
    ├── services.html
    ├── about.html
    └── work.html
```
