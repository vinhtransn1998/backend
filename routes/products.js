// backend/routes/products.js
import express from "express";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware check token (tái dùng cho admin)
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

// Tạo sản phẩm (ADMIN)
router.post("/", auth, async (req, res) => {
  try {
    const prod = new Product(req.body);
    await prod.save();
    res.json({ msg: "Tạo sản phẩm thành công", product: prod });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Lấy tất cả sản phẩm (CLIENT + ADMIN)
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Lấy sản phẩm theo ID (ADMIN edit)
router.get("/by-id/:id", auth, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ msg: "Không tìm thấy sản phẩm" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Lấy sản phẩm theo slug (CLIENT – nếu sau này cần trang chi tiết)
router.get("/slug/:slug", async (req, res) => {
  try {
    const prod = await Product.findOne({ slug: req.params.slug });
    if (!prod) return res.status(404).json({ msg: "Không tìm thấy sản phẩm" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Sửa sản phẩm (ADMIN)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ msg: "Đã cập nhật sản phẩm", product: updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Xoá sản phẩm (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Đã xoá sản phẩm" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
