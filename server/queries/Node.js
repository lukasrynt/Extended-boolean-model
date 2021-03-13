function Node(value) {
    this.value = value;
}

function AndNode(rVal, lVal) {
    this.lVal = lVal;
    this.rVal = rVal;
}

function OrNode(rVal, lVal) {
    this.lVal = lVal;
    this.rVal = rVal;
}

module.exports = {Node, AndNode, OrNode};