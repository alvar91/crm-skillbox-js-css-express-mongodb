import ClientsPresenter from "../presenters/clients-presenter.js";

import Render from "../utils/render.js";

import HeaderContainer from "./header-container.js";
import MainContainer from "./main-container.js";

import HeaderView from "./header-view.js";

import SearchProfileView from "./search-profile-view.js";

import PaginationView from "./pagination-view.js";

import LoadingView from "./loading-view.js";

import TableHeadView from "./table-head-view.js";
import FilteringListView from "./filtering-list-view.js";
import TableBodyView from "./table-body-view.js";
import ClientProfileView from "./client-profile-view.js";
import AddButtonView from "./button-add-client.js";
import AddButtonContactView from "./button-add-contact.js";
import ErrorsContainerView from "./errors-container.js";
import FormErrorsView from "./form-errors.js";
import FilledButtonView from "./button-filled.js";
import ButtonLinkView from "./button-link.js";

import ModalView from "./modal-view.js";
import ModalTitleView from "./modal-title.js";
import ModalPersonInfoView from "./modal-person-info.js";

import FormContainerView from "./form-container.js";
import InputFieldView from "./input-view.js";
import DropdownView from "./dropdown-view.js";

import NoClientsSearchView from "./no-search-clients-view.js";
import NoClientsView from "./no-clients-view.js";

import ModalDeleteClientView from "./modal-delete-client.js";

import {
  RenderPosition,
  MODE,
  ModalTitle,
  FORM,
  ButtonTitle,
  LimitFieldCount,
} from "../const.js";

export default class AppView {
  constructor() {
    this._clientsPresenter = new ClientsPresenter(this);

    this._rootContainer = document.getElementById("root");

    this._headerContainer = new HeaderContainer();
    this._mainContainer = new MainContainer();

    this._headerComponent = new HeaderView();
    this._headerComponent.setInputHandler(
      this._clientsPresenter.handleSearchContactInput
    );
    this._searchContainer = this._headerComponent.getSearchContainer();

    this._tableBodyContainer = new TableBodyView();

    this._noClientsComponent = new NoClientsView();

    this._clientsComponents = new Map();
    this._clientsSearchComponents = new Map();
    this._formFieldComponents = new Map();

    this._currentModalMode = null;

    this.isLoading = true;
  }

  _renderLoading() {
    this._loadingComponent = new LoadingView();
    Render.render(this._mainTableContainer, this._loadingComponent);
  }

  _renderPagination() {
    const currentPage = this._clientsPresenter.getCurrentPage();
    const pages = this._clientsPresenter.getPagesCount();

    this._paginationComponent = new PaginationView(currentPage, pages);

    this._paginationComponent.setPaginationChangeHandler(
      this._clientsPresenter.handlePaginationChange
    );

    Render.render(
      this._mainTableContainer,
      this._paginationComponent,
      RenderPosition.AFTERBEGIN
    );
  }

  _renderFiltration() {
    const filters = this._clientsPresenter.getFilters();
    this._filteringListComponent = new FilteringListView(filters);

    this._filteringListComponent.setFilterTypeChangeHandler(
      this._clientsPresenter.handleFilterTypeChange
    );

    this._filteringListComponent.setFilterTypeResetHandler(
      this._clientsPresenter.handleFilterTypeReset
    );

    Render.render(this._mainTableContainer, this._filteringListComponent);
  }

  _createClientComponent(client) {
    const clientComponent = new ClientProfileView(client);
    clientComponent.setProfileClientClickHandler(
      this._clientsPresenter.handleProfileClientClick
    );
    clientComponent.setEditClientClickHandler(
      this._clientsPresenter.handleEditButtonClick
    );
    clientComponent.setDeleteClientClickHandler(
      this._clientsPresenter.handleDeleteButtonClick
    );

    return clientComponent;
  }

  _renderClient(container, components, client) {
    const clientComponent = this._createClientComponent(client);
    Render.render(container, clientComponent);
    components.set(client._id, clientComponent);
  }

  _renderNoClients() {
    Render.render(this._mainContainer, this._noClientsComponent);
  }

