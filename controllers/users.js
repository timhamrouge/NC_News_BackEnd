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
      if (user === null) res.send({ msg: "invalid username" });
      res.send({ user });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { getAllUsers, getUserByUsername };
