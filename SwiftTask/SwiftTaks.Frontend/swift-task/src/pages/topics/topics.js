const ICONS = ["🏠", "💼", "🛒", "📚", "⚙️", "❤️", "✈️"];

document.addEventListener("DOMContentLoaded", () => {
    fetch("../home/home.json")
        .then(res => res.json())
        .then(renderTopics)
        .catch(err => console.error("Fehler beim Laden der Topics:", err));
});

function renderTopics(topics) {
    const container = document.getElementById("topics-container");
    container.innerHTML = "";

    topics.forEach((topic, index) => {
        const card = document.createElement("div");
        card.className = "topic-card";
        card.style.backgroundColor = topic.color;

        // Name
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = topic.topic;

        // Icon
        const iconLabel = document.createElement("div");
        iconLabel.textContent = "Select Icon:";
        const iconOptions = document.createElement("div");
        iconOptions.className = "icon-options";

        ICONS.forEach(icon => {
            const span = document.createElement("span");
            span.textContent = icon;
            if (icon === topic.icon) span.classList.add("selected");
            span.addEventListener("click", () => {
                iconOptions.querySelectorAll("span").forEach(s => s.classList.remove("selected"));
                span.classList.add("selected");
            });
            iconOptions.appendChild(span);
        });

        // Farbe
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = topic.color;

        // Dringlichkeit
        const urgencyLabel = document.createElement("label");
        urgencyLabel.textContent = "Urgency";
        const urgencySlider = document.createElement("input");
        urgencySlider.type = "range";
        urgencySlider.min = 0;
        urgencySlider.max = 10;
        urgencySlider.value = topic.urgency || 0;

        card.appendChild(nameInput);
        card.appendChild(iconLabel);
        card.appendChild(iconOptions);
        card.appendChild(colorInput);
        card.appendChild(urgencyLabel);
        card.appendChild(urgencySlider);

        container.appendChild(card);
    });
}