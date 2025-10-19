const generatedColors = [];
function getRandomColor() {
    function randomNumber() {
        return Math.floor(Math.random() * 255);
    }
    let color = `rgb(${randomNumber()},${randomNumber()},${randomNumber()})`;
    while (generatedColors[color]) color = getRandomColor();
    generatedColors[color] = true;
    return color;
}

class Shape {
    constructor(target) {
        this.target = target;
        this.color = getRandomColor();
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        this.target.drawShape(ctx);
    }
}

class HoverManager {
    constructor(sourceCtx, hoverCtx, clickCtx) {
        this.shapes = [];
        this.colorShapeDict = {};
        this.sourceCtx = sourceCtx;
        this.canvas = new OffscreenCanvas(sourceCtx.canvas.width, sourceCtx.canvas.height);
        this.ctx = this.canvas.getContext('2d', {willReadFrequently: false});
        this.hoverCanvas = hoverCtx.canvas;
        this.hoverCtx = hoverCtx;
        this.clickCanvas = clickCtx.canvas;
        this.clickCtx = clickCtx;
        this.toPop = 0;
        this.hasToPop = true;
        this.top = sourceCtx.canvas.getBoundingClientRect().top;
        this.left = sourceCtx.canvas.getBoundingClientRect().left;
        this.draggingElem = null;
    }
    pushShape(...elems) {
        for(const elem of elems) {
            const shape = new Shape(elem);
            this.shapes.push(shape);
            this.colorShapeDict[shape.color] = shape; 
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.shapes.forEach(shape => shape.draw(this.ctx));
    }
    pop() {
        this.shapes.length -= this.toPop;
        this.toPop = 0;
        this.pushShape();
    }
    getTarget(x, y) {
        const imgData = this.ctx.getImageData(x, y, 1, 1);
        const color = `rgb(${imgData.data[0]},${imgData.data[1]},${imgData.data[2]})`;
        if(this.colorShapeDict[color]) return this.colorShapeDict[color].target;
        else return null;
    }
    checkHover(x, y) {
        x -= this.left; y -= this.top;
        this.hoverCtx.clearRect(0, 0, this.hoverCanvas.width, this.hoverCanvas.height);
        const target = this.getTarget(x, y);
        if(target && target.onHover) target.onHover(this.hoverCtx);
    }
    checkClick(x, y) {
        this.hasToPop = true;
        x-= this.left; y-= this.top;
        this.clickCtx.clearRect(0, 0, this.clickCanvas.width, this.clickCanvas.height);
        const target = this.getTarget(x, y);
        if(target && target.onClick) target.onClick(this.clickCtx, this);
        if(this.hasToPop) this.pop();
        this.checkHover(x + this.left, y + this.top);
    }
    checkDrag(x, y) {
        x -= this.left; y -= this.top;
        if(this.draggingElem) {
            this.draggingElem.onDrag(x, y);
            this.canvas.width = this.canvas.width;
            this.shapes.forEach(shape => shape.draw(this.ctx));
            return;
        }
        const target = this.getTarget(x, y);
        if(target && target.onDrag) {
            target.onDrag(x, y);
            this.draggingElem = target;
        }
    }
    stopDrag() {
        this.draggingElem = null;
    }
}

export  default HoverManager;
