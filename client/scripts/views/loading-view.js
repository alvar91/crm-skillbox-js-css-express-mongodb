import AbstractView from "./abstract-view.js";

const createLoadingTemplate = () => {
  return `
  <div class="table">
    <div class="table__thead">
        <div class="table__inner">
          <div class="table__id">
                <a class="table__sort" href="#">
                    ID
                    <svg width="8" height="8" viewbox="0 0 8 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                            fill="#9873FF" />
                    </svg>
                </a>
            </div>
            <div class="table__name">
                <a href="#">
                    Фамилия Имя Отчество
                    <span class="table__sort">
                        <svg width="8" height="8" viewbox="0 0 8 8" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                                fill="#9873FF" />
                        </svg>
                        А-Я
                    </span>
                </a>
            </div>
            <div class="table__date">
                <a href="#">
                    Дата и время<br class="brake">&nbsp;создания
                    <svg width="8" height="8" viewbox="0 0 8 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                            fill="#9873FF" />
                    </svg>
                </a>
            </div>
            <div class="table__date">
                <a href="#">
                  Последние<br class="brake">&nbsp;изменения
                    <svg width="8" height="8" viewbox="0 0 8 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z"
                            fill="#9873FF" />
                    </svg>
                </a>
            </div>
          <div class="table__contacts">Контакты</div>
          <div class="table__actions">Действия</div>
        </div>
      </div>
      <div class="table__loader">
        <div class="loader"></div>
      </div>
  </div>
  `;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
