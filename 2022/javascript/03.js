function sum(l) {
    return l.reduce((agg, next) => agg + next);    
}

function partition(l, size) {
    let r = []
    for (i = 0; i < l.length; i += size) {
        r.push(l.slice(i, i+size));
    }
    return r;
}

Array.prototype.partition = function (size) {
    return partition(this, size);
}

Array.prototype.sum = function() {
    return sum(this);
}

function parseRucksack(s) {
    let items = s.split('')
    let first = items.slice(0, items.length / 2);
    let second = items.slice(items.length / 2);
    return [first, second];
}

function duplicateItem(left, right) {
    let rSet = new Set(right);
    let intersection = new Set(
        left.filter(x => rSet.has(x)));
    return [...intersection][0];
}

function priority(c) {
    let code = c.charCodeAt(0);
    let lowerCode = 'a'.charCodeAt(0);
    let uppercode = 'A'.charCodeAt(0);
    if (code >= lowerCode) {
        return code - lowerCode + 1;
    }
    else {
        return code - uppercode + 27;
    }
}

let allPriorities = $0.innerText
  .trim()
  .split("\n")
  .map(parseRucksack)
  .map(r => duplicateItem(r[0], r[1]))
  .map(priority);

sum(allPriorities);

$0.innerText
  .trim()
  .split("\n")
  .map(l => new Set(l.split('')))
  .partition(3)
  .map(s => [...s[0]].filter(i => s[1].has(i) && s[2].has(i))[0])
  .map(priority)
  .sum();