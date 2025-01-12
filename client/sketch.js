// p5 js sketch displaying an "isometric" grid
// the grid is a 2d array of cells.


// The grid is displayed in an isometric view.
// code:

let img;
let imgs = [];
let img_speech_bubble
let grid, cam;
let bounceBall;
let audio1;
let audios = [];

let placeBuildingMode = true;
let buildingToPlace = {
    description: "asdf",
    img: null
}
preload = () => {


    img1 = loadImage('https://picsum.photos/200');
    buildingToPlace.img = img1;
    // img2 = loadImage('http://localhost:3000/img/example002.png');
    // img3 = loadImage('http://localhost:3000/img/example003.png');
    // img4 = loadImage('http://localhost:3000/img/example004.png');
    // img5 = loadImage('http://localhost:3000/img/example005.png');
    // img6 = loadImage('http://localhost:3000/img/example006.png');
    // img7 = loadImage('http://localhost:3000/img/example007.png');
    // img8 = loadImage('http://localhost:3000/img/example008.png');
    // img9 = loadImage('http://localhost:3000/img/example009.png');
    // img10 = loadImage('http://localhost:3000/img/example010.png');
    // img11 = loadImage('http://localhost:3000/img/example011.png');
    // img12 = loadImage('http://localhost:3000/img/example012.png');
    // imgs = [img1,img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];

    img_speech_bubble = loadImage('http://localhost:3000/speech-bubble.png');


    // audios = [];
    // audio1 = new Audio('http://localhost:3000/img/example001.mp3');
    // audio2 = new Audio('http://localhost:3000/img/example002.mp3');
    // audio3 = new Audio('http://localhost:3000/img/example003.mp3');
    // audio4 = new Audio('http://localhost:3000/img/example004.mp3');
    // audio5 = new Audio('http://localhost:3000/img/example005.mp3');
    // audio6 = new Audio('http://localhost:3000/img/example006.mp3');
    // audio7 = new Audio('http://localhost:3000/img/example007.mp3');
    // audio8 = new Audio('http://localhost:3000/img/example008.mp3');
    // audio9 = new Audio('http://localhost:3000/img/example009.mp3');
    // audio10 = new Audio('http://localhost:3000/img/example010.mp3');
    // audio11 = new Audio('http://localhost:3000/img/example011.mp3');
    // audio12 = new Audio('http://localhost:3000/img/example012.mp3');

    // audios = [audio1, audio2, audio3, audio4, audio5, audio6, audio7, audio8, audio9, audio10, audio11, audio12];

    // // throw error if audio and img not same length
    // if (imgs.length !== audios.length) {
    //     throw new Error('imgs and audios must be same length');
    //     }
    //request permission to use audio
    // audio1 = loadSound('http://localhost:3000/img/example012.mp3');
}


function setup() {

    // place 'loading' div all over the screen
    var loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'black';
    loadingDiv.style.color = 'white';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.paddingTop = '50%';
    loadingDiv.innerHTML = 'Loading...';
    // id
    loadingDiv.id = 'loadingDiv';
    document.body.appendChild(loadingDiv);

    
    
    createCanvas(windowWidth, windowHeight, WEBGL);
    Viewer = new Viewer();
    // cam = new Cam();
    grid = new Grid(8, 8, 300, 150);
    grid.init();

    // attach image to a view cells

    // assign randomly img or img2 to all cells
    for (let i = 0; i < grid.cols; i++) {
        for (let j = 0; j < grid.rows; j++) {

            // fetch image from server
            const url = "./grid/cell/" + i + "/" + j + "/image";
            fetch(url).then((response) => {
                // if 404, return
                if(response.status === 404) {
                    grid.cells[i][j].img = null;
                    grid.cells[i][j].cellTaken = false;
                    grid.cells[i][j].description = null;
                    
                    // do not follow through with then's
                    throw new Error('404 cell not found');
                    }
                return response.json();
                }).then((data) => {

                if(!data) {
                    return;
                    }
                // div not in the dom to hold image
                var imagesdiv = document.createElement('div');
                var thisimg = createImg(data.image,'drawing for cell').parent(imagesdiv);
                // store image in cell
                grid.cells[i][j].img = thisimg;

                grid.cells[i][j].cellTaken = true;

                }).catch((err) => {
                    // if 404 cell not found, return
                    if(err.message === '404 cell not found') {
                        return;
                        }
                console.error('fetch error', err);
                })

            }
            // add random text as description
            
        } 


    
    // set viewer x and y to the center of the grid
    Viewer.jumpTo(grid.activeCell.position.x, grid.activeCell.position.y);
    // set viewer to cell 0/0
    Viewer.jumpTo(grid.cells[0][0].position.x, grid.cells[0][0].position.y);
    // bounce ball at bottom center of active cell
    bounceBall = new BouncyBall(grid.activeCell.position.x , grid.activeCell.position.y+ grid.activeCell.height/2 - 10, 20);


    // remove loading div
    var loadingDiv = document.getElementById('loadingDiv');
    if (loadingDiv) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
    }

