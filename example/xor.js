const Inferrer = require("../src/svm")

const trainingData = [
  { input: [ 0, 0 ], classification: -1 },
  { input: [ 0, 1 ], classification: 1 },
  { input: [ 1, 0 ], classification: 1 },
  { input: [ 1, 1 ], classification: -1 }
]

const XOR = new Inferrer({ kernel: "gaussian", gamma: 2 })

XOR.train(trainingData)

console.log("Should be [ -1, 1, 1, -1 ]: ")
console.log(XOR.classifyList([ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ]))

/* Expected Output:
**
** Should be [ -1, 1, 1, -1 ]:
** [ -1, 1, 1, -1 ]
*/
