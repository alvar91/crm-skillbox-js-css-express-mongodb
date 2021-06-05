import AbstractView from "./abstract-view.js";

const createNoSearchClientsTemplate = () => {
  return `
    <div>
      There are no clients in our database
    </div>
  `;
};

export default class NoSearchClients extends AbstractView {
  getTemplate() {
    return createNoSearchClientsTemplate();
  }
}
