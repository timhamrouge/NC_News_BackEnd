const { Users, Comments, Articles } = require("../models");

function voteOnComment(req, res, next) {
  const { vote } = req.query;
  const comment_id = req.params.comment_id;
  let val;
  if (vote === "up") val = 1;
  if (vote === "down") val = -1;
  return Comments.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: val } },
    { new: true }
  )
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const commentId = req.params.comment_id;
  return Comments.findByIdAndRemove(commentId)
    .then(() => {
      return res.status(200).send({ msg: "comment deleted" });
    })
    .catch(next);
}

module.exports = { voteOnComment, deleteComment };
