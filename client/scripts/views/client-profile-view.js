import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";
import { ContactImage, ContactURL, FieldTitle, Contact } from "../const.js";

const getContactImage = (contact) => {
  switch (contact.type) {
    case Contact.email:
      return ContactImage.MAIL;
    case Contact.fb:
      return ContactImage.FB;
    case Contact.vk:
      return ContactImage.VK;
    case Contact.phone:
      return ContactImage.PHONE;
    case Contact.additionalPhone:
      return ContactImage.PHONE;
    default:
      return ContactImage.USER;
  }
};

const getContactURL = (contact) => {
  switch (contact.type) {
    case Contact.email:
      return `mailto:${contact.value}`;
    case Contact.fb:
      return `${ContactURL.FB}${contact.value}`;
    case Contact.vk:
      return `${ContactURL.VK}${contact.value}`;
    case Contact.phone:
      return `tel:${contact.value}`;
    case Contact.additionalPhone:
      return `tel:${contact.value}`;
    default:
      return `#`;
  }
};

const createContactItemTemplate = (contact) => {
  if (!contact.value) return;

  return `<li class="contacts__item">
    <a class="contacts__link tooltip" href="${getContactURL(
      contact
    )}" target="_blank">
        ${getContactImage(contact)}
        <span class="label ${
          contact.type === Contact.phone ||
          contact.type === Contact.additionalPhone
            ? "label--phone"
            : ""
        }">
            ${FieldTitle[contact.type]}:&nbsp;<span class="tag">${
    contact.value
  }</span>
        </span>
    </a>
</li>`;
};

const createProfileItemTemplate = (client) => `<div class="table__row">
  <div class="table__id">${client._id.slice(-6)}</div>
  <div class="table__name">
      <a class="js-client-profile" href="#">
          ${Utils.toUpperCaseFirstLetter(
            client.surname
          )} ${Utils.toUpperCaseFirstLetter(
  client.name
)} ${Utils.toUpperCaseFirstLetter(client.lastname)}
      </a>
  </div>
  <div class="table__date">
      <span class="table__date">${Utils.formatDate(
        client.createdAt
      )}</span><br class="brake">
      <span class="table__time">${Utils.formatTime(client.createdAt)}</span>
  </div>
  <div class="table__date">
      <span class="table__date">${Utils.formatDate(
        client.updatedAt
      )}</span><br class="brake">
      <span class="table__time">${Utils.formatTime(client.updatedAt)}</span>
  </div>
  <div class="table__contacts">
      <ul class="contacts">
          ${client.contacts
            .map((contact) => {
              return createContactItemTemplate(contact);
            })
            .join("")}
      </ul>
  </div>
  <div class="table__menu">
      <a class="table__edit js-client-edit" href="#">
          <svg class="icon" width="16" height="16" viewbox="0 0 16 16" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.7">
                  <path
                      d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z"
                      fill="#9873FF" />
              </g>
          </svg>
          Изменить
      </a><br class="brake">
      <a class="table__edit table-delete js-client-delete" href="#">
          <svg class="icon" width="16" height="16" viewbox="0 0 16 16" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.7">
                  <path
                      d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
                      fill="#F06A4D" />
              </g>
          </svg>
          Удалить
      </a>
  </div>
</div>`;

export default class ClientProfile extends AbstractView {
  constructor(client) {
    super();
    this._client = client;
  }

  getTemplate() {
    return createProfileItemTemplate(this._client);
  }

  _clickProfileHandler = (evt) => {
    if (!evt.target.classList.contains(`js-client-profile`)) {
      return;
    }

    evt.preventDefault();
    this._handler.clickProfile(this._client._id);
  };

  setProfileClientClickHandler(handler) {
    this._handler.clickProfile = handler;

    this.getElement().addEventListener(`click`, this._clickProfileHandler);
  }

  _clickEditHandler = (evt) => {
    if (!evt.target.classList.contains(`js-client-edit`)) {
      return;
    }

    evt.preventDefault();
    this._handler.clickEdit(this._client._id);
  };

  setEditClientClickHandler(handler) {
    this._handler.clickEdit = handler;

    this.getElement().addEventListener(`click`, this._clickEditHandler);
  }

  _clickDeleteHandler = (evt) => {
    if (!evt.target.classList.contains(`js-client-delete`)) {
      return;
    }

    evt.preventDefault();
    this._handler.clickDelete(this._client._id);
  };

  setDeleteClientClickHandler(handler) {
    this._handler.clickDelete = handler;

    this.getElement().addEventListener(`click`, this._clickDeleteHandler);
  }
}
