process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");

describe("/api", () => {
  let topics, users, articles, comments;
  beforeEach(() => {
    return seedDB().then(data => {
      return ([topics, users, articles, comments] = data);
    });
  });
  after(() => mongoose.disconnect());
  describe("/", () => {
    it("GET returns status 200 and an object with information about the routes", () => {
      return request
        .get("/api")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
        });
    });
  });
  describe("/topics", () => {
    it("GET returns status 200 and an object with all the topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics[1]).to.be.an("object");
          expect(res.body.topics[1]._id).to.eql(String(topics[1]._id));
          expect(res.body.topics[0].title).to.eql("Mitch");
          expect(res.body.topics[0].slug).to.eql("mitch");
        });
    });
  });
});
