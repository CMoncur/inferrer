module.exports = {
  linear,
}

// Dependencies
const Util = require("./util")

/********************/
/* PUBLIC FUNCTIONS */
/********************/

/* As a general note, I'd like to keep this file as clean and easy to follow
** as possible. Therefore, all type checking will occur within Utilities.
*/

/* A linear kernel takes two equal-sized vectors and outputs the dot product
** thereunto pertaining.
*/
// linear :: [ Number ], [ Number ] -> Number
function linear(v, w) {
  return Util.dotProduct(v, w)
}
