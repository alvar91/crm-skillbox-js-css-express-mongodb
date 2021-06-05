import Observer from "../utils/observer.js";

export default class SearchModel extends Observer {
  constructor() {
    super();

    this._currentKeyword = "";
    this._clients = [];
  }

  getClients() {
    return this._clients;
  }

  getClientsCount() {
    return this._clients.length;
  }

  setClients(updateType, { clients, page, pages }) {
    this._currentPage = page;
    this._pages = pages;
    this._clients = clients.slice();

    this._notify(updateType, { isLoading: false });
  }

  resetClients(updateType) {
    this._clients = [];

    this._notify(updateType, { isLoading: false });
  }

  getCurrentKeyword() {
    return this._currentKeyword;
  }

  setCurrentKeyword(keyword) {
    this._currentKeyword = keyword;
  }

  resetCurrentKeyword() {
    this._currentKeyword = "";
  }

  updateClient(updateType, update) {
    const index = this._clients.findIndex(
      (client) => client._id === update._id
    );

    if (index === -1) return;

    this._clients = [
      ...this._clients.slice(0, index),
      update,
      ...this._clients.slice(index + 1),
    ];
  }

  deleteClient(updateType, update) {
    const index = this._clients.findIndex((client) => client._id === update);

    if (index === -1) return;

    this._clients = [
      ...this._clients.slice(0, index),
      ...this._clients.slice(index + 1),
    ];
  }
}
