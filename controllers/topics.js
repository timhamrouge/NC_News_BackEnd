const { Users, Comments, Articles, Topics } = require("../models");

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
    .lean()
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(articleDocs => {
      let articles = articleDocs.map(article => {
        article.created_by = article.created_by.username;
        article.belongs_to = article.belongs_to.title;
        return article;
      });
      res.send({ articles });
    })
    .catch(err => {
      // if (err.name === "CastError") err.status = 400;
      next(err);
    });
}

module.exports = { getAllTopics, getArticlesByTopicId };
