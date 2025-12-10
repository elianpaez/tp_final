const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
    const { email, html } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Cafetería" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Tu factura de compra",
            html: html
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Error enviando factura:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
