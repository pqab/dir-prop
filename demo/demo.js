const express = require('express');
const app = express();
const path = require('path');

const { dirServer } = require('../src/index.js');

const port = process.env.port || 33000;

app.use(express.static(path.join(__dirname, '../')));

app.use('/', dirServer({
  root: path.join(__dirname, '../'),
  template: true
}));

app.listen(port);
