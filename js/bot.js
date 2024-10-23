class Bots {
    static ForGames(games, baseNet) {
        // Mutate nets from baseNet.
        const bots = games.games.flatMap((g, idx) => {
            // Let's keep the original model as well.
            if (idx == 0) {
                return new Bot(g, baseNet);
            }
            return new Bot(g, baseNet.clone().mutate());
        });
        return bots;
    }

    static FindModelWithScore(bots, score) {
        return bots.find(b => b.game.Score() == score).net;
    }
}

class Bot {
    constructor(game, net) {
        this.game = game;
        this.net = net;
    }

    NextMove(readings) {
        const outputs = this.net.FeedForward(readings.map((r) => 1-r.offset));
        
        const keys = ["ArrowUp", "None", "ArrowDown"];
        const maxValue = Math.max(...outputs)
        return keys[outputs.findIndex((v) => v == maxValue)];
    }

    UpdateModel() {
        const gap = this.game.collisionFrame.Gap();
        const birdPostion = new Point(this.game.bird.x, this.game.bird.y);

        const cost = gap.y - birdPosition.y;
        // if cose < 1, first output neuron should have been lit,
        // if cost > 1, third output neuron should have been lit,
        // second output neuron should be updated based on the magnitude of cost;
        // if very high, second output neuron should not have been triggered,
        // if relatively low (<=5), little bit of neutrality on the path was required.
        // BACKPROPAGATE this information.
    }
}

class GameNetwork extends NN {
    constructor() {
        super();
    }

    FeedForward(inputs) {
        const outputLayer = super.FeedForward(inputs);
        return outputLayer.neurons.map((n) => n.value);
    }

    static Deserialize(serialized) {
        const n = NN.Deserialize(serialized);
        let g = new GameNetwork();
        g.layers = n.layers;
        return g;
    }

    clone() {
        return GameNetwork.Deserialize(this.Serialize());
    }

    mutate() {
        // Change weights random by random epsilon.
        for (let i=1; i < this.layers.length; i++) {
            const layer = this.layers[i];
            layer.neurons.forEach(n => {
                if (randomEvent() == false) {
                    n.bias += random(-0.3, 0.3);
                }
                n.links.forEach((l) => {
                    if (randomEvent() == false) {
                        return
                    }
                    l.weight += random(-0.5, 0.5);
                });
            });
        }
        return this;
    }
}

function MakeGameNetwork() {
    const nn = new GameNetwork();

    // Let's start with 3 layers for now.
    // Layer 1: 3 neurons, Layer 2: 4 neurons, Layer 3: 3 neurons.
    nn.AddLayer(new Layer(neurons(3)))
        .AddLayer(new Layer(neurons(4)))
        .AddLayer(new Layer(neurons(3)));

    // Each neuron is connected to every other neuron in the connected layer.
    for (var i=1; i < nn.layers.length; i++) {
        nn.layers[i].neurons.forEach((n1) => nn.layers[i-1].neurons.forEach((n2) => n1.Link(n2)));
    }
 
    makeItDumb(nn);

    return nn;
}

function neurons(count) {
    let ns = [];
    for (let i=0; i < count; i++) {
        ns = ns.concat(new Neuron(i));
    }
    return ns;
}

// Assigns random weights and biases to the network.
function makeItDumb(nn) {
    nn.layers.forEach((l) => l.neurons.forEach(function(n) {
        n.bias = random(-1, 1);
        n.links.forEach((link) => link.weight = random(-1,1));
    }));
}