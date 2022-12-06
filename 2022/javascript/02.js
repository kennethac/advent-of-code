/* eslint-disable no-undef */
opponent_map = {
    A: "R",
    B: "P",
    C: "S",
  };
  
  my_map = {
    X: "R",
    Y: "P",
    Z: "S",
  };
  
  move_scores = {
    R: 1,
    P: 2,
    S: 3,
  };
  
  moves = ["R", "P", "S"];
  
  function getRequiredMove(opp, result) {
    if (result === "X") {
      return moves[(moves.indexOf(opp) + 2) % 3];
    } else if (result === "Y") return opp;
    else {
      return moves[(moves.indexOf(opp) + 1) % 3];
    }
  }
  
  function scoreForPair(opp, self) {
    let movePoints = move_scores[self];
    let outcomePoints =
      opp === self
        ? 3
        : (opp === "R" && self === "P") ||
          (opp === "P" && self === "S") ||
          (opp === "S" && self === "R")
        ? 6
        : 0;
    return movePoints + outcomePoints;
  }
  
  function sum(l) {
    return l.reduce((agg, next) => agg + next);
  }
  
  scores = $0.innerText
    .trim()
    .split("\n")
    .map((p) => p.split(" "))
    //   .map(p => [opponent_map[p[0]], my_map[p[1]])
    .map((p) => scoreForPair(opponent_map[p[0]], my_map[p[1]]));
  
  scores2 = $0.innerText
    .trim()
    .split("\n")
    .map((p) => p.split(" "))
    .map((p) => [opponent_map[p[0]], p[1]])
    .map(p => [p[0], getRequiredMove(p[0], p[1])])
    .map(p => scoreForPair(p[0], p[1]));
  
  console.log(sum(scores));
  console.log(sum(scores2));