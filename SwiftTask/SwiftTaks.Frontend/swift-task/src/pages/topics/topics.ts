import { fetchTopics, fetchTopic, createTopic, updateTopic, deleteTopic } from '../../services/topic-service';
interface TopicDto {
  Id: number;
  Name: string;
  Tasks?: any[];
}

export default function setupTopicsPage() {
  // Minimal DOM references
  const topicForm = document.getElementById('topicForm') as HTMLFormElement;
  const topicNameInput = document.getElementById('topicName') as HTMLInputElement;
  const topicsList = document.getElementById('topicsList') as HTMLDivElement;
  const submitBtn = document.getElementById('topic-submit-btn') as HTMLButtonElement;

  let editingId: number | null = null;
  let userId: string | null = null;

  // Get userId from auth store (Alpine.js)
  function getUserId(): string | null {
    // @ts-ignore
    return window.Alpine?.store('auth')?.user?.id || null;
  }

  async function loadTopics() {
    userId = getUserId();
    if (!userId) {
      topicsList.innerHTML = '<p>Please log in.</p>';
      return;
    }
    try {
      const topics = await fetchTopics(userId);
      renderTopics(topics);
    } catch (e) {
      topicsList.innerHTML = `<p>Error loading topics: ${e}</p>`;
    }
  }

  function renderTopics(topics: TopicDto[]) {
    topicsList.innerHTML = '';
    if (!topics.length) {
      topicsList.innerHTML = '<p>No topics found.</p>';
      return;
    }
    topics.forEach(topic => {
      const div = document.createElement('div');
      div.className = 'topic-item';
      // Always show topic name
      const nameSpan = document.createElement('span');
      nameSpan.className = 'topic-name';
      nameSpan.textContent = topic.Name || 'Unnamed Topic';
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => startEdit(topic);
      // Delete button
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => handleDelete(topic.Id);
      div.appendChild(nameSpan);
      div.appendChild(editBtn);
      div.appendChild(delBtn);
      topicsList.appendChild(div);
    });
  }

  function startEdit(topic: TopicDto) {
    editingId = topic.Id;
    topicNameInput.value = topic.Name;
    submitBtn.textContent = 'Update Topic';
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this topic?')) return;
    try {
      await deleteTopic(id);
      editingId = null;
      await loadTopics();
    } catch (e) {
      alert('Error deleting topic: ' + e);
    } finally {
      submitBtn.textContent = 'Add Topic';
    }
  }

  topicForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    userId = getUserId();
    if (!userId) return alert('Not logged in');
    const name = topicNameInput.value.trim();
    if (!name) return alert('Name required');
    try {
      if (editingId) {
        // Use correct TopicDto shape for update
        await updateTopic(editingId, { Id: editingId, Name: name });
        editingId = null;
        submitBtn.textContent = 'Add Topic';
      } else {
        await createTopic({ Name: name, UserId: userId });
      }
      topicForm.reset();
      await loadTopics();
    } catch (e) {
      alert('Error saving topic: ' + e);
    }
  });

  // Initial load
  loadTopics();
}
