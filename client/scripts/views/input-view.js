import AbstractView from "./abstract-view.js";

const isRequiredTemplate = () => {
  return `<span class="form__required">*</span>`;
};

const isValidTemplate = (isTouched, isValid) => {
  return isTouched && !isValid ? `form__input--error` : ``;
};

const isFocusedTemplate = (value) => {
  return value.trim() ? `form__label--focused` : ``;
};

const inputFieldTemplate = (field) => {
  return `
  <div class="form__group">
    <input data-fieldid=${
      field.id
    } class="form__input js-input ${isValidTemplate(
    field.isTouched,
    field.isValid
  )} ${isFocusedTemplate(field.value)}" value="${field.value}" type="text">
    <label class="form__label">${field.title} ${
    field.required ? isRequiredTemplate() : ""
  }</label>
  </div>
  `;
};

export default class InputField extends AbstractView {
  constructor(field) {
    super();

    this._field = field;
    this._changeHandler = this._changeHandler.bind(this);
  }

  _changeHandler(evt) {
    evt.preventDefault();

    this._handler.change(evt.target.dataset.fieldid, evt.target.value);
  }

  getTemplate() {
    return inputFieldTemplate(this._field);
  }

  _setValid(evt) {
    evt.target.classList.remove(`form__input--error`);
  }

  setChangeHandler(handler) {
    this._handler.change = handler;

    this.getElement()
      .querySelector(".js-input")
      .addEventListener(`focusout`, this._changeHandler);

    this.getElement()
      .querySelector(".js-input")
      .addEventListener(`focus`, (evt) => this._setValid(evt));
  }
}
