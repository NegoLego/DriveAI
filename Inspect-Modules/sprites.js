function drawArrow(ctx) {
    ctx.lineWidth = 2.5;
    ctx.scale(0.9, 0.9);
    ctx.moveTo(17, 8);
    ctx.lineTo(17, 27);
    ctx.lineTo(7, 27);
    ctx.lineTo(24.5, 44);
    ctx.lineTo(42, 27);
    ctx.lineTo(32, 27);
    ctx.lineTo(32, 8);
    ctx.lineTo(17, 8);
    ctx.stroke();
}

function getDownArrow(color) {
    const canvas = new OffscreenCanvas(50, 50);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    drawArrow(ctx);
    return canvas;
}
function getUpArrow(color) {
    const canvas = new OffscreenCanvas(50, 50);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.rotate(Math.PI);
    ctx.translate(-50, -50);
    drawArrow(ctx);
    return canvas;
}
function getLeftArrow(color) {
    const canvas = new OffscreenCanvas(50, 50);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.rotate(Math.PI / 2);
    ctx.translate(0, -50);
    drawArrow(ctx);
    return canvas;
}
function getRightArrow(color) {
    const canvas = new OffscreenCanvas(50, 50);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-50, 0);
    drawArrow(ctx);
    return canvas;
}

const colors = {white:'rgb(220,220,220)', grey:'rgb(50,50,50)'}
const whiteDownArrow = getDownArrow(colors.white);
const whiteUpArrow = getUpArrow(colors.white);
const whiteLeftArrow = getLeftArrow(colors.white);
const whiteRightArrow = getRightArrow(colors.white);

const greyDownArrow = getDownArrow(colors.grey);
const greyUpArrow = getUpArrow(colors.grey);
const greyLeftArrow = getLeftArrow(colors.grey);
const greyRightArrow = getRightArrow(colors.grey);

export { whiteDownArrow, whiteUpArrow, whiteLeftArrow, whiteRightArrow, greyDownArrow, greyUpArrow, greyLeftArrow, greyRightArrow };