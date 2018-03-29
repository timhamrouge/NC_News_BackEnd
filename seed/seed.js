const { random, sample } = require("lodash");
const faker = require("faker/locale/en_GB");
const { articlesData, topicsData, usersData } = require(`./${
  process.env.NODE_ENV
}-data`);
const { Users, Articles, Comments, Topics } = require("../models");
const mongoose = require("mongoose");

function seedRandomComments(users, articles) {
  const userIds = users.map(user => user._id);
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
    .then(() => {
      console.log("database dropped");
      return Promise.all([
        Topics.insertMany(topicsData),
        Users.insertMany(usersData)
      ]);
    })
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
      return Promise.all([topics, users, Articles.insertMany(newArticlesData)]);
    })
    .then(([topics, users, articles]) => {
      console.log(`seeded ${articles.length} articles`);
      return Promise.all([
        topics,
        users,
        articles,
        seedRandomComments(users, articles)
      ]);
    })
    .then(([topics, users, articles, comments]) => {
      console.log(`seeded ${comments.length} random comments`);
      return Promise.all([topics, users, articles, comments]);
    });
}

module.exports = seedDB;
