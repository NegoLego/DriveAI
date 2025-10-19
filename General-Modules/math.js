function lerp(a, b, t) {
    return a + (b - a) * t;
}

function getIntersection(A, B, C, D) {
    const top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x) ;
    const top2 = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bot = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    const empty = {x:null, y:null, t:1};
    if(bot === 0) return empty;
    const t = top / bot;
    if(t < 0 || t > 1) return empty;
    const u = top2 / bot;
    if(u < 0 || u > 1) return empty;
    return { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), t: t };
}

function isInside(x, y, x1, y1, x2, y2) {
    return x > x1 && x < x2 && y > y1 && y < y2;
}

function distance(A, B) {
    const dx = A.x - B.x, dy = A.y - B.y;
    return Math.sqrt(dx*dx + dy*dy);
}

export {lerp, getIntersection, isInside, distance};