class AudioMessage extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.audioChunks = [];
        this.playing = false;
        this.audio = new Audio();
        this.visualisation = null;
        this.audioBlob = null;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();

    }

    render() {
        this.shadowRoot.innerHTML = `\
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <script src="https://unpkg.com/wavesurfer.js"></script>
            <style>
            .container {
            display: block;
            justify-content: left;
            height: 90px;
            gap: 10px;
            border-radius: 45px;
            width: 80%;
            margin-left: 5%;
            margin-right: 5%;
            padding: 10px;
            background-color:rgba(46, 122, 143, 0.35);
            padding-top: 30px;
            }

           

            button {
            padding: 10px;
            border: none;
            cursor: pointer;
            display: block;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 50px;
            height: 50px;
            }

            button:hover {
            background-color: lightgray;
            transform: translateY(2px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            #waveformvisualisation {
            width: 100%;
            height: 20px;
            }

            

            @keyframes pulsate {
            0% {
            transform: scale(1);
            background-color: red;
            }
            50% {
            transform: scale(1.1);
            background-color: darkred;
            }
            100% {
            transform: scale(1);
            background-color: red;
            }
            }

            i {
            font-size: 24px;
            }
 
            .pulsate {
            animation: pulsate 1s infinite;
            }

            button#play {
            background-color: #4caf50;
            color: white;
            }

            button#delete {
            background-color: #f44336;
            color: white;
            display: none;
            }

            table, td, tr {
                border: 0;
                margin: 0;
                padding: 0;
            }
            table {

                width: 100%;
                

            .button-container {
            display: inline-block;
            height:100%;
            width: 20%;
    }   
            .wave-container {
            display: inline-block;
            height: 100%;
            width: 75%;
    }
            
            </style>
            <div class="container">
            <table>
                <tr>
                    <td class="button-container">
                        <button id="play" style="display: none;"><i class="fas fa-play"></i></button>
                        <button id="delete" style="display: none;"><i class="fas fa-trash"></i></button>
                    </td>
                    <td class="wave-container">
                        <div id="waveformvisualisation"></div>
                    </td>
                </tr>
            </table>
            
            </div>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector('#play').addEventListener('click', this.togglePlaying.bind(this));
    }

   
    togglePlaying() {
        if (this.playing) {
            this.pausePlaying();
        } else {
            this.startPlaying();
        }
    }

    startPlaying() {
        this.playing = true;
        this.shadowRoot.querySelector('#play').innerHTML = '<i class="fas fa-pause"></i>';
        this.visualisation.play();
        this.visualisation.on('finish', () => {
            this.playing = false;
            this.shadowRoot.querySelector('#play').innerHTML = '<i class="fas fa-play"></i>';
        });
        // pulse the play button
        
    }

    pausePlaying() {
        this.playing = false;
        this.shadowRoot.querySelector('#play').innerHTML = '<i class="fas fa-play"></i>';
        this.visualisation.pause();
    }

   

    visualizeWaveform() {
        if (this.visualisation) {
            this.visualisation.destroy();
        }
        this.visualisation = WaveSurfer.create({
            container: this.shadowRoot.querySelector('#waveformvisualisation'),
            waveColor: '#9999FF',
            progressColor: '#000000',
            barWidth: 5,
            height: 50, // Fixed height
            mediaControls: false,
            backgroundColor: '#2E7A8F' // Added background color
        });

        this.visualisation.loadBlob(this.audioBlob);

        this.visualisation.on('ready', () => {
            this.visualisation.zoom(0);
        });
    }

    getAudioBlob() {
        return this.audioBlob;
    }

    setAudioFromBase64String(base64String, autoplay = false, delayAutoplay = 0) {
        this.audio.src = base64String;
        // convert to blob 

        this.audioBlob = this.base64toAudioBlob(base64String);
        

        const playbutton = this.shadowRoot.querySelector('#play')
        if(playbutton){
            playbutton.style.display = 'block';
        }
        if (this.visualisation) {
            this.visualisation.destroy();
        }
        this.visualisation = WaveSurfer.create({
            container: this.shadowRoot.querySelector('#waveformvisualisation'),
            waveColor: '#9999FF',
            progressColor: '#000000',
            barWidth: 5,
            height: 50, // Fixed height
            mediaControls: false,
            backgroundColor: '#2E7A8F' // Added background color
        });

        this.visualisation.loadBlob(this.audioBlob);

        this.visualisation.on('ready', () => {
            this.visualisation.zoom(0);
        });

        if (autoplay) {
            setTimeout(() => {
                this.startPlaying();
            }, delayAutoplay);
        }


    }


    base64toAudioBlob(base64) {
        var base64dataOnly = base64.split(',')[1];
        var binaryString = atob(base64dataOnly);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes.buffer], {type: 'audio/wav'});
    }

    hasAudio() {
        return this.audioBlob !== null;
    }

}

customElements.define('audio-message', AudioMessage);

