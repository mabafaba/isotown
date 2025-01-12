class TextMessage extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const message = this.getAttribute('message');
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            <style>
            .container {
            display: block;
            justify-content: left;
            height: auto;
            gap: 10px;
            border-radius: 10px;
            width: 80%;
            margin-left: 5%;
            margin-right: 5%;
            margin-bottom: 10px;
            padding: 10px;
            background-color:rgba(46, 122, 143, 0.35);
            padding-top: 10px;
            }

            #message {
            font-size: 20px;
            color: #FFF;
            font-family: monospace;
            width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
            }

            </style>
            <div class="container">
                <div id="message">${message}</div>
            </div>
        `;
        
    }
}

customElements.define('text-message', TextMessage);
