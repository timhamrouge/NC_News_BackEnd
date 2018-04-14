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
      if (user) res.send({ user });
      else
        res.send({
          msg: "No such user, please check your input and try again"
        });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { getAllUsers, getUserByUsername };
