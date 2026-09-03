const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const databaseService = require('./databaseService');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  try {
    const settings = await databaseService.client.siteSettings.findOne({});
    const smtpHost = settings?.smtp_host || process.env.SMTP_HOST;
    const smtpPort = settings?.smtp_port || process.env.SMTP_PORT || 587;
    const smtpUsername = settings?.smtp_username || process.env.SMTP_USERNAME;
    const smtpPassword = settings?.smtp_password || process.env.SMTP_PASSWORD;
    const senderEmail = settings?.sender_email || process.env.SENDER_EMAIL;

    if (!smtpHost || !smtpUsername || !smtpPassword) {
      logger.warn('SMTP not configured. Emails will be logged to console.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    return transporter;
  } catch (error) {
    logger.error('Failed to create email transporter', { error: error.message });
    return null;
  }
}

const emailService = {
  async sendOtpEmail({ to, userName, otpCode, expiresInMinutes = 10 }) {
    const subject = 'FitPulse - Your OTP Verification Code';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 500px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #3b82f6, #10b981); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">FitPulse</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Email Verification</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Hello ${userName || 'User'},</p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Your One-Time Password (OTP) for booking verification is:
            </p>
            <div style="background: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: 800; color: #059669; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otpCode}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">
              This code expires in <strong style="color: #374151;">${expiresInMinutes} minutes</strong>. Do not share this code with anyone.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              If you did not request this code, please ignore this email or contact support.
            </p>
          </div>
          <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              &copy; ${new Date().getFullYear()} FitPulse. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Your OTP for booking verification is: ${otpCode}. This code expires in ${expiresInMinutes} minutes.`;

    try {
      const transport = await getTransporter();
      const senderEmail = process.env.SENDER_EMAIL || 'noreply@fitpulse.com';

      if (!transport) {
        logger.info('[DEV MODE] OTP Email (not sent, logged):', {
          to,
          subject,
          otpCode,
          expiresInMinutes,
        });
        return { success: true, mode: 'console' };
      }

      await transport.sendMail({
        from: `"FitPulse" <${senderEmail}>`,
        to,
        subject,
        text,
        html,
      });

      logger.info('OTP email sent', { to, subject });
      return { success: true, mode: 'email' };
    } catch (error) {
      logger.error('Failed to send OTP email', { to, error: error.message });
      return { success: false, error: error.message };
    }
  },

  async sendBookingConfirmation({ to, userName, bookingDetails }) {
    const subject = 'FitPulse - Booking Confirmed!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #f8fafc;">
        <div style="max-width: 500px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #3b82f6, #10b981); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">FitPulse</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Booking Confirmed</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 15px;">Hello ${userName},</p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Your booking has been confirmed! Here are the details:
            </p>
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 16px 0;">
              <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Service:</strong> ${bookingDetails.serviceName || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Date:</strong> ${bookingDetails.date || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Time:</strong> ${bookingDetails.time || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Status:</strong> Confirmed</p>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} FitPulse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const transport = await getTransporter();
      const senderEmail = process.env.SENDER_EMAIL || 'noreply@fitpulse.com';

      if (!transport) {
        logger.info('[DEV MODE] Booking confirmation email (not sent, logged):', { to, subject });
        return { success: true, mode: 'console' };
      }

      await transport.sendMail({
        from: `"FitPulse" <${senderEmail}>`,
        to,
        subject,
        html,
      });

      logger.info('Booking confirmation email sent', { to });
      return { success: true, mode: 'email' };
    } catch (error) {
      logger.error('Failed to send booking confirmation email', { to, error: error.message });
      return { success: false, error: error.message };
    }
  },
};

module.exports = emailService;
