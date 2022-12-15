package day12

import readInput
import java.util.*

typealias Cell = Pair<Int, Int>;

fun getInput(): List<String> {
    return readInput("../../inputs/12.txt").map { it.trim() }.let {
        if (it.last().trim() == "") it.take(it.size - 1)
        else it
    };
}

data class TopoMap(
    val startPosition: Cell, val endPosition: Cell, @Suppress("ArrayInDataClass") val map: Array<IntArray>
);

fun findShortestPath(map: TopoMap): List<Cell> {
    val start = map.startPosition;
    println(start)
    val end = map.endPosition;

    val topo = map.map
    val height = topo[0].size
    val width = topo.size

    val guess = fun(inp: Cell): Int {
        return Math.abs(inp.first - end.first) + Math.abs(inp.second - end.second)
    }

    val cameFrom = HashMap<Cell, Cell>();
    val costTo = HashMap<Cell, Int>()
    val totalGuess = HashMap<Cell, Int>()

    val openSet = PriorityQueue(Comparator<Cell> { o1, o2 ->
        val f1 = totalGuess.getOrDefault(o1, Int.MAX_VALUE)
        val f2 = totalGuess.getOrDefault(o2, Int.MAX_VALUE)
        f1.compareTo(f2);
    })

    openSet.add(start)
    costTo[start] = 0;
    totalGuess[start] = guess(start)
    cameFrom[start] = start;

    while (openSet.isNotEmpty()) {
        val next = openSet.poll()

        // If done
        if (next == end) {
            val s = sequence {
                var n = next;
                do {
                    yield(n);
                    n = cameFrom[n];
                } while (n != start);
            }
            return s.toList().asReversed()
        }

        val neighbors = sequence {
            if (next.second < height - 1) yield(Pair(next.first, next.second + 1))
            if (next.second > 0) yield(Pair(next.first, next.second - 1))
            if (next.first < width - 1) yield(Pair(next.first + 1, next.second))
            if (next.first > 0) yield(Pair(next.first - 1, next.second))
        }.filter { topo[it.first][it.second] <= topo[next.first][next.second] + 1 }

        for (neighbor in neighbors) {
            val tentativeScore = costTo.getOrDefault(next, Int.MAX_VALUE) + 1 //guess(neighbor)
            if (tentativeScore < costTo.getOrDefault(neighbor, Int.MAX_VALUE)) {
                cameFrom[neighbor] = next
                costTo[neighbor] = tentativeScore
                totalGuess[neighbor] = tentativeScore + guess(neighbor)

                // Put neighbor in in order.
                openSet.remove(neighbor)
                openSet.add(neighbor)
            }
        }
    }

    throw NotImplementedError()
}

fun getMap(): TopoMap {
    val input = getInput()
    val charMap = input.map { it.toCharArray() }.toTypedArray()

    // Find start and end
    var startPosition = Pair(-1, -1)
    var endPosition = Pair(-1, -1)

    for (x in charMap.indices) {
        for (y in charMap[x].indices) {
            if (charMap[x][y] == 'S') {
                startPosition = Pair(x, y)
                charMap[x][y] = 'a';
            }
            if (charMap[x][y] == 'E') {
                endPosition = Pair(x, y)
                charMap[x][y] = 'z';
            }
        }
    }

    var map = charMap.map { row -> row.map { it.code - 'a'.code }.toIntArray() }.toTypedArray()
    return TopoMap(startPosition, endPosition, map)
}

fun main() {
    val topoMap = getMap()
    val shortestPath = findShortestPath(topoMap)
    println("Part One: ${shortestPath.size}")

    val allPossibleStarts = sequence {
        for (x in 0 until topoMap.map.size) {
            for (y in 0 until topoMap.map[0].size) {
                if (topoMap.map[x][y] == 0) {
                    yield(Pair(x, y))
                }
            }
        }
    }

    val mostDirect = allPossibleStarts
        .map {
            try {
                findShortestPath(TopoMap(it, topoMap.endPosition, topoMap.map))
            } catch (e: NotImplementedError) {
                null
            }
        }
        .filter { it != null }
        .minBy { it!!.size }!!

    println("Part Two: ${mostDirect.size}")
}