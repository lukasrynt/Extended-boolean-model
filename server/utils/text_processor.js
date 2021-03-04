const natural = require('natural');
const util = require('util');
const fs = require('fs');

// Preprocess files into json stemmed files and return term vectors
function preprocessFiles(files) {
    let termVec = [];
    files.forEach((filename) => {
        let stemmed = stem(fs.readFileSync('data/collection/' + filename, 'utf-8'));
        termVec.push(stemmed);
        fs.writeFileSync(`data/stemmed/${filename.replace("txt", "json")}`, JSON.stringify(stemmed));
    });
    return termVec;
}

// Stem and remove duplicities from loaded data
function stem(data) {
    const stem = natural.PorterStemmer.tokenizeAndStem(data);
    let seen = {}
    return stem.filter((item) => {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

// Load vectors from json files, returns term vectors
function loadVectors(files) {
    let termVec = [];
    files.forEach((filename) => {
        termVec.push(JSON.parse(fs.readFileSync('data/stemmed/' + filename, 'utf-8')));
    });
    return termVec;
}

// Load the term vectors depending on whether we have preprocessed json docs or not
function load() {
    const stemmed = fs.readdirSync('data/stemmed');
    const orig = fs.readdirSync('data/collection');
    let termVec;
    if (stemmed.length !== orig.length)
        termVec = preprocessFiles(orig);

    else
        termVec = loadVectors(stemmed);
    return termVec;
}

module.exports = load;