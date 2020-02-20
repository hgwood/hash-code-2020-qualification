/* eslint-env mocha */

const assert = require("assert");
const unparse = require("./write").unparse;

describe("unparse", function() {
  it("unparses correctly", function() {
    assert.deepEqual(unparse([{ id: 1, books: [1, 2, 3] }]), [
      "1",
      "1 3",
      "1 2 3"
    ]);
  });
});
