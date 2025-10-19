import { controlCanvas } from "./controlCanvas.js"
import { carCanvas } from "./carCanvas.js";
import {inspectCanvas} from "./inspectCanvas.js"
import { track1, track2 } from "./Car-Modules/tracks.js";

carCanvas.preview();

let track = track1;

controlCanvas.startButton.onClick = () => carCanvas.start(controlCanvas.carCount, controlCanvas.mutationTerm, track);
controlCanvas.stopButton.onClick = carCanvas.stop;
controlCanvas.nextGenButton.onClick = () => carCanvas.nextGen(track);
controlCanvas.track2Button.onClick = () => {
    track = track2;
    carCanvas.nextGen(track);
}
//controlCanvas.repeatGenButton.onClick = () => carCanvas.repeatGen(track);

let showedCar = carCanvas.mainCar;
inspectCanvas.setNN(showedCar.brain);

(function loop() {
    if(showedCar != carCanvas.mainCar) {
        showedCar = carCanvas.mainCar;
        inspectCanvas.setNN(showedCar.brain);
    }
    requestAnimationFrame(loop);
})();


/*(function goLog() {
    setInterval(() => console.log(controlCanvas.mutationTerm), 500);
})();*/