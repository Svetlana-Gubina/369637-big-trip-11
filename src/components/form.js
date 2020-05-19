import AbstractSmartComponent from './abstract-smart-component.js';
import Offer from './offer.js';
import Model from '../models//model.js';
import Select from './select.js';
import DestinationSection from './destination-section.js';
import {formDefaultEvent} from '../data.js';
import {AVAILABLE_EVENT_TYPES, MOVE_EVENT_TYPES, STAY_EVENT_TYPES, DefaultLabels, getNamedElement, getPrep, getTypeAvailableOptions, getOptionForTitle} from '../constants.js';
import {check, uncheck, render, Position} from '../utils.js';
import flatpickr from '../../node_modules/flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/light.css';
import DOMPurify from 'dompurify';

export default class Form extends AbstractSmartComponent {
  constructor(addNewEventElement, {points}) {
    super();
    this._addNewEventElement = addNewEventElement;
    this._destinations = points.getPointsAll();
    this._destination = formDefaultEvent[`destination`];
    this._description = formDefaultEvent[`destination`][`description`];
    this._photos = formDefaultEvent[`destination`][`pictures`];
    this._eventType = formDefaultEvent[`type`];
    this._prep = getPrep(this._eventType);
    this._city = formDefaultEvent[`destination`][`name`];
    this._eventStart = formDefaultEvent[`date_from`];
    this._hoursStart = new Date(this._eventStart).getHours();
    this._eventEnd = formDefaultEvent[`date_to`];
    this._hoursEnd = new Date(this._eventEnd).getHours();
    this._minutesStart = new Date(this._eventStart).getMinutes();
    this._minutesEnd = new Date(this._eventEnd).getMinutes();
    this._cost = formDefaultEvent[`base_price`];
    this._options = formDefaultEvent[`offers`];
    this._optionsList = [];

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
          <img class="event__type-icon" width="17" height="17" src="img/icons/${this._eventType.toLowerCase()}.png" alt="Event type icon">
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._cost}">
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

  parseFormData() {
    const formData = this.getData();
    return new Model({
      "id": ``,
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
    const destinationPoint = getNamedElement(this._destinations, this._city);
    const select = new Select(destinationPoint.name, this._destinations);
    select.render(container);
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

  setOptionsList({points}) {
    this._optionsList = points.getPointsAll();
    if (this._optionsList.length > 0) {
      this.renderOptions(this._optionsList, this._eventType);
    }
  }

  renderOptions(list, eventType) {
    this.getElement().querySelector(`.event__details`).classList.remove(`visually-hidden`);
    const offersContainer = this.getElement().querySelector(`.event__available-offers`);
    offersContainer.innerHTML = ``;
    const availableOptions = getTypeAvailableOptions(list, eventType);
    availableOptions.forEach(function (offer) {
      const option = new Offer(offer);
      render(offersContainer, option, Position.BEFOREEND);
    });

    this.getElement().querySelectorAll(`.event__offer-checkbox`)
      .forEach((checkbox) => checkbox
      .addEventListener(`change`, (evt) => {
        evt.preventDefault();
        const title = evt.target.id;
        const option = getOptionForTitle(availableOptions, title);

        if (getOptionForTitle(this._options, option.title)) {
          const index = this._options.indexOf(option);
          this._options.splice(index, 1);
        } else {
          this._options.push(option);
        }
      }));
  }

  _subscribeOnEvents() {
    this._addDatalis();

    this.getElement().querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      this._eventStart = evt.target.value;
      this._eventEnd = evt.target.value;
      this._applyFlatpickr();
    });

    this.getElement().querySelector(`#event-end-time-1`).addEventListener(`change`, (evt) => {
      this._eventEnd = evt.target.value;
      this._applyFlatpickr();
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

        this._options = [];
        this.renderOptions(this._optionsList, evt.target.textContent);
      }
    });

    this.getElement()
    .querySelector(`.event__field-group--destination`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const destinationPoint = getNamedElement(this._destinations, evt.target.value);
      this._destination = destinationPoint;
      this._description = this._destination.description;
      this._photos = destinationPoint.pictures;

      const section = new DestinationSection(destinationPoint);
      const details = this.getElement().querySelector(`.event__details`);
      if (details.classList.contains(`visually-hidden`)) {
        details.classList.remove(`visually-hidden`);
      }
      render(details, section, Position.BEFOREEND);
    });

    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._cost = DOMPurify.sanitize(evt.target.value);
    });
  }

}

