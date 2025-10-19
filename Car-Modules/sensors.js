import {getIntersection, lerp} from "../General-Modules/math.js";

function point(x, y) {
    return {x: x, y: y};
}

class Sensor {
    constructor(angle, length, parent) {
        this.parent = parent;
        this.obstacles = null;
        this.angleOffset = angle;
        this.length = length;
        this.output = 1;
        this.updatePos();
    }
    updateVal() {
        this.obstacles = this.parent.environment.obstacles;
        this.output = 1;
        const A = point(this.x, this.y);
        const B = point(this.endX, this.endY)
        this.obstacles.forEach(ob => {
            if(ob.y1 > B.y || ob.y2 > B.y){
            const points = [point(ob.x1, ob.y1), point(ob.x1, ob.y2), point(ob.x2, ob.y2), point(ob.x2, ob.y1)];
            this.output = Math.min(this.output, getIntersection(A, B, points[0], points[1]).t);
            this.output = Math.min(this.output, getIntersection(A, B, points[1], points[2]).t);
            this.output = Math.min(this.output, getIntersection(A, B, points[2], points[3]).t);
            this.output = Math.min(this.output, getIntersection(A, B, points[3], points[0]).t);
            }
        });
    }
    updatePos() {
        this.x = this.parent.pos.x;
        this.y = this.parent.pos.y;
        this.angle = this.parent.pos.angle + this.angleOffset;
        this.endX = this.parent.pos.x + Math.cos(this.angle) * this.length;
        this.endY = this.parent.pos.y + Math.sin(this.angle) * this.length;
    }
    update() {
        this.updatePos();
        this.updateVal();
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgb(18,18,18)';
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(lerp(this.x, this.endX, this.output), lerp(this.y, this.endY, this.output));
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgb(220,220,50)';
        ctx.stroke();
    }
}

class SensorSet {
    constructor(nr, spread, length, parent){
        this.parent = parent;
        const step = spread / (nr - 1);
        this.sensors = Array.from({length:nr}, (_, i) =>
            new Sensor(parent.pos.angle - Math.PI / 2 - spread / 2 + i * step, length, this.parent));
    }
    update() {
        this.sensors.forEach(sensor => sensor.update());
    }
    draw(ctx) {
        this.sensors.forEach(sensor => sensor.draw(ctx));
    }
}

export {SensorSet};