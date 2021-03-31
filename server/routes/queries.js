const express = require('express');
const router = express.Router();
const fs = require('fs');
const cors = require("cors");
const parseRequest = require('../queries/parser');
const evalQuery = require('../queries/evaluator');

router.use(cors());

function loadFiles(fileNums, collectionPath) {
    let res = [];
    fileNums.forEach((fileNum) => {
        res.push({
            file: fileNum + '.txt',
            content: fs.readFileSync(collectionPath + fileNum + '.txt', 'utf-8')
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
    console.log("---parsed---")
    console.log(parsedRequest);
    console.log("------------")
    let queryRes = evalQuery(parsedRequest, req.processed);
    let mappedToFiles = [];
    queryRes.slice(0, 10);
    queryRes.forEach(({file, weight}) => {
            mappedToFiles.push({
                file: file + '.txt',
                content: fs.readFileSync(req.collectionPath + file + '.txt', 'utf-8'),
                weight: +(weight * 100).toFixed(2)
            });
    })
    console.log(mappedToFiles);
    res.json(mappedToFiles);
});

module.exports = router;