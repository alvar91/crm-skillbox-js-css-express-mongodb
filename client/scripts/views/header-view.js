import AbstractView from "./abstract-view.js";
import { debounce } from "../utils/debounce.js";

const createHeaderTemplate = () => `<div class="container header__inner">
  <a href="/"><img class="header__logo" src="/images/logo.svg" alt="SKB CRM" /></a>
  <div class="header__search-container">
    <form action="#" method="post">
      <input class="header__input js-search-input" type="text" placeholder="Введите запрос">
    </form>
    <div class="header__search"></div>
  </div>
</div>`;
export default class HeaderView extends AbstractView {
  constructor() {
    super();

    this.timer = { timerId: null };
  }

  _inputChangeHandler = (evt) => {
    if (!evt.target.classList.contains(`js-search-input`)) {
      return;
    }

    evt.preventDefault();
    this._handler.input(evt.target.value);
  };

  setInputHandler(handler) {
    this._handler.input = handler;

    this.getElement().addEventListener(`input`, (evt) =>
      debounce(this._inputChangeHandler, evt, 1000, this.timer)
    );
  }

  getHeaderContainer() {
    return this.getElement().querySelector(`.header__inner`);
  }

  getSearchContainer() {
    return this.getElement().querySelector(`.header__search`);
  }

  getTemplate() {
    return createHeaderTemplate();
  }
}
