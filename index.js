// Internal Dependencies
const Svm = require("./src/svm")

const datos = {
  positive: [
    [ 1, 5 ],
    [ 2, 3 ],
    [ -3, 4 ]
  ],

  negative: [
    [ 5, 2 ],
    [ 4, -1 ],
    [ 6, 1 ]
  ],
}

const yeah = new Svm

console.log(datos)

yeah.cheer()
