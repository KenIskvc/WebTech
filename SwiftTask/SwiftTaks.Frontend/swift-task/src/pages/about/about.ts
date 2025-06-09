// TypeScript version of about.js
/*export function renderAboutPage(container: HTMLElement, data: any): void {
    container.innerHTML = `
    <h2>About</h2>
    <p>SwiftTask is a demo project created by three developers. Meet the team:</p>
    <div class="authors">
      <div class="author-card">
        <h3>Mishina Svetlana</h3>
        <p>Front-end Developer. Passionate about design and user experience.</p>
      </div>
      <div class="author-card">
        <h3>Atay Ihsan</h3>
        <p>I bin Bruno und I bin der Kameramann</p>
        <img src="Screenshot%202025-05-16%20120232.png" alt="Atay Ihsan"/>
      </div>
      <div class="author-card">
        <h3>Isakovic Kenan</h3>
        <p>Question answering machine. Ensures everything runs smoothly and on schedule.</p>
      </div>
    </div>
  `;
}
*/
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
