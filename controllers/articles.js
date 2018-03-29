const articles = require("../models/articles");
const comments = require("../models/comments");
const users = require("../models/users");
const { Users, Comments, Articles } = require("../models");

//refactor this^^^

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

function voteOnArticle(req, res, next) {
  const { vote } = req.query;
  const article_id = req.params.article_id;
  let val;
  if (vote === "up") val = 1;
  if (vote === "down") val = -1;
  return articles
    .findOneAndUpdate(
      { _id: article_id },
      { $inc: { votes: val } },
      { new: true }
    )
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getAllArticles,
  getCommentsForArticle,
  postComment,
  voteOnArticle
};
