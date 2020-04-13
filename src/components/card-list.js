import AbstractComponent from './abstract-component.js';

export default class CardList extends AbstractComponent {
  constructor(count, dates) {
    super();
    this._count = count;
    this._dates = dates;
  }

  getTemplate() {
    return `<ul class="trip-days">
    <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${this._count}</span>
      <time class="day__date" datetime="2019-03-18">${new Date(this._dates[this._count - 1]).toDateString()}</time>
    </div>
    <ul class="trip-events__list">
    </ul>
    </li>
    </ul>`;
  }
}

