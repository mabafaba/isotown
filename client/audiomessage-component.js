class AudioMessage extends HTMLElement {

    constructor(base64StringAudio) {
        super();
        this.attachShadow({mode: 'open'});
        this.audioChunks = [];
        this.recording = false;
        this.playing = false;
        this.audio = new Audio();
        this.visualisation = null;
        this.base64StringAudio = base64StringAudio;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        if (this.base64StringAudio) {
            this.setAudioFromBase64String(this.base64StringAudio);
        }
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
            width: 400px;
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
            width: 100px
            height: 20px;
            }

            button.recording {
            background-color: red;
            color: white;
            animation: pulsate 1s infinite;
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
            button#record {
            background-color: #ff4d4d;
            color: white;
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
                        <button id="record"><i class="fas fa-microphone"></i></button>
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
        this.shadowRoot.querySelector('#record').addEventListener('click', this.toggleRecording.bind(this));
        this.shadowRoot.querySelector('#play').addEventListener('click', this.togglePlaying.bind(this));
        this.shadowRoot.querySelector('#delete').addEventListener('click', this.deleteRecording.bind(this));
    }

    toggleRecording() {
        if (this.recording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.audioChunks = [];
        this.recording = true;
        this.audioBlob = null;
        this.audio.src = '';
        if (this.visualisation) {
            this.visualisation.destroy();
        }

        this.shadowRoot.querySelector('#record').innerHTML = '<i class="fas fa-stop"></i>';
        this.shadowRoot.querySelector('#play').style.display = 'none';
        this.shadowRoot.querySelector('#delete').style.display = 'none';
        this.shadowRoot.querySelector('#record').classList.add('recording');

        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = event => {
                    this.audioChunks.push(event.data);
                };
                this.mediaRecorder.onstop = () => {
                    this.audioBlob = new Blob(this.audioChunks, {type: 'audio/wav'});
                    this.audio.src = URL.createObjectURL(this.audioBlob);
                    this.shadowRoot.querySelector('#play').style.display = 'block';
                    // this.shadowRoot.querySelector('#delete').style.display = 'block';
                    this.visualizeWaveform();
                };
                this.mediaRecorder.start();
            });
    }

    stopRecording() {
        this.recording = false;
        this.shadowRoot.querySelector('#record').innerHTML = '<i class="fas fa-microphone"></i>';
        this.shadowRoot.querySelector('#record').classList.remove('recording');
        this.mediaRecorder.stop();
        // emit event
        this.dispatchEvent(new CustomEvent('recording-stopped', {detail: this.audioBlob}));
        // hide record button
        this.shadowRoot.querySelector('#record').style.display = 'none';
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
    }

    pausePlaying() {
        this.playing = false;
        this.shadowRoot.querySelector('#play').innerHTML = '<i class="fas fa-play"></i>';
        this.visualisation.pause();
    }

    deleteRecording() {
        this.audioChunks = [];
        this.audioBlob = null;
        this.audio.src = '';
        if (this.visualisation) {
            this.visualisation.destroy();
        }
        this.shadowRoot.querySelector('#play').style.display = 'none';
        this.shadowRoot.querySelector('#delete').style.display = 'none';
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

    setAudioFromBase64String(base64String) {
        this.audio.src = base64String;
        this.audioBlob = base64String;
        this.visualizeWaveform();
        this.shadowRoot.querySelector('#play').style.display = 'block';
        // hide record button
        this.shadowRoot.querySelector('#record').style.display = 'none';
    }

}

customElements.define('audio-message', AudioMessage);

