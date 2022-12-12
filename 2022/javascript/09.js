Array.prototype.sum = function () {
  return this.reduce((agg, next) => agg + next);
};

commands = $0.innerText
  .trim()
  .split("\n")
  .map((l) => l.match(/([RUDL]) (\d+)/).slice(1, 3))
  .map((p) => [p[0], parseInt(p[1])]);

state = { head: [0, 0], tail: [0, 0] };

/**
 *
 * @param {[number, number]} head
 * @param {[number, number]} tail
 * @returns {[number, number]} The new tail position
 */
function follow(head, tail) {
  // Is touching, do nothing.
  if (Math.abs(head[1] - tail[1]) <= 1 && Math.abs(head[0] - tail[0]) <= 1) {
    return [...tail];
  }

  // Is horizontally not touching.
  else if (head[0] === tail[0]) {
    var increment = (head[1] - tail[1]) / Math.abs(head[1] - tail[1]);
    return [tail[0], tail[1] + increment];
  }

  // Is vertically not touching.
  else if (head[1] === tail[1]) {
    var increment = (head[0] - tail[0]) / Math.abs(head[0] - tail[0]);
    return [tail[0] + increment, tail[1]];
  }

  // Is on diagonal
  else {
    var yIncrement = (head[1] - tail[1]) / Math.abs(head[1] - tail[1]);
    var xIncrement = (head[0] - tail[0]) / Math.abs(head[0] - tail[0]);
    return [tail[0] + xIncrement, tail[1] + yIncrement];
  }
}

/**
 *
 * @callback UpdateStrategy
 * @param {[number, number]} head
 * @param {[number, number]} tail
 * @returns {void}
 */

/**
 *
 * @param {['U'|'D'|'L'|'R', number]} command
 * @param {[number, number][]} knots
 * @param {UpdateStrategy} updateStrategy
 * @returns {[number, number][]}
 */
function executeCommand(command, knots, updateStrategy) {
  var steps = {
    U: (h) => [h[0], h[1] + 1],
    D: (h) => [h[0], h[1] - 1],
    L: (h) => [h[0] - 1, h[1]],
    R: (h) => [h[0] + 1, h[1]],
  };

  var distance = command[1];
  var action = steps[command[0]];

  for (var i = 0; i < distance; i++) {
    knots[0] = action(knots[0]);
    for (var j = 0; j < knots.length - 1; j++) {
      try {
        knots[j + 1] = follow(knots[j], knots[j + 1]);
      } catch (e) {
        debugger;
      }
    }
    // console.debug(tail);
    updateStrategy(knots[0], knots[knots.length - 1]);
  }

  return knots;
}

/**
 *
 * @param {number} numKnots
 * @returns
 */
function findUniqueTailSquares(numKnots) {
  /**
   * @type {Map<number, Set<number>>}
   */
  var tailCoordinates = new Map();

  /**
   * @type {UpdateStrategy}
   */
  function updateTailCoordinates(head, tail) {
    var x = tail[0];
    var y = tail[1];

    // debugger;

    if (!tailCoordinates.has(x)) {
      tailCoordinates.set(x, new Set());
    }

    tailCoordinates.get(x).add(y);
  }

  var finalPositions = commands.reduce(
    (agg, next) => executeCommand(next, agg, updateTailCoordinates),
    new Array(numKnots).fill(0).map((_) => [0, 0])
  );

  // Calculate unique tail spots
  var numVisited = [...tailCoordinates.values()].map((s) => s.size).sum();
  return [tailCoordinates, finalPositions, numVisited];
}

partOne = findUniqueTailSquares(2);
console.log("Part One:", partOne[2]);

partTwo = findUniqueTailSquares(10);
console.log("Part Two:", partTwo[2]);
