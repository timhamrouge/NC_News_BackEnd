const { Users, Comments, Articles } = require("../models");

function getAllArticles(req, res, next) {
  Articles.find()
    .populate({ path: "created_by", select: "name -_id" })
    .then(Articles => {
      console.log("YOYOYOYOYOYOYOYOOY");
      res.send({ Articles });
    })
    .catch(next);
}

function getCommentsForArticle(req, res, next) {
  let query = req.params.article_id;
  Comments.find({ belongs_to: query })
    .then(comments => res.send({ comments }))
    .catch(next);
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
    .then(comment => res.status(201).json(comment))
    .catch(next);
}

function voteOnArticle(req, res, next) {
  const { vote } = req.query;
  const article_id = req.params.article_id;
  let val;
  if (vote === "up") val = 1;
  if (vote === "down") val = -1;
  return Articles.findOneAndUpdate(
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
