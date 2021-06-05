import AbstractView from "./abstract-view.js";
import { Contact } from "../const.js";

const isValidTemplate = (isTouched, isValid) => {
  return isTouched && !isValid ? `form__input--error` : ``;
};

export default class Dropdown extends AbstractView {
  constructor(field) {
    super();

    this._field = field;
    this._id = field.id;

    this.init();
  }

  getTemplate() {
    return `<div class="form__contact">
    <div class="dropdown-container">
      <div class="dropdown-toggle click-dropdown js-contact-field" data-idtoggle="${
        this._id
      }">${this._field.title ? this._field.title : "Контакт"}</div>
      <div class="dropdown-menu">
        <ul class="dropdown-group">
          <li>
            <a class="dropdown-item" href="#">Телефон</a>
          </li>
          <li>
            <a class="dropdown-item" href="#">Доп. телефон</a>
          </li>
          <li>
            <a class="dropdown-item" href="#">Email</a>
          </li>
          <li>
            <a class="dropdown-item" href="#">Vk</a>
          </li>
          <li>
            <a class="dropdown-item" href="#">Facebook</a>
          </li>
          <li>
            <a class="dropdown-item" href="#">Другое</a>
          </li>
        </ul>
      </div>
    </div>
    <input class="form__input-contact js-input-contact ${isValidTemplate(
      this._field.isTouched,
      this._field.isValid
    )}" type="text" value="${this._field.value}" ${
      this._field.value ? "" : "disabled"
    } placeholder="Введите данные контакта" data-idinput="${this._id}" />
    <button class="form__input-button js-delete-contact" data-id="${
      this._id
    }"></button>
  </div>`;
  }

  _clickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains("js-delete-contact")) return;

    evt.stopPropagation();

    this._handler.click(evt.target.dataset.id);
  };

  setDeleteClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(".js-delete-contact")
      .addEventListener(`click`, this._clickHandler);
  }

  _changeHandlerDropdown = (evt) => {
    evt.preventDefault();

    this._handler.changeDropdown(evt.target.innerText, this._id);
  };

  _setValid(evt) {
    evt.target.classList.remove(`form__input--error`);
  }

  setChangeHandlerDropdown = (handler) => {
    this._handler.changeDropdown = handler;
  };

  _changeHandlerInput = (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains("js-input-contact")) return;

    this._handler.changeInput(evt.target.dataset.idinput, evt.target.value);
  };

  setChangeHandlerInput = (handler) => {
    this._handler.changeInput = handler;

    this.getElement()
      .querySelector(".js-input-contact")
      .addEventListener(`focusout`, this._changeHandlerInput);

    this.getElement()
      .querySelector(".js-input-contact")
      .addEventListener(`focus`, (evt) => this._setValid(evt));
  };

  _closeDropdown = () => {
    // remove the open and active class from other opened Dropdown (Closing the opend DropDown)
    this.getElement()
      .querySelectorAll(".dropdown-container")
      .forEach((container) => {
        container.classList.remove("dropdown-open");
      });

    this.getElement()
      .querySelectorAll(".dropdown-menu")
      .forEach((menu) => {
        menu.classList.remove("dropdown-active");
      });
  };

  _preventScroll(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  }

  _keyNavigation(e) {
    const previousLink =
      e.target.parentElement.previousElementSibling?.firstElementChild;
    const nextLink =
      e.target.parentElement.nextElementSibling?.firstElementChild;

    if (e.keyCode === 38 && previousLink) {
      previousLink.focus();
    } else if (e.keyCode === 40 && nextLink) {
      nextLink.focus();
    }
  }

  _dropDownFunc = (dropDown) => {
    const innerText = (e) => {
      if (e.target.classList.contains("dropdown-item")) {
        dropDown.innerText = e.target.innerText;

        this._changeHandlerDropdown(e);
      }
    };

    if (dropDown.classList.contains("click-dropdown")) {
      dropDown.addEventListener("click", (e) => {
        e.preventDefault();

        if (dropDown.nextElementSibling.classList.contains("dropdown-active")) {
          // Close the clicked dropdown
          dropDown.parentElement.classList.remove("dropdown-open");
          dropDown.nextElementSibling.classList.remove("dropdown-active");
          dropDown.nextElementSibling.removeEventListener("click", innerText);
        } else {
          // Close the opend dropdown
          this._closeDropdown();

          // add the open and active class(Opening the DropDown)
          dropDown.parentElement.classList.add("dropdown-open");
          dropDown.nextElementSibling.classList.add("dropdown-active");

          dropDown.nextElementSibling.addEventListener("click", innerText);

          dropDown.nextElementSibling.addEventListener(
            "keydown",
            this._keyNavigation
          );

          dropDown.nextElementSibling.querySelector(".dropdown-item").focus();
        }
      });
    }
  };

  _isDefaultContact = (contactField) => {
    return contactField.innerText === "Контакт";
  };

  init() {
    // Get all the dropdown from current dropdown
    this.getElement()
      .querySelectorAll(".dropdown-toggle")
      .forEach((dropDown) => this._dropDownFunc(dropDown));

    // Listen to the doc click
    window.addEventListener("click", (e) => {
      // Close the menu if click happen outside menu
      if (e.target.closest(".dropdown-container") === null) {
        // Close the opend dropdown
        this._closeDropdown();
      }
    });
    window.addEventListener("keydown", this._preventScroll);

    const inputContact = this.getElement().querySelector(".js-input-contact");
    const contactField = this.getElement().querySelector(".js-contact-field");

    if (this._isDefaultContact(contactField)) {
      inputContact.disabled = true;
    } else {
      inputContact.disabled = false;
    }

    if (
      this._field.name === Contact.phone ||
      this._field.name === Contact.additionalPhone
    ) {
      this.formated = IMask(inputContact, {
        mask: `+{7}(000)000-00-00`,
      });
    }
  }
}
