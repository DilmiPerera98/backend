import express from "express";
import { ProductData } from "./ProductData.js";

const app = express();

app.get("/api/products", (req, res) => {
  res.send(ProductData);
});

app.get("/api/products/slug/:slug", (req, res) => {
  const product = ProductData.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found!" });
  }
});

app.get("/api/products/:_id", (req, res) => {
  const product = ProductData.find((x) => x._id === req.params._id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found!" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
