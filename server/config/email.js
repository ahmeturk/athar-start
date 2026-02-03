import nodemailer from 'nodemailer';

let transporter = null;

export const getTransporter = () => {
  if (!transporter) {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.warn('⚠️ Email not configured - SMTP credentials missing');
      return null;
    }
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    console.log(`📧 [DEV] Email would be sent to: ${to} | Subject: ${subject}`);
    return { dev: true };
  }

  return t.sendMail({
    from: `"أثر البداية" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
