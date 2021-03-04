// Imports
const express = require('express');
const load = require('./utils/text_processor');

const app = express();

// Import routes
const queriesRoutes = require('./routes/queries');
app.use('/queries', queriesRoutes);

app.get('/', (req, res) => {
    res.send("To be implemented...");
})

// Stem documents
console.log(load()); // won't pass need to be placed inside async func with await

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));