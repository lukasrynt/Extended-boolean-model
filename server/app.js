// Imports
const express = require('express');
const processDocuments = require('./document_processing/text_processor');
const {
    performance
} = require('perf_hooks');

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
let t0 = performance.now()
processedDocs = processDocuments(collectionPath);
let t1 = performance.now()
console.log("Time to create was: " + (t1 - t0) + " milliseconds.")

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));