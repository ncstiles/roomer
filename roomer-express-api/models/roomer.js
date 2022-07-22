const { mongo_pw } = require("../consts");
const { BadRequestError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://nstiles:${mongo_pw}@cluster0.rlw7w8u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const clientURL = process.env.CLIENT_URL;
const bcryptSalt = process.env.BCRYPT_SALT;
const randByteSize = 20;
const {
  requestSubject,
  requestBody,
  confirmationSubject,
  confirmationBody,
  sendEmail,
} = require("../utils/email");
class Roomer {
  // all basic information (first name, username, age, gender, occupation) associated with every user in db
  static async getAllBasic() {
    try {
      await client.connect();
      const allBasicData = await client
        .db("roomer")
        .collection("all")
        .find()
        .project({
          _id: 0,
          username: 1,
          firstName: 1,
          age: 1,
          gender: 1,
          occupation: 1,
          pfpSrc: 1,
          contentType: 1,
        })
        .toArray();
      return allBasicData;
    } catch (e) {
      return new BadRequestError(
        `Getting single user's basic data request didn't go through: ${e}`
      );
    }
  }

  // Get the requisite info to create custom profile recommendations for a user.
  // Includes both info needed for matching and info needed for generating basic profile
  static async getMatchInfo() {
    try {
      await client.connect();
      const allInfoArr = await client
        .db("roomer")
        .collection("all")
        .find({})
        .project({
          _id: 0,
          username: 1,
          firstName: 1,
          age: 1,
          gender: 1,
          occupation: 1,
          pfpSrc: 1,
          contentType: 1,
          city: 1,
          state: 1,
          address: 1,
          rentRange: 1,
          agePref: 1,
          genderPref: 1,
          locRad: 1,
        })
        .toArray();
      return allInfoArr;
    } catch (e) {
      return new BadRequestError(
        `Getting all of matching algo information failed.`
      );
    }
  }

  // get information associated a user and break it up into the chunks that are displayed on separate cards in detail view
  static async getAllInfo(username) {
    try {
      await client.connect();
      const allInfoArr = await client
        .db("roomer")
        .collection("all")
        .find({ username })
        .project({ _id: 0 })
        .toArray();
      const allInfo = allInfoArr[0];
      const allData = {
        basic: {
          firstName: allInfo.firstName,
          age: allInfo.age,
          gender: allInfo.gender,
          occupation: allInfo.occupation,
          pfpSrc: allInfo.pfpSrc,
          contentType: allInfo.contentType,
        },
        housing: {
          city: allInfo.city,
          state: allInfo.state,
          zip: allInfo.zip,
          addr: allInfo.addr,
          rentRange: allInfo.rentRange,
        },
        preferences: {
          locRad: allInfo.locRad,
          genderPref: allInfo.genderPref,
          agePref: allInfo.agePref,
          profession: allInfo.profession,
        },
        extra: {
          bio: allInfo.bio,
          insta: allInfo.insta,
        },
      };
      return allData;
    } catch (e) {
      return new BadRequestError(
        `Getting all of ${username}'s information failed.`
      );
    }
  }

  // upload submitted registration form to db
  static async registerNewUser(form) {
    try {
      client.connect();
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(form.password, salt);
      delete form["password"];
      await client.db("roomer").collection("all").insertOne(form);
      await client
        .db("roomer")
        .collection("auth")
        .insertOne({ username: form.username, password: password });
    } catch (e) {
      return new BadRequestError(
        `Posting ${form.username}'s registration request didn't go through.`
      );
    }
  }

  // determine whether user inputted username and password match what's stored in the db
  static async getAuthorizationStatus(username, password) {
    try {
      await client.connect();
      const res = await client
        .db("roomer")
        .collection("auth")
        .find({ username })
        .project({ _id: 0, username: 0 })
        .toArray();
      if (res.length === 0) {
        return false;
      }
      const dbPassword = res[0].password
      const isMatch = await bcrypt.compare(password, dbPassword);
      return isMatch;

    } catch (e) {
      return new BadRequestError(
        `Getting single user's password request didn't go through: ${e}`
      );
    }
  }

  // update the specified collection with data/preferences the user wants updated.
  static async updateUserInfo(updateForm, username) {    
    try {
      await client.connect();
      //password is in "auth" collection - must be dealt with separately
      if ("password" in updateForm) {
        await client
        .db("roomer")
        .collection("auth")
        .updateOne(
          { username: username },
          { $set: {password: updateForm.password} },
          { upsert: true }
        );
        delete updateForm.password
      }
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username: username },
          { $set: updateForm },
          { upsert: true }
        );
      return `Successfully updated ${username}'s info!`;
    } catch (e) {
      return new BadRequestError(`Failed to update ${username}'s info.`);
    }
  }

  // update db with user's profile picture - either update existing pfp if user has one
  // or create a new entry for their pfp
  static async uploadPfp(imageFile) {
    try {
      await client.connect();
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username: imageFile.username },
          { $set: imageFile },
          { upsert: true }
        );
      return "Success! Profile picture uploaded!";
    } catch (e) {
      return new BadRequestError(`Failed to update info.`);
    }
  }

  // get user's profile picture.
  static async getPfp(username) {
    try {
      await client.connect();
      const pfp = await client
        .db("roomer")
        .collection("all")
        .find({ username })
        .project({ _id: 0, contentType: 1, pfpSrc: 1 })
        .toArray();
      return pfp[0];
    } catch (e) {
      return new BadRequestError(
        `Getting ${username}'s profile picture didn't go through: ${e}`
      );
    }
  }

  /**
   * Add `addedUser` to `currentUser`s like or match list depending on `infoType`
   *
   * @param {string} infoType either "like" or "match" - the field type to update in the db
   * @param {*} currentUser the user's whose info we're updating
   * @param {*} addedUser the user who we're adding to the liked or match list
   */
  static async addLikeMatch(infoType, currentUser, addedUser) {
    const dbField = infoType === "like" ? "liked" : "matches";
    try {
      await client.connect();
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username: currentUser },
          { $addToSet: { [dbField]: addedUser } },
          { upsert: true }
        );
    } catch (e) {
      return new BadRequestError(
        `Failed to add ${addedUser} to list of ${currentUser}'s ${infoType} people: ${e}`
      );
    }
  }

  /**
   * Remove `removedUser` from `currentUser`s like or match list depending on `infoType`
   *
   * @param {string} infoType either "like" or "match" - the field type to update in the db
   * @param {*} currentUser the user's whose info we're updating
   * @param {*} removedUser the user who we're removing from the liked or match list
   */
  static async removeLikeMatch(infoType, currentUser, removedUser) {
    const dbField = infoType === "like" ? "liked" : "matches";
    try {
      await client.connect();
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username: currentUser },
          { $pull: { [dbField]: removedUser } }
        );
    } catch (e) {
      return new BadRequestError(
        `Failed to remove ${removedUser} from list of ${currentUser}'s ${infoType} people: ${e}`
      );
    }
  }

  /**
   * Check whether `otherUser` is in `username`s like or match list depending on `infoType`
   *
   * @param {string} infoType either "like" or "match" - the array in the db we want check if `otherUser` is part of
   * @param {string} username the person we're checking the like/match list for
   * @param {string} otherUser the username of the person we're checking to see if is in the like/match list
   * @returns whether `otherUser` is in `username`s liked/matched list
   */
  static async inLikeMatchList(infoType, username, otherUser) {
    await client.connect();
    try {
      const res = await client
        .db("roomer")
        .collection("all")
        .find({ username })
        .project({ _id: 0, liked: 1, matches: 1 })
        .toArray();

      const usernames = infoType === "like" ? res[0].liked : res[0].matches;

      if (!usernames) {
        return false; // like/match list undefined when doing call - user has never liked/matched with anyone before
      } else if (usernames.includes(otherUser)) {
        return true; // otherUser in liked/match list
      } else {
        return false; // otherUser not in liked/match list
      }
    } catch (e) {
      return new BadRequestError(
        `Failed to determine if ${otherUser} is in ${user}s ${infoType} list`
      );
    }
  }

  /**
   * Determine whether to add `heartedUser` to the liked or matched list.
   *
   * @param {string} currentUser username of person currently signed in
   * @param {string} likedUser username of person whose card was hearted
   * @returns "match" or "like" depending on whether `heartedUser` was added to match or liked list, respectively
   */
  static async processHeart(currentUser, heartedUser) {
    try {
      const isLiked = await Roomer.inLikeMatchList(
        "like",
        heartedUser,
        currentUser
      );
      if (isLiked) {
        await Roomer.addLikeMatch("match", currentUser, heartedUser); // add the liked user to this user's matched list
        await Roomer.removeLikeMatch("like", heartedUser, currentUser); // remove the current user from the liked user's liked list
        await Roomer.addLikeMatch("match", heartedUser, currentUser); // instead, add them to their matched list
        return "match";
      } else {
        // this is a one-way like
        await Roomer.addLikeMatch("like", currentUser, heartedUser);
        return "like";
      }
    } catch (e) {
      return new BadRequestError(
        `Failed to add ${heartedUser} to ${currentUser} list of likes or matches`
      );
    }
  }

  /**
   * Determine whether to remove `unheartedUser` from the liked or matched list.
   *
   * @param {string} currentUser username of person currently signed in
   * @param {string} unlikedUser username of person whose card was unhearted
   * @returns "unmatch" or "unlike" depending on whether `unheartedUser` was removed from match or liked list, respectively
   */
  static async processUnheart(currentUser, unheartedUser) {
    try {
      const isMatched = await Roomer.inLikeMatchList(
        "match",
        currentUser,
        unheartedUser
      );
      if (isMatched) {
        await Roomer.removeLikeMatch("match", currentUser, unheartedUser); // remove this unliked user from match list
        await Roomer.removeLikeMatch("match", unheartedUser, currentUser); // remove user from unliked user's match list
        await Roomer.addLikeMatch("like", unheartedUser, currentUser); // instead, add the current user to unliked user's liked list
        return "unmatch";
      } else {
        // remove like
        await Roomer.removeLikeMatch("like", currentUser, unheartedUser);
        return "unlike";
      }
    } catch (e) {
      return new BadRequestError(
        `Failed to remove ${unheartedUser} from ${currentUser}s list of likes or matches`
      );
    }
  }

  /**
   * Get all the usernames that this user has liked/matched with depending on `infoType`
   *
   * @param {string} infoType either "likes" or "matches" - refers to the matches/likes field in the database
   * @param {string} username the username of the person we're getting like/match for
   * @returns an array of usernames of all people in the like/match list
   */
  static async getLikesMatches(infoType, username) {
    try {
      await client.connect();
      const userInfo = await client
        .db("roomer")
        .collection("all")
        .find({ username })
        .project({ _id: 0, liked: 1, matches: 1 })
        .toArray();
      if (infoType === "like") {
        return userInfo[0].liked ? userInfo[0].liked : [];
      }
      if (infoType === "match") {
        return userInfo[0].matches ? userInfo[0].matches : [];
      }
    } catch (e) {
      return new BadRequestError(
        `Failed to get ${infoType} for ${username}: ${e}`
      );
    }
  }

  /**
   * Attempt to send the requested user an email with a link to reset their password
   *  
   * @param {string} username username entered into password reset
   * @returns whether sending the email was sent successfully
   */
  static async requestReset(username) {
    try {
      await client.connect();

      //try to retrieve the whole user object corresponding to this username
      const user = await client
        .db("roomer")
        .collection("all")
        .findOne({ username });

      if (!user) {
        return new BadRequestError(`${username} does not exist in database`)
      }

      // delete old token if it exists
      await client
        .db("roomer")
        .collection("all")
        .findOneAndUpdate(
          { username },
          { $unset: { token: 1, tokenExpiration: 1 } }
        );

      //add new hashed token + its expiration to db
      const unhashedToken = crypto.randomBytes(randByteSize).toString("hex");
      const token = await bcrypt.hash(unhashedToken, Number(bcryptSalt));
      const tokenExpiration = Date.now() + 60 * 60 * 1000; //expires in an hour
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username },
          { $set: { token, tokenExpiration } },
          { upsert: true }
        );

      const resetLink = `${clientURL}/passwordReset?token=${unhashedToken}&username=${user.username}`;      
      sendEmail(
        user.email,
        requestSubject,
        requestBody(user.firstName, resetLink)
      );
      return "success";
    } catch (e) {
      return new BadRequestError(
        `Failed to verify whether ${username} is in db: ${e}`
      );
    }
  }

  /**
   * Determine if the token the user sends over hasn't exired and is in the database.
   * If so, reset their password and delete the token.
   * @param {string} username username from URL given in reset password email
   * @param {string} token token from URL given in reset password email
   * @param {string} password new password entered by user
   * @returns whether password update was successful
   */
   static async resetPassword(username, token, password) {
    await client.connect();
    const res = await client
      .db("roomer")
      .collection("all")
      .find({ username })
      .project({ _id: 0 })
      .toArray();

    const user = res[0];

    const dbToken = user.token;
    const dbExpiration = user.tokenExpiration;

    if (!res) {
      return new BadRequestError(`Cannot find user ${username}`);
    }
    if (Date.now() > dbExpiration) {
      return new BadRequestError("Token has expired");
    }
    if (!dbToken || !dbExpiration) {
      return new BadRequestError("Token or token expiration date doesnt exist");
    }
    const tokensMatch = await bcrypt.compare(token, dbToken);
    if (!tokensMatch) {
      throw new BadRequestError("Provided token and token in db dont match");
    }

    const newPasswordHash = await bcrypt.hash(password, Number(bcryptSalt));
    await client
      .db("roomer")
      .collection("auth")
      .updateOne(
        { username: username },
        { $set: { password: newPasswordHash } }
      );

    sendEmail(
      user.email,
      confirmationSubject,
      confirmationBody(user.firstName)
    );

    await client
      .db("roomer")
      .collection("all")
      .updateOne({ username }, { $unset: { token: 1, tokenExpiration: 1 } });

    return "success";
  }
}

module.exports = Roomer;
