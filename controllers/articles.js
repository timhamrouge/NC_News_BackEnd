const { Users, Comments, Articles } = require("../models");

function getAllArticles(req, res, next) {
  Articles.find()
    .lean()
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(articles => {
      return Promise.all([articles, Comments.find()]);
    })
    .then(([articleDocs, comments]) => {
      const commentCount = comments.reduce((acc, comment) => {
        acc[comment.belongs_to]
          ? acc[comment.belongs_to]++
          : (acc[comment.belongs_to] = 1);
        return acc;
      }, {});
      const articles = articleDocs.map(article => {
        article.created_by = article.created_by.username;
        article.belongs_to = article.belongs_to.title;
        article.comments = commentCount[article._id];
        return article;
      });
      return res.send({ articles });
    })
    .catch(next);
}

function getArticleById(req, res, next) {
  let query = req.params.article_id;
  Articles.findOne({ _id: query })
    .lean()
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(article => {
      return Promise.all([article, Comments.find()]);
    })
    .then(([article, comments]) => {
      const commentCount = comments.reduce((acc, comment) => {
        acc[comment.belongs_to]
          ? acc[comment.belongs_to]++
          : (acc[comment.belongs_to] = 1);
        return acc;
      }, {});
      article.created_by = article.created_by.username;
      article.belongs_to = article.belongs_to.title;
      article.comments = commentCount[article._id];
      return res.send({ article });
    })
    .catch(err => {
      if (err.name === "TypeError") err.status = 404;
      if (err.name === "CastError") err.status = 400;
      next(err);
    });
}

function getCommentsForArticle(req, res, next) {
  let query = req.params.article_id;
  Comments.find({ belongs_to: query })
    .lean()
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(commentDocs => {
      let comments = commentDocs.map(comment => {
        comment.created_by = comment.created_by.username;
        comment.belongs_to = comment.belongs_to.title;
        return comment;
      });
      if (comments.length === 0)
        return res.send({
          msg: "No comments found, please check your input and try again"
        });
      res.send({ comments });
    })
    .catch(err => {
      console.log(err);
      if (err.name === "CastError") err.status = 400;
      next(err);
    });
}

function postComment(req, res, next) {
  Users.findOne()
    .then(user => {
      return new Comments({
        body: req.body.comment,
        created_by: user._id,
        belongs_to: req.params.article_id
      }).save();
    })
    .then(comment => {
      res.status(201).json(comment);
    })
    .catch(err => {
      if (err.name === "ValidationError") err.status = 400;
      next(err);
    });
}

function voteOnArticle(req, res, next) {
  const { vote } = req.query;
  const article_id = req.params.article_id;
  let val = 0;
  if (vote === "up") val = 1;
  if (vote === "down") val = -1;
  return Articles.findOneAndUpdate(
    { _id: article_id },
    { $inc: { votes: val } },
    { new: true }
  )
    .lean()
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(article => {
      article.created_by = article.created_by.username;
      article.belongs_to = article.belongs_to.title;
      res.status(200).send({ article });
    })
    .catch(err => {
      console.log(err);
      if (err.name === "TypeError") err.status = 404;
      if (err.name === "MongoError") err.status = 400;
      if (err.name === "CastError") err.status = 400;
      next(err);
    });
}

module.exports = {
  getAllArticles,
  getCommentsForArticle,
  postComment,
  voteOnArticle,
  getArticleById
};
