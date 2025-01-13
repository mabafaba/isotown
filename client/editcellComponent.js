import './audiorecorder.js';
import './iiisometric.js';


class EditCellComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cellX = 0;
        this.cellY = 0;
        this.page = 1;
        this.maxPage = 3;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
            @import url('https://unpkg.com/sakura.css/css/sakura.css');

            .container {
                background-color: black;
                color: white;
                position: relative;
                height: 100%;
                width: 100%;
                padding: 0px;
                top: 0;
            }
            isometric-drawing::part(iiisometric-wrapper){
                position: relative;
            }
            isometric-drawing::part(iiisometric-wrapper)::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('buildingmask_b_alpha.png');
                background-size: 100% 100%;
                background-position: center;
                z-index: 1;
                pointer-events: none;
            }
            isometric-drawing > * {
                position: relative;
                z-index: 2;
            }
            #iiisometric-wrapper{
                background-color: white;
            }

            #navigationbuttons {
                display: none;
                justify-content: center;
                align-items: center;
                gap: 20px;
                width: 100%;

            }
            div {
                display: block;
                padding: 10px;
            }
            div.instructions {
                position: relative;
                display: block;
                width: 100%;
                padding: 30px;
                margin: 0px;
                font-size: 1.5em;
            
            }
            #nextButton {
            position: fixed;
                right: 10px;
                bottom: 10px;
                width: 100px;
                height: 50px;
                background-color: #4CAF50;
                color: white;
            }
            #previousButton {

                position: fixed;
                left: 10px;
                bottom: 10px;
                width: 100px;
                height: 50px;
            }
            /* #cancelButton {
                position: fixed;
                right: 160px;
                bottom: 10px;
                width: 100px;
                height: 50px;
                background-color: red;
                color: white;
            } */

            .page {
                /* border: 1px solid white; */
                display: flex;
                flex-wrap: wrap; /* Allows items to wrap on narrow screens */
                gap: 10%;
                height: 100%;
                width: 100%;
                overflow: scroll;
                padding: 0px;
                margin: 0px;
            }

            .pageItem {
                
                /* border: 1px solid green; */
                flex: 1 1 45%;   /* Flex item with 45% width and shrink/grow behavior */
                min-width: 200px; /* Minimum width before wrapping */
                background-color: none;
                padding: 30px;
                text-align: center;
                box-sizing: border-box; 
            }


            textarea {
                display: block;
                width: 60%;
                margin-left: auto;
                margin-right: auto;
                height: 10em;
                rows: 10;
                
                font-size: 2em;
            }
            .description {
                
            }


            .roundbutton {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: white;
                margin: 10px;
                display: inline-block;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            .roundbutton:hover {
                transform: translate(3px, 3px);
                box-shadow: none;
            }

            isometric-drawing {
                width: 300px;
            }

            .confirmbutton {
                background-color: rgb(28, 227, 117) !important;
            }

            .confirmbutton:hover {
                background-color: rgb(17, 160, 81) !important;
            }

            div.instructions {
                    flex: 1 auto;
                    padding-top: 100px;
                    width: 60%;
                    margin-left: auto;
                    margin-right: auto;
            }

            div.instructions.drawinginstructions {
                flex: 1 1 20%;
                height: 3em;
                width: 100%;
                padding-top:20px;
            }

            </style>
            <div class="container">
            <!-- <h1>Edit Cell</h1> -->
            <div id="page1" class="page">
            <div class="instructions pageItem">
                Please describe your idea in a few sentences!
            </div>
            <div id="description" class= "description pageItem">
                <textarea id="cellDescription" name="cellDescription" placeholder="My idea..."></textarea>
            </div>
            </div>
            <div id="page2" class="page">
            <div id="recordinginstructions" class="instructions pageItem">
                Record your voice to explain what your field is all about!
                It doesn't have to be perfect, just give it a try!
                Explain it as if you were talking to a friend over the phone.
                You can always re-record it.
                When you're done, click "Next".
            </div>
            <div class="pageItem">
                <audio-recorder></audio-recorder>
            </div>
            </div>
            <div id="page3" class="page">
            <div class="instructions drawinginstructions pageItem">
                Draw some cool looking cubes to represent your idea!
            </div>
            <div class="drawing pageItem">
            <isometric-drawing></isometric-drawing>
            </div>
            </div>
            <div id="navigationbuttons">
            <div id="prevPlaceholder"></div>
            <div class="roundbutton backbutton" id="previousButton" @click="previousPage">Back</div>
            <div class="roundbutton nextbutton" id="nextButton" @click="nextPage">Next</div>
            <div class="roundbutton confirmbutton" id="savedb">DONE</div>
            <div class="roundbutton" id="cancelButton">Cancel</div>
            </div>
            <script src="https://unpkg.com/wavesurfer.js@7"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.getElementById('previousButton').addEventListener('click', this.previousPage.bind(this));
        this.shadowRoot.getElementById('nextButton').addEventListener('click', this.nextPage.bind(this));
        this.shadowRoot.getElementById('cancelButton').addEventListener('click', this.cancelEdit.bind(this));
    }

    nextPage() {
        this.setPage(this.page + 1);
    }

    previousPage() {
        this.setPage(this.page - 1);
    }

    setPage(page) {
        if(page < 1 || page > this.maxPage) {
            return;
        }
        for(let i = 1; i <= this.maxPage; i++) {
            this.shadowRoot.getElementById('page' + i).style.display = 'none';
        }
        this.page = page;
        this.shadowRoot.getElementById('page' + this.page).style.display = 'flex';

        const mainNavigation = document.querySelector('main-navigation');
        console.log('main navigation',mainNavigation);
        // if first page, disable previous button
        if(this.page === 1) {
            console.log('about to call',mainNavigation.hideConfirmButton);
            mainNavigation.hideConfirmButton();
            mainNavigation.hideBackwardButton();

            mainNavigation.showCancelButton();
            mainNavigation.showForwardButton();
        } else if(this.page === this.maxPage) {
            mainNavigation.hideForwardButton();

            mainNavigation.showCancelButton();
            mainNavigation.showBackwardButton();
            mainNavigation.showConfirmButton();
        } else {
            mainNavigation.hideConfirmButton();

            mainNavigation.showCancelButton();
            mainNavigation.showBackwardButton();
            mainNavigation.showForwardButton();
            
        }
        // if drawing page, start drawing intro tour
        if(this.page === 3) {
            this.drawingIntroTour();
        }
        
        // if correct page, focus on textarea
        if(this.page === 1) {
            this.shadowRoot.getElementById('cellDescription').focus();
        }
    }

    disableNextButton() {
             // set next button 'disabled' attribute
             this.shadowRoot.getElementById('nextButton').setAttribute('disabled', 'true');
             // gray out the button
             this.shadowRoot.getElementById('nextButton').style.backgroundColor = 'gray';

    }

    enableNextButton() {
        // remove 'disabled' attribute
        this.shadowRoot.getElementById('nextButton').removeAttribute('disabled');
        // set button to green
        this.shadowRoot.getElementById('nextButton').style.backgroundColor = '#4CAF50';
    }  

    async getCell() {

        function readBlobAsDataUrl(blob){
            return new Promise((resolve, reject) => {
              var reader = new FileReader();  
              reader.onloadend = () => {
                resolve(reader.result)
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }

        
        // make sure all components are ready
        var voice = this.shadowRoot.querySelector('audio-recorder').getAudioBlob();
        console.log('voice', voice);
        if(!voice) {
            // return rejected promise
            return Promise.reject('voice not set');
        }
        voice = await readBlobAsDataUrl(voice);
        const description = this.shadowRoot.getElementById('cellDescription').value;
        const imgURL = await this.shadowRoot.querySelector('isometric-drawing').exportPNG();

        const x = this.cellX;
        const y = this.cellY;
        if (!x || !y) {
            // warning
           console.warn('x or y not set');
        }
        if (!voice) {
            // warning
            console.warn('voice not set');
        }
        if(!description) {
            // warning
            console.warn('description not set');
        }
        if(!imgURL) {
            // warning
            console.warn('drawing (url) not set');
        }
        // if(!thisimg) {
        //     // warning
        //     console.warn('drawing (img) not set');
        // }
        return {
            x: x,
            y: y,
            voice: voice,
            description: description,
            imgURL: imgURL
        };
    }

    resetAll () {
        this.shadowRoot.querySelector('audio-recorder').stopRecording();
        this.shadowRoot.querySelector('audio-recorder').deleteRecording();
        this.shadowRoot.getElementById('cellDescription').value = '';
        this.shadowRoot.querySelector('isometric-drawing').clear();
    }


    connectedCallback() {


        window.onload = () => {
            const drawing = this.shadowRoot.querySelector('isometric-drawing');
            drawing.setSize(300, 500);
        };

    }

    cancelEdit() {
        
        // stop recording
        this.shadowRoot.querySelector('audio-recorder').stopRecording();
        // emit event to parent 
        this.dispatchEvent(new CustomEvent('cancel-editing-cell', { bubbles: true }));
        
    }

    editCell(x, y) {
        this.cellX = x;
        this.cellY = y;
        return {x: x, y: y};
    }

    
    drawingIntroTour () {
        const drawingComponent = this.shadowRoot.querySelector('isometric-drawing');
        // scroll to top page3

        const page3 = this.shadowRoot.getElementById('page3');
        page3.scrollTo({
            top: 0,
            behavior: 'auto'
        });

        introJs().setOptions({
            steps: [
            {
                element: drawingComponent.shadowRoot.querySelector('#drawinginstructions'),
                intro: 'Here, you\'ll make a drawing that will show as the building on the map.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#iiisometric'),
                intro: 'This is the drawing canvas where you can draw your cubes.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#draw'),
                intro: 'Click here to start drawing.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#erase'),
                intro: 'Click here to erase cubes.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#color'),
                intro: 'Choose a color for your cubes here.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#cube-size'),
                intro: 'Adjust the size of your cubes here.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#clear'),
                intro: 'Click here to clear the entire canvas.'
            },
            {
                element: drawingComponent.shadowRoot.querySelector('#undo'),
                intro: 'Click here to undo the last action.'
            }
            ],
            scrollToElement: true,
            scrollPadding: 100,
            showStepNumbers: true,
            disableInteraction: true
        }).oncomplete(() => {
            const page3 = this.shadowRoot.getElementById('page3');
            page3.scrollTo({
            top: page3.scrollHeight,
            behavior: 'smooth'
            });
        }).start();
    }

}

customElements.define('cell-editor', EditCellComponent);