  _clearClientsTable() {
    if (this._tableHeadComponent) {
      Render.remove(this._tableHeadComponent);
    }

    this._clientsComponents.forEach((component) => Render.remove(component));
    this._clientsComponents.clear();
  }

  _renderClientsTable() {
    if (this._clientsPresenter.getClientsCount() === 0) {
      this._renderNoClients();
      return;
    }

    const currentSortType = this._clientsPresenter.getCurrentSortType();
    this._tableHeadComponent = new TableHeadView(currentSortType);

    this._tableHeadComponent.setSortTypeChangeHandler(
      this._clientsPresenter.handleSortTypeChange
    );

    Render.render(this._mainTableContainer, this._tableHeadComponent);

    this._renderFiltration();

    Render.render(this._mainTableContainer, this._tableBodyContainer);

    const clients = this._clientsPresenter.getClients();

    clients.forEach((client) =>
      this._renderClient(
        this._tableBodyContainer,
        this._clientsComponents,
        client
      )
    );
  }

  _renderAddButton() {
    if (this._addButtonComponent !== null) {
      this._addMoreButtonComponent = null;
    }

    this._addButtonComponent = new AddButtonView();

    this._addButtonComponent.setClickHandler(
      this._clientsPresenter.handleAddButtonClick
    );

    Render.render(
      this._mainContainer,
      this._addButtonComponent,
      RenderPosition.AFTEREND
    );
  }

  _clearProfileClientForm() {
    if (this._modalTitleComponent) {
      Render.remove(this._modalTitleComponent);
    }

    if (this._formContainerComponent) {
      Render.remove(this._formContainerComponent);
    }
  }

  _renderProfileClientForm() {
    const currentClient = this._clientsPresenter.getCurrentClient();

    if (!currentClient) return;

    const container = this._modalComponent.getModalContainer();

    const modalTitle = ModalTitle.profile;
    this._modalTitleComponent = new ModalTitleView(
      modalTitle,
      currentClient._id
    );
    Render.render(container, this._modalTitleComponent);

    this._formContainerComponent = new ModalPersonInfoView(currentClient);
    Render.render(container, this._formContainerComponent);
  }

  _createInput(field) {
    const inputComponent = new InputFieldView(field);

    inputComponent.setChangeHandler(this._clientsPresenter.handleFieldChange);

    this._formFieldComponents.set(field.id, inputComponent);

    return inputComponent;
  }

  _createDropdown(field) {
    const dropdownComponent = new DropdownView(field);

    dropdownComponent.setDeleteClickHandler(
      this._clientsPresenter.handleDeleteContactClick
    );

    dropdownComponent.setChangeHandlerDropdown(
      this._clientsPresenter.handleDropdownChange
    );

    dropdownComponent.setChangeHandlerInput(
      this._clientsPresenter.handleFieldChange
    );

    this._formFieldComponents.set(field.id, dropdownComponent);
    return dropdownComponent;
  }

  _createFieldComponent(field) {
    switch (field.type) {
      case FORM.inputText:
        return this._createInput(field);
      case FORM.inputDropdown:
        return this._createDropdown(field);
      default:
        return null;
    }
  }

  _renderFormField(container, fieldComponent) {
    Render.render(container, fieldComponent);
  }

  _renerFormErrors() {
    const container = this._errorsContainer;

    const errors = this._clientsPresenter.getErrorMessages();
    this._formErrorsComponent = new FormErrorsView(errors);

    Render.render(container, this._formErrorsComponent);
  }

  _renderSaveButton() {
    const container = this._errorsContainer.getErrorsContainer();

    const isFormValid = this._clientsPresenter
      .getFormFields()
      .some((field) => field.required && !field.isValid);

    this.saveButtonComponent = new FilledButtonView(
      ButtonTitle.save,
      isFormValid
    );

    this.saveButtonComponent.setClientClickHandler(
      this._clientsPresenter.handleAddClientClick
    );

    Render.render(container, this.saveButtonComponent, RenderPosition.AFTEREND);
  }

  _clearFormFields() {
    this._formFieldComponents.forEach((component) => Render.remove(component));
    this._formFieldComponents.clear();
  }

