// Imports
const express = require('express');
const app = express();

// Import routes
app.get('/', (req, res) => {
    res.send("To be implemented...");
})

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));