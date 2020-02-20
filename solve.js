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
  const alreadySentBooks = new Set();

  const result = libraries
    .sort((lib1, lib2) => lib1.signupDuration - lib2.signupDuration)
    .map((library, i) => {
      const sending = library.books
        .filter(book => !alreadySentBooks.has(book))
        .sort((book1, book2) => problem.scores[book2] - problem.scores[book1]);
      sending.forEach(book => alreadySentBooks.add(book));
      return {
        id: i,
        books: sending
      };
    })
    .filter(library => library.books.length > 0);
  return result;
}

module.exports = solve;
