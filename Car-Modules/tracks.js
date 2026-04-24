import {NPC} from './Car-Modules/car.js'

const lane = [null, 110, 250, 390];

class Track {
    constructor(...params) {
        this.npcs = [];
        params.forEach(param => this.npcs.push(param));
    }
}

function makeNPC(x, y, speed) {
    return new NPC(x, y, 75, 110, speed);
}

const track1 = new Track(
    makeNPC(lane[2], 100, 2),
    makeNPC(lane[1], -200, 2), makeNPC(lane[3], -200, 2),
    makeNPC(lane[1], -600, 2), makeNPC(lane[2], -600, 2),
    makeNPC(lane[2], -1100, 2), makeNPC(lane[3], -1100, 2),
    makeNPC(lane[1], -1500, 2), makeNPC(lane[2], -1500, 2)
);

const track2 = new Track(
    makeNPC(lane[2], 200, 2), 
    makeNPC(lane[1], -200, 0.7), makeNPC(lane[3], -200, 0.7),
    makeNPC(lane[1], -450, 2), makeNPC(lane[2], -450, 2),
    makeNPC(lane[2], -800, 2), makeNPC(lane[3], -800, 2),    
);

export {track1, track2};