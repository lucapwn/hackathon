function typeWriter(element) {
    const text = element.innerHTML.split("");
    element.innerHTML = "";

    for (let i = 0; i < text.length; i++) {
        setTimeout(() => element.innerHTML += text[i], 55 * i);
    }
}

typeWriter(document.querySelector(".animated-h1-text"));
