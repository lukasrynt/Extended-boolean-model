const express = require('express');
const router = express.Router();

// Getting queries from client
router.post('/', (req, res) => {
    res.send('We received some query...');
})

module.exports = router;