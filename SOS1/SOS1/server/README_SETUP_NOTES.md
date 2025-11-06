Server env (.env in `server`):

```
PORT=4000
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=your@gmail.com

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567
```

Place your Firebase Admin SDK JSON at `server/firebase-service-account.json` and reference via `FIREBASE_SERVICE_ACCOUNT_PATH`.



