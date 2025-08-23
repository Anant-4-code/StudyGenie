const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message content
 * @returns {Promise}
 */
const sendEmail = async (options) => {
  try {
    // If in development, log the email instead of sending it
    if (process.env.NODE_ENV === 'development') {
      console.log('===== EMAIL NOT SENT (DEV MODE) =====');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Message:', options.message);
      console.log('====================================');
      return { message: 'Email logged (dev mode)' };
    }

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'StudyGenie'}" <${process.env.EMAIL_FROM_ADDRESS || 'no-reply@studygenie.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.message, // You can also send HTML emails
    });

    console.log('Message sent: %s', info.messageId);
    return { message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
