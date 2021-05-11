let maxFreq = {};
let dfMap = {};
let numberOfTerms = 0;
let maxWeight = 0;

/**
 * Create term vector with terms, frequencies and filenames as individual entries
 * @param {Array<string>} data Data in form of vector with terms
 * @param {string} filename Name of the file, from which the data originates
 * @return {Array<{term: string, freq: number, filename: string}>} Created term vector
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
 * @param {Array<{term: string, freq: number, filename: string}>} termFreq Terms mapped to their frequencies and filename they are in
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
 * @param {Array<{term: string, freq: number, filename: string}>} termFreq Terms mapped to their frequencies and filename they are in
 * @param {number} numberOfFiles Number of all files in the collection
 * @return {Map<string, Array<{file: string, weight: number}>>} Inverted index
 */
function createInvertedIndex(termFreq, numberOfFiles) {
    if (Object.getOwnPropertyNames(dfMap).length === 0)
        processTF_IDF(termFreq);

    // create inverted index
    let invertedIndex = {};
    termFreq.forEach(({term, freq, filename}) => {
        if (!invertedIndex[term])
            invertedIndex[term]= new Array();
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
 * Create matrix term by doc
 * @param {Array<{term: string, freq: number, filename: string}>} termFreq Terms mapped to their frequencies and filename they are in
 * @param {number} numberOfFiles Number of all files in the collection
 * @return {Map<string, Array<{file: string, weight: number}>>} term by doc matrix
 */
function createTermByDocMatrix(termFreq, numberOfFiles) {
    if (Object.getOwnPropertyNames(dfMap).length === 0){
        processTF_IDF(termFreq);
    }
    // create term by document sparse matrix in form of dictionary with two keys
    let matrix = {};
    termFreq.forEach(({term, freq, filename}) => {
        let weight = tf(term, freq) * idf(term, numberOfFiles);
        matrix[[term, filename]] = weight;
        if (weight > maxWeight) maxWeight = weight;
    });
    return normalizeWeightsDict(matrix);
}

/**
 * Normalize the weights of terms to fit into (0,1) interval
 * @param {Map<string, Array<{file: string, weight: number}>>} invertedIndex The inverted index we processed earlier
 * @return {Map<string, Array<{file: string, weight: number}>>} normalized inverted index
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
 * Normalize the weights of terms to fit into (0,1) interval
 * @param {Map<string, Array<{file: string, weight: number}>>} matrix The matrix term by doc we processed earlier
 * @return {Map<string, Array<{file: string, weight: number}>>} normalized matrix term by doc
 */
function normalizeWeightsDict(matrix){
    if (maxWeight === 0) return matrix;
    Object.keys(matrix).forEach((key) => {
        matrix[[key]] = matrix[[key]] / maxWeight
    })
    return matrix;
}

/**
 * Calculate the frequency of term in document
 * @param {string} term Term which frequency we want to get
 * @param {number} freq Frequency of the term
 * @return {number} tf of term
 */
function tf(term, freq) {
    return freq / maxFreq[term];
}

/**
 * Calculate inverse document frequency
 * @param {string} term Term which frequency we want to get
 * @param {number} numberOfFiles Number of all files in the collection
 * @return {number} idf of the term
 */
function idf(term, numberOfFiles) {
    return Math.log2(numberOfFiles/dfMap[term].size);
}

module.exports = {frequencies, createInvertedIndex, createTermByDocMatrix};