  _clearAddClientForm() {
    if (this._modalTitleComponent) {
      Render.remove(this._modalTitleComponent);
    }

    if (this._formContainerComponent) {
      Render.remove(this._formContainerComponent);
    }

    if (this._errorsContainer) {
      Render.remove(this._errorsContainer);
    }

    if (this._addButtonContactComponent) {
      Render.remove(this._addButtonContactComponent);
    }

    if (this._formErrorsComponent) {
      Render.remove(this._formErrorsComponent);
    }

    if (this.saveButtonComponent) {
      Render.remove(this.saveButtonComponent);
    }

    if (this._cancelButtonComponent) {
      Render.remove(this._cancelButtonComponent);
    }
  }

  _renderAddClientForm() {
    const formFields = this._clientsPresenter.getFormFields();
    const fieldComponents = formFields.map((field) =>
      this._createFieldComponent(field)
    );

    const container = this._modalComponent.getModalContainer();

    const addClientTitle = ModalTitle.add;
    this._modalTitleComponent = new ModalTitleView(addClientTitle);
    Render.render(container, this._modalTitleComponent);

    this._formContainerComponent = new FormContainerView();
    Render.render(container, this._formContainerComponent);
    fieldComponents.forEach((fieldComponent) => {
      this._renderFormField(this._formContainerComponent, fieldComponent);
    });

    if (this._clientsPresenter.getFormFieldsCount() < LimitFieldCount) {
      this._addButtonContactComponent = new AddButtonContactView();
      this._addButtonContactComponent.setClickHandler(
        this._clientsPresenter.handleAddContactClick
      );

      Render.render(container, this._addButtonContactComponent);
    }

    this._errorsContainer = new ErrorsContainerView();
    Render.render(container, this._errorsContainer);
    this._renerFormErrors();

    this._renderSaveButton();

    this._cancelButtonComponent = new ButtonLinkView(ButtonTitle.cancel);
    this._cancelButtonComponent.setClientClickHandler(
      this._clientsPresenter.handleCloseModal
    );

    Render.render(container, this._cancelButtonComponent);
  }

  _renderEditButton() {
    const currentClient = this._clientsPresenter.getCurrentClient();
    if (!currentClient) return;

    const container = this._errorsContainer.getErrorsContainer();

    const isFormValid = this._clientsPresenter
      .getFormFields()
      .some((field) => field.required && !field.isValid);

    this.editButtonComponent = new FilledButtonView(
      ButtonTitle.save,
      isFormValid,
      currentClient
    );

    this.editButtonComponent.setClientClickHandler(
      this._clientsPresenter.handleEditClientClick
    );

    Render.render(container, this.editButtonComponent, RenderPosition.AFTEREND);
  }

  _renderEditClientForm() {
    const currentClient = this._clientsPresenter.getCurrentClient();
    if (!currentClient) return;

    const formFields = this._clientsPresenter.getFormFields();

    const fieldComponents = formFields.map((field) =>
      this._createFieldComponent(field)
    );

    const container = this._modalComponent.getModalContainer();

    const editClientTitle = ModalTitle.edit;
    this._modalTitleComponent = new ModalTitleView(
      editClientTitle,
      currentClient._id
    );
    Render.render(container, this._modalTitleComponent);

    this._formContainerComponent = new FormContainerView();
    Render.render(container, this._formContainerComponent);
    fieldComponents.forEach((fieldComponent) => {
      this._renderFormField(this._formContainerComponent, fieldComponent);
    });

    if (this._clientsPresenter.getFormFieldsCount() < LimitFieldCount) {
      this._addButtonContactComponent = new AddButtonContactView();
      this._addButtonContactComponent.setClickHandler(
        this._clientsPresenter.handleAddContactClick
      );

      Render.render(container, this._addButtonContactComponent);
    }

    this._errorsContainer = new ErrorsContainerView();
    Render.render(container, this._errorsContainer);
    this._renerFormErrors();

    this._renderEditButton(currentClient);

    this._cancelButtonComponent = new ButtonLinkView(
      ButtonTitle.delete,
      currentClient
    );
    this._cancelButtonComponent.setClientClickHandler(
      this._clientsPresenter.handleDeleteClientClick
    );

    Render.render(container, this._cancelButtonComponent);
  }

