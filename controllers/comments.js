const { Users, Comments, Articles } = require("../models");

function voteOnComment(req, res, next) {
  const { vote } = req.query;
  const comment_id = req.params.comment_id;
  let val = 0;
  if (vote === "up") val = 1;
  if (vote === "down") val = -1;
  return Comments.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: val } },
    { new: true }
  )
    .lean()
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(comment => {
      comment.belongs_to = comment.belongs_to.title;
      comment.created_by = comment.created_by.username;
      res.status(200).send({ comment });
    })
    .catch(err => {
      if (err.name === "MongoError") err.status = 400;
      if (err.name === "CastError") err.status = 404;
      next(err);
    });
}

function deleteComment(req, res, next) {
  const commentId = req.params.comment_id;
  return Comments.findByIdAndRemove(commentId)
    .then(() => {
      res.send({ msg: "Comment Deleted" });
    })
    .catch(err => {
      if (err.name === "CastError") err.status = 400;
      next(err);
    });
}

module.exports = { voteOnComment, deleteComment };
