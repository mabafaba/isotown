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
preload = () => {


    // img1 = loadImage('http://localhost:3000/img/example001.png');
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
                return response.json();
                }).then((data) => {

                if(!data.image) {
                    return;
                    }
                // div not in the dom to hold image
                var imagesdiv = document.createElement('div');
                var thisimg = createImg(data.image,'drawing for cell').parent(imagesdiv);
                // store image in cell
                grid.cells[i][j].img = thisimg;

                }).catch((err) => {
                console.error('fetch error', err);
                })


                // if(random() > 0.5 && imgs.length > 0) {
                // // pick number from 0 to lenght of imgs - 1
                // var randomPick = floor(random(imgs.length));
                // grid.cells[i][j].img = imgs[randomPick];
                // grid.cells[i][j].ambientAudio = audios[ randomPick];

                // // remove this image from the array
                // // imgs = imgs.filter((img) => img !== thisimg);
                // }
                // grid.cells[i][j].description = 'This is cell ' + i + '/' + j;
                // fetch description
                const descurl = "./grid/cell/" + i + "/" + j + "/description";
                fetch(descurl).then((response) => {
                    return response.json();
                    }).then((data) => {
                        if(!data.description) {
                            grid.cells[i][j].description = 'This is cell ' + i + '/' + j;
                            return;
                            }
                    grid.cells[i][j].description = data.description;
                    }).catch((err) => {
                    console.error('fetch error', err);
                    });
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
            bri += 100;
            }
        // set color

        colorMode(HSB, 255);
        fill(hue, sat, bri, alpha);


        // if this cell is the center cell, draw a red border
        if (this.i == grid.activeCell.i && this.j == grid.activeCell.j) {
            stroke(255);
            strokeWeight(3);
            } else {
            // black border
            stroke(0);
            strokeWeight(5);

            }
        noStroke();
        
        var shapeTop = - this.height / 2;
        var shapeBottom = this.height / 2;
        var shapeLeft = - this.width / 2;
        var shapeRight = this.width / 2;
        var shapeCenter = 0;
            if(this.img) {
        // texture(this.img);
        // rect(shapeLeft, shapeTop, this.width, this.height);
            }
          
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

        if (this.img) {
            var margin = 0.15;

            var leftX = -this.width / 2;
            var rightX = this.width / 2;

            // make 10% smaller than cell
            rightX = rightX - (this.width * margin);
            leftX = leftX + (this.width * margin);


            var bottomY = (this.height / 2) - (this.height * margin);
            var imageRatio = this.img.width / this.img.height;
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

        
            texture(this.img);
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


// class for camera

class Viewer {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 0.1;
        this.zoom = 1;
        this.targetZoom = 1;
        this.zoonSpeed = 0.05;
        }

    move(dx, dy) {
        this.x += dx
        this.y += dy;
        }
    
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        }
    jumpTo(x, y) {
        this.x = x;
        this.y = y;
        }

    update() {

        if (abs(this.targetX - this.x) > 1) {
        this.x += (this.targetX - this.x) * this.speed;
        }
        if (abs(this.targetY - this.y) > 1) {
            this.y += (this.targetY - this.y) * this.speed;
        }
        this.zoom += (this.targetZoom - this.zoom) * this.zoonSpeed;
        }
    zoomIn(amount=1) {
        // stop event propagation
        event.stopPropagation();
        this.targetZoom *= 1 + (0.2 * amount);
    }
    zoomOut(amount=1) {
        // stop event propagation
        event.stopPropagation();
        this.targetZoom *= 1 - (0.2*amount);
    }
    view() {
        this.update();
        scale(this.zoom);

        translate(width/2, height/2);
        translate(-this.x, -this.y);
        // zoom
        
        
    
        }     
    
}


// // camera to take pictures with user camera
// // code:
// class Cam {
//     constructor() {
//         this.showStream = false;
//         this.showLastImage = false;
//         this.video = createCapture(VIDEO);
//         // video size as window size
//         this.video.size(300, 300);
//         this.video.hide();
//         this.photos = [];
//         }

//     display() {
//         if(this.showStream){
//         image(this.video, 0, 0, 300, 300);
//         }
//         if(this.showLastImage) {
//             if(this.photos.length === 0) {return}
//             image(this.photos[this.photos.length-1], 0, 0,300, 300);
//         }




//         }

//     // begin taking

