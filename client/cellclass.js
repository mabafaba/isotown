
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

        // disable confirm button if cell is taken
        
        const confirmbutton = document.getElementById("gameconfirmactionbutton");
        if(confirmbutton && activeCellHasImg){
            confirmbutton.style.display='none';
        }else if(confirmbutton){
            confirmbutton.style.display='flex';

        }

        
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
                // red
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

            if(placeBuildingMode && activeCellHasImg && isActiveCell){
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
                // image(img_speech_bubble, speechBubbleX, speechBubbleY, speechBubbleWidth, speechBubbleHeight);
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

