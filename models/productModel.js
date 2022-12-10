import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    img: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
