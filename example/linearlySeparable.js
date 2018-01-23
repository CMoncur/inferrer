const Inferrer = require("../src/svm")

const Linear = require("./datasets/linear")

const LinearSvm = new Inferrer()

LinearSvm.train(Linear.training)

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
