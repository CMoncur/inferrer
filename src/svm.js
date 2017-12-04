// Dependencies
const Defaults = require("../env/defaults")
const Formula = require("./formula")
const Kernel = require("./kernel")
const Util = require("./util")

/* The SVM class is based on John C. Platt's SMO algorithm. The documentation
** thereunto pertaining can be found here:
** https://microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-98-14.pdf
*/
module.exports = class Svm {
  constructor (opts = {}) {
    // Optional Properties
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

    // Training Properties
    this.x = [] // Examples
    this.y = [] // Labels
    this.m = 0 // Number of training vectors
    this.n = 0 // Dimension of vectors
    this.w = [] // Separating hyperplane
    this.b = 0 // Offset
    this.alphas = [] // Alphas
    this.errors = [] // Errors
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
    this.n = this.x[0].length
    this.w = Array(this.n).fill(0)
    this.alphas = Array(this.m).fill(0) // TODO: get rid of pluralization
    this.errors = Array(this.m).fill(0) // TODO: get rid of pluralization

    // Find hyperplane and offset using John C. Platt's SMO Algorithm
    let changed = 0, examineAll = true

    while (changed > 0 || examineAll) {
      console.log("CHANGED: ", changed)
      console.log("EXAMINE ALL: ", examineAll)
      changed = 0

      // Examine every example
      if (examineAll) {
        for (let i = 0; i < this.m; i++) {
          changed += this.examine(i)
        }
      }

      // First heuristic
      else {
        this.alphas.forEach((a_i, i) => {
          if (a_i !== 0 && a_i !== this.c) {
            changed += this.examine(i)
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

    console.log("Changed: ", changed)
  }

  examine (i_2) {
    // TODO: Make these consts and pass them along to the step function
    // so that we don't have to store them globally in the class.
    this.y_2 = this.y[i_2]
    this.a_2 = this.alphas[i_2]
    this.e_2 = this.cachedError(i_2)

    const nonZeroNonCAlphas = [], r_2 = this.e_2 * this.y_2

    if (
      // KKT conditions -- make UTIL function
      (r_2 < -this.tolerance && this.a_2 < this.c) ||
      (r_2 > this.tolerance && this.a_2 > 0)
    ) {
      // Tally non-zero and non-C alphas
      this.alphas.forEach((a_i, i) => {
        if (a_i !== 0 && a_i !== this.c) {
          nonZeroNonCAlphas.push(i)
        }
      })

      // Second heuristic, attempt 1
      if (nonZeroNonCAlphas > 1) {
        let i_1, max = 0, stepSize

        nonZeroNonCAlphas.forEach((j) => {
          stepSize = Math.abs((this.errors[j] - this.y[j]) - this.e_2)
          if (stepSize > max) {
            max = stepSize
            i_1 = j
          }
        })

        if (this.step(i_1, i_2)) {
          return 1
        }
      }

      // Second heuristic, attempt 2
      let randA_i = Math.floor(Math.random() * nonZeroNonCAlphas.length)
      for (randA_i; randA_i < nonZeroNonCAlphas.length; randA_i++) {
        if (this.step(nonZeroNonCAlphas[randA_i], i_2)) {
          return 1
        }
      }

      // Second heuristic, attempt 3
      let rand_i = Math.floor(Math.random() * this.m)
      for (rand_i; rand_i < this.m; rand_i++) {
        if (this.step(rand_i, i_2)) {
          return 1
        }
      }
    }

    // If step is not taken, return 0 as amount of steps taken
    return 0
  }

  step(i_1, i_2) {
    // Occurs in rare cases if all step sizes from second heuristic are < 0
    if (!Util.isNum(i_1)) {
      return false
    }

    // If both indices are the same, don't step
    if (i_1, i_2) {
      return false
    }

    // TODO: Make y_2, a_2, etc... parameters so that they don't have to be
    // stored globally in the class
    const
      a_1 = this.alphas[i_1],
      y_1 = this.y[i_1],
      x_1 = this.x[i_1],
      e_1 = this.cachedError(i_1),
      s = this.y_1 * this.y_2

    let l, h

    if (y_1 === this.y_2) {
      l = Math.max(0, this.a_2 + a_1 - this.c)
      h = Math.min(this.c, this.a_2 + a_1)
    }

    else {
      l = Math.max(0, this.a_2 - a_1)
      h = Math.min(this.c, this.c + this.a_2 - a_1)
    }

    if (l === h) {
      return false
    }

    const
      k11 = this.kernel(x_1, x_1),
      k12 = this.kernel(x_1, this.x[i_2]),
      k22 = this.kernel(this.x[i_2], this.x[i_2]),
      eta = k11 + k22 - 2 * k12

    return true
  }

  // Returns cached error, otherwise finds SVM output
  cachedError (i) {
    // KKT condition -- make UTIL function
    if (0 < this.alphas[i] && this.alphas[i] < this.c) {
      return this.errors[i]
    }

    else {
      return this.output(i) - this.y[i]
    }
  }

  // TODO: Make UTIL function
  output (i) {
    return Formula.dotProduct(this.w, this.x[i]) - this.b
  }
}
