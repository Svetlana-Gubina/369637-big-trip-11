import AbstractComponent from './abstract-component.js';
import moment from 'moment';

export default class Card extends AbstractComponent {
  constructor({id, eventType, eventStart, eventEnd, city, cost, options}) {
    super();
    this._id = id;
    this._eventType = eventType;
    this._eventStart = new Date(eventStart).getTime();
    this._eventEnd = new Date(eventEnd).getTime();
    this._duration = this._eventEnd - this._eventStart;
    this._durationHrs = moment(this._duration).hours();
    this._durationMins = moment(this._duration).minutes();
    this._city = city;
    this._cost = cost;
    this._options = options;
  }

  getTemplate() {
    return `<div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._eventType}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this._eventType} to ${this._city}</h3>

          <div class="event__schedule">
          <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${moment(this._eventStart).format(`hh : mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${moment(this._eventEnd).format(`hh : mm`)}</time>
          </p>
          <p class="event__duration">${this._durationHrs}H ${this._durationMins}M</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._cost}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
          ${this._options.map((option) => (`
            <li class="event__offer">
              <span class="event__offer-title">${option.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
            </li>`.trim())).join(``)}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>`.trim();
  }
}
