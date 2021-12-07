const highScoresList = document.querySelector("#highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores.map(score => {
    return `<li class="high-score"><i class="fas fa-trophy"></i>${score.name} - ${score.score} pontos</li>`;
}).join("");

var button = document.getElementById("menu-btn");

button.addEventListener("click", function() {
    document.getElementById("song").play();

    setTimeout(function() {
        window.location.href = "../menu/index.html";
    }, 500);
});
