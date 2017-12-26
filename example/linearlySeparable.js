const Inferrer = require("../src/svm")

const trainingData = [
  // "1" values
  { input: [ 4, 6 ], classification: 1 },
  { input: [ 5, 4 ], classification: 1 },
  { input: [ 8, 2 ], classification: 1 },
  { input: [ 2, 9 ], classification: 1 },
  { input: [ 6, 6 ], classification: 1 },
  { input: [ 3, 7 ], classification: 1 },
  { input: [ 5, 8 ], classification: 1 },
  { input: [ 7, 4 ], classification: 1 },
  // "-1" values
  { input: [ 4, 2 ], classification: -1 },
  { input: [ 6, 0 ], classification: -1 },
  { input: [ 2, 4 ], classification: -1 },
  { input: [ 2, 6 ], classification: -1 },
  { input: [ 3, 3 ], classification: -1 },
  { input: [ 2, 3 ], classification: -1 },
  { input: [ 3, 1 ], classification: -1 },
  { input: [ 1, 7 ], classification: -1 }
]

//   classification: [ 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1 ],
// }

const LinearSvm = new Inferrer()

LinearSvm.train(trainingData)

console.log("Separating hyperplane: ", LinearSvm.hyperplane())
console.log("Offset: ", LinearSvm.offset())

console.log("Should be 1: ", LinearSvm.classify([ 7, 3 ]))
console.log("Should be 1: ", LinearSvm.classify([ 5, 5 ]))
console.log("Should be -1: ", LinearSvm.classify([ 4, 1 ]))
console.log("Should be -1: ", LinearSvm.classify([ 3, 4 ]))

/* Expected Output:
**
** Separating hyperplane:  [ 1.1981876840198358, 0.8018123159801639 ]
** Offset:  -8.207249263920655
** Should be 1:  1
** Should be 1:  1
** Should be -1:  -1
** Should be -1:  -1
*/
