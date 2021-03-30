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
        else if (left.content[l].file < right.content[r].file){
            resContent.push({
                file: left.content[l].file,
                weight: left.content[l].weight
            });
            l++;
        }
        else if (left.content[l].file > right.content[r].file){
            resContent.push({
                file: right.content[r].file,
                weight: right.content[r].weight
            });
            r++;
        }
    }
    for (;l < left.content.length; ++l)
        resContent.push({
            file: left.content[l].file,
            weight: left.content[l].weight
        });
    for (;r < right.content.length; ++r)
        resContent.push({
            file: right.content[r].file,
            weight: right.content[r].weight
        });
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
                weight: 1 - Math.sqrt( Math.pow(1 - left.content[l].weight, 2) + Math.pow(1 - right.content[r].weight, 2) / 2 )
            });
            l++
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

function parseExpression(relev, processedQuery) {
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
                weight: relev(left, right, l, r)
            });
            l++
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
