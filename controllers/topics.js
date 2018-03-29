const { Users, Comments, Articles } = require("../models");
function getAllTopics(req, res, next) {
  Topics.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
}

function getArticlesByTopicId(req, res, next) {
  let query = req.params.topic_id;
  Articles.find({ belongs_to: query })
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
}

module.exports = { getAllTopics, getArticlesByTopicId };
