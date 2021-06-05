export default class Router {
  constructor(presenter) {
    this._presenter = presenter;
  }

  navigateTo = (url) => {
    if (url === location.pathname) return;

    history.pushState(null, null, url);
    this._router();
  };

  _isValidParam = (arrPathname) => {
    return arrPathname.length === 2 && arrPathname[1];
  };

  _router = () => {
    const arrPathname = location.pathname.split(`/`).slice(1);

    if (arrPathname[0] === `page` && this._isValidParam(arrPathname)) {
      this._presenter.pageRoute(arrPathname[1]);
      return;
    }

    if (arrPathname[0] === `client` && this._isValidParam(arrPathname)) {
      this._presenter.clientIdRoute(arrPathname[1]);
      return;
    }

    this.navigateTo(`/page/1`);
  };

  init() {
    window.addEventListener("popstate", this._router);
    this._router();
  }
}
