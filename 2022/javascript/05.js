function parseStacks(lines) {
    num_stacks = Math.ceil(lines[0].length / 4);

    stacks = new Array(num_stacks);
    for (var i = 0; i < num_stacks; i++) {
        stacks[i] = [];
    }

    for (var line of lines.reverse()) { // reverse to start from the bottom
        for (var i = 0; i < num_stacks; i++) {
            var charIndex = (i * 4) + 1;
            var char = line[charIndex];
            if (char !== ' ') {
                stacks[i].push(char);
            }
            
        }
    }

    return stacks;
}

function parseCommands(lines) {
    return lines.map(l => [...l.match(/move (\d+) from (\d+) to (\d+)/)].slice(1))
}

sections = $0.innerText
  .trim()
  .split("\n\n");  

stack_definitions = sections[0].split('\n').slice(0, -1);
stacks = parseStacks(stack_definitions)

commands = parseCommands(sections[1].split('\n'))

/// comment out because stacks variable gets mutated. Should deep copy before passing to reduce.
// for part one
// tops = commands.reduce((agg, next) => {
//     var num = next[0];
//     var from = next[1] - 1;
//     var to = next[2] - 1;

//     for (var i = 0; i < num; i++) {
//         var popped = agg[from].pop()
//         agg[to].push(popped)
//     }

//     return agg;
// }, stacks)
// .map(s => s.pop())
// .join("")

// for part two
tops2 = commands.reduce((agg, next) => {
    var num = next[0];
    var from = next[1] - 1;
    var to = next[2] - 1;

    var allPopped = []
    for (var i = 0; i < num; i++) {
        var popped = agg[from].pop()
        allPopped.push(popped);
    }

    for (var p of allPopped.reverse()) {
        agg[to].push(p)
    }

    return agg;
}, stacks)
.map(s => s.pop())
.join("")


