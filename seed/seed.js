const { random, sample } = require("lodash");
const faker = require("faker/locale/en_GB");
const { articlesData, topicsData, usersData } = require(`./${
  process.env.NODE_ENV
}Data`);
const { Users, Articles, Comments, Topics } = require("../models");
const mongoose = require("mongoose");

function seedRandomComments(userIds, articles) {
  const commentsArrays = [];
  articles.map(article => {
    return Array.from({ length: random(1, 10) }, x => {
      commentsArrays.push({
        votes: random(-200, 800),
        created_by: sample(userIds),
        belongs_to: article._id,
        body: faker.fake("{{lorem.sentence}}")
      });
    });
  });
  return Comments.insertMany(commentsArrays);
}

function seedDB(DB_URL) {
  return mongoose.connection
    .dropDatabase()
    .then(() =>
      Promise.all([Topics.insertMany(topicsData), Users.insertMany(usersData)])
    )
    .then(([topics, users]) => {
      console.log(`seeded ${topics.length} topics and ${users.length} users`);
      const userIds = users.map(user => user._id);
      const topicids = topics.reduce((acc, topic) => {
        acc[topic.slug] = topic._id;
        return acc;
      }, {});
      let newArticlesData = articlesData.map(article => {
        article.created_by = sample(userIds);
        article.belongs_to = topicids[article.topic];
        article.votes = random(-200, 800);
        return article;
      });
      return Promise.all([
        topics,
        userIds,
        Articles.insertMany(newArticlesData)
      ]);
    })
    .then(([topics, userIds, articles]) => {
      console.log(`seeded ${articles.length} articles`);
      return Promise.all([seedRandomComments(userIds, articles)]);
    })
    .then(comments => {
      console.log(`seeded ${comments.length} random comments`);
    });
}

// this needs t be refactored so al data is passed down the promise chain.
module.exports = seedDB;
