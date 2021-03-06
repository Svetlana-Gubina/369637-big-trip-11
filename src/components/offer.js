import AbstractComponent from './abstract-component.js';

export default class Offer extends AbstractComponent {
  constructor({title, price, isAdded = false}) {
    super();
    this._title = title;
    this._price = price;
    this._isAdded = isAdded;
  }

  getTemplate() {
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${this._title}" type="checkbox" name="event-offer-${this._title}" ${this._isAdded ? `checked` : ``}>
      <label class="event__offer-label" for="${this._title}">
      <span class="event__offer-title">${this._title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${this._price}</span>
      </label>
    </div>`;
  }

}
