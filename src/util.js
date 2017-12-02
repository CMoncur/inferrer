module.exports = {
  direction,
  dotProduct,
  geometricMargin,
  hypothesis,
  magnitude,
  sign,
  vectorDiff,
  vectorSum,
}


/* Given a vector returns a vector that indicates the direction of the first.
**
** In the simplest terms, direction of a vector is equal to the cosine of
** it's angles
*/
// direction :: [ Number ] -> [ Number ]
function direction (v) {
  if (!Array.isArray(v)) {
    throw new TypeError("Direction expects a list of numbers")
  }

  const mag = magnitude(v)

  return v.map((x) => {
    if (typeof(x) !== "number") {
      throw new TypeError("Direction expects a list of numbers")
    }

    return x / mag
  })
}

/* Given two equal-sized lists of numbers, the dot product is defined as the
** sum of products of each of the list items.
*/
// dotProduct :: [ Number ], [ Number ] -> Number
function dotProduct (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Dot Product expects two equal-sized lists")
  }

  if (!Array.isArray(v) || !Array.isArray(w)) {
    throw new TypeError("Dot Product expects two arrays of numbers")
  }

  const products = v.map((x, idx) => {
    if (typeof(x) !== "number" || typeof(w[idx]) !== "number") {
      throw new TypeError("Dot Product expects two arrays of numbers")
    }

    return x * w[idx]
  })

  return products.reduce((x, xs) => x + xs, 0)
}

/* The geometric margin is used to calculate the distance between a given
** vector and a hyperplane. In this context, w represents our examples.
*/
// geometricMargin :: [ Number ], [ Number ], [ Number ], Number -> Number
function geometricMargin (v, w, y, b) {
  const exampleMargin = (w_i, y_i) => {
    const vDir = direction(v)

    return y_i * (dotProduct(vDir, w_i) + b / vDir)
  }

  return w
    .map((w_i, idx) => exampleMargin(w_i, y[idx]))
    .reduce((x, xs) => x > xs ? xs : x) // Return smallest value in array
}

/* Given vectors v and w, we define the equation of a hyperplane as
** w . x + b = 0, which is similar to a rise over run equation, but using
** n-dimensional vectors. Within this function, we assume v represents
** our hyperplane, and w represents the input to classify.
*/
// hypothesis :: [ Number ], [ Number ], Number -> Number
function hypothesis (v, w, b) {
  if (!Array.isArray(v) || !Array.isArray(w) || typeof(b) !== "number") {
    throw new TypeError("Hypothesis expects two arrays and a number")
  }

  // Prepends b to list v, prepends 1 to list w.
  v.unshift(b)
  w.unshift(1)

  return sign(dotProduct(v, w))
}

/* A magnitude of a vector is also known as the vector's norm. Magnitude can
** be solved using Euclidean Norm.
** https://en.wikipedia.org/wiki/Norm_(mathematics)#Euclidean_norm
*/
// magnitude :: [ Number ] -> Number
function magnitude (v) {
  if (!Array.isArray(v)) {
    throw new TypeError("Magnitude expects an array of numbers")
  }

  return Math.sqrt(
    v.reduce((x, xs) => {
      if (typeof(xs) !== "number") {
        throw new TypeError("Magnitude expects an array of numbers")
      }

      return (Math.pow(xs, 2) + x)
    }, 0)
  )
}

/* The sign of number x is 1 if x is greater than 0, -1 if x is less than 0,
** and 0 if x is equal to 0.
*/
// sign :: Number -> Number
function sign (x) {
  if (typeof(x) !== "number") {
    throw new TypeError("Sign expects a number")
  }

  if (x === 0) {
    return 0
  }

  else if (x > 0) {
    return 1
  }

  else if (x < 0) {
    return -1
  }
}

/* Two vectors may be subtracted, resulting in a third vector which is the
** difference of the coordinates of the original two.
*/
// vectorDiff :: [ Number ], [ Number ] -> [ Number ]
function vectorDiff (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Vector Diff expects two equal-sized lists")
  }

  return v.map((x, idx) => {
    if (typeof(x) !== "number" || typeof(w[idx]) !== "number") {
      throw new TypeError("Vector Diff expects two arrays of numbers")
    }

    return x - w[idx]
  })
}

/* Two vectors may be added together, resulting in a third vector which is
** the sum of the coordinates of the original two.
*/
// vectorSum :: [ Number ], [ Number ] -> [ Number ]
function vectorSum (v, w) {
  if (v.length !== w.length) {
    throw new TypeError("Vector Sum expects two equal-sized lists")
  }

  return v.map((x, idx) => {
    if (typeof(x) !== "number" || typeof(w[idx]) !== "number") {
      throw new TypeError("Vector Sum expects two arrays of numbers")
    }

    return x + w[idx]
  })
}
