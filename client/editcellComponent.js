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

                #navigationbuttons {
                    display: flex;
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

                #page1 {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 100%;
                    margin: 0px;
                }

                #page2 {
                    display:flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                    
                    
                }

           
                @media (min-width: 768px) {
                    #page2 {
                        display: flex;
                        flex-direction: row;
                    }
                    .drawinginstructions {
                        width: 20%;
                    }
                    .drawing {
                        width: 20%;
                    }
                }

                @media (max-width: 767px) {
                    #page2 {
                        display: flex;
                    }
                    .drawinginstructions, .drawing {
                        width: 100%;
                    }
                }
                }
            </style>
            <div class="container">
            <h1>Edit Cell</h1>
            <div id="page1">
            <div class="instructions">
                Record your voice to explain what your field is all about!
                It doesn't have to be perfect, just give it a try!
                Explain it as if you were talking to a friend over the phone.
                You can always re-record it.
                When you're done, click "Next".
            </div>
            <audio-recorder></audio-recorder>
            </div>
            <div id="page2">
            <div class="instructions drawinginstructions">
            In the field below, draw a picture that will be shown on the playing field.
            You don't have to be an artist, just give it a try!
            Can you think of a color, shape, landscape, object that feels fitting to what you are sharing?
            </div>
            <div class="drawing">
            <isometric-drawing></isometric-drawing>
            </div>
            </div>
            <div id="page3">
            </div>
            <div id="navigationbuttons">
                <div id="prevPlaceholder"></div>
                <button id="previousButton" @click="previousPage">Back</button>
                <button id="nextButton" @click="nextPage">Next</button>
                <button id="savedb">DONE</button>

            </div>
            <script src="https://unpkg.com/wavesurfer.js@7"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.setPage(1);
        this.shadowRoot.getElementById('previousButton').addEventListener('click', this.previousPage.bind(this));
        this.shadowRoot.getElementById('nextButton').addEventListener('click', this.nextPage.bind(this));


   
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
        // if first page, disable previous button
        if(this.page === 1) {
            this.shadowRoot.getElementById('previousButton').style.display = 'none';
            this.shadowRoot.getElementById('prevPlaceholder').style.display = 'block';
        } else {
            this.shadowRoot.getElementById('previousButton').style.display = 'block';
            this.shadowRoot.getElementById('prevPlaceholder').style.display = 'none';
        }
        // if last page, hide next button
        if(this.page === this.maxPage) {
            this.shadowRoot.getElementById('nextButton').style.display = 'none';
            this.shadowRoot.getElementById('savedb').style.display = 'block';
        } else {
            this.shadowRoot.getElementById('nextButton').style.display = 'block';
            this.shadowRoot.getElementById('savedb').style.display = 'none';
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

    connectedCallback() {
        

        const saveToDatabase = () => {
            console.log('Saving to database cell:', this.cellX, this.cellY);

            const voice = this.shadowRoot.querySelector('audio-recorder').getAudioBlob();

            this.shadowRoot.querySelector('isometric-drawing').exportPNG().then((imgURL) => {
                const reader = new FileReader();
                reader.readAsDataURL(voice);
                reader.onloadend = () => {
                    const base64Voice = reader.result;
                    const payload = {
                        x: this.cellX,
                        y: this.cellY,
                        image: imgURL,
                        voice: base64Voice
                    };
                    const payloadString = JSON.stringify(payload);
                    fetch('http://localhost:3000/grid/cell', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: payloadString
                    }).then((response) => {
                        console.log('Response:', response);
                    });
                };
            });
        };

        this.shadowRoot.getElementById('savedb').addEventListener('click', saveToDatabase);

        window.onload = () => {
            const drawing = this.shadowRoot.querySelector('isometric-drawing');
            drawing.setSize(300, 500);
        };
    }

    editCell(x, y) {
        this.cellX = x;
        this.cellY = y;
        return {x: x, y: y};
    }

}

customElements.define('cell-editor', EditCellComponent);
