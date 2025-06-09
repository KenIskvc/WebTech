export function mountLayout(): void {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div id="layout" class="layout">
      <header>
        <nav>SwiftTask - <a href="/home" data-navigo>Home</a> | <a href="/profile" data-navigo>Profile</a></nav>
      </header>
      <main id="app-content">
        <!-- Page content will go here -->
      </main>
    </div>
  `;
}
