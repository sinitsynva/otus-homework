'use strict';

const express = require('express');

// Constants
const PORT = 70;
const HOST = '0.0.0.0';
const STATUS = 'OK'

// App
const app = express();
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/livenessProbe', (req, res) => {
  res.send('Ok');
});

app.get('/health', (req, res) => {
  res.status(200).json({STATUS});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
