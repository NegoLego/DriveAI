import CanvasStack from './Control-Modules/canvasStack.js';
import colors from './Control-Modules/colors.js';

const controlCanvas = new CanvasStack('background', 'buttons', 'auxiliary', 'effects');
controlCanvas.appendTo(document.getElementById('controlBox'));
controlCanvas.init = function() {
    this.background.fillStyle = colors.background;
    this.background.fillRect(0, 0, this.background.canvas.width, this.background.canvas.height);
}

const carCanvas = new CanvasStack('background', 'road', 'cars', 'overlay');
carCanvas.appendTo(document.getElementById('carBox'));
carCanvas.background.fillStyle = 'rgb(178 178 180)';
carCanvas.background.fillRect(0, 0, carCanvas.background.canvas.width, carCanvas.background.canvas.height);
carCanvas['overlay'].canvas.bb = carCanvas['overlay'].canvas.getBoundingClientRect();

const inspectCanvas = new CanvasStack('background', 'nodes');
inspectCanvas.appendTo(document.getElementById('nnBox'));
inspectCanvas.init = function () {
    this.background.fillStyle = colors.background;
    this.background.fillRect(0, 0, this.background.canvas.width, this.background.canvas.height);
}

inspectCanvas.init();
controlCanvas.init();


export { carCanvas, inspectCanvas, controlCanvas };