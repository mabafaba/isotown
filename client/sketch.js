let img;
let grid, cam;
let bounceBall;

let placeBuildingMode = false;
let buildingToPlace = {
    description: null,
    img: null
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
    socket.emit('user-moved', {
        i: grid.activeCell.i,
        j: grid.activeCell.j,
        hue: bounceBall.hue
        
    });

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
    otherUserBalls.forEach((ball) => {
        ball.update();
        ball.display();
        }); 
    pop();


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
    
    return;
    }

// set canvas to view height
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
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

        if (grid.activeCell.i === i && grid.activeCell.j === j) {
            showCellDetails(cell);
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
    // log chatMessages on active cell
    console.log('active cell messages', event.detail.cell.chatMessages);
    // set ball target to active cell position
    bounceBall.target = createVector(event.detail.cell.position.x, event.detail.cell.position.y + event.detail.cell.height / 2 - 25);
    // remove existing div
   
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
        event.detail.cell.chatMessages = data.chatMessages;
        // image
        if(data.image) {
            var imagesdiv = document.createElement('div');
            var thisimg = createImg(data.image, 'drawing for cell').parent(imagesdiv);
            event.detail.cell.img = thisimg;
            }

        // create div with cell chat if not in placeBuildingMode
        if(!placeBuildingMode) {
            showCellDetails(event.detail.cell);
        }
        }).catch((err) => {
            if(err.message === '404 cell not found') {
                return;
                }
        console.error('fetch error', err);
        });


    });



// createCellChatDiv = (cell) => {

    

//     // create div on top right corner with cell coordinates
//     var div = document.createElement('div');
//     div.id = 'activeCellDiv';
//     div.style.position = 'absolute';
//     div.style.top = '2%';
//     div.style.left = '2.5%';
//     div.style.color = 'white';
//     div.style.backgroundColor = 'gray';
//     div.style.padding = '0px';
//     div.style.borderRadius = '10px';
//     // shadow
//     div.style.boxShadow = '5px 5px 5px black';
//     // 20% of the screen width
//     div.style.width = '20%';
//     // 20% of the screen height
//     div.style.height = '70%';
//     div.style.zIndex = '1000';
//     // tranparent
//     div.style.opacity = '0.8';
//     // make sure content stays within div
//     div.style.overflow = 'auto';

//     // append div to body
//     document.body.appendChild(div);

//     const existingMessagesDiv = document.createElement('div');
//     existingMessagesDiv.id = 'existingMessagesDiv';
//     // 60 percent height, from top
//     existingMessagesDiv.style.height = '60%';
//     // 100% width
//     existingMessagesDiv.style.width = '100%';
    
//     div.appendChild(existingMessagesDiv);



//     // append cell description as <text-message>
//     if(cell.description) {
//     var textMessage = document.createElement('text-message');
//     textMessage.setAttribute('message', cell.description);
//     existingMessagesDiv.appendChild(textMessage);
//     }
    
//     // create an <audio-message> element
    
//     var audioMessage = document.createElement('audio-message');
//     existingMessagesDiv.appendChild(audioMessage);
    
//     if(cell.voice) {
//         console.log('cell.voice', cell.voice);
//         audioMessage.setAudioFromBase64String(cell.voice, true, 1000);
//         }else{
//             // rmemove audio message
//             audioMessage.parentNode.removeChild(audioMessage);
//         }
    



//     // create an audio-recorder element
//     var audioRecorder = document.createElement('audio-recorder');
//     // move to bottom
//     audioRecorder.style.position = 'absolute';
//     audioRecorder.style.bottom = '0';
//     // 100% width
//     audioRecorder.style.width = '100%';

//     // append audio-recorder to div
//     existingMessagesDiv.appendChild(audioRecorder);

//     return div;
// }


