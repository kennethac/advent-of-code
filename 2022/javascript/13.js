Array.prototype.sum = function () {
  return this.reduce((agg, next) => agg + next, 0);
};

Array.prototype.product = function () {
    return this.reduce((agg, next) => agg * next, 1);
  };

function getAllPairs() {
  allPairs = document
    .querySelector("pre")
    .innerText.trim()
    .split("\n\n")
    .map((p) => p.split("\n").map((s) => eval(s)));
  return allPairs;
}
allPairs = getAllPairs();

verbose = false;
function compare(left, right) {
  console.debug("Comparing", left, right);

  if (left instanceof Array && !(right instanceof Array)) {
    console.debug("Converting right side");
    right = [right];
  }

  if (right instanceof Array && !(left instanceof Array)) {
    console.debug("Converting left side");
    left = [left];
  }

  if (left instanceof Array && right instanceof Array) {
    var lengthOfLeft = left.length;
    var lengthOfRight = right.length;
    var iterLength = Math.min(lengthOfLeft, lengthOfRight);

    for (var i = 0; i < iterLength; i++) {
      var nextRes = compare(left[i], right[i]);
      if (nextRes > 0) {
        console.debug(left, right, 1);
        return 1;
      }
      if (nextRes < 0) {
        console.debug(left, right, -1);
        return -1;
      }
    }

    // Subsequences were identical. Look to length.
    if (lengthOfLeft < lengthOfRight) {
      console.debug(left, right, -1);
      return -1;
    } else if (lengthOfLeft === lengthOfRight) {
      console.debug(left, right, 0);
      return 0;
    } else {
      console.debug(left, right, 1);
      return 1;
    }
  } else if (left === right) {
    console.debug(left, right, 0);
    return 0;
  } else {
    var res = Math.abs(left - right) / (left - right);
    console.debug(left, right, res);
    return res;
  }
}

partOne = allPairs
  .map((p, i) => [i, compare(p[0], p[1])])
  .filter((x) => x[1] === -1)
  .map((p) => p[0] + 1)
  .sum();

extras = [[[2]], [[6]]]
partTwo = allPairs
  .concat(extras)
  .map((p, i) => [p, i])
  .sort((a, b) => compare(a[0], b[0]))
  .filter(p => extras.some(e => JSON.stringify(e) === JSON.stringify(p[0])))
  .map((p) => p[1] + 1);
