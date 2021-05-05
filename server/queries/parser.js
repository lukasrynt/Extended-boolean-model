const {Node, AndNode, OrNode, NotNode} = require('./Node');
const natural = require('natural')

/**
 * When reached the point where the word has ended, insert the token into result
 * @param {Array<string>} res Result with all tokens
 * @param {string} token Token to be pushed to result
 */
function insertFullToken(res, token) {
    token = token.trim();
    if (token === "and")
        res.push("&&");
    else if (token === "or")
        res.push("||");
    else if (token === "not")
        res.push("!");
    else
        res.push(natural.PorterStemmer.tokenizeAndStem(token)[0]);
}

/**
 * Takes query and separates into tokens (words, &&, ||, '(', ')')
 * @param {string} query query to be tokenized
 * @return {Array<string>} tokens
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

/**
 * Fill the parentheses in order to respect and operator priority
 * @param {Array<string>} tokens Tokens to be changed
 */
function fillParentheses(tokens){
    for (let i = 1; i < tokens.length - 1; i++)
    {
        if (tokens[i] === "&&")
        {
            if (tokens[i - 1] !== ")" && tokens[i - 1] !== "!")
            {
                tokens.splice(i - 1, 0, "(");
                i++;
            }else if(tokens[i - 1] === "!" && tokens[i - 2] !== "("){
                tokens.splice(i - 4, 0, ")");
                i++;
            }else{
                leftBracket(tokens, i)
                i++;
            }    
            if (tokens[i + 1] !== "(" && tokens[i + 1] !== "!")
            {
                tokens.splice(i + 2, 0, ")");
                i++;
            }else if(tokens[i + 1] === "!" && tokens[i + 2] !== "("){
                tokens.splice(i + 3, 0, ")");
                i = i + 2;
            }else{
                rightBracket(tokens, i);
                i++;
            }    
        }
        
    }
}

/**
 * Takes query and processes it into AST of terms
 * @param {string} query query to be parsed
 * @return {Node | AndNode | NotNode | OrNode} parsed expression
 */
function parseQuery(query) {
    // tokenize entry string
    let tokens = tokenize(query);
    fillParentheses(tokens);
    let idx = {value: 0};
    console.log(tokens)
    let expression = parseExpression(tokens, idx);
    if (!expression)
        throw new Error("Expression cannot be empty!")
    return expression;
}

/**
 * Parses the expression into AST of terms recursively
 * @param {Array<string>} tokens Tokens we want to parse
 * @param {{value: number}} idx Index we move on the tokens array
 * @return {Node | AndNode | NotNode | OrNode} AST of boolean nodes
 */
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
        if (!rightExp || !leftExp)
            throw new Error("Expression cannot be empty!")
        return new AndNode(rightExp, leftExp);
    }
    else if (tokens[idx.value] === "||") {
        idx.value++;
        let rightExp = parseExpression(tokens, idx);
        if (!rightExp || !leftExp)
            throw new Error("Expression cannot be empty!")
        return new OrNode(rightExp, leftExp);
    }else{
        return leftExp;
    }
}

/**
 * Parse the individual term
 * @param {Array<string>} tokens Tokens we want to parse
 * @param {{value: number}} idx Index we move on the tokens array
 * @return {Node | AndNode | NotNode | OrNode | undefined} AST subtree of boolean nodes
 */
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
        if (!tokens[idx.value - 1]) return 
        return new Node(tokens[idx.value - 1]);
    }
}

module.exports = parseQuery;