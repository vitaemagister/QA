import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

// Отримуємо налаштування SMTP із змінних оточення або ставимо дефолтні
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 1025;

// Локальний транспортер (MailHog)
const localTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false
});

// Gmail транспортер (для відправки через Gmail)
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // App Password from Google Account
  }
});

// Endpoint для надсилання листа через MailHog (локально)
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: 'Missing required fields: to, subject' });
  }

  try {
    const info = await localTransporter.sendMail({
      from: '"QA Test" <qa@test.com>',
      to,
      subject,
      text,
      html
    });
    res.json({ message: 'Email sent to MailHog', info });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Email send failed' });
  }
});

// Endpoint для надсилання листа через Gmail (глобально)
app.post('/send-email-gmail', async (req, res) => {
  const { to, subject, text, html, from } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: 'Missing required fields: to, subject' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ 
      error: 'Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD' 
    });
  }

  try {
    const info = await gmailTransporter.sendMail({
      from: from || process.env.GMAIL_USER,
      to,
      subject,
      text,
      html
    });
    res.json({ message: 'Email sent via Gmail', messageId: info.messageId });
  } catch (err) {
    console.error('Error sending email via Gmail:', err);
    res.status(500).json({ error: 'Gmail send failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
