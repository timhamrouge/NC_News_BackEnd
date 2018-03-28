const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getCommentsForArticle,
  postComment
} = require("../controllers/articles");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id/comments", getCommentsForArticle);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
