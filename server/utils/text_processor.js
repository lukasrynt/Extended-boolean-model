const natural = require('natural');
const fs = require('fs');
const sw = require('stopword')

// Preprocess files into json stemmed files and return term vectors
function preprocessFiles(files) {
    let matrix = [];
    files.forEach((filename) => {
        let trimmed = trim(fs.readFileSync('data/collection/' + filename, 'utf-8'));
        matrix = [...matrix, ...(remap(trimmed, filename))];
    });
    fs.writeFileSync(`data/processed.json`, JSON.stringify(matrix));
    return matrix;
}

// Stem and remove duplicities from loaded data
function trim(data) {
    const withoutStops = sw.removeStopwords(data.split(' '));
    return natural.PorterStemmer.tokenizeAndStem(withoutStops.join(' '));
}

// Map to format with word, frequency and filename
function remap(data, filename) {
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

// Load the term vectors depending on whether we have preprocessed json docs or not
function processDocuments() {
    const orig = fs.readdirSync('data/collection');
    if (fs.existsSync('data/processed.json'))
        return JSON.parse(fs.readFileSync('data/processed.json', 'utf-8'));
    else
        return preprocessFiles(orig);
}

module.exports = processDocuments;