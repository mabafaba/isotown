const express = require('express');
const router = express.Router();
const db = require('./db');
const imageManipulation = require('./imageManipulation');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, Image } = require('canvas');
const mongoose = require('mongoose');

// load image file /server/buildingmask.png
var imageMask = fs.readFileSync(path.join(__dirname, 'buildingmask.png'));
// convert to something i can read like imageMask.channels
// as well as in ctx.drawImage(mask)
imageMask = loadImage(imageMask);


// new grid cell
router.post('/grid/cell', async (req, res) => {
    // log 
    console.log('new cell: ', req.body.x, "/", req.body.y);
    // log data abbreviating image and audio strings
    console.log('image: ', req.body.image.substring(0, 40), '...', req.body.image.substring(req.body.image.length - 20));
    // log body keys
    console.log('body keys: ', Object.keys(req.body));
    // log voice type
    console.log('audio: ', req.body.voice.substring(0, 40), '...', req.body.voice.substring(req.body.voice.length - 20));
    const imageArray = imageManipulation.base64stringImageToArray(req.body.image);
    const imageDimensions = imageManipulation.imageDimensionsFromImageURL(req.body.image);
    console.log('image dimensions: ', imageDimensions);
    if (req.body.x===undefined || req.body.y===undefined || !req.body.image) {
        console.log('x', req.body.x, 'y', req.body.y, 'image', req.body.image);
        console.log('x, y, and image are required');
        res.status(400).send('x, y, and image are required');
        return;
    }

    // check if cell is already occupied
    const existingCell = await db.GridCell.findOne({ x: req.body.x, y: req.body.y });
    if (existingCell) {
        console.log('cell already occupied: ', existingCell.x, "/", existingCell.y);
        res.status(409).send('Cell already taken');
        return;
    }



    // try {
    console.log('start saving cell');
        const newCell = new db.GridCell(req.body);
        console.log('new cell ccreated: ', newCell);
        const cell = await newCell.save();
        console.log('cell created: ', cell.x, "/", cell.y);
        res.status(201).send(cell);
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).send(err);
    // }
});

// get all grid cells
router.get('/grid/cell', async (req, res) => {
    try {
        const cells = await db.GridCell.find({});
        res.send(cells);
    } catch (err) {
        res.status(500).send(err);
    }
});



router.get('/test', async (req, res) => {
    try {
        // is the mongodb connection working?
        var mongooseState = mongoose.connection.readyState;
        if(mongooseState == 1){
            res.send('Mongoose connection is working');
        }
       if (mongooseState == 0){
            res.send('Mongoose connection is disconnected');
        }
        if (mongooseState == 2){
            res.send('Mongoose connection is connecting');
        }
        if (mongooseState == 3){
            res.send('Mongoose connection is disconnecting');
        }

    } catch (err) {
        res.send(err);
    }
});

// get specific grid cell
router.get('/grid/cell/:x/:y', async (req, res) => {
    try {
        var cell = await db.GridCell.findOne({ x: req.params.x, y: req.params.y });
        cell = await cell.populate('chatMessages');
        if (!cell) {
            res.status(404).send('Cell not found');
            return;
        }
        res.send(cell);
    } catch (err) {
        console.log('error', err);
        res.status(500).send(err);
    }
});

// get field for specific grid cell
router.get('/grid/cell/:x/:y/:field', async (req, res) => {
    try {
        var cell = await db.GridCell.findOne({ x: req.params.x, y: req.params.y });
        if (!cell) {
            res.status(404).send('Cell not found');
            return;
        }
        // if field is chatMessages, populate
        if (req.params.field === 'chatMessages') {
            cell = await cell.populate('chatMessages')
        }
        const field = req.params.field;
        const value = cell[field];
        if (value) {
            const responseObj = {};
            responseObj[field] = value;
            res.send(responseObj);
        } else {
            res.status(404).send('Field not found');
        }
    } catch (err) {
        console.log('error', err);
        res.status(500).send(err);
    }
});

// return image as png
router.get('/grid/png/:x/:y', async (req, res) => {
    try {
        const cell = await db.GridCell.findOne({ x: req.params.x, y: req.params.y });
        if (!cell) {
            res.status(404).send('Cell not found');
            return;
        }
        const imageString64 = cell.image;
        const imageBuffer = Buffer.from(imageString64.split(',')[1], 'base64');

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': imageBuffer.length
        });
        res.end(imageBuffer);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update specific grid cell
router.put('/grid/cell/:x/:y', async (req, res) => {
    try {
        const cell = await db.GridCell.findOne(
            { x: req.params.x, y: req.params.y });
        console.log('cell already taken: ', cell.x, "/", cell.y);
        // return unauthorized 
        if (cell) {
            res.status(404).send('Cell not found');
            return;
        }
        // if not found, create new cell
        const newCell = new db.GridCell(req.body);
    } catch (err) {
        res.status(500).send(err);
    }
});

// endpoint to mask image
router.post('/maskimage', async (req, res) => {
    const mask = imageMask;

    const image = await imageManipulation.base64StringImageToCanvas(req.body.image);
    const maskedImage = imageManipulation.maskImage(mask, image);
    res.send(maskedImage);
});


// endpoint to add a chat message to a cell
router.post('/grid/cell/:x/:y/chat', async (req, res) => {
    try {
        const cell = await db.GridCell.findOne({ x: req.params.x, y: req.params.y });
        if (!cell) {
            res.status(404).send('Cell not found');
            return;
        }
        if(!req.body.message || !req.body.messageType || !req.body.user) {
            res.status(400).send('message, messageType, and user are required');
            return;
        }
        // check if messageType is valid
        if (req.body.messageType !== 'text' && req.body.messageType !== 'voice') {
            res.status(400).send('messageType must be "text" or "voice"');
            return;
        }
        const newChatMessage = {
            message: req.body.message,
            messageType: req.body.messageType,
            user: req.body.user
        };
        cell.chatMessages.push(newChatMessage);
        await cell.save();
        res.send(cell);
    } catch (err) {
        res.status(500).send(err);
    }
});

// delete cells
router.get('/deletecells/:code', async (req, res) => {
    if(req.params.code !== 'iknowwhatiamdoing') {
        res.status(400).send('Invalid code');
        return;
    }
    try {
        await db.GridCell.deleteMany({});
        res.send('All cells deleted');
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
})

// log any stray requests
router.use((req, res, next) => {
    console.log('stray request:', req.method, req.url);
    next();
});

module.exports = router;
