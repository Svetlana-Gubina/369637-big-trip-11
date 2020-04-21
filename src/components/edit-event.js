import AbstractComponent from './abstract-component.js';
import {renderOption} from './option.js';
// import {check, uncheck, getRandomInteger, shuffle} from '../utils.js';
import {filteredArray, CITIES, AVAILABLE_OPTIONS, AVAILABLE_EVENT_TYPES, DESC} from '../constants.js';

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
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${new Date(this._eventDate).toLocaleDateString()} ${this._hours}:${this._durationMinutes}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">
                    To
                  </label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${new Date(this._eventDate).toLocaleDateString()} ${this._hours}:${this._durationMinutes}">
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

                <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
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

  _subscribeOnEvents() {

  }
}
