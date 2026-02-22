// backend/models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDesc: { type: String, required: true },
    details: { type: String },
    priceFrom: { type: Number }, // giá từ (tùy chọn)
    duration: { type: String }, // ví dụ: "1-2 giờ"
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
