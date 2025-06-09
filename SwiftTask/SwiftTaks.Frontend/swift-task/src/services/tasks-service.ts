const BASE_URL = "/api/task";

// Интерфейс задачи, соответствующий тому, что мы ожидаем от бэкенда
export interface TaskDto {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isDone: boolean;
  topicName: string;
}

// Получение всех задач
export async function fetchAllTasks(): Promise<TaskDto[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

// Получение задачи по ID
export async function fetchTaskById(id: number): Promise<TaskDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Task ${id} not found`);
  return await res.json();
}

// Получение задач по названию темы
export async function fetchTasksByTopic(topicName: string): Promise<TaskDto[]> {
  const res = await fetch(`${BASE_URL}/topic/${encodeURIComponent(topicName)}`);
  if (!res.ok) throw new Error(`No tasks for topic: ${topicName}`);
  return await res.json();
}

// Создание новой задачи
export async function createTask(
  title: string,
  description: string,
  dueDate: string,
  topicName: string
): Promise<TaskDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, dueDate, topicName })
  });
  if (!res.ok) throw new Error("Failed to create task");
  return await res.json();
}

// Обновление существующей задачи
export async function updateTask(
  id: number,
  title: string,
  description: string,
  isDone: boolean,
  dueDate: string,
  topicName: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, isDone, dueDate, topicName })
  });
  if (!res.ok) throw new Error(`Failed to update task ${id}`);
}

// Удаление задачи
export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete task ${id}`);
}
