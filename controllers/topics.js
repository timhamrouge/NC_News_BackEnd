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
      if (articles.length === 0)
        return res.send({
          msg: "No articles found, please check your input and try again"
        });
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { getAllTopics, getArticlesByTopicId };