function draw() {
    // textFont('Courier New');
    background(0);
    // circle in the centre
    fill(0, 0, 0);


    // white lines
    stroke(255);
    strokeWeight(1);
    fill(0);
    translate(-width / 2, -height / 2);//accomodate for webgl mode coordinate system
    push();
    // set viewer target to the active cell
    Viewer.moveTo(grid.activeCell.position.x, grid.activeCell.position.y);
    // view the grid
    Viewer.view();

    // grid behind active cell
    grid.display(
        ()=>{
            bounceBall.update();
            bounceBall.display();
        

        })


    // grid in front of active cell
    // grid.display(behindActiveCell=false, inFrontOfActiveCell=true, activeCell=false);   
    pop();


    }



class Grid {
    constructor(cols, rows, cellWidth, cellHeight) {
        this.cols = cols;
        this.rows = rows;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight
        this.cells = [];

        this.activeCell = null;
        }

    init() {
        for (let i = 0; i < this.cols; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.cells[i][j] = new Cell(i, j, this.cellWidth, this.cellHeight);
                }
            }
        // this.activeCell = this.cells[floor(this.cols / 2)][floor(this.rows / 2)];
        // pick random cell to start:
        const randomI = floor(random(this.cols));
        const randomJ = floor(random(this.rows));
        this.activeCell = this.cells[randomI][randomJ];
        }

    display(atActiveCell) {
        // make sure the center cell is displayed in the middle of the canvas
        // offset the grid by the difference between the center cell and the center of the canvas
        push();

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
            
                if (this.cells[i][i].distanceToActiveCell() < 10 * this.cellWidth) {
                this.cells[i][j].display();
                }
                if(atActiveCell && this.cells[i][j] === this.activeCell) {
                    atActiveCell();
                    }
            }
        }

        pop();
              }

        stepSouthWest(steps=1) {
            
            var new_j = this.activeCell.j + steps;
            if (new_j > this.rows-1) {
                new_j = this.rows-1;
                }
            this.activeCell = grid.cells[this.activeCell.i][new_j];
            
            emitActiveCellChangeEvent();


            }
        stepSouthEast(steps=1) {
            var new_i = this.activeCell.i + steps;
            if (new_i > this.cols-1) {
                new_i = this.cols-1;
                }
            this.activeCell = grid.cells[new_i][this.activeCell.j];
            emitActiveCellChangeEvent();

            }
        stepNorthEast(steps=1) {
            var new_j = this.activeCell.j - steps;
            if (new_j < 0) {
                new_j = 0;
                }
            this.activeCell = grid.cells[this.activeCell.i][new_j];
            emitActiveCellChangeEvent();

            }
        stepNorthWest(steps=1) {
            var new_i = this.activeCell.i - steps;
            if (new_i < 0) {
                new_i = 0;
                }
            this.activeCell = grid.cells[new_i][this.activeCell.j];
            emitActiveCellChangeEvent();

            }

        
    }

