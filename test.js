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

// Dot Product
test("Dot product correctly calculates sum of product of given lists", (t) => {
  t.deepEqual(Util.dotProduct([ 3, 4 ], [ 5, 6 ]), 39)
})

test("Dot product expects two-item tuple of numbers", (t) => {
  t.throws(() => Util.dotProduct([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Util.dotProduct([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Util.dotProduct([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Util.dotProduct([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

// Magnitude
test("Magnitude correctly calculates Pythagorean Theorem", (t) => {
  t.deepEqual(Util.magnitude([ 3, 4 ]), 5)
})

test("Magnitude expects two-item tuple of numbers", (t) => {
  t.throws(() => Util.magnitude([ "hi", 4 ]), TypeError)
  t.throws(() => Util.magnitude([ 3, "hi" ]), TypeError)
})

// Vector Diff
test("Vector Diff correctly calculates new vector", (t) => {
  t.deepEqual(Util.vectorDiff([ 3, 4 ], [ 5, 6 ]), [ -2, -2 ])
})

test("Vector Diff expects two-item tuple of numbers", (t) => {
  t.throws(() => Util.vectorDiff([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Util.vectorDiff([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Util.vectorDiff([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Util.vectorDiff([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

// Vector Sum
test("Vector Sum correctly calculates new vector", (t) => {
  t.deepEqual(Util.vectorSum([ 3, 4 ], [ 5, 6 ]), [ 8, 10 ])
})

test("Vector Sum expects two-item tuple of numbers", (t) => {
  t.throws(() => Util.vectorSum([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Util.vectorSum([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Util.vectorSum([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Util.vectorSum([ 3, 4 ], [ 5, "hi" ]), TypeError)
})
