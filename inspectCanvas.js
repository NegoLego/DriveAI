import {inspectCanvas} from "./canvasManager.js";
import { NeuralNetworkRepr } from "./Inspect-Modules/NeuralNetworkRepr.js";

let nnr = null;
let alreadySet = false;

inspectCanvas.setNN = function (nn){
    nnr = new NeuralNetworkRepr(nn);
    if(!alreadySet) loop();
    alreadySet = true;
}

function loop() {
    nnr.draw(inspectCanvas['nodes']);
    requestAnimationFrame(loop);
}

export { inspectCanvas };