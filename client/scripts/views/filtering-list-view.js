import AbstractView from "./abstract-view.js";
import { FilterType } from "../const.js";
import { debounce } from "../utils/debounce.js";

const getFilterValue = (filters, filterType) => {
  for (const filter of filters) {
    if (filter.type === filterType) {
      return filter.value;
    }
  }
};

const createFilteringListTemplate = (filters) => {
  return `
  <div class="table__thead">
    <div class="table__inner">
      <input value="${getFilterValue(
        filters,
        FilterType.ID
      )}" class="table__id filtration__input" type="text" data-filter-type="${
    FilterType.ID
  }" />
      <input value="${getFilterValue(
        filters,
        FilterType.FIO
      )}" class="table__name filtration__input" type="text" data-filter-type="${
    FilterType.FIO
  }" />
      <button class="button-filled">Очистить фильтры</button>
    </div>
  </div>
  `;
};

export default class FilteringList extends AbstractView {
  constructor(filters = []) {
    super();

    this._filters = filters;
    this.timer = { timerId: null };
  }

  _filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const eventFilterType = evt.target.dataset.filterType;
    const eventFilterValue = evt.target.value;

    this._handler.filterTypeChange(eventFilterType, eventFilterValue);
  };

  _resetHandler = (evt) => {
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }

    evt.preventDefault();

    this._handler.click();
  };

  getTemplate() {
    return createFilteringListTemplate(this._filters);
  }

  setFilterTypeChangeHandler(handler) {
    this._handler.filterTypeChange = handler;

    this.getElement().addEventListener(`input`, (evt) =>
      debounce(this._filterTypeChangeHandler, evt, 1000, this.timer)
    );
  }

  setFilterTypeResetHandler(handler) {
    this._handler.click = handler;

    this.getElement().addEventListener(`click`, this._resetHandler);
  }
}
