import { END_POINT, UpdateType, UserAction } from "../const.js";

import Router from "../utils/router.js";

import Api from "../api/api.js";

import ClientsModel from "../models/clients-model.js";
import FilterModel from "../models/filter-model.js";
import FormModel from "../models/form-model.js";
import SearchModel from "../models/search-model.js";

import Utils from "../utils/common.js";

import {
  SortType,
  FilterType,
  MODE,
  FieldTitle,
  GetDropdownField,
  GetInputField,
  State,
  Contact,
  FORM,
} from "../const.js";

import { validationMethods, formatInput } from "../utils/validate.js";

export default class ClientsPresenter {
  constructor(view) {
    this._view = view;

    this._api = new Api(END_POINT);

    this._router = new Router(this);

    this._clientsModel = new ClientsModel();
    this._filterModel = new FilterModel();
    this._formModel = new FormModel();
    this._searchModel = new SearchModel();

    this._clientsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._formModel.addObserver(this._handleModelEvent);
    this._searchModel.addObserver(this._handleModelEvent);
  }

  // Handlers
  _handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this._view.updatePatch(data);
        break;

      case UpdateType.MINOR:
        this._view.updateMinor(data);
        break;
      case UpdateType.MINOR_FORM:
        this._view.updateMinorForm(data);
        break;

