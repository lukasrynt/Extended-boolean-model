const express = require('express');
const router = express.Router();
const fs = require('fs');
const cors = require("cors");
const parseRequest = require('../queries/parser');
const evalQuery = require('../queries/evaluator');

router.use(cors());

function loadFiles(fileNums) {
    let res = [];
    fileNums.forEach((fileNum) => {
        res.push({
            file: fileNum + '.txt',
            content: fs.readFileSync('data/collection/' + fileNum + '.txt', 'utf-8')
        });
    });
    return res;
}

// Getting queries from client
router.get('/', (req, res) => {
    res.send(req.processed);
});

// handle queries
router.post('/', (req, res) => {
    // Parse the query
    let parsedRequest = parseRequest(req.body.query);
    console.log(parsedRequest);
    let fileNums = evalQuery(parsedRequest, req.processed);
    res.json(loadFiles(fileNums));
});

module.exports = router;