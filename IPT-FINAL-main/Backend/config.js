module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'IPT-FINAL-PROJECT'
    },
    secret: process.env.JWT_SECRET || 'terces',
    emailFrom: process.env.EMAIL_FROM || 'info@node-mysql-signup-verification-api.com',
    smtpOptions: {
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    }
}; 