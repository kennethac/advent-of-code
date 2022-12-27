package day15;

import readInput
import java.lang.Integer.parseInt

class Sensor(var x: Int, var y: Int) {
    var distance: Int = 0
    var    maximumBlocked: Int = 0
    constructor(x: Int, y: Int, sx: Int, sy: Int) : this(x, y) {
        distance = Math.abs(x - sx) + Math.abs(y - sy)
        maximumBlocked = distance * 2 + 1
    }

    fun numBlockedInRow(y: Int): Int {
        var toY = this.y - y
        return maxOf(0, maximumBlocked - 2 * toY)
    }


}
fun getInput(): List<String> {
    return readInput("../../inputs/15.txt").map { it.trim() }.let {
        if (it.last().trim() == "") it.take(it.size - 1)
        else it
    };
}
fun parseInput(): List<Sensor> {
    var lines = getInput()
    var extraction = Regex(".*?(-?\\d+).*?(-?\\d+).*?(-?\\d+).*?(-?\\d+)")
    var sensors = lines.map {
        var matches = extraction.findAll(it).map { gv -> gv.groupValues.map { g -> parseInt(g) } }.first()
        Sensor(matches[0], matches[1], matches[2], matches[3])
    }

    return sensors
}
fun partOne() {
    var sensors = parseInput()
    var totalBlocked = sensors.map {
        sensor -> sensor.numBlockedInRow(2000000)
    }.sum()
    println("partOne: $totalBlocked")
}
fun main() {
    partOne()
}
