import AbstractComponent from './abstract-component.js';
import {render, Position} from '../utils.js';

export default class Select extends AbstractComponent {
  constructor(city, list) {
    super();
    this._city = city;
    this._list = list;
  }

  getTemplate() {
    return `<select class="event__input  event__input--destination" id="event-destination-1" name="event-destination">
    <option value="${this._city}">${this._city}</option>
    ${this._list.map((city) => (`
    <option value="${city.name}">${city.name}</option>`
    .trim())).join(``)}
    </select>`;
  }

  render(container) {
    render(container, this, Position.BEFOREEND);
  }
}
