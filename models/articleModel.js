import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
