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
    let parsedRequest;
    try {
        parsedRequest = parseRequest(req.body.query);
    } catch (e) {
        res.status(406).json({error: e.message})
    }
    console.log("---parsed---")
    console.log(parsedRequest);
    console.log("------------")
    let queryRes = evalQuery(parsedRequest, req.processed, req.collectionPath);
    if (!queryRes || !queryRes.length) {
        res.status(404).json({error: "No results found"});
        console.log("not found")
        return;
    }
    let mappedToFiles = [];
    queryRes = queryRes.slice(0, 50);
    queryRes.forEach(({file, weight}) => {
            mappedToFiles.push({
                file: file + '.txt',
                content: fs.readFileSync(req.collectionPath + file + '.txt', 'utf-8'),
                weight: +(weight * 100).toFixed(2)
            });
    })

    //console.log(mappedToFiles);
    res.json(mappedToFiles);
});

module.exports = router;