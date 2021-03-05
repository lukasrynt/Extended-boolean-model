let collectionFreqMap = {};

// Map to format with word, frequency and filename
function remap(data, filename) {
    // Add frequencies
    let freqMap = {}
    data.forEach((word) => {
        if (!freqMap[word])
            freqMap[word] = 0;
        if (!collectionFreqMap[word])
            collectionFreqMap[word] = 0;
        freqMap[word]++;
        collectionFreqMap[word]++;
    });

    // Map to frequencies and document
    let termVec = [];
    for (let [key, value] of Object.entries(freqMap)) {
        termVec.push({word: key, freq: value, filename: filename.replace('.txt', '')})
    }
    return termVec;
}

module.exports = remap;