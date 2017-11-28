// Internal Dependencies
const Defaults = require("../env/defaults")

module.exports = class Svm {
  constructor (opts = {
    yeah: Defaults.SVM_OPTIONS.yeah,
  }) {
    this.yeah = opts.yeah
  }

  cheer () {
    console.log(this.yeah)
  }

  train () {
    return null
  }

  predict () {
    return null
  }
}
