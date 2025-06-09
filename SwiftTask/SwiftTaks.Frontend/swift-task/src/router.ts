import Navigo from "navigo";
import { mountLayout } from "./components/layout/layout";


const router = new Navigo("/");

async function authGuard(next: () => void) {
  const auth = window.Alpine.store("auth");
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  if (auth.isAuthenticated) {
    next();
  } else {
    router.navigate("/login");
  }
}

export function setupRoutes() {
  mountLayout();

  router
    .on({
      "/": () => router.navigate("/home"),

      login: async () => {
        removeLayout();
        await loadPage("login", false);
      },
      signup: async () => {
        removeLayout();
        await loadPage("signup", false);
      },
      sst: async () => {
        removeLayout();
        await loadPage("sst", false);
      },

      home: () => authGuard(() => loadPage("home", true)),
      profile: () => authGuard(() => loadPage("profile", true)),
      about: () => authGuard(() => loadPage("about", true)),
      dashboard: () => authGuard(() => loadPage("dashboard", true)),
      settings: () => authGuard(() => loadPage("settings", true)),
      tasks: () => authGuard(() => loadPage("tasks", true)),
      topics: () => authGuard(() => loadPage("topics", true)),
    })
    .resolve();

  router.notFound(() => {
    document.getElementById("app")!.innerHTML = "<h1>404 - Page Not Found</h1>";
  });
}

async function loadPage(page: string, useLayout = false) {
  removePageAssets();

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `/src/pages/${page}/${page}.css`;
  css.id = "page-style";
  document.head.appendChild(css);

  const html = await fetch(`/src/pages/${page}/${page}.html`).then((res) =>
    res.text()
  );

  const target = useLayout
    ? document.getElementById("app-content")
    : document.getElementById("app");
    
  if (!target) return console.error("Target container not found");

  target.innerHTML = html;

  const pageModules = import.meta.glob<{ default?: () => void }>('./pages/**/*.ts');
  const path = `./pages/${page}/${page}.ts`;

  try {
    const moduleLoader = pageModules[path];
    if (moduleLoader) {
      const module = await moduleLoader();
      module.default?.();
    } else {
      console.warn(`No module found for ${path}`);
    }
  } catch (e) {
    console.error(`Failed to load page logic for ${page}:`, e);
  }

  router.updatePageLinks();
}

function removePageAssets() {
  document.getElementById("page-style")?.remove();
  document.getElementById("page-script")?.remove();
}

function removeLayout() {
  document.getElementById("app")!.innerHTML = "";
}

export { router };
