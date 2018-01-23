/* Exclusive Or Dataset */

module.exports = {
  testingPositive: [
    [ 0, 1 ],
    [ 1, 0 ]
  ],

  testingNegative: [
    [ 1, 1 ],
    [ 0, 0 ]
  ],

  training: [
    { input: [ 0, 0 ], classification: -1 },
    { input: [ 0, 1 ], classification: 1 },
    { input: [ 1, 0 ], classification: 1 },
    { input: [ 1, 1 ], classification: -1 }
  ],
}
