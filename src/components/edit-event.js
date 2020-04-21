import AbstractComponent from './abstract-component.js';
import {renderOption} from './option.js';
import {check, uncheck, getRandomInteger, shuffle} from '../utils.js';
import {filteredArray, CITIES, AVAILABLE_OPTIONS, AVAILABLE_EVENT_TYPES, DESC} from '../constants.js';
import flatpickr from '../../node_modules/flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/light.css';

export default class EditEvent extends AbstractComponent {
  constructor({eventType, city, cost, options, eventDate, diffTime, photos, description, isFavorite}) {
    super();
    this._eventType = eventType;
    this._city = city;
    this._cost = cost;
    this._options = options;
    this._eventStart = eventDate;
    this._diffTime = diffTime;
    this._eventEnd = eventDate + this._diffTime;
    this._hoursStart = new Date(this._eventStart).getHours();
    this._hoursEnd = new Date(this._eventEnd).getHours();
    this._minutesStart = new Date(this._eventStart).getMinutes();
    this._minutesEnd = new Date(this._eventEnd).getMinutes();
    this._photos = photos;
    this._description = description;
    this._isFavorite = isFavorite;
    this._subscribeOnEvents();

    this._flatpickr = null;
    this._applyFlatpickr();
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
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
                  <datalist id="destination-list-1">
                  <option value="${this._city}">${this._city}</option>
                  ${filteredArray(CITIES, this._city).map((city) => (`
                  <option value="${city}">${city}</option>`
                  .trim())).join(``)}
                  </datalist>
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

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>

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
              <img class="event__photo" src="http://picsum.photos/300/150?r=${photo}" alt="Event photo">`
              .trim())).join(``)}
              </div>
              </div>
            </section>
          </section>
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
    .querySelector(`#event-favorite-1`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      if (this._isFavorite) {
        this._isFavorite = false;
      } else {
        this._isFavorite = true;
      }
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
        this.getElement().querySelector(`.event__label`).textContent = type + prep;

        let newOptions = shuffle(Array.from(AVAILABLE_OPTIONS).slice(0, getRandomInteger(1, 3)));
        this.getElement().querySelector(`.event__available-offers`).innerHTML = `${newOptions.map((option) => renderOption(option)).join(``)}`;
        this._options = newOptions;
      }
    });

    this.getElement()
    .querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      let newDesc = shuffle(DESC).slice(0, getRandomInteger(1, 3));
      this.getElement().querySelector(`.event__destination-description`).textContent = newDesc;

      let newPhotos = new Array(5).fill().map(() => getRandomInteger(1, 30));
      this.getElement().querySelector(`.event__photos-tape`).innerHTML = `${newPhotos.map((photo) => (`
      <img class="event__photo" src="http://picsum.photos/300/150?r=${photo}" alt="Event photo">`
      .trim())).join(``)}`;

      this._photos = newPhotos;
      this._description = newDesc;
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
