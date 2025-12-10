import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).send({ error: "Monto inválido para el pago." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/send-invoice", async (req, res) => {
  try {
    const { email, order, html } = req.body;

    if (!email || !order) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const items = Array.isArray(order) ? order : (order.items || []);

    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("error", (err) => {
      console.error("Error generando PDF:", err);
    });

    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Cafetería Vitte Coffee" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Factura de tu compra",
          text: "Gracias por tu compra. Adjuntamos la factura en PDF.",
          attachments: [
            {
              filename: "factura.pdf",
              content: pdfData,
            },
          ],
        };

        if (html) mailOptions.html = html;

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });
      } catch (mailErr) {
        console.error("Error enviando correo:", mailErr);
        return res.status(500).json({ error: "Error enviando correo" });
      }
    });

    
    doc.fontSize(20).text("Cafetería Vitte Coffee", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Fecha: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Detalles del pedido:");
    doc.moveDown();

    
    doc.fontSize(12);
    const startX = doc.x;
    doc.text("Producto", startX, doc.y, { continued: true, width: 260 });
    doc.text("Cant.", { continued: true, width: 60, align: "center" });
    doc.text("Precio/u", { continued: true, width: 80, align: "right" });
    doc.text("Subtotal", { align: "right" });
    doc.moveDown(0.5);

    let total = 0;
    items.forEach((item) => {
      const name = item.name || item.title || "Producto";
      const qty = item.quantity || item.qty || 1;
      const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
      const subtotal = price * qty;
      total += subtotal;

      doc.text(name, { continued: true, width: 260 });
      doc.text(String(qty), { continued: true, width: 60, align: "center" });
      doc.text(`$${price.toFixed(2)}`, { continued: true, width: 80, align: "right" });
      doc.text(`$${subtotal.toFixed(2)}`, { align: "right" });
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error general en /api/send-invoice:", error);
    res.status(500).json({ error: "Error procesando la solicitud" });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
