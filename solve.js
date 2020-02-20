const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");

const test = {
  nbooks: 6,
  nlibraries: 2,
  ndays: 7,
  scores: [1, 2, 3, 6, 5, 4],
  libraries: [
    { nbooks: 5, signupDuration: 2, shipCapacity: 2, books: [0, 1, 2, 3, 4] },
    { nbooks: 4, signupDuration: 3, shipCapacity: 1, books: [0, 2, 3, 5] }
  ]
};

const exampleOutput = [
  { id: 0, books: [0, 3, 5] },
  { id: 2, books: [0, 3, 5] }
];

function solve(problem, file) {
  const { libraries, ndays } = problem;

  const result = libraries.map((library, i) => ({
    id: i,
    books: library.books
  }));
  return result;
}

module.exports = solve;
