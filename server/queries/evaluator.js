const fs = require('fs');

let invertedIdx;
let collectionPath;

/**
 * Evaluate the relevance of terms in documents
 * @param {Node | AndNode | OrNode | NotNode}processedQuery Query processed into AST
 * @param {Map<string, Array<{file: string, weight: number}>>} invertedIndex Inverted index containing the terms and frequencies
 * @param {string} colPath Path to collection
 * @return {Array<{file: string, weight: number}> | undefined} Evaluated AST converted to weights and filenames
 */
function evaluate(processedQuery, invertedIndex, colPath){
    collectionPath = colPath;
    invertedIdx = invertedIndex;
    let res = parse(processedQuery);
    if (!res) return;

    // sort files by weight
    res.content.sort((a, b) => {
        return b.weight - a.weight;
    });
    console.log("---processed---")
    console.log(res.content)
    console.log("---------------")
    return res.content;
}

/**
 * Recursively evaluate all subnodes of the original AST
 * @param {Node | AndNode | OrNode | NotNode} processedQuery Query processed into AST
 * @return {{expression: string, content: Array<{file: string, weight: number}>} | undefined} Evaluated AST converted to weights and filenames
 */
function parse(processedQuery) {
    if (processedQuery.operator === "!")
        return parseNot(processedQuery);
    else if (processedQuery.value)
        return parseTerm(processedQuery.value)
    else if (processedQuery.operator === "||")
        return parseOr(processedQuery);
    else if (processedQuery.operator === "&&")
        return parseAnd(processedQuery);
}

/**
 * Pushes single element to result
 * @param {Array<{file: string, weight: number}>} resContent Result content
 * @param {{file: string, weight: number}} content Content we want to push
 */
function pushSingleContent(resContent, content) {
    resContent.push({
        file: content.file,
        weight: content.weight
    });
}

/**
 * Parses OR node in AST
 * @param {OrNode} processedQuery AST subtree
 * @return {{expression: string, content: Array<{file: string, weight: number}>} | undefined} Processed OR node
 */
function parseOr(processedQuery) {
    let left = parse(processedQuery.lVal)
    let right = parse(processedQuery.rVal)
    if (!left || !right) return
    let resExpression = "(" + left.expression + " && " + right.expression + ")";
    let resContent = [];
    // merge style counting
    let l = 0, r = 0;
    while (l < left.content.length && r < right.content.length) {
        if (left.content[l].file === right.content[r].file) {
            resContent.push({
                file: left.content[l].file,
                weight: Math.sqrt( (Math.pow(left.content[l].weight, 2) + Math.pow(right.content[r].weight, 2)) / 2 )
            });
            l++
            r++;
        }
        else if (left.content[l].file < right.content[r].file)
            pushSingleContent(resContent, left.content[l++]);
        else if (left.content[l].file > right.content[r].file)
            pushSingleContent(resContent, right.content[r++]);
    }
    for (;l < left.content.length; ++l)
        pushSingleContent(resContent, left.content[l])
    for (;r < right.content.length; ++r)
        pushSingleContent(resContent, right.content[r]);
    return {
        expression: resExpression,
        content: resContent
    }
}

/**
 * Parses AND node in AST
 * @param {AndNode} processedQuery AST subtree
 * @return {{expression: string, content: Array<{file: string, weight: number}>} | undefined} Processed AND node
 */
function parseAnd(processedQuery) {
    let left = parse(processedQuery.lVal)
    let right = parse(processedQuery.rVal)
    if (!left || !right) return

    let resExpression = "(" + left.expression + " && " + right.expression + ")";
    if (!left.content || !right.content)
        return {
            expression: resExpression,
            content: []
        }
    // merge style counting
    let resContent = [];
    let l = 0, r = 0;
    while (l < left.content.length && r < right.content.length) {
        if (left.content[l].file === right.content[r].file) {
            resContent.push({
                file: left.content[l].file,
                weight: 1 - Math.sqrt( (Math.pow(1 - left.content[l].weight, 2) + Math.pow(1 - right.content[r].weight, 2)) / 2 )
            });
            l++;
            r++;
        }
        else if (left.content[l].file < right.content[r].file)
            l++;
        else if (left.content[l].file > right.content[r].file)
            r++;
    }

    return {
        expression: resExpression,
        content: resContent
    }
}

/**
 * Evaluate a single term - the leaf of AST
 * @param {string} expression Expression to be evaluated
 * @return {{expression: string, content: Array<{file: string, weight: number}>} | undefined} Result of the evaluation
 */
function parseTerm(expression) {
    if (!invertedIdx[expression]) return;
    let result = {
        expression: expression,
        content: JSON.parse(JSON.stringify(invertedIdx[expression]))
    };
    result.content.sort((a, b) => {
        return a.file - b.file;
    });
    return result;
}

/**
 * Function which returns files that are not included in notRes
 * @param {{expression: string, content: Array<{file: string, weight: number}>}} notRes Array of files which we dont want in result
 */
function getNotIncludedfiles(notRes){
    let result = [];
    const files = fs.readdirSync(collectionPath);
    const length = files.length;
    for (let i = 1; i < length; i++){
        if (!notRes.content.some(record => record.file == i )){
            result.push({
                file: i,
                weight: 1
            });
        }
    }
    return result;
}

/**
 * Evaluate NOT node - should contain all files
 * @param {NotNode} notExpression expression to be parsed
 * @return {{expression: string, content: Array<{file: string, weight: number}>} | undefined} Result of evaluation
 */
function parseNot(notExpression) {
    let notResult = parse(notExpression.value);

    let result = getNotIncludedfiles(notResult);

    return {
        expression: notResult.expression,
        content: result
    }
}

module.exports = evaluate;