//     showStream() {
//         this.showStream = true;
//         this.showLastImage = false;
//         }

//     hideStream() {
//         this.showStream = false;
//         }

//     toggleStream() {
//         this.showStream = !this.showStream;
//         }

//     showFotos() {
//         this.showLastImage = true;
//         }
    
//     hideFotos() {
//         this.showLastImage = false;
//         }
    
//     toggleFotos() {
//         this.showLastImage = !this.showLastImage;
//         }

//     hideCam() {
//         this.hideStream();
//         this.hideFotos();
//         }
    
//     showCam() {
//         this.showStream();
//         this.hideFotos();
//         }

//     toggleCam() {
//         this.toggleStream();
//         this.toggleFotos();
//         }

//     // click

//     takePhoto() {
//         this.photos.push(this.video.get());
//         this.hideStream();
//         this.showFotos();
//         }

// }


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

// listen 
document.addEventListener('activeCellChange', (event) => {
    // set ball target to active cell position
    bounceBall.target = createVector(event.detail.cell.position.x, event.detail.cell.position.y + event.detail.cell.height / 2 - 25);
    // remove existing div
    var div = document.getElementById('activeCellDiv');
    if (div) {
        div.parentNode.removeChild(div);
        }

    // create div on top right corner with cell coordinates
    var div = document.createElement('div');
    div.id = 'activeCellDiv';
    div.style.position = 'absolute';
    div.style.top = '2%';
    div.style.left = '2.5%';
    div.style.color = 'white';
    div.style.backgroundColor = 'gray';
    div.style.padding = '10px';
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
    div.innerHTML = event.detail.cell.i + "/" + event.detail.cell.j;
    // append cell description to div
    div.innerHTML += '<br>' + event.detail.cell.description;
    document.body.appendChild(div);

    // fade out all audio starting with 'cellsound'
    audioMixer.fadeOutMany('ambient*');

    // play ambientAudio for active cell
    if(!event.detail.cell.ambientAudio) {
        fetch("./grid/cell/" + event.detail.cell.i + "/" + event.detail.cell.j + "/ambientAudio").then((response) => {
            return response.json();
            }).then((data) => {
            var audio = new Audio(data.ambientAudio);
            event.detail.cell.ambientAudio = audio;
            // play audio
            audioMixer.fadeIn('cellsound-ambient-' + event.detail.cell.i + "-" + event.detail.cell.j, audio);
            }).catch((err) => {
            console.error('fetch error', err);
            });
    }
    if(event.detail.cell.ambientAudio) {
        audioMixer.fadeIn('cellsound-ambient-' + event.detail.cell.i + "-" + event.detail.cell.j, event.detail.cell.ambientAudio);
    }

    // fetch audio for active cell
    if(!event.detail.cell.voice) {
    const url = "./grid/cell/" + event.detail.cell.i + "/" + event.detail.cell.j + "/voice";
    fetch(url).then((response) => {
        return response.json();
        }).then((data) => {
        var audio = new Audio(data.voice);
        event.detail.cell.voice = audio;
        // add audio controls to div
        var audioControls = document.createElement('audio');
        audioControls.controls = true;
        audioControls.src = data.voice;
        div.appendChild(audioControls);
        // play audio after 1 second
        setTimeout(() => {
            audioControls.play();
            }, 1000);

        }).catch((err) => {
        console.error('fetch error', err);
        })
    } else {
        var audioControls = document.createElement('audio');
        audioControls.controls = true;
        audioControls.src = data.voice;
        div.appendChild(audioControls);
        // play audio after 1 sec
        setTimeout(() => {
            audioControls.play();
            
            // audioMixer.fadeIn('cellsound' + event.detail.cell.i + "-" + event.detail.cell.j, event.detail.cell.voice);
        }, 1000);
        }
    });


// bouncy ball class

class BouncyBall {

    constructor(x, y, radius) {
        this.floorPoint = createVector(x, y);
        this.position = createVector(x, y-(radius/2)-10);
        this.radius = radius;
        this.target = createVector(x, y);
        this.bounceSpeed = 0.2;
        this.bounceHeight = 20;
        this.speed = createVector(0, 0);
        }

    display() {
        fill(255,0,0,100);
        noStroke();
        // above floor point
        // this.debugDisplay();
        ellipse(this.position.x, this.position.y, this.radius, this.radius);
        }

