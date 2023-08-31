import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();
const PAGE_SIZE = 5;

//requesting all the products
productRouter.get("/", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

//creating the products
productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      productName: req.body.name,
      slug: req.body.slug,
      img: req.body.img,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      discount: req.body.discount,
      rating: 0,
      reviews: 0,
      //description: "sample description",
    });
    const product = await newProduct.save();
    res.send({ message: "Product Created", product });
  })
);

//adding a review to a product
productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviewsList.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviewsList.push(review);
      product.reviews = product.reviewsList.length;
      product.rating =
        product.reviewsList.reduce((a, c) => c.rating + a, 0) /
        product.reviewsList.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "Review Created",
        review:
          updatedProduct.reviewsList[updatedProduct.reviewsList.length - 1],
        reviews: product.reviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//admin view of all products
productRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

//Admin updating all the products
productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.productName = req.body.name || product.name;
      product.slug = req.body.slug || product.slug;
      product.price = req.body.price || product.price;
      product.img = req.body.img || product.img;
      product.category = req.body.category || product.category;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.discount = req.body.discount || product.discount;
      // product.description = req.body.description;
      await product.save();
      res.send({ message: "Product Updated" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//searching the product
productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            productName: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};

    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

//Requesting product based on slug
productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found!" });
  }
});

//find the product based on category
productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

//find the product based on ID
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found!" });
  }
});

//Admin deleting the product
productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
