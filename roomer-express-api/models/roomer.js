const { BadRequestError } = require("../utils/errors");
const { MongoClient } = require("mongodb");
const mongoPW = "nstiles";
const uri = `mongodb+srv://nstiles:${mongoPW}@cluster0.rlw7w8u.mongodb.net/?retryWrites=true&w=majority`;
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
        return new BadRequestError(`Getting single user's basic data request didn't go through: ${e}`);
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
      return new BadRequestError(`Getting single user's basic data request didn't go through: ${e}`);
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
      return new BadRequestError(`Getting single user's housing data request didn't go through: ${e}`);
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
      return new BadRequestError(`Getting single user's preference data request didn't go through: ${e}`);
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
      return new BadRequestError(`Getting single user's extra data request didn't go through: ${e}`);
    }
  }

    //given a submitted registration form, take the submission inputs and append to their corresponding databases
    static async registerNewUser(form) {
        try {
            await client.connect();
            const {username,firstName, lastName, email, age, gender, occupation, ...leftover} = form;
            const basicInfo = {username,firstName, lastName, email, age, gender, occupation};

            const {rentRange, addr, city, state, zip, ...leftover1} = leftover;
            const housingInfo = Object.assign({}, {username: form.username}, {rentRange, addr, city, state, zip});

            const {profession, agePref, genderPref, locRad, ...leftover2} = leftover1;
            const prefInfo = Object.assign({}, {username: form.username}, {profession, agePref, genderPref, locRad});

            const {insta, fb, bio, ...leftover3} = leftover2;
            const extraInfo = Object.assign({}, {username: form.username}, {insta, fb, bio});

            const {password, ...leftover4} = leftover3;
            const authInfo = Object.assign({}, {username: form.username}, {password});

            await client.db("roomer").collection("basic").insertOne(basicInfo);
            await client.db("roomer").collection("housing").insertOne(housingInfo);
            await client.db("roomer").collection("preferences").insertOne(prefInfo);
            await client.db("roomer").collection("extra").insertOne(extraInfo);
            await client.db("roomer").collection("auth").insertOne(authInfo);
        } catch (e) {
            return new BadRequestError(`Posting ${form.username}'s registration request didn't go through.`);
        }
    }
}

module.exports = Roomer;
