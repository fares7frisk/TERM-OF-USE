console.log("بدأ تشغيل الخادم...");

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json()); // لمعالجة بيانات JSON من العميل

// خدمة الصفحة التي تحتوي على الشروط
app.get('/', (req, res) => {
    console.log('تم تحميل الصفحة الرئيسية');
    res.sendFile(__dirname + '/index.html'); // تأكد من أن index.html موجود في نفس المجلد
});

// حفظ البيانات في ملف نصي عند إرسال البيانات من المتصفح
app.post('/save-info', (req, res) => {
    console.log('تم استقبال البيانات في الخادم');
    const { userAgent, language, timestamp } = req.body;
    const ip = req.socket.remoteAddress; // الحصول على الـ IP

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
            console.error('❌ حدث خطأ أثناء حفظ البيانات:', err);
            return res.status(500).json({ message: '❌ حدث خطأ أثناء حفظ البيانات' });
        }
        console.log('✅ تم حفظ البيانات بنجاح');
        res.json({ message: '✅ تم حفظ البيانات بنجاح!' });
    });
});

// بدء السيرفر على المنفذ 3000
app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});
