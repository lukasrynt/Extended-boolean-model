// Imports
const express = require('express');
const processDocuments = require('./document_processing/text_processor');

const app = express();
let processedDocs;

// import middleware
app.use(express.json());

const collectionPath = 'data/collection_3000/';

// Import routes
const queriesRoutes = require('./routes/queries');
app.use('/queries', (req, res, next) => {
    req.processed = processedDocs;
    req.collectionPath = collectionPath;
    next();
}, queriesRoutes)

app.get('/', (req, res) => {
    res.send("To be implemented...");
});

// Process documents into matrix
processedDocs = processDocuments(collectionPath);

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));