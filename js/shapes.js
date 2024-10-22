class Polygon {
    constructor(points) {
        if (points.length == 0) {
            throw new Error('polygon should have 1 or more points');
        }
        this.points = points;
    }

    Render(ctx, style) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (var i=1; i<this.points.length; i++) {
            ctx.lineTo(this.points[i].x,this.points[i].y);
        }
        if (style && style.Color != undefined) {
            ctx.fillStyle = style.Color;
        }
        if (style && style.Border != undefined) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = style.Border;
            ctx.stroke();
        }
        ctx.fill();
        ctx.restore();
    }

    ShiftLeftBy(val) {
        this.points.forEach((point) => point.x -= val);
    }
    
    ShiftRightBy(val) {
        this.points.forEach((point) => point.x += val);
    }

    LeftMostX() {
        return Math.min(...this.points.flatMap((point) => point.x));
    }

    RightMostX() {
        return Math.max(...this.points.flatMap((point) => point.x));
    }

    TopMostY() {
        return Math.min(...this.points.flatMap((point) => point.y));
    }

    BottomMostY() {
        return Math.max(...this.points.flatMap((point) => point.y));
    }

    Height() {
        return this.BottomMostY() - this.TopMostY();
    }

    Segments() {
        let segments = [];
        for (var i=1; i < this.points.length; i++) {
            segments = segments.concat(new Line(this.points[i-1], this.points[i]));
        }
        segments = segments.concat(new Line(this.points[this.points.length-1], this.points[0]));
        return segments;
    }
    
    Touches(other) {
        const otherSegs = other.Segments(); 
        return (this.Segments().find((s) => otherSegs.find((o) => o.Touches(s))) != undefined);
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    Touches(other) {
        return this.IntersectionPoint(other) != null
    }

    IntersectionPoint(other) {
        function scalingFactor(line1, line2) {
            const numerator = (line1.p2.y - line1.p1.y)*(line2.p1.x - line1.p1.x) - (line2.p1.y - line1.p1.y)*(line1.p2.x - line1.p1.x);
            const denom = (line2.p2.y - line2.p1.y)*(line1.p2.x - line1.p1.x) - (line2.p2.x - line2.p1.x)*(line1.p2.y - line1.p1.y);

            if (denom == 0) {
                return -1;
            }
            return numerator / denom;    
        }
        let t1 = scalingFactor(this, other);
        let t2 = scalingFactor(other, this);
        if (t1 >=0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
            return {
                point: new Point(lerp(this.p1.x, this.p2.x, t1), lerp(this.p1.y, this.p2.y, t1)),
                offset: t1
            };
        }
        return null;
    }

    Render(ctx, style) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        if (style && style.Border != undefined) {
            ctx.strokeStyle = style.Border;
        } else {
            ctx.strokeStyle = "black";
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    OffsetX(val) {
        this.x += val;
    }

    Equals(other) {
        return (this.x == other.x && this.y == other.y);
    }
}

class Rectangle extends Polygon {
    constructor(x, y, width, height) { 
        super([
            new Point(x, y),
            new Point(x + width, y),
            new Point(x + width, y + height),
            new Point(x, y + height)
        ]);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Center() {
        return new Point(this.x + this.width/2, this.y + this.height/2);
    }

    TopRight() {
        return new Point(this.x + this.width, this.y);
    }
    
    TopLeft() {
        return new Point(this.x, this.y);
    }

    BottomRight() {
        return new Point(this.x + this.width, this.y + this.height);
    }

    BottomLeft() {
        return new Point(this.x, this.y + this.height);
    }
}