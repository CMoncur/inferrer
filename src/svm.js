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

    Util.isNum(opts.passes) // TODO I don't think this param is necessary
      ? this.passes = opts.passes
      : this.passes = Defaults.SVM_OPTIONS.passes

    Util.isNum(opts.tolerance)
      ? this.tolerance = opts.tolerance
      : this.tolerance = Defaults.SVM_OPTIONS.tolerance

    // Training Properties
    this.x = [] // Examples
    this.y = [] // Labels
    this.m = 0 // Number of training vectors
    // TODO: Get rid of N.
    this.n = 0 // Dimension of vectors
    this.w = [] // Separating hyperplane
    this.b = 0 // Offset
    this.alphas = [] // Alphas
    this.errors = [] // Errors
  }

  classify () {
    return null // TODO
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
      changed = 0

      // Examine every example
      if (examineAll) {
        // TODO: Replace with this.m.forEach and an eslint exception
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
  }

  examine (i_2) {
    // TODO: Make these consts and pass them along to the step function
    // so that we don't have to store them globally in the class.
    this.y_2 = this.y[i_2]
    this.x_2 = this.x[i_2]
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
        if (a_i > 0 && a_i < this.c) {
          nonZeroNonCAlphas.push(i)
        }
      })

      // Second heuristic, attempt 1
      // console.log("when the fug: ", this.w)

      if (nonZeroNonCAlphas.length > 1) {
        // console.log("non_bound_idx: ", nonZeroNonCAlphas)
        let i_1, max = 0, stepSize

        nonZeroNonCAlphas.forEach((j) => {
          stepSize = Math.abs((this.errors[j] - this.y[j]) - this.e_2)
          // console.log("step size: ", stepSize)
          if (stepSize > max) {
            max = stepSize
            i_1 = j
            // console.log("i_1: ", i_1)
            // console.log("max: ", max)
          }
        })

        const isNum = Util.isNum(i_1)

        console.log("do we get here?: ", this.w)
        // console.log("i1 meets criteria: ", isNum)
        console.log("i1: ", i_1)
        console.log("i2: ", i_2)
        // console.log("step succeeded: ", second_heur_attempt)

        if (Util.isNum(i_1) && this.step(i_1, i_2)) {
          console.log("w after success: ", this.w)
          return 1
        }
      }

      // Second heuristic, attempt 2
      const randPartialSequence = Util.randSequence(nonZeroNonCAlphas)

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
      if ([8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6, 7].some((i) => this.step(i, i_2))) {
        // console.log("w when returned: ", this.w)
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
      a_1 = this.alphas[i_1],
      y_1 = this.y[i_1],
      x_1 = this.x[i_1],
      e_1 = this.cachedError(i_1),
      s = y_1 * this.y_2

    // console.log("i1: ", i_1)
    // console.log("i2: ", i_2)
    // console.log("a1: ", a_1)
    // console.log("y1: ", y_1)
    // console.log("X1: ", x_1)
    // console.log("E1: ", e_1)
    // console.log("s: ", s)

    let a_2New, l, h

    if (y_1 === this.y_2) {
      l = Math.max(0, this.a_2 + a_1 - this.c)
      h = Math.min(this.c, this.a_2 + a_1)
    }

    else {
      l = Math.max(0, this.a_2 - a_1)
      h = Math.min(this.c, this.c + this.a_2 - a_1)
    }

    // console.log("L: ", l)
    // console.log("H: ", h)

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

    // console.log("k11: ", k11)
    // console.log("k12: ", k12)
    // console.log("k22: ", k22)
    // console.log("eta: ", eta)

    if (eta > 0) {
      // Move this calculation to Formula
      a_2New = this.a_2 + this.y_2 * (e_1 - this.e_2) / eta

      if (a_2New < l) {
        a_2New = l
      }

      else if (a_2New > h) {
        a_2New = h
      }

      // console.log("a_2New: ", a_2New)
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

    // console.log("Change Negligible: ", changeNegligible)

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

    // console.log("a1_new: ", a_1New)
    // console.log("new_b: ", bNew)
    // console.log("delta_b: ", bChange)

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

    // console.log("delta1: ", y1a1a1x1)
    // console.log("delta2: ", y2a2a2x2)
    // console.log("new W: ", this.w)

    // TODO: Make a formula function for lagrange multipliers
    const lm1 = y_1 * (a_1New - a_1), lm2 = this.y_2 * (a_2New - this.a_2)

    // TODO: Replace with this.m.forEach and an eslint exception
    for (let i = 0; i < this.m; i++) {
      if (0 < this.alphas[i] && this.alphas[i] < this.c) {
        this.errors[i] += lm1 * this.kern(x_1, this.x[i]) + lm2
          * this.kern(this.x_2, this.x[i]) - bChange
      }
    }

    this.errors[i_1] = 0
    this.errors[i_2] = 0
    this.alphas[i_1] = a_1New
    this.alphas[i_2] = a_2New

    // console.log("alpha1: ", this.alphas[i_1])
    // console.log("alpha2: ", this.alphas[i_2])

    return true
  }

  // Returns cached error, otherwise finds SVM output
  cachedError (i) {
    // KKT condition -- make UTIL function -- known as THE BOUNDS CONSTRAINT
    if (0 < this.alphas[i] && this.alphas[i] < this.c) {
      return this.errors[i]
    }

    else {
      return (Formula.dotProduct(this.w, this.x[i]) - this.b) - this.y[i]
    }
  }

  hyperplane () {
    /*
    def compute_w(multipliers, X, y):
    return np.sum(multipliers[i] * y[i] * X[i] for i in range(len(y)))
    */

    // TODO: Make formula function
    return this.x.map((x_i, i) => {
      const multiplier = this.alphas[i] * this.y[i]

      return x_i.map((x) => multiplier * x)
    })
  }
}
