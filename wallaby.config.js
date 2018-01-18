// eslint-disable-next-line no-unused-vars
module.exports = function (wallaby) {
  return {
    env: { type: "node" },
    files: [ "src/**/*.js", "env/defaults.json" ],
    tests: [ "test.js" ],
    testFramework: "ava",
  }
}
