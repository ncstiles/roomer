const axios = require("axios");
const { googleApiKey, rentOptions, ageOptions } = require("../consts");
class Match {
  constructor(currentUser) {
    this.units = "imperial";
    this.apiKey = googleApiKey;
    this.allUserInfo = [];
    this.locations = [];
    this.currentUser = currentUser;
    this.destinations = "";
    this.origin = "";
    this.normalizedDistances = [];
    this.rentScore = [];
    this.ageScore = [];
    this.genderScore = [];
    this.overallScore = [];
    this.sortedBasicInfo = [];
  }

  /**
   * Given a user object, get its URI-encoded location.  Either set this location as
   * the origin location or add as one of the destination locations.
   *
   * @param {Object} user the user object from the db containing housing and location info
   * @param {array} locations a list of URI-encoded strings containing other users address, city, and state
   */
  addInfo(user, locations) {
    const cityEncoded = encodeURIComponent(user.city);
    const stateEncoded = encodeURIComponent(user.state);

    //address is an optional field
    const addrEncoded = user.addr ? encodeURIComponent(user.addr) : undefined;

    // if current user is the logged in user then its location goes into the origin
    if (user.username === this.currentUser) {
      this.origin = addrEncoded
        ? `${addrEncoded},${cityEncoded},${stateEncoded}`
        : `${cityEncoded},${stateEncoded}`;
    }
    // all other locations are destinations
    else {
      addrEncoded
        ? locations.push(`${addrEncoded},${cityEncoded},${stateEncoded}`)
        : locations.push(`${cityEncoded},${stateEncoded}`);
    }
  }

  /**
   * Normalize `distances` to fall bewteen 0.5 and 1.
   * Formula for normalization between [0,1]: (x - min) / (max - min)
   *
   * The smallest distance between origin and destination is desired result.
   * Therefore, it should have score closest to 1.  Modify normalization accordingly:
   * Inverted normalization between [0,1]: 1 - (x - min) / (max - min)
   *
   * To get between [0, 0,5]: 0.5 * (1 - (x - min) / (max - min))
   *
   * To shift to get between [0.5, 1]: 0.5 + 0.5 * (1 - (x - min) / (max - min))
   *
   * @param {*} distances list of distances between the origin and all the destination locations
   */
  distanceMatch(distances) {
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    this.normalizedDistances = distances.map(
      (distance) =>
        0.5 + 0.5 * (1 - (distance - minDistance) / (maxDistance - minDistance))
    );
  }

  /**
   * Make a GET request to get all db users' relevant preference and housing info.
   * Then, make another get request to get the normalized distances between the origin and all destination locations.
   */
  async getDistanceInfo() {
    const res = await axios({
      method: "get",
      url: "http://localhost:3001/matchInfo",
    });
    const locations = [];
    this.allUserInfo = res.data.matchInfo;
    this.allUserInfo.map((user) => this.addInfo(user, locations));
    this.destinations = locations.join("|");
    return await this.makeDistanceRequest();
  }

