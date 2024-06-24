let email

if (process.env.NODE_ENV === 'production') {
    email = {
        fromName: 'Tech Heavens',
        fromAddress: 'dennisdennoh62@gmail.com',
        transportOptions: {
            host: process.env.SMTP_HOST,
            // service: 'gmail',

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            port: 587,
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