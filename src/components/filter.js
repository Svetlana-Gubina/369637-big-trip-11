import {createFilterMarkup} from "./filters.js";
import AbstractComponent from './abstract-component.js';

export default class FiltersComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getElement(container) {
    container.innerHTML = this.getTemplate();
  }


  getTemplate() {
    const filtersMarkup = this._filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);
    return `${filtersMarkup}`;
  }

  // setFilterChangeHandler(handler) {
  //   this.getElement().addEventListener(`change`, (evt) => {
  //     const filterName = getFilterNameById(evt.target.id);
  //     handler(filterName);
  //   });
  // }
}
