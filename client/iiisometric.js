import chroma from 'https://cdn.jsdelivr.net/npm/chroma-js@3.1.2/index.min.js';
import { SVG } from 'https://cdn.skypack.dev/@svgdotjs/svg.js';

class IsometricDrawing extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #iiisometric-wrapper {
                    border: 2px solid #ccc;
                    border-radius: 5px;
                }
                #single-cube-wrapper {
                    width: 50px;
                    height: 50px;
                }
            </style>
            <div id="iiisometric-wrapper"></div>
            <div id="controls">
                <button id="clear">Clear</button>
                <button id="undo">Undo</button>
                <button id="random-color">Random Color</button>
                <button id="copy">Copy</button>
                <button id="download">Download</button>
                <button id="draw">Draw</button>
                <button id="erase">Erase</button>
                <label for="opacity">Opacity:</label>
                <input type="range" id="opacity" name="opacity" min="0" max="1" step="0.1" value="1">
                <label for="cube-size">Cube Size:</label>
                <input type="range" id="cube-size" name="cube-size" min="20" max="100" step="5" value="50">
                <label for="color">Color:</label>
                <input type="color" id="color" name="color" value="#1e90ff">
                <label for="drawing-order">Drawing Order:</label>
                <select id="drawing-order" name="drawing-order">
                    <option value="front">Front</option>
                    <option value="behind">Behind</option>
                </select>
            </div>
        `;

        this.width = 200;
        this.height = 200;
        this.baseSize = 50;
        this.gridDivider = 4;
        this.currentCube = 'full';
        this.currentTool = 'draw';
        this.currentColor = '#d100ff';
        // set color input to current color
        this.shadowRoot.querySelector('#color').value = this.currentColor;
        this.lightColor = chroma(this.currentColor).brighten().hex();
        this.darkColor = chroma(this.currentColor).darken().hex();
        this.allCubes = [];
        this.points = [];
        this.drawingOrder = 'front';
        this.init();
    }

    init() {
        const svg = SVG()
            .size(this.width, this.height)
            .viewbox(0, 0, this.width, this.height)
            .addTo(this.shadowRoot.querySelector('#iiisometric-wrapper'))
            .attr('id', 'iiisometric');

        this.shadowRoot.querySelector('#iiisometric-wrapper').part = 'iiisometric-wrapper';



        this.superWrapper = svg.group().attr('shape-rendering', 'crispEdges');
        this.ghostWrapper = svg.group();
        this.svgEl = this.shadowRoot.querySelector('#iiisometric');
        this.refPoint = this.svgEl.createSVGPoint();

        this.setSymbols(svg);

        svg.click(this.clickHandler.bind(this));

        svg.mouseout(() => {
            this.ghostWrapper.clear();
        });

        svg.mousemove(this.mouseMoveHandler.bind(this));

        this.svg = svg;

        this.activateControls();
        this.continuousDrawingWhileMouseDown();

        // setSize to the parent element size
        const wrapper = this.shadowRoot.querySelector('#iiisometric-wrapper');
        console.log('drawing component', this);
        // set random color
        this.setRandomColor();
    }

    setSize = (width, height) => {
        // set the size everywhere it needs to be set
        this.width = width;
        this.height = height;
        // set the size of the svg element
        this.svg.size(this.width, this.height);
        // set the viewbox of the svg element
        this.svg.viewbox(0, 0, this.width, this.height);
        // set the size of the wrapper element
        this.shadowRoot.querySelector('#iiisometric-wrapper').style.width = `${this.width}px`;

    }

    setSymbols(svg) {
        this.top = svg.symbol();
        this.top.polygon(
            `0,${this.baseSize / 4} ${this.baseSize / 2},0 ${this.baseSize},${this.baseSize / 4} ${
                this.baseSize / 2
            },${this.baseSize / 2}`
        );  

        this.left = svg.symbol();
        this.left.polygon(
            `0,${this.baseSize / 4} ${this.baseSize / 2},${this.baseSize / 2} ${this.baseSize / 2},${
                this.baseSize / 2 + this.baseSize / 2
            } 0,${this.baseSize / 4 + this.baseSize / 2}`
        );

        this.right = svg.symbol();
        this.right.polygon(
            `${this.baseSize / 2},${this.baseSize / 2} ${this.baseSize},${this.baseSize / 4} ${this.baseSize},${
                this.baseSize / 4 + this.baseSize / 2
            } ${this.baseSize / 2},${this.baseSize / 2 + this.baseSize / 2}`
        );
    }

    mouseMoveHandler(evt) {
        this.ghostWrapper.clear();
        if (this.currentTool === 'draw') {
            this.refPoint.x = evt.clientX;
            this.refPoint.y = evt.clientY;

            const point = this.refPoint.matrixTransform(this.svgEl.getScreenCTM().inverse());
            this.points.push({ x: point.x, y: point.y });

            const griddedX =
                Math.round(point.x / (this.baseSize / this.gridDivider)) * (this.baseSize / this.gridDivider);
            const griddedY =
                Math.round(point.y / (this.baseSize / this.gridDivider)) * (this.baseSize / this.gridDivider);

            if (this.currentCube !== 'no-top') {
                this.ghostWrapper
                    .use(this.top)
                    .cx(griddedX)
                    .cy(griddedY)
                    .fill(this.currentColor)
                    .opacity(0.5);
            }

            if (this.currentCube !== 'no-left') {
                this.ghostWrapper
                    .use(this.left)
                    .cx(griddedX)
                    .cy(griddedY)
                    .fill(this.lightColor)
                    .opacity(0.5);
            }

            if (this.currentCube !== 'no-right') {
                this.ghostWrapper
                    .use(this.right)
                    .cx(griddedX)
                    .cy(griddedY)
                    .fill(this.darkColor)
                    .opacity(0.5);
            }
        }
    }

    clickHandler(evt) {
        if (this.currentTool === 'draw') {
            const lightColor = chroma(this.currentColor).brighten().hex();
            const darkColor = chroma(this.currentColor).darken().hex();

            this.refPoint.x = evt.clientX;
            this.refPoint.y = evt.clientY;

            const point = this.refPoint.matrixTransform(this.svgEl.getScreenCTM().inverse());
            this.points.push({ x: point.x, y: point.y });

            const griddedX =
                Math.round(point.x / (this.baseSize / this.gridDivider)) * (this.baseSize / this.gridDivider);
            const griddedY =
                Math.round(point.y / (this.baseSize / this.gridDivider)) * (this.baseSize / this.gridDivider);

            let wrapper = this.superWrapper.group();
            if (this.currentCube !== 'no-top') {
                wrapper.use(this.top).cx(griddedX).cy(griddedY).fill(this.currentColor);
            }
            if (this.currentCube !== 'no-left') {
                wrapper.use(this.left).cx(griddedX).cy(griddedY).fill(lightColor);
            }
            if (this.currentCube !== 'no-right') {
                wrapper.use(this.right).cx(griddedX).cy(griddedY).fill(darkColor);
            }

            wrapper.click((evt) => {
                if (this.currentTool === 'erase') {
                    evt.preventDefault();
                    evt.stopPropagation();
                    wrapper.remove();
                }
            });

            wrapper.mousemove((evt) => {
                if(this.currentTool === 'erase') {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if(evt.buttons === 1) {
                        wrapper.remove();
                    }
                }
            });

            if (this.drawingOrder === 'behind') {
                this.superWrapper.add(wrapper, 0);
            } else {
                this.superWrapper.add(wrapper);
            }

            this.allCubes.push(wrapper);
        } 
    }

    setCubeSize(size) {
        this.baseSize = +size;
        this.setSymbols(this.svg);
    }

    setCurrentColor(color) {
        this.currentColor = color;
        this.lightColor = chroma(this.currentColor).brighten().hex();
        this.darkColor = chroma(this.currentColor).darken().hex();
        // set color input to current color
        this.shadowRoot.querySelector('#color').value = this.currentColor;
    }

    setCurrentTool(tool) {
        this.currentTool = tool;
    }

    setCurrentCube(cube) {
        this.currentCube = cube;
    }

    setRandomColor() {
        const hue = Math.round(Math.random() * 360);
        const sat = Math.round(Math.random() * 100);
        const lightness = Math.round(Math.random() * 100);
        var hex = chroma(`hsl(${hue}, ${sat}%, ${lightness}%)`).hex();

        this.setCurrentColor(hex);
        return this.currentColor;
    }

    nudge(x = 0, y = 0) {
        if (this.allCubes.length) {
            this.allCubes.forEach((cube) => {
                const translateX = cube.transform().translateX + x;
                const translateY = cube.transform().translateY + y;
                cube.attr('transform', `translate(${translateX} ${translateY})`);
            });
        }
    }

    undo() {
        if (this.allCubes.length) {
            this.allCubes[this.allCubes.length - 1].remove();
            this.allCubes.pop();
        }
        return !!this.allCubes.length;
    }

    clear() {
        this.svg.clear();
        this.setSymbols(this.svg);
        this.superWrapper = this.svg.group().attr('shape-rendering', 'crispEdges');
        this.ghostWrapper = this.svg.group();
        this.currentTool = 'draw';
        this.allCubes = [];
    }

    updateRatio(ratio) {
        if (ratio === '1:1') {
            this.width = 800;
            this.height = 800;
        } else if (ratio === '4:5') {
            this.width = 640;
            this.height = 800;
        } else {
            this.width = 1422;
            this.height = 800;
        }
        this.svg.size(this.width, this.height).viewbox(0, 0, this.width, this.height);
    }

    copy(el) {
        this.svgEl.removeAttribute('id');
        const svgMarkup = this.svg.svg();
        this.svg.attr('id', 'iiisometric');
        this.copyTextToClipboard(svgMarkup, el);
    }

    svg2png(svgElement) {
        return new Promise((resolve, reject) => {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const img = new Image();
            const canvas = document.createElement("canvas");

            canvas.width = svgElement.width.baseVal.value;
            canvas.height = svgElement.height.baseVal.value;
            const ctx = canvas.getContext("2d");

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const pngData = canvas.toDataURL("image/png");
                resolve(pngData);
            };

            img.onerror = reject;
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        });
    }

    exportPNG() {
        this.svgEl.removeAttribute('id');
        return this.svg2png(this.svgEl);
    }

    exportSVG() {
        this.svgEl.removeAttribute('id');
        const svgMarkup = this.svg.svg();
        this.svg.attr('id', 'iiisometric');
        const svgBlob = new Blob([svgMarkup], {
            type: 'text/plain;charset=utf-8',
        });
        return svgBlob;
    }

    copyTextToClipboard(text, el) {
        navigator.clipboard.writeText(text).then(
            function () {
                const originalText = el.innerHTML;
                el.classList.add('bounce');
                el.innerHTML = `<svg class="inline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span class="hidden sm:inline">copied!</span>`;

                setTimeout(() => {
                    el.classList.remove('bounce');
                    el.innerHTML = originalText;
                }, 1500);
            },
            function (err) {
                console.error('Async: Could not copy text: ', err);
            }
        );
    }

    setOpacity(value) {
        this.svg.opacity(value);
    }

    activateControls = () => {
        this.shadowRoot.querySelector('#clear').addEventListener('click', () => this.clear());
        this.shadowRoot.querySelector('#undo').addEventListener('click', () => this.undo());
        this.shadowRoot.querySelector('#random-color').addEventListener('click', () => this.setRandomColor());
        this.shadowRoot.querySelector('#copy').addEventListener('click', () => this.copy(this.shadowRoot.querySelector('#copy')));
        this.shadowRoot.querySelector('#download').addEventListener('click', () => this.download(this.shadowRoot.querySelector('#download')));
        this.shadowRoot.querySelector('#opacity').addEventListener('input', (e) => this.setOpacity(e.target.value));
        this.shadowRoot.querySelector('#cube-size').addEventListener('input', (e) => this.setCubeSize(e.target.value));
        this.shadowRoot.querySelector('#color').addEventListener('input', (e) => this.setCurrentColor(e.target.value));
        this.shadowRoot.querySelector('#drawing-order').addEventListener('change', (e) => this.drawingOrder = e.target.value);
        this.shadowRoot.querySelector('#draw').addEventListener('click', () => this.setCurrentTool('draw'));
        this.shadowRoot.querySelector('#erase').addEventListener('click', () => this.setCurrentTool('erase'));
    }

    continuousDrawingWhileMouseDown() {
        this.svg.mousemove((evt) => {
            if (evt.buttons === 1) {
                this.clickHandler(evt);
            }
        });
    }

    drawingModeBehind() {
        this.drawingOrder = 'behind';
    }
    drawingModeFront() {
        this.drawingOrder = 'front';
    }
}

customElements.define('isometric-drawing', IsometricDrawing);
