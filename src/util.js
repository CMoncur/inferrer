module.exports = {
  isArr,
  isNum,
}

// isArr :: [ a ] -> Bool
function isArr (xs) {
  return Array.isArray(xs)
}

// isNum :: a -> Bool
function isNum (x) {
  return typeof(x) === "number" && !isNaN(x)
}
