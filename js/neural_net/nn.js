class NN {
    constructor() {
        this.layers = [];
    }

    AddLayer(layer) {
        this.layers = this.layers.concat(layer);
        return this;
    }

    FeedForward(inputs) {
        if (this.layers.length == 0) {
            return
        }
        this.layers[0].ApplyInputs(inputs);
        for (var i=1; i < this.layers.length; i++) {
            this.layers[i].Update();
        }
        return this.layers[this.layers.length-1];
    }
    
    Serialize() {
        return JSON.stringify(this);
    }

    static Deserialize(serialized) {
        let deserialized = JSON.parse(serialized);

        const net = new NN();
        if (deserialized && deserialized.layers) {
            const layers = deserialized.layers.flatMap((l) => {
                if (l.neurons) {
                    const neurons = l.neurons.flatMap((n) => {
                        let neuron = new Neuron(n.index, n.value, n.bias);
                        if (n.links) {
                            neuron.links = n.links.flatMap((nl) => 
                                new Link(new Neuron(nl.peer.index, nl.peer.value, nl.peer.bias), 
                                         nl.weight));    
                        }
                        return neuron;
                    });
                    return new Layer(neurons);
                }
                return new Layer();
            });
            layers.forEach((l) => net.AddLayer(l));
        }

        // Re-link objects.
        net.layers.forEach((layer, idx) => {
            if (idx == 0) {
                return;
            }
            layer.neurons.forEach((neuron) => {
                neuron.links.forEach((nl) => {
                    const falsePeerIdx = nl.peer.index;
                    nl.peer = net.layers[idx-1].neurons[falsePeerIdx];
                });
            });
        });

        return net;
    }
}

class Layer {
    constructor(neurons) {
        this.neurons = neurons;
    }

    ApplyInputs(inputs) {
        if (inputs.length != this.neurons.length) {
            throw new Error(`got ${input.length} inputs to a layer with ${this.neurons.length} neurons`);
        }
        for (var i=0; i < inputs.length; i++) {
            this.neurons[i].value = inputs[i];
        }
    }
    
    Update() {
        for (var i=0; i < this.neurons.length; i++) {
            let sum = 0;
            this.neurons[i].links.forEach((l) => sum += l.peer.value * l.weight);

            const sumWithoutBias = sum - this.neurons[i].bias;
            // Normalize.
            if (sumWithoutBias > 0) {
                this.neurons[i].value = 1/sumWithoutBias;
            } else {
                this.neurons[i].value = 0 + random(0.01,0.02);
            }
        }
    }
}

class Neuron {
    constructor(index, val=0,bias=0) {
        this.index = index;
        this.value = val;
        this.bias = bias;
        this.links = [];
    }

    Link(peer, weight=0.0) {
        this.links = this.links.concat(new Link(peer, weight));
    }
}

class Link {
    constructor(peer, weight) {
        this.peer = peer;
        this.weight = weight;
    }
}