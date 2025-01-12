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