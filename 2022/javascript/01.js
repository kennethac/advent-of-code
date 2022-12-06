function max(l) { return l.reduce((agg, next) => Math.max(agg, next)); }
function sum(l) { return l.reduce((agg, next) => agg + next); }
function top_n(l, n) { return l.reduce((agg, next) => next > agg[0] ? [...agg, next].sort().slice(-n) : agg, new Array(n).fill(0)); }
partOne = max($0.innerText.trim().split("\n\n").map(i => i.split("\n").map(s => parseInt(s))).map(sum))
partTwo = sum(top_n($0.innerText.trim().split("\n\n").map(i => i.split("\n").map(s => parseInt(s))).map(sum), 3))