import {lerp} from "../General-Modules/math.js";

class PlainText{
    constructor(text, x, y, fontSize, fontColor) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
    }
    draw(ctx) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.fontColor;
        ctx.font = `bold ${this.fontSize}px verdana`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

class Button {
    constructor(x, y, width, height, color, text, textColor, borderWidth, borderColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.text = text;
        this.textObj = new PlainText(text, this.x + this.width / 2, this.y + this.height / 2, 14, textColor);
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
    }
    onHover(ctx) {
        ctx.fillStyle = 'rgb(255,255,255,0.3)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        if(this.borderWidth) ctx.stroke();
        ctx.fill();
        this.textObj.draw(ctx);
    }
    drawShape(ctx) {
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class DropDownMenu {
    constructor(x, y, width, height, color, options, textColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.buttons = [];
        y = this.y + this.height;
        for(const i of options) {
            const button = new Button(this.x, y, this.width, this.height, 'rgb(50, 50, 54)', i, 'rgb(170, 170, 170)', 1, 'black');
            button.onClick = (x, hoverManager) => {
                this.currentOption = button.text;
                this.draw(hoverManager.sourceCtx);
            }
            this.buttons.push(button);
            y += this.height;
        }
        this.currentOption = this.buttons[0].text;
    }
    onHover(ctx) {
        ctx.fillStyle = 'rgb(255,255,255,0.3)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    onClick(ctx, hoverManager) {
        for(const i of this.buttons) {
            hoverManager.pushShape(i);
            i.draw(ctx);
        }
        hoverManager.toPop = this.buttons.length;
        hoverManager.hasToPop = false;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.moveTo(this.x + this.width - 21, this.y + this.height * 2/5);
        ctx.lineTo(this.x + this.width - 15, this.y + this.height * 3/5);
        ctx.lineTo(this.x + this.width - 9, this.y + this.height * 2/5);
        ctx.stroke();
        new PlainText(this.currentOption, this.x + this.width/2, this.y + this.height/2, 15, 'white').draw(ctx);
    }
    drawShape(ctx) {
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class SliderButton {
    constructor(parent) {
        this.parent = parent;
        this.leftBound = parent.x;
        this.rightBound = parent.x + parent.length;
        this.length = parent.length;
        this.x = this.leftBound + this.length / 2;
        this.y = parent.y;
        this.color = parent.buttonColor;
        this.parent.val = this.x - (this.leftBound) / this.length;
        this.lastCtx = null;
        this.leftIntValue = parent.leftIntValue;
        this.rightIntValue = parent.rightIntValue;
    }
    onHover(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(255,255,255,0.2)';
        ctx.arc(this.x, this.y, 16, 0, 2 * Math.PI);
        ctx.fill();
    }
    onDrag(x) {
        if(x >= this.leftBound && x <= this.rightBound) {
            this.x = x;
            const t = (this.x - this.leftBound) / this.length;
            this.parent.value = lerp(this.leftIntValue, this.rightIntValue, t);
        }
        this.draw(null);
    }
    draw(ctx) {
        if(!ctx) ctx = this.lastCtx;
        this.lastCtx = ctx;
        ctx.clearRect(this.x - 40, this.y - 40, 80, 80);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 16, 0, 2 * Math.PI);
        ctx.fill();
    }
    drawShape(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 16, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Slider {
    constructor(x, y, length, color, buttonColor, leftValue, rightValue) {
        this.x = x;
        this.y = y;    
        this.length = length;
        this.color = color;
        this.buttonColor = buttonColor;
        this.value = 50;
        this.leftIntValue = Number.parseInt(leftValue, 10);
        this.rightIntValue = Number.parseInt(rightValue, 10);
        this.leftObj = new PlainText(leftValue, this.x, this.y - 21, 12, 'white');
        this.rightObj = new PlainText(rightValue, this.x + this.length, this.y - 21, 12, 'white');
        this.button = new SliderButton(this);
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.stroke();
        this.leftObj.draw(ctx);
        this.rightObj.draw(ctx);
    }
}

export { PlainText, Button , DropDownMenu, Slider };