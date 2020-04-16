import AbstractComponent from './abstract-component.js';

export default class CardList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days">
    </ul>`;
  }
}

