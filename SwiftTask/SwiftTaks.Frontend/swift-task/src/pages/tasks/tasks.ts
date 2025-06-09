export function renderTasksPage(container: HTMLElement, data: any, id?: string): void {
  const taskId = id ? parseInt(id) : null;
  const task = taskId ? data.tasks.find((t: any) => t.id === taskId) : null;
  const sortedTasks = data.tasks.slice().sort((a: any, b: any) => a.dueDate.localeCompare(b.dueDate));

  container.innerHTML = `
    <h2>${task ? "Edit Task" : "New Task"}</h2>
    <form id="taskForm">
     <label for="taskTitle">Title:</label>
<div class="voice-input-wrapper">
  <input type="text" id="taskTitle" name="title" maxlength="50" value="${task ? task.title : ""}" required />
  <button type="button" id="micBtn" title="Speak task title">🎤</button>
</div>

      
      <label for="taskDescription">Description:</label>
      <textarea id="taskDescription" name="description" maxlength="200" rows="3">${task ? task.description : ""}</textarea>
      
      <label for="taskTopic">Topic:</label>
      <select id="taskTopic" name="topic">
        ${data.topics.map((topic: any) => `
          <option value="${topic.id}" ${task && task.topicId === topic.id ? "selected" : ""}>${topic.name}</option>
        `).join('')}
      </select>

      <label for="taskDueDate">Due Date:</label>
      <input type="date" id="taskDueDate" name="dueDate" value="${task ? task.dueDate : ""}" />
      
      <label>
        <span>Completed</span>
        <input type="checkbox" id="taskCompleted" name="completed" ${task && task.completed ? "checked" : ""} />
      </label>

      <button type="submit">${task ? "Save Changes" : "Add Task"}</button>
    </form>

    <h3>All Tasks</h3>
    <div id="tasksList">
      ${sortedTasks.map((t: any) => {
        const topicName = data.topics.find((topic: any) => topic.id === t.topicId)?.name || "Unknown";
        return `
          <div class="task-item ${t.completed ? "completed" : ""}">
            <span>${t.title} (${topicName}) - Due: ${t.dueDate}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

 
  const form = document.getElementById("taskForm") as HTMLFormElement;
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    alert("Task saved");
  });
}


const mockData = {
  topics: [
    { id: 1, name: "Work", icon: "work", color: "#3A8DFF", created: "2025-05-01", autoDelete: 30 },
    { id: 2, name: "Personal", icon: "person", color: "#FF6B6B", created: "2025-05-03", autoDelete: 0 }
  ],
  tasks: [
    {
      id: 1,
      title: "Finish report",
      description: "Complete the quarterly report",
      topicId: 1,
      dueDate: "2025-06-10",
      completed: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Buy milk",
      description: "Get milk and eggs",
      topicId: 2,
      dueDate: "2025-06-11",
      completed: true,
      priority: "low"
    }
  ]
};


const container = document.getElementById("app");
if (container) {
  renderTasksPage(container, mockData);
}
