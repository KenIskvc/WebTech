// src/pages/home/home.ts
import Alpine from 'alpinejs';

export interface Topic {
  id: number;
  name: string;
  color: string;
  icon?: string;
  created: string;
}

export interface Task {
  id: number;
  topicId: number;
  title: string;
  completed: boolean;
}

interface HomeData {
  topics: Topic[];
  tasks: Task[];
}

export default async function setupHome(): Promise<void> {
  console.log('✅ Home page loaded');

  // ─── 1️⃣ Burger-Menu (falls vorhanden) ──────────────────────────────
  const burgerBtn = document.getElementById('burgerBtn') as HTMLButtonElement | null;
  const sidebar   = document.querySelector('.sidebar')   as HTMLElement      | null;
  const overlay   = document.getElementById('overlay')   as HTMLElement      | null;
  if (burgerBtn && sidebar && overlay) {
    burgerBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // ─── 2️⃣ Auth & User-ID holen ────────────────────────────────────────
  const auth = Alpine.store('auth');
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  const userId = auth.user?.id;
  if (!userId) {
    console.error('🚨 Kein eingeloggter User gefunden – bitte Login!'); 
    return;
  }

  // ─── 3️⃣ Daten parallel vom Backend laden ───────────────────────────
  const [topicsRes, tasksRes] = await Promise.all([
    fetch(`/api/Topic?userId=${encodeURIComponent(userId)}`),
    fetch('/api/Task')
  ]);
  if (!topicsRes.ok || !tasksRes.ok) {
    console.error('🚨 Fehler beim Laden der Daten', { topicsRes, tasksRes });
    return;
  }
  const data: HomeData = {
    topics: await topicsRes.json(),
    tasks:  await tasksRes.json(),
  };

  // ─── 4️⃣ UI-Elemente & State ───────────────────────────────────────
  const searchInput    = document.getElementById('topicSearch')        as HTMLInputElement;
  const sortSelect     = document.getElementById('topicSort')          as HTMLSelectElement;
  const columnSelect   = document.getElementById('columnSelect')       as HTMLSelectElement;
  const newTopicBtn    = document.getElementById('newTopicBtn')        as HTMLButtonElement;
  const newTaskBtn     = document.getElementById('newTaskBtn')         as HTMLButtonElement;
  const cardsContainer = document.getElementById('topicCardsContainer') as HTMLElement;

  let searchTerm   = '';
  let sortKey: 'name' | 'date' = 'name';
  let topicColumns = 3;

  // Spalten-Dropdown nur einmal befüllen
  ['3','2','1'].forEach(val => {
    if (!Array.from(columnSelect.options).some(o => o.value === val)) {
      columnSelect.add(new Option(val, val));
    }
  });
  columnSelect.value = topicColumns.toString();

  // ─── 5️⃣ Render-Logik ───────────────────────────────────────────────
  function renderSingleTopicCard(topic: Topic): string {
    const topicTasks = data.tasks.filter(t => t.topicId === topic.id);
    const doneCount  = topicTasks.filter(t => t.completed).length;
    const tasksHTML  = topicTasks.map(task => `
      <li class="task-item${task.completed ? ' completed' : ''}" data-task-id="${task.id}">
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <span class="task-item-content${task.completed ? ' completed' : ''}">
          <span class="task-title">${task.title}</span>
        </span>
      </li>
    `).join('');

    return `
      <div class="topic-card" data-topic-id="${topic.id}" style="border:2.5px solid ${topic.color};">
        <div class="topic-header">
          <span class="material-icons">${topic.icon || 'category'}</span>
          ${topic.name}
          <button class="add-task-btn" data-topic-id="${topic.id}" title="Add Task">
            <span class="material-icons">add</span>
          </button>
        </div>
        <div class="topic-stats">${doneCount} / ${topicTasks.length} tasks done</div>
        <ul class="task-list">${tasksHTML}</ul>
      </div>
    `;
  }

  function renderTopicCards(): void {
    let list = data.topics.slice();
    if (searchTerm) {
      list = list.filter(t => t.name.toLowerCase().includes(searchTerm));
    }
    if (sortKey === 'name') {
      list.sort((a,b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a,b) => b.created.localeCompare(a.created));
    }

    cardsContainer.style.gridTemplateColumns = `repeat(${topicColumns},1fr)`;
    cardsContainer.innerHTML = list.map(renderSingleTopicCard).join('');
  }

  // ─── 6️⃣ Event-Delegation auf Kartencontainer ───────────────────────
  cardsContainer.addEventListener('click', e => {
    const target = e.target as HTMLElement;

    // ✔️ Task togglen
    const taskEl = target.closest('.task-item') as HTMLElement | null;
    if (taskEl) {
      const id = Number(taskEl.dataset.taskId);
      const task = data.tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        renderTopicCards();
      }
      return;
    }

    // ➕ Neue Task
    const addBtn = target.closest('.add-task-btn') as HTMLElement | null;
    if (addBtn) {
      const topicId = Number(addBtn.dataset.topicId);
      const title   = prompt('Enter new task title:');
      if (title) {
        data.tasks.push({ id: Date.now(), topicId, title, completed: false });
        renderTopicCards();
      }
    }
  });

  // ─── 7️⃣ Controls für Suche, Sort & Spalten ────────────────────────
  searchInput.addEventListener('input',  () => { searchTerm = searchInput.value.toLowerCase(); renderTopicCards(); });
  sortSelect.addEventListener('change',  () => { sortKey   = sortSelect.value as 'name'|'date'; renderTopicCards(); });
  columnSelect.addEventListener('change',() => { topicColumns = parseInt(columnSelect.value,10); renderTopicCards(); });

  newTopicBtn.addEventListener('click', () => { window.location.hash = '/topics'; });
  newTaskBtn.addEventListener('click', () => { window.location.hash = '/tasks'; });

  // ─── 8️⃣ Erstaufruf ────────────────────────────────────────────────
  renderTopicCards();
}
