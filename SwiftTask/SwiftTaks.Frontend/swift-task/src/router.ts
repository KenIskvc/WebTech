import Navigo from "navigo";

const router = new Navigo("/");

async function authGuard(next: () => void) {
  const auth = window.Alpine.store('auth');
  if (!auth.isAuthenticated) {
    await auth.init();
  }
  if (auth.isAuthenticated) {
    next();
  } else {
    router.navigate('/login');
  }
}

export function setupRoutes() {
  router.on({
    '/': () => router.navigate('/home'),

    login: async () => {
      await loadPage("login");
    },
    signup: async () => {
      await loadPage("signup");
    },
    sst: async() => {
      await loadPage("sst")
    },

    home: () => authGuard(() => loadPage("home")),
    profile: () => authGuard(() => loadPage("profile")),
     about: () => authGuard(() => loadPage("about")),
    dashboard: () => authGuard(() => loadPage("dashboard")),
    settings: () => authGuard(() => loadPage("settings")),
    tasks: () => authGuard(() => loadPage("tasks")),
    topics: () => authGuard(() => loadPage("topics"))
  }).resolve();

  router.notFound(() => {
    document.getElementById("app")!.innerHTML = "<h1>404 - Page Not Found</h1>";
  });
}

async function loadPage(page: string) {
  removePageAssets();

  const html = await fetch(`/src/pages/${page}/${page}.html`).then(res => res.text());
  document.getElementById("app")!.innerHTML = html;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `/src/pages/${page}/${page}.css`;
  css.id = "page-style";
  document.head.appendChild(css);

  const pageModules = import.meta.glob<{ default?: () => void }>('/src/pages/**/*.ts');
  const path = `/src/pages/${page}/${page}.ts`;

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
}

function removePageAssets() {
  document.getElementById("page-style")?.remove();
  document.getElementById("page-script")?.remove();
}


export { router };
