// About Page – static info with placeholder team
export function renderAboutPage(container: HTMLElement, _data: any): void {
  container.innerHTML = `
    <section class="about-page">
      <h1>About SwiftTask</h1>
      <p>SwiftTask is a demo productivity app built as a team project.</p>

      <h2>Our Team</h2>
      <div class="authors">
        <div class="author-card">
          <h3>Developer One</h3>
          <p>Frontend specialist. Passionate about clean UI.</p>
        </div>
        <div class="author-card">
          <h3>Developer Two</h3>
          <p>Backend wizard. Loves building robust APIs.</p>
        </div>
        <div class="author-card">
          <h3>Developer Three</h3>
          <p>Team lead and debugger. Ensures timely delivery.</p>
        </div>
      </div>
    </section>
  `;
}
