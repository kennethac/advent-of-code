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
    return this.reduce((agg, next) => agg + next);
}

inputs = document.querySelector("pre").innerText.trim().split('\n');
addRegex = /addx (-?\d+)/

generateStates = function*(lines) {
    var clock = 0;
    var value = 1;

    for (var input of lines) {
        var match = input.match(addRegex);

        if (!match) {
            clock += 1;
            yield { clock, value, strength: clock*value }
        }
        else {
            var toAdd = parseInt(match[1]);
            clock += 1;
            yield { clock, value, strength: clock*value }
            clock += 1;
            yield { clock, value, strength: clock*value }
            value += toAdd;
        }
    }
}

filterGenerator = function*(generator, predicate) {
    for (var val of generator) {
        if (predicate(val)) {
            yield val;
        }
    }
}

states = [...generateStates(inputs)];

Object.getPrototypeOf(states).filter = function(predicate) {
    return filterGenerator(this, predicate);
}

filtered = [...states.filter(s => s.clock > 0 && s.clock <= 220 && (s.clock + 20) % 40 == 0)];
partOne = filtered.map(x=>x.strength).sum();

states.map(v => Math.abs(((v.clock - 1) % 40) - v.value) <= 1 ? '#':'.').partition(40).map(l => l.join('')).forEach(element => {
   console.log(element) 
});