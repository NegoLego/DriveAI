import * as sprites from './sprites.js';
const blueRGB = '25,100,190';

class Circle {
    constructor(x, y, radius, bind) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.bind = bind;
    }
    draw(ctx) {
        ctx.beginPath();
        let alpha1, alpha2;
        if(this.bind.output > 0.6){
            alpha1 = 0.7;
            alpha2 = this.bind.output - 0.6;
        }else {
            alpha1 = Math.min(this.bind.output + 0.1, 1);
            alpha2 = 0;
        }
        ctx.fillStyle = `rgb(${blueRGB},${alpha2}`;
        ctx.arc(this.x, this.y, this.radius + 2, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgb(${blueRGB},${alpha1})`;
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Line {
    constructor(circle1, circle2, bindArray, bindIndex) {
        this.circle1 = circle1;
        this.circle2 = circle2;
        this.bindArray = bindArray;
        this.bindIndex = bindIndex;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.circle1.x, this.circle1.y);
        ctx.lineTo(this.circle2.x, this.circle2.y);
        let val = this.bindArray[this.bindIndex];
        val = 1 / (1 + Math.exp(-val));
        let alpha1, alpha2;
        if(val > 0.6){
            alpha1 = 0.6;
            alpha2 = val - 0.6;
        }else {
            alpha1 = val;
            alpha2 = 0;
        }
        ctx.strokeStyle = `rgb(${blueRGB},${alpha2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.strokeStyle = `rgb(${blueRGB},${alpha1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

class NeuralNetworkRepr {
    constructor(nn) {
        const padding = 60, topExtraPadding = 20;
        this.circles = [];
        this.lines = [];
        const layerCnt = nn.layers.length;
        const maxNodeCnt = (function(nn) {
            let n = 0;
            nn.layers.forEach(layer => {
                n = Math.max(n, layer.nodes.length);
            });
            return n;
        })(nn);

        //set radius, y and yStep
        const radius = -2 + 160 / maxNodeCnt;
        let y = 800 - padding;
        const yStep = (800 - 2 * padding - topExtraPadding) / (layerCnt - 1);
        let prevCircles = null;

        //iterate all nn nodes to build nnr
        nn.layers.forEach(layer => {
            //set x and xStep
            let x, xStep;
            if(prevCircles && prevCircles.length > layer.length) {
                xStep = (500 - 2 * padding) / (layer.length + 1);
                x = padding + xStep;
            }else {
                x = padding;
                xStep = (500 - 2 * padding) / (layer.length - 1);
            }

            const buildingPrevCircles = [];

            //make Circles with right position
            layer.nodes.forEach(node => {
                let newCircle = new Circle(x, y, radius, node);
                this.circles.push(newCircle);
                buildingPrevCircles.push(newCircle);
                if(prevCircles) prevCircles.forEach((prevCircle, index) => {
                    this.lines.push(new Line(prevCircle, newCircle, node.weightedInputs, index));
                });
                x += xStep;
            });

            //setup for next layer
            y -= yStep;
            prevCircles = buildingPrevCircles;
        });
    }
    draw(ctx) {
        ctx.canvas.width = ctx.canvas.width;
        const lastCircles = this.circles.slice(-4);

        if(lastCircles[0].bind.output >= 0.5) upArrow.drawWhite(ctx);
        else upArrow.drawGrey(ctx);

        if(lastCircles[1].bind.output >= 0.5) downArrow.drawWhite(ctx);
        else downArrow.drawGrey(ctx);

        if(lastCircles[2].bind.output >= 0.5) leftArrow.drawWhite(ctx);
        else leftArrow.drawGrey(ctx);

        if(lastCircles[3].bind.output >= 0.5) rightArrow.drawWhite(ctx);
        else rightArrow.drawGrey(ctx);

        this.lines.forEach(line => line.draw(ctx))
        this.circles.forEach(circle => circle.draw(ctx));
    }
}

const upArrow =
    {drawWhite: function(ctx) {ctx.drawImage(sprites.whiteUpArrow, 31, -1);},
    drawGrey: function(ctx) {ctx.drawImage(sprites.greyUpArrow, 31, -1);}}
const downArrow =
    {drawWhite: function(ctx) {ctx.drawImage(sprites.whiteDownArrow, 164, 2);},
    drawGrey: function(ctx) {ctx.drawImage(sprites.greyDownArrow, 164, 2);}}
const leftArrow =
    {drawWhite: function(ctx) {ctx.drawImage(sprites.whiteLeftArrow, 283, 3);},
        drawGrey: function(ctx) {ctx.drawImage(sprites.greyLeftArrow, 283, 3);}}
const rightArrow =
    {drawWhite: function(ctx) {ctx.drawImage(sprites.whiteRightArrow, 416, -3);},
        drawGrey: function(ctx) {ctx.drawImage(sprites.greyRightArrow, 416, -3);}}

export {NeuralNetworkRepr};