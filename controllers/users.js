const users = require("../models/users");

function getAllUsers(req, res, next) {
  users
    .find()
    .then(users => {
      res.send({ users });
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const userName = req.params.username;
  users
    .findOne({ username: `${userName}` })
    .then(user => {
      res.send({ user });
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserByUsername };
