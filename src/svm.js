module.exports = class Svm {
  constructor (opts = { sup: "sup yeah cool" }) {
    this.sup = opts.sup
  }

  cheer () {
    console.log(this.sup)
  }
}