  _clearEditClientForm() {
    if (this._modalTitleComponent) {
      Render.remove(this._modalTitleComponent);
    }

    if (this._formContainerComponent) {
      Render.remove(this._formContainerComponent);
    }

    if (this._errorsContainer) {
      Render.remove(this._errorsContainer);
    }

    if (this._addButtonContactComponent) {
      Render.remove(this._addButtonContactComponent);
    }

    if (this._formErrorsComponent) {
      Render.remove(this._formErrorsComponent);
    }

    if (this.editButtonComponent) {
      Render.remove(this.editButtonComponent);
    }

    if (this._cancelButtonComponent) {
      Render.remove(this._cancelButtonComponent);
    }
  }

  _renderDeleteClientForm() {
    const currentClient = this._clientsPresenter.getCurrentClient();
    if (!currentClient) return;

    const container = this._modalComponent.getModalContainer();

    this.deleteClientModalComponent = new ModalDeleteClientView(currentClient);
    this.deleteClientModalComponent.setCancelClickHandler(
      this._clientsPresenter.handleCloseModal
    );
    this.deleteClientModalComponent.setDeleteClickHandler(
      this._clientsPresenter.handleDeleteClientClick
    );

    Render.render(container, this.deleteClientModalComponent);
  }

  _clearDeleteClientForm() {
    if (this.deleteClientModalComponent) {
      Render.remove(this.deleteClientModalComponent);
    }
  }

  _clearForm(currentModalMode) {
    this._clearFormFields();
    switch (currentModalMode) {
      case MODE.profile:
        this._clearProfileClientForm();
        return;
      case MODE.addClient:
        this._clearAddClientForm();
        return;
      case MODE.editClient:
        this._clearEditClientForm();
        return;
      case MODE.deleteClient:
        this._clearDeleteClientForm();
        return;
      default:
        break;
    }
  }

  _renderForm(currentModalMode) {
    switch (currentModalMode) {
      case MODE.profile:
        this._renderProfileClientForm();
        return;
      case MODE.addClient:
        this._renderAddClientForm();
        return;
      case MODE.editClient:
        this._renderEditClientForm();
        return;
      case MODE.deleteClient:
        this._renderDeleteClientForm();
        return;

      default:
        break;
    }
  }

  _renderModal() {
    const currentModalMode = this._clientsPresenter.getCurrentModalMode();
    if (!currentModalMode) return;

    this._modalComponent = new ModalView();

    document.body.style.overflow = "hidden";

    document.addEventListener(
      `keydown`,
      this._clientsPresenter.escKeyDownHandler
    );

    this._modalComponent.setCloseModalClickHandler(
      this._clientsPresenter.handleCloseModal
    );

    Render.render(document.body, this._modalComponent);

    this._renderForm(currentModalMode);
  }

  _clearModal() {
    const currentModalMode = this._clientsPresenter.getCurrentModalMode();

    if (this._modalComponent) {
      Render.remove(this._modalComponent);
    }

    document.body.style.overflow = "auto";
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._clearForm(currentModalMode);
  }

  _createSearchClientComponent(client) {
    const clientSearchComponent = new SearchProfileView(client);
    clientSearchComponent.setProfileClientClickHandler(
      this._clientsPresenter.handleProfileClientClick
    );
    clientSearchComponent.setEditClientClickHandler(
      this._clientsPresenter.handleEditButtonClick
    );
    clientSearchComponent.setDeleteClientClickHandler(
      this._clientsPresenter.handleDeleteButtonClick
    );

    return clientSearchComponent;
  }

  _renderSearchClient(container, components, client) {
    const clientSearchComponent = this._createSearchClientComponent(client);
    Render.render(container, clientSearchComponent);
    components.set(client._id, clientSearchComponent);
  }

  _clearSearchClientsTable() {
    if (this._tableHeadComponent) {
      Render.remove(this._tableHeadComponent);
    }

    this._clientsSearchComponents.forEach((component) =>
      Render.remove(component)
    );
    this._clientsSearchComponents.clear();
  }

