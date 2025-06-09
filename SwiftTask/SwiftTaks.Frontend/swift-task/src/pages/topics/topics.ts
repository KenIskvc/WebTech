// src/pages/topics/topics.ts
import Alpine from 'alpinejs';
import { router } from '../../router';
import { fetchTopics, createTopic, updateTopic, deleteTopic } from '../../services/topic-service';
import { TopicDto } from '../../types/dtos';

// Interface for the form data
interface TopicFormData {
  name: string;
  color: string;
  icon: string;
  autoDelete: number;
}

// Interface for the enhanced topic with UI properties (extending the existing TopicDto)
interface EnhancedTopicDto {
  Id: number;
  Name: string;
  Tasks?: any[];
  color?: string;
  icon?: string;
  autoDelete?: number;
}

// Function to generate dummy topics when needed
function useDummyData(): EnhancedTopicDto[] {
  console.log('🔄 Using dummy topic data');
  return [
    {
      Id: 1,
      Name: 'Work',
      Tasks: [
        { Id: 1, Title: 'Finish presentation', IsDone: false },
        { Id: 2, Title: 'Call client', IsDone: true },
      ],
      color: '#E53935',
      icon: 'work',
      autoDelete: 0
    },
    {
      Id: 2,
      Name: 'Personal',
      Tasks: [
        { Id: 3, Title: 'Buy groceries', IsDone: false },
        { Id: 4, Title: 'Call mom', IsDone: false },
      ],
      color: '#43A047',
      icon: 'person',
      autoDelete: 7
    },
    {
      Id: 3,
      Name: 'Health',
      Tasks: [
        { Id: 5, Title: 'Morning run', IsDone: true },
        { Id: 6, Title: 'Take vitamins', IsDone: false },
      ],
      color: '#1E88E5',
      icon: 'local_hospital',
      autoDelete: 14
    }
  ];
}

