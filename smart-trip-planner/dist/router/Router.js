export class Router {
    constructor() {
        this.routes = [];
        this.notFoundHandler = () => { };
    }
    add(path, handler) {
        const paramNames = [];
        const pattern = new RegExp("^" +
            path.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return "([^/]+)";
            }) +
            "$");
        this.routes.push({ pattern, handler, paramNames });
        return this;
    }
    onNotFound(handler) {
        this.notFoundHandler = handler;
        return this;
    }
    navigate(path) {
        location.hash = path;
        this.resolve(path);
    }
    init() {
        window.addEventListener("hashchange", () => {
            this.resolve(location.hash.slice(1) || "/");
        });
        document.addEventListener("click", (e) => {
            const target = e.target.closest("a[data-link]");
            if (target instanceof HTMLAnchorElement) {
                e.preventDefault();
                const href = target.getAttribute("href") ?? "#/";
                const path = href.startsWith("#") ? href.slice(1) : href;
                console.log("navigating to:", path);
                this.navigate(path);
            }
        });
        this.resolve(location.hash.slice(1) || "/");
    }
    resolve(path) {
        console.log("resolve called:", path);
        for (const route of this.routes) {
            const match = path.match(route.pattern);
            if (match) {
                console.log("matched route:", route.pattern);
                const params = {};
                route.paramNames.forEach((name, i) => {
                    params[name] = match[i + 1] ?? "";
                });
                route.handler(params);
                return;
            }
        }
        this.notFoundHandler();
    }
}
//# sourceMappingURL=Router.js.map