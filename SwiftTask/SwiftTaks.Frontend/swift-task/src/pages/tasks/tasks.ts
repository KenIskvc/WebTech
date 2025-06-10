
import TasksService from "../../services/tasks-service";

console.log("✅ tasks.ts module loaded");

export default async function () {
  const app = document.getElementById("app");
  if (!app) return;

  // Get form and input elements
  const form = app.querySelector("#task-form") as HTMLFormElement;
  const titleInput = app.querySelector("#task-title") as HTMLInputElement;
  const descInput = app.querySelector("#task-desc") as HTMLInputElement;
  const dueDateInput = app.querySelector("#task-due") as HTMLInputElement;
  const topicInput = app.querySelector("#task-topic") as HTMLInputElement;
  const isDoneCheckbox = app.querySelector("#task-done") as HTMLInputElement;

  const taskListContainer = app.querySelector("#task-list") as HTMLDivElement;

  // Load all tasks from backend and show them
  async function loadTasks() {
    const tasks = await TasksService.fetchTasks();
    taskListContainer.innerHTML = ""; // Clear before adding

    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      taskDiv.innerHTML = `
        <strong>${task.title}</strong> (${task.topicName})<br/>
        ${task.description || ""}<br/>
        Due: ${new Date(task.dueDate).toLocaleDateString()}<br/>
        Done: ${task.isDone ? "✅" : "❌"}<br/>
        <hr/>
      `;
      taskListContainer.appendChild(taskDiv);
    });
  }

  await loadTasks(); // Run once on page load

  // When form is submitted (new task), send it to backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTask = {
      title: titleInput.value,
      description: descInput.value,
      dueDate: dueDateInput.value,
      topicName: topicInput.value,
      isDone: false,
    };

    await TasksService.createTask(newTask); // Save task
    await loadTasks(); // Refresh list
    form.reset(); // Clear form
  });
}
