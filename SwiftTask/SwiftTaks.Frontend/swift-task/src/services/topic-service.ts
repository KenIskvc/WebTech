// src/services/topic-service.ts
// Provides API methods for CRUD operations on topics

import { TopicDto } from '../types/dtos';

const API_BASE = "https://localhost:7050/api";

function getAuthHeaders(): HeadersInit | undefined {
  const token = window.Alpine?.store('auth')?.token;
  return token ? { 'Authorization': `Bearer ${token}` } : undefined;
}

// Fetch topics for a user, with error handling
export async function fetchTopics(userId: string): Promise<TopicDto[]> {
  try {
    const res = await fetch(`${API_BASE}/Topic?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch topics: ${res.status} ${res.statusText}`, errorText);
      throw new Error(`Failed to fetch topics: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

// Create a new topic - only send properties expected by the backend
export async function createTopic(topic: { Name: string, SwiftTaskUserId: string }): Promise<TopicDto> {
  console.log('Creating topic with data:', topic);
  
  try {
    const res = await fetch(`${API_BASE}/Topic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(topic)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to create topic:', errorText);
      throw new Error(`Failed to create topic: ${res.status} ${res.statusText}`);
    }
    
    // The backend returns the complete Topic object
    const newTopic = await res.json();
    console.log('Topic created successfully:', newTopic);
    return newTopic;
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
}

// Update an existing topic - only send properties expected by the backend
export async function updateTopic(id: number, topic: { Id: number, Name: string, SwiftTaskUserId: string }): Promise<void> {
  console.log('Updating topic with data:', topic);
  
  try {
    const res = await fetch(`${API_BASE}/Topic/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(topic)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to update topic:', errorText, 'Status:', res.status);
      throw new Error(`Failed to update topic: ${res.status} ${res.statusText}`);
    }
    
    console.log('Topic updated successfully');
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
}

// Delete a topic by ID
export async function deleteTopic(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/Topic/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to delete topic:', errorText);
      throw new Error(`Failed to delete topic: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
}
