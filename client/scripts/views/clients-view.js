import AbstractView from "./abstract-view.js";

const createFilmsSectionTemplate = () => {
  return `
    <div class="table__body"></div>
  `;
};

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
