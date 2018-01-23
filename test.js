// Core Dependencies
const test = require("ava")

// Internal Dependencies
const Formula = require("./src/formula")
const Inferrer = require("./src/svm")
const Kernel = require("./src/kernel")

// Datasets
const IrisFlower = require("./example/datasets/iris")
const Linear = require("./example/datasets/linear")
const Xor = require("./example/datasets/xor")

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

test("Dot product expects two equal-sized arrays", (t) => {
  t.throws(() => Formula.dotProduct([ 2, 3, 4 ], [ 5, 6 ]), TypeError)
})

test("Dot product expects two arrays of numbers", (t) => {
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

test("Dot product expects two equal-sized arrays", (t) => {
  t.throws(() => Formula.euclideanDistance([ 2, 3, 4 ], [ 5, 6 ]), TypeError)
})

test("Euclidean distance expects two-item tuple of numbers", (t) => {
  t.throws(() => Formula.euclideanDistance("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Formula.euclideanDistance([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Formula.euclideanDistance([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

// Euclidean Distance Squared
const eds = Formula.euclideanDistanceSquared

test("Euclidean distance squared finds distance between two points", (t) => {
  t.deepEqual(eds([ 3, 4, 5, 6 ], [ 5, 6, 7, 8 ]), 16)
})

test("Euclidean distance squared expects two equal-sized arrays", (t) => {
  t.throws(() => eds([ 2, 3, 4 ], [ 5, 6 ]), TypeError)
})

test("Euclidean distance squared  expects two-item tuple of numbers", (t) => {
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

test("Vector Diff expects two equal-sized arrays", (t) => {
  t.throws(() => Formula.vectorDiff([ 2, 3, 4 ], [ 5, 6 ]), TypeError)
})

test("Vector Diff expects two arrays of numbers", (t) => {
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

test("Vector Sum expects two equal-sized arrays", (t) => {
  t.throws(() => Formula.vectorSum([ 2, 3, 4 ], [ 5, 6 ]), TypeError)
})

test("Vector Sum expects two arrays of numbers", (t) => {
  t.throws(() => Formula.vectorSum("hi", [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, 4 ], "hi"), TypeError)
  t.throws(() => Formula.vectorSum([ "hi", 4 ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, "hi" ], [ 5, 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, 4 ], [ "hi", 6 ]), TypeError)
  t.throws(() => Formula.vectorSum([ 3, 4 ], [ 5, "hi" ]), TypeError)
})

/* KERNEL FUNCTIONS */
// Gaussian (RBF)
test("Gaussian kernel is correctly calculated", (t) => {
  t.deepEqual(Kernel.gaussian([ 3, 4 ], [ 5, 6 ], 0.1), 0.44932896411722156)
})

test("Gaussian kernel expects two arrays of numbers and a number", (t) => {
  t.throws(() => Kernel.gaussian("hi", [ 5, 6 ], 0.1), TypeError)
  t.throws(() => Kernel.gaussian([ 3, 4 ], "hi", 0.1), TypeError)
  t.throws(() => Kernel.gaussian([ "hi", 4 ], [ 5, 6 ], 0.1), TypeError)
  t.throws(() => Kernel.gaussian([ 3, "hi" ], [ 5, 6 ], 0.1), TypeError)
  t.throws(() => Kernel.gaussian([ 3, 4 ], [ "hi", 6 ], 0.1), TypeError)
  t.throws(() => Kernel.gaussian([ 3, 4 ], [ 5, "hi" ], 0.1), TypeError)
  t.throws(() => Kernel.gaussian([ 3, 4 ], [ 5, 6 ], "hi"), TypeError)
})

// Linear
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
const XOR = new Inferrer({ kernel: "gaussian", gamma: 2 })

// Train
test("Cannot classify data until SVM is trained", (t) => {
  t.throws(() => XOR.classify([ 0, 1, 0, 1 ]), Error)
})

test("Train expects properly sanitized training data", (t) => {
  const notArrays = [
    { input: "hi", classification: -1 },
    { input: [ 0, 1 ], classification: 1 },
    { input: [ 1, 0 ], classification: 1 },
    { input: [ 1, 1 ], classification: -1 }
  ]

  const improperVectorSize = [
    { input: [ 0, 0 ], classification: -1 },
    { input: [ 0, 1, 0 ], classification: 1 },
    { input: [ 1, 0 ], classification: 1 },
    { input: [ 1, 1 ], classification: -1 }
  ]

  const notProperSign = [
    { input: [ 0, 0 ], classification: -1 },
    { input: [ 0, 1 ], classification: 1 },
    { input: [ 1, 0 ], classification: 1 },
    { input: [ 1, 1 ], classification: 3 }
  ]

  t.throws(() => XOR.train(notArrays), TypeError)
  t.throws(() => XOR.train(improperVectorSize), TypeError)
  t.throws(() => XOR.train(notProperSign), TypeError)
  t.deepEqual(XOR.train(Xor.training), undefined)
})

test("Train properly trains higher dimensional datasets", (t) => {
  const Iris = new Inferrer()

  t.deepEqual(Iris.train(IrisFlower.training), undefined)
})

// Gaussian Kernel
test("SVM properly classifies XOR test data (Gaussian kernel)", (t) => {
  XOR.train(Xor.training)

  t.deepEqual(XOR.classifyList(Xor.testingPositive), [ 1, 1 ])
  t.deepEqual(XOR.classifyList(Xor.testingNegative), [ -1, -1 ])
})

// Linear Kernel
test("SVM properly classifies linear test data (Linear kernel)", (t) => {
  const LinearSvm = new Inferrer()

  LinearSvm.train(Linear.training)

  t.deepEqual(LinearSvm.classifyList(Linear.testingPositive), [ 1, 1 ])
  t.deepEqual(LinearSvm.classifyList(Linear.testingNegative), [ -1, -1 ])
})

// General SVM Class Tests
test("SVM assigns default options if no options are given", (t) => {
  const Default = new Inferrer()

  t.deepEqual(Default.c, 3)
  t.deepEqual(Default.gamma, 0.1)
  t.deepEqual(Default.kernel, "linear")
  t.deepEqual(Default.tolerance, 0.001)
})

test("SVM assigns custom options if options are given", (t) => {
  const Custom = new Inferrer({
    c: 10,
    gamma: 2,
    kernel: "gaussian",
    tolerance: 0.0001,
  })

  t.deepEqual(Custom.c, 10)
  t.deepEqual(Custom.gamma, 2)
  t.deepEqual(Custom.kernel, "gaussian")
  t.deepEqual(Custom.tolerance, 0.0001)
})

test("Hyperplane and Offset methods require SVM to be trained", (t) => {
  const Untrained = new Inferrer()

  t.throws(() => Untrained.hyperplane(), Error)
  t.throws(() => Untrained.offset(), Error)
})

test("Hyperplane method returns W value if using linear kernel", (t) => {
  const LinearSvm = new Inferrer()

  LinearSvm.train(Linear.training)

  t.deepEqual(LinearSvm.hyperplane(), LinearSvm.w)
})

test("Hyperplane method returns Lagrange multipliers if not linear", (t) => {
  const GaussianSvm = new Inferrer({ kernel: "gaussian" })

  GaussianSvm.train(Xor.training)

  t.deepEqual(GaussianSvm.hyperplane(), GaussianSvm.alpha)
})

test("Offset method returns negative B value if SVM is trained", (t) => {
  const LinearSvm = new Inferrer()
  const GaussianSvm = new Inferrer({ kernel: "gaussian" })

  LinearSvm.train(Linear.training)
  GaussianSvm.train(Xor.training)

  t.deepEqual(LinearSvm.offset(), -LinearSvm.b)
  t.deepEqual(GaussianSvm.offset(), -GaussianSvm.b)
})
