let maxFreq = {};
let dfMap = {};
let numberOfTerms = 0;
let maxWeight = 0;

/**
 * Create term vector with terms, frequencies and filenames as individual entries
 * @param data Data in form of vector with terms
 * @param filename Name of the file, from which the data originates
 * @return Created term vector
 */
function frequencies(data, filename) {
    // Add frequencies
    let freqMap = {}
    data.forEach((term) => {
        if (!freqMap[term])
            freqMap[term] = 0;
        freqMap[term]++;
    });

    // Map to frequencies and document
    let termVec = [];
    for (let [key, value] of Object.entries(freqMap)) {
        termVec.push({term: key, freq: value, filename: filename.replace('.txt', '')})
    }
    return termVec;
}

/**
 * Calculates tf-idf of all terms
 * @param termFreq Terms mapped to their frequencies and filename they are in
 */
function processTF_IDF(termFreq) {
    termFreq.forEach(({term, freq, filename}) => {
        if (!maxFreq[term] || maxFreq[term] < freq)
            maxFreq[term] = freq;
        if (!dfMap[term]) {
            dfMap[term] = new Set();
            numberOfTerms++;
        }
        dfMap[term].add(filename);
    });
}

/**
 * Create inverted index
 * @param termFreq Terms mapped to their frequencies and filename they are in
 * @param numberOfFiles Number of all files in the collection
 * @return Inverted index
 */
function createInvertedIndex(termFreq, numberOfFiles) {
    if (Object.getOwnPropertyNames(dfMap).length === 0)
        processTF_IDF(termFreq);

    // create inverted index
    let invertedIndex = {};
    termFreq.forEach(({term, freq, filename}) => {
        if (!invertedIndex[term])
            invertedIndex[term] = [];
        let weight = tf(term, freq) * idf(term, numberOfFiles);
        if (weight){
            invertedIndex[term].push({file: parseInt(filename), weight: weight});
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

/**
 * Normalize the weights of terms to fit into (0,1) interval
 * @param invertedIndex The inverted index we processed earlier
 * @return normalized inverted index
 */
function normalizeWeights(invertedIndex){
    if (maxWeight === 0) return invertedIndex;
    Object.keys(invertedIndex).forEach((key) => {
        invertedIndex[key].forEach((term) => {
            term.weight = term.weight / maxWeight
        })
    })
    return invertedIndex;
}

/**
 * Calculate the frequency of term in document
 * @param term Term which frequency we want to get
 * @param freq Frequency of the term
 * @return tf of term
 */
function tf(term, freq) {
    return freq / maxFreq[term];
}

/**
 * Calculate inverse document frequency
 * @param term Term which frequency we want to get
 * @param numberOfFiles Number of all files in the collection
 * @return idf of the term
 */
function idf(term, numberOfFiles) {
    return Math.log2(numberOfFiles/dfMap[term].size);
}

module.exports = {frequencies, createInvertedIndex};