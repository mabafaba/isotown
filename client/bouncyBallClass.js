
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
        // random color with full brightness and saturation
        colorMode(HSB, 255);
        this.color = color(random(255), 255, 255, 200);
        }

    display() {
        colorMode(HSB, 255);
        fill(this.color);
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