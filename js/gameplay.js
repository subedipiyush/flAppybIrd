class Gameplay {
    static ManualMode(canvas) {
        return new ManualGamePlay(canvas);
    }

    static BotMode(canvas) {
        return new BotGamePlay(canvas);
    }
}

class ManualGamePlay {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    
        this.game = undefined;
        this.bird = undefined;
        this.path = undefined;
        this.controller = undefined;
        this.scorecard = undefined;
    }

    LoadGame() {
        this.bird = new Bird();
        this.scorecard = new ScoreCard();
        this.controller = new BirdController(this.bird);
        this.path = new Path(this.canvas);
        this.game = new Game(this.canvas, this.bird, this.path);

        this.Render();
    }

    Render() {
        this.path.Render(this.ctx);
        this.bird.Render(this.ctx);
    }

    Start() {
        if (this.game.IsRunning() == true) {
            return;
        }
        if (this.game.ended == true) {
            this.Reset();
        }
        this.controller.StartControl();
        this.path.BeginMoving();
        this.game.Start();
    }

    Reset() {
        this.LoadGame();
    }

    Update() {
        this.Render();
        if (this.game.IsRunning() == true) {
            this.scorecard.Update();
            this.controller.Update();
            this.path.Update();
            this.game.Update();
        } else {
            this.controller.StopControl();
            this.path.StopMoving();
        }
    }

    Ended() {
        return this.game.ended;
    }

    Score() {
        return this.scorecard.score;
    }
}

class BotGamePlay {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    
        this.game = undefined;
        this.bird = undefined;
        this.sensor = undefined;
        this.path = undefined;
        this.controller = undefined;
        this.scorecard = undefined;
    }

    LoadGame() {
        this.bird = new Bird();
        this.sensor = new Sensor(this.bird);
        this.scorecard = new ScoreCard();
        this.controller = new BirdController(this.bird);
        this.path = new Path(this.canvas);
        this.game = new Game(this.canvas, this.bird, this.path);

        this.Render();
    }

    Render() {
        this.path.Render(this.ctx);
        this.bird.Render(this.ctx);
        this.sensor.Render(this.ctx);
    }

    Start() {
        if (this.game.IsRunning() == true) {
            return;
        }
        if (this.game.ended == true) {
            this.Reset();
        }
        this.takeControl(); // Prevents user key presses;
        this.controller.StartControl();
        this.path.BeginMoving();
        this.game.Start();
    }

    Reset() {
        this.LoadGame();
    }

    Update() {
        this.Render();
        if (this.game.IsRunning() == true) {
            this.scorecard.Update();
            this.controller.Update();
            this.path.Update();
            this.sensor.Update(this.path);
            this.game.Update();
            this.appleNextMove();
        } else {
            this.controller.StopControl();
            this.path.StopMoving();
        }
    }

    Ended() {
        return this.game.ended;
    }

    Score() {
        return this.scorecard.score;
    }

    takeControl() {
        addKeyboardListener("ArrowUp", (event) => {
            if (event.sender != "bot") {
                event.stopImmediatePropagation();
                return;
            }
        });
        addKeyboardListener("ArrowDown", (event) => {
            if (event.sender != "bot") {
                event.stopImmediatePropagation();
                return;
            }
        });
    }

    appleNextMove() {
        const offsets = this.sensor.Readings().map((r) => r.offset);
    
        if (offsets[0] == 0 && offsets[1] == 0 && offsets[2] == 0 && offsets[3] == 0) {
            return;
        }

        const top2 = [offsets[3], offsets[2]];
        const bottom2 = [offsets[1], offsets[0]];

        const weights = [0.3, 0.6, 0.3, 0.6];
        const favorBottom = top2[0]*weights[0] + top2[1]*weights[1];
        const favorTop = bottom2[0]*weights[2] + bottom2[1]*weights[3];
    
        // const bias = 0.15;

        if (favorTop > favorBottom) {
            this.simulateKeyPress("ArrowUp");
        } else if (favorBottom > favorTop) {
            this.simulateKeyPress("ArrowDown");
        }
    }

    simulateKeyPress(key) {
        const k = new KeyboardEvent("keydown", { key: key });
        k.sender = "bot";
        document.dispatchEvent(k);
    }
}