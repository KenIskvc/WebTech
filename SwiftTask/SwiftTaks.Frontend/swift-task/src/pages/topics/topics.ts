// src/pages/topics/topics.ts
import Alpine from 'alpinejs';
import type { TopicDto } from '../../types/dtos';
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic
} from '../../services/topic-service';

export default async function setupTopics(): Promise<void> {
  console.log('✅ Topics page loaded');

  // 1️⃣ Auth & User-ID holen
  const auth = Alpine.store('auth');
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  const userId = auth.user?.Id;
  if (!userId) {
    console.error('🚨 Kein eingeloggter User – bitte einloggen!');
    // For testing, use dummy data instead of returning
    useDummyData();
    return;
  }

  // Try to load from backend, fall back to dummy data if it fails
  let topics: TopicDto[] = [];
  try {
    topics = await fetchTopics(userId);
    if (topics.length === 0) {
      // No topics from backend, use dummy data
      console.log('No topics found, using dummy data');
      useDummyData();
      return;
    }
  } catch (error) {
    console.error('Error loading topics, using dummy data', error);
    useDummyData();
    return;
  }

  // 3️⃣ DOM-Elemente referenzieren
  const titleEl         = document.getElementById('topics-title')      as HTMLElement;
  const form            = document.getElementById('topicForm')         as HTMLFormElement;
  const nameInput       = document.getElementById('topicName')        as HTMLInputElement;
  const colorInput      = document.getElementById('topicColor')       as HTMLInputElement;
  const iconInput       = document.getElementById('topicIcon')        as HTMLInputElement;
  const autoDeleteInput = document.getElementById('topicAutoDelete')  as HTMLInputElement;
  const submitBtn       = document.getElementById('topic-submit-btn') as HTMLButtonElement;
  const listContainer   = document.getElementById('topicsList')       as HTMLDivElement;

  // 4️⃣ State
  let editingTopicId: number | null = null;

  // 5️⃣ Liste rendern
  function renderTopicList() {
    listContainer.innerHTML = topics.map(t => {
      const count = t.Tasks?.length ?? 0;
      return `
        <div class="topic-item" data-id="${t.Id}">
          <div class="topic-icon">
            <span class="material-icons">${(t as any).icon || 'category'}</span>
          </div>
          <div class="topic-name">${t.Name}</div>
          <div class="topic-stats">${count} task(s)</div>
          <div class="topic-actions">
            <button class="edit-topic-btn" title="Edit"><span class="material-icons">edit</span></button>
            <button class="delete-topic-btn" title="Delete"><span class="material-icons">delete</span></button>
          </div>
        </div>
      `;
    }).join('');
    attachListListeners();
  }

  // 6️⃣ Listener für Edit/Delete
  function attachListListeners() {
    // Edit
    listContainer.querySelectorAll('.edit-topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = (btn as HTMLElement).closest('.topic-item')!;
        editingTopicId = +item.dataset.id!;
        const topic = topics.find(t => t.Id === editingTopicId)!;

        // Form befüllen
        nameInput.value       = topic.Name;
        colorInput.value      = (topic as any).color    || '#3A8DFF';
        iconInput.value       = (topic as any).icon     || '';
        autoDeleteInput.value = String((topic as any).autoDelete ?? 0);

        submitBtn.textContent = 'Save Changes';
        titleEl.textContent   = 'Edit Topic';
      });
    });

    // Delete
    listContainer.querySelectorAll('.delete-topic-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const item = (btn as HTMLElement).closest('.topic-item')!;
        const id   = +item.dataset.id!;
        await deleteTopic(id);

        // Neu laden
        topics = await fetchTopics(userId);
        renderTopicList();
      });
    });
  }

  // 7️⃣ Form-Handling (Create & Update)
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = { Name: nameInput.value.trim() };

    if (editingTopicId !== null) {
      // Update
      const fullDto: TopicDto = { Id: editingTopicId, Name: payload.Name, Tasks: [] };
      await updateTopic(editingTopicId, fullDto);
    } else {
      // Create
      await createTopic(payload);
    }

    // Reset form & UI
    editingTopicId = null;
    submitBtn.textContent = 'Add Topic';
    titleEl.textContent   = 'Topics';
    form.reset();

    // Liste neu holen und rendern
    topics = await fetchTopics(userId);
    renderTopicList();
  });

  // 8️⃣ Erstaufruf
  renderTopicList();
}

