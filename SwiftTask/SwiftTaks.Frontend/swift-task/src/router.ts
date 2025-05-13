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
    window.location.hash = '/login';
  }
}

export function setupRoutes() {
  router.on({
    login: async () => {
      removePageAssets();
      const html = await fetch("/src/pages/login/login.html").then(res => res.text());
      document.getElementById("app")!.innerHTML = html;
      await loadPageAssets("login");
    },
    home: () => authGuard(async () => {
      removePageAssets();
      const html = await fetch("/src/pages/home/home.html").then(res => res.text());
      document.getElementById("app")!.innerHTML = html;
      await loadPageAssets("home");
    }),
    profile: () => authGuard(async () => {
      removePageAssets();
      const html = await fetch("/src/pages/profile/profile.html").then(res => res.text());
      document.getElementById("app")!.innerHTML = html;
      await loadPageAssets("profile");
    })
  }).resolve();
}
// export function setupRoutes() {
//     router.on({
//         home: async () => {
//             removePageAssets();
//             const html = await fetch("/src/pages/home/home.html").then(res => res.text());
//             document.getElementById("app")!.innerHTML = html;
//             await loadPageAssets("home");
//         },
//         profile: async () => {
//             removePageAssets();
//             const html = await fetch("/src/pages/profile/profile.html").then(res => res.text());
//             document.getElementById("app")!.innerHTML = html;
//             await loadPageAssets("profile");
//         },
//         login: async () => {
//             removePageAssets();
//             const html = await fetch("/src/pages/login/login.html").then(res => res.text());
//             document.getElementById("app")!.innerHTML = html;
//             await loadPageAssets("login");
//         }
//     }).resolve();
// }

function loadPageAssets(page: string) {
    const promises: Promise<any>[] = [];

    // Load CSS
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `/src/pages/${page}/${page}.css`;
    css.id = "page-style";
    document.head.appendChild(css);

    // Load JS
    const js = document.createElement("script");
    js.type = "module";
    js.src = `/src/pages/${page}/${page}.ts`;
    js.id = "page-script";
    document.body.appendChild(js);

    return Promise.all(promises);
}

function removePageAssets() {
    const oldStyle = document.getElementById("page-style");
    const oldScript = document.getElementById("page-script");

    if (oldStyle) oldStyle.remove();
    if (oldScript) oldScript.remove();
}


export { router };
