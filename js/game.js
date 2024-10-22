class Game {
    constructor(canvas, bird, path) {
        this.canvas = canvas;
        this.bird = bird;
        this.path = path;

        this.started = false;
        this.ended = false;
        this.collisionFrame = undefined;
    }

    Start() {
        this.started = true;
    }

    End() {
        this.ended = true;
    }

    IsRunning() {
        return (this.started == true && this.ended == false);
    }

    Update() {
        if (this.IsRunning == false) {
            return;
        }
        if (this.#birdIsAtBoundary() == true || this.#checkCollision(this.path) == true) {
            this.End();
        }
    }

    #collisionFrame() {
        return this.path.frames.find(f => f.obstacles.find((o) => this.bird.shape.Touches(o)) != undefined);
    }
    
    #checkCollision(path) {
        this.collisionFrame = this.#collisionFrame();
        return this.collisionFrame != undefined;
    }

    #birdIsAtBoundary() {
        return this.bird.shape.Touches(new Rectangle(this.canvas.style.left || 0, this.canvas.style.right || 0, this.canvas.width, this.canvas.height));
    }
}