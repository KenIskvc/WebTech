
import Alpine from 'alpinejs';


interface TaskDto {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  isDone: boolean;
  topicName: string;
}

const API_BASE = "https://localhost:7050/api";

function getAuthHeaders(): HeadersInit {
  const token = Alpine.store('auth')?.token;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}


async function fetchTasks(): Promise<TaskDto[]> {

  const res = await fetch(`${API_BASE}/Task`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

async function createTask(payload: Omit<TaskDto, 'id'>): Promise<TaskDto> {
  const res = await fetch(`${API_BASE}/Task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return await res.json();
}

async function updateTask(id: number, payload: TaskDto): Promise<void> {

  const res = await fetch(`${API_BASE}/Task/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update task");
}


async function deleteTask(id: number): Promise<void> {

  const res = await fetch(`${API_BASE}/Task/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete task");

}

const TasksService = {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
};

export default TasksService;

