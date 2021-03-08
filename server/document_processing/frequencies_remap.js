let maxFreq = {};
let dfMap = {};
let numberOfTerms = 0;

// Map to format with word, frequency and filename
function freqs(data, filename) {

    // Add frequencies
    let freqMap = {}
    data.forEach((word) => {
        if (!freqMap[word])
            freqMap[word] = 0;
        freqMap[word]++;
    });

    // Map to frequencies and document
    let termVec = [];
    for (let [key, value] of Object.entries(freqMap)) {
        termVec.push({word: key, freq: value, filename: filename.replace('.txt', '')})
    }
    return termVec;
}

function createTermByDocMatrix(termFreq, numberOfFiles) {

    // count tf and idf
    termFreq.forEach(({word, freq, filename}) => {
        if (!maxFreq[word] || maxFreq[word] < freq)
            maxFreq[word] = freq;
        if (!dfMap[word]) {
            dfMap[word] = new Set();
            numberOfTerms++;
        }
        dfMap[word].add(filename);
    });

    // create term by document sparse matrix in form of dictionary with two keys
    let matrix = {};
    termFreq.forEach(({word, freq, filename}) => {
        matrix[[word, filename]] = tf(word, freq) * idf(word, numberOfFiles);
    });
    return matrix;
}

function tf(word, freq) {
    return freq / maxFreq[word];
}

function idf(word, numberOfFiles) {
    return Math.log2(numberOfFiles/dfMap[word].size)
}

module.exports = {freqs, createTermByDocMatrix};