

const viewMode = {
    modes: ['default', 'placeBuilding', 'editCell'],
    current: 'default',

    defaultStart : () =>{
            viewMode.current = 'default';
            const mainNavigation = document.querySelector('main-navigation');
        
            mainNavigation.emptyCellButtons();

        },
        defaultStop : () => {

        },
        placeBuildingStart : (cell) => {
            if(!cell) {
                console.error('No cell provided');
                return;
            }
            console.log('placeBuilding mode started', cell);
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
            const mainNavigation = document.querySelector('main-navigation');
            mainNavigation.editingCellButtons();
            mainNavigation.on('cancel',() => {
                viewMode.editCellStop();
                viewMode.defaultStart();
            })

            mainNavigation.on('confirm',async () => {
                const cellEditor = document.querySelector('cell-editor');
                var cell = null;
                try {
                   cell = await cellEditor.getCell();
                } catch (error) {
                   alert("Make sure you have a description, a voice recording an a drawing ready.")
                   console.log('Error saving cell',error);
                   return;
                }
                
                // 
                var imagesdiv = document.getElementById('temp-image-holder');
                tempImage = createImg(cell.imgURL,'drawing for cell').parent(imagesdiv);        
                viewMode.editCellStop();
                viewMode.placeBuildingStart(cell);
            });
            mainNavigation.on('forward',() => {
                const cellEditor = document.querySelector('cell-editor');                
                cellEditor.nextPage();
            });

            mainNavigation.on('backward',() => {
                const cellEditor = document.querySelector('cell-editor');                
                cellEditor.previousPage();
            });



            console.log('editCell mode started');
            const canvas = document.querySelector('canvas');
            canvas.style.display = 'none';

            const cellEditor = document.querySelector('cell-editor');
            cellEditor.editCell(grid.activeCell.i,grid.activeCell.j);
            
            cellEditor.style.display = 'block';
            // get isometric-drawing component from shadow root
            const isometricDrawing = cellEditor.shadowRoot.querySelector('isometric-drawing');
            isometricDrawing.setSize(300,600);
            cellEditor.setPage(1);
            viewMode.current = 'editCell';
        },
        editCellStop : (confirmed = false) =>{

            const canvas = document.querySelector('canvas');
            canvas.style.display = 'block';

         
            
            const cellEditor = document.querySelector('cell-editor');
            cellEditor.style.display = 'none';
        }       

    }