// Function to use dummy data when backend data is not available
function useDummyData(): void {
  console.log('Using dummy data for topics');
  const container = document.querySelector('.topics-container') as HTMLElement;
  if (!container) {
    console.error('Could not find topics-container element');
    return;
  }
  
  const data = {
    topics: [
      { Id: 1, Name: "Work", color: "#3A8DFF", icon: "work", autoDelete: 7, created: "2025-06-01", Tasks: [] },
      { Id: 2, Name: "Personal", color: "#FF6B6B", icon: "person", autoDelete: 0, created: "2025-06-01", Tasks: [] }
    ],
    tasks: [
      { id: 1, topicId: 1 },
      { id: 2, topicId: 1 },
      { id: 3, topicId: 2 }
    ]
  };

  // Assign tasks to topics for counting
  data.topics.forEach(topic => {
    topic.Tasks = data.tasks.filter(task => task.topicId === topic.Id);
  });

  container.innerHTML = `
    <h2 id="topics-title">Topics (Test Data)</h2>
    <form id="topicForm">
      <label for="topicName">Name:</label>
      <input type="text" id="topicName" name="name" maxlength="50" required />

      <label for="topicColor">Color:</label>
      <input type="color" id="topicColor" name="color" value="#3A8DFF" />

      <label for="topicIcon">Icon (Material Icon name or emoji):</label>
      <input type="text" id="topicIcon" name="icon" placeholder="e.g. work or school" />

      <label for="topicAutoDelete">Auto-delete after (days):</label>
      <input type="number" id="topicAutoDelete" name="autoDelete" value="0" min="0" />

      <button type="submit" class="button" id="topic-submit-btn">Add Topic</button>
    </form>

    <h3>Existing Topics</h3>
    <div id="topicsList">
      ${data.topics.map(t => {
        const taskCount = t.Tasks?.length ?? 0;
        return `
          <div class="topic-item" data-id="${t.Id}">
            <div class="topic-icon">
              <span class="material-icons">${t.icon || 'category'}</span>
            </div>
            <div class="topic-name">${t.Name}</div>
            <div class="topic-stats">${taskCount} task(s)</div>
            <div class="topic-actions">
              <button class="edit-topic-btn" title="Edit"><span class="material-icons">edit</span></button>
              <button class="delete-topic-btn" title="Delete"><span class="material-icons">delete</span></button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Add event listeners
  document.getElementById("topicForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Topic creation not implemented (test data only)");
  });

  // Attach listeners for edit/delete buttons
  const listContainer = document.getElementById('topicsList');
  if (listContainer) {
    // Edit buttons
    listContainer.querySelectorAll('.edit-topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = (btn as HTMLElement).closest('.topic-item')!;
        const id = +item.dataset.id!;
        const topic = data.topics.find(t => t.Id === id)!;

        // Form befüllen
        const nameInput = document.getElementById('topicName') as HTMLInputElement;
        const colorInput = document.getElementById('topicColor') as HTMLInputElement;
        const iconInput = document.getElementById('topicIcon') as HTMLInputElement;
        const autoDeleteInput = document.getElementById('topicAutoDelete') as HTMLInputElement;

        if (nameInput && colorInput && iconInput && autoDeleteInput) {
          nameInput.value = topic.Name;
          colorInput.value = topic.color || '#3A8DFF';
          iconInput.value = topic.icon || '';
          autoDeleteInput.value = String(topic.autoDelete ?? 0);
        }
        
        const submitBtn = document.getElementById('topic-submit-btn');
        const titleEl = document.getElementById('topics-title');
        
        if (submitBtn) submitBtn.textContent = 'Save Changes';
        if (titleEl) titleEl.textContent = 'Edit Topic';
      });
    });

    // Delete buttons
    listContainer.querySelectorAll('.delete-topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        alert("Delete functionality not implemented (test data only)");
      });
    });
  }
}
