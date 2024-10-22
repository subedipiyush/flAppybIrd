function renderHighScore(score) {
    document.getElementById('highscore').textContent = score;
}

function renderScore(score) {
    document.getElementById('scorecard').textContent = score;
}

function saveHighScore(hs) {
    save('high-score', hs); 
}

function saveModel(model) {
    save('model', model);
}

function loadHighScore() {
    return read('high-score') || 0;
}

function loadModel() {
    return read('model') || null;
}

function clearSavedItems() {
    save('high-score', 0);
    save('model', '');
}

function save(k, v) {
    window.localStorage.setItem(k, v);
}

function read(k) {
    return window.localStorage.getItem(k);
}