class Cell {
    constructor(i, j, width, height) {
        this.i = i;
        this.j = j;
        this.width = width;
        this.height = height;
        this.img = null;
        this.description = '';
        
        // vector from top corner to left corner
        this.topToLeft = createVector(-this.width / 2, -this.height / 2);
        // vector from top corner to right corner
        this.topToRight = createVector(this.width / 2, -this.height / 2);
        // arrangement is:
        // 0,0: top center, located at 0,0
        // 1,0 to n,0: from top center row down to left corner
        // 0,1 to n,1: from top center row down to right corner
        // n,n: bottom center
        
        // position of the cell is calculated based on the cell's i and j
        // i times topToLeft plus j times topToRight
        this.x = -this.i * this.topToLeft.x - this.j * this.topToRight.x;
        this.y = -this.i * this.topToLeft.y - this.j * this.topToRight.y;
        this.position = createVector(this.x, this.y);

        }


    distanceToActiveCell() {
        return dist(this.position.x, this.position.y, grid.activeCell.position.x, grid.activeCell.position.y);
        }

    display() {
        // only show if distance to active cell is less than 3 cells
        if (this.distanceToActiveCell() > 1500) {
            return;
            }
        push();
        // translate to this.position
        translate(this.position.x, this.position.y);
        // fill hue based on column
        // fill saturation based on row
        var hue = map(this.i, 0, grid.cols, 0, 100);
        var sat = map(this.j, 0, grid.rows, 50, 100);
        var bri = map(this.j, 0, grid.rows, 20, 100);
        // alpha based on distance to active cell
        var alpha = 20//map(this.distanceToActiveCell(), 0, 1000, 255, 0);
        // limit alpha to 0 - 255
        // var alpha = constrain(alpha, 0, 255);
        // if this cell is the center cell, make it brighter
        var isActiveCell = this.i == grid.activeCell.i && this.j == grid.activeCell.j;
        var activeCell = grid.activeCell;
        var activeCellHasImg = activeCell.img ? true : false; 
        if (isActiveCell) {
            bri += 150;
            // limit bri to 0 - 255
            bri = constrain(bri, 0, 255);

            alpha += 100;
            // limit alpha to 0 - 255
            alpha = constrain(alpha, 0, 255);

            // placeBuilding mode and no image on active cell, make green
            if(placeBuildingMode && !activeCellHasImg){
                // green
                hue = 100;
                sat = 255;
                bri = 200;
                alpha = 255;
            }

            if(placeBuildingMode && this.img){
                // green
                hue = 0;
                sat = 255;
                bri = 200;
                alpha = 255;
            }
             
            }
        // set color

        colorMode(HSB, 255);
        fill(hue, sat, bri, alpha);
        noStroke();

        


        // // if this cell is the center cell, draw a red border
        // if (this.i == grid.activeCell.i && this.j == grid.activeCell.j) {
        //     stroke(255);
        //     strokeWeight(3);
        //     } else {
        //     // black border
        //     stroke(0);
        //     strokeWeight(5);

        //     }
        // noStroke();
        
        var shapeTop = - this.height / 2;
        var shapeBottom = this.height / 2;
        var shapeLeft = - this.width / 2;
        var shapeRight = this.width / 2;
        var shapeCenter = 0;
          
        beginShape();
        vertex(shapeLeft+5, shapeCenter);
        vertex(shapeCenter, shapeTop+5);
        vertex(shapeRight-5, shapeCenter);
        vertex(shapeCenter, shapeBottom-5);
  
        endShape(CLOSE);
        // white text
        fill(255);
        noStroke();
        // display image. bottom center point of image should be at bottom point of shape
        
        // an image is shown if one of these:
        
        var img = this.img;

        // if this.img is empty, and we are in activeBuildingMode, and it's the active cell, THEN show alternative image
        if(!this.img && isActiveCell && placeBuildingMode){
            img =  buildingToPlace.img
        }

        if (img){
            
            var margin = 0.15;

            var leftX = -this.width / 2;
            var rightX = this.width / 2;

            // make 10% smaller than cell
            rightX = rightX - (this.width * margin);
            leftX = leftX + (this.width * margin);


            var bottomY = (this.height / 2) - (this.height * margin);
            var imageRatio = img.width / img.height;
            var imageHeightFromRatio = (rightX-leftX) / imageRatio;
            var imageWidth = this.width * (1 - 2 * margin);
            var topY = bottomY - imageHeightFromRatio;

            var margin = 0.5;

            // var alpha = map(this.dxistanceToActiveCell(), 0, 10 * this.width, 255, 0);
            // tint(alpha, alpha);
            // if not acive cell, make image transparent and darker
            
            if(!isActiveCell) {
                tint(220, 220);
                fill(0, 0, 0);
                }
            
            if (!isActiveCell & activeCellHasImg) {
                tint(255, 50);
                fill(0, 0, 0
                    );
                }
            if(isActiveCell && !activeCellHasImg && placeBuildingMode){
                // tint green
                colorMode(RGB);
                tint(0, 255, 0, 255);

            }

            if(placeBuildingMode && activeCellHasImg){
                // tint red
                colorMode(RGB);
                tint(255, 0, 0, 255);
            }

        
            texture(img);
            rect(leftX, topY, imageWidth, imageHeightFromRatio);
            // make 10% smaller than cell
            // var margin = 1;
            // rightX *= margin;
            // leftX *= margin;
            // topY *= margin;
            // bottomY *= margin;

            // if its active cell, show speech bubble

            if (isActiveCell) {
                var speechBubbleWidth = 100;
                var speechBubbleHeight = 100;
                var speechBubbleX = leftX + (rightX - leftX) / 2;
                var speechBubbleY = topY;
                image(img_speech_bubble, speechBubbleX, speechBubbleY, speechBubbleWidth, speechBubbleHeight);
                // display html element on top of canvas

                // fade in speech bubble                
                }

            }

    // set font
    textSize(20);
    textAlign(CENTER, CENTER);
    //
        // text(this.i + "/" + this.j, 0, 0);
        pop();
        }
        clicked = () => {

        }
            
    }






