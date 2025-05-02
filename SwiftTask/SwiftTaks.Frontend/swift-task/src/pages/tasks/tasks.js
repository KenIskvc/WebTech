document.addEventListener("DOMContentLoaded", () => {
    fetch("../home/home.json")
        .then(response => response.json())
        .then(data => renderTasks(data))
        .catch(err => console.error("Fehler beim Laden:", err));
});

function renderTasks(topics) {
    const tbody = document.querySelector("#taskTable tbody");

    topics.forEach(topic => {
        topic.tasks.forEach((task, index) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = task;

            const topicCell = document.createElement("td");
            topicCell.textContent = topic.topic;

            const statusCell = document.createElement("td");
            statusCell.textContent = "⏳"; // später dynamisch

            const actionsCell = document.createElement("td");

            const editBtn = document.createElement("button");
            editBtn.className = "action-btn";
            editBtn.textContent = "Edit";

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "action-btn";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                row.remove(); // später aus JSON entfernen
            });

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);

            row.appendChild(nameCell);
            row.appendChild(topicCell);
            row.appendChild(statusCell);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });
    });
}