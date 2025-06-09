/*import { fetchTopics } from '../../services/topic-service';
import { fetchTasks } from '../../services/task-service';

export default async function setupDashboard() {
    console.log("✅ Dashboard loaded");

    // Get userId from auth
    const userId = window.Alpine?.store('auth')?.user?.Id;
    if (!userId) {
        document.getElementById('user-count')!.textContent = '0';
        document.getElementById('topic-count')!.textContent = '0';
        document.getElementById('task-count')!.textContent = '0';
        document.getElementById('completion-percent')!.textContent = '0%';
        document.getElementById('completion-bar')!.style.width = '0%';
        return;
    }

    // Fetch topics and tasks from backend
    let topics = [];
    let tasks = [];
    try {
        topics = await fetchTopics(userId);
        tasks = await fetchTasks();
    } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
    }

    // Compute stats
    const userCount = 1; // Only current user is shown
    const totalTopics = topics.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.IsDone).length;
    const completionPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update the HTML elements
    document.getElementById('user-count')!.textContent = userCount.toString();
    document.getElementById('topic-count')!.textContent = totalTopics.toString();
    document.getElementById('task-count')!.textContent = totalTasks.toString();
    document.getElementById('completion-percent')!.textContent = `${completionPercent}%`;
    document.getElementById('completion-bar')!.style.width = `${completionPercent}%`;
}*/
