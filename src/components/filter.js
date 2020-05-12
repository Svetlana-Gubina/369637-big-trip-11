import {createFilterMarkup} from "./filters.js";
import AbstractComponent from './abstract-component.js';

export default class FiltersComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);
    return `<form class="trip-filters" action="#" method="get">
    ${filtersMarkup}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}
