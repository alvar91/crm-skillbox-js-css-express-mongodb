export default class Observer {
  constructor() {
    this._observers = new Set();
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }
}
