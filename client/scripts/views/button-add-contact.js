import AbstractView from "./abstract-view.js";

const createAddButtonTemplate = () => {
  return `
    <div class="contact-container">
      <button class="button-contact js-button-contact">
        <svg class="icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.99998 3.66671C6.63331 3.66671 6.33331 3.96671 6.33331 4.33337V6.33337H4.33331C3.96665 6.33337 3.66665 6.63337 3.66665 7.00004C3.66665 7.36671 3.96665 7.66671 4.33331 7.66671H6.33331V9.66671C6.33331 10.0334 6.63331 10.3334 6.99998 10.3334C7.36665 10.3334 7.66665 10.0334 7.66665 9.66671V7.66671H9.66665C10.0333 7.66671 10.3333 7.36671 10.3333 7.00004C10.3333 6.63337 10.0333 6.33337 9.66665 6.33337H7.66665V4.33337C7.66665 3.96671 7.36665 3.66671 6.99998 3.66671ZM6.99998 0.333374C3.31998 0.333374 0.333313 3.32004 0.333313 7.00004C0.333313 10.68 3.31998 13.6667 6.99998 13.6667C10.68 13.6667 13.6666 10.68 13.6666 7.00004C13.6666 3.32004 10.68 0.333374 6.99998 0.333374ZM6.99998 12.3334C4.05998 12.3334 1.66665 9.94004 1.66665 7.00004C1.66665 4.06004 4.05998 1.66671 6.99998 1.66671C9.93998 1.66671 12.3333 4.06004 12.3333 7.00004C12.3333 9.94004 9.93998 12.3334 6.99998 12.3334Z" fill="#9873FF"/>
        </svg>
          Добавить контакт
      </button>
    </div>
  `;
};

export default class AddButtonContact extends AbstractView {
  constructor() {
    super();
  }

  _clickHandler = (evt) => {
    evt.preventDefault();

    this._handler.click();
  };

  getTemplate() {
    return createAddButtonTemplate();
  }

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(".js-button-contact")
      .addEventListener(`click`, this._clickHandler);
  }

  getAddButtonContainer() {
    return this.getElement().querySelector(`.button-contact`).parentNode;
  }
}
