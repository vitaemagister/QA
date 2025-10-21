import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

// Отримуємо налаштування SMTP із змінних оточення або ставимо дефолтні
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 1025;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false
});

// Endpoint для надсилання листа
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: 'Missing required fields: to, subject' });
  }

  try {
    const info = await transporter.sendMail({
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
