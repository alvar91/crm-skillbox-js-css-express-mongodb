import AbstractView from "./abstract-view.js";
import { SortType } from "../const.js";

const createSortingListTemplate = (currentSortType) => {
  return `
  <div class="table__thead">
    <div class="table__inner">
    <div class="table__id">
          <a class="js-sort ${
            currentSortType === SortType.ID_UP ||
            currentSortType === SortType.ID_DOWN
              ? "table__sort"
              : ""
          }" href="#" 
          data-sort-type="${
            currentSortType === SortType.ID_DOWN ? "id-down" : "id-up"
          }">
              ID
              <svg class="${
                currentSortType === SortType.ID_DOWN ? "arrow-down" : ""
              }" width="8" height="8" viewbox="0 0 8 8" fill="none"
              xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                    fill="#9873FF" />
              </svg>
          </a>
      </div>
      <div class="table__name">
          <a class="js-sort ${
            currentSortType === SortType.NAME_UP ||
            currentSortType === SortType.NAME_DOWN
              ? "table__sort"
              : ""
          }" href="#" 
          data-sort-type="${
            currentSortType === SortType.NAME_DOWN ? "name-down" : "name-up"
          }">
              Фамилия Имя Отчество
              <span class="table__sort">
                <svg class="${
                  currentSortType === SortType.NAME_DOWN ? "arrow-down" : ""
                }" width="8" height="8" viewbox="0 0 8 8" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                        fill="#9873FF" />
                </svg>
                А-Я
            </span>
          </a>
      </div>
      <div class="table__date">
          <a class="js-sort ${
            currentSortType === SortType.DATE_CREATE_UP ||
            currentSortType === SortType.DATE_CREATE_DOWN
              ? "table__sort"
              : ""
          }" href="#"
          data-sort-type="${
            currentSortType === SortType.DATE_CREATE_DOWN
              ? "date-create-down"
              : "date-create-up"
          }">
              Дата и время<br class="brake">&nbsp;создания
              <svg class="${
                currentSortType === SortType.DATE_CREATE_DOWN
                  ? "arrow-down"
                  : ""
              }" width="8" height="8" viewbox="0 0 8 8" fill="none"
              xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                    fill="#9873FF" />
              </svg>
          </a>
      </div>
      <div class="table__date">
          <a class="js-sort ${
            currentSortType === SortType.DATE_UPDATE_UP ||
            currentSortType === SortType.DATE_UPDATE_DOWN
              ? "table__sort"
              : ""
          }" href="#"
            data-sort-type="${
              currentSortType === SortType.DATE_UPDATE_DOWN
                ? "date-update-down"
                : "date-update-up"
            }">
              Последние<br class="brake">&nbsp;изменения
                <svg class="${
                  currentSortType === SortType.DATE_UPDATE_DOWN
                    ? "arrow-down"
                    : ""
                }" width="8" height="8" viewbox="0 0 8 8" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                      fill="#9873FF" />
                </svg>
          </a>
      </div>
      <div class="table__contacts">Контакты</div>
      <div class="table__actions">Действия</div>
    </div>
    </div>
  `;
};

export default class TableHead extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentItem = null;
    this._currentSortType = currentSortType;
  }

  _sortTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const target = evt.target.closest(".js-sort");

    if (!target) return;

    const eventSortType = target.dataset.sortType;
    let newSortType = eventSortType;

    if (eventSortType === SortType.ID_UP) {
      newSortType = SortType.ID_DOWN;
      target.dataset.sortType = "id-down";
    } else if (eventSortType === SortType.ID_DOWN) {
      newSortType = SortType.ID_UP;
      target.dataset.sortType = "id-up";
    }

    if (eventSortType === SortType.NAME_UP) {
      newSortType = SortType.NAME_DOWN;
      target.dataset.sortType = "name-down";
    } else if (eventSortType === SortType.NAME_DOWN) {
      newSortType = SortType.NAME_UP;
      target.dataset.sortType = "name-up";
    }

    if (eventSortType === SortType.DATE_CREATE_UP) {
      newSortType = SortType.DATE_CREATE_DOWN;
      target.dataset.sortType = "date-create-down";
    } else if (eventSortType === SortType.DATE_CREATE_DOWN) {
      newSortType = SortType.DATE_CREATE_UP;
      target.dataset.sortType = "date-create-up";
    }

    if (eventSortType === SortType.DATE_UPDATE_UP) {
      newSortType = SortType.DATE_UPDATE_DOWN;
      target.dataset.sortType = "date-update-down";
    } else if (eventSortType === SortType.DATE_UPDATE_DOWN) {
      newSortType = SortType.DATE_UPDATE_UP;
      target.dataset.sortType = "date-update-up";
    }

    this._handler.sortTypeChange(newSortType);
  };

  getTemplate() {
    return createSortingListTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler = (handler) => {
    this._handler.sortTypeChange = handler;

    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  };
}
