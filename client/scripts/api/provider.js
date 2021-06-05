import Utils from "../utils/common.js";

export default class Provider {
  constructor(api, store) {
    this._api = api;
  }

  getClients(currentPage = 1) {
    if (Utils.isOnline()) {
      return this._api.getClients(currentPage).then((clients) => {
        return clients;
      });
    }

    return Promise.reject(new Error(`Fetch clients failed`));
  }

  searchClients(keyword) {
    if (Utils.isOnline()) {
      return this._api.searchClients(keyword).then((clients) => {
        return clients;
      });
    }

    return Promise.reject(new Error(`Fetch clients failed`));
  }

  getClient(clientId) {
    if (Utils.isOnline()) {
      return this._api.getClient(clientId).then((client) => {
        return client;
      });
    }

    return Promise.reject(new Error(`Fetch client failed`));
  }

  addClient(newClient) {
    if (Utils.isOnline()) {
      return this._api.addClient(newClient);
    }

    return Promise.reject(new Error(`Add client failed`));
  }

  deleteClient(client) {
    if (Utils.isOnline()) {
      return this._api.deleteClient(client);
    }

    return Promise.reject(new Error(`Delete client failed`));
  }

  updateClient(client) {
    if (Utils.isOnline()) {
      return this._api.updateClient(client).then((updatedClient) => {
        return updatedClient;
      });
    }

    return Promise.reject(new Error(`Update client failed`));
  }
}
