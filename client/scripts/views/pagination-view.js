import AbstractView from "./abstract-view.js";

export default class PaginationView extends AbstractView {
  constructor(currentPage = 0, pages = 0) {
    super();
    this._currentPage = currentPage;
    this._pages = pages;
  }

  getTemplate() {
    return `<div class="table_pagination">
        <p>Страница ${this._currentPage} из ${this._pages}</p>
        <button class="button button-filled button-filled--pagination" 
            ${this._currentPage - 1 < 1 ? "disabled" : ""}
        data-page="prev">&lt;</button>
        <button class="button button-filled button-filled--pagination" 
        ${this._currentPage + 1 > this._pages ? "disabled" : ""}
        data-page="next">&gt;</button>
    </div>`;
  }

  _clickHandler = (evt) => {
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }

    evt.preventDefault();

    this._handler.click(evt.target.dataset.page, this._currentPage);
  }

  setPaginationChangeHandler(handler) {
    this._handler.click = handler;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
