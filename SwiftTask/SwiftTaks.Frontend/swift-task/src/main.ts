//import "./style.css";
import swifttaskLogo from "/swifttask-icon.png";
import { setupRoutes } from "./router";
// import typescriptLogo from "./typescript.svg";
// import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.ts";

setupRoutes();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>    
    <a href="#">
      <img src="${swifttaskLogo}" class="logo vanilla" alt="SwitftTask logo" />
    </a>
    <h1>Swift Task</h1>
    <div class="card">
      <button type="button">Start</button>
    </div>
    <p class="read-the-docs">
      Welcome to your personal To-Do List Manager 😊
    </p>
  </div>
`;

// <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//<button id="counter" type="button"></button>

//setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
