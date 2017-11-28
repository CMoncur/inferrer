// Core Dependencies
const test = require("ava")

// Internal Dependencies
const Util = require("./src/util")

/* UTILITIES */
// Direction
test("Direction correctly calculates cosine of angles", (t) => {
  t.deepEqual(Util.direction([ 3, 4 ]), [ 0.6, 0.8 ])
})

test("Direction expects two-item tuple of numbers", (t) => {
  t.throws(() => Util.direction([ "hi", 4 ]), TypeError)
  t.throws(() => Util.direction([ 3, "hi" ]), TypeError)
})

// Magnitude
test("Magnitude correctly calculates Pythagorean Theorem", (t) => {
  t.deepEqual(Util.magnitude([ 3, 4 ]), 5)
})

test("Magnitude expects two-item tuple of numbers", (t) => {
  t.throws(() => Util.magnitude([ "hi", 4 ]), TypeError)
  t.throws(() => Util.magnitude([ 3, "hi" ]), TypeError)
})
