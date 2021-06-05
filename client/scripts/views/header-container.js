import AbstractView from "./abstract-view.js";

const createHeaderContainerTemplate = () => {
  return `
    <header class="header"></header>
  `;
};

export default class HeaderContainer extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createHeaderContainerTemplate();
  }
}
