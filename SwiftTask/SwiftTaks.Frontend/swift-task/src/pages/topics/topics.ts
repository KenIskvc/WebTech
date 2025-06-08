export function renderTopicsPage(container: HTMLElement): void {
  const data = {
    topics: [
      { id: 1, name: "Work", color: "#3A8DFF", icon: "work", autoDelete: 7, created: "2025-06-01" },
      { id: 2, name: "Personal", color: "#FF6B6B", icon: "person", autoDelete: 0, created: "2025-06-01" }
    ],
    tasks: [
      { id: 1, topicId: 1 },
      { id: 2, topicId: 1 },
      { id: 3, topicId: 2 }
    ]
  };

  container.innerHTML = `
    <h2>Topics</h2>
    <form id="topicForm">
      <input type="text" id="topicName" placeholder="Name" required />
      <input type="color" id="topicColor" value="#3A8DFF" />
      <input type="text" id="topicIcon" placeholder="Icon (e.g. work)" />
      <input type="number" id="topicAutoDelete" placeholder="Auto delete (days)" min="0" />
      <button type="submit">Add Topic</button>
    </form>

    <div id="topicsList">
      ${data.topics.map(t => {
        const taskCount = data.tasks.filter(task => task.topicId === t.id).length;
        return `
          <div class="topic-card" style="border-left: 6px solid ${t.color};">
            <span class="material-icons">${t.icon}</span>
            <div>
              <strong>${t.name}</strong><br />
              <small>${taskCount} task(s)</small>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById("topicForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Topic creation not implemented (mock only)");
  });
}
