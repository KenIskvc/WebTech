//router.ts
import Navigo from "navigo";
import { mountLayout, setUpLayout } from "./components/layout/layout";
const router = new Navigo("/");

let layoutEventsBound = false;

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
  router
    .on({
      "/": () => router.navigate("/home"),

      login: () => navigateTo("login", { layout: false }),
      signup: () => navigateTo("signup", { layout: false }),
      sst: () => navigateTo("sst", { layout: false }),

      home: () => authGuard(() => navigateTo("home", { layout: true })),
      profile: () => authGuard(() => navigateTo("profile", { layout: true })),
      about: () => authGuard(() => navigateTo("about", { layout: true })),
      dashboard: () =>
        authGuard(() => navigateTo("dashboard", { layout: true })),
      settings: () => authGuard(() => navigateTo("settings", { layout: true })),
      tasks: () => authGuard(() => navigateTo("tasks", { layout: true })),
      topics: () => authGuard(() => navigateTo("topics", { layout: true })),
    })
    .notFound(() => {
      document.getElementById("app")!.innerHTML =
        "<h1>404 - Page Not Found</h1>";
    })
    .resolve();
  // router
  //   .on({
  //     "/": () => router.navigate("/home"),

  //     login: async () => {
  //       removeLayout();
  //       await loadPage("login", false);
  //     },
  //     signup: async () => {
  //       removeLayout();
  //       await loadPage("signup", false);
  //     },
  //     sst: async () => {
  //       removeLayout();
  //       await loadPage("sst", false);
  //     },

  //     home: () => authGuard(() => loadPage("home", true)),
  //     profile: () => authGuard(() => loadPage("profile", true)),
  //     about: () => authGuard(() => loadPage("about", true)),
  //     dashboard: () => authGuard(() => loadPage("dashboard", true)),
  //     settings: () => authGuard(() => loadPage("settings", true)),
  //     tasks: () => authGuard(() => loadPage("tasks", true)),
  //     topics: () => authGuard(() => loadPage("topics", true)),
  //   })
  //   .resolve();

  // router.notFound(() => {
  //   document.getElementById("app")!.innerHTML = "<h1>404 - Page Not Found</h1>";
  // });
}

export async function navigateTo(page: string, options?: { layout?: boolean }) {
  const useLayout = options?.layout ?? false;

  if (!useLayout) {
    removeLayout();
  }

  removePageAssets();

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `/src/pages/${page}/${page}.css`;
  css.id = "page-style";
  document.head.appendChild(css);

  const html = await fetch(`/src/pages/${page}/${page}.html`).then((res) =>
    res.text()
  );

  let target: HTMLElement;

  if (useLayout) {
    // Mount layout if not yet mounted
    if (!document.getElementById("app-content")) {
      mountLayout();
      layoutEventsBound = false;
    }

    const appContent = document.getElementById("app-content")!;
    const overlay = document.getElementById("overlay")!;

    appContent.innerHTML = html;

    // Reset sidebar/overlay state
    document.querySelector(".sidebar")?.classList.remove("open");
    overlay.classList.remove("show");

    if (!layoutEventsBound) {
      await setUpLayout();
      layoutEventsBound = true;
    }

    target = appContent;
  } else {
    target = document.getElementById("app")!;
    target.innerHTML = html;
  }

  const pageModules = import.meta.glob<{ default?: () => void }>(
    `./pages/**/*.ts`
  );
  const path = `./pages/${page}/${page}.ts`;

  try {
    const moduleLoader = pageModules[path];
    if (moduleLoader) {
      const module = await moduleLoader();
      module.default?.();
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
  layoutEventsBound = false;
}

export { router };
