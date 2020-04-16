import AbstractComponent from './abstract-component.js';

export default class Card extends AbstractComponent {
  constructor({eventType, city, cost, hours, durationHours, durationMinutes, option}) {
    super();
    this._eventType = eventType;
    this._city = city;
    this._cost = cost;
    this._hours = hours;
    this._durationHours = durationHours;
    this._durationMinutes = durationMinutes;
    this._option = option;
  }

  getTemplate() {
    return `<div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._eventType}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this._eventType} to ${this._city}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T10:30">${this._hours}:${this._durationMinutes}</time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T11:00">${this._hours}:${this._durationMinutes}</time>
            </p>
            <p class="event__duration">${this._durationHours}H ${this._durationMinutes}M</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._cost}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            <li class="event__offer">
              <span class="event__offer-title">${this._option.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${this._option.price}</span>
             </li>
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>`.trim();
  }
}
