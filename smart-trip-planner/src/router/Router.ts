import type { RouteHandler } from "../models/types.js";

interface Route {
    pattern: RegExp;
    handler: RouteHandler;
    paramNames: string[];
}

export class Router {
    private routes: Route[] = [];
    private notFoundHandler: RouteHandler = () => { };

    add(path: string, handler: RouteHandler): this {
        const paramNames: string[] = [];
        const pattern = new RegExp(
            "^" +
            path.replace(/:([^/]+)/g, (_: string, name: string) => {
                paramNames.push(name);
                return "([^/]+)";
            }) +
            "$"
        );
        this.routes.push({ pattern, handler, paramNames });
        return this;
    }

    onNotFound(handler: RouteHandler): this {
        this.notFoundHandler = handler;
        return this;
    }

    navigate(path: string): void {
        location.hash = path;
        this.resolve(path);
    }

    init(): void {
        window.addEventListener("hashchange", () => {
            this.resolve(location.hash.slice(1) || "/");
        });

        document.addEventListener("click", (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a[data-link]");
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

    private resolve(path: string): void {
        console.log("resolve called:", path);
        for (const route of this.routes) {
            const match = path.match(route.pattern);
            if (match) {
                console.log("matched route:", route.pattern);
                const params: Record<string, string> = {};
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