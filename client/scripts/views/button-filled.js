import SmartView from "./smart.js";
import { State } from "../const.js";

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
};

const saveButtonTemplate = (title, { isAdding, isDisabled }) => {
  const editButtonText = isAdding
    ? `<div class="button-loader"></div><div>${title}</div>`
    : `${title}`;

  return `
    <div class="button-container">
        <button class="button-filled button-filled--save js-button" ${addDisabledProperty(
          isDisabled
        )}>
            ${editButtonText}
        </button>
    </div>
  `;
};

export default class FilledButton extends SmartView {
  constructor(title, isDisabled, client) {
    super();

    this._title = title;
    this._state = { isAdding: false, isDisabled };
    this._handler = {};
    this._client = client;
  }

  _clientClickHandler = (evt) => {
    evt.preventDefault();

    if (this._client) {
      this._handler.click(this._client);
    } else {
      this._handler.click();
    }
  };

  getTemplate() {
    return saveButtonTemplate(this._title, this._state);
  }

  restoreHandlers() {
    this.setClientClickHandler(this._handler.click);
  }

  setClientClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(`.js-button`)
      .addEventListener(`click`, this._clientClickHandler);
  }

  setViewState(state) {
    const resetFormState = () => {
      this.updateData({
        isAdding: false,
      });
    };

    switch (state) {
      case State.ADDING:
        this.updateData({
          isDisabled: true,
          isAdding: true,
        });
        break;
      case State.ABORTING:
        resetFormState();
        break;
    }

    this.updateElement();
  }
}
