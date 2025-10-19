class Road {
    constructor(roadCtx, elemsCtx) {
        this.roadCtx = roadCtx;
        this.elemsCtx = elemsCtx;
        this.elems = [];
        this.progress = 0;
        this.focused = null;
    }
    draw() {
        this.drawRoad(this.roadCtx);
        this.drawElems(this.elemsCtx);
    }
    drawRoad(ctx) {
        ctx.canvas.width = ctx.canvas.width;
        ctx.translate(0, -(this.progress % 65));
        ctx.fillStyle = 'gray';
        ctx.fillRect(40, -65, 420, 865);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgb(40,40,50)';
        ctx.beginPath();
        ctx.moveTo(40, -65); ctx.lineTo(40, 800);
        ctx.moveTo(460, -65); ctx.lineTo(460, 800);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white'
        ctx.beginPath();
        ctx.setLineDash([35, 30]);
        ctx.moveTo(180, -65); ctx.lineTo(180, 800);
        ctx.moveTo(320, -65); ctx.lineTo(320, 800);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.translate(0, this.progress % 65);
    }
    drawElems(ctx) {
        ctx.canvas.width = ctx.canvas.width;
        ctx.translate(0, -this.progress);
        this.elems.forEach(elem => elem.draw(ctx));
        this.focused.draw(ctx);
        ctx.translate(0, this.progress);
    }
}

export { Road };