// Dependencies
const Svm = require("./src/svm")

const trainingData = {
  input: [
    [ 8, 7 ],
    [ 4, 10 ],
    [ 9, 7 ],
    [ 7, 10 ],
    [ 9, 6 ],
    [ 4, 8 ],
    [ 10, 10 ],
    [ 2, 7 ],
    [ 8, 3 ],
    [ 7, 5 ],
    [ 4, 4 ],
    [ 4, 6 ],
    [ 1, 3 ],
    [ 2, 5 ]
  ],

  classification: [ 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1 ],
}

const XOR = new Svm()

XOR.train(trainingData)

// console.log(trainingData)

XOR.hyperplane()
