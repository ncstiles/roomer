const { mongo_pw } = require("../constants");
const { BadRequestError } = require("../utils/errors");
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
        .collection("basic")
        .find()
        .project({ _id: 0, lastName: 0, email: 0 })
        .toArray();
      return allBasicData;
    } catch (e) {
      return new BadRequestError(
        `Getting single user's basic data request didn't go through: ${e}`
      );
    }
  }

  // single user's basic information (first name, username, age, gender, occupation) as identified by their username
  static async getBasicInfo(username) {
    try {
      await client.connect();
      const basicInfo = await client
        .db("roomer")
        .collection("basic")
        .find({ username })
        .project({ _id: 0, lastName: 0, email: 0 })
        .toArray();
      return basicInfo[0];
    } catch (e) {
      return new BadRequestError(
        `Getting single user's basic data request didn't go through: ${e}`
      );
    }
  }

  // single user's housing information (rent/mont, address, city, state, zip) as identified by their username
  static async getHousingInfo(username) {
    try {
      await client.connect();
      const housingInfo = await client
        .db("roomer")
        .collection("housing")
        .find({ username })
        .project({ _id: 0, username: 0 })
        .toArray();
      return housingInfo[0];
    } catch (e) {
      return new BadRequestError(
        `Getting single user's housing data request didn't go through: ${e}`
      );
    }
  }

  // single user's profession + preferences (their own profession, location radius, age/gender preference) as identified by their username
  static async getPreferenceInfo(username) {
    try {
      await client.connect();
      const preferenceInfo = await client
        .db("roomer")
        .collection("preferences")
        .find({ username })
        .project({ _id: 0, username: 0 })
        .toArray();
      return preferenceInfo[0];
    } catch (e) {
      return new BadRequestError(
        `Getting single user's preference data request didn't go through: ${e}`
      );
    }
  }

  // single user's instagram and fb handle, as well as a short bio, where the user's identified by their username
  static async getExtraInfo(username) {
    try {
      await client.connect();
      const extraInfo = await client
        .db("roomer")
        .collection("extra")
        .find({ username })
        .project({ _id: 0, username: 0 })
        .toArray();
      return extraInfo[0];
    } catch (e) {
      return new BadRequestError(
        `Getting single user's extra data request didn't go through: ${e}`
      );
    }
  }

  // given a submitted registration form, take the submission inputs and append to their corresponding databases
  static async registerNewUser(form) {
    try {
      await client.connect();
      const {
        username,
        firstName,
        lastName,
        email,
        age,
        gender,
        occupation,
        ...leftover
      } = form;
      const basicInfo = {
        username,
        firstName,
        lastName,
        email,
        age,
        gender,
        occupation,
      };

      const { rentRange, addr, city, state, zip, ...leftover1 } = leftover;
      const housingInfo = Object.assign(
        {},
        { username: form.username },
        { rentRange, addr, city, state, zip }
      );

      const { profession, agePref, genderPref, locRad, ...leftover2 } =
        leftover1;
      const prefInfo = Object.assign(
        {},
        { username: form.username },
        { profession, agePref, genderPref, locRad }
      );

      const { insta, fb, bio, ...leftover3 } = leftover2;
      const extraInfo = Object.assign(
        {},
        { username: form.username },
        { insta, fb, bio }
      );

      const { password, ...leftover4 } = leftover3;
      const authInfo = Object.assign(
        {},
        { username: form.username },
        { password }
      );

      await client.db("roomer").collection("basic").insertOne(basicInfo);
      await client.db("roomer").collection("housing").insertOne(housingInfo);
      await client.db("roomer").collection("preferences").insertOne(prefInfo);
      await client.db("roomer").collection("extra").insertOne(extraInfo);
      await client.db("roomer").collection("auth").insertOne(authInfo);
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
      return actualPW[0].password === password;
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
      for (let [category, updateObj] of Object.entries(updateForm)) {
        await client
          .db("roomer")
          .collection(category)
          .updateOne(
            { username: username },
            { $set: updateObj },
            { upsert: true }
          );
      }
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
          .collection('basic')
          .updateOne(
            { username: imageFile.username },
            { $set: imageFile },
            { upsert: true }
          );
      return 'Success! Profile picture uploaded!'
    } catch (e) {
      return new BadRequestError(`Failed to update info.`)
    }
  }

  // get user's profile picture.
  static async getPfp(username) {
    try {
      await client.connect();
      const pfp = await client
        .db("roomer")
        .collection("basic")
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
}

module.exports = Roomer;
