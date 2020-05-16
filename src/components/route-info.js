import AbstractComponent from './abstract-component.js';
import moment from 'moment';
import {getTotalPoitsCost} from '../constants.js';

export default class RouteInfoElement extends AbstractComponent {
  constructor(container) {
    super();
    this._container = container;
    this._points = null;
    this._departurePlace = ``;
    this._point = ``;
    this._destination = ``;
    this._departureDate = ``;
    this._returndate = ``;
    this._departureMonth = ``;
    this._returnMonth = ``;

    this._cost = ``;
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${this._departurePlace} &mdash; ${this._point} &mdash; ${this._destination}</h1>

      <p class="trip-info__dates">${this._departureMonth} ${this._departureDate}&nbsp;&mdash;&nbsp;${this._returndate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cost}</span>
    </p>
    </section>`;
  }

  render() {
    this._container.insertAdjacentHTML(`afterbegin`, this.getTemplate());
  }

  update({points}) {
    this._points = points.getPointsAll();

    this._cost = getTotalPoitsCost(this._points);

    this._departurePlace = this._points[0].destination.name;
    this._point = this._points.length > 3 ? `...` : this._points[1].destination.name;
    this._destination = this._points[this._points.length - 1].destination.name;
    this._departureDate = moment(this._points[0].eventStart).date();
    this._returndate = moment(this._points[this._points.length - 1].eventEnd).date();
    this._departureMonth = moment(this._points[0].eventStart).format(`MMM`);
    this._returnMonth = moment(this._points[this._points.length - 1].eventEnd).format(`MMM`);
  }

  rerender() {
    const oldElement = this._container.firstChild;
    oldElement.remove();
    this.render();
  }
}
