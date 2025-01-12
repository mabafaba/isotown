

const viewMode = {
    modes: ['default', 'placeBuilding', 'editCell'],
    current: 'default',

    defaultStart : () =>{
            viewMode.current = 'default';
            const mainNavigation = document.querySelector('main-navigation');
            if(grid.activeCell.img){
            mainNavigation.occupiedCellButtons();
            } else {
            mainNavigation.emptyCellButtons();
            }
        },
        defaultStop : () => {

        },
        placeBuildingStart : (cell) => {
            if(!cell) {
                console.error('No cell provided');
                return;
            }

            buildingToPlace = cell; // global from sketch.js
            placeBuildingMode = true; // global from sketch.js                
            const mainNavigation = document.querySelector('main-navigation');
            mainNavigation.placeBuildingButtons();

            mainNavigation.on('cancel',() => {
                viewMode.placeBuildingStop();
                viewMode.defaultStart();
            })

            mainNavigation.on('confirm',() => {
                confirmPlacingCell().then(() => {
                    viewMode.placeBuildingStop();
                    viewMode.defaultStart();
                });
            })

            viewMode.current = 'placeBuilding';
        },

       placeBuildingStop: () => {
            buildingToPlace = null; // global from sketch.js
            placeBuildingMode = false; // global from sketch.js
            
            const mainNavigation = document.querySelector('main-navigation');
            mainNavigation.occupiedCellButtons();
        },

    editCellStart: () =>{
            console.log('editCell mode started');
            const canvas = document.querySelector('canvas');
            canvas.style.display = 'none';
            // hide #activeCellDiv
            const activeCellDiv = document.getElementById('activeCellDiv');
            if (activeCellDiv){
            activeCellDiv.style.display = 'none';
            }

            const cellEditor = document.querySelector('cell-editor');
            cellEditor.editCell(grid.activeCell.i,grid.activeCell.j);
            console.log(cellEditor);
            cellEditor.style.display = 'block';
            // get isometric-drawing component from shadow root
            const isometricDrawing = cellEditor.shadowRoot.querySelector('isometric-drawing');
            isometricDrawing.setSize(300,600);
            viewMode.current = 'editCell';
        },
        editCellStop : (confirmed = false) =>{
            const canvas = document.querySelector('canvas');
            canvas.style.display = 'block';

            // show activeCellDiv if not in place building mode
            if(!placeBuildingMode) {
                const activeCellDiv = document.getElementById('activeCellDiv');
                if (activeCellDiv){
                activeCellDiv.style.display = 'block';
                }
            }
            
            const cellEditor = document.querySelector('cell-editor');
            cellEditor.style.display = 'none';
        }       

    }