const express = require("express");
const router = express.Router();
const { storage } = require("../data/storage");
const { NotFoundError } = require("../utils/errors");

// get all users basic info
router.get("/basic", (req, res) => {
  const data = storage.get("basic");
  res.status(200).send({ users: data });
});

// get single user's basic info
router.get("/connect/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const user = storage.get("basic").find((user) => user.id === Number(userId));
  if (!user) {
    return next(new NotFoundError("user id not found"));
  }
  res.status(200).send({ user: user });
});

// get single user's extended preference info
router.get("/extend/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const userData = storage
    .get("extended")
    .find((user) => user.id === Number(userId));
  if (!userData) {
    return next(new NotFoundError("user id not found"));
  }
  res.status(200).send({ extended: userData });
});

module.exports = router;
