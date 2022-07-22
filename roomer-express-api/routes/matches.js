const { private_key } = require("../constants");
const express = require("express");
const router = express.Router();
const Roomer = require("../models/roomer");
const jwt = require("jsonwebtoken");

// extract and verify the token stored in `req`s cookie
// if token doesn't exist or token cannot be successfully verified, send "forbidden" error.
const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send("no token");
  }
  try {
    jwt.verify(token, private_key);
    return next();
  } catch {
    return res.status(403).send("unable to verify token");
  }
};

// authenticate user, and then if authentication is successful, create cookie containing token
const login = async (username, password, res) => {
  const authorized = await Roomer.getAuthorizationStatus(username, password);
  if (!authorized) {
    res.sendStatus(403);
  }
  const token = jwt.sign(username, private_key);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, //token expires after 1 hour
    secure: true,
    sameSite: "lax",
  });
  return res.status(200).send("cookie has been created!");
};

// get all users basic info
router.get("/allBasic", authorization, async (req, res, next) => {
  try{
    res.status(200).send({ allBasicData: await Roomer.getAllBasic() });
  } catch (e) {
    return next(e);
  }
});

// get single user's basic info
router.get("/basic/:username", authorization, async (req, res, next) => {
  const username = req.params.username;
  try{
    res.status(200).send({ basicData: await Roomer.getBasicInfo(username) });
  } catch (e) {
    return next(e)
  }
});

// get single user's housing info
router.get("/housing/:username", authorization, async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(200).send({ housingData: await Roomer.getHousingInfo(username) });
  } catch (e) {
    return next(e);
  }
});

// get single user's preference info
router.get("/preferences/:username", authorization, async (req, res, next) => {
  try {
    const username = req.params.username;
    res
      .status(200)
      .send({ preferenceData: await Roomer.getPreferenceInfo(username) });
  } catch (e) {
    return next(e)
  }
});

// get single user's bio + insta/fb handles
router.get("/extra/:username", authorization, async (req, res, next) => {
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

// // update database with new user's info
router.post("/update/:username", async (req, res, next) => {
  try {
    const updateForm = req.body.updateForm;
    const username=req.params.username;
    res.status(200).send({ update: await Roomer.updateUserInfo(updateForm, username)});
  } catch (e) {
    return next(e);
  }
});


router.post("/login", async (req, res, next) => {
  try {
    login(req.body.username, req.body.password, res);
  } catch (e) {
    return next(e);
  }
});

router.get("/logout", authorization, async (req, res) => {
  try{
    return res.clearCookie("token").status(200).send("Successfully logged out");
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
