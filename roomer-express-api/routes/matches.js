const express = require("express");
const router = express.Router();
const { storage } = require("../data/storage");
const { NotFoundError } = require("../utils/errors");

// get all users basic info
router.get("/allBasic", (req, res) => {
  const data = storage.get("basic");
  const trimmedData = []
  for (dataEntry of data) {
    const trimmedEntry = {
      username: dataEntry.username,
      firstName: dataEntry.firstName,
      age: dataEntry.age,
      gender: dataEntry.gender,
      occupation: dataEntry.occupation
    }
    trimmedData.push(trimmedEntry)
  }
  res.status(200).send({ allBasicData: trimmedData });
});

// get single user's basic info
router.get("/basic/:username", (req, res, next) => {
  const username = req.params.username;
  const userBasic = storage.get("basic").find((user) => user.username === username);
  if (!userBasic) {
    return next(new NotFoundError(`username ${username} in basic is not found`));
  }
  const trimmedData = {
    username: userBasic.username,
    firstName: userBasic.firstName,
    age: userBasic.age,
    gender: userBasic.gender,
    occupation: userBasic.occupation
  }
  res.status(200).send({ basicData: trimmedData });
});

// get single user's housing info
router.get("/housing/:username", (req, res, next) => {
  const username = req.params.username;
  const userHousing = storage.get("housing").find((user) => user.username === username);
  const trimmedData = {
    rentRange: userHousing.rentRange,
    addr: userHousing.addr,
    city: userHousing.city,
    state: userHousing.state,
    zip: userHousing.zip
  }
  if (!userHousing) {
    return next(new NotFoundError(`username ${username} in housing is not found`));
  }
  res.status(200).send({ housingData: trimmedData });
});

// get single user's  preference info
router.get("/preferences/:username", (req, res, next) => {
  const username = req.params.username;
  const userPreferences = storage.get("preferences").find((user) => user.username === username);
  const trimmedData = {
    profession: userPreferences.profession,
    agePref: userPreferences.agePref,
    genderPref: userPreferences.genderPref,
    locRad: userPreferences.locRad
  }
  if (!userPreferences) {
    return next(new NotFoundError(`username ${username} in preferences is not found`));
  }
  res.status(200).send({ preferenceData: trimmedData });
});

// get single user's extended preference info
router.get("/extra/:username", (req, res, next) => {
  const username = req.params.username;
  const userExtra = storage.get("extra").find((user) => user.username === username);
  if (!userExtra) {
    return next(new NotFoundError(`username ${username} in extra is not found`));
  }
  const trimmedData = {
    insta: userExtra.insta,
    fb: userExtra.fb,
    bio: userExtra.bio
  }
  res.status(200).send({ extraData: trimmedData });
});

router.post('/register', (req, res) => {
  const info = req.body.registerForm
  
  const newBasic = {
    username: info.username,
    firstName: info.firstName,
    lastName: info.lastName,
    email: info.email,
    age: info.age,
    gender: info.gender,
    occupation: info.occupation
  }
  storage.add('basic', newBasic)

  const newHousing = {
    username: info.username,
    rentRange: info.rentRange,
    addr: info.addr,
    city: info.city,
    state: info.state,
    zip: info.zip,
  }
  storage.add('housing', newHousing)

  const newPreferences = {
    username: info.username,
    profession: info.profession,
    agePref: info.agePref,
    genderPref: info.genderPref,
    locRad: info.locRad
  }
  storage.add('preferences', newPreferences)

  const newExtra = {
    username: info.username,
    insta: info.insta,
    fb: info.fb,
    bio: info.bio,
  }
  storage.add('extra', newExtra)

  const newAuth = {
    username: info.username,
    password: info.password
  }
  storage.add('auth', newAuth)

  const addedToDB = {
    ...newBasic,
    ...newHousing, 
    ...newPreferences,
    ...newExtra,
    ...newAuth
  }
  
  res.status(201).send({registration: addedToDB})
})


module.exports = router;
