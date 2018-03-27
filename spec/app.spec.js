const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);

describe("/api", () => {
  describe("/", () => {
    it("GET returns status 200 and an object with information about the routes", () => {
      return request.get("/api").expect(200);
    });
  });
});
