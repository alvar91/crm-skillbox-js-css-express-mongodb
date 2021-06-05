export default class {
  static addEscapeEvent(evt, action) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      action(evt);
    }
  }

  static getShortDescription(description) {
    return description.length >= DESCRIPTION_LENGTH
      ? `${description.slice(0, DESCRIPTION_LENGTH - 1)}...`
      : description;
  }

  static isOnline() {
    return window.navigator.onLine;
  }

  static sortClientsByIdUp(clientA, clientB) {
    return clientA._id > clientB._id ? 1 : -1;
  }

  static sortClientsByIdDown(clientA, clientB) {
    return clientA._id < clientB._id ? 1 : -1;
  }

  static sortClientsByNameUp(clientA, clientB) {
    return `${clientA.surname} ${clientA.name} ${clientA.lastname}` >
      `${clientB.surname} ${clientB.name} ${clientB.lastname}`
      ? 1
      : -1;
  }

  static sortClientsByNameDown(clientA, clientB) {
    return `${clientA.surname} ${clientA.name} ${clientA.lastname}` <
      `${clientB.surname} ${clientB.name} ${clientB.lastname}`
      ? 1
      : -1;
  }

  static sortClientsByCreateDateUp(clientA, clientB) {
    return clientA.createdAt > clientB.createdAt ? 1 : -1;
  }

  static sortClientsByCreateDateDown(clientA, clientB) {
    return clientA.createdAt < clientB.createdAt ? 1 : -1;
  }

  static sortClientsByUpdateDateUp(clientA, clientB) {
    return clientA.updatedAt > clientB.updatedAt ? 1 : -1;
  }

  static sortClientsByUpdateDateDown(clientA, clientB) {
    return clientA.updatedAt < clientB.updatedAt ? 1 : -1;
  }

  static toast(message) {
    const SHOW_TIME = 5000;
    const toastContainer = document.createElement(`div`);
    const toastItem = document.createElement(`div`);
    toastContainer.classList.add(`toast-container`);

    document.body.append(toastContainer);

    toastItem.textContent = message;
    toastItem.classList.add(`toast-item`);

    toastContainer.append(toastItem);

    setTimeout(() => {
      toastItem.remove();
    }, SHOW_TIME);
  }

  static toUpperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static formatDate(date) {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  static formatTime(date) {
    return new Date(date).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static getErrorNotFiled(title) {
    return `Ошибка: Поле "${title}" должно быть заполнено`;
  }

  static getErrorNotValidForm(title) {
    return `Ошибка: Невалидная форма ${title}`;
  }

  static createUUID() {
    let dt = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
}
