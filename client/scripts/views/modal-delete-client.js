import SmartView from "./smart.js";
import { State } from "../const.js";

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
};

const modalDeleteTemplate = ({ isAdding, isDisabled }) => {
  const editButtonText = isAdding
    ? `<div class="button-loader"></div><div>Удалить</div>`
    : `Удалить`;
  return `
    <div class="popup-delete">
        <h2 class="popup-delete__title">Удалить клиента</h2>
        <p class="popup-delete__text">Вы действительно хотите удалить данного клиента?</p>
        <div class="button-container">
                <button class="button-filled button-filled--save js-button" ${addDisabledProperty(
                  isDisabled
                )}>
                    ${editButtonText}
                </button>
            </div>
            <div class="button-container">
                <button class="button-link js-button-link" ${addDisabledProperty(
                  isAdding
                )}>
                    Отмена
                </button>
             </div>
        </div>
    </div>
  `;
};

export default class ModalDeleteClient extends SmartView {
  constructor(client) {
    super();
    this._client = client;
    this._state = { isAdding: false, isDisabled: false };
    this._handler = {};
  }

  _clientDeleteClickHandler = (evt) => {
    evt.preventDefault();

    this._handler.clickDelete(this._client);
  };

  _clientCancelClickHandler = (evt) => {
    evt.preventDefault();

    this._handler.clickCancel(this._client);
  };

  getTemplate() {
    return modalDeleteTemplate(this._state);
  }

  restoreHandlers() {
    this.setDeleteClickHandler(this._handler.clickDelete);
    this.setCancelClickHandler(this._handler.clickCancel);
  }

  setDeleteClickHandler(handler) {
    this._handler.clickDelete = handler;

    this.getElement()
      .querySelector(`.js-button`)
      .addEventListener(`click`, this._clientDeleteClickHandler);
  }

  setCancelClickHandler(handler) {
    this._handler.clickCancel = handler;

    this.getElement()
      .querySelector(`.js-button-link`)
      .addEventListener(`click`, this._clientCancelClickHandler);
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
          isDisabled: false,
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
