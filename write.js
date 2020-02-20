const _ = require("lodash/fp");
const fs = require("fs");
const debug = require("debug")("write");

module.exports = function write(path, solution) {
  writeLines(path, unparse(solution));
};

function writeLines(path, lines) {
  fs.writeFileSync(path, lines.join("\n"));
  debug(`wrote ${lines.length} lines to ${path}`);
}

const unparse = solution => {
  return [
    solution.length,
    ...solution.flatMap(library => [
      `${library.id} ${library.books.length}`,
      library.books.join(" ")
    ])
  ];
};

module.exports.unparse = unparse;
