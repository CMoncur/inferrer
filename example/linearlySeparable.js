const Svm = require("../src/svm")

const trainingData = {
  input: [
    // "1" values
    [ 4, 6 ],
    [ 5, 4 ],
    [ 8, 2 ],
    [ 2, 9 ],
    [ 6, 6 ],
    [ 3, 7 ],
    [ 5, 8 ],
    [ 7, 4 ],
    // "-1" values
    [ 4, 2 ],
    [ 6, 0 ],
    [ 2, 4 ],
    [ 2, 6 ],
    [ 3, 3 ],
    [ 2, 3 ],
    [ 3, 1 ],
    [ 1, 7 ]
  ],

  classification: [ 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1],
}

const LinearSvm = new Svm()

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
