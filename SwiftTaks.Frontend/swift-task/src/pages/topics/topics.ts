import TopicService from './services/TopicService';

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

  // Removed editingId and edit logic



  async function loadTopics() {
    // if (!userId) {
    //   topicsList.innerHTML = '<p>Please log in.</p>';
    //   return;
    // }
    try {
      const topics = await TopicService.fetchTopics();
      console.log('Fetched topics:', topics);
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
      // Delete button only
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => handleDelete(topic.Id);
      div.appendChild(nameSpan);
      div.appendChild(delBtn);
      topicsList.appendChild(div);
    });
  }

  // Removed startEdit

  async function handleDelete(id: number) {
    if (!confirm('Delete this topic?')) return;
    try {
      await deleteTopic(id);
      await loadTopics();
    } catch (e) {
      alert('Error deleting topic: ' + e);
    }
  }

  // topicForm?.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   if (!userId) return alert('Not logged in');
  //   const name = topicNameInput.value.trim();
  //   if (!name) return alert('Name required');
  //   try {
  //     await createTopic({ Name: name, UserId: userId });
  //     topicForm.reset();
  //     await loadTopics();
  //   } catch (e) {
  //     alert('Error saving topic: ' + e);
  //   }
  // });

  // Initial load
  loadTopics();
}

