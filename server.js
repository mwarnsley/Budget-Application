// Requiring in the modules needed
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sending the home path the index.html file to render
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Using express middleware, specifically to add in the static files from the public folder
app.use(express.static('public'));

// Connecting the app to listen on the port specified
app.listen(PORT);
