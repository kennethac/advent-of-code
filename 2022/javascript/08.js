Array.prototype.max = function() {
    return this.reduce((agg, next) => next > agg ? next : agg);
}

class Holder {
    /**
     * 
     * @param {number} val 
     * @param {number} y 
     * @param {number} x 
     */
    constructor(val, y, x) {
        this.val = val;
        this.y = y;
        this.x = x;
    }

    /**
     * 
     * @param {number} y_limit The number of rows in the representation
     * @returns 
     */
    toLinear(y_limit) {
        return this.y * y_limit + this.x;
    }
}

function buildHolder(val, y, x) {
    return new Holder(val, y, x);
}

function mirror(m) {
    return m.map(i => [...i].reverse())
}

function transpose(m) {
    new_m = []
    for (var i = 0; i < m[0].length; i++) {
        new_column = []
        for (var j = 0; j < m.length; j++) {
            new_column.push(m[j][i])
        }
        new_m.push(new_column)
    }
    return new_m
}

/**
 * 
 * @param {Holder[][]} rep 
 * @returns {Holder[]}
 */
function findVisibleInRow(rep) {
    return rep.map(row => {
        return row.reduce((agg, next, ind, r) => {
            if (next.val > agg.highestSoFar) {
                return {
                    highestSoFar: next.val,
                    res: [...agg.res, next]
                }
            } else {
                return agg;
            }
        }, { highestSoFar: -1, res: []})
    })
    .reduce((agg, next) => [...agg, next.res], []);
}

/**
 * 
 * @param {Holder[][]} rep 
 * @returns {number[][]}
 */
function getViewsForRows(rep) {
    return rep.map(row => {
        return row.reduce((agg, next, ind) => {
            var height = next.val;

            var minView = ind;
            var otherHeights = Object.keys(agg.distanceTo);
            for (var other of otherHeights) {
                if (other >= height) {
                    var blockedView = ind - agg.distanceTo[other];
                    minView = Math.min(blockedView, minView);
                }
            }
            
            return { 
                distanceTo: {
                    ...agg.distanceTo,
                    [height]: ind
                },
                thusFar: [...agg.thusFar, minView]
            }
        }, { distanceTo: {}, thusFar: [] })
        .thusFar;
    })
}

function parseMatrix(el) {
    return el.innerText.trim().split("\n").map(i => i.split("").map(i => parseInt(i)))
}

representation = parseMatrix($0)
    .map((row, y) => row.map((val, x) => buildHolder(val, y, x)))

normalVisible = findVisibleInRow(representation);
reverseVisible = findVisibleInRow(mirror(representation));
transposeVisible = findVisibleInRow(transpose(representation));
rotatedVisible = findVisibleInRow(mirror(transpose(representation)));

allVisible = new Set(
    [].concat(...normalVisible.concat(reverseVisible, transposeVisible, rotatedVisible))
        .map(x => x.toLinear(representation.length)));

console.log("Answer 1:", allVisible.size);

// allViews = representation.map((row, y) => row.map((_, x) => getViewFromTree(x, y)));
normalViews = getViewsForRows(representation);
reverseViews = mirror(getViewsForRows(mirror(representation)));
transposeViews = transpose(getViewsForRows(transpose(representation)));
badViews = transpose(mirror(getViewsForRows(mirror(transpose(representation)))));

allViews = [normalViews, reverseViews, transposeViews, badViews];

products = []

for (var y = 0; y < normalViews.length; y++) {
    new_row = [];
    for (var x = 0; x < normalViews[0].length; x++) {
        new_row.push(allViews.reduce((agg, next) => agg*next[y][x], 1));
    }
    products.push(new_row);
}

bestView = products.map(row => row.max()).max()
console.log("Answer 2:", bestView)