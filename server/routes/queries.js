const express = require('express');
const router = express.Router();
const fs = require('fs');
const cors = require("cors");
const parseRequest = require('../queries/parser');
const evalQuery = require('../queries/evaluator');

router.use(cors());

/**
 * Load the corresponding files content and add weight to them
 * @param {Array<{file: string, weight: number}>} queryRes Result of previous query parsing
 * @param {string} collectionPath Path to collection with data
 * @return {{file: string, content: string, weight: float}} array of filename, its content and weight to the given query
 */
function loadFiles(queryRes, collectionPath) {
    let res = [];
    queryRes.forEach(({file, weight}) => {
        res.push({
            file: file + '.txt',
            content: fs.readFileSync(collectionPath + file + '.txt', 'utf-8'),
            weight: +(weight * 100).toFixed(2)
        });
    })
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
        return;
    }
    console.log("---parsed---")
    console.log(parsedRequest);
    console.log("------------")
    if (!parsedRequest) {
        res.status(406).json({error: "No content"});
        return;
    }
    let queryRes = evalQuery(parsedRequest, req.processed, req.collectionPath);
    if (!queryRes || !queryRes.length) {
        res.status(404).json({error: "No results found"});
        return;
    }
    queryRes = queryRes.slice(0, 50);
    let mappedToFiles = loadFiles(queryRes, req.collectionPath);
    //console.log(mappedToFiles);
    res.json(mappedToFiles);
});

module.exports = router;