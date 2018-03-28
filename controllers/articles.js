const articles = require("../models/articles");
const comments = require("../models/comments");
const users = require("../models/users");

function getAllArticles(req, res, next) {
  articles
    .find()
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
}

function getCommentsForArticle(req, res, next) {
  let query = req.params.article_id;
  comments
    .find({ belongs_to: query })
    .then(comments => res.send({ comments }))
    .catch(next);
}

function postComment(req, res, next) {
  let userX;
  users
    .findOne()
    .then(user => {
      return new comments({
        body: req.body.comment,
        created_by: user._id,
        belongs_to: req.params.article_id
      }).save();
    })
    .then(comment => res.status(201).json(comment))
    .catch(next);
}

module.exports = { getAllArticles, getCommentsForArticle, postComment };
