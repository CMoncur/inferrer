/* Basic Linearly Separable Dataset */

module.exports = {
  testingPositive: [
    [ 7, 3 ],
    [ 5, 5 ]
  ],

  testingNegative: [
    [ 4, 1 ],
    [ 3, 4 ]
  ],

  training: [
    { input: [ 4, 6 ], classification: 1 },
    { input: [ 5, 4 ], classification: 1 },
    { input: [ 8, 2 ], classification: 1 },
    { input: [ 2, 9 ], classification: 1 },
    { input: [ 6, 6 ], classification: 1 },
    { input: [ 3, 7 ], classification: 1 },
    { input: [ 5, 8 ], classification: 1 },
    { input: [ 7, 4 ], classification: 1 },
    { input: [ 4, 2 ], classification: -1 },
    { input: [ 6, 0 ], classification: -1 },
    { input: [ 2, 4 ], classification: -1 },
    { input: [ 2, 6 ], classification: -1 },
    { input: [ 3, 3 ], classification: -1 },
    { input: [ 2, 3 ], classification: -1 },
    { input: [ 3, 1 ], classification: -1 },
    { input: [ 1, 7 ], classification: -1 }
  ],
}
