import './newtask.css';

// Grab form elements
const form = document.getElementById('newTaskForm') as HTMLFormElement;
const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
const descriptionInput = document.getElementById('description') as HTMLInputElement;
const topicSelect = document.getElementById('topicName') as HTMLSelectElement;
const isDoneCheckbox = document.getElementById('isDone') as HTMLInputElement;
const errorDiv = document.getElementById('error') as HTMLDivElement;

// Load topics for the select dropdown
async function loadTopics() {
  try {
    const res = await fetch('/api/Topic');
    const topics = await res.json();
    topics.forEach((t: any) => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = t.name;
      topicSelect.appendChild(opt);
    });
  } catch (err) {
    errorDiv.textContent = 'Failed to load topics.';
  }
}

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorDiv.textContent = '';

  const payload = {
    description: descriptionInput.value,
    topicName: topicSelect.value,
    isDone: isDoneCheckbox.checked,
  };

  try {
    const res = await fetch('/api/Task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Server error');
    // On success, go back to home page
    window.location.href = '/home';
  } catch (err) {
    errorDiv.textContent = 'Error saving task.';
  }
});

// Handle cancel
cancelBtn.addEventListener('click', () => {
  window.location.href = '/home';
});

// Initialize
loadTopics();