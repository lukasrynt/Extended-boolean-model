const express = require('express');
const router = express.Router();
const parseRequest = require('../queries/parser')

// Getting queries from client
router.get('/', (req, res) => {
    res.send(req.processed);
});

// handle queries
router.post('/', async (req, res) => {
    // Parse the query
    let parsedRequest = await parseRequest(req.body.query);
    console.log(req.data);
    // res.json(await calculateResults(parsedRequest))
});

module.exports = router;