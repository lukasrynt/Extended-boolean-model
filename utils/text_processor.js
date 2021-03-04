const natural = require('natural');
const util = require('util');
const fs = require('fs');

// Preprocess files into json stemmed files and return term vectors
async function preprocessFiles(files) {
    const asyncLoadFile = util.promisify(fs.readFile);
    let termVec = [];
    for (const filename of files) {
        let content;
        try {
            content = await asyncLoadFile( 'data/collection/' + filename, 'utf-8');
        } catch (e) {
            console.log(e.message);
            return;
        }

        // push to vec and write out to result
        let stemmed = stem(content);
        termVec.push(stemmed);
        fs.writeFile(`data/stemmed/${filename.replace("txt", "json")}`,
            JSON.stringify(stemmed),
            (err) => {
                if (err) console.log(err.message);
            });
    }
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
async function loadVectors(files) {
    const asyncLoadFile = util.promisify(fs.readFile);
    let termVec = [];
    for (const filename of files) {
        let content;
        try {
            content = await asyncLoadFile('data/stemmed/' + filename, 'utf-8');
        } catch (e) {
            console.log(e.message);
            return;
        }
        termVec.push(JSON.parse(content));
    }
    return termVec;
}

// Load the term vectors depending on whether we have preprocessed json docs or not
async function load() {
    const asyncLoadDir = util.promisify(fs.readdir);
    const stemmed = await asyncLoadDir('data/stemmed');
    const orig = await asyncLoadDir('data/collection');
    let termVec;
    if (stemmed.length !== orig.length)
        termVec = await preprocessFiles(orig);

    else
        termVec = await loadVectors(stemmed);
    return termVec;
}

module.exports = load;