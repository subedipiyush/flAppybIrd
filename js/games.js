class Games {
    constructor(games, path) {
        this.games = games;
        this.path = path;
        this.started = false;
        this.ended = false;
        this.bestGame = this.games.length > 0 ? this.games[0] : undefined;
    }

    Start(event) {
        this.started = true;
        this.path.BeginMoving();
        this.games.forEach(g => g.Start(event));
    }

    End() {
        this.ended = true;
        this.path.StopMoving();
    }

    Update() {
        if (this.started == false || this.ended == true) {
            return;
        }
        this.games.forEach(g => g.Update());
        this.path.Update();
        this.bestGame = this.#bestGame();
        this.games = this.games.filter(g => g.IsRunning());
        if (this.games.length == 0) {
            this.games = this.bestGame;
            this.End();
        }
    }

    Render(ctx, styles) {
        this.path.Render(ctx, styles.path);
        this.games.forEach(g => g.Render(ctx, styles.game));
        this.bestGame.Render(ctx, styles.bestGame);
    }

    BestScore() {
        return (this.bestGame && this.bestGame.Score()) || 0;
    }

    #bestGame() {
        const maxScore = Math.max(...this.games.flatMap(g => g.Score()));
        return this.games.find(g => g.Score() == maxScore);
    }
}
