// src/services/topic-service.ts
// Service for connecting frontend to backend TopicController

import Alpine from 'alpinejs';
import { User } from '../models/User';
export interface TopicDto{
  Id : number;
  Name: string;
  Tasks: TaskDto[];
}
export interface TaskDto {
  Id: number;
  Description: string;
}

const API_BASE = 'https://localhost:7050/api';
const user : User = Alpine.store('auth').user as User;

function getAuthHeaders(): HeadersInit {
  const token = window.Alpine?.store('auth')?.token;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// GET: api/Topic?userId=...
async function fetchTopics(): Promise<TopicDto[]> {
  console.log(user.id);
  const res = await fetch(`${API_BASE}/Topic?userId=${encodeURIComponent(user.id)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch topics: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return await res.json();
}

// GET: api/Topic/{id}
async function fetchTopic(id: number): Promise<TopicDto> {
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
async function createTopic(topic: { Name: string; UserId: string }): Promise<TopicDto> {
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
async function updateTopic(id: number, topic: TopicDto): Promise<void> {
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
async function deleteTopic(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/Topic/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete topic: ${res.status} ${res.statusText} - ${errorText}`);
  }
}
const TopicService = {
  fetchTopics,
  fetchTopic,
  createTopic,
  updateTopic,
  deleteTopic
};
export default TopicService;