import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER – chỉ dùng 1 lần để tạo admin
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, secret } = req.body;

//     // 🔐 khóa bằng secret
//     if (secret !== process.env.ADMIN_SECRET) {
//       return res.status(403).json({ msg: "Không có quyền" });
//     }

//     const checkUser = await User.findOne({ username });
//     if (checkUser) {
//       return res.status(400).json({ msg: "User đã tồn tại" });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       password: hash,
//     });

//     await newUser.save();

//     res.json({ msg: "Tạo admin thành công" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Sai tài khoản" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// CHECK TOKEN (verify)
router.get("/verify", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Không có token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(400).json({ valid: false });
  }
});

export default router;
