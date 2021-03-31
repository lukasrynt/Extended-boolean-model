function Node(value) {
    this.value = value;
}

function AndNode(rVal, lVal) {
    this.lVal = lVal;
    this.rVal = rVal;
    this.operator = "&&";
}

function OrNode(rVal, lVal) {
    this.lVal = lVal;
    this.rVal = rVal;
    this.operator = "||";
}

function NotNode(value) {
    this.value = value;
    this.operator = "!";
}

module.exports = {Node, AndNode, OrNode, NotNode};