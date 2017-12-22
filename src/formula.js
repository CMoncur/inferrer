module.exports = {
  direction,
  dotProduct,
  euclideanDistance,
  euclideanDistanceSquared,
  geometricMargin,
  hypothesis,
  magnitude,
  sign,
  vectorDiff,
  vectorSum,
}

// Dependencies
const Util = require("./util")

/* Given a vector returns a vector that indicates the direction of the first.
**
** In the simplest terms, direction of a vector is equal to the cosine of
** it's angles. Also known as a unit vector of the original.
*/
// direction :: [ Number ] -> [ Number ]
function direction (v) {
  if (!Util.isArr(v)) {
    throw new TypeError("Direction expects an array of numbers")
  }

  if (!v.every((x) => Util.isNum(x))) {
    throw new TypeError("Direction expects an array of numbers")
  }

  const mag = magnitude(v)

  return v.map((x) => x / mag)
}

/* Given two equal-sized arrays of numbers, the dot product is defined as the
** sum of products of each of the array items.
*/
// dotProduct :: [ Number ], [ Number ] -> Number
function dotProduct (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Dot Product expects two equal-sized arrays")
  }

  if (!Util.isArr(v) || !Util.isArr(w)) {
    throw new TypeError("Dot Product expects two arrays of numbers")
  }

  if ((!v.every((x) => Util.isNum(x))) || (!w.every((x) => Util.isNum(x)))) {
    const errMsg = "Arrays passed to Dot Product must contain only numbers"

    throw new TypeError(errMsg)
  }

  return v
    .map((x, idx) => x * w[idx])
    .reduce((x, xs) => x + xs, 0)
}

/* The Euclidean distance function will return a straight-line distance
** between two points.
*/
// euclideanDistance :: [ Number ] -> [ Number ] -> Number
function euclideanDistance (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Euclidean Distance expects two equal-sized arrays")
  }

  if (!Util.isArr(v) || !Util.isArr(w)) {
    throw new TypeError("Euclidean Distance expects two arrays of numbers")
  }

  if ((!v.every((x) => Util.isNum(x))) || (!w.every((x) => Util.isNum(x)))) {
    const errMsg = `
      Arrays passed to Euclidean Distance must contain only numbers
    `

    throw new TypeError(errMsg)
  }

  return Math.sqrt(euclideanDistanceSquared(v, w))
}

/* The Euclidean distance squared function follows the same logic as the
** Euclidean distance function, with the exception that we do not square root
** the result. It is a key component in the Gaussian (RBF) kernel.
*/
// euclideanDistanceSquared :: [ Number ] -> [ Number ] -> Number
function euclideanDistanceSquared (v, w) {
  if (v.length !== w.length) {
    const errMsg = "Euclidean Distance Squared expects two equal-sized arrays"

    throw new TypeError(errMsg)
  }

  if (!Util.isArr(v) || !Util.isArr(w)) {
    const errMsg = "Euclidean Distance Squared expects two arrays of numbers"

    throw new TypeError(errMsg)
  }

  if ((!v.every((x) => Util.isNum(x))) || (!w.every((x) => Util.isNum(x)))) {
    const errMsg = `
      Arrays passed to Euclidean Distance Squared must contain only numbers
    `

    throw new TypeError(errMsg)
  }

  return v.reduce((x, xs, idx) => x + Math.pow((xs - w[idx]), 2), 0)
}

/* The geometric margin is used to calculate the distance between a given
** vector and a hyperplane. In this context, w represents our examples, y
** represents the classifications of w, and v represents our separating
** hyperplane.
*/
// geometricMargin :: [ Number ], [ [ Number ] ], [ Number ], Number -> Number
function geometricMargin (v, w, y, b) {
  if (!Util.isArr(v) || !Util.isArr(w) || !Util.isArr(y) || !Util.isNum(b)) {
    throw new TypeError("Geometric Margin expects three arrays and a number")
  }

  if (!y.every((x) => x == 1 || x == -1)) {
    throw new TypeError("Geometric Margin expects 'y' to be either 1 or -1")
  }

  const exampleMargin = (wi, yi) => {
    return yi * (dotProduct(direction(v), wi) + b / magnitude(v))
  }

  return w
    .map((wi, idx) => exampleMargin(wi, y[idx]))
    .reduce((x, xs) => x > xs ? xs : x) // Return smallest value in array
}

/* Given vectors v and w, we determine how to classify the examples (w) by
** using the equation sign(v . w + b). Within this function, we assume
** v represents our hyperplane, and w represents the input to classify.
*/
// hypothesis :: [ Number ], [ Number ], Number -> Number
function hypothesis (v, w, b) {
  if (!Util.isArr(v) || !Util.isArr(w) || !Util.isNum(b)) {
    throw new TypeError("Hypothesis expects two arrays and a number")
  }

  return sign(dotProduct(v, w) + b)
}

/* A magnitude of a vector is also known as the vector's norm. Magnitude can
** be solved using Euclidean Norm.
** https://en.wikipedia.org/wiki/Norm_(mathematics)#Euclidean_norm
*/
// magnitude :: [ Number ] -> Number
function magnitude (v) {
  if (!Util.isArr(v)) {
    throw new TypeError("Magnitude expects an array of numbers")
  }

  if (!v.every((x) => Util.isNum(x))) {
    throw new TypeError("Magnitude expects an array of numbers")
  }

  return Math.sqrt(v.reduce((x, xs) => (Math.pow(xs, 2) + x), 0))
}

/* The sign of number x is 1 if x is greater than 0, -1 if x is less than 0,
** and 0 if x is equal to 0. For simplicity, however, we are defaulting
** 0 values to negatives. This means that if a test data example falls
** directly upon the hyperplane, it defaults to a negative value.
*/
// sign :: Number -> Number
function sign (x) {
  if (!Util.isNum(x)) {
    throw new TypeError("Sign expects a number")
  }

  if (x > 0) {
    return 1
  }

  return -1
}

/* Two vectors may be subtracted, resulting in a third vector which is the
** difference of the coordinates of the original two.
*/
// vectorDiff :: [ Number ], [ Number ] -> [ Number ]
function vectorDiff (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Vector Diff expects two equal-sized arrays")
  }

  if ((!v.every((x) => Util.isNum(x))) || (!w.every((x) => Util.isNum(x)))) {
    throw new TypeError("Vector Diff expects two arrays of numbers")
  }

  return v.map((x, idx) => x - w[idx])
}

/* Two vectors may be added together, resulting in a third vector which is
** the sum of the coordinates of the original two.
*/
// vectorSum :: [ Number ], [ Number ] -> [ Number ]
function vectorSum (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Vector Sum expects two equal-sized arrays")
  }

  if ((!v.every((x) => Util.isNum(x))) || (!w.every((x) => Util.isNum(x)))) {
    throw new TypeError("Vector Sum expects two arrays of numbers")
  }

  return v.map((x, idx) => x + w[idx])
}
