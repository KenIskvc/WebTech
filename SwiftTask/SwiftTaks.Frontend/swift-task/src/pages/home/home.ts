// src/pages/home/home.ts
import Alpine from 'alpinejs';
import { router } from '../../router';

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
  // const burgerBtn = document.getElementById('burgerBtn') as HTMLButtonElement | null;
  // const sidebar   = document.querySelector('.sidebar')   as HTMLElement      | null;
  // const overlay   = document.getElementById('overlay')   as HTMLElement      | null;
  // if (burgerBtn && sidebar && overlay) {
  //   burgerBtn.addEventListener('click', () => {
  //     sidebar.classList.toggle('open');
  //     overlay.classList.toggle('show');
  //   });
  //   overlay.addEventListener('click', () => {
  //     sidebar.classList.remove('open');
  //     overlay.classList.remove('show');
  //   });
  // }
  // ─── 2️⃣ Auth & User-ID holen ────────────────────────────────────────
  const auth = Alpine.store('auth');
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  const userId = auth.user?.id;
  if (!userId) {
    console.error('🚨 Kein eingeloggter User gefunden – bitte Login!'); 
    // Dummy-Daten für Test anzeigen
    useDummyData();
    return;
  }  // ─── 3️⃣ Daten parallel vom Backend laden ───────────────────────────
  let data: HomeData;
  
  try {
    const [topicsRes, tasksRes] = await Promise.all([
      fetch(`/api/Topic?userId=${encodeURIComponent(userId)}`),
      fetch('/api/Task')
    ]);
    
    if (!topicsRes.ok || !tasksRes.ok) {
      console.error('🚨 Fehler beim Laden der Daten', { topicsRes, tasksRes });
      console.log('Zeige Dummy-Daten aufgrund von API-Fehlern');
      useDummyData();
      return;
    }
    
    data = {
      topics: await topicsRes.json(),
      tasks:  await tasksRes.json(),
    };
    
    // Prüfen, ob Daten valide sind
    if (!Array.isArray(data.topics) || !Array.isArray(data.tasks)) {
      console.error('🚨 Unerwartetes Datenformat vom API', data);
      useDummyData();
      return;
    }
  } catch (error) {
    console.error('🚨 Exception beim Laden der Daten', error);
    useDummyData();
    return;
  }
  // ─── 4️⃣ UI-Elemente & State ───────────────────────────────────────
  const searchInput    = document.getElementById('topicSearch')        as HTMLInputElement;
  const sortSelect     = document.getElementById('topicSort')          as HTMLSelectElement;
  const columnSelect   = document.getElementById('columnSelect')       as HTMLSelectElement;
  const cardsContainer = document.getElementById('topicCardsContainer') as HTMLElement;

  let searchTerm   = '';
  let sortKey: 'name' | 'date' = 'name';
  let topicColumns = getMaxColumnsForScreenSize();

  // Hilfsfunktion für maximale Spaltenanzahl basierend auf Bildschirmbreite
  function getMaxColumnsForScreenSize(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      return Math.min(2, 3); // Max 2 columns on small screens
    }
    return 3; // Default: 3 columns on large screens
  }
  
  // Spalten-Dropdown mit den verfügbaren Optionen befüllen
  function updateColumnDropdown() {
    // Dropdown leeren
    columnSelect.innerHTML = '';
    
    // Maximale Anzahl an Spalten für aktuelle Bildschirmgröße bestimmen
    const maxColumns = getMaxColumnsForScreenSize();
    
    // Dropdown-Optionen basierend auf maxColumns befüllen
    for (let i = maxColumns; i >= 1; i--) {
      columnSelect.add(new Option(i.toString(), i.toString()));
    }
    
    // Aktuellen Wert setzen (aber nicht mehr als maxColumns)
    topicColumns = Math.min(topicColumns, maxColumns);
    columnSelect.value = topicColumns.toString();
  }
  
  // Initialisierung
  updateColumnDropdown();
  
  // Event-Listener für Fenstergröße
  window.addEventListener('resize', () => {
    const oldMaxColumns = getMaxColumnsForScreenSize();
    // Warte kurz, bis sich die Fenstergröße stabilisiert hat
    setTimeout(() => {
      const newMaxColumns = getMaxColumnsForScreenSize();
      if (oldMaxColumns !== newMaxColumns) {
        // Aktualisiere Dropdown und Spalten, wenn sich die max. Spalten geändert haben
        updateColumnDropdown();
        renderTopicCards();
      }
    }, 250);
  });

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
  }  function renderTopicCards(): void {
    let list = data.topics.slice();
    
    // Filtern nach Suchbegriff
    if (searchTerm) {
      list = list.filter(t => t.name.toLowerCase().includes(searchTerm));
      console.log(`Filter angewendet: ${list.length} Topics gefunden für "${searchTerm}"`);
    }
    
    // Sortieren
    if (sortKey === 'name') {
      list.sort((a,b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a,b) => b.created.localeCompare(a.created));
    }

    cardsContainer.style.gridTemplateColumns = `repeat(${topicColumns},1fr)`;
    
    // Wenn keine Topics gefunden wurden (z.B. bei der Suche)
    if (list.length === 0) {
      if (searchTerm) {
        cardsContainer.innerHTML = `<div class="no-topics">Keine Topics mit "${searchTerm}" gefunden</div>`;
      } else {
        cardsContainer.innerHTML = `<div class="no-topics">Keine Topics vorhanden</div>`;
      }
      return;
    }
    
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
  searchInput.addEventListener('input', () => { 
    searchTerm = searchInput.value.toLowerCase(); 
    console.log(`Suche nach: ${searchTerm}`);
    renderTopicCards(); 
  });
  
  sortSelect.addEventListener('change',  () => { 
    sortKey = sortSelect.value as 'name'|'date'; 
    renderTopicCards(); 
  });
  
  columnSelect.addEventListener('change',() => { 
    topicColumns = parseInt(columnSelect.value,10); 
    renderTopicCards(); 
  });
    // Update links with Navigo
  router.updatePageLinks();



  // ─── 8️⃣ Erstaufruf ────────────────────────────────────────────────
  renderTopicCards();
}

