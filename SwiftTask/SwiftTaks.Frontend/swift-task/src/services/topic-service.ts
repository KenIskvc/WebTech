// src/services/topic-service.ts
// Provides API methods for CRUD operations on topics

const API_BASE = "https://localhost:7050/api";

function getAuthHeaders(): HeadersInit | undefined {
  const token = window.Alpine?.store('auth')?.token;
  return token ? { 'Authorization': `Bearer ${token}` } : undefined;
}

export async function fetchTopics(userId: string) {
  const res = await fetch(`${API_BASE}/Topic?userId=${userId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch topics");
  return await res.json();
}

export async function createTopic(topic: { Name: string }) {
  const res = await fetch(`${API_BASE}/Topic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(topic)
  });
  if (!res.ok) throw new Error("Failed to create topic");
  return await res.json();
}

export async function updateTopic(id: number, topic: { Name: string }) {
  const res = await fetch(`${API_BASE}/Topic/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(topic)
  });
  if (!res.ok) throw new Error("Failed to update topic");
}

export async function deleteTopic(id: number) {
  const res = await fetch(`${API_BASE}/Topic/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete topic");
}
