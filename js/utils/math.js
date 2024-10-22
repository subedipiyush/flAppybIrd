function random(min, max) {
    if (max < min) {
        var t = min;
        min = max;
        max = t;
    }
    return Math.random() * (max - min) + min;
}

function randomEvent() {
    return random(0,1) < 0.5
}

function lerp(a, b, t) {
    return a + (b-a)*t;
}