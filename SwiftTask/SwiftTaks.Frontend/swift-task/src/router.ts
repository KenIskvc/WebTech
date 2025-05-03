import Navigo from "navigo";

const router = new Navigo("/");

export function setupRoutes() {
    router.on({
        home: async () => {
            removePageAssets();
            const html = await fetch("/src/pages/home/home.html").then(res => res.text());
            document.getElementById("app")!.innerHTML = html;
            await loadPageAssets("home");
        },
        profile: async () => {
            removePageAssets();
            const html = await fetch("/src/pages/profile/profile.html").then(res => res.text());
            document.getElementById("app")!.innerHTML = html;
            await loadPageAssets("profile");
        }
    }).resolve();
}

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
