const { private_key, successCode } = require("../consts");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dir = "uploads/";
const upload = multer({ dest: dir });
const Roomer = require("../models/roomer");
const Match = require("../models/match");
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
    return res.sendStatus(403);
  }
  const token = jwt.sign(username, private_key);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, //token expires after 1 hour
    secure: true,
    sameSite: "lax",
  });
  return res.status(successCode).send("cookie has been created!");
};

// depending on whether the URL has a paramater, append "username" as the parameter
const genPageURL = (base, hasParam=false) => {
  const parameter = hasParam ? ":username" : "";
  return `/${base}/${parameter}`
}

// get all users basic info
router.get(genPageURL("allBasic"), authorization, async (req, res, next) => {
  try {
    res.status(successCode).send({ allBasicData: await Roomer.getAllBasic() });
  } catch (e) {
    return next(e);
  }
});

// get all of a single user's info
router.get(genPageURL("allInfo", true), authorization, async (req, res, next) => {
  const username = req.params.username;
  try {
    res.status(successCode).send({ allInfo: await Roomer.getAllInfo(username) });
  } catch (e) {
    return next(e);
  }
});

// update database with new user's info
router.post(genPageURL("register"), async (req, res, next) => {
  try {
    const info = req.body.registerForm;
    res.status(201).send({ registration: await Roomer.registerNewUser(info) });
  } catch (e) {
    return next(e);
  }
});

// update database with new user's info
router.post(genPageURL("update", true), authorization, async (req, res, next) => {
  try {
    const updateForm = req.body.updateForm;
    const username = req.params.username;
    res
      .status(successCode)
      .send({ update: await Roomer.updateUserInfo(updateForm, username) });
  } catch (e) {
    return next(e);
  }
});

// change or add a user's selected profile picture
router.post(genPageURL("uploadPfp"), authorization, upload.single("pfpSrc"), async function (req, res, next) {
    try {
      const img = fs.readFileSync(req.file.path);
      const encodeImg = img.toString("base64");
      const finalImg = {
        contentType: req.file.mimetype,
        pfpSrc: Buffer.from(encodeImg, "base64"), // mongoDB allows files < 16MB in BSON format to be in a document
        username: req.body.username,
      };

      // multer uses the "uploads" dir to get the filepath that intermediate files are stored in
      fs.readdir(dir, (err, files) => {
        if (err) {
          throw err;
        }

        for (const file of files) {
          fs.unlink(path.join(dir, file), (err) => {
            if (err) throw err;
          });
        }
      });

      res.status(201).send({ uploadStatus: await Roomer.uploadPfp(finalImg) });
    } catch (e) {
      return next(e);
    }
  }
);

// Given a user, return their profile picture.
router.get(genPageURL("getPfp", true), authorization, async (req, res, next) => {
  const username = req.params.username;
  try {
    const ret = await Roomer.getPfp(username);
    res.status(successCode).send({ file: ret });
  } catch (e) {
    return next(e);
  }
});

// Add hearted user to current user's list of liked/matched people
router.post(genPageURL("heart"), authorization, async (req, res, next) => {
  try {
    res.status(successCode).send({
      update:  await Roomer.processHeart(req.body.currentUser, req.body.likedUser),
    });
  } catch (e) {
    return next(e);
  }
});

// Remove hearted user from current user's list of liked/matched people
router.post(genPageURL("unheart"), authorization, async (req, res, next) => {
  try {
    res.status(successCode).send({
      update: await Roomer.processUnheart(req.body.currentUser, req.body.unlikedUser),
    });
  } catch (e) {
    return next(e);
  }
});

// Get usernames associated with liked profiles
router.get(genPageURL("likedUsers", true), authorization, async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(successCode).send({ likedUsers: await Roomer.getLikesMatches("like", username) });  
  } catch (e) {
    return next(e);
  }
});

// Get usernames associated with matched profiles
router.get(genPageURL("matchedUsers", true), authorization, async (req, res, next) => {
  try {
    const username = req.params.username;
    res.status(successCode).send({ matchedUsers: await Roomer.getLikesMatches("match", username) });
  } catch (e) {
    return next(e);
  }
});

// Get info necessary to provide match recommendations
router.get(genPageURL("matchInfo"), async (req, res, next) => {
  try {
    res.status(successCode).send({ matchInfo: await Roomer.getMatchInfo() });
  } catch {
    return next(e);
  }
});

// Get user's basic info sorted based on match score
router.get(genPageURL("getRecs", true), authorization, async (req, res, next) => {
  try {
    const currentUser = req.params.username;
    const user = new Match(currentUser);
    const sortedMatches = await user.getDistanceInfo();
    res.status(successCode).send({ orderedBasicInfo: sortedMatches });
  } catch (e) {
    return next(e);
  }
});

router.get(genPageURL("requestReset", true), async (req, res, next) => {
  try {
    const username = req.params.username.trim();
    res.status(successCode).send({ requestStatus: await Roomer.requestReset(username) });
  } catch (e) {
    return next(e);
  }
});

router.post(genPageURL("resetPassword"), async (req, res, next) => {
  try {
    const username = req.body.username;
    const token = req.body.token;
    const password = req.body.password;
    res
      .status(successCode)
      .send({
        resetStatus: await Roomer.resetPassword(username, token, password),
      });
  } catch (e) {
    return next(e);
  }
});

router.post(genPageURL("login"), async (req, res, next) => {
  try {
    login(req.body.username, req.body.password, res);
  } catch (e) {
    return next(e);
  }
});

router.get(genPageURL("logout"), authorization, async (req, res, next) => {
  try {
    return res.clearCookie("token").status(successCode).send("Successfully logged out");
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
