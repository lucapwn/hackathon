var button = document.getElementById("game");

button.addEventListener("click", function() {
    document.getElementById("song").play();

    setTimeout(function() {
        window.location.href = "../level/index.html";
    }, 500);
});

button = document.getElementById("score-btn");

button.addEventListener("click", function() {
    document.getElementById("song").play();

    setTimeout(function() {
        window.location.href = "../score/index.html";
    }, 500);
});
