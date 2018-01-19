module.exports = function () {
  return {
    env: { type: "node" },
    files: [
      "env/defaults.json",
      "example/datasets/*.js",
      "src/**/*.js"
    ],
    tests: [ "test.js" ],
    testFramework: "ava",
  }
}
