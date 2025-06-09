export default function () {
  const container = document.getElementById("app");
  if (!container) return;

  const data = {
    userCount: 3,
    topics: [
      { id: 1, name: "Work" },
      { id: 2, name: "Personal" },
      { id: 3, name: "Groceries" }
    ],
    tasks: [
      { id: 1, completed: false },
      { id: 2, completed: true },
      { id: 3, completed: false },
      { id: 4, completed: true }
    ]
  };

  const totalTopics = data.topics.length;
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.completed).length;
  const completionPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  container.innerHTML = `
    <h2>Dashboard</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">people</span></div>
        <div class="stat-info">
          <div class="stat-label">Users</div>
          <div class="stat-value">${data.userCount}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">category</span></div>
        <div class="stat-info">
          <div class="stat-label">Topics</div>
          <div class="stat-value">${totalTopics}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">task</span></div>
        <div class="stat-info">
          <div class="stat-label">Tasks</div>
          <div class="stat-value">${totalTasks}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">check_circle</span></div>
        <div class="stat-info">
          <div class="stat-label">Tasks Completed</div>
          <div class="stat-value">${completionPercent}%</div>
          <div class="progress-bar">
            <div class="progress" style="width: ${completionPercent}%;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

