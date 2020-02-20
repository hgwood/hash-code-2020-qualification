/* eslint-env mocha */

const assert = require("assert");
const { parse } = require("./read");

describe("parse", function() {
  it("parses correctly", function() {
    const textFromInputFile = `
    6 2 7
1 2 3 6 5 4
5 2 2
0 1 2 3 4
4 3 1
3 2 5 0 `;
    assert.deepEqual(parse(textFromInputFile), {
      ndays: 7,
      scores: [1, 2, 3, 6, 5, 4],
      libraries: [
        {
          signupDuration: 2,
          shipCapacity: 2,
          books: [0, 1, 2, 3, 4]
        },
        {
          signupDuration: 3,
          shipCapacity: 1,
          books: [3, 2, 5, 0]
        }
      ]
    });
  });
});
