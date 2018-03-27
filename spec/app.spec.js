process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");
const { DB_URL } = require("../config");

describe("/api", () => {
  console.log("hello");
  after(() => mongoose.disconnect());
  let comments, users, articles, topics;
  beforeEach(() => {
    return seedDB(DB_URL).then(data => {
      console.log(data);
    });
  });
  // this should take a db url from config, and it should return an array of arrays of docuemnts
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
});
