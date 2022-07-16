const { private_key } = require("../constants");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dir = "uploads/";
const upload = multer({ dest: dir });
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
    return res.sendStatus(403);
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
  try {
    res.status(200).send({ allBasicData: await Roomer.getAllBasic() });
  } catch (e) {
    return next(e);
  }
});

// get all of a single user's info
router.get("/allInfo/:username", authorization, async (req, res, next) => {
  const username = req.params.username;
  try {
    res.status(200).send({ allInfo: await Roomer.getAllInfo(username) });
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

// update database with new user's info
router.post("/update/:username", authorization, async (req, res, next) => {
  try {
    const updateForm = req.body.updateForm;
    const username = req.params.username;
    res
      .status(200)
      .send({ update: await Roomer.updateUserInfo(updateForm, username) });
  } catch (e) {
    return next(e);
  }
});

// change or add a user's selected profile picture
//TODO: do authorization
router.post(
  "/uploadPfp",
  authorization,
  upload.single("pfpSrc"),
  async function (req, res, next) {
    try {
      const img = fs.readFileSync(req.file.path);
      const encodeImg = img.toString("base64");
      const finalImg = {
        contentType: req.file.mimetype,
        pfpSrc: Buffer.from(encodeImg, "base64"), // mongoDB allows files < 16MB in BSON format to be in a document
        username: req.body.username,
      };

      // multer uses the "uploads" dir to get the filepath
      // files store
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
router.get("/getPfp/:username", authorization, async (req, res, next) => {
  const username = req.params.username;
  try {
    const ret = await Roomer.getPfp(username);
    res.status(200).send({ file: ret });
  } catch (e) {
    return next(e);
  }
});

// Add liked user to current user's list of liked people
router.post("/addLike", authorization, async (req, res, next) => {
  try {
    res.status(200).send({
      update: await Roomer.addLike(req.body.currentUser, req.body.likedUser),
    });
  } catch (e) {
    return next(e);
  }
});

// Remove liked user from current user's list of liked people
router.post("/removeLike", authorization, async (req, res, next) => {
  try {
    res.status(200).send({
      update: await Roomer.removeLike(
        req.body.currentUser,
        req.body.unlikedUser
      ),
    });
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

router.get("/logout", authorization, async (req, res, next) => {
  try {
    return res.clearCookie("token").status(200).send("Successfully logged out");
  } catch (e) {
    return next(e);
  }
});

// Get usernames associated with liked profiles
router.get("/likedUsers/:username", authorization, async (req, res, next) => {
  try {
    const username = req.params.username;
    const result = await Roomer.getLikes(username);
    res.status(200).send({ likedUsers: result });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