      case UpdateType.MAJOR:
        this._view.updateMajor();
        break;
    }
  };

  handlePaginationChange = (pageMode, currentPage) => {
    if (pageMode === "prev") {
      this._router.navigateTo(`/page/${currentPage - 1}`);
    } else if (pageMode === "next") {
      this._router.navigateTo(`/page/${currentPage + 1}`);
    }
  };

  handleSortTypeChange = (sortType) => {
    const currentSortType = this.getCurrentSortType();
    if (currentSortType === sortType) {
      return;
    }

    this._clientsModel.setSortType(UpdateType.MINOR, sortType);
  };

  handleFilterTypeChange = (filterType, value) => {
    value = value.toLowerCase();

    const filter = this._filterModel.getFilter(filterType);

    if (!filter) {
      throw new Error(`Can't find nonexistent filter: ${filter}`);
    }

    filter.value = value;

    this._filterModel.updateFilter(UpdateType.MINOR, filter);
  };

  handleFilterTypeReset = () => {
    this._filterModel.resetFilters(UpdateType.MINOR);
  };

  handleProfileClientClick = (clientId) => {
    this._router.navigateTo(`/client/${clientId}`);
  };

  handleAddButtonClick = () => {
    const currentModalMode = MODE.addClient;
    this._clientsModel.setCurrentModalMode(UpdateType.MINOR, currentModalMode);
  };

  handleEditButtonClick = (clientId) => {
    const currentModalMode = MODE.editClient;
    this._fetchClient(clientId, currentModalMode);
  };

  handleDeleteButtonClick = (clientId) => {
    const currentModalMode = MODE.deleteClient;

    this._fetchClient(clientId, currentModalMode);
  };

  handleDeleteClientClick = (clientId) => {
    this._handleViewAction(
      UserAction.DELETE_CLIENT,
      UpdateType.MINOR,
      clientId
    );
  };

  handleCloseModal = () => {
    const currentPage = this.getCurrentPage();
    this._router.navigateTo(`/page/${currentPage}`);

    this._clientsModel.resetCurrentClient();
    this._formModel.resetFields();
    this._formModel.resetError();
    this._clientsModel.resetCurrentModalMode(UpdateType.MINOR);
  };

  escKeyDownHandler = (evt) => {
    Utils.addEscapeEvent(evt, this.handleCloseModal);
  };

  handleDropdownChange = (fieldTitle, fieldId) => {
    let newField;
    switch (fieldTitle) {
      case FieldTitle.email:
        newField = GetDropdownField.getDropdownEmailField();
        break;
      case FieldTitle.phone:
        newField = GetDropdownField.getDropdownPhoneField();
        break;
      case FieldTitle.additionalPhone:
        newField = GetDropdownField.getDropdownAdditionalPhoneField();
        break;
      case FieldTitle.vk:
        newField = GetDropdownField.getDropdownVkField();
        break;
      case FieldTitle.fb:
        newField = GetDropdownField.getDropdownFbField();
        break;
      case FieldTitle.other:
        newField = GetDropdownField.getDropdownOtherField();
        break;
      default:
        break;
    }

    if (!newField) {
      throw new Error(`Can't create nonexistent field: ${fieldTitle}`);
    }

    newField.id = fieldId;
    this._formModel.updateField(UpdateType.PATCH, newField);
  };

  _validateField(field) {
    if (!field.required) return true;

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    const validationField = field.validation;

    for (const method in validationField) {
      const errorMessage = field.validation[method];

      if (
        validationField.hasOwnProperty(method) &&
        !validationMethods(method, field) &&
        !field.deletedField
      ) {
        this._formModel.setError(errorMessage);
        return false;
      }

      this._formModel.deleteError(errorMessage);
    }

    return true;
  }

  handleFieldChange = (fieldId, value) => {
    const field = this._formModel.getField(fieldId);

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    if (
      [FieldTitle.name, FieldTitle.lastname, FieldTitle.surname].includes(
        field.title
      )
    ) {
      value = formatInput(value);
    }

    field.value = value;
    field.isTouched = true;

    const isValid = this._validateField(field);
    field.isValid = isValid;

    this._formModel.updateField(UpdateType.PATCH, field);
  };

  _handleViewAction(actionType, updateType, client) {
    switch (actionType) {
      case UserAction.ADD_CLIENT:
        this._view.saveButtonComponent.setViewState(State.ADDING);
        this._api
          .addClient(client)
          .then(() => {
            this._api.getClients().then((response) => {
              this._clientsModel.setClients(updateType, response);
            });
          })
          .catch((e) => {
            console.error(e);
            Utils.toast(`${e.message}`);
          })
          .finally(() => {
            this._view.saveButtonComponent.setViewState(State.ABORTING);
            this.handleCloseModal();
          });
        break;

      case UserAction.EDIT_CLIENT:
        this._view.editButtonComponent.setViewState(State.ADDING);
        this._api
          .updateClient(client)
          .then((client) => {
            this._searchModel.updateClient(updateType, client);
            this._clientsModel.updateClient(updateType, client);
          })
          .catch((e) => {
            console.error(e);
            Utils.toast(`${e.message}`);
          })
          .finally(() => {
            this._view.editButtonComponent.setViewState(State.ABORTING);
            this.handleCloseModal();
          });
        break;

      case UserAction.DELETE_CLIENT:
        if (this._view.deleteClientModalComponent) {
          this._view.deleteClientModalComponent.setViewState(State.ADDING);
        }
        if (this._cancelButtonComponent) {
          this._cancelButtonComponent.setViewState(State.ADDING);
        }

        this._api
          .deleteClient(client._id)
          .then(() => {
            this._searchModel.deleteClient(null, client._id);
            this._clientsModel.deleteClient(UpdateType.MINOR, client._id);
          })
          .catch((e) => {
            console.error(e);
            Utils.toast(`${e.message}`);
          })
          .finally(() => {
            if (this._view.deleteClientModalComponent) {
              this._view.deleteClientModalComponent.setViewState(
                State.ABORTING
              );
            }
            if (this._cancelButtonComponent) {
              this._cancelButtonComponent.setViewState(State.ABORTING);
            }
            this.handleCloseModal();
          });
        break;
    }
  }

  handleAddClientClick = () => {
    const newClient = this._formModel.mapFieldsForServer();

    this._handleViewAction(UserAction.ADD_CLIENT, UpdateType.MINOR, newClient);
  };

  handleEditClientClick = (client) => {
    let updateClient = this._formModel.mapFieldsForServer();
    updateClient = Object.assign({}, updateClient, {
      [client._id]: { name: "_id", value: client._id },
    });

    this._handleViewAction(
      UserAction.EDIT_CLIENT,
      UpdateType.MINOR,
      updateClient
    );
  };

  handleAddContactClick = () => {
    const newField = GetDropdownField.getDropdownDefaultField();
    this._formModel.setField(UpdateType.MINOR_FORM, newField);
  };

  handleDeleteContactClick = (buttonId) => {
    let field;
    if (buttonId) {
      field = this._formModel.getField(buttonId);
    }

    if (!field) {
      throw new Error(`Can't find nonexistent field: ${field}`);
    }

    field.deletedField = true;

    this._validateField(field);

    this._formModel.deleteField(UpdateType.MINOR_FORM, buttonId);
  };

  handleSearchContactInput = (value) => {
    this._searchModel.setCurrentKeyword(value);

    if (value) {
      this._searchClient(value);
    } else {
      this._searchModel.resetClients(UpdateType.MINOR);
    }
  };

  _searchClient(searchValue) {
    this._clientsModel.setIsClientsLoading(UpdateType.MINOR, {
      isLoading: true,
    });

    this._api
      .searchClients(searchValue)
      .then((clients) => {
        this._searchModel.setClients(UpdateType.MINOR, clients);
      })
      .catch((e) => {
        console.error(e);
        Utils.toast(`${e.message}`);
        this._searchModel.setClients(UpdateType.MINOR, []);
      });
  }

  _parseClientToFormFileds(client) {
    let newFields = [];

    for (const prop in client) {
      if (!client.hasOwnProperty(prop)) return;

      if (typeof client[prop] === "string") {
        switch (prop) {
          case Contact.name:
            newFields.push(GetInputField.getInputNameField(client[prop]));
            break;
          case Contact.surname:
            newFields.push(GetInputField.getInputSurnameField(client[prop]));
            break;
          case Contact.lastname:
            newFields.push(GetInputField.getInputLastnameField(client[prop]));
            break;
          default:
            break;
        }
      }

      if (Array.isArray(client[prop])) {
        for (const { type, value } of client[prop]) {
          switch (type) {
            case Contact.email:
              newFields.push(GetDropdownField.getDropdownEmailField(value));
              break;
            case Contact.phone:
              newFields.push(GetDropdownField.getDropdownPhoneField(value));
              break;
            case Contact.additionalPhone:
              newFields.push(
                GetDropdownField.getDropdownAdditionalPhoneField(value)
              );
              break;
            case Contact.vk:
              newFields.push(GetDropdownField.getDropdownVkField(value));
              break;
            case Contact.fb:
              newFields.push(GetDropdownField.getDropdownFbField(value));
              break;
            case Contact.other:
              newFields.push(GetDropdownField.getDropdownOtherField(value));
              break;
            default:
              break;
          }
        }
      }
    }

    newFields = newFields.sort((prevField, field) => {
      if (
        prevField.type === FORM.inputText &&
        field.type === FORM.inputDropdown
      ) {
        return -1;
      }

      return 1;
    });
    this._formModel.setFields(newFields);
  }

  // Api
  _fetchClient(clientId, currentModalMode) {
    this._clientsModel.setIsClientsLoading(UpdateType.MINOR, {
      isLoading: true,
    });
    this._api
      .getClient(clientId)
      .then((client) => {
        this._clientsModel.setCurrentClient(client);

        if (currentModalMode === MODE.editClient) {
          this._parseClientToFormFileds(client);
        }

        this._clientsModel.setCurrentModalMode(
          UpdateType.MINOR,
          currentModalMode
        );
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
        this._clientsModel.setCurrentClient(UpdateType.MINOR, {});
      });
  }

  _fetchClients(page) {
    this._clientsModel.setIsClientsLoading(UpdateType.MINOR, {
      isLoading: true,
    });
    this._api
      .getClients(page)
      .then((response) => {
        this._clientsModel.setClients(UpdateType.MINOR, response);
      })
      .catch((e) => {
        console.error(e.message);
        Utils.toast(e.message);
        this._clientsModel.setClients(UpdateType.MINOR, {
          clients: [],
          page: 1,
          pages: 1,
        });
      });
  }

  // Routes
  pageRoute(currentPage = 1) {
    if (
      this.getCurrentPage() === +currentPage &&
      this.getClientsCount() !== 0
    ) {
      return;
    }
    this._fetchClients(currentPage);
  }

  clientIdRoute(id) {
    const currentModalMode = MODE.profile;
    this._fetchClient(id, currentModalMode);
  }

  _filterClients(clients) {
    const filters = this.getFilters();

    for (const { type, value } of filters) {
      if (value) {
        clients = clients.filter((client) => {
          if (type === FilterType.ID) {
            return client._id.includes(value);
          }

          if (type === FilterType.FIO) {
            const name = client.name ? client.name : "";
            const surname = client.surname ? client.surname : "";
            const lastname = client.lastname ? client.lastname : "";
            return `${surname} ${name} ${lastname}`.includes(value);
          }

          if (type === FilterType.BIRTH) {
            return Utils.formatDate(client.dateOfBirth).includes(value);
          }

          if (type === FilterType.LEARN) {
            return Utils.formatLearnYear(client.dateStartLearn).includes(value);
          }

          if (type === FilterType.FACULTY) {
            return client.faculty.includes(value);
          }

          return true;
        });
      }
    }

    return clients;
  }

  _sortClients(clients, currentSortType) {
    switch (currentSortType) {
      case SortType.ID_UP:
        return clients.sort(Utils.sortClientsByIdUp);
      case SortType.ID_DOWN:
        return clients.sort(Utils.sortClientsByIdDown);
      case SortType.NAME_UP:
        return clients.sort(Utils.sortClientsByNameUp);
      case SortType.NAME_DOWN:
        return clients.sort(Utils.sortClientsByNameDown);
      case SortType.DATE_CREATE_UP:
        return clients.sort(Utils.sortClientsByCreateDateUp);
      case SortType.DATE_CREATE_DOWN:
        return clients.sort(Utils.sortClientsByCreateDateDown);
      case SortType.DATE_UPDATE_UP:
        return clients.sort(Utils.sortClientsByUpdateDateUp);
      case SortType.DATE_UPDATE_DOWN:
        return clients.sort(Utils.sortClientsByUpdateDateDown);
      default:
        return clients;
    }
  }

  // Model
  getClients() {
    const clients = this._clientsModel.getClients();

    const filteredClients = this._filterClients(clients);

    const currentSortType = this.getCurrentSortType();

    return this._sortClients(filteredClients, currentSortType);
  }

  getClientsCount() {
    return this._clientsModel.getClientsCount();
  }

  getCurrentPage() {
    return this._clientsModel.getCurrentPage();
  }

  getClientsCount() {
    return this._clientsModel.getClientsCount();
  }

  getPagesCount() {
    return this._clientsModel.getPagesCount();
  }

  getCurrentClient() {
    return this._clientsModel.getCurrentClient();
  }

  resetCurrentClient() {
    return this._clientsModel.resetCurrentClient();
  }

  getCurrentSortType = () => {
    return this._clientsModel.getCurrentSortType();
  };

  getCurrentModalMode() {
    return this._clientsModel.getCurrentModalMode();
  }

  resetCurrentModalMode() {
    return this._clientsModel.resetCurrentModalMode();
  }

  getFilters() {
    return this._filterModel.getFilters();
  }

  getFormField(fieldId) {
    return this._formModel.getField(fieldId);
  }

  getFormFields() {
    return this._formModel.getFields();
  }

  getFormFieldsCount() {
    return this._formModel.getFieldsCount();
  }

  resetFormFields() {
    return this._formModel.resetFields();
  }

  getErrorMessages() {
    return this._formModel.getErrorMessages();
  }

  getCurrentKeyword() {
    return this._searchModel.getCurrentKeyword();
  }

  getSearchClientsCount() {
    return this._searchModel.getClientsCount();
  }

  getSearchClients() {
    return this._searchModel.getClients();
  }

  init() {
    this._router.init();
  }
}