  /**
   * Given an origin location and all the destination locations, determine the distance in meters between
   * the origin and each destination location
   */
  async makeDistanceRequest() {
    const distances = [];
    const res = await axios({
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${this.destinations}&origins=${this.origin}&units=${this.units}&key=${this.apiKey}`,
    });
    const distanceDurationArr = res.data.rows[0].elements;
    distanceDurationArr.map((distanceDuration) => {
      distances.push(distanceDuration.distance.value);
    });
    return this.calculateCategoryScores(distances);
  }

  /**
   * Calculate the difference in rent ranges between the current user and all other users
   * Assign a rental score depending on the difference between the users' rent range preferences.
   */
  rentMatch() {
    let currentUserRent = null;
    let othersRent = [];

    // put user's rent ranges into buckets
    this.allUserInfo.map((user) => {
      if (user.username == this.currentUser) {
        currentUserRent = rentOptions[user.rentRange];
      } else {
        othersRent.push(rentOptions[user.rentRange]);
      }
    });

    //based on difference in buckets, calculate rent score
    this.rentScore = othersRent.map((otherUserRent) => {
      if (otherUserRent === currentUserRent) {
        return 1;
      } else if (otherUserRent > currentUserRent) {
        return 0.6 - 0.1 * (otherUserRent - currentUserRent);
      } else {
        return 1 - 0.1 * (currentUserRent - otherUserRent);
      }
    });
  }

  /**
   * Return the age bucket number that this user is in
   *
   * @param {*} age User A's age
   */
  ageCategory(age) {
    if (age < 18) {
      return 1;
    } else if (age <= 22) {
      return 2;
    } else if (age <= 26) {
      return 3;
    } else if (age <= 35) {
      return 4;
    } else if (age <= 50) {
      return 5;
    } else if (age <= 65) {
      return 6;
    } else {
      return 7;
    }
  }

  /**
   * Calculate each user's age score, which depends on the total difference between
   * the current user's age and the other user's age preference and vice versa.
   */
  ageMatch() {
    let currentAge = null;
    let currentAgePref = null;
    let othersAge = [];
    let othersAgePref = [];

    // assign each user's age and age preference to a bucket number
    this.allUserInfo.map((user) => {
      if (user.username == this.currentUser) {
        currentAge = this.ageCategory(Number(user.age));
        currentAgePref = ageOptions[user.agePref];
      } else {
        othersAge.push(this.ageCategory(Number(user.age)));
        othersAgePref.push(ageOptions[user.agePref]);
      }
    });

    // use the differences in the bucket numbers to assign a score
    this.ageScore = othersAge.map((otherAge, ix) => {
      const userPrefDiff = Math.abs(otherAge - currentAgePref) / 10;
      const otherPrefDiff = Math.abs(currentAge - othersAgePref[ix]) / 10;

      return 1 - (userPrefDiff + otherPrefDiff);
    });
  }

  /**
   * Calculate each user's gender score which depends on whether there is an exact
   * match between the two user's gender and gender preference
   */
  genderMatch() {
    let currentGender = null;
    let currentGenderPref = null;
    let othersGender = [];
    let othersGenderPref = [];

    //get current user's gender and gender preference
    this.allUserInfo.map((user) => {
      if (user.username === this.currentUser) {
        currentGender = user.gender;
        currentGenderPref = user.genderPref;
      } else {
        othersGender.push(user.gender);
        othersGenderPref.push(user.genderPref);
      }
    });

    // calculate gender match score
    this.genderScore = othersGender.map((otherGender, ix) => {
      return currentGender === othersGenderPref[ix] &&
        otherGender === currentGenderPref
        ? 1
        : 0.5;
    });
  }

  /**
   * Given the distance, rent, age, and gender score for each user, calculate their overall score
   */
  getOverallScore() {
    this.overallScore = this.normalizedDistances.map((distanceScore, ix) => {
      return (
        0.5 * distanceScore +
        0.25 * this.rentScore[ix] +
        0.125 * this.ageScore[ix] +
        0.125 * this.genderScore[ix]
      );
    });
  }

  /**
   * Given all the user info, sort the users and return the usernames in score order from largest to smallest
   */
  sortBasicInfo() {
    const infoWithRanking = this.allUserInfo
      .filter((userInfo) => userInfo.username !== this.currentUser)
      .map((userInfo, ix) => {
        return { userInfo: userInfo, val: this.overallScore[ix] };
      });

    infoWithRanking.sort((a, b) => {
      return b.val - a.val;
    });

    this.sortedBasicInfo = infoWithRanking.map((info) => {
      return {
        username: info.userInfo.username,
        firstName: info.userInfo.firstName,
        age: info.userInfo.age,
        gender: info.userInfo.gender,
        occupation: info.userInfo.occupation,
        score: info.val,
        pfpSrc: info.userInfo.pfpSrc,
        contentType: info.userInfo.contentType,
      };
    });
    return this.sortedBasicInfo;
  }

  /**
   * Get each subsection score - distance, rent, age, and gender - for each user.
   * Use this information to create a total score, and then return usernames from highest to lowest score.
   *
   * @param {array[Number]} distances The raw distances in meters between each origin and desitination location
   */
  calculateCategoryScores(distances) {
    this.distanceMatch(distances);
    this.rentMatch();
    this.ageMatch();
    this.genderMatch();
    this.getOverallScore();
    return this.sortBasicInfo();
  }
}

module.exports = Match;
