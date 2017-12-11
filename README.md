# inferrer
A simple and dependency-free support vector machine library

### Table of Contents
- [Installation](#installation)
- [Using inferrer](#using-inferrer)
  - [Basic Usage Example](#basic-usage-example)
- [Contribute](#contribute)
- [License](#license)

## Installation
`npm install inferrer --save`

## Using inferrer
First, require the module:
`const Svm = require("inferrer")`

Or using the `import` spec:
`import Svm from "inferrer"`

### Basic Usage Example
Instantiate a new SVM, and train the SVM using training examples that can be classified in a binary fashion:
```javascript
const data = {
  input: [
    [ 4, 6 ], [ 5, 4 ], [ 8, 2 ], [ 2, 9 ], [ 6, 6 ], [ 3, 7 ], [ 5, 8 ],
    [ 4, 2 ], [ 6, 0 ], [ 2, 4 ], [ 2, 6 ], [ 3, 3 ], [ 2, 3 ], [ 3, 1 ]
  ],

  classification: [ 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1 ],
}

const LinearSvm = new Svm()

LinearSvm.train(data)
```

It's important to note that all training/testing inputs _must_ be lists of the same length, and every training input _must_ have a classification thereunto pertaining.

Once the SVM is trained, classifying test inputs is accomplished thusly:
```javascript
LinearSvm.classify([ 7, 3 ])
// => 1
```
```javascript
LinearSvm.classify([ 4, 1 ])
// => -1
```

The hyperplane/offset that results from the training inputs can be accessed using the following methods, respectively:
```javascript
LinearSvm.hyperplane()
// => [ 1.2003774889309273, 0.8002516592872844 ] (approximation)
```
```javascript
LinearSvm.offset()
// => -8.202894081803773 (approximation)
```

## Contribute
I encourage opening issue tickets using the [issue tracker](https://github.com/cmoncur/inferrer/issues). Please open a ticket on the issues page before submitting any pull requests to address said issue! For features and enhancements, please open a detailed, well formatted pull request outlining the necessity and benefit, as well as basic usage examples.

## License
**MIT**
