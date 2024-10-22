class Path {
    static Config = {
        Offset: Bird.Config.StartingPoint.x*5,
        GapHeight: Bird.Config.Height*1.5,   // Just slightly bigger than the bird.
        DefaultSpeed: 1,
        ObstacleWidth: 15,
        NumObstacles: 1000,
        FrameGap: 50
    };
    static Style = {
        Obstacle: {
            Color: "#FFFF33", 
            Border: "#333300"
        },
    }

    constructor(canvas) {
        this.initialXOffset = Path.Config.Offset;
        this.gapHeight = Path.Config.GapHeight;
        this.defaultSpeed = Path.Config.DefaultSpeed;
        this.obstacleWidth = Path.Config.ObstacleWidth;
        this.numObstacles = Path.Config.NumObstacles;
        this.frameGap = Path.Config.FrameGap;

        this.speed = 0;
        this.viewport = new Rectangle(
            canvas.style.left || 0, 
            canvas.style.top || 0,
            canvas.width,
            canvas.height);

        this.frames = [];
        this.#addFrame();
    }
    
    BeginMoving() {
        this.speed = this.defaultSpeed;
    }

    StopMoving() {
        this.speed = 0;
    }

    Update() {
        this.frames.forEach((f) => f.ShiftLeftBy(this.speed));
        this.frames = this.frames.filter(f => f.x - f.width > 0);

        if (this.#lastFrame().x - this.frameGap - this.obstacleWidth < this.viewport.x + this.viewport.width) {
            this.#addFrame();
        }
    }
    
    Render(ctx, style=Path.Style) {
        this.frames.forEach((f) => f.Render(ctx, style.Obstacle));
    }

    Obstacles() {
        return this.frames.flatMap((f) => f.obstacles.flat());
    }
    
    #initialFrame() {
        const f = new Frame(
            this.viewport.x + this.initialXOffset,
            this.viewport.y, 
            this.obstacleWidth,
            this.viewport.height,
            this.gapHeight
        );
        f.GenerateObstacles();
        return f;
    }

    #addFrame() {
        if (this.frames.length == 0) {
            this.frames = this.frames.concat(this.#initialFrame());
            return;
        }
        this.frames = this.frames.concat(Frame.NextFrame(this.#lastFrame(), this.frameGap));
    }

    #lastFrame() {
        if (this.frames.length == 0) {
            return null;
        }
        return this.frames[this.frames.length - 1];
    }
}

class Gap extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    Render(ctx) {
        // No point rendering gap. Nothing to do.
    }
}

class Frame extends Rectangle {
    constructor(x, y, width, height, gapHeight) {
        super(x, y, width, height);
        this.gapHeight = gapHeight;
        this.obstacles = [];
    }

    Render(ctx, style) {
        this.obstacles.forEach((o) => o.Render(ctx, style));
    }

    #generateGap() {
        return new Gap(this.x, random(this.y, this.y + this.height - this.gapHeight), this.width, this.gapHeight);
    }
    
    GenerateObstacles() {
        const gap = this.#generateGap();
        const obsTop = new Rectangle(
            this.x, 
            this.y,
            this.width,
            gap.y - this.y);
        
        const bottomObsHeight = (this.y + this.height) - (gap.y + this.gapHeight);
        const obsBottom = new Rectangle(
            this.x,
            gap.y + this.gapHeight,
            this.width,
            bottomObsHeight);
    
        this.obstacles = [obsTop, obsBottom];
    }

    Gap() {
        return new Gap(this.x, this.obstacles[0].y + this.obstacles[0].height, this.width, this.gapHeight);
    }

    ShiftLeftBy(val) {
        this.obstacles.forEach((o) => o.ShiftLeftBy(val));
    }

    static NextFrame(prevFrame, xOffset) {
        const f  = new Frame(
            prevFrame.x + xOffset,
            prevFrame.y,
            prevFrame.width,
            prevFrame.height,
            prevFrame.gapHeight
        );
        f.GenerateObstacles();
        return f;
    }

}