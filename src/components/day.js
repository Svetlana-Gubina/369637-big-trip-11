import AbstractComponent from './abstract-component.js';

export default class Day extends AbstractComponent {
  constructor(count, date, dateToConvert) {
    super();
    this._count = count;
    this._date = date;
    this._dateToConvert = dateToConvert;
    this._points = [];
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${this._count}</span>
              <time class="day__date" datetime="2019-03-18">${new Date(this._dateToConvert).toDateString()}</time>
            </div>
            <ul class="trip-events__list">
            ${this._points.map((point) => (`
                <li id=${point.id} class="trip-events__item">
                </li>`.trim())).join(``)}
            </ul>
            </li>`;
  }
}
