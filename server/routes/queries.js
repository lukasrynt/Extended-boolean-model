const express = require('express');
const router = express.Router();
const parseRequest = require('../queries/parser')

// Getting queries from client
router.get('/', (req, res) => {
    res.send(req.processed);
});

// handle queries
router.post('/', (req, res) => {
    // Parse the query
    let parsedRequest = parseRequest(req.body.query);
    console.log(parsedRequest);
    res.json(parsedRequest);
});

module.exports = router;