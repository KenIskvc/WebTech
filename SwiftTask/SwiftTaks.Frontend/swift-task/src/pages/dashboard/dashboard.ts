// TypeScript version of dashboard.js
export function renderDashboardPage(container: HTMLElement, data: any): void {
    const userCount = data.userCount || 0;
    const totalTopics = data.topics.length;
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter((t: any) => t.completed).length;
    const completionPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    container.innerHTML = `
    <h2>Dashboard</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-icons">people</span></div>
        <div class="stat-info">
          <div class="stat-label">Users</div>
          <div class="stat-value">${userCount}</div>
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
          <div class="progress-bar"><div class="progress" style="width: ${completionPercent}%;"></div></div>
        </div>
      </div>
    </div>
  `;
}
