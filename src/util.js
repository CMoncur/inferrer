module.exports = {
  direction,
  magnitude,
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
