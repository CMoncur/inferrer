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

    Util.isKernel(opts.kernel)
      ? this.kernel = opts.kernel
      : this.kernel = Defaults.SVM_OPTIONS.kernel

    Util.isNum(opts.tolerance)
      ? this.tolerance = opts.tolerance
      : this.tolerance = Defaults.SVM_OPTIONS.tolerance
  }

  kern (v, w) {
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
      return x === 1 || x === -1
    })) {
      throw new TypeError("All classifications must be either 1 or -1")
    }

    // If data is sanitary, include as training data
    this.trained = false
    this.x = data.input // Training examples
    this.y = data.classification // Training classifications (labels)
    this.m = this.x.length // Amount of training examples
    this.w = Array(this.x[0].length).fill(0) // Separating hyperplane
    this.b = 0 // Offset
    this.alpha = Array(this.m).fill(0) // Alphas
    this.error = Array(this.m).fill(0) // Errors

    // Find hyperplane and offset using John C. Platt's SMO Algorithm
    let changed = 0, examineAll = true

    while (changed > 0 || examineAll) {
      changed = 0

      // Examine every example
      if (examineAll) {
        // eslint-disable-next-line no-unused-vars
        Array(this.m).fill(0).forEach((mi, i) => changed += this.examine(i))
      }

      // First heuristic
      else {
        this.alpha.forEach((a_i, i) => {
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

    this.trained = true
  }

  examine (i_2) {
    // TODO: Make these consts and pass them along to the step function
    // so that we don't have to store them globally in the class.
    this.y_2 = this.y[i_2]
    this.x_2 = this.x[i_2]
    this.a_2 = this.alpha[i_2]
    this.e_2 = this.cachedError(i_2)

    const nonZeroNonCAlpha = [], r_2 = this.e_2 * this.y_2

    if (
      // KKT conditions -- make UTIL function
      (r_2 < -this.tolerance && this.a_2 < this.c) ||
      (r_2 > this.tolerance && this.a_2 > 0)
    ) {
      // Tally non-zero and non-C alphas
      this.alpha.forEach((a_i, i) => {
        if (a_i > 0 && a_i < this.c) {
          nonZeroNonCAlpha.push(i)
        }
      })

      // Second heuristic, attempt 1
      if (nonZeroNonCAlpha.length > 1) {
        let i_1, max = 0, stepSize

        nonZeroNonCAlpha.forEach((j) => {
          stepSize = Math.abs((this.error[j] - this.y[j]) - this.e_2)

          if (stepSize > max) {
            max = stepSize
            i_1 = j
          }
        })

        if (Util.isNum(i_1) && this.step(i_1, i_2)) {
          return 1
        }
      }

      // Second heuristic, attempt 2
      const randPartialSequence = Util.randSequence(nonZeroNonCAlpha)

      // .some will cease execution once the first truthy value is called back
      if (randPartialSequence.some((i) => this.step(i, i_2))) {
        return 1
      }

      // Second heuristic, attempt 3
      // eslint-disable-next-line no-unused-vars
      const fullSequence = Array(this.m).fill(0).reduce((x, xs, idx) => {
        x.push(idx)

        return x
      }, [])

      const randFullSequence = Util.randSequence(fullSequence)

      // .some will cease execution once the first truthy value is called back
      if (randFullSequence.some((i) => this.step(i, i_2))) {
        return 1
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
    if (i_1 === i_2) {
      return false
    }

    // TODO: Make y_2, a_2, etc... parameters so that they don't have to be
    // stored globally in the class
    const
      a_1 = this.alpha[i_1],
      y_1 = this.y[i_1],
      x_1 = this.x[i_1],
      e_1 = this.cachedError(i_1),
      s = y_1 * this.y_2

    let a_2New, l, h

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

    // TODO: Combine this with const block above
    // TODO: Make these read k_11, k_12, k_22
    const
      k11 = this.kern(x_1, x_1),
      k12 = this.kern(x_1, this.x[i_2]),
      k22 = this.kern(this.x[i_2], this.x[i_2]),
      // Move this calculation to Formula
      eta = k11 + k22 - 2 * k12

    if (eta > 0) {
      // Move this calculation to Formula
      a_2New = this.a_2 + this.y_2 * (e_1 - this.e_2) / eta

      if (a_2New < l) {
        a_2New = l
      }

      else if (a_2New > h) {
        a_2New = h
      }
    }

    else {
      // TODO: f_1, f_2, l_1, h_1, psi_L, psi_H should all be moved to Formula
      const f_1 = y_1 * (e_1 + this.b) - a_1 * k11 - s * this.a_2 * k12

      const f_2 = this.y_2 * (this.e_2 + this.b) - s * a_1 * k12 - this.a_2
        * k22

      const l_1 = a_1 + s * (this.a_2 - l)

      const h_1 = a_1 + s * (this.a_2 - h)

      const psi_l = l_1 * f_1 + l * f_2 + 0.5 * Math.pow(l_1, 2) * k11
        + 0.5 * Math.pow(l, 2) * k22 + s * l * l_1 * k12

      const psi_h = h_1 * f_1 + h * f_2 + 0.5 * Math.pow(h_1, 2) * k11
        + 0.5 * Math.pow(h, 2) * k22 + s * h * h_1 * k12

      if (psi_l < psi_h - this.tolerance) {
        a_2New = l
      }

      else if (psi_l > psi_h + this.tolerance) {
        a_2New = h
      }

      else {
        a_2New = this.a_2
      }
    }

    // TODO make this a formula
    const changeNegligible = Math.abs(a_2New - this.a_2) < this.tolerance
      * (a_2New + this.a_2 + this.tolerance)

    if (changeNegligible) {
      return false
    }

    // Solve for B
    // TODO: Make formulae for solving for B
    const a_1New = a_1 + s * (this.a_2 - a_2New)

    let bNew

    const b_1 = e_1 + y_1 * (a_1New - a_1) * k11 + this.y_2
      * (a_2New - this.a_2) * k12 + this.b

    const b_2 = this.e_2 + y_1 * (a_1New - a_1) * k12 + this.y_2
      * (a_2New - this.a_2) * k22 + this.b

    if (0 < a_1 && a_1 < this.c) {
      bNew = b_1
    }

    else if (0 < this.a_2 && this.a_2 < this.c) {
      bNew = b_2
    }

    else {
      bNew = 0.5 * (b_1 + b_2)
    }

    const bChange = bNew - this.b

    this.b = bNew

    // Solve for W
    // TODO: Make this a formula function

    // TODO Give these better names and make them a formula
    const y1a1a1x1 = x_1.map((v) => {
      return y_1 * (a_1New - a_1) * v
    })

    const y2a2a2x2 = this.x_2.map((v) => {
      return this.y_2 * (a_2New - this.a_2) * v
    })

    this.w = Formula.vectorSum(this.w, Formula.vectorSum(y1a1a1x1, y2a2a2x2))

    // TODO: Make a formula function for lagrange multipliers
    const lm1 = y_1 * (a_1New - a_1), lm2 = this.y_2 * (a_2New - this.a_2)

    // eslint-disable-next-line no-unused-vars
    Array(this.m).fill(0).forEach((mi, i) => {
      if (0 < this.alpha[i] && this.alpha[i] < this.c) {
        this.error[i] += lm1 * this.kern(x_1, this.x[i]) + lm2
          * this.kern(this.x_2, this.x[i]) - bChange
      }
    })

    this.error[i_1] = 0
    this.error[i_2] = 0
    this.alpha[i_1] = a_1New
    this.alpha[i_2] = a_2New

    return true
  }

  // Returns cached error, otherwise finds SVM output
  cachedError (i) {
    // KKT condition -- make UTIL function -- known as THE BOUNDS CONSTRAINT
    if (0 < this.alpha[i] && this.alpha[i] < this.c) {
      return this.error[i]
    }

    return (Formula.dotProduct(this.w, this.x[i]) - this.b) - this.y[i]
  }

  classify (x) {
    if (!this.trained) {
      const errMsg = `
        Cannot classify vector input with an SVM that has not yet been trained
      `

      throw new Error(errMsg)
    }

    // Using a negative for 'b' because we use the w * x - b = 0 variation
    return Formula.hypothesis(this.w, x, -this.b)
  }

  hyperplane () {
    if (!this.trained) {
      const errMsg = `
        The SVM being referenced has not been trained, and therefore contains
        no hyperplane
      `

      throw new Error(errMsg)
    }

    return this.w
  }

  offset () {
    if (!this.trained) {
      const errMsg = `
        The SVM being referenced has not been trained, and therefore contains
        no computed 'b' offset value
      `

      throw new Error(errMsg)
    }

    return this.b
  }
}
