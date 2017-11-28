// Core Dependencies
const test = require("ava")

// Internal Dependencies
const Util = require("./src/util")

/* UTILITIES */
// Magnitude
test("Correctly calculates Pythagorean Theorem", (t) => {
  t.deepEqual(Util.magnitude([ 3, 4 ]), 5)
})
