import {createFilterMarkup} from "./filters.js";
import AbstractComponent from './abstract-component.js';
import {check} from '../utils.js';

export default class FiltersComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._checkDefaultFilter();
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);
    return `<form class="trip-filters" action="#" method="get">
    ${filtersMarkup}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      } else {
        const currentFilter = evt.target.textContent;
        check(this.getElement().querySelector(`#filter-${currentFilter.toLowerCase()}`));
        handler(currentFilter);
      }
    });
  }

  _checkDefaultFilter() {
    this.getElement().querySelector(`#filter-everything`).checked = true;
  }
}
