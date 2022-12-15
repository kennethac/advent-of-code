package day14

import readInput
import java.lang.Integer.parseInt

typealias Coordinate = Pair<Int, Int>;
typealias Cave = Array<CharArray>;

fun Coordinate.options(): Sequence<Coordinate> {
    return sequence {
        yield(Coordinate(first, second + 1))
        yield(Coordinate(first - 1, second + 1))
        yield(Coordinate(first + 1, second + 1))
    }
}

fun Cave.contains(coordinate: Coordinate): Boolean {
    return size > coordinate.first && first().size > coordinate.second
}

fun Cave.isFreeSpace(coordinate: Coordinate): Boolean {
    return this[coordinate.first][coordinate.second] == Char(0);
}

fun Cave.markFilled(coordinate: Coordinate) {
    this[coordinate.first][coordinate.second] = 'o';
}

fun getInput(): List<String> {
    return readInput("../../inputs/14.txt").map { it.trim() }.let {
        if (it.last().trim() == "") it.take(it.size - 1)
        else it
    };
}

fun parseLine(line: String): Sequence<Coordinate> {
    val coordinates = line.splitToSequence(Regex(" -> "))
        .map {
            it.split(',').map { n -> parseInt(n) }.let { p -> Coordinate(p[0], p[1]) }
        }
    return coordinates
}

fun drawLine(coordinates: Sequence<Coordinate>, map: Cave) {
    for (segment in coordinates.windowed(2, 1)) {
        val first = segment[0];
        val second = segment[1];

        val xProgression =
            if (first.first <= second.first) first.first..second.first else first.first downTo second.first
        val yProgression =
            if (first.second <= second.second) first.second..second.second else first.second downTo second.second

        for (x in xProgression) {
            for (y in yProgression) {
                map[x][y] = '#';
            }
        }
    }
}

fun getCave(addFloor: Boolean): Cave {
    val inputLines = getInput()
    val parsedLines = inputLines.map { parseLine(it) }
    val maxY = parsedLines.flatMap { line -> line.map { it.second } }.max()
    val maxX = parsedLines.flatMap { line -> line.map { it.first } }.max()
    println("$maxX, $maxY")
    val caveRepresentation = Array(maxX + 1) { CharArray(maxY + if (addFloor) 2 else 1) }
    for (line in parsedLines) {
        drawLine(line, caveRepresentation)
    }
    return caveRepresentation;
}

fun drawCave(cave: Cave) {
    for (y in 0 until cave[0].size) {
        for (element in cave) {
            var char = element[y]
            if (char.code == 0) {
                char = '.';
            } else {
//                print("Keepig $char")
            }
            print(char)
        }
        print("\r\n")
    }
}

fun newCaveFromAdded(cave: Cave, added: Set<Coordinate>): Cave {
    val maxY = added.map { it.second }.max() + 1
    val maxX = added.map { it.first }.max() + 1
    val newY = Math.max(maxY, cave.first().size)
    val newX = Math.max(maxX, cave.size)
    val newCave = Cave(newX) { CharArray(newY) }

    // Copy old cave
    for (y in 0 until cave.first().size) {
        for (x in cave.indices) {
            newCave[x][y] = cave[x][y]
        }
    }

    // Add points
    for (a in added) {
        newCave.markFilled(a)
    }

    return newCave
}

fun addSand(cave: Cave, sandOutsideGrid: Set<Coordinate>?): Coordinate? {
    val useFloor = sandOutsideGrid != null;
    val caveDepth = cave.first().size
    var currentPosition = Coordinate(500, 0)
    do {
        val originalPos = currentPosition
        var nextMoves = currentPosition.options()

        for (opt in nextMoves) {
            // Over void and option isn't in grid, it fell.
            if (!useFloor && !cave.contains(opt)) return null
            // Using the floor and option is beneath it
            if (useFloor && opt.second >= caveDepth) continue;
            // In bounds and free, use it.
            if (cave.contains(opt) && cave.isFreeSpace(opt)) {
                currentPosition = opt;
                break
            }
            // Option isn't in grid, but using floor. Check if free.
            if (useFloor && !cave.contains(opt) && !sandOutsideGrid!!.contains(opt)) {
                currentPosition = opt;
                break;
            }
            // Otherwise the space wasn't free, don't move there.
        }

        // IF we didn't change position in this loop, we're done
        // None of the options were free spaces or out of the grid; we're stuck here
        if (originalPos == currentPosition) {
            if (currentPosition == Coordinate(500, 0)) {
                return null;
            }
            return currentPosition
        }
    } while (true);

}

fun partOne(): Int {
    val cave = getCave(false)
    var filledCounter = 0;
    var nextSand: Coordinate? = null;
    while (addSand(cave, null)?.also { nextSand = it } != null) {
        filledCounter++;
        cave.markFilled(nextSand!!)
    }
    return filledCounter
}

fun partTwo(): Int {
    val cave = getCave(true)
    var filledCounter = 0;
    var nextSand: Coordinate? = null;
    val sandOutsideGrid = mutableSetOf<Coordinate>()
    while (addSand(cave, sandOutsideGrid)?.also { nextSand = it } != null) {
        filledCounter++;
        if (cave.contains(nextSand!!)) {
//            println("Filling: ${nextSand!!.first}, ${nextSand!!.second} ")
            cave.markFilled(nextSand!!)
        } else {
//            println("Out of grid: ${nextSand!!.first}, ${nextSand!!.second} ")
            sandOutsideGrid.add(nextSand!!)
        }
    }
//    drawCave(newCaveFromAdded(cave, sandOutsideGrid));
    return filledCounter + 1; /* add one for the source, which was returned null */
}

fun main() {
    // Part One
    val partOneResult = partOne()
    println("Part one: $partOneResult")

    // Part One
    val partTwoResult = partTwo()
    println("Part one: $partTwoResult")


}
