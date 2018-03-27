const express = require("express");
const topicsRouter = express.Router();
const { getAllTopics } = require("../controllers/topics.js");

topicsRouter.get("/", getAllTopics);

module.exports = topicsRouter;
