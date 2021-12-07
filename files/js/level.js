document.querySelectorAll("button").forEach(
    function(element) {
        element.addEventListener("click", function(event) {
        level = event.target.id;
        localStorage.setItem("level", level);
        document.getElementById("song").play();

        setTimeout(function() {
            window.location.href = "../game/index.html";
        }, 500);
    });
});
