// Dependencies
const Defaults = require("../env/defaults")

module.exports = class Svm {
  constructor (opts = {
    yeah: Defaults.SVM_OPTIONS.yeah,
  }) {
    this.yeah = opts.yeah
  }

  train () {
    return null // TODO
  }

  predict () {
    return null // TODO
  }
}
