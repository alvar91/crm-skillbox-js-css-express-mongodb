import Observer from "../utils/observer.js";
import { InitiateFields } from "../const.js";

export default class FormModel extends Observer {
  constructor() {
    super();

    this._formFields = InitiateFields();
    this._errorMessages = [];
  }

  mapFieldsForServer() {
    const data = {};

    this.getFields().forEach(
      (field) => (data[field.id] = { name: field.name, value: field.value })
    );

    return data;
  }

  resetFields() {
    this._formFields = InitiateFields();
  }

  getField(id) {
    return this._formFields.find((item) => item.id === id);
  }

  getFields() {
    return this._formFields;
  }

  setFields(newFields) {
    return (this._formFields = newFields);
  }

  getFieldsCount() {
    return this._formFields.length;
  }

  getErrorMessages() {
    return this._errorMessages;
  }

  setError(error) {
    if (this._errorMessages.includes(error)) return;

    this._errorMessages.push(error);
  }

  deleteError(newError) {
    this._errorMessages = this._errorMessages.filter(
      (error) => newError !== error
    );
  }

  resetError() {
    this._errorMessages = [];
  }

  setField(updateType, newField) {
    this._formFields = this._formFields.slice().concat([newField]);

    this._notify(updateType);
  }

  updateField(updateType, update) {
    const index = this._formFields.findIndex((field) => field.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update nonexistent field`);
    }

    this._formFields = [
      ...this._formFields.slice(0, index),
      update,
      ...this._formFields.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteField(updateType, updateId) {
    const index = this._formFields.findIndex((field) => field.id === updateId);
    if (index === -1) {
      throw new Error(`Can't delete nonexistent field`);
    }

    this._formFields = [
      ...this._formFields.slice(0, index),
      ...this._formFields.slice(index + 1),
    ];

    this._notify(updateType, updateId);
  }

  isFormValid() {
    return this._formFields.some((field) => !field.isValid);
  }
}
