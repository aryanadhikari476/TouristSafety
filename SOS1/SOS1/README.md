## SOS Button - React + Node + Firebase + Nodemailer + Twilio

### Prerequisites
- Node 18+
- Firebase project + Admin SDK service account JSON
- SMTP account (e.g. Gmail app password) and Twilio credentials

### 1) Client setup
Create `client/.env`:

```
VITE_API_BASE=http://localhost:4000
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
```

Run client:

```
cd client
npm install
npm run dev
```

### 2) Server setup
Create `server/.env`:

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

Place your Firebase Admin JSON at `server/firebase-service-account.json` or update the path.

Install and run server:

```
cd server
npm install
npm run dev
```

### Flow
1. First time click on SOS → navigates to Setup page to collect email + phone and save to Firestore.
2. Subsequent clicks → captures `navigator.geolocation` and posts to `/sos`.
3. Server reads user info from Firestore, emails via Nodemailer, and sends SMS via Twilio with a Google Maps link.






