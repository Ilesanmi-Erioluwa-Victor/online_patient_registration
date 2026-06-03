import nodemailer from 'nodemailer';

const emailConfigured = Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER);

export const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    })
  : null;

export const sendMail = async ({ to, subject, html }) => {
  if (!to || !transporter) return;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.warn(`Email skipped: ${error.message}`);
  }
};
