import mongoose from "mongoose";

const reveiewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    countInStock: { type: Number, required: true },
    discount: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    reviewsList: [reveiewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
