import {controlCanvas} from "./canvasManager.js";
import * as controlElements from "./Control-Modules/controlElements.js";
import colors from "./Control-Modules/colors.js";
import HoverManager from "./Control-Modules/hoverManager.js";

let elements = [];
let title = new controlElements.PlainText('Controls', 250, 40, 40, colors.blue);
let text1 = new controlElements.PlainText('Car count:', 110, 126, 18, colors.lightblue);
let text2 = new controlElements.PlainText('Activation func:', 95, 216, 18, colors.lightblue);
let text3 = new controlElements.PlainText('Mutation Term:', 90, 306, 18, colors.lightblue);
let button1 = new controlElements.Button(36, 710, 95, 50, colors.lightblue, 'Start!', 'white');
let button2 = new controlElements.Button(156, 710, 95, 50, colors.lightblue, 'Stop!', 'white');
let button3 = new controlElements.Button(330, 710, 130, 50, colors.lightblue, 'Next Gen...', 'white');
let button4 = new controlElements.Button(36, 600, 130, 50, colors.lightblue, 'Track2', 'white');
let slider1 = new controlElements.Slider(210, 306, 160, colors.blue, colors.lightblue, '0', '100');

let ddm1 = new controlElements.DropDownMenu(200, 110, 140, 32, colors.lightblue,
    ['50', '100', '200', '500', '800'], 'white');
let ddm2 = new controlElements.DropDownMenu(200, 200, 140, 32, colors.lightblue,
    ['ReLU', 'sigmoid', 'crazyReLU'], 'white');

elements.push(title, text1, text2, text3, button1, button2, button3, button4, ddm1, ddm2);
elements.forEach(i => i.draw(controlCanvas['buttons']));
slider1.draw(controlCanvas['background']);
slider1.button.draw(controlCanvas['buttons']);

let hoverManager = new HoverManager(controlCanvas['buttons'], controlCanvas['effects'], controlCanvas['auxiliary']);
let mouseIsDown = false;
controlCanvas['effects'].canvas.addEventListener('mousemove', (e) => {
    if(mouseIsDown) hoverManager.checkDrag(e.clientX, e.clientY);
    else hoverManager.checkHover(e.clientX, e.clientY);
    controlCanvas.mutationTerm = slider1.value;
});
controlCanvas['effects'].canvas.addEventListener('click', (e) => {
    hoverManager.checkClick(e.clientX, e.clientY);
    controlCanvas.carCount = Number.parseInt(ddm1.currentOption, 10);
});
controlCanvas['effects'].canvas.addEventListener('mousedown', (e) => {
    mouseIsDown = true;
});
controlCanvas['effects'].canvas.addEventListener('mouseup', (e) => {
    mouseIsDown = false;
    hoverManager.stopDrag();
});
hoverManager.pushShape(button1, button2, button3, ddm1, ddm2, button4, slider1.button);

controlCanvas.startButton = button1;
controlCanvas.stopButton = button2;
controlCanvas.carCount = Number.parseInt(ddm1.currentOption, 10);
controlCanvas.mutationTerm = slider1.value;
controlCanvas.nextGenButton = button3;
controlCanvas.track2Button = button4;

export { controlCanvas };