// use arrows to move the grid

function keyPressed() {
    // log center cell coordinates
    if (keyCode === LEFT_ARROW) {
        grid.stepSouthWest();
        }
    if (keyCode === RIGHT_ARROW) {
        grid.stepNorthEast();
        }
    if (keyCode === UP_ARROW) {
        grid.stepNorthWest();
        }
    if (keyCode === DOWN_ARROW) {
        grid.stepSouthEast();
        }


    // // open camera with 'c'
    // // take photo with space
    // if (key === 'c') {
    //     cam.toggleCam();
    //     }
    // if (key === ' ' && cam.showStream) {
    //     cam.takePhoto();
    //     }
    
    
    return;
    }

// set canvas to view height
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    }

// change active cell on mouse click based on clciked quadrant

function mouseClicked() {
    // if (mouseX < width / 2 && mouseY < height / 2) {
    //     grid.stepNorthWest();
    //     }
    // if (mouseX > width / 2 && mouseY < height / 2) {
    //     grid.stepNorthEast();
    //     }
    // if (mouseX < width / 2 && mouseY > height / 2) {
    //     grid.stepSouthWest();
    //     }
    // if (mouseX > width / 2 && mouseY > height / 2) {
    //     grid.stepSouthEast();
    //     }
    // make sure the active cell is within the grid
   
    return ;
    }



emitActiveCellChangeEvent = () => {
     // emit js event to notify that active cell has changed
     const event = new CustomEvent('activeCellChange', {detail: {cell: grid.activeCell}});
        document.dispatchEvent(event);

    }

