const {Node, AndNode, OrNode, NotNode} = require('./Node');
const natural = require('natural')


function insertFullToken(res, token) {
    token = token.trim();
    if (token === "and")
        res.push("&&");
    else if (token === "or")
        res.push("||");
    else if (token === "not")
        res.push("!");
    else
        res.push(natural.PorterStemmer.tokenizeAndStem(token));
}

/**
 * Takes query and separates into tokens (words, &&, ||, '(', ')')
 * @param query query to be tokenized
 * @return array of tokens
 * @inspired-by https://www.meziantou.net/creating-a-parser-for-boolean-expressions.htm
 */
function tokenize(query) {
    let token = "";
    let res = [];
    for (let i = 0; i < query.length; i++)
    {
        let c = query[i];
        switch (c)
        {
            case ' ':
                if (token.length > 0) {
                    insertFullToken(res, token);
                    token = "";
                }
                break;

            case '(':
            case ')':
            case '!':
                if (token.length > 0)
                {
                    insertFullToken(res, token)
                    token = "";
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
                        token.slice(0, -1); // remove last char
                        if (token.length) insertFullToken(res, token); // add the word before
                        token = "";
                        res.push(c === '&' ? "&&" : "||");
                        break;
                    }
                } else {
                    // add & or |
                    if (token.length) insertFullToken(res, token);
                    token = "";
                    res.push(c === '&' ? "&&" : "||");
                    break;
                }
                token += c;
                break;

            default:
                token += c;
                break;
        }
    }
    if (token.length)
        insertFullToken(res, token);
    return res;
}

function leftBracket(tokens, i){
    let parenthesesCnt = 0;
    for (let j = i - 1; j >= 0; j--)
    {
        if (tokens[j] === ")")
            parenthesesCnt++;
        if (tokens[j] === "(")
            parenthesesCnt--;
        if (parenthesesCnt === 0)
        {
            tokens.splice(j, 0, "(");
            break;
        }
    }
}

function rightBracket(tokens, i){
    let parenthesesCnt = 0;
    for (let j = i + 1; j < tokens.length; j++)
    {
        if (tokens[j] === "(")
            parenthesesCnt++;
        if (tokens[j] === ")")
             parenthesesCnt--;
        if (parenthesesCnt === 0)
        {
            tokens.splice(j, 0, ")");
            break;
        }
    }
}

function fillParentheses(tokens){
    for (let i = 1; i < tokens.length - 1; i++)
    {
        if (tokens[i] === "&&")
        {
            if (tokens[i - 1] !== ")")
            {
                tokens.splice(i - 1, 0, "(");
                i++;
            }
            else{
                leftBracket(tokens, i)
                i++;
            }    
            if (tokens[i + 1] !== "(")
            {
                tokens.splice(i + 2, 0, ")");
                i++;
            }
            else{
                rightBracket(tokens, i);
                i++;
            }    
        }
        
    }
}

/**
 * Takes query and processes it into AST of terms
 * @param query query to be parsed
 * @return parsed expression
 */
function parseQuery(query) {
    // tokenize entry string
    let tokens = tokenize(query);
    fillParentheses(tokens);
    let idx = {value: 0};
    return parseExpression(tokens, idx);
}

function parseExpression(tokens, idx) {
    let leftExp = parseTerm(tokens, idx);
    if (idx.value >= tokens.length)
        return leftExp;

    if (tokens[idx.value] === '!') {
        idx.value++;
        let nd = parseExpression(tokens, idx);
        return new NotNode(nd);
    }
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
    if (tokens[idx.value] === '!') {
        idx.value++;
        let nd = parseExpression(tokens, idx);
        return new NotNode(nd);
    }
    if (tokens[idx.value] === '(') {
        idx.value++;
        let nd = parseExpression(tokens, idx);
        if (tokens[idx.value] !== ')')
            throw new Error("Parity of parentheses in query is not correct");
        idx.value++;
        return nd;
    }
    else {
        idx.value++;
        return new Node(tokens[idx.value - 1]);
    }
}

module.exports = parseQuery;