// Funktion zum Anzeigen von Testdaten, wenn kein Login vorhanden ist
function useDummyData(): void {
  console.log('Zeige Dummy-Topic für UI-Test');
  
  // UI-Elemente referenzieren
  const searchInput = document.getElementById('topicSearch') as HTMLInputElement;
  const sortSelect = document.getElementById('topicSort') as HTMLSelectElement;
  const columnSelect = document.getElementById('columnSelect') as HTMLSelectElement;
  const cardsContainer = document.getElementById('topicCardsContainer') as HTMLElement;
  
  if (!cardsContainer) {
    console.error('Fehler: topicCardsContainer nicht gefunden');
    return;
  }
    // Mehrere Dummy-Topics mit Tasks für bessere Testbarkeit
  const dummyData: HomeData = {
    topics: [
      { 
        id: 1, 
        name: "Test-Topic", 
        color: "#4A90E2", 
        icon: "star", 
        created: "2025-06-09" 
      },
      { 
        id: 2, 
        name: "Projekt-Organisation", 
        color: "#27AE60", 
        icon: "assignment", 
        created: "2025-06-08" 
      },
      { 
        id: 3, 
        name: "Lernmaterialien", 
        color: "#E74C3C", 
        icon: "book", 
        created: "2025-06-07" 
      }
    ],
    tasks: [
      { id: 1, topicId: 1, title: "Task 1 (offen)", completed: false },
      { id: 2, topicId: 1, title: "Task 2 (erledigt)", completed: true },
      { id: 3, topicId: 2, title: "Zeitplan erstellen", completed: false },
      { id: 4, topicId: 2, title: "Team-Meeting planen", completed: true },
      { id: 5, topicId: 3, title: "JavaScript Tutorial ansehen", completed: false },
      { id: 6, topicId: 3, title: "TypeScript Dokumentation lesen", completed: true }
    ]
  };
  // Topic-Karten rendern für Dummy-Daten
  let searchTerm = '';
  let sortKey: 'name' | 'date' = 'name';
  let topicColumns = getMaxColumnsForDummyScreen();
  
  // Hilfsfunktion für maximale Spaltenanzahl basierend auf Bildschirmbreite
  function getMaxColumnsForDummyScreen(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      return Math.min(2, 3); // Max 2 columns on small screens
    }
    return 3; // Default: 3 columns on large screens
  }
  
  // Spalten-Dropdown mit den verfügbaren Optionen befüllen
  function updateDummyColumnDropdown() {
    if (!columnSelect) return;
    
    // Dropdown leeren
    columnSelect.innerHTML = '';
    
    // Maximale Anzahl an Spalten für aktuelle Bildschirmgröße bestimmen
    const maxColumns = getMaxColumnsForDummyScreen();
    
    // Dropdown-Optionen basierend auf maxColumns befüllen
    for (let i = maxColumns; i >= 1; i--) {
      columnSelect.add(new Option(i.toString(), i.toString()));
    }
    
    // Aktuellen Wert setzen (aber nicht mehr als maxColumns)
    topicColumns = Math.min(topicColumns, maxColumns);
    columnSelect.value = topicColumns.toString();
  }
  
  // Initialisierung
  updateDummyColumnDropdown();
  
  function renderDummyCards(): void {
    let list = dummyData.topics.slice();
    
    // Filtern nach Suchbegriff
    if (searchTerm) {
      list = list.filter(t => t.name.toLowerCase().includes(searchTerm));
    }
    
    // Sortieren
    if (sortKey === 'name') {
      list.sort((a,b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a,b) => b.created.localeCompare(a.created));
    }

    // Spaltenanzahl festlegen
    cardsContainer.style.gridTemplateColumns = `repeat(${topicColumns},1fr)`;
    
    // Wenn keine Topics gefunden wurden (z.B. bei der Suche)
    if (list.length === 0) {
      if (searchTerm) {
        cardsContainer.innerHTML = `<div class="no-topics">Keine Topics mit "${searchTerm}" gefunden</div>`;
      } else {
        cardsContainer.innerHTML = `<div class="no-topics">Keine Topics vorhanden</div>`;
      }
      return;
    }
    
    // Topic-Karten erzeugen
    const cardsHTML = list.map(topic => {
      const topicTasks = dummyData.tasks.filter(t => t.topicId === topic.id);
      const doneCount = topicTasks.filter(t => t.completed).length;
      
      const tasksHTML = topicTasks.map(task => `
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
            <span class="material-icons">${topic.icon}</span>
            ${topic.name}
            <button class="add-task-btn" data-topic-id="${topic.id}" title="Add Task">
              <span class="material-icons">add</span>
            </button>
          </div>
          <div class="topic-stats">${doneCount} / ${topicTasks.length} tasks done</div>
          <ul class="task-list">${tasksHTML}</ul>
        </div>
      `;
    }).join('');
    
    cardsContainer.innerHTML = cardsHTML;
    
    // Event-Handler für Checkboxen und Add-Buttons hinzufügen
    setupDummyEventHandlers();
  }
  
  function setupDummyEventHandlers(): void {
    // Add-Task Button-Handler
    cardsContainer.querySelectorAll('.add-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topicId = Number((e.currentTarget as HTMLElement).getAttribute('data-topic-id'));
        const title = prompt('Neuen Task-Titel eingeben:');
        if (title) {
          dummyData.tasks.push({ 
            id: Date.now(), 
            topicId: topicId, 
            title: title, 
            completed: false 
          });
          renderDummyCards();
        }
      });
    });
    
    // Checkbox-Handler für Tasks
    cardsContainer.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const taskItem = (e.target as HTMLElement).closest('.task-item');
        if (taskItem) {
          const taskId = Number(taskItem.getAttribute('data-task-id'));
          const task = dummyData.tasks.find(t => t.id === taskId);
          if (task) {
            task.completed = (e.target as HTMLInputElement).checked;
            renderDummyCards();
          }
        }
      });
    });
  }
  
  
  // Event-Listener für Suche in Dummy-Ansicht
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value.toLowerCase();
      console.log(`Suche in Dummy-Daten nach: ${searchTerm}`);
      renderDummyCards();
    });
  }
  
  // Event-Listener für Sortierung
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortKey = sortSelect.value as 'name'|'date';
      renderDummyCards();
    });
  }
    // Event-Listener für Spaltenanzahl
  if (columnSelect) {
    columnSelect.addEventListener('change', () => {
      topicColumns = parseInt(columnSelect.value, 10);
      renderDummyCards();
    });
  }
  
  // Event-Listener für Fenstergröße
  window.addEventListener('resize', () => {
    const oldMaxColumns = getMaxColumnsForDummyScreen();
    // Warte kurz, bis sich die Fenstergröße stabilisiert hat
    setTimeout(() => {
      const newMaxColumns = getMaxColumnsForDummyScreen();
      if (oldMaxColumns !== newMaxColumns) {
        // Aktualisiere Dropdown und Spalten, wenn sich die max. Spalten geändert haben
        updateDummyColumnDropdown();
        renderDummyCards();
      }
    }, 250);
  });
    // Erstaufruf
  renderDummyCards();
  
  // Update links with Navigo
  router.updatePageLinks();
}
