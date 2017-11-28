module.exports = {
  magnitude,
}

/* Given vector from origin to (x,y), `ox` is the distance between origin and
** x, and `oy` is distance between origin and y.
*/
// magnitude :: [ Number, Number ] -> Number
function magnitude ([ ox, oy ]) {
  return Math.sqrt(Math.pow(ox, 2) + Math.pow(oy, 2))
}
