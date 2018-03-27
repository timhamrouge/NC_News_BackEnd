const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics");

apiRouter.get("/", (req, res) => {
  res.send({ msg: "Information about all the routes" });
});

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
