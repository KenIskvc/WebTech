// src/pages/tasks/tasks.ts
/*import Alpine from 'alpinejs';
import { fetchTopics } from '../../services/topic-service';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../services/task-service';

interface Topic {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  topicId: number;
  dueDate?: string;
  priority?: 'low'|'medium'|'high';
  completed: boolean;
}

export default async function setupTasks(): Promise<void> {
  console.log('✅ Tasks page loaded');

  // ─── 1️⃣ Auth sicherstellen ──────────────────────────────────────
  const auth = Alpine.store('auth');
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  const userId = auth.user?.id;
  if (!userId) {
    console.error('🚨 Kein eingeloggter User – bitte Login!');
    return;
  }

  // ─── 2️⃣ Daten laden ─────────────────────────────────────────────
  let topics: Topic[] = await fetchTopics(userId);
  let tasks:  Task[] = await fetchTasks();

  // ─── 3️⃣ UI-Elemente & State ────────────────────────────────────
  const taskSearch        = document.getElementById('taskSearch')        as HTMLInputElement;
  const topicFilter       = document.getElementById('topicFilter')       as HTMLSelectElement;
  const statusFilter      = document.getElementById('statusFilter')      as HTMLSelectElement;
  const taskFormContainer = document.getElementById('taskFormContainer') as HTMLDivElement;
  const taskForm          = document.getElementById('taskForm')          as HTMLFormElement;
  const formTitle         = document.getElementById('form-title')        as HTMLElement;
  const taskTitleInput    = document.getElementById('taskTitle')        as HTMLInputElement;
  const taskTopicSelect   = document.getElementById('taskTopic')        as HTMLSelectElement;
  const taskDueDateInput  = document.getElementById('taskDueDate')      as HTMLInputElement;
  const taskPrioritySelect= document.getElementById('taskPriority')     as HTMLSelectElement;
  const taskCompletedChk  = document.getElementById('taskCompleted')    as HTMLInputElement;
  const cancelBtn         = document.getElementById('cancelTaskBtn')    as HTMLButtonElement;
  const taskListContainer = document.getElementById('taskListContainer')as HTMLDivElement;
  const newTaskBtn        = document.getElementById('newTaskBtn')       as HTMLButtonElement | null;

  let searchTerm = '';
  let topicFilterVal  = 'all';
  let statusFilterVal = 'all';
  let editingTaskId: number | null = null;

  // ─── 4️⃣ Dropdowns befüllen ─────────────────────────────────────
  function populateTopicDropdowns() {
    // Topic-Filter: behalte ersten "All Topics"
    const allOpt = topicFilter.options[0];
    topicFilter.innerHTML = '';
    topicFilter.append(allOpt);
    topics.forEach(t => {
      topicFilter.append(new Option(t.name, t.id.toString()));
    });

    // Form-Select
    taskTopicSelect.innerHTML = '';
    topics.forEach(t => {
      taskTopicSelect.append(new Option(t.name, t.id.toString()));
    });
  }
  populateTopicDropdowns();

  // ─── 5️⃣ Form-Steuerung ─────────────────────────────────────────
  function showTaskForm(isEdit = false) {
    taskFormContainer.classList.remove('hidden');
    formTitle.textContent = isEdit ? 'Edit Task' : 'Add New Task';
  }
  function hideTaskForm() {
    taskFormContainer.classList.add('hidden');
    taskForm.reset();
    editingTaskId = null;
  }
  cancelBtn.addEventListener('click', hideTaskForm);
  if (newTaskBtn) {
    newTaskBtn.addEventListener('click', () => {
      editingTaskId = null;
      showTaskForm(false);
    });
  }

  // ─── 6️⃣ Tasks rendern ───────────────────────────────────────────
  function renderTaskList() {
    // Filter
    let list = tasks.filter(t => {
      if (searchTerm && !t.title.toLowerCase().includes(searchTerm)) return false;
      if (topicFilterVal !== 'all' && t.topicId !== +topicFilterVal) return false;
      if (statusFilterVal === 'completed' && !t.completed) return false;
      if (statusFilterVal === 'active' && t.completed) return false;
      return true;
    });

    if (list.length === 0) {
      taskListContainer.innerHTML = `<div class="no-tasks">No tasks found</div>`;
      return;
    }

    taskListContainer.innerHTML = list.map(t => {
      const top = topics.find(x => x.id === t.topicId);
      const color = top ? (top as any).color || '#ccc' : '#ccc';
      const due  = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '';
      return `
        <div class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
          <div class="task-checkbox">
            <input type="checkbox" ${t.completed ? 'checked' : ''} />
          </div>
          <div class="task-title">${t.title}</div>
          <div class="task-topic" style="background:${color}">${top?.name||'?'}</div>
          <div class="task-due">${due}</div>
          <div class="task-actions">
            <button class="edit-task-btn" title="Edit"><span class="material-icons">edit</span></button>
            <button class="delete-task-btn" title="Delete"><span class="material-icons">delete</span></button>
          </div>
        </div>`;
    }).join('');

    attachTaskEventListeners();
  }

  function attachTaskEventListeners() {
    // Toggle done
    taskListContainer.querySelectorAll('.task-checkbox input').forEach(cb => {
      cb.addEventListener('change', async () => {
        const el = (cb as HTMLElement).closest('.task-item')!;
        const id = +el.getAttribute('data-id')!;
        const task = tasks.find(t => t.id === id)!;
        task.completed = (cb as HTMLInputElement).checked;
        // Persist
        await updateTask(id, task);
        renderTaskList();
      });
    });

    // Edit
    taskListContainer.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const el = (btn as HTMLElement).closest('.task-item')!;
        const id = +el.getAttribute('data-id')!;
        const task = tasks.find(t => t.id === id)!;
        editingTaskId = id;
        // Werte ins Formular
        taskTitleInput.value     = task.title;
        taskDueDateInput.value   = task.dueDate || '';
        taskPrioritySelect.value = task.priority || 'medium';
        taskCompletedChk.checked = task.completed;
        taskTopicSelect.value    = task.topicId.toString();
        showTaskForm(true);
      });
    });

    // Delete
    taskListContainer.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const el = (btn as HTMLElement).closest('.task-item')!;
        const id = +el.getAttribute('data-id')!;
        await deleteTask(id);
        tasks = await fetchTasks();
        renderTaskList();
      });
    });
  }

  // ─── 7️⃣ Form-Submit (Create & Update) ───────────────────────────
  taskForm.addEventListener('submit', async e => {
    e.preventDefault();
    const payload: Partial<Task> = {
      title: taskTitleInput.value.trim(),
      topicId: +taskTopicSelect.value,
      dueDate: taskDueDateInput.value || undefined,
      priority: taskPrioritySelect.value as Task['priority'],
      completed: taskCompletedChk.checked,
    };

    if (editingTaskId !== null) {
      // Update
      await updateTask(editingTaskId, { ...payload, id: editingTaskId } as Task);
    } else {
      // Create
      await createTask(payload as Omit<Task, 'id'>);
    }
    // Frisch laden und neu rendern
    tasks = await fetchTasks();
    populateTopicDropdowns();
    hideTaskForm();
    renderTaskList();
  });

  // ─── 8️⃣ Filter- und Such-Listener ───────────────────────────────
  taskSearch.addEventListener('input', () => {
    searchTerm = taskSearch.value.toLowerCase();
    renderTaskList();
  });
  topicFilter.addEventListener('change', () => {
    topicFilterVal = topicFilter.value;
    renderTaskList();
  });
  statusFilter.addEventListener('change', () => {
    statusFilterVal = statusFilter.value;
    renderTaskList();
  });

  // ─── 9️⃣ Erstaufruf ───────────────────────────────────────────────
  renderTaskList();
}
*/