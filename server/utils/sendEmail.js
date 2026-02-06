const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For production, use service like Gmail, SendGrid, etc.
    // For development, we can use Ethereal or just log to console if creds are missing.

    let transporter;

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    } else {
        // Fallback for development/demo: log to console
        console.log('--- EMAIL SIMULATION ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('------------------------');
        return;
    }

    const mailOptions = {
        from: `Intelligent Resume System <${process.env.EMAIL_FROM || 'no-reply@resumesystem.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
