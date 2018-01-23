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

    Util.isNum(opts.gamma)
      ? this.gamma = opts.gamma
      : this.gamma = Defaults.SVM_OPTIONS.gamma

    Util.isKernel(opts.kernel)
      ? this.kernel = opts.kernel
      : this.kernel = Defaults.SVM_OPTIONS.kernel

    Util.isNum(opts.tolerance)
      ? this.tolerance = opts.tolerance
      : this.tolerance = Defaults.SVM_OPTIONS.tolerance

    this.trained = false
  }

  kern (v, w) {
    // TODO: Implement polynomial kernel functions
    switch (this.kernel) {
      case "gaussian":
        return Kernel.gaussian(v, w, this.gamma)

      case "linear":
        return Kernel.linear(v, w)

      default:
        return Kernel.linear(v, w) // Default to linear kernel function
    }
  }

  /* alias TrainingData =
  **   [ { input: [ Number ], classification: Number } ]
  */
  // train :: TrainingData -> Void
  train (data) {
    // Check data to ensure it is properly formed, expects the following:
    if (!Util.isArr(data) || !data.every((x) => x instanceof Object)) {
      const errMsg = `
        Inferrer requires training data in the form of a list of objects,
        each containing input and classification keys
      `

      throw new TypeError(errMsg)
    }

    if (!data.every((x) => x.input.length === data[0].input.length)) {
      throw new TypeError("All input vectors must be of equal length")
    }

    if (!data.every((x) => x.classification === 1 || x.classification === -1)) {
      throw new TypeError("Every classification must be either 1 or -1")
    }

    // If data is sanitary, include as training data
    this.x = data.map((x) => x.input) // Training examples
    this.y = data.map((x) => x.classification) // Training labels
    this.m = this.x.length // Amount of training examples
    this.w = Array(this.x[0].length).fill(0) // Linear hyperplane
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
        this.alpha.forEach((ai, i) => {
          if (ai !== 0 && ai !== this.c) {
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

  examine (i2) {
    this.y2 = this.y[i2]
    this.x2 = this.x[i2]
    this.a2 = this.alpha[i2]
    this.e2 = this.cachedError(i2)

    const nonZeroNonCAlpha = [], r2 = this.e2 * this.y2

    if (
      // KKT conditions
      (r2 < -this.tolerance && this.a2 < this.c) ||
      (r2 > this.tolerance && this.a2 > 0)
    ) {
      // Tally non-zero and non-C alphas
      this.alpha.forEach((ai, i) => {
        if (ai > 0 && ai < this.c) {
          nonZeroNonCAlpha.push(i)
        }
      })

      // Second heuristic, attempt 1
      if (nonZeroNonCAlpha.length > 1) {
        let i1, max = 0, stepSize

        nonZeroNonCAlpha.forEach((j) => {
          stepSize = Math.abs((this.error[j] - this.y[j]) - this.e2)

          if (stepSize > max) {
            max = stepSize
            i1 = j
          }
        })

        if (Util.isNum(i1) && this.step(i1, i2)) {
          return 1
        }
      }

      // Second heuristic, attempt 2
      const randPartialSequence = Util.randSequence(nonZeroNonCAlpha)

      // .some will cease execution once the first truthy value is called back
      if (randPartialSequence.some((i) => this.step(i, i2))) {
        return 1
      }

      // Second heuristic, attempt 3
      // eslint-disable-next-line no-unused-vars
      const fullSequence = Array(this.m).fill(0).reduce((x, xs, i) => {
        x.push(i)

        return x
      }, [])

      const randFullSequence = Util.randSequence(fullSequence)

      // .some will cease execution once the first truthy value is called back
      if (randFullSequence.some((i) => this.step(i, i2))) {
        return 1
      }
    }

    // If step is not taken, return 0 as amount of steps taken
    return 0
  }

  step(i1, i2) {
    // Occurs in rare cases if all step sizes from second heuristic are < 0
    if (!Util.isNum(i1)) {
      return false
    }

    // If both indices are the same, don't step
    if (i1 === i2) {
      return false
    }

    const
      a1 = this.alpha[i1],
      y1 = this.y[i1],
      x1 = this.x[i1],
      e1 = this.cachedError(i1),
      s = y1 * this.y2,
      k11 = this.kern(x1, x1),
      k12 = this.kern(x1, this.x[i2]),
      k22 = this.kern(this.x[i2], this.x[i2]),
      eta = k11 + k22 - 2 * k12

    let a2New, l, h

    if (y1 === this.y2) {
      l = Math.max(0, this.a2 + a1 - this.c)
      h = Math.min(this.c, this.a2 + a1)
    }

    else {
      l = Math.max(0, this.a2 - a1)
      h = Math.min(this.c, this.c + this.a2 - a1)
    }

    if (l === h) {
      return false
    }

    if (eta > 0) {
      a2New = this.a2 + this.y2 * (e1 - this.e2) / eta

      if (a2New < l) {
        a2New = l
      }

      else if (a2New > h) {
        a2New = h
      }
    }

    else {
      const
        f1 = y1 * (e1 + this.b) - a1 * k11 - s * this.a2 * k12,
        f2 = this.y2 * (this.e2 + this.b) - s * a1 * k12 - this.a2 * k22,
        l1 = a1 + s * (this.a2 - l),
        h1 = a1 + s * (this.a2 - h)

      const psiL = l1 * f1 + l * f2 + 0.5 * Math.pow(l1, 2) * k11
        + 0.5 * Math.pow(l, 2) * k22 + s * l * l1 * k12

      const psiH = h1 * f1 + h * f2 + 0.5 * Math.pow(h1, 2) * k11
        + 0.5 * Math.pow(h, 2) * k22 + s * h * h1 * k12

      if (psiL < psiH - this.tolerance) {
        a2New = l
      }

      else if (psiL > psiH + this.tolerance) {
        a2New = h
      }

      else {
        a2New = this.a2
      }
    }

    const changeNegligible = Math.abs(a2New - this.a2) < this.tolerance
      * (a2New + this.a2 + this.tolerance)

    if (changeNegligible) {
      return false
    }

    // Solve for B
    let bNew

    const a1New = a1 + s * (this.a2 - a2New)

    const b1 = e1 + y1 * (a1New - a1) * k11 + this.y2
      * (a2New - this.a2) * k12 + this.b

    const b2 = this.e2 + y1 * (a1New - a1) * k12 + this.y2
      * (a2New - this.a2) * k22 + this.b

    if (0 < a1 && a1 < this.c) {
      bNew = b1
    }

    else if (0 < this.a2 && this.a2 < this.c) {
      bNew = b2
    }

    else {
      bNew = 0.5 * (b1 + b2)
    }

    const bChange = bNew - this.b

    this.b = bNew

    // Solve for W
    if (this.kernel === "linear") {
      const wlm1 = x1.map((v) => {
        return y1 * (a1New - a1) * v
      })

      const wlm2 = this.x2.map((v) => {
        return this.y2 * (a2New - this.a2) * v
      })

      this.w = Formula.vectorSum(this.w, Formula.vectorSum(wlm1, wlm2))
    }

    // Update error cache
    const lm1 = y1 * (a1New - a1), lm2 = this.y2 * (a2New - this.a2)

    // eslint-disable-next-line no-unused-vars
    Array(this.m).fill(0).forEach((mi, i) => {
      if (0 < this.alpha[i] && this.alpha[i] < this.c) {
        this.error[i] += lm1 * this.kern(x1, this.x[i]) + lm2
          * this.kern(this.x2, this.x[i]) - bChange
      }
    })

    this.error[i1] = 0
    this.error[i2] = 0
    this.alpha[i1] = a1New
    this.alpha[i2] = a2New

    return true
  }

  // Returns cached error, otherwise finds SVM output
  cachedError (i) {
    // KKT condition, the bounds constraint
    if (0 < this.alpha[i] && this.alpha[i] < this.c) {
      return this.error[i]
    }

    if (this.kernel === "linear") {
      return (Formula.dotProduct(this.w, this.x[i]) - this.b) - this.y[i]
    }

    return this.nonLinearOutput(i) - this.y[i]
  }

  nonLinearOutput (i) {
    const output = this.alpha.map((aj, j) => {
      return aj * this.y[j] * this.kern(this.x[j], this.x[i])
    }).reduce((x, xs) => x + xs, 0)

    return output - this.b
  }

  classify (x) {
    if (!this.trained) {
      const errMsg = `
        Cannot classify vector input with an SVM that has not yet been trained
      `

      throw new Error(errMsg)
    }

    // Using a negative for 'b' because we use the w * x - b = 0 formula
    if (this.kernel === "linear") {
      return Formula.hypothesis(this.w, x, -this.b)
    }

    const margin = this.alpha.reduce((a, as, i) => {
      return a + (as * this.y[i] * this.kern(x, this.x[i]))
    }, -this.b)

    return Formula.sign(margin)
  }

  classifyList (xs) {
    return xs.map((x) => this.classify(x))
  }

  hyperplane () {
    if (!this.trained) {
      const errMsg = `
        The SVM being referenced has not been trained, and therefore contains
        no hyperplane
      `

      throw new Error(errMsg)
    }

    if (this.kernel === "linear") {
      return this.w
    }

    // If linear kernel isn't being used, return Lagrange multipliers
    return this.alpha
  }

  offset () {
    if (!this.trained) {
      const errMsg = `
        The SVM being referenced has not been trained, and therefore contains
        no computed 'b' offset value
      `

      throw new Error(errMsg)
    }

    // Using a negative for 'b' because we use the w * x - b = 0 formula
    return -this.b
  }
}
