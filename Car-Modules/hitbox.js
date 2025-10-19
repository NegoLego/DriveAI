import { isInside } from "../General-Modules/math.js";

class RotateHitbox {
    constructor(parent) {
        this.parent = parent;
        this.x = parent.pos.x;
        this.y = parent.pos.y;
        this.w = parent.staticProp.width/2;
        this.h = parent.staticProp.height/2;
        this.p1 = {}; this.p2 = {}; this.p3 = {}; this.p4 = {};
        this.points = [this.p1, this.p2, this.p3, this.p4];
        this.angle = parent.pos.angle;
        this.update();
    }
    update() {
        this.angle = this.parent.pos.angle;
        this.x = this.parent.pos.x;
        this.y = this.parent.pos.y;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const wCos = this.w * cos, wSin = this.w * sin;
        const hCos = this.h * cos, hSin = this.h * sin;
        this.p1.x = this.x + wCos - hSin;
        this.p1.y = this.y + wSin + hCos;
        this.p2.x = this.x - wCos - hSin;
        this.p2.y = this.y -wSin + hCos;
        this.p3.x = this.x -wCos + hSin;
        this.p3.y = this.y - wSin - hCos;
        this.p4.x = this.x + wCos + hSin;
        this.p4.y = this.y + wSin - hCos;
    }
    isOverlapping(hb) {
        for(const p of this.points) {
            if(isInside(p.x, p.y, hb.x1, hb.y1, hb.x2, hb.y2 )) return true;
        }
        return false;
    }
}

class Hitbox {
    constructor(parent) {
        this.parent = parent;
        this.update();
    }
    update() {
        this.x1 = this.parent.x - this.parent.width / 2;
        this.y1 = this.parent.y - this.parent.height / 2;
        this.x2 = this.parent.x + this.parent.width / 2;
        this.y2 = this.parent.y + this.parent.height / 2;
    }
}

class StaticHitbox {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
export { RotateHitbox, Hitbox, StaticHitbox};