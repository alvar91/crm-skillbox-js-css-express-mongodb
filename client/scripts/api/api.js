const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint) {
    this._endPoint = endPoint;
  }

  _load({
    url,
    method = RequestMethod.GET,
    body = null,
    headers = new Headers(),
  }) {
    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  addClient(client) {
    return this._load({
      url: `clients`,
      method: RequestMethod.POST,
      body: JSON.stringify(client),
      headers: new Headers({ "Content-Type": `application/json` }),
    })
      .then(Api.toJSON)
      .then(({ clients }) => {
        return { clients };
      });
  }

  static catchError(err) {
    throw err;
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  deleteClient(clientId) {
    return this._load({
      url: `client/${clientId}`,
      method: RequestMethod.DELETE,
    });
  }

  getClients(currentPage = 1) {
    return this._load({ url: `clients?pageNumber=${currentPage}` })
      .then(Api.toJSON)
      .then((clients) => clients);
  }

  searchClients(keyword) {
    return this._load({ url: `clients/find?keyword=${keyword}` })
      .then(Api.toJSON)
      .then((clients) => clients);
  }

  getClient(clientId) {
    if (!clientId) Promise.reject(new Error(`Client id is required`));

    return this._load({ url: `client/${clientId}` })
      .then(Api.toJSON)
      .then((client) => client);
  }

  static toJSON(response) {
    return response.json();
  }

  updateClient(client) {
    const _id = Object.values(client).find((item) => item.name === "_id").value;

    return this._load({
      url: `client/${_id}`,
      method: RequestMethod.PUT,
      body: JSON.stringify(client),
      headers: new Headers({ "Content-Type": `application/json` }),
    })
      .then(Api.toJSON)
      .then((response) => response);
  }
}
