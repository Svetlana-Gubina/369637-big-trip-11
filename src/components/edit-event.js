import AbstractSmartComponent from './abstract-smart-component.js';
import {check, uncheck} from '../utils.js';
import {AVAILABLE_EVENT_TYPES, DefaultLabels} from '../constants.js';
import flatpickr from '../../node_modules/flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/light.css';
import Destinations from './destinations.js';
import {renderOption} from './option.js';
import Offers from './offers.js';
import Model from '../models//model.js';
import moment from 'moment';

const getSelectedOptions = (options, formData) => {
  return options.map((option) => option.title).reduce((acc, option) => formData.get(`event-offer-${option}`) ? [...acc, option] : acc, []);
};

export default class EditEvent extends AbstractSmartComponent {
  constructor({eventType, destination, cost, options, eventStart, eventEnd, isFavorite}, api) {
    super();
    this._event = {eventType, destination, cost, options, eventStart, eventEnd, isFavorite};
    this._api = api;
    this._eventType = eventType;
    this._city = destination.name;
    this._cost = cost;
    this._options = options;
    this._eventStart = eventStart;
    this._eventEnd = eventEnd;
    this._start = new Date(eventStart).toLocaleDateString();
    this._end = new Date(eventEnd).toLocaleDateString();
    this._diffTime = this._eventEnd - this._eventStart;
    this._hoursStart = new Date(this._eventStart).getHours();
    this._hoursEnd = new Date(this._eventEnd).getHours();
    this._minutesStart = new Date(this._eventStart).getMinutes();
    this._minutesEnd = new Date(this._eventEnd).getMinutes();
    this._photos = destination.pictures;
    this._description = destination.description;
    this._isFavorite = isFavorite;
    this._buttonLabels = DefaultLabels;
    this._subscribeOnEvents();

    this._flatpickr = null;
    this._applyFlatpickr();
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    return `<form class="event  event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._eventType.toLowerCase()}.png"  alt="Event type icon">
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
                  ${this._eventType} to
                  </label>

                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">
                    From
                  </label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._start} ${this._hoursStart}:${this._minutesStart}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">
                    To
                  </label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._end} ${this._hoursEnd}:${this._minutesEnd}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._cost}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">${this._buttonLabels.saveButtonLabel}</button>
                <button class="event__reset-btn" type="reset">${this._buttonLabels.deleteButtonLabel}</button>

                <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
                <label class="event__favorite-btn" for="event-favorite-1">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </label>

                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>

            <section class="event__details">

            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
              ${this._options.map((option) => renderOption(option)).join(``)}
              </div>
            </section>

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${this._description}</p>

              <div class="event__photos-container">
              <div class="event__photos-tape">
              ${this._photos.map((photo) => (`
              <img class="event__photo" src="${photo.src}" alt="Event photo">`
              .trim())).join(``)}
              </div>
              </div>
            </section>
          </section>
        </form>`.trim();
  }

  parseFormData() {
    const formData = this.getData();
    return new Model({
      "type": formData.get(`event-type`) || this._eventType,
      "date_from": formData.get(`event-start-time`),
      "date_to": formData.get(`event-end-time`),
      "base_price": formData.get(`event-price`),
      "is_favorite": Boolean(formData.get(`event-favorite`)),
      "destination": formData.get(`event-destination`),
      "offers": getSelectedOptions(this._options, formData),
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    return new FormData(form);
  }

  _addDatalis() {
    let container = this.getElement().querySelector(`.event__field-group--destination`);
    this._api.getDestinations().then((list) => new Destinations(list, this._city).render(container));
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
      dateFormat: `d/m/Y H:m`,
      maxDate: `01.01.2022 00:00`,
      defaultDate: this._eventStart,
    });

    this._flatpickr = flatpickr(end, {
      enableTime: true,
      dateFormat: `d/m/Y H:m`,
      minDate: this._eventStart,
      maxDate: `01.01.2022 00:00`,
      defaultDate: this._eventEnd,
    });
  }

  reset() {
    const event = this._event;
    this._eventType = event.eventType;
    this._city = event.destination.name;
    this._cost = event.cost;
    this._options = event.options;
    this._eventStart = new Date(event.eventStart).toLocaleDateString();
    this._eventEnd = new Date(event.eventEnd).toLocaleDateString();
    this._photos = event.destination.pictures;
    this._description = event.destination.description;
    this._isFavorite = event.isFavorite;

    this.rerender();
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  setData(labels) {
    this._buttonLabels = Object.assign({}, DefaultLabels, labels);
    this.rerender();
  }

  _subscribeOnEvents() {
    this._addDatalis();

    this.getElement()
    .querySelector(`#event-favorite-1`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._isFavorite = !this._isFavorite;
    });

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
        this._eventType = evt.target.textContent.toLowerCase();
        this.getElement().querySelector(`.event__label`).textContent = type + prep;
        let offersContainer = this.getElement().querySelector(`.event__available-offers`);
        offersContainer.innerHTML = ``;
        this._api.getOffers().then((list) => new Offers(list).render(offersContainer, evt.target.textContent.toLowerCase()));
      }
    });

    this.getElement()
    .querySelector(`.event__field-group--destination`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._city = evt.target.value;

      const photos = this.getElement().querySelector(`.event__photos-tape`);
      const destinationDescription = this.getElement().querySelector(`.event__destination-description`);
      this._api.getDestinations().then((list) => new Destinations(list, this._city).getInfo(evt.target.value))
      .then(function (point) {
        destinationDescription.textContent = point.description;
        photos.innerHTML = `${point.pictures.map((picture) => (`
        <img class="event__photo" src="${picture.src}" alt="Event photo">`
        .trim())).join(``)}`;
      });
    });

    this.getElement()
    .querySelector(`.event__input--price`).addEventListener(`keydown`, (evt) => {
      this._cost = evt.target.value;
    });

    this.getElement().querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      this._eventStart = evt.target.value;
      this._eventEnd = evt.target.value;
      this._applyFlatpickr();
    });

  }
}
