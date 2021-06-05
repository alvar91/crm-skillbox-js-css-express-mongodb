import Observer from "../utils/observer.js";
import { InitiateFilters } from "../const.js";

export default class FilterModel extends Observer {
  constructor() {
    super();

    this._filterFields = InitiateFilters();
  }

  resetFilters(updateType) {
    this._filterFields = InitiateFilters();
    this._notify(updateType);
  }

  getFilter(type) {
    return this._filterFields.find((item) => item.type === type);
  }

  getFilters() {
    return this._filterFields;
  }

  updateFilter(updateType, update) {
    const index = this._filterFields.findIndex(
      (field) => field.type === update.type
    );

    if (index === -1) {
      throw new Error(`Can't update nonexistent filter`);
    }

    this._filterFields = [
      ...this._filterFields.slice(0, index),
      update,
      ...this._filterFields.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
