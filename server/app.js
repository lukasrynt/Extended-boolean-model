// Imports
const express = require('express');
const processDocuments = require('./utils/text_processor');
const remap = require('./utils/term_by_document')

const app = express();

// Import routes
const queriesRoutes = require('./routes/queries');
app.use('/queries', queriesRoutes);

app.get('/', (req, res) => {
    res.send("To be implemented...");
})

// Process documents into matrix
remap(processDocuments());

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));