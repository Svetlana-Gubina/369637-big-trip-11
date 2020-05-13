import {render, Position} from '../utils.js';
import Form from '../components/form.js';
import AbstractModel from '../models/abstractModel.js';
import {ChangeLabels, Action} from '../constants.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class FormController {
  constructor(container, addNewEventElement, api, onDataChange) {
    this._container = container;
    this._addNewEventElement = addNewEventElement;
    this._api = api;
    this._onDataChange = onDataChange;
    this._form = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  destroy() {
    if (this._form) {
      this._form.remove();
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render({points}) {
    const form = new Form(this._addNewEventElement, this._api, {points});
    this._form = form;
    const offers = new AbstractModel();
    this._api.getOffers().then(function (list) {
      offers.setPoints(list);
      form.setOptionsList({points: offers});
    });
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._form.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formEntry = this._form.parseFormData();
      this._form.setData({
        saveButtonLabel: ChangeLabels.saveButtonLabel,
      });
      this._onDataChange(this, Action.create, null, formEntry);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._form.setCancelButtonClickHandler(() => {
      this._form.reset();
      this._form.remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._form, Position.AFTERBEGIN);
  }

  shake() {
    this._form.getElement().querySelector(`.event`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._form.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._form.remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

