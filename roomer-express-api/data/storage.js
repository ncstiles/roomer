const path = require("path")
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

class Storage {
  constructor() {
    this.path = path.resolve(__dirname, "db.json")
    this.setup()
  }

  async setup() {
    const adapter = new FileSync(this.path)
    this.db = low(adapter)
    this.db.defaults({ basic:[], housing:[], preferences:[], extra:[], auth:[]}).write()
  }

  add(key, value) {
    return this.db.get(key).push(value).write();
  }

  get(key) {
    return this.db.get(key).value()
  }
}

module.exports = {
  storage: new Storage(),
}
