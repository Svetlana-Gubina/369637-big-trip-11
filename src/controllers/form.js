import {render, Position} from '../utils.js';
import Form from '../components/form.js';
// import {AVAILABLE_EVENT_TYPES, filterNullProps} from '../constants.js';
// import {check, uncheck} from '../utils.js';
// import {getSelectedOptions} from '../constants.js';
// import Model from '../models//model.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class FormController {
  constructor(container, addNewEventElement, api, onDataChange) {
    this._container = container;
    this._addNewEventElement = addNewEventElement;
    this._api = api;
    this._onDataChange = onDataChange;
    this._form = new Form(addNewEventElement, api);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  destroy() {
    this._form.remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render() {
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._form.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formEntry = this._form.parseFormData();
      // console.log(formEntry.toRAW());
      this._form.setData({
        saveButtonLabel: `Saving...`,
      });
      this._onDataChange(this, `create`, null, formEntry);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._form.setCancelButtonClickHandler(() => {
      this._form.reset();
      this._form.remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._form, Position.AFTERBEGIN);
    this._addNewEventElement.disabled = true;
  }

  shake() {
    this._form.getElement().querySelector(`.event`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._form.remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