export default async function setupTopics(): Promise<void> {
  console.log('✅ Topics page loaded');
  
  // Get auth store from Alpine
  const auth = Alpine.store('auth');
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  
  // State variables
  let topics: EnhancedTopicDto[] = [];
  let editingTopicId: number | null = null;
  let usingDummyData = false;
  
  const userId = auth.user?.id;
  if (!userId) {
    console.warn('⚠️ No logged-in user found - using dummy data');
    document.getElementById('topics-title')!.textContent = 'Topic Management (Demo Mode)';
    topics = useDummyData();
    usingDummyData = true;
  }
  
  // DOM Elements
  const topicForm = document.getElementById('topicForm') as HTMLFormElement;
  const topicNameInput = document.getElementById('topicName') as HTMLInputElement;
  const topicColorInput = document.getElementById('topicColor') as HTMLInputElement;
  const topicIconInput = document.getElementById('topicIcon') as HTMLInputElement;
  const topicAutoDeleteInput = document.getElementById('topicAutoDelete') as HTMLInputElement;
  const topicSubmitBtn = document.getElementById('topic-submit-btn') as HTMLButtonElement;
  const topicsList = document.getElementById('topicsList') as HTMLDivElement;
    // Load topics
  async function loadTopics() {
    if (usingDummyData) {
      renderTopics();
      return;
    }
    
    try {
      topics = await fetchTopics(userId!);
      
      // Check if the API returned a valid response
      if (!Array.isArray(topics)) {
        console.error('Invalid response from API, expected an array of topics but got:', topics);
        topicsList.innerHTML = '<p class="error">Error: Invalid response from API. Showing demo data instead.</p>';
        topics = useDummyData();
        usingDummyData = true;
        renderTopics();
        return;
      }
      
      // Enhance topics with UI properties if they don't have them
      topics = topics.map(topic => ({
        ...topic,
        color: topic.color || '#3A8DFF',
        icon: topic.icon || 'category',
        autoDelete: topic.autoDelete || 0
      }));
      
      renderTopics();
    } catch (error) {
      console.error('Error loading topics:', error);
      topicsList.innerHTML = '<p class="error">Error loading topics. Showing demo data instead.</p>';
      topics = useDummyData();
      usingDummyData = true;
      renderTopics();
    }
  }
    // Render topics list
  function renderTopics() {
    if (topics.length === 0) {
      topicsList.innerHTML = '<p class="no-topics">No topics exist. Create your first topic!</p>';
      return;
    }
    
    const topicsHtml = topics.map(topic => {
      // Handle case where Tasks might be null or undefined
      const taskCount = topic.Tasks && Array.isArray(topic.Tasks) ? topic.Tasks.length : 0;
      
      return `
      <div class="topic-item" data-id="${topic.Id}">
        <div class="topic-icon" style="color: ${topic.color || '#3A8DFF'}">
          <span class="material-icons">${topic.icon || 'category'}</span>
        </div>
        <div class="topic-name">${topic.Name}</div>
        <div class="topic-stats">${taskCount} Tasks</div>
        <div class="topic-actions">
          <button class="edit-topic-btn" data-id="${topic.Id}" title="Edit Topic">
            <span class="material-icons">edit</span>
          </button>
          <button class="delete-topic-btn" data-id="${topic.Id}" title="Delete Topic">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>
    `;
    }).join('');
    
    topicsList.innerHTML = topicsHtml;
    
    // Add event listeners to the buttons
    document.querySelectorAll('.edit-topic-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number((e.currentTarget as HTMLElement).dataset.id);
        startEditingTopic(id);
      });
    });
    
    document.querySelectorAll('.delete-topic-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number((e.currentTarget as HTMLElement).dataset.id);
        confirmDeleteTopic(id);
      });
    });
  }
  
  // Form reset
  function resetForm() {
    topicForm.reset();
    topicColorInput.value = '#3A8DFF';
    editingTopicId = null;
    topicSubmitBtn.textContent = 'Add Topic';
  }
  
  // Start editing a topic
  function startEditingTopic(id: number) {
    const topic = topics.find(t => t.Id === id);
    if (!topic) return;
    
    topicNameInput.value = topic.Name;
    topicColorInput.value = topic.color || '#3A8DFF';
    topicIconInput.value = topic.icon || '';
    topicAutoDeleteInput.value = String(topic.autoDelete || 0);
    
    editingTopicId = id;
    topicSubmitBtn.textContent = 'Update Topic';
    
    // Scroll to form
    topicForm.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Confirm topic deletion
  function confirmDeleteTopic(id: number) {
    const topic = topics.find(t => t.Id === id);
    if (!topic) return;
    
    if (confirm(`Do you really want to delete the topic "${topic.Name}"?`)) {
      handleDeleteTopic(id);
    }
  }
  
  // Handle topic deletion
  async function handleDeleteTopic(id: number) {
    if (usingDummyData) {
      // Handle deletion in dummy data
      topics = topics.filter(t => t.Id !== id);
      renderTopics();
      return;
    }
    
    try {
      await deleteTopic(id);
      topics = topics.filter(t => t.Id !== id);
      renderTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error deleting topic. Please try again later.');
    }
  }
    // Handle form submission (create or update)
  async function handleFormSubmit(e: Event) {
    e.preventDefault();
    
    const formData: TopicFormData = {
      name: topicNameInput.value.trim(),
      color: topicColorInput.value,
      icon: topicIconInput.value.trim(),
      autoDelete: parseInt(topicAutoDeleteInput.value, 10) || 0
    };
    
    if (!formData.name) {
      alert('Please enter a topic name!');
      return;
    }
    
    if (usingDummyData) {
      // Handle form submission with dummy data
      if (editingTopicId) {
        // Update existing dummy topic
        const index = topics.findIndex(t => t.Id === editingTopicId);
        if (index !== -1) {
          topics[index] = { 
            ...topics[index], 
            Name: formData.name,
            color: formData.color,
            icon: formData.icon,
            autoDelete: formData.autoDelete
          };
        }
      } else {
        // Create new dummy topic
        const newId = Math.max(0, ...topics.map(t => t.Id)) + 1;
        topics.push({
          Id: newId,
          Name: formData.name,
          Tasks: [],
          color: formData.color,
          icon: formData.icon,
          autoDelete: formData.autoDelete
        });
      }
      
      resetForm();
      renderTopics();
      return;
    }
    
    try {
      if (editingTopicId) {
        // Update existing topic - only send the required fields to match backend model
        const topicData = {
          Id: editingTopicId,
          Name: formData.name,
          SwiftTaskUserId: userId!
          // Don't include color, icon, or autoDelete since they don't exist in the backend model
        };
        
        await updateTopic(editingTopicId, topicData);
        console.log('Topic updated successfully');
        
        // Update local state for UI only
        const index = topics.findIndex(t => t.Id === editingTopicId);
        if (index !== -1) {
          topics[index] = { 
            ...topics[index], 
            Name: formData.name,
            // Store these locally for UI purposes only
            color: formData.color,
            icon: formData.icon,
            autoDelete: formData.autoDelete
          };
        }
        
        resetForm();
      } else {
        // Create new topic - only send the required fields to match backend model
        const topicData = {
          Name: formData.name,
          SwiftTaskUserId: userId!
          // Don't include color, icon, or autoDelete since they don't exist in the backend model
        };
        
        try {
          const newTopic = await createTopic(topicData);
          console.log('New topic created:', newTopic);
          
          // Add the UI-only properties to the returned topic for display purposes
          const enhancedTopic = {
            ...newTopic,
            // Store these locally for UI purposes only
            color: formData.color,
            icon: formData.icon,
            autoDelete: formData.autoDelete
          };
          
          topics.push(enhancedTopic);
          resetForm();
        } catch (createError) {
          console.error('Failed to create topic:', createError);
          alert(`Error creating topic: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
          return;
        }
      }
      
      renderTopics();
    } catch (error) {
      console.error('Error saving topic:', error);
      alert(`Error saving topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Add event listeners
  topicForm.addEventListener('submit', handleFormSubmit);
  
  // Load topics on page load
  if (!usingDummyData) {
    await loadTopics();
  } else {
    renderTopics();
  }
  
  // Update links with Navigo
  router.updatePageLinks();
}