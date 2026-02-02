// backend/routes/services.js
import express from "express";
import Service from "../models/Service.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// middleware auth giống route products (reuse)
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

// Create (admin)
router.post("/", auth, async (req, res) => {
  try {
    const s = new Service(req.body);
    await s.save();
    res.json({ msg: "Tạo service thành công", service: s });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all (client)
router.get("/", async (req, res) => {
  try {
    const list = await Service.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get by id (admin)
router.get("/by-id/:id", auth, async (req, res) => {
  try {
    const s = await Service.findById(req.params.id);
    if (!s) return res.status(404).json({ msg: "Không tìm thấy" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get by slug (client detail)
router.get("/slug/:slug", async (req, res) => {
  try {
    const s = await Service.findOne({ slug: req.params.slug });
    if (!s) return res.status(404).json({ msg: "Không tìm thấy" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Cập nhật thành công", service: updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete (admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: "Đã xóa service" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
