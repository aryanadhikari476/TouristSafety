"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Utility: send email via MailerSend first, then fall back to SMTP with detailed logging
async function sendEmailTo(recipientEmail, subject, textBody, htmlBody) {
    const mailerSendKey = process.env.MAILERSEND_API_KEY;
    const mailerFromEmail = process.env.MAILERSEND_FROM_EMAIL;
    const mailerFromName = process.env.MAILERSEND_FROM_NAME || 'SOS App';
    // Try MailerSend if configured
    if (mailerSendKey && mailerFromEmail) {
        try {
            const resp = await fetch('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${mailerSendKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: { email: mailerFromEmail, name: mailerFromName },
                    to: [{ email: recipientEmail }],
                    subject,
                    text: textBody,
                    html: htmlBody ?? undefined,
                }),
            });
            const bodyText = await resp.text();
            if (!resp.ok) {
                console.warn('MailerSend failed:', resp.status, bodyText);
            }
            else {
                console.log('MailerSend success:', bodyText);
                return;
            }
        }
        catch (err) {
            console.warn('MailerSend error:', err);
        }
    }
    // Fallback to SMTP if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                requireTLS: process.env.SMTP_SECURE !== 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            const info = await transporter.sendMail({
                from: process.env.MAIL_FROM || process.env.SMTP_USER,
                to: recipientEmail,
                subject,
                text: textBody,
                html: htmlBody,
            });
            console.log('SMTP success:', info && (info.messageId || info));
            return;
        }
        catch (err) {
            console.warn('SMTP error:', err);
        }
    }
    console.warn('No email provider configured or all providers failed');
}
// Initialize Firebase Admin using a service account JSON
// Place your service account JSON under server/firebase-service-account.json and set FIREBASE_SERVICE_ACCOUNT_PATH
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
let db = null;
try {
    if (!firebase_admin_1.default.apps.length) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(serviceAccountPath);
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
        });
    }
    db = firebase_admin_1.default.firestore();
}
catch (err) {
    console.warn('Firebase Admin not initialized. Falling back to file storage for user data.');
}
// Fallback file-based storage when Firebase is not configured
const DATA_FILE = process.env.DATA_FILE || path_1.default.join(__dirname, '..', 'data', 'user.json');
async function ensureDataDir() {
    const dir = path_1.default.dirname(DATA_FILE);
    try {
        await fs_1.promises.mkdir(dir, { recursive: true });
    }
    catch { }
}
async function saveUserLocal(user) {
    await ensureDataDir();
    await fs_1.promises.writeFile(DATA_FILE, JSON.stringify(user, null, 2), 'utf8');
}
async function loadUserLocal() {
    try {
        const raw = await fs_1.promises.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed?.email && parsed?.phone)
            return parsed;
        return null;
    }
    catch {
        return null;
    }
}
// Health check
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
// Simple test route to validate email delivery and see detailed logs
app.get('/test-email', async (_req, res) => {
    try {
        let recipient = process.env.SMTP_USER || 'test@example.com';
        try {
            const local = await loadUserLocal();
            if (local?.email)
                recipient = local.email;
        }
        catch { }
        await sendEmailTo(recipient, 'Test Email - SOS Server', 'This is a test email from SOS server.', '<p>This is a <strong>test</strong> email from SOS server.</p>');
        res.json({ ok: true, to: recipient });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false });
    }
});
// Read current saved user (for editing)
app.get('/user', async (_req, res) => {
    try {
        if (db) {
            const snap = await db.collection('users').doc('singleUser').get();
            if (!snap.exists)
                return res.json({ email: '', phone: '' });
            return res.json(snap.data());
        }
        else {
            const local = await loadUserLocal();
            return res.json(local ?? { email: '', phone: '' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load user' });
    }
});
// For demo, user info is stored under users/singleUser
app.post('/save-user', async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!email || !phone)
            return res.status(400).json({ error: 'Missing email or phone' });
        if (db) {
            await db.collection('users').doc('singleUser').set({ email, phone });
        }
        else {
            await saveUserLocal({ email, phone });
        }
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save user' });
    }
});
app.post('/sos', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }
        let email, phone;
        if (db) {
            const userDoc = await db.collection('users').doc('singleUser').get();
            if (!userDoc.exists)
                return res.status(404).json({ error: 'No user profile saved' });
            const data = userDoc.data();
            email = data.email;
            phone = data.phone;
        }
        else {
            const local = await loadUserLocal();
            if (!local)
                return res.status(404).json({ error: 'No user profile saved' });
            email = local.email;
            phone = local.phone;
        }
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        // Send email using helper with detailed logging
        await sendEmailTo(email, 'SOS Alert - Live Location', `Emergency! My live location: ${latitude},${longitude} - ${mapsLink}`, `<p><strong>Emergency!</strong></p><p>My live location: <a href="${mapsLink}">${latitude}, ${longitude}</a></p>`);
        // Send SMS via Twilio (if configured) OR Fast2SMS (if configured)
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_PHONE_NUMBER;
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
        const fast2ApiKey = process.env.FAST2SMS_API_KEY;
        const fast2Route = (process.env.FAST2SMS_ROUTE || 'q').trim(); // q (Quick) or dlt or dlt_manual
        const fast2Sender = process.env.FAST2SMS_SENDER_ID; // required for dlt/dlt_manual
        const fast2MessageId = process.env.FAST2SMS_MESSAGE_ID; // required for dlt
        const fast2TemplateValues = process.env.FAST2SMS_TEMPLATE_VALUES; // pipe-separated for dlt
        const fast2TemplateId = process.env.FAST2SMS_TEMPLATE_ID; // required for dlt_manual
        const fast2EntityId = process.env.FAST2SMS_ENTITY_ID; // required for dlt_manual
        // Prefer Fast2SMS if API key present; else try Twilio
        if (fast2ApiKey) {
            try {
                // Build message text or params
                const plainText = `SOS! Location: ${mapsLink} (${latitude}, ${longitude})`;
                // Fast2SMS expects Indian numbers; remove leading + and country code if present
                const normalizeForFast2 = (num) => {
                    const digits = (num || '').replace(/\D/g, '');
                    return digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;
                };
                const numbers = normalizeForFast2(phone);
                const baseUrl = 'https://www.fast2sms.com/dev/bulkV2';
                let url = baseUrl;
                const headers = { 'authorization': fast2ApiKey };
                let usePostForm = false;
                let body;
                if (fast2Route === 'dlt') {
                    // DLT: requires sender_id, message (message_id), variables_values, route=dlt
                    const params = new URLSearchParams();
                    params.set('sender_id', fast2Sender || '');
                    params.set('message', fast2MessageId || '');
                    if (fast2TemplateValues)
                        params.set('variables_values', fast2TemplateValues);
                    params.set('route', 'dlt');
                    params.set('numbers', numbers);
                    // Send as GET with auth in query or POST with header. We'll use POST + header.
                    url = baseUrl;
                    usePostForm = true;
                    body = params;
                }
                else if (fast2Route === 'dlt_manual') {
                    const params = new URLSearchParams();
                    params.set('sender_id', fast2Sender || '');
                    params.set('message', plainText);
                    params.set('template_id', fast2TemplateId || '');
                    params.set('entity_id', fast2EntityId || '');
                    params.set('route', 'dlt_manual');
                    params.set('numbers', numbers);
                    url = baseUrl;
                    usePostForm = true;
                    body = params;
                }
                else {
                    // Quick route "q" with plain text
                    const params = new URLSearchParams();
                    params.set('message', plainText);
                    params.set('language', 'english');
                    params.set('route', 'q');
                    params.set('numbers', numbers);
                    url = baseUrl;
                    usePostForm = true;
                    body = params;
                }
                const fetchOpts = {
                    method: usePostForm ? 'POST' : 'GET',
                    headers,
                };
                if (usePostForm && body) {
                    fetchOpts.body = body;
                }
                const resp = await fetch(url, fetchOpts);
                const data = await resp.json().catch(() => ({}));
                if (!resp.ok || data.return === false) {
                    console.warn('Fast2SMS send failed:', data);
                }
            }
            catch (e) {
                console.warn('Fast2SMS error:', e);
            }
        }
        else {
            try {
                if (!accountSid || !authToken) {
                    console.warn('Twilio not configured, skipping SMS');
                }
                else {
                    const client = (0, twilio_1.default)(accountSid, authToken);
                    const payload = {
                        to: phone,
                        body: `SOS! Location: ${mapsLink} (${latitude}, ${longitude})`,
                    };
                    if (messagingServiceSid) {
                        payload.messagingServiceSid = messagingServiceSid;
                    }
                    else if (from) {
                        payload.from = from;
                    }
                    else {
                        console.warn('No Twilio from number or Messaging Service SID provided; skipping SMS');
                    }
                    if (payload.messagingServiceSid || payload.from) {
                        await client.messages.create(payload);
                    }
                }
            }
            catch (smsErr) {
                console.warn('SMS send failed:', smsErr);
            }
        }
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        // Still return ok to keep UX smooth even if part of the process failed
        res.json({ ok: true });
    }
});
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map