// Dependencies
const Svm = require("./src/svm")

const trainingData = {
  input: [
    [ 0, 0 ],
    [ 0, 1 ],
    [ 1, 0 ],
    [ 1, 1 ]
  ],

  classification: [ -1, 1, 1, -1 ],
}

const XOR = new Svm({c: "hi"})

XOR.train(trainingData)

console.log(trainingData)
