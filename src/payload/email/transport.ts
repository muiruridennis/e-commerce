let email
if (process.env.NODE_ENV === 'production') {
    email = {
        fromName: 'Tech Heavens',
        fromAddress: 'admin@example.com',
        transportOptions: {
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            port: process.env.SMTP_PORT || 587,
            secure: false,
        }
    }

} else {
    email = {
        fromName: 'Ethereal Email',
        fromAddress: 'example@ethereal.com',
        logMockCredentials: true,
    }
}

export default email