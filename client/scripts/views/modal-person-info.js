import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";
import { ContactURL, Contact, FieldTitle } from "../const.js";

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

const modalPersonInfoTemplate = (client) => {
  const contactsGroup = client.contacts
    .map((contact) => {
      if (!contact.value) return ``;

      return `<li><span class="form__item-title">${
        FieldTitle[contact.type]
      }:</span>
        <a href="${getContactURL(contact)}" target="_blank">
          ${contact.value}
        </a>
      </li>`;
    })
    .join(``);

  return `<div class="form__person">
    <p><span class="form__item-title">Фамилия:</span> ${Utils.toUpperCaseFirstLetter(
      client.surname
    )}</p>
    <p><span class="form__item-title">Имя:</span> ${Utils.toUpperCaseFirstLetter(
      client.name
    )}</p>
    <p><span class="form__item-title">Отчество:</span> ${
      client.lastname ? Utils.toUpperCaseFirstLetter(client.lastname) : ""
    }</p>
    <h3>Контакты клиента</h3>
    <ul class="form__container">
        ${contactsGroup}
    </ul>
  </div>`;
};

export default class ModalPersonInfo extends AbstractView {
  constructor(client) {
    super();
    this._client = client;
  }

  getTemplate() {
    return modalPersonInfoTemplate(this._client);
  }
}
