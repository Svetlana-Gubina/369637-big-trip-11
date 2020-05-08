import AbstractSmartComponent from './abstract-smart-component.js';
import {AVAILABLE_EVENT_TYPES, MILLISECONDS, CITIES, DefaultLabels} from '../constants.js';
import {getRandomOfArray} from '../utils.js';
import flatpickr from '../../node_modules/flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/light.css';
import Destinations from './destinations.js';
import Offers from './offers.js';
import {check, uncheck} from '../utils.js';


export default class Form extends AbstractSmartComponent {
  constructor(addNewEventElement, api) {
    super();
    this._api = api;
    this._city = getRandomOfArray(CITIES);
    this._addNewEventElement = addNewEventElement;
    this._eventStart = Date.now();
    this._hoursStart = new Date(this._eventStart).getHours();
    this._eventEnd = new Date(this._eventStart + MILLISECONDS * 7);
    this._hoursEnd = new Date(this._eventEnd).getHours();
    this._minutesStart = new Date(this._eventStart).getMinutes();
    this._minutesEnd = new Date(this._eventEnd).getMinutes();
    this._cost = null;
    this._options = null;
    this._flatpickr = null;
    this._buttonLabels = DefaultLabels;
    this._applyFlatpickr();
    this._subscribeOnEvents();
    this._submitHandler = null;
    this._cancelButtonClickHandler = null;
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

      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${new Date(this._eventStart).toLocaleDateString()} ${this._hoursStart}:${this._minutesStart}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${new Date(this._eventEnd).toLocaleDateString()} ${this._hoursEnd}:${this._minutesEnd}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${Math.trunc(this._cost)}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">${this._buttonLabels.saveButtonLabel}</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>

    <section class="event__details visually-hidden">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">

          </div>
        </section>
    </section>
  </form>`.trim();
  }

  getData() {
    const formData = new FormData(this.getElement().querySelector(`.event--edit`));
    return formData;
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  remove() {
    this.getElement().remove();
    this.removeElement();
    this._addNewEventElement.disabled = false;
    document.removeEventListener(`keydown`, this.onEscKeyDown);
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
    this._addDatalis();
  }

  reset() {
    // const event = this._event;
    // this._eventType = event.eventType;
    // this._city = event.city;
    // this._cost = event.cost;
    // this._options = event.options;
    // this._eventStart = event.eventStart;
    // this._eventEnd = event.eventEnd;
    // this._photos = event.photos;
    // this._description = event.description;
    // this._isFavorite = event.isFavorite;

    this.rerender();
  }

  setCancelButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._cancelButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _addDatalis() {
    let container = this.getElement().querySelector(`.event__field-group--destination`);
    this._api.getDestinations().then((list) => new Destinations(list, this._city).render(container));
  }

  setData(labels) {
    this._buttonLabels = Object.assign({}, DefaultLabels, labels);
    this.rerender();
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
      minDate: this._eventStart,
      dateFormat: `d.m.Y H:m`,
      maxDate: `01.01.2022 00:00`,
      altInput: true,
      allowInput: true,
      defaultDate: this._eventStart || `today`,
    });

    this._flatpickr = flatpickr(end, {
      enableTime: true,
      minDate: this._eventStart,
      dateFormat: `d.m.Y H:m`,
      maxDate: `01.01.2022 00:00`,
      altInput: true,
      allowInput: true,
      defaultDate: this._eventEnd || `today`,
    });
  }

  _subscribeOnEvents() {
    this._addDatalis();

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

        this._api.getOffers().then((list) => this.renderOptions(evt, list));
      }
    });

    this.getElement()
    .querySelector(`.event__field-group--destination`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._city = evt.target.value;
    });

    this.getElement().querySelector(`.event__input--price`).addEventListener(`keydown`, (evt) => {
      evt.preventDefault();
      this._cost = evt.target.value;
    });
  }

  renderOptions(evt, list) {
    if (list.length > 0) {
      this.getElement().querySelector(`.event__details`).classList.remove(`visually-hidden`);
      const offersContainer = this.getElement().querySelector(`.event__available-offers`);
      offersContainer.innerHTML = ``;
      new Offers(list).render(offersContainer, evt.target.textContent.toLowerCase());
    }
  }
}

