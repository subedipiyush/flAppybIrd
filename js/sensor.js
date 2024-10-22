class Sensor {
    static CConfig = {
        rayLength: 40, 
        raySpread: Math.PI/1.85,
        numRays: 3,
        render: false,
    };

    constructor(bird) {
        this.bird = bird;

        this.rayLength = Sensor.CConfig.rayLength;
        this.raySpread = Sensor.CConfig.raySpread;
        this.numRays = Sensor.CConfig.numRays;
        this.render = Sensor.CConfig.render;

        this.rays = new Array(this.numRays);
        this.Update();
    }

    Update(path) {
        for (let i=0; i < this.numRays; i++) {
            let rayAngle = lerp(
                this.raySpread/2, 
                -this.raySpread/2,
                this.numRays == 1 ? 0.5 : i/(this.numRays-1));

            // Adjust for bird orientation.
            rayAngle = this.bird.orientation + rayAngle; 
            
            const startPoint = new Point(this.bird.x, this.bird.y);
            const endPoint = new Point(
                this.bird.x + Math.sin(rayAngle)*this.rayLength,
                this.bird.y - Math.cos(rayAngle)*this.rayLength); 
            
            this.rays[i] = new Ray(startPoint, endPoint);
        }
        this.#read(path);
    }

    #read(path) {
        this.rays.forEach((r) => r.Read(path && path.Obstacles()));
    }

    Readings() {
        return this.rays.map((r) => r.reading);
    }

    Render(ctx, style) {
        if (this.render) {
            this.rays.forEach((r) => r.Render(ctx, style.ray));    
        }
    }
}

class Ray extends Line {
    constructor(p1, p2) {
        super(p1, p2);
        this.reading = {offset: 0, nearestReading: p2};
    }

    Read(objects) {
        let insPoints = [];
        let that = this;
        objects && objects.forEach((o) => 
            o.Segments().forEach(function(s) {
                const i = that.IntersectionPoint(s);
                if (i != null) {
                    insPoints = insPoints.concat(i);
                }
            }));
        
        if (insPoints.length == 0) {
            this.reading = {offset: 0, nearestReading: this.p2};
        } else {
            this.reading.offset = Math.min(...insPoints.map((p) => p.offset));
            this.reading.nearestReading = insPoints.find((p) => p.offset == this.reading.offset).point;
        }
    }
    
    Render(ctx, style) {
        const l1 = new Line(this.p1, this.reading.nearestReading);
        l1.Render(ctx, {border: style.noOverlap.color});
        if (this.reading.offset == 0) {
            return
        }
        const l2 = new Line(this.reading.nearestReading, this.p2);
        l2.Render(ctx, {border: style.overlap.color});
    }
}