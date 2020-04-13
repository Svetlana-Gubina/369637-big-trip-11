import AbstractComponent from './abstract-component.js';

export default class RouteInfoElement extends AbstractComponent {
  constructor({departurePlace, point, destination, departureDate, returndate, departureMonth, returnMonth}) {
    super();
    this._departurePlace = departurePlace;
    this._point = point;
    this._destination = destination;
    this._departureDate = departureDate;
    this._returndate = returndate;
    this._departureMonth = departureMonth;
    this._returnMonth = returnMonth;
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${this._departurePlace} &mdash; ${this._point} &mdash; ${this._destination}</h1>

    <p class="trip-info__dates">${this._departureMonth} ${this._departureDate}&nbsp;&mdash;&nbsp;${this._returnMonth} ${this._returndate}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
  </p>
  </section>`;
  }
}