    debugDisplay() {
        // draw line from position to target red
        stroke(255, 0, 0);
        line(this.position.x, this.position.y, this.target.x, this.target.y);

        // draw acceleration vector green
        stroke(0, 255, 0);
        line(this.position.x, this.position.y, this.position.x + this.speed.x * 10, this.position.y + this.speed.y * 10);

        // blue line from floor point to position
        stroke(0, 0, 255);
        line(this.floorPoint.x, this.floorPoint.y, this.position.x, this.position.y);
        
        }   

    moveTowardsTarget() {
        // accelerate in direction of target
        var acceleration = p5.Vector.sub(this.target, this.floorPoint);
        acceleration.mult(0.01);
        // limit acceleration
        acceleration.limit(0.5);
        this.speed.add(acceleration);
        // limit speed
        this.speed.limit(10);
        }
    bounce (){
        // accelerate downwards
        this.bounceSpeed -= 0.2;       
        this.bounceHeight += this.bounceSpeed; 
        // if we are below the floor, bounce back up
        if (this.bounceHeight<0) {
            this.bounceSpeed *= -1;
            this.bounceHeight = 0;
        }
    }

    update() {
        this.moveTowardsTarget();
        this.bounce();
        this.floorPoint.add(this.speed);
        this.position = createVector(this.floorPoint.x, this.floorPoint.y - this.bounceHeight);
        this.speed.mult(0.95);

        }
       
    }



class audioMixer {
    constructor() {
        this.audios = {};
        }

    play(channel, audio = null){
        if(audio) {
        this.audios[channel] = audio;
        this.audios[channel].play();
        return;    
        }

        if(!this.audio[channel]) {
            console.warn('no audio for channel', channel);
            return;
            }

        if(channel) {
            this.audios[channel].play();
            }
    }

    stop(channel) {
        if(this.audios[channel]) {
            this.audios[channel].pause();
            }
        }

    stopAll() {
        for (const channel in this.audios) {
            this.audios[channel].pause();
            }
        }

    fadeOut(channel, duration=1000, callback=null) {
        if(this.audios[channel]) {
           // fade volumen to 0 then stop
            var volume = this.audios[channel].volume;
            var step = 100 * volume / duration;
            var interval = setInterval(() => {
                volume -= step;
                if(volume <= 0) {
                    clearInterval(interval);
                    this.audios[channel].pause();
                    // delete channel
                    delete this.audios[channel];
                    if(callback) {
                        callback();
                        }
                    return;
                    }

                this.audios[channel].volume = volume;

                }, 100);
            }
        }

    fadeIn(channel, audio = null, duration=1000, callback=null) {

        if(audio) {
            this.audios[channel] = audio;
            }

        if(!this.audios[channel]) {
            console.warn('no audio for channel', channel);
            return;
            }

        // set volume to 0
        this.audios[channel].volume = 0;

        this.audios[channel].play();

        // fade volumen to 1

        var volume = 0;
        var step = 100 / duration;
        var interval = setInterval(() => {
            volume += step;
            if(volume >= 1) {
                clearInterval(interval);
                if(callback) {
                    callback();
                    }
                return;
                }
                this.audios[channel].volume = volume;

            }, 100);        
        
        }

        fadeOutMany(regexp="*", duration=1000, callback=null) {
            for (const channel in this.audios) {
                if(channel.match(regexp)) {
                    this.fadeOut(channel, duration, callback);
                    }
                }
            }

        fadeInMany(regexp="*", duration=1000, callback=null) {
            for (const channel in this.audios) {
                if(channel.match(regexp)) {
                    this.fadeIn(channel, null, duration, callback);
                    }
                }
            }


        // convert {"type":"Buffer","data":[... to audio that can be used with audiomixer.play etc.
        audioToBlob(audio) {
            return new Blob(audio.data, {type: 'audio/wav'});
            }

        blobToAudio(blob) {
            return new Audio(URL.createObjectURL(blob));
            }
        
        


    }

audioMixer = new audioMixer();


// // on scroll, zoom in or out
// function mouseWheel(event) {
//     if (event.delta > 0) {
//         Viewer.zoomOut(0.1);
//         }
//     if (event.delta < 0) {
//         Viewer.zoomIn(0.1);
//         }
//     }

// listen to active-cell-finished event
document.addEventListener('activeCellFinished', (event) => {
    console.log("start placing cell placing mode!");
})