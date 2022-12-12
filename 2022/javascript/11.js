Array.prototype.product = function () {
  return this.reduce((agg, next) => agg * next);
};

class Monkey {
  /**
   *
   * @param {number[]} initialItems
   * @param {Function} operation
   * @param {number} testDivisor
   * @param {Function} trueAction
   * @param {Function} falseAction
   * @param {Function} worryLevelReducer
   */
  constructor(
    initialItems,
    operation,
    testDivisor,
    trueAction,
    falseAction,
    worryLevelReducer
  ) {
    this.items = initialItems;
    this.operation = operation;
    this.testDivisor = testDivisor;
    this.trueAction = trueAction;
    this.falseAction = falseAction;
    this.counter = 0;
    this.worryLevelDivisor = worryLevelReducer;
  }

  takeTurn() {
    while (this.items.length > 0) {
      this.counter += 1;
      var nextItem = this.items.shift();
      var newValue = this.worryLevelDivisor(this.operation(nextItem));
      if (newValue % this.testDivisor == 0) {
        this.trueAction(newValue);
      } else {
        this.falseAction(newValue);
      }
    }
  }

  addItem(item) {
    this.items.push(item);
  }
}

/**
 *
 * @param {string} str
 * @param {Monkey[]} monkeyArray
 * @param {boolean} contantWorryLevelReduction
 */
function parseMonkey(str, monkeyArray, contantWorryLevelReduction) {
  var startingItemsRegex = /Starting items: ((?:\d+(?:, )?)+)/;
  var operationRegex = /Operation: new = old ([*+]) ((?:\d+)|old)/;
  var testRegex = /Test: divisible by (\d+)/;
  var trueRegex = /If true: throw to monkey (\d+)/;
  var falseRegex = /If false: throw to monkey (\d+)/;

  var startingItems = str
    .match(startingItemsRegex)[1]
    .split(",")
    .map((s) => s.trim())
    .map((d) => parseInt(d));

  var [op, val] = str.match(operationRegex).slice(1);
  var operation;
  if (val == "old") {
    operation = (x) => x * x;
  } else {
    val = parseInt(val);
    operation = op === "*" ? (x) => x * val : (x) => x + val;
  }
  var divisor = parseInt(str.match(testRegex)[1]);
  var trueMonkey = parseInt(str.match(trueRegex)[1]);
  var falseMonkey = parseInt(str.match(falseRegex)[1]);

  var trueAction = (item) => monkeyArray[trueMonkey].addItem(item);
  var falseAction = (item) => monkeyArray[falseMonkey].addItem(item);

  var monkey = new Monkey(
    startingItems,
    operation,
    divisor,
    trueAction,
    falseAction,
    contantWorryLevelReduction
      ? (x) => Math.floor(x / 3)
      : (x) => x % monkeyArray.map((a) => a.testDivisor).product()
  );
  monkeyArray.push(monkey);
  return monkeyArray;
}

function getMonkeys(constantWorryLevelReduction) {
  return document
    .querySelector("pre")
    .innerText.split("\n\n")
    .reduce(
      (monkeys, nextRep) =>
        parseMonkey(nextRep, monkeys, constantWorryLevelReduction),
      []
    );
}

/**
 *
 * @param {Monkey[]} monkeys
 * @param {number} numRounds
 */
function runRounds(monkeys, numRounds) {
  for (var i = 0; i < numRounds; i++) {
    for (var monkey of monkeys) {
      monkey.takeTurn();
    }
  }
}

function partOne() {
  var monkeys = getMonkeys(true);
  runRounds(monkeys, 20);
  var counters = monkeys.map((m) => m.counter).sort((a, b) => b - a);
  var answer = counters[0] * counters[1];
  console.log("Part One:", answer);
  return monkeys;
}

m = partOne();

function partTwo() {
  var monkeys = getMonkeys(false);
  runRounds(monkeys, 10000);
  var counters = monkeys.map((m) => m.counter).sort((a, b) => b - a);
  var answer = counters[0] * counters[1];
  console.log("Part Two:", answer);
  return monkeys;
}

p2 = partTwo();
