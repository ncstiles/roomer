const axios = require("axios");
const { googleApiKey } = require("../consts");
class Match {
  constructor(currentUser) {
    this.units = "imperial";
    this.apiKey = googleApiKey;
    this.locations = [];
    this.normalizedDistances = [];
    this.currentUser = currentUser;
    this.destinations = "";
    this.origin = "";
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
   * Make a GET request to get all db users' relevant preference and housing info.
   * Use the info returned to get the requisite origin/ destination values to send to Google's distance matrix API
   */
   async getDBInfo() {
    axios({
      method: "get",
      url: "http://localhost:3001/getMatchInfo",
    })
      .then((res) => {
        const locations = [];
        res.data.matchInfo.map((user) => this.addInfo(user, locations));
        this.destinations = locations.join("|");
      })
  }
}

async function main() {
  const nstiles = new Match("nstiles");
  nstiles.getDBInfo();
}

main();
