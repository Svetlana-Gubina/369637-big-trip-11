import AbstractComponent from './abstract-component.js';
import {render, Position} from '../utils.js';

export default class Destinations extends AbstractComponent {
  constructor(list, city) {
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

  getInfo(name) {
    const index = this._list.findIndex((it) => it[`name`] === name);
    return this._list[index];
  }

  render(container) {
    render(container, this, Position.BEFOREEND);
  }
}
