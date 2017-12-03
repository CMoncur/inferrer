// Dependencies
const Defaults = require("../env/defaults")
const Util = require("./util")

module.exports = class Svm {
  constructor (opts = {}) {
    // Optional Properties
    if (Util.isNum(opts.c)) {
      this.c = opts.c
    } else {
      this.c = Defaults.SVM_OPTIONS.c
    }

    if (Util.isKernel(opts.kernel)) {
      this.kernel = opts.kernel
    } else {
      this.kernel = Defaults.SVM_OPTIONS.kernel
    }

    if (Util.isNum(opts.passes)) {
      this.passes = opts.passes
    } else {
      this.passes = Defaults.SVM_OPTIONS.passes
    }

    if (Util.isNum(opts.tolerance)) {
      this.tolerance = opts.tolerance
    } else {
      this.tolerance = Defaults.SVM_OPTIONS.tolerance
    }

    // Training Properties
    this.x = []
    this.y = []
  }

  predict () {
    return null // TODO
  }

  /* type alias TrainingData =
  **   { input: [ [ Number ] ], classification: [ Number ] }
  */
  // train :: TrainingData -> Void
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
      throw new TypeError("All input vectors must be of equal length")
    }

    if(!data.classification.every((x) => {
      return x === 1 || x === 0 || x === -1
    })) {
      throw new TypeError("All classifications must be either 1, 0, or -1")
    }

    // If data is sanitary, include as training data
    this.x = this.x.concat(data.input)
    this.y = this.y.concat(data.classification)

    console.log(this.c)

    return null // TODO
  }
}
