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

  // get the requisite info to create custom profile recommendations for a user
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
          city: 1,
          state: 1,
          address: 1,
          age: 1,
          gender: 1,
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

  // add person to current user's list of liked people
  static async addLike(currentUser, likedUser) {
    try {
      await client.connect();
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username: currentUser },
          { $addToSet: { liked: likedUser } },
          { upsert: true }
        );
      return `Added ${likedUser} to list of ${currentUser}'s liked people`;
    } catch (e) {
      return new BadRequestError(
        `Failed to add ${likedUser} to list of ${currentUser}'s liked people: ${e}`
      );
    }
  }

  // remove person from current user's list of liked people
  static async removeLike(currentUser, unlikedUser) {
    try {
      await client.connect();
      await client
        .db("roomer")
        .collection("all")
        .updateOne(
          { username: currentUser },
          { $pull: { liked: unlikedUser } }
        );
      return `Removed ${unlikedUser} from list of ${currentUser}'s liked people`;
    } catch (e) {
      return new BadRequestError(
        `Failed to remove ${unlikedUser} from list of ${currentUser}'s liked people: ${e}`
      );
    }
  }
  // get list of usernames associated with liked profiles
  static async getLikes(username) {
    try {
      await client.connect();
      const likedUsers = await client
        .db("roomer")
        .collection("all")
        .find({ username })
        .project({ _id: 0, liked: 1 })
        .toArray();
      return likedUsers[0].liked ? likedUsers[0].liked : [];
    } catch (e) {
      return new BadRequestError(`Failed to get likes for ${username}: ${e}`);
    }
  }
}

module.exports = Roomer;
