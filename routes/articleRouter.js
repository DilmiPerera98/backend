import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Article from "../models/articleModel.js";

const articleRouter = express.Router();

//View all the articles
articleRouter.get("/", async (req, res) => {
  const articles = await Article.find({});
  res.send(articles);
});

//Customer view of Product based on Id
articleRouter.get("/client/:_id", async (req, res) => {
  const article = await Article.findOne({ _id: req.params._id });
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ message: "Article not found!" });
  }
});

//Admin view of all product
articleRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    const articles = await Article.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countArticles = await Article.countDocuments();
    res.send({
      articles,
      countArticles,
      page,
      pages: Math.ceil(countArticles / pageSize),
    });
  })
);

//Admin Creating a article
articleRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newArticle = new Article({
      name: req.body.name,
      img: req.body.img,
      description: req.body.description,
      reviews: 0,
      rating: 0,
    });
    const article = await newArticle.save();
    res.send({ message: "Article Created", article });
  })
);

//Admin Deleting Article
articleRouter.delete(
  "/:_id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const article = await Article.findById(req.params._id);
    if (article) {
      await article.remove();
      res.send({ message: "Article Deleted" });
    } else {
      res.status(404).send({ message: "Article Not Found" });
    }
  })
);

//Updating article
articleRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    if (article) {
      article.name = req.body.name || article.name;
      article.img = req.body.img || article.img;
      article.description = req.body.description || article.description;
      await article.save();
      res.send({ message: "Article Updated" });
    } else {
      res.status(404).send({ message: "Article Not Found" });
    }
  })
);

export default articleRouter;
