// Dependencies
const Defaults = require("../env/defaults")
const Kernel = require("./kernel")
const Util = require("./util")

/* The SVM class is based on John C. Platt's SMO algorithm. The documentation
** thereunto pertaining can be found here:
** https://microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-98-14.pdf
*/
module.exports = class Svm {
  constructor (opts = {}) {
    // Optional Properties (Public)
    Util.isNum(opts.c)
      ? this.c = opts.c
      : this.c = Defaults.SVM_OPTIONS.c

    Util.isNum(opts.iterations) // TODO I don't think this param is necessary
      ? this.iterations = opts.iterations
      : this.iterations = Defaults.SVM_OPTIONS.iterations

    Util.isKernel(opts.kernel)
      ? this.kernel = opts.kernel
      : this.kernel = Defaults.SVM_OPTIONS.kernel

    Util.isNum(opts.passes)
      ? this.passes = opts.passes
      : this.passes = Defaults.SVM_OPTIONS.passes

    Util.isNum(opts.tolerance)
      ? this.tolerance = opts.tolerance
      : this.tolerance = Defaults.SVM_OPTIONS.tolerance

    // Training Properties (Private)
    this.x = [] // Examples
    this.y = [] // Labels
    this.m = 0 // Number of training examples
    this.alphas = [] // Alphas
  }

  classify () {
    return null // TODO
  }

  kernel (v, w) {
    // TODO: Implement other kernel functions
    if (this.kernel === "linear") {
      return Kernel.linear(v, w)
    }

    // Default to linear kernel function
    return Kernel.linear(v, w)
  }

  /* alias TrainingData =
  **   {
  **     input: [ [ Number ] ],
  **     classification: [ Number ],
  **   }
  */
  // train :: TrainingData -> Void
  train (data) {
    // Check data to ensure it is properly formed, expects the following:
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
    this.m = this.x.length
    this.alphas = Array(this.m).fill(0) // Array of 'm' length filled with 0s

    // Find hyperplane and offset using John C. Platt's SMO Algorithm
    let changed = 0, examineAll = true

    while (changed > 0 || examineAll) {
      changed = 0

      // Examine every example
      if (examineAll) {
        for (let i = 0; i < this.m; i++) {
          changed += this.examine(i)
        }
      }

      // Find indices of alphas that are greater than zero and less than C
      else {
        this.alphas.forEach((a_i, i) => {
          if (a_i !== 0 && a_i < this.c) {
            this.examine(i)
          }
        })
      }

      if (examineAll) {
        examineAll = false
      }

      else if (changed === 0) {
        examineAll = true
      }
    }
  }

  examine (i_2) {
    const y_2 = this.y[i_2]

    return i_2
  }
}
