const width = window.innerWidth;
const height = window.innerHeight;
const cols = 8;
const rows = 8;
const cellWidth = 150;
const cellHeight = 100;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

const grid = [];
let activeCell = {i: 0, j: 2};

function createGrid() {
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            const x = width / 2 + (i - j) * cellWidth / 2;
            const y = height / 2 + (i + j) * cellHeight / 2;
            grid[i][j] = {i, j, x, y};
        }
    }
}

function drawGrid() {
    svg.selectAll(".cell").remove();

    svg.selectAll(".cell")
        .data(grid.flat())
        .enter().append("polygon")
        .attr("class", d => d.i === activeCell.i && d.j === activeCell.j ? "cell active" : "cell")
        .attr("points", d => {
            return [
                [d.x, d.y - cellHeight / 2],
                [d.x + cellWidth / 2, d.y],
                [d.x, d.y + cellHeight / 2],
                [d.x - cellWidth / 2, d.y]
            ].join(" ");
        })
        .attr("fill", d => d3.hsl((d.i / cols) * 360, 0.5, 0.5));
    // Add image to cell 2/3
    const cell23 = grid[2][3];
    svg.append("image")
        .attr("xlink:href", "example.png")
        .attr("x", cell23.x - cellWidth/2)
        .attr("y", cell23.y - cellHeight/2)
        .attr("width", cellWidth*2)
        .attr("height", cellHeight*2);
}

function moveActiveCell(dx, dy) {
    activeCell.i = Math.max(0, Math.min(cols - 1, activeCell.i + dx));
    activeCell.j = Math.max(0, Math.min(rows - 1, activeCell.j + dy));
    drawGrid();
    //set viewer target to active cell center
    viewer.moveTo(grid[activeCell.i][activeCell.j].x, grid[activeCell.i][activeCell.j].y);
   
}

createGrid();
drawGrid();

d3.select(window).on("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            moveActiveCell(-1, 0);
            break;
        case "ArrowRight":
            moveActiveCell(1, 0);
            break;
        case "ArrowUp":
            moveActiveCell(0, -1);
            break;
        case "ArrowDown":
            moveActiveCell(0, 1);
            break;
    }
});

d3.select(window).on("resize", () => {
    svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
    createGrid();
    drawGrid();
});



class Viewer {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 0.05;
        this.originX = -width / 2;
        this.originY = -height / 2;
        // run the camera continuously
        setInterval(this.run.bind(this), 1000 / 60);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    moveTo(x, y) {
        this.targetX = (width-x) + this.originX;
        this.targetY = (height-y) + this.originY;
    }

    jumpTo(x, y) {
        this.x = (width-x) + this.originX;
        this.y = (height-y) + this.originY;
    }

    update() {
        if (Math.abs(this.targetX - this.x) > 1) {
            this.x += (this.targetX - this.x) * this.speed;
        }
        if (Math.abs(this.targetY - this.y) > 1) {
            this.y += (this.targetY - this.y) * this.speed;
        }
    }

    view() {
        // translate all children of the svg element in add
        // svg.attr("transform", `translate(${this.x}, ${this.y})`);
        // all elements in the svg will be moved
        svg.selectAll("*").attr("transform", `translate(${this.x}, ${this.y})`);


    }

    // run the camera continuously
    run() {
        this.update();
        this.view();
    }
}


// Camera
viewer = new Viewer();
// set initial position of the camera
viewer.jumpTo(width / 2, height / 2);

