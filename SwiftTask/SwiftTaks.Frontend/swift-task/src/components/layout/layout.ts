export function mountLayout(): void {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <header>
      <div class="header-left">
        <button id="burgerBtn" class="burger-btn material-icons">menu</button>
        <span class="logo1">SwiftTask</span>
      </div>
      <div class="header-right">
        <button id="darkToggle" class="dark-toggle material-icons">dark_mode</button>
      </div>
    </header>

    <div class="sidebar-layout">
      <aside class="sidebar">
        <nav class="nav">
          <ul>
            <li><a href="/home" data-navigo><span class="material-icons">home</span> Home</a></li>
            <li><a href="/tasks" data-navigo><span class="material-icons">checklist</span> Tasks</a></li>
            <li><a href="/dashboard" data-navigo><span class="material-icons">dashboard</span> Dashboard</a></li>
            <li><a href="/about" data-navigo><span class="material-icons">info</span> About</a></li>
            <li class="sidebar-profile">
              <a href="/profile" data-navigo><span class="material-icons">account_circle</span> Profile</a>
            </li>
            <li><a href="/settings" data-navigo><span class="material-icons">settings</span> Settings</a></li>
          </ul>
        </nav>
        <button class="logout-btn"><span class="material-icons">logout</span> Logout</button>
      </aside>

      <main id="app-content">
        <!-- Page content will be injected here -->
      </main>
    </div>
  `;
}
