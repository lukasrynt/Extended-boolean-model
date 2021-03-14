function evaluate(processedQuery, invertedIndex) {
    return parse(processedQuery, invertedIndex)
        .sort((a, b) => {
        return a.weight < b.weight;
        }).map(value => value.file);
}

function parse(processedQuery, invertedIndex) {
    if (processedQuery.value)
        return parseExpression(processedQuery.value, invertedIndex)
    if (processedQuery.operator === "||")
        return parseOr(processedQuery, invertedIndex);
    else if (processedQuery.operator === "&&")
        return parseAnd(processedQuery, invertedIndex);
}

function parseOr(processedQuery, invertedIndex) {

}

function parseAnd(processedQuery, invertedIndex) {

}

function parseExpression(expression, invertedIndex) {
    return invertedIndex[expression];
}

module.exports = evaluate;
