const commentsRouter = require("express").Router();

const { voteOnComment } = require("../controllers/comments");

commentsRouter.put("/:comment_id", voteOnComment);

module.exports = commentsRouter;
