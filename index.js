// basic express server
const express = require('express');
const app = express();
const port = 3000;
const db = require('./server/db');
const imageManipulation = require('./server/imageManipulation');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, Image } = require('canvas');
const router = require('./server/router');
// serve /client folder on "/client"
app.use(express.static('client'));

// use json for request body
app.use(express.json({ limit: '50mb' }));
// new grid cell

app.use(router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

