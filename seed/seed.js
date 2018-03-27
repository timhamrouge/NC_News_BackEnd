process.env.NODE_ENV = process.env.NODE_ENV || "development";
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { random, sample } = require("lodash");
const faker = require("faker/locale/en_GB");
const { articlesData, topicsData, usersData } = require(`./${
  process.env.NODE_ENV
}Data`);
const { Users, Articles, Comments, Topics } = require("../models");
const DB = require("../config").DB_URL;

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

function seedDB(DB) {
  return Promise.all([
    Topics.insertMany(topicsData),
    Users.insertMany(usersData)
  ])
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
      return seedRandomComments(userIds, articles);
    })
    .then(comments => {
      console.log(`seeded ${comments.length} random comments`);
    });
}

mongoose
  .connect(DB)
  .then(() => {
    console.log(`connected to ${DB}`);
    return mongoose.connection.dropDatabase();
  })
  .then(() => {
    console.log("database dropped, seeding...");
    return seedDB(DB);
  })
  .then(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("disconnecting");
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.log(err);
    mongoose.disconnect();
  });

module.exports = seedDB;
