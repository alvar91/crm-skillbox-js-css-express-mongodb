import AbstractView from "../views/abstract-view.js";
import { RenderPosition } from "../const.js";

export default class Render {
  static createElement(template) {
    const element = document.createElement(`div`);

    element.innerHTML = template;

    return element.firstElementChild;
  }

  static remove(component) {
    if (component === null) {
      return;
    }

    if (!(component instanceof AbstractView)) {
      throw new Error(`Can remove only components`);
    }

    component.getElement().remove();
    component.removeElement();
  }

  static render(container, element, position = RenderPosition.BEFOREEND) {
    if (container instanceof AbstractView) {
      container = container.getElement();
    }

    let $element;
    if (element instanceof AbstractView) {
      $element = element.getElement();
    }

    switch (position) {
      case RenderPosition.AFTERBEGIN:
        container.prepend($element);
        break;
      case RenderPosition.BEFOREEND:
        container.append($element);
        break;
      case RenderPosition.BEFOREBEGIN:
        container.before($element);
        break;
      case RenderPosition.AFTEREND:
        container.after($element);
        break;
    }
  }

  static renderTemplate(
    container,
    template,
    position = RenderPosition.BEFOREEND
  ) {
    if (container instanceof AbstractView) {
      container = container.getElement();
    }

    return container.insertAdjacentHTML(position, template);
  }

  static replace(newElement, oldElement) {
    if (newElement instanceof AbstractView) {
      newElement = newElement.getElement();
    }

    if (oldElement instanceof AbstractView) {
      oldElement = oldElement.getElement();
    }

    const parentElement = oldElement.parentElement;

    if (parentElement === null || oldElement === null || newElement === null) {
      throw new Error(`Can't replace unexisting elements`);
    }

    if (parentElement.contains(oldElement)) {
      parentElement.replaceChild(newElement, oldElement);
    }
  }
}
