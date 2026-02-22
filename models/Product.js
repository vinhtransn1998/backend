// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    badge: { type: String },
    desc: { type: String, required: true },
    details: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    image: { type: String }, // <-- URL ảnh
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
