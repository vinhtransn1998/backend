import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    thumbnail: { type: String }, // ảnh đại diện (tùy chọn)
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
