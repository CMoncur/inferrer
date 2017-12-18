const Svm = require("../src/svm")

const trainingData = {
  input: [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ],
  classification: [ -1, 1, 1, -1 ],
}

const GaussianSvm = new Svm({ kernel: "gaussian", gamma: 2 })

GaussianSvm.train(trainingData)

console.log("Should be 1: ", GaussianSvm.classify([ 0, 1 ]))
console.log("Should be -1: ", GaussianSvm.classify([ 0, 0 ]))

/* Expected Output:
**
** Should be 1:  1
** Should be -1:  -1
*/
