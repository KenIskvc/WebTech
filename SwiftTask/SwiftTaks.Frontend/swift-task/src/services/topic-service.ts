// src/services/topic-service.ts
// Service for connecting frontend to backend TopicController
import { TopicDto } from '../types/dtos';

const API_BASE = 'https://localhost:7050/api';

function getAuthHeaders(): HeadersInit {
  const token = window.Alpine?.store('auth')?.token;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// GET: api/Topic?userId=...
export async function fetchTopics(userId: string): Promise<TopicDto[]> {
  const res = await fetch(`${API_BASE}/Topic?userId=${encodeURIComponent(userId)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch topics: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return await res.json();
}

// GET: api/Topic/{id}
export async function fetchTopic(id: number): Promise<TopicDto> {
  const res = await fetch(`${API_BASE}/Topic/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch topic: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return await res.json();
}

// POST: api/Topic (TopicCreateDto)
export async function createTopic(topic: { Name: string; UserId: string }): Promise<TopicDto> {
  const res = await fetch(`${API_BASE}/Topic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(topic),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create topic: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return await res.json();
}

// PUT: api/Topic/{id} (TopicDto)
export async function updateTopic(id: number, topic: TopicDto): Promise<void> {
  const res = await fetch(`${API_BASE}/Topic/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(topic),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update topic: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

// DELETE: api/Topic/{id}
export async function deleteTopic(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/Topic/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete topic: ${res.status} ${res.statusText} - ${errorText}`);
  }
}
