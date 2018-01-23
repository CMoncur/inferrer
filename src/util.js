module.exports = {
  isArr,
  isKernel,
  isNum,
  randSequence,
}

// isArr :: [ a ] -> Bool
function isArr (xs) {
  return Array.isArray(xs)
}

// isKernel :: a -> Bool
function isKernel (x) {
  // TODO: Update when polynomial kernel function is added
  if (x === "gaussian" || x === "linear") {
    return true
  }

  return false
}

// isNum :: a -> Bool
function isNum (x) {
  return typeof(x) === "number" && !isNaN(x)
}

/* randSequence takes a list (which, in the case of the SMO, will contain
** only numbers), and return a list of the same values with a different
** "starting point". This is not a pure function, but is necessary for a
** proper implementation of the SMO algorithm.
**
** Example:
** randSequence([ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ])
** => [ 10, 12, 14, 16, 18, 20, 2, 4, 6, 8 ]
*/
// randSequence :: [ a ] -> [ a ]
// TODO: Type checking/unit tests for this
function randSequence(ls) {
  const
    randPoint = Math.floor(Math.random() * ls.length),
    listHead = ls.slice(randPoint),
    listTail = ls.reverse().slice(ls.length - randPoint).reverse()

  return listHead.concat(listTail)
}
