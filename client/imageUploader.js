class ImageUploader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .uploader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 2px dashed #ccc;
                    padding: 20px;
                    width: 300px;
                    text-align: center;
                }
                .uploader img {
                    max-width: 100%;
                    margin-top: 10px;
                }
            </style>
            <div class="uploader">
                <input type="file" accept="image/*" />
                <img id="preview" src="" alt="Image Preview" />
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('input[type="file"]').addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.shadowRoot.querySelector('#preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}

customElements.define('image-uploader', ImageUploader);