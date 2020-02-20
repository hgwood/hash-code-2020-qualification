const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");
const assert = require("assert");

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
  let daysLibrariesCumulated = 0;
  const filteredLibrairies = _.takeWhile(
    libraries.sort(libraryComparatorByRating(problem)),
    lib => {
      daysLibrariesCumulated += lib.signupDuration;
      return daysLibrariesCumulated < ndays * 1;
    }
  );

  const result = filteredLibrairies
    .sort(libraryComparatorByShipCapacity(problem))
    .map(library => {
      const sending = library.books
        .filter(book => !alreadySentBooks.has(book))
        .sort((book1, book2) => problem.scores[book2] - problem.scores[book1]);
      sending.forEach(book => alreadySentBooks.add(book));
      return {
        id: library.index,
        books: sending
      };
    })
    .filter(library => library.books.length > 0);
  return result;
}

const libraryComparatorByRating = problem => (lib1, lib2) => {
  return (
    ourRatingOfLibrary(problem, lib2.index) -
    ourRatingOfLibrary(problem, lib1.index)
  );
};

function ourRatingOfLibrary(problem, id) {
  const bookScoreBySignupDuration =
    totalScoreOfBooksInLibrary(problem, id) /
    problem.libraries[id].signupDuration;
  const shipCapacity = problem.libraries[id].shipCapacity;
  const result = bookScoreBySignupDuration;
  assert(
    Number.isFinite(bookScoreBySignupDuration),
    `'${bookScoreBySignupDuration}' is not finite`
  );
  assert(Number.isFinite(shipCapacity), `'${shipCapacity}' is not finite`);

  assert(Number.isFinite(result), `'${result}' is not finite`);

  return result;
}

const libraryComparatorByShipCapacity = problem => (lib1, lib2) => {
  return lib2.shipCapacity - lib1.shipCapacity;
};

function ourRatingOfLibrary(problem, id) {
  const bookScoreBySignupDuration =
    totalScoreOfBooksInLibrary(problem, id) /
    problem.libraries[id].signupDuration;
  const shipCapacity = problem.libraries[id].shipCapacity;
  const result = bookScoreBySignupDuration;
  assert(
    Number.isFinite(bookScoreBySignupDuration),
    `'${bookScoreBySignupDuration}' is not finite`
  );
  assert(Number.isFinite(shipCapacity), `'${shipCapacity}' is not finite`);

  assert(Number.isFinite(result), `'${result}' is not finite`);

  return result;
}

function totalScoreOfBooksInLibrary(problem, id) {
  const result = problem.libraries[id].books
    .map(book => problem.scores[book])
    .reduce((a, b) => a + b, 0);
  assert(Number.isSafeInteger(result), `'${result}' is not a safe integer`);
  return result;
}

function solveB(problem) {
  return problem.libraries.sort(
    (lib1, lib2) => lib1.signupDuration - lib2.signupDuration
  );
}

module.exports = solve;
