const topics = require("../models/topics");
const articles = require("../models/articles");

function getAllTopics(req, res, next) {
  topics
    .find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
}

module.exports = { getAllTopics };
