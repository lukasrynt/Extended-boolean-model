function Node(value) {
    this.value = value;
}

function AndNode(rVal, lVal) {
    this.rVal = rVal;
    this.lVal = lVal;
}

function OrNode(rVal, lVal) {
    this.rVal = rVal;
    this.lVal = lVal;
}

module.exports = {Node, AndNode, OrNode};