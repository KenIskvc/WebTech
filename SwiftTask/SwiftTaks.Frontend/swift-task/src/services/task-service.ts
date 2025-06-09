// src/services/task-service.ts
import type { TaskDto } from '../types/dtos';  


const API_BASE = "https://localhost:7050/api";

function getAuthHeaders(): HeadersInit {
  const token = window.Alpine?.store('auth')?.token;
  return token
    ? { 'Authorization': `Bearer ${token}` }
    : {};
}

/**
 * Lädt alle Tasks vom Backend.
 */
export async function fetchTasks(): Promise<TaskDto[]> {
  const res = await fetch(`${API_BASE}/Task`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

/**
 * Erstellt eine neue Task.
 * Erwartet genau das DTO ohne id.
 */
export async function createTask(
  payload: Omit<TaskDto, 'id'>
): Promise<TaskDto> {
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

/**
 * Aktualisiert eine bestehende Task.
 * Die API erwartet das vollständige DTO inklusive id.
 */
export async function updateTask(
  id: number,
  payload: TaskDto
): Promise<void> {
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

/**
 * Löscht eine Task anhand der ID.
 */
export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/Task/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete task");
}
