const natural = require('natural');
const fs = require('fs');

function load(onLoad) {
    fs.readdir('dataset', (err, files) => {
        if (err) {
            console.log(err.message);
            return;
        }
        files.forEach((filename) => {
            fs.readFile(`./dataset/${filename}`, 'utf-8', (err, data) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                onLoad(data, filename);
            });
        });
    });
}

function stem(data) {
    const stem = natural.PorterStemmer.tokenizeAndStem(data);
    let seen = {}
    return stem.filter((item) => {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function loadAndStem() {
    load((data, filename) => {
        fs.writeFile(`stemmed/stemmed_${filename.replace("txt", "json")}`,
            JSON.stringify(stem(data)),
            (err) => {
            if (err) console.log(err.message);
        })
    })
}

module.exports = loadAndStem;