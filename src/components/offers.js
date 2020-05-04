import AbstractComponent from './abstract-component.js';
import {render, Position} from '../utils.js';
import Offer from './offer.js';

export default class Offers extends AbstractComponent {
  constructor(list) {
    super();
    this._list = list;
  }

  render(container, type) {
    const item = this._list.find((element) => element.type === type);
    for (let offer of item.offers) {
      const option = new Offer(offer);
      render(container, option, Position.BEFOREEND);
    }
  }
}
