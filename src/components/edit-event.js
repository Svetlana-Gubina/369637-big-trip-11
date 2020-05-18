import AbstractSmartComponent from './abstract-smart-component.js';
import Select from './select.js';
import Model from '../models//model.js';
import Offer from './offer.js';
import {check, uncheck, render, Position} from '../utils.js';
import {AVAILABLE_EVENT_TYPES, MOVE_EVENT_TYPES, STAY_EVENT_TYPES, DefaultLabels, getNamedElement, getPrep} from '../constants.js';
import flatpickr from '../../node_modules/flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/light.css';
import DOMPurify from 'dompurify';

const getOptionForTitle = (options, title) => {
  return options.find((item) => item.title === title);
};

export default class EditEvent extends AbstractSmartComponent {
  constructor({eventType, destination, cost, options, eventStart, eventEnd, isFavorite}, {points}) {
    super();
    this._destinations = points.getPointsAll();

    this._destination = destination;
    this._city = destination.name;
    this._photos = destination.pictures;
    this._description = destination.description;

    this._event = {eventType, destination, cost, options, eventStart, eventEnd, isFavorite};
    this._eventType = eventType;
    this._prep = getPrep(this._eventType);
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
    this._isFavorite = isFavorite;
    this._buttonLabels = DefaultLabels;
    this._subscribeOnEvents();
    this._optionsList = [];

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

                      ${MOVE_EVENT_TYPES.map((type) => (`
                        <div class="event__type-item">
                          <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
                        </div>`.trim())).join(``)}
                    </fieldset>

                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Activity</legend>

                      ${STAY_EVENT_TYPES.map((type) => (`
                      <div class="event__type-item">
                        <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
                      </div>`.trim())).join(``)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                  ${this._eventType} ${this._prep}
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
      "base_price": Number(formData.get(`event-price`)),
      "is_favorite": Boolean(formData.get(`event-favorite`)),
      "destination": {
        "description": this._description,
        "name": formData.get(`event-destination`),
        "pictures": this._photos,
      },
      "offers": this._options,
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    return new FormData(form);
  }

  _addDatalis() {
    const container = this.getElement().querySelector(`.event__field-group--destination`);
    const destinationPoint = getNamedElement(this._destinations, this._city);
    const select = new Select(destinationPoint.name, this._destinations);
    select.render(container);
  }

  _addOptionslis() {
    const container = this.getElement().querySelector(`.event__available-offers`);
    this._options.forEach((option) => render(container, new Offer(option), Position.BEFOREEND));

    this.getElement().querySelectorAll(`.event__offer-checkbox`)
    .forEach((checkbox) => checkbox
    .addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const title = evt.target.id;
      const option = getOptionForTitle(this._options, title);
      if (!option.hasOwnProperty(`isAdded`) || option.isAdded === false) {
        option.isAdded = true;
      } else {
        option.isAdded = false;
      }
    }));
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
      dateFormat: `Z`,
      altInput: true,
      altFormat: `d/m/Y H:m`,
      defaultDate: this._eventStart,
    });

    this._flatpickr = flatpickr(end, {
      enableTime: true,
      dateFormat: `Z`,
      altInput: true,
      altFormat: `d/m/Y H:m`,
      minDate: this._eventStart,
      defaultDate: this._eventEnd,
    });
  }

  reset() {
    const event = this._event;

    this._eventType = event.eventType;
    this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${this._eventType.toLowerCase()}.png`;
    let type = AVAILABLE_EVENT_TYPES.find((item) => item === this._eventType);
    const prep = getPrep(type);
    this.getElement().querySelector(`.event__label`).textContent = type + prep;

    this._city = event.destination.name;
    const container = this.getElement().querySelector(`.event__field-group--destination`);
    const oldSelect = container.children[1];
    container.removeChild(oldSelect);
    const select = new Select(this._city, this._destinations);
    select.render(container);

    this._cost = event.cost;
    this.getElement().querySelector(`.event__input--price`).value = this._cost;

    this._options = event.options; // TODO!

    this._eventStart = event.eventStart;
    this._eventEnd = event.eventEnd;
    this._applyFlatpickr();

    this._photos = event.destination.pictures;
    this.getElement().querySelector(`.event__photos-tape`).innerHTML = `${this._photos.map((photo) => (`
    <img class="event__photo" src="${photo.src}" alt="Event photo">`
    .trim())).join(``)}`;

    this._description = event.destination.description;
    this.getElement().querySelector(`.event__destination-description`).innerHTML = this._description;

    this._isFavorite = event.isFavorite;
    const checkbox = this.getElement().querySelector(`#event-favorite-1`);
    if (this._isFavorite) {
      check(checkbox);
    } else {
      uncheck(checkbox);
    }
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

  setOptionsList({points}) {
    this._optionsList = points.getPointsAll();
  }

  _subscribeOnEvents() {
    this._addDatalis();
    this._addOptionslis();

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
        let type = AVAILABLE_EVENT_TYPES.find((item) => item === evt.target.textContent);
        const prep = getPrep(type);
        this._eventType = evt.target.textContent.toLowerCase();
        this.getElement().querySelector(`.event__label`).textContent = type + prep;
        let offersContainer = this.getElement().querySelector(`.event__available-offers`);
        offersContainer.innerHTML = ``;

        const newItem = this._optionsList.find((item) => item.type === evt.target.textContent);
        this._options = [];
        this._options.push(...newItem.offers);
        this._addOptionslis();
      }
    });


    this.getElement()
    .querySelector(`.event__field-group--destination`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const photosContainer = this.getElement().querySelector(`.event__photos-tape`);
      const destinationField = this.getElement().querySelector(`.event__destination-description`);
      const destinationPoint = getNamedElement(this._destinations, evt.target.value);
      this._destination = destinationPoint;
      destinationField.innerHTML = this._destination.description;
      this._description = this._destination.description;
      this._photos = destinationPoint.pictures;
      photosContainer.innerHTML = `${this._photos.map((photo) => (`
      <img class="event__photo" src="${photo.src}" alt="Event photo">`
      .trim())).join(``)}`;
    });

    this.getElement()
    .querySelector(`.event__input--price`).addEventListener(`keydown`, (evt) => {
      this._cost = DOMPurify.sanitize(evt.target.value);
    });

    this.getElement().querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      this._eventStart = evt.target.value;
      this._eventEnd = evt.target.value;
      this._applyFlatpickr();
    });

    this.getElement().querySelector(`#event-end-time-1`).addEventListener(`change`, (evt) => {
      this._eventEnd = evt.target.value;
      this._applyFlatpickr();
    });

  }
}
