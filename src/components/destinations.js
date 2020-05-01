import AbstractComponent from './abstract-component.js';
import {render, Position} from '../utils.js';

export default class Destinations extends AbstractComponent {
  constructor(list) {
    super();
    this._list = list;
  }

  getTemplate() {
    return `<datalist id="destination-list-1">
    ${this._list.map((city) => (`
    <option value="${city.name}">${city.name}</option>`
    .trim())).join(``)}
    </datalist>`;
  }

  render(container) {
    render(container, this, Position.BEFOREEND);
  }
}
