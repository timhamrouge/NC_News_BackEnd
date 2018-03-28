const topics = require("../models/topics");
const articles = require("../models/articles");

function getAllTopics(req, res, next) {
  topics
    .find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
}

function getArticlesByTopicId(req, res, next) {
  let query = req.params.topic_id;
  console.log(query);
  articles
    .find({ _id: 5abb588c30a59f19190609da })
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
}

module.exports = { getAllTopics, getArticlesByTopicId };
