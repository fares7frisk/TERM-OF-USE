const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

// السماح بطلبات CORS
app.use(cors());
app.use(express.json());

// خدمة الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// تسجيل بيانات المستخدم
app.post('/save-info', (req, res) => {
    console.log('📥 تم استقبال البيانات');

    const { userAgent, language, timestamp } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!userAgent || !language || !timestamp) {
        return res.status(400).json({ message: '❌ بيانات غير كافية' });
    }

    const logEntry = `
    ------------------------------
    📌 IP: ${ip}
    🌐 المتصفح: ${userAgent}
    🗣 اللغة: ${language}
    ⏳ الوقت: ${timestamp}
    ------------------------------
    `;

    fs.appendFile('user_data.txt', logEntry, (err) => {
        if (err) {
            return res.status(500).json({ message: '❌ فشل حفظ البيانات' });
        }
        res.json({ message: '✅ تم الحفظ بنجاح!' });
    });
});

// تصدير التطبيق ليعمل على Vercel
module.exports = app;
