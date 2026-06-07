import nodemailer from 'nodemailer';

// Only create the transporter if SMTP is configured.
// In dev, if SMTP_* env vars are missing, we just log emails to console
// instead of sending them.
const isConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

let transporter = null;

if (isConfigured) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: false, // false for port 587 (uses STARTTLS); true for port 465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Verify the connection on startup (non-blocking).
    transporter.verify((err) => {
        if (err) {
            console.error('SMTP verify failed:', err.message);
        } else {
            console.log('SMTP ready to send emails');
        }
    });
} else {
    console.warn(
        'SMTP not configured — emails will be logged to console only. ' +
        'Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env to enable sending.'
    );
}

/**
 * Build a simple HTML wrapper around message content.
 * Keeps emails visually consistent without a full templating engine.
 */
const wrapHtml = (subject, body) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 20px auto; padding: 20px;">
    <h2 style="color: #1F4E79;">${subject}</h2>
    <div>${body}</div>
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;" />
    <p style="font-size: 12px; color: #888;">FieldSync — automated message, do not reply.</p>
  </body>
</html>
`;

/**
 * Convert simple HTML to plain text fallback.
 * Strips tags and tidies whitespace.
 */
const toPlainText = (html) =>
    html
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

/**
 * Pre-built templates for the three notification types.
 * Each returns { subject, html }.
 */
const templates = {
    job_assigned: ({ technicianName, jobTitle, jobLocation }) => ({
        subject: 'New job assigned',
        html: `
            <p>Hi ${technicianName},</p>
            <p>A new job has been assigned to you:</p>
            <p><strong>${jobTitle}</strong><br/>Location: ${jobLocation}</p>
            <p>Log in to FieldSync to view the details.</p>
        `,
    }),

    status_updated: ({ jobTitle, newStatus, recipientName }) => ({
        subject: `Job status updated: ${jobTitle}`,
        html: `
            <p>Hi ${recipientName},</p>
            <p>The status of <strong>${jobTitle}</strong> has been updated to <strong>${newStatus}</strong>.</p>
            <p>Log in to FieldSync for more details.</p>
        `,
    }),

    system_alert: ({ recipientName, message }) => ({
        subject: 'FieldSync system alert',
        html: `
            <p>Hi ${recipientName},</p>
            <p>${message}</p>
        `,
    }),
};

/**
 * Send an email using a named template.
 *
 * @param {string} to - Recipient email address
 * @param {string} templateName - One of: 'job_assigned', 'status_updated', 'system_alert'
 * @param {object} data - Template-specific data
 * @returns {Promise<boolean>} true if sent (or logged in dev), false on failure
 */
export const sendEmail = async (to, templateName, data) => {
    const template = templates[templateName];
    if (!template) {
        console.error(`Unknown email template: ${templateName}`);
        return false;
    }

    const { subject, html: bodyHtml } = template(data);
    const html = wrapHtml(subject, bodyHtml);
    const text = toPlainText(html);

    // Dev mode — log to console instead of sending
    if (!isConfigured) {
        console.log('--- EMAIL (dev mode, not sent) ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
        console.log('--- END EMAIL ---');
        return true;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
            html,
        });
        return true;
    } catch (err) {
        // Don't crash the caller — just log and report failure.
        // The mutation that triggered this should still succeed.
        console.error(`Failed to send email to ${to}:`, err.message);
        return false;
    }
};