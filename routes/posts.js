import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware check token
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

// TẠO BÀI VIẾT
router.post("/", auth, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.json({ msg: "Tạo bài viết thành công", post: newPost });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// LẤY TẤT CẢ BÀI VIẾT
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// LẤY BÀI VIẾT THEO ID (dùng cho ADMIN EDIT)
router.get("/by-id/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Không tìm thấy bài viết" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// LẤY BÀI VIẾT THEO SLUG (dùng cho trang khách sau này)
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ msg: "Không tìm thấy bài viết" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// SỬA BÀI VIẾT
router.put("/:id", auth, async (req, res) => {
  try {
    const update = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Đã cập nhật", post: update });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// XÓA BÀI VIẾT
router.delete("/:id", auth, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Đã xóa bài viết" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
