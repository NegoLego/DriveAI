class Node {
    constructor(inputs) {
        this.inputs = [];
        this.weights = [];
        if(inputs) {
            this.inputs = inputs;
            this.weights = Array.from({length: inputs ? inputs.length : 0}, () => Math.random() * 2 - 1);
            this.weightedInputs = this.inputs.map((input, index) => input.output * this.weights[index]);
            this.bias = Math.random() * 2 - 1;
        }
        this.output = null;
        this.activationFunction = function(x) {
            return 1 / (1 + Math.exp(-x));
        }
    }
    update() {
        this.weightedInputs = this.inputs.map((input, index) => input.output * this.weights[index]);
        this.output = this.weightedInputs.reduce((sum, wInput) => sum + wInput, 0);
        this.output += this.bias;
        this.output = this.activationFunction(this.output);
    }
}

class Layer {
    constructor(nr, prevLayer) {
        this.nodes = Array.from({length:nr}, () => new Node(prevLayer));
        this.length = nr;
    }
    update() {
        this.nodes.forEach(node => node.update());
    }
}

class NeuralNetwork {
    constructor(...params) {
        this.layers = [];
        this.layers.push(new Layer(params[0]));
        params.slice(1).forEach(nr => this.layers.push(new Layer(nr, this.layers.at(-1).nodes)));
    }
    update() {
        this.layers.slice(1).forEach(layer => layer.update());
        this.output = this.layers.at(-1).nodes.map(node => node.output);
    }
    mutate(termen) {
        const newNN = new NeuralNetwork(...this.layers.map(layer => layer.nodes.length));
        this.layers.forEach((layer, layerIndex) => {
            const targetLayer = newNN.layers[layerIndex];
            layer.nodes.forEach((node, nodeIndex) => {
                const targetNode = targetLayer.nodes[nodeIndex];
                targetNode.bias = node.bias + termen * (Math.random() * 2 - 1);
                node.weights.forEach((weight, weightIndex) => {
                    targetNode.weights[weightIndex] = weight + termen * (Math.random() * 2 - 1);
                });
            });
        });
        return newNN;
    }
}

export { NeuralNetwork };