function updateCell(i, j){
    // fetch all cell details
    fetch("./grid/cell/" + i + "/" + j).then((response) => {
        // check status
        if(response.status === 404) {
            throw new Error('404 cell not found');
            }
        return response.json();
        }).then((data) => {
        // log cell data
        // update all cell data
       const cell = {
            description: data.description,
            voice: data.voice,
            img: data.image

       }
        // image
        if(data.image) {
            var imagesdiv = document.createElement('div');
            var thisimg = createImg(data.image, 'drawing for cell').parent(imagesdiv);
            grid.cells[i][j].img = thisimg;
            }

        if(data.voice) {
            grid.cells[i][j].voice = data.voice;
            }

        if(data.description) {
            grid.cells[i][j].description = data.description;
            }
        
        }).catch((err) => {
            if(err.message === '404 cell not found') {
                return;
                }
        console.error('fetch error', err);
        });
    
}

// listen 
document.addEventListener('activeCellChange', (event) => {
    // set ball target to active cell position
    bounceBall.target = createVector(event.detail.cell.position.x, event.detail.cell.position.y + event.detail.cell.height / 2 - 25);
    // remove existing div
    var div = document.getElementById('activeCellDiv');
    if (div) {
        div.parentNode.removeChild(div);
        }

    // fetch all cell details
    fetch("./grid/cell/" + event.detail.cell.i + "/" + event.detail.cell.j).then((response) => {
        // check status
        if(response.status === 404) {
            throw new Error('404 cell not found');
            }
        return response.json();
        }).then((data) => {
        // log cell data
        // update all cell data
        event.detail.cell.description = data.description;
        event.detail.cell.voice = data.voice;
        // image
        if(data.image) {
            var imagesdiv = document.createElement('div');
            var thisimg = createImg(data.image, 'drawing for cell').parent(imagesdiv);
            event.detail.cell.img = thisimg;
            }

        // create div with cell chat
        createCellChatDiv(event.detail.cell);
        }).catch((err) => {
            if(err.message === '404 cell not found') {
                return;
                }
        console.error('fetch error', err);
        });


    });



createCellChatDiv = (cell) => {

    // create div on top right corner with cell coordinates
    var div = document.createElement('div');
    div.id = 'activeCellDiv';
    div.style.position = 'absolute';
    div.style.top = '2%';
    div.style.left = '2.5%';
    div.style.color = 'white';
    div.style.backgroundColor = 'gray';
    div.style.padding = '0px';
    div.style.borderRadius = '10px';
    // shadow
    div.style.boxShadow = '5px 5px 5px black';
    // 20% of the screen width
    div.style.width = '20%';
    // 20% of the screen height
    div.style.height = '70%';
    div.style.zIndex = '1000';
    // tranparent
    div.style.opacity = '0.8';
    // make sure content stays within div
    div.style.overflow = 'auto';

    // append div to body
    document.body.appendChild(div);

    const existingMessagesDiv = document.createElement('div');
    existingMessagesDiv.id = 'existingMessagesDiv';
    // 60 percent height, from top
    existingMessagesDiv.style.height = '60%';
    // 100% width
    existingMessagesDiv.style.width = '100%';
    
    div.appendChild(existingMessagesDiv);



    // append cell description as <text-message>
    if(cell.description) {
    var textMessage = document.createElement('text-message');
    textMessage.setAttribute('message', cell.description);
    existingMessagesDiv.appendChild(textMessage);
    }
    
    // create an <audio-message> element
    
    var audioMessage = document.createElement('audio-message');
    existingMessagesDiv.appendChild(audioMessage);
    
    if(cell.voice) {
        console.log('cell.voice', cell.voice);
        audioMessage.setAudioFromBase64String(cell.voice, true, 1000);
        }else{
            // rmemove audio message
            audioMessage.parentNode.removeChild(audioMessage);
        }
    



    // create an audio-recorder element
    var audioRecorder = document.createElement('audio-recorder');
    // move to bottom
    audioRecorder.style.position = 'absolute';
    audioRecorder.style.bottom = '0';
    // 100% width
    audioRecorder.style.width = '100%';

    // append audio-recorder to div
    existingMessagesDiv.appendChild(audioRecorder);

    return div;
}



// listen to active-cell-finished event
document.addEventListener('activeCellFinished', (event) => {
    console.log("start placing cell placing mode!");
})




