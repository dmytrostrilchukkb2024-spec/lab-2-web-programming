require('dotenv').config();
const { feathers } = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const nodemailer = require('nodemailer');

const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роздаємо папку public
app.use('/', express.static('public'));

// SMTP Налаштування
const transporter = nodemailer.createTransport({
    host: process.env.MAILJET_HOST,
    port: 587,
    secure: false, 
    auth: {
        user: process.env.MAILJET_USER,
        pass: process.env.MAILJET_PASS
    }
});

// Ендпоінт для форми
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Заповніть усі поля!' });
    }

    try {
        const mailOptions = {
            from: process.env.FROM_EMAIL, 
            to: process.env.TO_EMAIL,     
            replyTo: email,               
            subject: subject,
            text: `Нове повідомлення із форми сайту!\n\nВід кого: ${name}\nEmail відправника: ${email}\n\nТекст повідомлення:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Лист успішно надіслано на пошту студента!' });
    } catch (error) {
        console.error('Помилка відправки пошти:', error);
        res.status(500).json({ error: 'Помилка на сервері при спробі відправити лист.' });
    }
});

app.use(express.errorHandler());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` Локальний сервер запущено: http://localhost:${PORT}`);
    console.log(`===================================================`);
});