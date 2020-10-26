import Route from "./Route";

export default class Router {
  constructor(rootQuery) {
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

  use(pathname, block) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return Router.__instance;
  }

  useDefault(pathname, block) {
    this._defaultRoute = pathname;
    return this.use(pathname, block);
  }

  redirect(from, to) {
    this.redirects.push({ from, to });
    return Router.__instance;
  }

  start() {
    window.onpopstate = ((event) => {
      this._onRoute(event.currentTarget.location.pathname);
    }).bind(this);

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname) {
    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    const redirectPath = this.getRedirect(pathname);
    if (redirectPath) {
      return this.go(redirectPath.to);
    }
    const route = this.getRoute(pathname);

    if (!route) {
      return this._defaultRoute ? this.go(this._defaultRoute) : null;
    }

    this._currentRoute = route;
    route.render(route, pathname);
  }

  go(pathname) {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRedirect(pathname) {
    return this.redirects.find(({ from }) => from === pathname);
  }

  getRoute(pathname) {
    return this.routes.find((route) => route.match(pathname));
  }
}
