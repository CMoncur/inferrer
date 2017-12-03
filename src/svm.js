// Dependencies
const Defaults = require("../env/defaults")

// alias trainingData = { x: [ [ Number ] ], y: [ Number ] }
module.exports = class Svm {
  constructor (
    trainingData,
    c = Defaults.SVM_OPTIONS.c,
    kernel = Defaults.SVM_OPTIONS.kernel,
    passes = Defaults.SVM_OPTIONS.passes,
    tolerance = Defaults.SVM_OPTIONS.tolerance,
  ) {
    // Required Parameters
    if (!Array.isArray(trainingData.x) || !Array.isArray(trainingData.y)) {
      const errMsg = `
        SVM requires training data in the form of a list of lists of numbers,
        and a list of numbers
      `
      throw new TypeError(errMsg)
    }

    this.x = trainingData.y
    this.y = trainingData.y

    // Optional Parameters
    this.c = c
    this.kernel = kernel
    this.passes = passes
    this.tolerance = tolerance
  }

  train () {
    return null // TODO
  }

  predict () {
    return null // TODO
  }
}
