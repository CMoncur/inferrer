# inferrer
A simple and dependency-free support vector machine (SVM) library

### Table of Contents
- [Installation](#installation)
- [Using inferrer](#using-inferrer)
  - [Basic Usage Example](#basic-usage-example)
  - [Options](#options)
  - [Advanced Options](#advanced-options)
- [To Do](#to-do)
- [About](#about)
  - [What is a SVM?](#what-is-a-svm)
  - [SMO](#smo)
  - [Sources](#sources)
- [Contribute](#contribute)
- [License](#license)

## Installation
`npm install inferrer --save`

## Using inferrer
First, require the module:
`const Inferrer = require("inferrer")`

Or using the `import` spec:
`import Inferrer from "inferrer"`

### Basic Usage Example
Instantiate a new SVM, and train the SVM using training examples that can be classified in a binary fashion:
```javascript
// The options passed to the SVM class are optional. Details below.
const XOR = new Inferrer({ kernel: "gaussian", gamma: 2 })

XOR.train({
  input: [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ],
  classification: [ -1, 1, 1, -1 ],
})
```

It's important to note that all training/testing inputs _must_ be lists of the same length, and every training input _must_ have a classification thereunto pertaining.

Once the SVM is trained, classifying test inputs is accomplished thusly:
```javascript
XOR.classify([ 0, 1 ])
// => 1
```
```javascript
XOR.classify([ 0, 0 ])
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

### Options
- `kernel`: The _type_ of SVM to be used. Defaults to `linear`.
  - `linear`: Best for data that is _linearly separable_.
  - `gaussian`: Best for noisy or oddly formed datasets.
- `c`: "Strictness" of the SVM. Larger values create a stricter hyperplane. If data is noisy, it may be best to drop the value of `c` to create a hyperplane that best classifies the dataset. Defaults to `3`

### Advanced Options
- `tolerance`: Tolerance of the SVM. Defaults to `0.001`
- `gamma`: This defines the "spread" of gaussian kernels. The larger the `gamma` value, the tighter the hyperplane will wrap positive values. Defaults to `0.1`


## To Do
- [x] Basic Functionality
  - [x] Sequential Minimal Optimization Algorithm
  - [x] Classify, Hyperplane, and Offset Methods
  - [x] Defaults Values
- [ ] Kernel Functions
  - [x] Linear Kernel
  - [x] Gaussian Kernel (RBF)
  - [ ] Polynomial Kernel
- [ ] Complete Test Suite

## About
Basic information regarding support vector machines and this library

### What is a SVM?
A support vector machine is a machine learning tool used primarily for binary classification and regression. It is a "supervised" machine learning technique, meaning the SVM requires training data to base classifications on. In many cases, a SVM is a more accurate classifier than an artificial neural network.

### SMO
SMO, or sequential minimal optimization, is an algorithm for solving SVMs devised by John C. Platt. The original research paper is linked in the [sources](#sources) section. __This library utilizes the SMO algorithm for training SVMs.__ The SMO algorithm was chosen because it is less memory intensive and requires less computing power than other SVM algorithms.

### Sources
[Sequential Minimal Optimization, John C. Platt](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-98-14.pdf)

[Support Vector Machines Succinctly, Alexandre Kowalczyk](https://www.svm-tutorial.com/2017/10/support-vector-machines-succinctly-released/)

## Contribute
I encourage opening issue tickets using the [issue tracker](https://github.com/cmoncur/inferrer/issues). Please open a ticket on the issues page before submitting any pull requests to address said issue! For features and enhancements, please open a detailed, well formatted pull request outlining the necessity and benefit, as well as basic usage examples.

## License
**MIT**
