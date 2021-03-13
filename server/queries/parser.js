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
                            if (token.length)
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
    if (token.length)
        res.push(token.join('').trim());
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
    let idx = {value: 0};
    return parseExpression(tokens, idx);
}

function parseExpression(tokens, idx) {
    let leftExp = parseTerm(tokens, idx);
    if (idx.value >= tokens.length)
        return leftExp;

    if (tokens[idx.value] === "&&") {
        idx.value++;
        let rightExp = parseExpression(tokens, idx);
        return new AndNode(rightExp, leftExp);
    }
    else if (tokens[idx.value] === "||") {
        idx.value++;
        let rightExp = parseExpression(tokens, idx);
        return new OrNode(rightExp, leftExp);
    }else{
        return leftExp;
    }
}

function parseTerm(tokens, idx) {
    if (tokens[idx.value] === '(') {
        idx.value++;
        let nd = parseExpression(tokens, idx);
        if (tokens[idx.value] !== ')')
            throw new Error("Parity of parentheses in query is not correct");
        idx.value++;
        return nd;
    } else {
        idx.value++;
        return new Node(tokens[idx.value - 1]);
    }
}

module.exports = parseQuery;