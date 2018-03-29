const { Users, Comments, Articles } = require("../models");

function getAllUsers(req, res, next) {
  Users.find()
    .then(users => {
      res.send({ users });
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const userName = req.params.username;
  Users.findOne({ username: `${userName}` })
    .then(user => {
      res.send({ user });
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserByUsername };
