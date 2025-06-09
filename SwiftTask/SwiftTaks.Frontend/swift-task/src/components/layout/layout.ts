export function mountLayout(): void {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div id="layout" class="layout">
      <aside class="sidebar">
            <h1>SwiftTask</h1>
            <nav>
                <ul>
                  <li><a href="/home" data-navigo>Home</a></li>
                  <li><a href="/dashboard" data-navigo>Dashboard</a></li>
                  <li><a href="/tasks" data-navigo>Tasks</a></li>
                  <li><a href="/topics" data-navigo>Topics</a></li>
                </ul>
            </nav>
        </aside>
      <main id="app-content">
      </main>
    </div>
  `;
}
