import AbstractComponent from './abstract-component.js';

export default class Offer extends AbstractComponent {
  constructor({title, price, isAdded}) {
    super();
    this._title = title;
    this._price = price;
    this._isAdded = isAdded;
    // this._subscribeOnEvents();
  }

  getTemplate() {
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${this._title}-1" type="checkbox" name="event-offer-${this._title}" ${this._isAdded ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${this._title}-1">
      <span class="event__offer-title">${this._title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${this._price}</span>
      </label>
    </div>`;
  }

  // _subscribeOnEvents() {
  //   this.getElement()
  //   .querySelector(`.event__offer-checkbox`).addEventListener(`change`, (evt) => {
  //     evt.preventDefault();
  //     this._isAdded = !this._isAdded;
  //   });
  // }
}
