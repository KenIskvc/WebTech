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