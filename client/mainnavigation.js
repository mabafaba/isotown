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

                #forwardbutton {
                    background-color: rgb(0, 255, 98) !important;
                }

                #forwardbutton:hover {
                    background-color: rgb(1, 152, 59) !important;
                }

                #backwardbutton {
                    background-color: rgb(255, 193, 7) !important;
                }

                #backwardbutton:hover {
                    background-color: rgb(204, 153, 0) !important;
                }

                .movearrow {
                    cursor: pointer;
                }

                .movearrow:hover img {
                    filter: invert(1);
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
                <div class="roundbutton hidden" id="messagebutton">
                        <i class="fas fa-comment"></i>
                    </div>
                    <div class="roundbutton hidden" id="cancelbutton">
                        <i class="fas fa-times"></i>
                    </div>
                    <div class="roundbutton hidden" id="backwardbutton">
                        <i class="fas fa-arrow-left"></i>
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
                    <div class="roundbutton hidden" id="plusbutton">
                        <i class="fas fa-plus"></i>
                    </div>

                    <div class="roundbutton hidden" id="confirmbutton">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="roundbutton hidden" id="forwardbutton">
                        <i class="fas fa-arrow-right"></i>
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
        const events = ['plus', 'cancel', 'message', 'confirm', 'northwest', 'northeast', 'southwest', 'southeast', 'forward', 'backward'];
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

    showForwardButton() {
        this.shadowRoot.getElementById('forwardbutton').classList.remove('hidden');
    }

    hideForwardButton() {
        this.shadowRoot.getElementById('forwardbutton').classList.add('hidden');
    }

    showBackwardButton() {
        this.shadowRoot.getElementById('backwardbutton').classList.remove('hidden');
    }

    hideBackwardButton() {
        this.shadowRoot.getElementById('backwardbutton').classList.add('hidden');
    }

    showArrowButtons() {
        this.shadowRoot.getElementById('navigationbuttons').classList.remove('hidden');
    }

    hideArrowButtons() {
        this.shadowRoot.getElementById('navigationbuttons').classList.add('hidden');
    }

    on(button, callback) {
        // button must be string of 'plus', 'cancel', 'message', 'confirm', 'northwest', 'northeast', 'southwest', 'southeast', 'forward', 'backward'
        const buttonElement = this.shadowRoot.getElementById(`${button}button`);
        // remove any existing event listeners (not just a specific one) by cloning the element
        const newButtonElement = buttonElement.cloneNode(true);
        buttonElement.parentNode.replaceChild(newButtonElement, buttonElement);
        newButtonElement.addEventListener('click', callback);
    }

    emptyCellButtons() {
        this.hideAllButtons();

        this.showPlusButton();
        this.showArrowButtons();
    }

    placeBuildingButtons() {
        this.hideAllButtons();

        this.showCancelButton();
        this.showConfirmButton();
        this.showArrowButtons();
    }

    occupiedCellButtons() {
        this.hideAllButtons();

        this.showMessageButton();
        this.showArrowButtons();
    }

    editingCellButtons() {
        this.hideAllButtons();

        this.showCancelButton();
        this.showForwardButton();
        this.showBackwardButton();
    }

    showAllButtons() {
        this.showPlusButton();
        this.showCancelButton();
        this.showMessageButton();
        this.showConfirmButton();
        this.showForwardButton();
        this.showBackwardButton();
    }

    hideAllButtons() {
        this.hidePlusButton();
        this.hideCancelButton();
        this.hideMessageButton();
        this.hideConfirmButton();
        this.hideForwardButton();
        this.hideBackwardButton();
        this.hideArrowButtons();
    }
}

customElements.define('main-navigation', GameControls);