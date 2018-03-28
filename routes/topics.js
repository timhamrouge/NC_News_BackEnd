const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getArticlesByTopicId
} = require("../controllers/topics.js");

topicsRouter.get("/", getAllTopics);
topicsRouter.get("/:topic_id/articles", getArticlesByTopicId);

module.exports = topicsRouter;
