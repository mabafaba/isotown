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

