import AbstractView from "./abstract-view.js";

const createMainContainerTemplate = () => {
  return `<main class="main">
    <div class="container">
      <h1 class="heading__level-1">Клиенты</h1>
    <div class="table"></div>
  </main>
  `;
};

export default class MainContainer extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createMainContainerTemplate();
  }

  getMainTableContainer() {
    return document.querySelector(`.table`);
  }
}
