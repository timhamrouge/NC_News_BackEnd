const DB_URL = process.env.DB || require("./config").DB_URL;
const app = require("express")();
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const bodyParser = require("body-parser");
const cors = require("cors");

const apiRouter = require("./routes/api");

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to ${DB_URL}`);
});

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => next({ status: 404 }));

app.use((err, req, res, next) => {
  if (err.status === 400) res.status(400).send({ msg: "BAD REQUEST" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.send({ msg: "PAGE NOT FOUND" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 500) res.status(500).send({ err });
});

module.exports = app;
