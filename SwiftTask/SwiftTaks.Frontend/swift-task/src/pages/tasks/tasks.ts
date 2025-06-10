
import TasksService from "../../services/tasks-service";

console.log("✅ tasks.ts module loaded");

export default async function () {
  const app = document.getElementById("app");
  if (!app) return;

  // Get form and input elements
  const form = app.querySelector("#task-form") as HTMLFormElement;
  const descInput = app.querySelector("#task-desc") as HTMLTextAreaElement;
  const dueDateInput = app.querySelector("#task-due") as HTMLInputElement;
  const topicInput = app.querySelector("#task-topic") as HTMLSelectElement;
  const isDoneCheckbox = app.querySelector("#task-done") as HTMLInputElement;

  const taskListContainer = app.querySelector("#task-list") as HTMLDivElement;


  async function populateTopicDropdown(tasks: any[]) {
    const select = document.getElementById("task-topic") as HTMLSelectElement;
    const topicSet = new Set<string>();

    tasks.forEach(task => {
      if (task.topicName) {
        topicSet.add(task.topicName);
      }
       });

       select.innerHTML = '<option value="" disabled selected>Select Topic</option>';

        topicSet.forEach(topic => {
      const opt = document.createElement("option");
      opt.value = topic;
      opt.textContent = topic;
      select.appendChild(opt);
    });
  }


  // Load all tasks from backend and show them
  async function loadTasks() {
    const tasks = await TasksService.fetchTasks();
    taskListContainer.innerHTML = ""; // Clear before adding

    await populateTopicDropdown(tasks);
    

    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      taskDiv.innerHTML = `
  <div class="task-topic">${task.topicName}</div>
  <div class="task-desc">${task.description || ""}</div>
  <div class="task-due"><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</div>
  <div class="checkbox-wrapper">
    <input type="checkbox" disabled ${task.isDone ? "checked" : ""} />
    <label>Is Done</label>
  </div>
`;
      taskListContainer.appendChild(taskDiv);
    });
  }

  await loadTasks(); // Run once on page load

  // When form is submitted (new task), send it to backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTask = {
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
