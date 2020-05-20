import AbstractComponent from './abstract-component.js';

export default class SlotList extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return `<ul class="trip-days">
    <li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list">
    ${this._points.map((point) => (`
        <li id=${point.id} class="trip-events__item">
        </li>`.trim())).join(``)}
    </ul>
    </div>
    </li>
    </ul>`;
  }
}
