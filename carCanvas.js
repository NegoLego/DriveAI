import {carCanvas, controlCanvas} from "./canvasManager.js";
import {Road} from "./Car-Modules/road.js";
import {Car, NPC} from "./Car-Modules/car.js";
import {StaticHitbox} from "./Car-Modules/hitbox.js";
import { NeuralNetwork } from "./Car-Modules/neuralNetwork.js";
import { track1 } from "./Car-Modules/tracks.js";
import { distance } from "./General-Modules/math.js";

let gameState = 0; const startY = 600;
let road = null;
let brain = null;
let prevBrain = null;
let npcs = [];
let cars = [];
let currTrack;

function initNpcs() {
    npcs = [];
    for(let npc of track1.npcs) {
        npcs.push(new NPC(npc.x, npc.y, 75, 110, 2));
    }
}

function init(carCount, mutationTerm, track) {
    currTrack = track;
    stopSelectScreen();
    road = new Road(carCanvas['road'], carCanvas['cars']);
    if(!brain) brain = new NeuralNetwork(5, 3, 4);
    prevBrain = brain;
    initNpcs();
    cars = [];
    for(let i = 0; i < carCount; i++) {
        const car = new Car(250, startY, 71, 110, brain.mutate(mutationTerm));
        car.environment.obstacles.push(new StaticHitbox(38, -10000, 42, 800), new StaticHitbox(458, -10000, 462, 800));
        npcs.forEach(npc => car.environment.obstacles.push(npc.hitbox));
        cars.push(car);
    }
    road.elems.push(...npcs, ...cars);
}

carCanvas.preview = function (){
    init(1, 0, track1);
    play();
    brain = null;
}

carCanvas.nextGen = function (track) {
    gameState = 0;
    init(1, 0, track);
    play();
    carCanvas['overlay'].canvas.width = carCanvas['overlay'].canvas.width;
}

carCanvas.repeatGen = function (track) {
    brain = prevBrain;
    carCanvas.nextGen(track);
}

carCanvas.start = function (carCount, mutationTerm, track) {
    if(gameState === 1) return;
    gameState = 1;
    init(carCount, mutationTerm, track);
    play(carCount);
    console.log(`carCount: ${carCount}, mutationTermen: ${mutationTerm}, track: ${track}`);
}

function play(carCount) {
    npcs.forEach(npc => npc.update());
    let crashedCount = 0;
    let focusedCar = cars[0];
    cars.forEach(car => {
        car.update();
        if(car.status.isCrashed) crashedCount++;
        if(car.pos.y < focusedCar.pos.y) focusedCar = car;
    });
    if(crashedCount === carCount) gameState = 2;
    road.progress = focusedCar.pos.y - startY;
    focusedCar.status.isFocused = true;
    road.focused = focusedCar;
    road.draw();
    focusedCar.status.isFocused = false;
    carCanvas.mainCar = focusedCar;
    brain = focusedCar.brain;
    if(gameState === 1) requestAnimationFrame(play);
    else if(gameState === 2) carCanvas.stop();
}

function pendingScreen () {
    const ctx = carCanvas['overlay'];
    ctx.canvas.width = ctx.canvas.width;
    ctx.fillStyle = 'rgb(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.font = 'bold 26px verdana';
    ctx.fillText('Pending...', 65, 710);
}

carCanvas.stop = function () {
    pendingScreen();
    gameState = 0;
    startSelectCar();
}

function startSelectCar() {
    let selectedCar = null;
    carCanvas['overlay'].canvas.onmousemove = function (e) {
        const bb = carCanvas['overlay'].canvas.bb;
        const x = e.clientX - bb.left, y = e.clientY - bb.top;
        let minDist = 5000;
        cars.forEach(car => {
            const dist = distance({x:x, y:y}, {x:car.pos.x, y:car.pos.y - road.progress});
            if(dist < minDist) {
                selectedCar = car;
                minDist = dist;
            }
        });
        pendingScreen();
        carCanvas['overlay'].translate(0, -road.progress);
        selectedCar.draw(carCanvas['overlay']);
        carCanvas['overlay'].translate(0, road.progress);
    }
    carCanvas['overlay'].canvas.onclick = function () {
        brain = selectedCar.brain;
        carCanvas.nextGen(currTrack);
    }
}
function stopSelectScreen() {
    carCanvas['overlay'].canvas.onmousemove = null;
    carCanvas['overlay'].canvas.onclick = null;
}
export { carCanvas };