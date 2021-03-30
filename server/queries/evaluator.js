let invertedIdx;

function evaluate(processedQuery, invertedIndex) {
    invertedIdx = invertedIndex;
    console.log(parse(processedQuery))
    return parse(processedQuery).content
        .sort((a, b) => {
        return b.weight - a.weight;
        }).map(value => value.file);
}

function parse(processedQuery) {
    if (processedQuery.value)
        return parseTerm(processedQuery.value)
    else if (processedQuery.operator === "||")
        return parseOr(processedQuery);
    else if (processedQuery.operator === "&&")
        return parseAnd(processedQuery);
}

function pushSingleContent(resContent, content) {
    resContent.push({
        file: content.file,
        weight: content.weight
    });
}

function parseOr(processedQuery) {
    let left = parse(processedQuery.lVal)
    let right = parse(processedQuery.rVal)
    let resExpression = "(" + left.expression + " && " + right.expression + ")";

    // merge style counting
    let resContent = [];
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

function parseAnd(processedQuery) {
    let left = parse(processedQuery.lVal)
    let right = parse(processedQuery.rVal)
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

function parseTerm(expression) {
    return {
        expression: expression,
        content: invertedIdx[expression]
    };
}

module.exports = evaluate;
