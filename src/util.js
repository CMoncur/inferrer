module.exports = {
  direction,
  dotProduct,
  magnitude,
  vectorDiff,
  vectorSum,
}


/* Given a vector from origin to (x,y), `ox` is the distance between origin
** and x, and `oy` is distance between origin and y.
**
** In the simplest terms, direction of a vector is equal to the cosine of
** it's angles
*/
// direction :: [ Number, Number ] -> [ Number, Number ]
function direction ([ ox, oy ]) {
  if (typeof(ox) !== "number" || typeof(oy) !== "number") {
    throw new TypeError("Direction expects a two-item tuple of numbers")
  }

  const mag = magnitude([ ox, oy ])

  return [ ox / mag, oy / mag ]
}

/* Given two equal-sized lists of numbers, the dot product is defined as the
** sum of products of each of the list items.
*/
// dotProduct :: [ Number, Number ], [ Number, Number ] -> Number
function dotProduct ([ oa, ob ], [ ox, oy ]) {
  if (typeof(oa) !== "number"
    || typeof(ob) !== "number"
    || typeof(ox) !== "number"
    || typeof(oy) !== "number"
  ) {
    throw new TypeError("Dot product expects a two-item tuple of numbers")
  }

  return ((oa * ox) + (ob * oy))
}

/* Given a vector from origin to (x,y), `ox` is the distance between origin
** and x, and `oy` is distance between origin and y.
*/
// magnitude :: [ Number, Number ] -> Number
function magnitude ([ ox, oy ]) {
  if (typeof(ox) !== "number" || typeof(oy) !== "number") {
    throw new TypeError("Magnitude expects a two-item tuple of numbers")
  }

  return Math.sqrt(Math.pow(ox, 2) + Math.pow(oy, 2))
}

/* Two vectors may be subtracted, resulting in a third vector which is the
** difference of the coordinates of the original two.
*/
// vectorDiff :: [ Number, Number ], [ Number, Number ] -> [ Number, Number ]
function vectorDiff ([ oa, ob ], [ ox, oy ]) {
  if (typeof(oa) !== "number"
    || typeof(ob) !== "number"
    || typeof(ox) !== "number"
    || typeof(oy) !== "number"
  ) {
    throw new TypeError("Vector Sum expects a two-item tuple of numbers")
  }

  return [ oa - ox, ob - oy ]
}

/* Two vectors may be added together, resulting in a third vector which is
** the sum of the coordinates of the original two.
*/
// vectorSum :: [ Number, Number ], [ Number, Number ] -> [ Number, Number ]
function vectorSum ([ oa, ob ], [ ox, oy ]) {
  if (typeof(oa) !== "number"
    || typeof(ob) !== "number"
    || typeof(ox) !== "number"
    || typeof(oy) !== "number"
  ) {
    throw new TypeError("Vector Sum expects a two-item tuple of numbers")
  }

  return [ oa + ox, ob + oy ]
}
