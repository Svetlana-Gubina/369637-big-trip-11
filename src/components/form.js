import AbstractComponent from './abstract-component.js';
import {CITIES, AVAILABLE_EVENT_TYPES} from '../constants.js';
import {check, uncheck} from '../utils.js';
import flatpickr from '../../node_modules/flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/light.css';

export default class Form extends AbstractComponent {
  constructor() {
    super();
    this._eventStart = Date.now();
    this._subscribeOnEvents();
    this._flatpickr = null;
    this._applyFlatpickr();
  }

  getTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            ${AVAILABLE_EVENT_TYPES.slice(0, 6).map((type) => (`
              <div class="event__type-item">
                <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
              </div>`.trim())).join(``)}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${AVAILABLE_EVENT_TYPES.slice(7, 10).map((type) => (`
            <div class="event__type-item">
              <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
              <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
            </div>`.trim())).join(``)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          Sightseeing at
        </label>
        <select class="event__input  event__input--destination" id="event-destination-1" name="event-destination">
        <option value=""></option>
        ${CITIES.map((city) => (`
        <option value="${city}">${city}</option>`
        .trim())).join(``)}
        </select>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
  </form>`.trim();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const start = this.getElement().querySelector(`#event-start-time-1`);
    const end = this.getElement().querySelector(`#event-end-time-1`);

    this._flatpickr = flatpickr(start, {
      enableTime: true,
      dateFormat: `d.m.Y H:m`,
      maxDate: `01.01.2022 00:00`
    });

    this._flatpickr = flatpickr(end, {
      enableTime: true,
      dateFormat: `d.m.Y H:m`,
      minDate: new Date(this._eventStart),
      maxDate: `01.01.2022 00:00`,
    });
  }

  _subscribeOnEvents() {
    this.getElement()
    .querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName === `LABEL`) {
        check(this.getElement().querySelector(`#event-type-${evt.target.textContent.toLowerCase()}-1`));
        uncheck(this.getElement().querySelector(`.event__type-toggle`));
        this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${evt.target.textContent.toLowerCase()}.png`;
        let type = AVAILABLE_EVENT_TYPES.find((it) => it === evt.target.textContent);
        let prep;
        if (AVAILABLE_EVENT_TYPES.slice(0, 6).includes(type)) {
          prep = ` to `;
        } else {
          prep = ` in `;
        }
        this.getElement().querySelector(`.event__label`).textContent = type + prep;
      }
    });

    this.getElement()
    .querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._city = evt.target.value;
    });

    this.getElement()
    .querySelector(`.event__input--price`).addEventListener(`keydown`, (evt) => {
      if (evt.key === `Enter`) {
        this._cost = evt.target.value;
      }
    });

  }
}

