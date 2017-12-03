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
  t.throws(() => Util.direction(4), TypeError)
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

// Geometric Margin
test("Geometric Margin correctly finds smallest margin in a dataset", (t) => {
  // Hyperplane
  const v = [ -0.5, -1 ]

  // Examples
  const w = [
    [ 3, 6 ], [ 9, 3 ], [ 5, 4 ], [ 4, 5 ], [ 8, 3 ],
    [ 1, 8 ], [ 6, 6 ], [ 9, 5 ], [ 7, 8 ], [ 3, 7 ]
  ]

  // Classifications
  const y = [ 1, 1, 1, 1, 1, -1, -1, -1, -1, -1 ]

  // Hyperplane offsets
  const b = 8

  t.deepEqual(Util.geometricMargin(v, w, y, b), 0.44721359549995743)
})

test("Geometric Margin selects the largest margin of two hyperplanes", (t) => {
  // Hyperplane
  const v = [ -0.5, -1 ]

  // Examples
  const w = [
    [ 3, 6 ], [ 9, 3 ], [ 5, 4 ], [ 4, 5 ], [ 8, 3 ],
    [ 1, 8 ], [ 6, 6 ], [ 9, 5 ], [ 7, 8 ], [ 3, 7 ]
  ]

  // Classifications
  const y = [ 1, 1, 1, 1, 1, -1, -1, -1, -1, -1 ]

  // Hyperplane offsets
  const b_1 = 8
  const b_2 = 8.2

  // Margins
  const largerMargin = Util.geometricMargin(v, w, y, b_1)
  const smallerMargin = Util.geometricMargin(v, w, y, b_2)
  t.truthy(largerMargin > smallerMargin)
})

// Hypothesis
test("Hypothesis correctly classifies the input vector", (t) => {
  t.deepEqual(Util.hypothesis([ 0.4, 1 ], [ 8, 7 ], -9), 1)
  t.deepEqual(Util.hypothesis([ 0.4, 1 ], [ 1, 3 ], -9), -1)
})

test("Hypothesis expects two lists of numbers and a number", (t) => {
  t.throws(() => Util.hypothesis("hi", [ 5, 6 ], 4), TypeError)
  t.throws(() => Util.hypothesis([ 3, 4 ], "hi", 4), TypeError)
  t.throws(() => Util.hypothesis([ 3, 4 ], [ 5, 6 ], "hi"), TypeError)
})

// Magnitude
test("Magnitude correctly calculates Euclidean Norm", (t) => {
  t.deepEqual(Util.magnitude([ 3, 4 ]), 5)
})

test("Magnitude expects a list of numbers", (t) => {
  t.throws(() => Util.magnitude(4), TypeError)
  t.throws(() => Util.magnitude([ "hi", 4 ]), TypeError)
  t.throws(() => Util.magnitude([ 3, "hi" ]), TypeError)
})

// Sign
test("Sign correctly classifies the sign of a number", (t) => {
  t.deepEqual(Util.sign(0), 0)
  t.deepEqual(Util.sign(5), 1)
  t.deepEqual(Util.sign(-5), -1)
})

test("Sign expects a number", (t) => {
  t.throws(() => Util.sign("hi"), TypeError)
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
