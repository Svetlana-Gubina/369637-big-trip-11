import FiltersComponent from '../components/filter.js';
import {FilterName} from "../constants.js";
import {render, replace, Position} from "../utils.js";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterName = FilterName.everything;
    this._filtersComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterName).map((filterName) => {
      return {
        name: filterName,
        checked: filterName === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;
    this._filterComponent = new FiltersComponent(filters);

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, Position.BEFOREEND);
    }
  }

  _onFilterChange(filterName) {
    this._pointsModel.setFilter(filterName);
    this._activeFilterName = filterName;
  }

  _onDataChange() {
    this.render();
  }
}
