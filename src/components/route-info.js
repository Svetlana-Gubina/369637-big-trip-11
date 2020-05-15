import AbstractComponent from './abstract-component.js';
import moment from 'moment';

export default class RouteInfoElement extends AbstractComponent {
  constructor({points}) {
    super();
    this._points = points.getPointsAll();
    this._departurePlace = this._points[0].destination.name;
    this._point = this._points.length > 3 ? `...` : this._points[1].destination.name;
    this._destination = this._points[this._points.length - 1].destination.name;
    this._departureDate = moment(this._points[0].eventStart).date();
    this._returndate = moment(this._points[this._points.length - 1].eventEnd).date();
    this._departureMonth = moment(this._points[0].eventStart).format(`MMM`);
    this._returnMonth = moment(this._points[this._points.length - 1].eventEnd).format(`MMM`);
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${this._departurePlace} &mdash; ${this._point} &mdash; ${this._destination}</h1>

      <p class="trip-info__dates">${this._departureMonth} ${this._departureDate}&nbsp;&mdash;&nbsp;${this._returndate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
    </p>
    </section>`;
  }

  render(container) {
    container.insertAdjacentHTML(`afterbegin`, this.getTemplate());
  }

  // TODO:
  rerender() {

  }
}
