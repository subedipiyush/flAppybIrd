class Gameplay {
    Init(options) {

        // const birds = Birds.FromConfig(birdConfig);
        // const path = new Path(canvas, pathConfig);
        // const controllers = birds.flatMap((b) => new BirdController(b, birdControllerConfig));
        // let sensors = [];
        // if (enableSensor() == true) {
        //     sensors = birds.flatMap((b) => new Sensor(b, sensorConfig));
        // }

        // const games = new Games(birds.flatMap(
        //     (b, idx) => new Game(canvas, b, controllers[idx], sensors[idx], path, new ScoreCard(scorecardConfig))), path);
        // const gameControls = new GameControls(games);

        // let bots = undefined;
        // if (botMode() == true) {
        //     serialized = loadModel();
        //     let net;
        //     if (serialized == null) {
        //         net = MakeGameNetwork();
        //     } else {
        //         net = GameNetwork.Deserialize(serialized);
        //     }
        //     bots = Bots.ForGames(games, net);
        // }

        // function animate() {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);

        //     games.Render(ctx, styles);
        //     games.Update();

        //     const bestGameScore = games.BestScore();
        //     const newHs = Math.max(bestGameScore, hs);
        //     renderScore(bestGameScore);
        //     renderHighScore(newHs);

        //     if (botMode() == true) {
        //         bots.forEach((b) => {
        //             const sensorReadings = b.game.sensor && b.game.sensor.Readings();
        //             const move = b.NextMove(sensorReadings);
        //             b.game.ApplyMove(move);
        //         });
        //     }

        //     if (games.started == true && games.ended == false) {
        //         window.requestAnimationFrame(animate);
        //     } else if (games.ended == true) {
        //         if (newHs > hs) {
        //             saveHighScore(newHs);
        //             if (botMode() == true) {
        //                 const bestNet = Bots.FindModelWithScore(bots, newHs);
        //                 saveModel(bestNet.Serialize());
        //             }
        //             console.log("saved best model");
        //         }
        //     }
        // }

        // let hs = loadHighScore();
        // renderHighScore(hs);

        // if (botMode() == true) {
        //     gameControls.StartGames();
        // }
        // animate();
    }

    static ManualMode(canvas) {
        return new ManualGamePlay(canvas);
    }

    static BotMode() {
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

    StartGame() {
        this.controller.StartControl();
        this.path.BeginMoving();
        this.game.Start();
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
    }

    LoadGame() {}
}