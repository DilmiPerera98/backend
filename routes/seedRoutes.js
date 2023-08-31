import express from "express";
import Product from "../models/productModel.js";
import { data } from "../data.js";
import User from "../models/userModel.js";
import Article from "../models/articleModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  //Product
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);

  //User
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);

  //Article
  await Article.remove({});
  const createdArticles = await Article.insertMany(data.articles);

  res.send({ createdProducts, createdUsers, createdArticles });
});

export default seedRouter;
