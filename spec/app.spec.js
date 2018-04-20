process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");

describe("/api", () => {
  let topics, users, articles, comments;
  beforeEach(function() {
    this.timeout(10000);
    return seedDB().then(data => {
      return ([topics, users, articles, comments] = data);
    });
  });
  after(() => mongoose.disconnect());
  describe("/topics", () => {
    it("GET returns status 200 and an object with all the topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.topics)
            .to.be.an("array")
            .to.have.length(2);
          expect(res.body.topics[1])
            .to.be.an("object")
            .that.has.all.keys("__v", "_id", "title", "slug");
          expect(res.body.topics[1]._id).to.eql(String(topics[1]._id));
          expect(res.body.topics[0].title)
            .to.be.an("string")
            .to.eql("Mitch");
          expect(res.body.topics[1].slug)
            .to.be.an("string")
            .to.eql("cats");
        });
    });
  });
  describe("/topics/:topic_id/articles", () => {
    it("GET returns status 200 and an object with all articles for the given topic id", () => {
      return request
        .get(`/api/topics/${topics[0]._id}/articles`)
        .expect(200)
        .then(res => {
          let body = res.body;
          expect(body).to.be.an("object");
          expect(body.articles)
            .to.be.an("array")
            .to.have.length(2);
          expect(body.articles[0])
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "title",
              "votes"
            );
          expect(body.articles[0].votes).to.be.an("number");
          expect(body.articles[1].title)
            .to.be.an("string")
            .to.equal("7 inspirational thought leaders from Manchester UK");
          expect(body.articles[1].body)
            .to.be.an("string")
            .to.equal("Who are we kidding, there is only one, and it's Mitch!");
          expect(body.articles[1].belongs_to).to.eql("Mitch");
          expect(body.articles[0]._id.length).to.equal(24);
        });
    });
  });
  describe("/articles", () => {
    it("GET returns status 200 and an object with all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          let body = res.body;
          expect(body).to.be.an("object");
          expect(body.articles)
            .to.be.an("array")
            .to.have.length(4);
          expect(body.articles[3])
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "title",
              "votes",
              "comments"
            );
          expect(body.articles[3].votes).to.be.an("number");
          expect(body.articles[3].title)
            .to.be.an("string")
            .to.equal("UNCOVERED: catspiracy to bring down democracy");
          expect(body.articles[3].body)
            .to.be.an("string")
            .to.equal("Bastet walks amongst us, and the cats are taking arms!");
          expect(body.articles[2].title).to.equal(
            "They're not exactly dogs, are they?"
          );
          expect(body.articles[3].created_by).to.be.an("string");
          expect(body.articles[3].belongs_to).to.be.an("string");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET returns a 200 status code and the article specified by it's id", () => {
      return request
        .get(`/api/articles/${articles[1]._id}`)
        .expect(200)
        .then(res => {
          let article = res.body.article;
          expect(res.body)
            .to.be.an("object")
            .with.all.keys("article");
          expect(article)
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "title",
              "votes",
              "comments"
            );
          expect(article._id)
            .to.be.an("string")
            .with.length(24);
          expect(article.votes).to.be.an("number");
          expect(article.title).to.be.an("string");
          expect(article.body).to.be.an("string");
          expect(article.created_by).to.be.an("string");
          expect(article.belongs_to).to.be.an("string");
          expect(article.__v).to.equal(0);
          expect(article.comments).to.be.an("number");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("GET returns a 200 status code and all comments for a given article", () => {
      return request
        .get(`/api/articles/${articles[1]._id}/comments`)
        .expect(200)
        .then(res => {
          let body = res.body.comments;
          expect(res.body).to.be.an("object");
          expect(body).to.be.an("array");
          expect(body[0])
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "created_at",
              "votes"
            );
          expect(body[0].votes).to.be.an("number");
          expect(body[0].created_at).to.be.an("number");
          expect(body[0]._id)
            .to.be.an("string")
            .with.length(24);
          expect(body[0].created_by).to.be.an("string");
          expect(body[0].belongs_to)
            .to.be.an("string")
            .to.eql("7 inspirational thought leaders from Manchester UK")
            .with.length(50);
        });
    });
    it("POST returns a 200 status and an object with the new comment", () => {
      const id = articles[1]._id;
      return request
        .post(`/api/articles/${id}/comments`)
        .set("content-type", "application/json")
        .send({ comment: "example comment body" })
        .expect(201)
        .then(res => {
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "created_at",
              "votes"
            );
          expect(res.body.votes)
            .to.be.an("number")
            .to.equal(0);
          expect(res.body.body)
            .to.be.an("string")
            .to.equal("example comment body");
          expect(res.body.created_by)
            .to.be.an("string")
            .with.length(24);
          expect(res.body.belongs_to)
            .to.be.an("string")
            .with.length(24)
            .to.equal(String(id));
        });
    });
  });
  describe("/articles/:article_id?vote", () => {
    it("PUT returns a 200 status and the article with the votes increased by one with the query 'up'", () => {
      const id = articles[1]._id;
      return request
        .put(`/api/articles/${id}?vote=up`)
        .expect(200)
        .then(res => {
          const article = res.body.article;
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("article");
          expect(article)
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "title",
              "votes"
            );
          expect(article.votes).to.be.an("number");
          expect(article._id)
            .to.be.an("string")
            .with.length(24)
            .to.equal(String(id));
          expect(article.title)
            .to.be.an("string")
            .to.equal("7 inspirational thought leaders from Manchester UK");
          expect(article.body)
            .to.be.an("string")
            .to.equal("Who are we kidding, there is only one, and it's Mitch!");
          expect(article.created_by).to.be.an("string");
          expect(article.belongs_to).to.be.an("string");
        });
    });
    it("PUT returns a 200 status and the article with the votes increased by one with the query 'down'", () => {
      const id = articles[1]._id;
      return request
        .put(`/api/articles/${id}?vote=down`)
        .expect(200)
        .then(res => {
          const article = res.body.article;
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("article");
          expect(article)
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "title",
              "votes"
            );
          expect(article.votes).to.be.an("number");
          expect(article._id)
            .to.be.an("string")
            .with.length(24)
            .to.equal(String(id));
          expect(article.title)
            .to.be.an("string")
            .to.equal("7 inspirational thought leaders from Manchester UK");
          expect(article.body)
            .to.be.an("string")
            .to.equal("Who are we kidding, there is only one, and it's Mitch!");
          expect(article.created_by).to.be.an("string");
          expect(article.belongs_to).to.be.an("string");
        });
    });
  });
  describe("/comments/:comment_id?vote", () => {
    it("PUT returns a 200 status and the comment with the votes increased by one with the query 'up'", () => {
      const id = comments[1]._id;
      return request
        .put(`/api/comments/${id}?vote=up`)
        .expect(200)
        .then(res => {
          const comment = res.body.comment;
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("comment");
          expect(comment)
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "created_at",
              "votes"
            );
          expect(comment.votes).to.be.an("number");
          expect(comment._id)
            .to.be.an("string")
            .with.length(24)
            .to.equal(String(id));
          expect(comment.created_at).to.be.an("number");
          expect(comment.body).to.be.an("string");
          expect(comment.created_by).to.be.an("string");
          expect(comment.belongs_to).to.be.an("string");
        });
    });
    it("PUT returns a 200 status and the comment with the votes decreased by one with the query 'down'", () => {
      const id = comments[1]._id;
      return request
        .put(`/api/comments/${id}?vote=down`)
        .expect(200)
        .then(res => {
          const comment = res.body.comment;
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("comment");
          expect(comment)
            .to.be.an("object")
            .that.has.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_by",
              "created_at",
              "votes"
            );
          expect(comment.votes).to.be.an("number");
          expect(comment._id)
            .to.be.an("string")
            .with.length(24)
            .to.equal(String(id));
          expect(comment.created_at).to.be.an("number");
          expect(comment.body).to.be.an("string");
          expect(comment.created_by).to.be.an("string");
          expect(comment.belongs_to).to.be.an("string");
        });
    });
  });
  describe("/comments/:comment_id", () => {
    it("DELETE returns a 200 status and a message object to confirm deletion of the given comment", () => {
      const id = comments[1]._id;
      const commentsLength = comments.length;
      return request
        .delete(`/api/comments/${id}`)
        .expect(200)
        .then(res => {
          console.log(res.body);
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("msg");
          expect(res.body.msg)
            .to.be.an("string")
            .to.equal("Comment Deleted");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET returns a 200 status and a user object", () => {
      const userName = users[1].username;
      return request
        .get(`/api/users/${userName}`)
        .expect(200)
        .then(res => {
          const user = res.body.user;
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("user");
          expect(user)
            .to.be.an("object")
            .that.has.all.keys("__v", "_id", "avatar_url", "name", "username");
          expect(user._id)
            .to.be.an("string")
            .with.length(24);
          expect(user.username)
            .to.be.an("string")
            .with.length(11)
            .to.equal("dedekind561");
          expect(user.name)
            .to.be.an("string")
            .with.length(5)
            .to.equal("mitch");
          expect(user.avatar_url).to.be.an("string");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET returns a 200 status and an object with all users", () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(res => {
          const users = res.body.users;
          expect(res.body)
            .to.be.an("object")
            .that.has.all.keys("users");
          expect(users)
            .to.be.an("array")
            .with.length(2);
          expect(users[1])
            .to.be.an("object")
            .that.has.all.keys("_id", "username", "name", "avatar_url", "__v");
          expect(users[1]._id)
            .to.be.an("string")
            .with.length(24);
          expect(users[0].username)
            .to.be.an("string")
            .with.length(13)
            .to.equal("butter_bridge");
          expect(users[0].name)
            .to.be.an("string")
            .with.length(5)
            .to.equal("jonny");
          expect(users[0].avatar_url)
            .to.be.an("string")
            .to.equal(
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            );
        });
    });
  });
});
