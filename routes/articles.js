const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getCommentsForArticle,
  postComment,
  voteOnArticle,
  getArticleById
} = require("../controllers/articles");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:Article_id", getArticleById);
articlesRouter.put("/:article_id", voteOnArticle);
articlesRouter.get("/:article_id/comments", getCommentsForArticle);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
