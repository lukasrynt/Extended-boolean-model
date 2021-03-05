const natural = require('natural');
const fs = require('fs');
const sw = require('stopword');
const remap = require('term_by_document');

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

// Load the term vectors depending on whether we have preprocessed json docs or not
function processDocuments() {
    const orig = fs.readdirSync('data/collection');
    if (fs.existsSync('data/processed.json'))
        return JSON.parse(fs.readFileSync('data/processed.json', 'utf-8'));
    else
        return preprocessFiles(orig);
}

module.exports = processDocuments;