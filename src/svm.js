// Dependencies
const Defaults = require("../env/defaults")
const Util = require("./util")

module.exports = class Svm {
  constructor (opts = {
    c: Defaults.SVM_OPTIONS.c,
    kernel: Defaults.SVM_OPTIONS.kernel,
    passes: Defaults.SVM_OPTIONS.passes,
    tolerance: Defaults.SVM_OPTIONS.tolerance,
  }) {
    // Optional Properties
    this.c = opts.c
    this.kernel = opts.kernel
    this.passes = opts.passes
    this.tolerance = opts.tolerance

    // Training Properties
    this.x = []
    this.y = []
  }

  // alias data = { input: [ [ Number ] ], classification: [ Number ] }
  train (data) {
    // Check data to ensure it is properly formed
    if (!Util.isArr(data.input) || !Util.isArr(data.classification)) {
      const errMsg = `
        SVM requires training data in the form of a list of lists of numbers,
        and a list of numbers
      `

      throw new TypeError(errMsg)
    }

    if (data.input.length !== data.classification.length) {
      const errMsg = `
        The lists of training inputs and their respective training outputs
        must be equal in length
      `

      throw new TypeError(errMsg)
    }

    if(!data.input.every((x) => x.length === data.input[0].length)) {
      throw new TypeError("All training input vectors must be of equal length")
    }

    if(!data.classification.every((x) => {
      return x === 1 || x === 0 || x === -1
    })) {
      const errMsg = "Training classifications must be either 1, 0, or -1"

      throw new TypeError(errMsg)
    }

    // If data is sanitary, include as training data
    this.x = this.x.concat(data.input)
    this.y = this.y.concat(data.classification)

    return null // TODO
  }

  predict () {
    return null // TODO
  }
}
