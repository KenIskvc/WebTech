// src/pages/topics/topics.ts
/*import Alpine from 'alpinejs';
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
    return;
  }

  // 2️⃣ Topics vom Backend laden
  let topics: TopicDto[] = await fetchTopics(userId);

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
*/
export function renderTopicsPage(container: HTMLElement): void {
  const data = {
    topics: [
      { id: 1, name: "Work", color: "#3A8DFF", icon: "work", autoDelete: 7, created: "2025-06-01" },
      { id: 2, name: "Personal", color: "#FF6B6B", icon: "person", autoDelete: 0, created: "2025-06-01" }
    ],
    tasks: [
      { id: 1, topicId: 1 },
      { id: 2, topicId: 1 },
      { id: 3, topicId: 2 }
    ]
  };

  container.innerHTML = `
    <h2>Topics</h2>
    <form id="topicForm">
      <input type="text" id="topicName" placeholder="Name" required />
      <input type="color" id="topicColor" value="#3A8DFF" />
      <input type="text" id="topicIcon" placeholder="Icon (e.g. work)" />
      <input type="number" id="topicAutoDelete" placeholder="Auto delete (days)" min="0" />
      <button type="submit">Add Topic</button>
    </form>

    <div id="topicsList">
      ${data.topics.map(t => {
        const taskCount = data.tasks.filter(task => task.topicId === t.id).length;
        return `
          <div class="topic-card" style="border-left: 6px solid ${t.color};">
            <span class="material-icons">${t.icon}</span>
            <div>
              <strong>${t.name}</strong><br />
              <small>${taskCount} task(s)</small>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById("topicForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Topic creation not implemented (mock only)");
  });
}
