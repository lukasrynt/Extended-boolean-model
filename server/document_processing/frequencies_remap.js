const fs = require('fs');

let maxFreq = {};
let dfMap = {};
let numberOfTerms = 0;
let maxWeight = 0;

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

function processTF_IDF(termFreq) {
    termFreq.forEach(({word, freq, filename}) => {
        if (!maxFreq[word] || maxFreq[word] < freq)
            maxFreq[word] = freq;
        if (!dfMap[word]) {
            dfMap[word] = new Set();
            numberOfTerms++;
        }
        dfMap[word].add(filename);
    });
}

function createInvertedIndex(termFreq, numberOfFiles) {
    if (Object.getOwnPropertyNames(dfMap).length === 0)
        processTF_IDF(termFreq);

    // create inverted index
    let invertedIndex = {};
    termFreq.forEach(({word, freq, filename}) => {
        if (!invertedIndex[word])
            invertedIndex[word] = [];
        let weight = tf(word, freq) * idf(word, numberOfFiles);
        if (weight){
            invertedIndex[word].push({file: parseInt(filename), weight: weight});
            if (weight > maxWeight) maxWeight = weight;
        }
    });
    Object.keys(invertedIndex).forEach((key) => {
        invertedIndex[key].sort((a, b) => {
            return a.file - b.file;
        });
    })
    return normalizeWeights(invertedIndex);
}

// function createTDM(termFreq, numberOfFiles) {
//     if (Object.getOwnPropertyNames(dfMap).length === 0)
//         processTF_IDF(termFreq);
//
//     // create term by document sparse matrix in form of 2D array a mapper from word to index
//     let matrix = new Array(numberOfFiles);
//     for (let i = 0; i < numberOfFiles; ++i)
//         matrix[i] = new Array(10).fill(0);
//     let wordToIdx = {};
//     let idx = 0;
//     termFreq.forEach(({word, freq, filename}) => {
//         let fileIdx = parseInt(filename) - 1;
//         if (!wordToIdx[word]) {
//             wordToIdx[word] = idx;
//             while (matrix[fileIdx].length < idx)
//                 matrix[fileIdx].push(0);
//         }
//         matrix[fileIdx][wordToIdx[word]] = tf(word, freq) * idf(word, numberOfFiles);
//         idx++;
//     });
//
//     return {matrix, wordToIdx};
// }


function normalizeWeights(invertedIndex){
    if (maxWeight == 0) return invertedIndex;
    Object.keys(invertedIndex).forEach((key) => {
        invertedIndex[key].forEach((word) => {
            word.weight = word.weight / maxWeight
        })
    })
    return invertedIndex;
}

function tf(word, freq) { 
    return freq / maxFreq[word];
}

function idf(word, numberOfFiles) {
    return Math.log2(numberOfFiles/dfMap[word].size);
}

module.exports = {freqs, createInvertedIndex};