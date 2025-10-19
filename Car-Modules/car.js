import { RotateHitbox, Hitbox } from "./hitbox.js";
import {SensorSet} from "./sensors.js";

class Car {
    constructor(x, y, width, height, brain) {
        this.staticProp = {width: width, height: height, maxSpeed:4, acc:0.3, steeringForce:0.005, friction:0.1};
        this.pos = {x:x, y:y, angle:0, speed:0};
        this.input = {forward:false, backward:false, left:false, right:false};
        this.status = {isCrashed:false, isFocused:false};
        this.hitbox = new RotateHitbox(this);
        this.brain = brain;
        this.sensorSet = new SensorSet(5, Math.PI / 2, 300, this);
        this.environment = {obstacles:[]};
    }
    update() {
        if(this.status.isCrashed) return;
        this.updatePos(this.input, this.pos);
        this.hitbox.update();
        this.checkCollision();
        this.sensorSet.update();
        this.giveInputs();
        this.brain.update();
        this.getInputs();
    }
    updatePos(input, pos) {
        if(input.forward) pos.speed += this.staticProp.acc;
        if(input.backward) pos.speed -= this.staticProp.acc;
        if(Math.abs(pos.speed) <= this.staticProp.friction) pos.speed = 0;
        else if (pos.speed > 0) pos.speed -= this.staticProp.friction;
        else pos.speed += this.staticProp.friction;
        if(pos.speed > this.staticProp.maxSpeed) pos.speed = this.staticProp.maxSpeed;
        else if(pos.speed < -this.staticProp.maxSpeed / 2) pos.speed = -this.staticProp.maxSpeed / 2;
        if(input.left) pos.angle -= this.staticProp.steeringForce * pos.speed;
        if(input.right) pos.angle += this.staticProp.steeringForce * pos.speed;
        pos.y -= pos.speed * Math.cos(pos.angle);
        pos.x += pos.speed * Math.sin(pos.angle);
    }
    checkCollision() {
        this.environment.obstacles.forEach(obstacle => {
            if(this.hitbox.isOverlapping(obstacle)) this.status.isCrashed = true
        });
    }
    getInputs() {
        let i = 0;
        for(const name in this.input) {
            this.input[name] = this.brain.output[i] >= 0.5;
            i++;
        }
    }
    giveInputs() {
        this.brain.layers[0].nodes.forEach((node, index) => {
            node.output = this.sensorSet.sensors[index].output;
        });
    }
    draw(ctx) {
        if(this.status.isFocused) this.sensorSet.draw(ctx);
        ctx.beginPath();
        if(this.status.isFocused) ctx.fillStyle = 'rgb(50, 50, 220)'
        else ctx.fillStyle = 'rgb(65, 65, 95)';
        if(this.status.isCrashed) ctx.fillStyle = 'rgb(50, 50, 50)';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.moveTo(this.hitbox.points[0].x, this.hitbox.points[0].y);
        ctx.lineTo(this.hitbox.points[1].x, this.hitbox.points[1].y);
        ctx.lineTo(this.hitbox.points[2].x, this.hitbox.points[2].y);
        ctx.lineTo(this.hitbox.points[3].x, this.hitbox.points[3].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

class NPC {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.hitbox = new Hitbox(this);
    }
    update() {
        this.y -= this.speed;
        this.hitbox.update();
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(190, 30, 30)';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
}

export { Car, NPC};