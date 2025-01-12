class GameControls extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        shadow.appendChild(fontAwesomeLink);

        shadow.innerHTML += `
            <style>
                #gamecontrols {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 130px;
                    background-color: rgba(255, 255, 255, 0.5);
                    z-index: 100;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
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

                #plusbutton {
                    background-color: rgb(41, 208, 202) !important;
                    content: '\\f067';
                }

                #plusbutton:hover {
                    background-color: rgb(31, 198, 192) !important;
                }

                #messagebutton {
                    background-color: lightyellow !important;
                }

                #messagebutton:hover {
                    background-color: rgb(255, 255, 0) !important;
                }

                #confirmbutton {
                    background-color: rgb(28, 227, 117) !important;
                }

                #confirmbutton:hover {
                    background-color: rgb(17, 160, 81) !important;
                }

                .hidden {
                    display: none;
                }

                #cancelbutton {
                    background-color: lightcoral !important;
                    content: '\\f00d';
                }

                #cancelbutton:hover {
                    background-color: rgb(255, 0, 0) !important;
                }

                .movearrow img {
                    width: 40px;
                    height: 40px;
                }

                #leftcolumn, #centercolumn, #rightcolumn {
                    width: 33.33%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
            <div id="gamecontrols">
            <div id='leftcolumn'>
                <div class="roundbutton" id="plusbutton">
                <i class="fas fa-plus"></i>
                </div>
                <div class="roundbutton hidden" id="cancelbutton">
                    <i class="fas fa-times"></i>
                </div>
                </div>
                <div id="centercolumn">
                <div id="navigationbuttons">
                    <table>
                        <tr>
                            <td id="northwestbutton" class="movearrow"><img src="arrow_up_right.svg" alt="arrow_up_right" style="transform: rotate(270deg);"></td>
                            <td id="northeastbutton" class="movearrow"><img src="arrow_up_right.svg" alt="arrow_up_right" style="transform: rotate(0deg);"></td>
                        </tr>
                        <tr>
                            <td id="southwestbutton" class="movearrow"><img src="arrow_up_right.svg" alt="arrow_up_right" style="transform: rotate(180deg);"></td>
                            <td id="southeastbutton" class="movearrow"><img src="arrow_up_right.svg" alt="arrow_up_right" style="transform: rotate(90deg);"></td>
                        </tr>
                    </table>
                </div>
                </div>
                <div id='rightcolumn'>
                <div class="roundbutton hidden" id="messagebutton">
                    <i class="fas fa-comment"></i>
                </div>
                <div class="roundbutton hidden" id="confirmbutton">
                    <i class="fas fa-check"></i>
                </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.attachEventListeners();


        // listen for active cell change event
        document.addEventListener('activeCellChange', e => {
            console.log("VIEWMODE", viewMode.current);
            if(viewMode.current === 'placeBuilding') return;
            console.log('active cell change event heard in navigation');
            const cell = e.detail.cell;
            if (cell.img) {
                this.occupiedCellButtons();
            } else {
                this.emptyCellButtons();
            } 
        })
    }

    attachEventListeners() {
        const events = ['plus', 'cancel', 'message', 'confirm', 'northwest', 'northeast', 'southwest', 'southeast'];
        events.forEach(event => {
            const callback = this.getAttribute(`on${event}`);
            if (callback) {
                this.on(event, new Function(callback));
            }
        });
    }

    showPlusButton() {
        this.shadowRoot.getElementById('plusbutton').classList.remove('hidden');
    }

    hidePlusButton() {
        this.shadowRoot.getElementById('plusbutton').classList.add('hidden');
    }

    showCancelButton() {
        this.shadowRoot.getElementById('cancelbutton').classList.remove('hidden');
    }

    hideCancelButton() {
        this.shadowRoot.getElementById('cancelbutton').classList.add('hidden');
    }

    showMessageButton() {
        this.shadowRoot.getElementById('messagebutton').classList.remove('hidden');
    }

    hideMessageButton() {
        this.shadowRoot.getElementById('messagebutton').classList.add('hidden');
    }

    showConfirmButton() {
        this.shadowRoot.getElementById('confirmbutton').classList.remove('hidden');
    }

    hideConfirmButton() {
        this.shadowRoot.getElementById('confirmbutton').classList.add('hidden');
    }



    on(button, callback) {
        // button must be string of 'plus', 'cancel', 'message', 'confirm', 'northwest', 'northeast', 'southwest', 'southeast'
        const buttonElement = this.shadowRoot.getElementById(`${button}button`);
        buttonElement.addEventListener('click', callback);
    }

    emptyCellButtons() {
        this.hideCancelButton();
        this.hideMessageButton();
        this.hideConfirmButton();

        this.showPlusButton();
    }

    placeBuildingButtons() {
        this.hidePlusButton();
        this.hideMessageButton();

        this.showCancelButton();
        this.showConfirmButton();
    }

    occupiedCellButtons() {
        this.hidePlusButton();
        this.hideConfirmButton();
        this.hideCancelButton();
        this.showMessageButton();

        }

    showAllButtons() {
        this.showPlusButton();
        this.showCancelButton();
        this.showMessageButton();
        this.showConfirmButton();
    }
}

customElements.define('main-navigation', GameControls);