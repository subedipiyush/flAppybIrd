class BirdController{
    static Config = {
        defaultSpeed: 0.3,
        defaultAcceleration: 0.3,
    };

    constructor(bird) {
        this.bird = bird;

        this.defaultSpeed = BirdController.Config.defaultSpeed;
        this.defaultAcceleration = BirdController.Config.defaultAcceleration;

        this.speed = 0;
        this.acceleration = 0;

        this.active = false;
    }

    StartControl() {
        this.active = true;
        this.#addKeyBoardListeners();
    }

    StopControl() {
        this.active = false;
    }

    #addKeyBoardListeners() {
        addKeyboardListener("ArrowUp", () => {
            this.#move("Up");
        });
        addKeyboardListener("ArrowDown", () => {
            this.#move("Down");
        });
    }

    Update() {
        this.bird.UpdatePosition(this.bird.x, this.bird.y + this.speed + this.acceleration);
    }

    #move(move) {
        if (!this.active) {
            return;
        }
        switch(move) {
            case "Up":
                this.speed = -1 * this.defaultSpeed;
                // Switching keys should restore the acceleration.
                this.acceleration = Math.min(-this.defaultAcceleration, this.acceleration - this.defaultAcceleration);
                break;
            case "Down":
                this.speed = this.defaultSpeed;
                this.acceleration = Math.max(this.defaultAcceleration, this.acceleration + this.defaultAcceleration);
                break;
        }
        this.Update();
    }
}
