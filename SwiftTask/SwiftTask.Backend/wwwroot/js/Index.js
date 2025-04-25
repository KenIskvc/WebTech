const uri = "api/helloWorld";

window.addEventListener("load",
    function helloWorld() {
        console.log("helloWorld() called.");
        const body = document.getElementById("body");
        fetch(uri)
            .then(response => response.text())
            .then(text => body.innerHTML = text)
            .catch(error => console.error("Unable to fetch api/helloWorld", error));
    },
    false);