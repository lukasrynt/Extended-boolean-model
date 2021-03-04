const natural = require('natural');
const fs = require('fs');

// Preprocess files into json stemmed files and return term vectors
function preprocessFiles(files) {
    let termVec = [];
    files.forEach((filename) => {
        let termVec = {content: stem(fs.readFileSync('data/collection/' + filename, 'utf-8')), file: filename}
        termVec.push(termVec);
        fs.writeFileSync(`data/stemmed/${filename.replace("txt", "json")}`, JSON.stringify(termVec));
    });
    return termVec;
}

// Stem and remove duplicities from loaded data
function stem(data) {
    const stem = natural.PorterStemmer.tokenizeAndStem(data);
    let freqMap = {}
    stem.forEach((word) => {
        if (!freqMap[word])
            freqMap[word] = 0;
        freqMap[word]++;
    });
    return freqMap;
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
    const orig = fs.readdirSync('data/collection');

    // create stemmed folder if it doesn't already exist
    if (!fs.existsSync('data/stemmed')) {
        console.log('here');
        fs.mkdirSync('data/stemmed');
        return preprocessFiles(orig);
    }
    const stemmed = fs.readdirSync('data/stemmed');

    // process documents or just load from json if available
    if (stemmed.filter((name) => name.replace('.json', ''))
        !== orig.filter((name) => name.replace('.txt', '')))
        return preprocessFiles(orig);
    else
        return loadVectors(stemmed);
}

module.exports = load;