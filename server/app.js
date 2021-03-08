// Imports
const express = require('express');
const processDocuments = require('./document_processing/text_processor');
const remap = require('./document_processing/frequencies_remap')

const app = express();

// Import routes
const queriesRoutes = require('./routes/queries');
app.use('/queries', queriesRoutes);

app.get('/', (req, res) => {
    res.send("To be implemented...");
})

// Process documents into matrix
console.log(processDocuments());

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));