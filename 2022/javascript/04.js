function parseRange(r) {
    return r.split("-").map((i) => parseInt(i));
  }
  
  function hasInner(pair) {
    let first = pair[0];
    let second = pair[1];
  
    // First is inside second
    if (first[0] >= second[0] && first[1] <= second[1]) {
      return true;
    }
  
    if (second[0] >= first[0] && second[1] <= first[1]) {
      return true;
    }
  
    return false;
  }
  
  function hasOverlap(pair) {
    let first = pair[0];
    let second = pair[1];
  
    return !(
      second[0] > first[1] ||
      first[0] > second[1] ||
      second[1] < first[0] ||
      first[1] < second[0]
    );
  }
  
  // First part
  $0.innerText
    .trim()
    .split("\n")
    .map((s) => s.split(","))
    .map((p) => [parseRange(p[0]), parseRange(p[1])])
    .reduce((agg, next) => {
      if (hasInner(next)) return agg + 1;
      return agg;
    }, 0);
  
  // Second part
  $0.innerText
    .trim()
    .split("\n")
    .map((s) => s.split(","))
    .map((p) => [parseRange(p[0]), parseRange(p[1])])
    .reduce((agg, next) => {
      if (hasOverlap(next)) return agg + 1;
      return agg;
    }, 0);
  