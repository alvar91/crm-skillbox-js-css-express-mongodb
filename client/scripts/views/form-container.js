import AbstractView from "./abstract-view.js";

const formContainerTemplate = () => {
  return `<form class="form"></form>`;
};

export default class FormContainer extends AbstractView {
  getTemplate() {
    return formContainerTemplate();
  }
}
