var letters = $0.innerText.trim().split('');

function uniqueSequenceStartIndex(sequenceLength) {
    var chunks = new Array(letters.length - sequenceLength + 1).map((a, i) => letters.slice(i, i+sequenceLength));
    for (var i = 0; i < chunks.length; i++) {
        var s = new Set(chunks[i]);
        if (s.length == chunks[i].length) {
            console.log(i);
            break;
        }
    }
}

uniqueSequenceStartIndex(4);
uniqueSequenceStartIndex(14);