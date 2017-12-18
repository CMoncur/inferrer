module.exports = {
  gaussian,
  linear,
}

// Dependencies
const Formula = require("./formula")
const Util = require("./util")

/* As a general note, I'd like to keep this file as clean and easy to follow
** as possible. Therefore, as much type checking as possible should be handled
** by formula functions.
*/

/* The Gaussian (RBF) kernel can be used when the training dataset takes an
** abstract form. The Gaussian kernel projects n-dimensional vectors into an
** n + 1 dimensional space. Takes two equal-sized vectors and a "gamma"
** parameter, which represents the "spread" of the vector. A gamma value too
** large can result in a classifier that is far too focused, while a smaller
** value may create a classifier that is too linear. We default gamma to 0.1.
*/
// gaussian :: [ Number ], [ Number ] -> Number
function gaussian(v, w, gamma) {
  if (!Util.isNum(gamma)) {
    throw new TypeError("Gaussian kernel expects gamma to be a number")
  }

  return Math.exp((-gamma) * Formula.euclideanDistanceSquared(v, w))
}

/* A linear kernel takes two equal-sized vectors and outputs the dot product
** thereunto pertaining.
*/
// linear :: [ Number ], [ Number ] -> Number
function linear(v, w) {
  return Formula.dotProduct(v, w)
}
