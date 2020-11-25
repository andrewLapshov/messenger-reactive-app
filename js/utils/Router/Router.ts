import Route, { BlockType } from './Route';

export default class Router {
  private static __instance: Router;
  private readonly _rootQuery: string | undefined;
  routes: Route[] | undefined;
  redirects: { from: string; to: string }[] | undefined;
  history: History | undefined;
  private _currentRoute: Route | null | undefined;
  private _defaultRoute: string | null | undefined;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.redirects = [];
    this.history = window.history;
    this._currentRoute = null;
    this._defaultRoute = null;
    this._rootQuery = rootQuery;

    this.use = this.use.bind(this);
    this.useDefault = this.useDefault.bind(this);

    Router.__instance = this;
  }

  use(pathname: string, block: BlockType): Router {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes && this.routes.push(route);
    return Router.__instance;
  }

  useDefault(pathname: string, block: BlockType): Router {
    this._defaultRoute = pathname;
    return this.use(pathname, block);
  }

  redirect(from: string, to: string): Router {
    this.redirects && this.redirects.push({ from, to });
    return Router.__instance;
  }

  start() {
    window.onpopstate = ((event: PopStateEvent) => {
      this._onRoute((<Window>event?.currentTarget).location.pathname);
    }).bind(this);

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string): void {
    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    const redirectPath = this.getRedirect(pathname);
    if (redirectPath) {
      this.go(redirectPath.to);
      return;
    }
    const route = this.getRoute(pathname);

    if (!route) {
      this._defaultRoute ? this.go(this._defaultRoute) : null;
      return;
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history && this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history && this.history.back();
  }

  forward(): void {
    this.history && this.history.forward();
  }

  getRedirect(pathname: string): { from: string; to: string } | undefined {
    return this.redirects && this.redirects.find(({ from }) => from === pathname);
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes && this.routes.find(route => route.match(pathname));
  }
}
