// Core Dependencies
const test = require("ava")

// Internal Dependencies
const Formula = require("./src/formula")
const Kernel = require("./src/kernel")
const Svm = require("./src/svm")

/* UTILITIES */
// Direction
test("Direction correctly calculates cosine of angles", (t) => {
  t.deepEqual(Formula.direction([ 3, 4 ]), [ 0.6, 0.8 ])
})

test("Direction expects two equal-sized arrays of numbers", (t) => {
  t.throws(() => Formula.direction(4), TypeError)
  t.throws(() => Formula.direction([ "hi", 4 ]), TypeError)
  t.throws(() => Formula.direction([ 3, "hi" ]), TypeError)
})

// Dot Product
test("Dot product correctly calculates sum of product of given lists", (t) => {
  t.deepEqual(Formula.dotProduct([ 3, 4 ], [ 5, 6 ]), 39)
})

test("Dot product expects two equal-sized arrays of numbers", (t) => {
  t.throws(() => Formula.dotProduct("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Formula.dotProduct([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Formula.dotProduct([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.dotProduct([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.dotProduct([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Formula.dotProduct([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

// Euclidean Distance
test("Euclidean distance finds correct distance between two points", (t) => {
  t.deepEqual(Formula.euclideanDistance([ 3, 4, 5, 6 ], [ 5, 6, 7, 8 ]), 4)
})

test("Dot product expects two-item tuple of numbers", (t) => {
  t.throws(() => Formula.euclideanDistance("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Formula.euclideanDistance([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

// Euclidean Distance Squared
test("Euclidean distance finds correct distance between two points", (t) => {
  const eds = Formula.euclideanDistanceSquared

  t.deepEqual(eds([ 3, 4, 5, 6 ], [ 5, 6, 7, 8 ]), 16)
})

test("Dot product expects two-item tuple of numbers", (t) => {
  const eds = Formula.euclideanDistanceSquared

  t.throws(() => eds("hi", [ 5, 6 ]), TypeError)
  t.throws(() => eds([ 3, 4 ], "hi"), TypeError)
  t.throws(() => eds([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => eds([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => eds([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => eds([ 3, 4 ], [ 5, "hi" ]), TypeError)
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

  t.deepEqual(Formula.geometricMargin(v, w, y, b), 0.44721359549995743)
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
  const largerMargin = Formula.geometricMargin(v, w, y, b_1)
  const smallerMargin = Formula.geometricMargin(v, w, y, b_2)
  t.truthy(largerMargin > smallerMargin)
})

test("Geometric Margin expects three lists and a number", (t) => {
  // Good values
  const vGood = [ -0.5, -1 ]
  const wGood = [ [ 3, 6 ], [ 9, 3 ], [ 5, 4 ], [ 1, 8 ], [ 6, 6 ], [ 9, 5 ] ]
  const yGood = [ 1, 1, 1, -1, -1, -1 ]
  const bGood = 8

  // Bad Values
  const vBad = [ -0.5, NaN ]
  const wBad = [ [ 3, 6 ], [ 9, 3 ], [ "hi", 4 ], [ 1, 8 ], [ 6, 6 ], [ 9, 5 ] ]
  const yBad = [ 1, 5, 1, -1, -1, -1 ]
  const bBad = "hi"

  t.throws(() => Formula.geometricMargin(vBad, wGood, yGood, bGood), TypeError)
  t.throws(() => Formula.geometricMargin(vGood, wBad, yGood, bGood), TypeError)
  t.throws(() => Formula.geometricMargin(vGood, wGood, yBad, bGood), TypeError)
  t.throws(() => Formula.geometricMargin(vGood, wGood, yGood, bBad), TypeError)
})

// Hypothesis
test("Hypothesis correctly classifies the input vector", (t) => {
  t.deepEqual(Formula.hypothesis([ 0.4, 1 ], [ 8, 7 ], -9), 1)
  t.deepEqual(Formula.hypothesis([ 0.4, 1 ], [ 1, 3 ], -9), -1)
})

test("Hypothesis expects two lists of numbers and a number", (t) => {
  t.throws(() => Formula.hypothesis("hi", [ 5, 6 ], 4), TypeError)
  t.throws(() => Formula.hypothesis([ 3, 4 ], "hi", 4), TypeError)
  t.throws(() => Formula.hypothesis([ 3, 4 ], [ 5, 6 ], "hi"), TypeError)
})

// Magnitude
test("Magnitude correctly calculates Euclidean Norm", (t) => {
  t.deepEqual(Formula.magnitude([ 3, 4 ]), 5)
})

test("Magnitude expects a list of numbers", (t) => {
  t.throws(() => Formula.magnitude(4), TypeError)
  t.throws(() => Formula.magnitude([ "hi", 4 ]), TypeError)
  t.throws(() => Formula.magnitude([ 3, "hi" ]), TypeError)
})

// Sign
test("Sign correctly classifies the sign of a number", (t) => {
  t.deepEqual(Formula.sign(0), -1)
  t.deepEqual(Formula.sign(5), 1)
  t.deepEqual(Formula.sign(-5), -1)
})

test("Sign expects a number", (t) => {
  t.throws(() => Formula.sign("hi"), TypeError)
})

// Vector Diff
test("Vector Diff correctly calculates new vector", (t) => {
  t.deepEqual(Formula.vectorDiff([ 3, 4 ], [ 5, 6 ]), [ -2, -2 ])
})

test("Vector Diff expects two equal-sized arrays of numbers", (t) => {
  t.throws(() => Formula.vectorDiff("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorDiff([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Formula.vectorDiff([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorDiff([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorDiff([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Formula.vectorDiff([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

// Vector Sum
test("Vector Sum correctly calculates new vector", (t) => {
  t.deepEqual(Formula.vectorSum([ 3, 4 ], [ 5, 6 ]), [ 8, 10 ])
})

test("Vector Sum expects two equal-sized arrays of numbers", (t) => {
  t.throws(() => Formula.vectorSum("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Formula.vectorSum([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

/* KERNEL FUNCTIONS */
// Linear
// Dot Product
test("Linear kernel calculates sum of product of given lists", (t) => {
  t.deepEqual(Kernel.linear([ 3, 4 ], [ 5, 6 ]), 39)
})

test("Linear kernel expects two equal-sized arrays of numbers", (t) => {
  t.throws(() => Kernel.linear("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Kernel.linear([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Kernel.linear([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Kernel.linear([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Kernel.linear([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Kernel.linear([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

/* SVM CLASS */
const XOR = new Svm()

// Train
test("Train expects properly sanitized training data", (t) => {
  const notArrays = {
    input: "hi",
    classification: [ -1, 1, 1, -1 ],
  }

  const notEqualLength = {
    input: [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ],
    classification: [ -1, 1, 1, -1, 1 ],
  }

  const improperVectorSize = {
    input: [ [ 0, 1, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ],
    classification: [ -1, 1, 1, -1 ],
  }

  const notProperSign = {
    input: [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ],
    classification: [ -1, 1, 3, -1 ],
  }

  t.throws(() => XOR.train(notArrays), TypeError)
  t.throws(() => XOR.train(notEqualLength), TypeError)
  t.throws(() => XOR.train(improperVectorSize), TypeError)
  t.throws(() => XOR.train(notProperSign), TypeError)
})
