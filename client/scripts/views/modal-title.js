import AbstractView from "./abstract-view.js";

const getIdTemplate = (id) => {
  return `<span class="popup__id">ID: ${id}</span>`;
};

const modalTitleTemplate = (title, id) => {
  return `<h2 class="popup__title">${title} ${
    id ? getIdTemplate(id) : ""
  }</h2>`;
};

export default class ModalTitle extends AbstractView {
  constructor(title, id = null) {
    super();

    this._title = title;
    this._id = id;
  }

  getTemplate() {
    return modalTitleTemplate(this._title, this._id);
  }
}
