// mongoose database connection
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/isocraft');
// instead (for docker):
// mongoose.connect('mongodb://mongodb:27017/isotown');

db.on('error', console.error.bind(console, 'connection error:'));

// schema for grid cells
// contains:
// x/y
// image url
// svg url
// ambient sound
// voice 
// description
// x, y are integers and unique together and required


const gridCellSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    image: String,
    ambientSound: String,
    // voice is a blob new Blob(..., {type: 'audio/wav'});
    voice: String,
    description: String
});

// model for grid cells
const GridCell = mongoose.model('GridCell', gridCellSchema);


module.exports = { GridCell };