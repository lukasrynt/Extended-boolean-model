const express = require('express');
const router = express.Router();

// Getting queries from client
router.get('/', (req, res) => {
    res.send('We received some query...');
})

// handle queries
router.post((req, res) => {

})

module.exports = router;