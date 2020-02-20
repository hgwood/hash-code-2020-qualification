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
  if (file.startsWith("d")) {
    return solveD(problem);
  }

  let { libraries, ndays } = problem;

  if (file.startsWith("e")) {
    libraries = libraries.filter(library => library.shipCapacity > 1);
  }

  const alreadySentBooks = new Set();
  /* const cutLibrairies = _.takeWhile(
    libraries.sort(libraryComparatorByRating(problem)),
    lib => {
      daysLibrariesCumulated += lib.signupDuration;
      return daysLibrariesCumulated < ndays * 0.9;
    }
  );*/

  const filterLibraries = libraries.sort(libraryComparatorByRating(problem));

  const result = filterLibraries
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
  // result.forEach(lib => {
  //   const z = problem.libraries[lib.index].shipCapacity;
  //   if (z < 2) console.log("NOT OPTI");
  // });
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
  const result = bookScoreBySignupDuration;
  assert(
    Number.isFinite(bookScoreBySignupDuration),
    `'${bookScoreBySignupDuration}' is not finite`
  );
  assert(Number.isFinite(result), `'${result}' is not finite`);

  return result;
}

const libraryComparatorByShipCapacity = problem => (lib1, lib2) => {
  return lib2.shipCapacity - lib1.shipCapacity;
};

function totalScoreOfBooksInLibrary(problem, id) {
  const result = problem.libraries[id].books
    .map(book => problem.scores[book])
    .reduce((a, b) => a + b, 0);
  assert(Number.isSafeInteger(result), `'${result}' is not a safe integer`);
  return result;
}

function solveD(problem) {
  const libraries = [...problem.libraries].sort(
    (lib1, lib2) => lib2.books.length - lib1.books.length
  );
  const solution = [];

  libraries.forEach((library, i) => {
    if (
      (library.index % 2 === 0 && solution.includes(library.index + 1)) ||
      (library.index % 2 === 1 && solution.includes(library.index - 1))
    ) {
      const next = libraries[i + 1];
      if (next && next.books.length > library.books.length) {
        solution.push(next.index);
      }
    } else {
      solution.push(library.index);
    }
  });

  return solution.map(libi => ({
    id: libi,
    books: problem.libraries[libi].books
  }));
}

module.exports = solve;
