import AbstractView from "./abstract-view.js";

const createFormErrorTemplate = (error) => {
  return `
        <p class="form-errors__item">
            ${error}
        </p>
  `;
};

const createFormErrorsTemplate = (errors) => {
  const errorsGroup = errors
    .map((error) => {
      return createFormErrorTemplate(error);
    })
    .join(``);

  return `
    <div>
      ${errorsGroup}
    </div>
  `;
};

export default class FormErrors extends AbstractView {
  constructor(errors) {
    super();

    this._errors = errors;
  }

  getTemplate() {
    return createFormErrorsTemplate(this._errors);
  }
}
