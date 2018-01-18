module.exports = function () {
  return {
    env: { type: "node" },
    files: [ "src/**/*.js", "env/defaults.json" ],
    tests: [ "test.js" ],
    testFramework: "ava",
  }
}
