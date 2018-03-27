const { DB_URL } = require("./config");
const app = require("express")();
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const bodyParser = require("body-parser");

const apiRouter = require("./routes/api");

if (process.env.NODE_ENV === "development") {
  mongoose.connect(DB_URL).then(() => {
    console.log(`connected to ${DB_URL}`);
  });
}
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/", (req, res) => {
  console.log("Hi Tim");
});

module.exports = app;
