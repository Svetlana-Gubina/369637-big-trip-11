import AbstractComponent from './abstract-component.js';
import {render, Position} from '../utils.js';
import {getfilteredArray} from '../constants.js';

export default class Select extends AbstractComponent {
  constructor(city, list) {
    super();
    this._city = city;
    this._list = list;
  }

  getTemplate() {
    return `<select class="event__input  event__input--destination" id="event-destination-1" name="event-destination">
    <option value="${this._city}">${this._city}</option>
    ${getfilteredArray(this._list.map((item) => item.name), this._city).map((city) => (`
    <option value="${city}">${city}</option>`
    .trim())).join(``)}
    </select>`;
  }

  render(container) {
    render(container, this, Position.BEFOREEND);
  }
}
