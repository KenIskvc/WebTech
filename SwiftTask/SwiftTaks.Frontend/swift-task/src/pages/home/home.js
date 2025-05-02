document.addEventListener("DOMContentLoaded", () => {
    // Load dummy data from JSON file
    fetch("home.json")
        .then(response => {
            if (!response.ok) throw new Error("Fehler beim Laden der JSON-Datei.");
            return response.json();
        })
        .then(data => renderTasks(data))
        .catch(error => {
            console.error("Fehler:", error);
            document.getElementById("task-lists").innerText = "Fehler beim Laden der Aufgaben.";
        });

    // Dark mode toggle
    const toggle = document.getElementById("darkModeToggle");
    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
    });
});

function renderTasks(topics) {
    const container = document.getElementById("task-lists");
    container.innerHTML = ""; // reset in case of reload

    topics.forEach(topic => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.backgroundColor = topic.color;

        const title = document.createElement("h3");
        title.textContent = `${topic.icon} ${topic.topic}`;
        card.appendChild(title);

        const list = document.createElement("ul");

        topic.tasks.forEach(task => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";

            const label = document.createElement("label");
            label.textContent = task;
            label.style.marginLeft = "8px";

            // Optional: strike through when checked
            checkbox.addEventListener("change", () => {
                label.style.textDecoration = checkbox.checked ? "line-through" : "none";
                label.style.opacity = checkbox.checked ? "0.6" : "1";
            });

            li.appendChild(checkbox);
            li.appendChild(label);
            list.appendChild(li);
        });

        card.appendChild(list);
        container.appendChild(card);
    });
}