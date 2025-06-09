// Interfaces for Topic and Task
interface TaskDto {
  Id: number;
  Description: string;
  IsDone: boolean;
  TopicName: string;
}

interface TopicDto {
  Id: number;
  Name: string;
  SwiftTaskUserId?: string;
  Tasks: TaskDto[];
}

import { fetchTopics } from '../../services/topic-service';

const topicCardsContainer = document.getElementById('topicCardsContainer') as HTMLDivElement;

function getUserId(): string | null {
  // @ts-ignore
  return window.Alpine?.store('auth')?.user?.id || null;
}

// SPA setup function for router
export default async function setupHomePage() {
  let currentSortAsc = true;

  const searchInput = document.getElementById('topicSearch') as HTMLInputElement;
  const sortBtn = document.createElement('button');
  sortBtn.textContent = 'Sort A-Z';
  sortBtn.type = 'button';
  sortBtn.className = 'button';

  // Remove the Date dropdown and add the sort button
  const controls = document.querySelector('.home-controls');
  const dateDropdown = document.getElementById('topicSort');
  if (dateDropdown) dateDropdown.remove();
  if (controls) controls.insertBefore(sortBtn, controls.querySelector('.column-toggle'));

  function renderTopics(topics: TopicDto[]) {
    topicCardsContainer.innerHTML = '';
    if (!topics.length) {
      topicCardsContainer.innerHTML = '<div class="no-topics">No topics found.</div>';
      return;
    }
    topics.forEach(topic => {
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.innerHTML = `
        <div class="topic-header">
          <span>${topic.Name}</span>
          <button class="add-task-btn" title="Add Task">+</button>
        </div>
        <div class="topic-stats">${topic.Tasks?.length || 0} Tasks</div>
      `;
      topicCardsContainer.appendChild(card);
    });
  }

  function filterAndRender() {
    let filtered: TopicDto[] = (window as any)._allTopics ?? [];
    const search = searchInput?.value.trim().toLowerCase() || '';
    if (search) {
      filtered = filtered.filter((t: TopicDto) => t.Name.toLowerCase().includes(search));
    }
    filtered = filtered.slice().sort((a: TopicDto, b: TopicDto) => {
      if (a.Name < b.Name) return currentSortAsc ? -1 : 1;
      if (a.Name > b.Name) return currentSortAsc ? 1 : -1;
      return 0;
    });
    renderTopics(filtered);
  }
  // Expose filterAndRender for SPA reloads
  (window as any)._filterAndRender = filterAndRender;

  searchInput?.addEventListener('input', filterAndRender);
  sortBtn.addEventListener('click', () => {
    currentSortAsc = !currentSortAsc;
    sortBtn.textContent = currentSortAsc ? 'Sort A-Z' : 'Sort Z-A';
    filterAndRender();
  });

  // Column dropdown logic
  const columnSelect = document.getElementById('columnSelect') as HTMLSelectElement;
  function updateColumnOptions() {
    if (!columnSelect) return;
    const isSmall = window.innerWidth <= 768;
    columnSelect.innerHTML = '';
    const options = isSmall ? [1, 2] : [1, 2, 3];
    options.forEach(num => {
      const opt = document.createElement('option');
      opt.value = String(num);
      opt.textContent = String(num);
      columnSelect.appendChild(opt);
    });
    // If current value is not allowed, set to max allowed
    if (!options.includes(Number(columnSelect.value))) {
      columnSelect.value = String(options[options.length - 1]);
      setColumns(Number(columnSelect.value));
    }
  }
  function setColumns(cols: number) {
    topicCardsContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  }
  function columnChangeHandler() {
    setColumns(Number(columnSelect.value));
  }
  function resizeHandler() {
    updateColumnOptions();
    setColumns(Number(columnSelect.value));
  }

  // Initial setup
  updateColumnOptions();
  setColumns(Number(columnSelect.value));

  // Remove any duplicate event listeners by resetting them
  columnSelect?.removeEventListener('change', columnChangeHandler);
  columnSelect?.addEventListener('change', columnChangeHandler);
  window.removeEventListener('resize', resizeHandler);
  window.addEventListener('resize', resizeHandler);

  // Fetch and render topics
  await loadTopicsForUser();
}

async function loadTopicsForUser() {
  const userId = getUserId();
  if (!userId) {
    topicCardsContainer.innerHTML = '<div class="no-topics">Please log in.</div>';
    return;
  }
  try {
    let fetched = await fetchTopics(userId);
    // Patch: ensure all required fields are present and type-safe
    const safeTopics: TopicDto[] = (fetched ?? []).map(t => ({
      Id: t.Id,
      Name: t.Name ?? '',
      SwiftTaskUserId: t.SwiftTaskUserId,
      Tasks: (t.Tasks ?? []).map((task: any) => ({
        Id: task.Id,
        Description: task.Description ?? '',
        IsDone: task.IsDone ?? false,
        TopicName: task.TopicName ?? t.Name ?? ''
      }))
    }));
    // Use the SPA-scoped allTopics and renderTopics
    (window as any)._allTopics = safeTopics;
    // Call filterAndRender if available, else render directly
    if (typeof (window as any)._filterAndRender === 'function') {
      (window as any)._filterAndRender();
    } else {
      // fallback: render all topics
      topicCardsContainer.innerHTML = '';
      safeTopics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.innerHTML = `
          <div class="topic-header">
            <span>${topic.Name}</span>
            <button class="add-task-btn" title="Add Task">+</button>
          </div>
          <div class="topic-stats">${topic.Tasks?.length || 0} Tasks</div>
        `;
        topicCardsContainer.appendChild(card);
      });
    }
  } catch (e) {
    topicCardsContainer.innerHTML = `<div class="no-topics">Error loading topics: ${e}</div>`;
  }
}

