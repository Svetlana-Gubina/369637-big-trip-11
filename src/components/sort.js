import AbstractComponent from './abstract-component.js';
import {check} from '../utils.js';
import {SortType} from '../constants.js';

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currenSortType = SortType.defaultType;
  }

  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
              <span class="trip-sort__item  trip-sort__item--day">Day</span>

              <div class="trip-sort__item  trip-sort__item--event">
                <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
                <label data-sort-type="${SortType.defaultType}" class="trip-sort__btn" for="sort-event">Event</label>
              </div>

              <div class="trip-sort__item  trip-sort__item--time">
                <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
                <label data-sort-type="${SortType.timeType}" class="trip-sort__btn" for="sort-time">
                  Time
                  <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                  </svg>
                </label>
              </div>

              <div class="trip-sort__item  trip-sort__item--price">
                <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
                <label data-sort-type="${SortType.priceType}" class="trip-sort__btn" for="sort-price">
                  Price
                  <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                  </svg>
                </label>
              </div>

              <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
            </form>`;
  }

  getSortType() {
    return this._currenSortType;
  }

  setDefaultChecked() {
    check(this.getElement().querySelector(`#sort-event`));
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (sortType === SortType.defaultType) {
        check(this.getElement().querySelector(`#sort-event`));
      } else {
        check(this.getElement().querySelector(`#sort-${sortType}`));
      }


      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;
      handler(this._currenSortType);
    });
  }
}
