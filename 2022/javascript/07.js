Array.prototype.sum = function sum() {
    return this.reduce((agg, next) => agg + next, 0);
}

Map.prototype.toValueList = function () {
    return [...this.values()];
}

/**
 * 
 * @param {Element} el 
 * @returns {string[]}
 */
function getLines(el) {
    return el.innerText.trim().split("\n");
}

/**
 * 
 * @class
 * @constructor
 * @public
 */
class Directory {
    /**
     * 
     * @param {string} name 
     * @param {Directory} parentDirectory 
     */
    constructor(name, parentDirectory) {
        this.name = name;

        /**
         * @type {Map<string, number>}
         */
        this.subdirectories = new Map();

        /**
         * @type {Map<string, number>}
         */
        this.files = new Map();

        /**
         * @type {Directory}
         */
        this.parent = parentDirectory;

        /**
         * @type {number | undefined}
         */
        this.cachedSize = undefined;

        /**
         * @type {boolean}
         */
        this.cachedSizeIsValid = false;
    }

    /**
     * 
     * @param {string} name 
     * @param {number} size 
     */
    addFile(name, size) {
        if (this.files.has(name)) {
            // console.error("Skipping duplicate file", name, size);
            // return;
            throw "Tried to add a file to a directory twice";
        }

        this.files.set(name, size);
    }

    addSubDirectory(name) {
        if (this.subdirectories.has(name)) {
            // return;
            throw "Tried to add a subdirectory to a directory twice.";
        }

        this.subdirectories.set(name, new Directory(name, this));
        return this.subdirectories.get(name);
    }

    getSize() {
        return this.subdirectories.toValueList().map(d => d.getSize()).sum() + this.files.toValueList().sum();
    }

    getParent() {
        return this.parent || this;
    }

    /**
     * 
     * @param {string} name 
     * @returns {Directory}
     */
    getSubdirectory(name) {
        return this.subdirectories.get(name);
    }

    /**
     * 
     * @param {Function<Directory>} visitAction 
     */
    visit(visitAction) {
        this.subdirectories.toValueList().forEach(i => i.visit(visitAction));
        visitAction(this);
    }
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {Directory} currentDirectory 
 * @param {string} targetDirectory 
 * @returns 
 */
function processCdLine(rootDirectory, currentDirectory, targetDirectory) {
    if (targetDirectory == '/') {
        var newRoot = rootDirectory === undefined ? new Directory('/', undefined) : rootDirectory;
        return [newRoot, newRoot];
    }
    else if (targetDirectory == '..') {
        return [rootDirectory, currentDirectory.getParent()]
    }
    else {
        var existingTarget = currentDirectory.getSubdirectory(targetDirectory);
        if (existingTarget) {
            return [rootDirectory, existingTarget];
        }
        else {
            var newCurrent = currentDirectory.addSubDirectory(targetDirectory);
            return [rootDirectory, newCurrent];
        }
    }
}

/**
 * Does nothing because the results will be processed on their own since I can assume
 * a "correct" input and each line is unambiguous in its tree operation.
 * @param {Directory} rootDirectory 
 * @param {Directory} currentDirectory 
 * @returns 
 */
function processLsLine(rootDirectory, currentDirectory) {
    return [rootDirectory, currentDirectory];
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {Directory} currentDirectory 
 * @param {string} childName 
 */
function processDirLine(rootDirectory, currentDirectory, childName) {
    currentDirectory.addSubDirectory(childName);
    return [rootDirectory, currentDirectory];
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {Directory} currentDirectory 
 * @param {string} fileName 
 * @param {number} fileSize
 */
function processFileLine(rootDirectory, currentDirectory, fileName, fileSize) {
   currentDirectory.addFile(fileName, fileSize);
   return [rootDirectory, currentDirectory];
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {Directory} currentDirectory 
 * @param {string} line 
 */
function processLine(rootDirectory, currentDirectory, line) {
    var cdLine = /\$ cd (.*)/
    var lsLine = /\$ ls/
    var dirLine = /dir (.*)/
    var fileLine = /(\d+) (.*)/

    var cdRes = line.match(cdLine);
    var lsRes = line.match(lsLine);
    var dirRes = line.match(dirLine);
    var fileRes = line.match(fileLine);

    if (cdRes) {
        return processCdLine(rootDirectory, currentDirectory, cdRes[1]);
    }
    else if (lsRes) {
        return processLsLine(rootDirectory, currentDirectory);
    }
    else if (dirRes) {
        return processDirLine(rootDirectory, currentDirectory, dirRes[1]);
    }
    else if (fileRes) {
        return processFileLine(rootDirectory, currentDirectory, fileRes[2], parseInt(fileRes[1]));
    }
    else {
        throw "Line didn't match any type: " + line;
    }
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {number} largeThreshold
 */
function findLargeDirectories(rootDirectory, largeThreshold) {
    /**
     * @type {Directory[]}
     */
    var largeDirectories = [];
    
    /**
     * 
     * @param {Directory} directory 
     */
    function visitFunction(directory) {
        var size = directory.getSize();
        if (size >= largeThreshold) {
            largeDirectories.push(directory);
        }
    }

    rootDirectory.visit(visitFunction);
    return largeDirectories;
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {number} smallThreshold
 */
 function findSmallDirectories(rootDirectory, smallThreshold) {
    /**
     * @type {Directory[]}
     */
    var largeDirectories = [];
    
    /**
     * 
     * @param {Directory} directory 
     */
    function visitFunction(directory) {
        var size = directory.getSize();
        if (size <= smallThreshold) {
            largeDirectories.push(directory);
        }
    }

    rootDirectory.visit(visitFunction);

    return largeDirectories;
}

/**
 * 
 * @param {Directory} rootDirectory 
 * @param {number} targetSize 
 */
function findSmallestDirectoryOfAtleastSize(rootDirectory, targetSize) {
    var selectedDirectory = rootDirectory;
    var selectedSize = rootDirectory.getSize();

    /**
     * 
     * @param {Directory} directory 
     */
    function visitFunction(directory) {
        var size = directory.getSize();
        if (size >= targetSize && size < selectedSize) {
            selectedDirectory = directory;
            selectedSize = size;
        }
    }

    rootDirectory.visit(visitFunction);

    return selectedDirectory;
}

completedTree =
    getLines($0)
        .reduce((agg, next) => {
            return processLine(agg[0], agg[1], next);
        }, [undefined, undefined]);

largeSizesSum = findSmallDirectories(completedTree[0], 100000)
        .map(d => d.getSize())
        .sum();

spaceAvailable = 70000000;
spaceRequired = 30000000;
spaceUsed = completedTree[0].getSize();
spaceToFree = spaceRequired - (spaceAvailable - spaceUsed);
toDelete = findSmallestDirectoryOfAtleastSize(completedTree[0], spaceToFree);

console.log("Part 1: " + largeSizesSum);
console.log("Part 2: " + toDelete.getSize());
