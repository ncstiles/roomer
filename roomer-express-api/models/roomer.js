const { mongo_pw } = require("../consts");
const { BadRequestError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://nstiles:${mongo_pw}@cluster0.rlw7w8u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

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
      const actualPW = await client
        .db("roomer")
        .collection("auth")
        .find({ username })
        .project({ _id: 0, username: 0 })
        .toArray();
      if (actualPW.length === 0) {
        return false;
      }
      const pwMatches = await bcrypt.compare(password, actualPW[0]);
      return pwMatches;
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
}

module.exports = Roomer;
