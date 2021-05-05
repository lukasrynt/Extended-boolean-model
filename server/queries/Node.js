/**
 * Constructor of leaf node of AST
 * @param {string} value Value of the node
 * @constructor
 */
function Node(value) {
    this.value = value;
}

/**
 * Constructor for And node of AST
 * @param {OrNode | NotNode | AndNode | Node} rVal Value of the left sub node
 * @param {OrNode | NotNode | AndNode | Node} lVal Value of the right sub node
 * @constructor
 */
function AndNode(rVal, lVal) {
    this.lVal = lVal;
    this.rVal = rVal;
    this.operator = "&&";
}

/**
 * Constructor for Or node of AST
 * @param {OrNode | NotNode | AndNode | Node} rVal Value of the left sub node
 * @param {OrNode | NotNode | AndNode | Node} lVal Value of the right sub node
 * @constructor
 */
function OrNode(rVal, lVal) {
    this.lVal = lVal;
    this.rVal = rVal;
    this.operator = "||";
}

/**
 * Constructor for Not node of AST
 * @param {OrNode | NotNode | AndNode | Node} value Value of the node
 * @constructor
 */
function NotNode(value) {
    this.value = value;
    this.operator = "!";
}

module.exports = {Node, AndNode, OrNode, NotNode};