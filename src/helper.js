import nodemailer from 'nodemailer';

const helper = {
    pathUploads: `${process.cwd()}/public`,

    generateTimestampFormat(unixTimestamp) {
       const date = new Date(Number(unixTimestamp));

       // YYYY-MM-DD HH:II:SS
       return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)}`;
    },

    generateDateFormat(dateString) {
        const date = new Date(dateString);

        return `${date.getDate().toString().padStart(2, 0)}-${(date.getMonth()+1).toString().padStart(2, 0)}-${date.getFullYear()}`;
    },

    generateTimeFormat(dateString) {
        const date = new Date(dateString);

        return `${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)}`;
    },

    async sendEmail(subject, destination, message) {
        try {
            let transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });
        
            await transporter.sendMail({
                from: `"${process.env.SMTP_FROM} " <${process.env.SMTP_USER}>`,
                to: destination,
                subject: subject,
                html: message
            });

            return true;
        } catch (error) {
            return false;
        }
    },
};

export default helper;