import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// public route: create contact
router.post("/", async (req, res) => {
  try {
    const { name, phone, message, source } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ msg: "Thiếu tên hoặc số điện thoại" });
    }

    const contact = new Contact({ name, phone, message, source });
    await contact.save();

    // gửi email thông báo admin (non-blocking)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailHtml = `
        <h3>Yêu cầu liên hệ mới từ website</h3>
        <p><strong>Tên:</strong> ${name}</p>
        <p><strong>SĐT:</strong> ${phone}</p>
        <p><strong>Nguồn:</strong> ${source || "form contact"}</p>
        <p><strong>Ghi chú:</strong><br/> ${message ? message.replace(/\n/g,'<br/>') : ""}</p>
        <p>Thời gian: ${new Date().toLocaleString("vi-VN")}</p>
      `;

      await transporter.sendMail({
        from: `"VinTechCare" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `Yêu cầu liên hệ từ ${name} — ${phone}`,
        html: mailHtml,
      });
    } catch (mailErr) {
      console.error("Mail send error:", mailErr);
      // không trả lỗi cho client vì contact đã lưu
    }

    res.json({ msg: "Gửi liên hệ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Lỗi server" });
  }
});

// ADMIN: lấy danh sách contact (cần auth)
import jwt from "jsonwebtoken";
const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Không có token" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token không hợp lệ" });
  }
};

// lấy tất cả contact
router.get("/", auth, async (req, res) => {
  const list = await Contact.find().sort({ createdAt: -1 });
  res.json(list);
});

// đánh dấu đã xử lý
router.put("/handled/:id", auth, async (req, res) => {
  try {
    const c = await Contact.findByIdAndUpdate(
      req.params.id,
      { handled: true },
      { new: true }
    );
    res.json({ msg: "Đã cập nhật", contact: c });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
