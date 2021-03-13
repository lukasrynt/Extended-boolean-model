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

module.exports = {Node, AndNode, OrNode};