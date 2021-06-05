import AbstractView from "./abstract-view.js";

const createTableBodyTemplate = () => {
  return `
    <div class="table__body"></div>
  `;
};

export default class TableBody extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createTableBodyTemplate();
  }
}
