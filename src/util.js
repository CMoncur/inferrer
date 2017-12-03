module.exports = {
  isArr,
  isKernel,
  isNum,
}

// isArr :: [ a ] -> Bool
function isArr (xs) {
  return Array.isArray(xs)
}

// isKernel :: a -> Bool
function isKernel (x) {
  if (x === "linear") { // TODO: Update when more kernel functions are added
    return true
  }

  return false
}

// isNum :: a -> Bool
function isNum (x) {
  return typeof(x) === "number" && !isNaN(x)
}
