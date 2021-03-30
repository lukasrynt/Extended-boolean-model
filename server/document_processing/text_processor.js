const natural = require('natural');
const fs = require('fs');
const sw = require('stopword');
const {freqs, createInvertedIndex} = require('./frequencies_remap');

const collectionPath = 'data/collection_3000/'

// Preprocess files into json stemmed files and return term vectors
function preprocessFiles(files) {
    let termFreq = [];
    let numberOfFiles = 0;
    files.forEach((filename) => {
        let trimmed = trim(fs.readFileSync(collectionPath + filename, 'utf-8'));
        termFreq = [...termFreq, ...(freqs(trimmed, filename))];
        numberOfFiles++;
    });
    // let TDM = createTDM(termFreq, numberOfFiles);
    let invertedIndex = createInvertedIndex(termFreq, numberOfFiles);
    // fs.writeFileSync(`data/term_by_doc_matrix.json`, JSON.stringify(TDM, null, 2));
    fs.writeFileSync(`data/inverted_index.json`, JSON.stringify(invertedIndex, null, 2));
    return invertedIndex;
}

// Stem and remove duplicities from loaded data
function trim(data) {
    const withoutStops = sw.removeStopwords(data.split(' '));
    return natural.PorterStemmer.tokenizeAndStem(withoutStops.join(' '));
}

// Load the term vectors depending on whether we have preprocessed json docs or not
function processDocuments() {
    const path = 'data/inverted_index.json';
    const orig = fs.readdirSync(collectionPath);
    if (fs.existsSync(path))
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    else
        return preprocessFiles(orig);
}

module.exports = processDocuments;