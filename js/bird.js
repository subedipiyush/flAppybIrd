class Bird {
    static Config = {
        StartingPoint: new Point(50, 70),
        Width: 20,
        Height: 20,
    };
    static Style = {
        Color: "#d5e8c2",
    }

    constructor() {
        this.x = Bird.Config.StartingPoint.x;
        this.y = Bird.Config.StartingPoint.y;
        this.width = Bird.Config.Width;
        this.height = Bird.Config.Height;

        this.orientation = Math.PI/2;
        this.shape = this.#makeShape();
    }

    Render(ctx, style=Bird.Style) {
        this.shape.Render(ctx, style);
    }

    UpdatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.shape = this.#makeShape();
    }

    #makeShape() {
        var startingPoint = new Point(this.x - this.width, this.y); // Adjusting x to place the point in center of the shape.
        return new Polygon([
            startingPoint,
            new Point(startingPoint.x + this.width/2, startingPoint.y - this.height/2),
            new Point(startingPoint.x + this.width, startingPoint.y),
            new Point(startingPoint.x + this.width/2, startingPoint.y + this.height/2),
        ]);
    }
}