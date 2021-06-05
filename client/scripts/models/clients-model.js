import Observer from "../utils/observer.js";

import { SortType } from "../const.js";

export default class ClientsModel extends Observer {
  constructor() {
    super();

    this._clients = [];

    this._currentPage = 1;
    this._pages = 1;

    this._currentClient = null;

    this._currentSortType = SortType.ID_UP;

    this._currentModalMode = null;
  }

  getCurrentPage() {
    return this._currentPage;
  }

  getPagesCount() {
    return this._pages;
  }

  setIsClientsLoading(updateType, update) {
    this._notify(updateType, update);
  }

  getClient(id) {
    return this._clients[id];
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

  setSortType(updateType, sortType) {
    this._currentSortType = sortType;
    this._notify(updateType, { isLoading: false });
  }

  setCurrentModalMode(updateType, currentModalMode) {
    this._currentModalMode = currentModalMode;
    this._notify(updateType, { isLoading: false });
  }

  getCurrentModalMode() {
    return this._currentModalMode;
  }

  getCurrentSortType() {
    return this._currentSortType;
  }

  setCurrentClient(response) {
    this._currentClient = response;
  }

  getCurrentClient() {
    return this._currentClient;
  }

  resetCurrentModalMode(updateType) {
    this._currentModalMode = null;
    this._notify(updateType);
  }

  resetCurrentClient() {
    this._currentClient = null;
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

    this._notify(updateType, update);
  }

  deleteClient(updateType, update) {
    const index = this._clients.findIndex((client) => client._id === update);

    if (index === -1) return;

    this._clients = [
      ...this._clients.slice(0, index),
      ...this._clients.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
