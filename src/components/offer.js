import AbstractComponent from './abstract-component.js';
import {getRandomInteger} from '../utils.js';

const MIN_ID = 100;
const MAX_ID = 1000;

export default class Offer extends AbstractComponent {
  constructor({title, price, isAdded = false}) {
    super();
    this._id = getRandomInteger(MIN_ID, MAX_ID);
    this._title = title;
    this._price = price;
    this._isAdded = isAdded;
  }

  getTemplate() {
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${this._id}-1" type="checkbox" name="event-offer-${this._title}" ${this._isAdded ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${this._id}-1">
      <span class="event__offer-title">${this._title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${this._price}</span>
      </label>
    </div>`;
  }
}
