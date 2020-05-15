import AbstractComponent from './abstract-component.js';
import {LoadingMessage} from '../constants.js';
import {remove} from '../utils.js';

export default class Message extends AbstractComponent {
  constructor() {
    super();
    this._text = LoadingMessage.loading;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${this._text}</p>`;
  }

  setData(text) {
    this._text = text;
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, oldElement);
  }

  remove() {
    this._text = LoadingMessage.loading;
    remove(this);
  }

}
