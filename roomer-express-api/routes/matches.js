const express = require("express");
const router = express.Router();
const Roomer = require("../models/roomer");

// get all users basic info
router.get("/allBasic", async (req, res) => {
  res.status(200).send({ allBasicData: await Roomer.getAllBasic() });
});

// get single user's basic info
router.get("/basic/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(200).send({ basicData: await Roomer.getBasicInfo(username) });
  } catch (e) {
    return next(e);
  }
});

// get single user's housing info
router.get("/housing/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(200).send({ housingData: await Roomer.getHousingInfo(username) });
  } catch (e) {
    return next(e);
  }
});

// get single user's preference info
router.get("/preferences/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(200).send({ preferenceData: await Roomer.getPreferenceInfo(username) });
  } catch (e) {
    return next(e);
  }
});

// get single user's bio + insta/fb handles
router.get("/extra/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(200).send({ extraData: await Roomer.getExtraInfo(username) });
  } catch (e) {
    return next(e);
  }
});

// update database with new user's info
router.post("/register", async (req, res, next) => {
  try {
    const info = req.body.registerForm;
    res.status(201).send({ registration: await Roomer.registerNewUser(info) });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