  _renderNoSearchClients() {
    this._noClientsSearchComponent = new NoClientsSearchView();
    Render.render(this._searchContainer, this._noClientsSearchComponent);
  }

  _renderSearchClientsTable() {
    if (this._clientsPresenter.getSearchClientsCount() === 0) {
      this._renderNoSearchClients();
      return;
    }

    const clients = this._clientsPresenter.getSearchClients();

    clients.forEach((client) =>
      this._renderSearchClient(
        this._searchContainer,
        this._clientsSearchComponents,
        client
      )
    );
  }

  clearMinor() {
    if (this._loadingComponent) {
      Render.remove(this._loadingComponent);
    }

    if (this._paginationComponent) {
      Render.remove(this._paginationComponent);
    }

    if (this._noClientsSearchComponent) {
      Render.remove(this._noClientsSearchComponent);
    }

    if (this._noClientsComponent) {
      Render.remove(this._noClientsComponent);
    }

    if (this._addButtonComponent) {
      Render.remove(this._addButtonComponent);
    }

    if (this.editButtonComponent) {
      Render.remove(this.editButtonComponent);
    }

    this._clearSearchClientsTable();
    this._clearClientsTable();
    this._clearModal();
  }

  renderMinor({ isLoading } = {}) {
    if (isLoading !== undefined) {
      this.isLoading = isLoading;
    }

    if (this.isLoading) {
      this._renderLoading();
      return;
    }

    if (this._clientsPresenter.getCurrentKeyword()) {
      this._renderSearchClientsTable();
    }

    this._renderPagination();

    if (this._filteringListComponent) {
      Render.remove(this._filteringListComponent);
    }

    this._renderClientsTable();
    this._renderAddButton();
    this._renderModal();
  }

  updateMinor(data) {
    this.clearMinor();
    this.renderMinor(data);
  }

  clearMinorForm() {
    const currentModalMode = this._clientsPresenter.getCurrentModalMode();

    this._clearForm(currentModalMode);
  }

  renderMinorForm() {
    const currentModalMode = this._clientsPresenter.getCurrentModalMode();

    this._renderForm(currentModalMode);
  }

  updateMinorForm(data) {
    this.clearMinorForm();
    this.renderMinorForm(data);
  }

  clearMajor() {
    Render.remove(this._headerComponent);
    Render.remove(this._mainContainer);

    this._mainTableContainer = null;
  }

  renderMajor() {
    Render.render(this._rootContainer, this._headerContainer);
    Render.render(this._headerContainer, this._headerComponent);

    Render.render(this._rootContainer, this._mainContainer);
    this._mainTableContainer = this._mainContainer.getMainTableContainer();
  }

  updateMajor() {
    this.clearMajor();
    this.renderMajor();
  }

  _replaceFieldComponent(fieldComponents, fieldId) {
    const oldFieldComponent = fieldComponents.get(fieldId);
    const newFieldComponent = this._createFieldComponent(
      this._clientsPresenter.getFormField(fieldId)
    );

    Render.replace(newFieldComponent, oldFieldComponent);
    Render.remove(oldFieldComponent);

    fieldComponents.delete(fieldId);
    fieldComponents.set(fieldId, newFieldComponent);
  }

  clearPatch() {
    if (this._formErrorsComponent) {
      Render.remove(this._formErrorsComponent);
    }

    if (this.saveButtonComponent) {
      Render.remove(this.saveButtonComponent);
    }

    if (this.editButtonComponent) {
      Render.remove(this.editButtonComponent);
    }
  }

  renderPatch() {
    this._renerFormErrors();

    const currentModalMode = this._clientsPresenter.getCurrentModalMode();

    if (currentModalMode === MODE.addClient) {
      this._renderSaveButton();
    } else if (currentModalMode === MODE.editClient) {
      this._renderEditButton();
    }
  }

  updatePatch(data) {
    if (this._formFieldComponents.has(data.id)) {
      this._replaceFieldComponent(this._formFieldComponents, data.id);
    }

    this.clearPatch();
    this.renderPatch(data);
  }

  init() {
    this.renderMajor();
    this._clientsPresenter.init();
  }
}
