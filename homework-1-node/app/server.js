'use strict';

const express = require('express');

// Constants
const PORT = 70;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/health', (req, res) => {
  res.status(200).json({“status”: “OK”});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
