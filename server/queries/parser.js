const {Node, AndNode, OrNode} = require('./Node');

/**
 * Takes query and separates into tokens (words, &&, ||, '(', ')')
 * @param query query to be tokenized
 * @return array of tokens
 * @inspired-by https://www.meziantou.net/creating-a-parser-for-boolean-expressions.htm
 */
function tokenize(query) {
    let token = [];
    let res = [];
    for (let i = 0; i < query.length; i++)
    {
        let c = query[i];
        switch (c)
        {
            case ' ':
                if (token.length > 0)
                    token.push(c);
                break;

            case '(':
            case ')':
                if (token.length > 0)
                {
                    res.push(token.join(''));
                    token = [];
                }
                res.push(c);
                break;

            case '&':
            case '|':
                if (token.length > 0)
                {
                    // add && or ||
                    if (c === token[token.length - 1])
                    {
                        token.pop(); // remove last char
                        res.push(token.join('').trim()); // add the word before
                        token = [];
                        res.push(c === '&' ? "&&" : "||");
                        break;
                    }
                }
                token.push(c);
                break;

            default:
                token.push(c);
                break;
        }
    }
    return res;
}

/**
 * Takes query and processes it into AST of terms
 * @param query query to be parsed
 * @return parsed expression
 */
function parseQuery(query) {
    // tokenize entry string
    let tokens = tokenize(query);
    console.log(tokens);
    let idx = 0;
    return parseExpression(tokens, {value: idx});
}

function parseExpression(tokens, idx) {
    let leftExp = parseTerm(tokens, {value: idx.value});
    if (idx.value >= tokens.length)
        return leftExp;

    if (tokens[idx.value] === "&&") {
        idx.value++;
        let rightExp = parseExpression(tokens, {value: idx.value});
        return new AndNode(rightExp, leftExp);
    }
    else if (tokens[idx.value] === "||") {
        idx.value++;
        let rightExp = parseExpression(tokens, {value: idx.value});
        return new OrNode(rightExp, leftExp);
    }
}

function parseTerm(tokens, idx) {

}

module.exports = parseQuery;