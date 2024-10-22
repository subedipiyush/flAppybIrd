class ScoreCard {
    static Config = {
        DefaultInc: 1,
    };

    constructor(config) {
        this.score = 0;
        this.increment = ScoreCard.Config.DefaultInc;
    }

    Update() {
        this.score += this.increment;
    }
}