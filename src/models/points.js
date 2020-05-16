import AbstractModel from './abstract-model.js';
import {FilterName} from "../constants.js";
import {getEventsByFilter} from "../utils.js";

export default class PointsModel extends AbstractModel {
  constructor() {
    super();
    this._activeFilterName = FilterName.everything;
    this._filterChangeHandlers = [];
  }

  setFilter(filterName) {
    this._activeFilterName = filterName;
    this._callHandlers(this._filterChangeHandlers);
  }

  getFilteredPoints() {
    return getEventsByFilter(this._points, this._activeFilterName);
  }

  removeEvent(id) {
    const index = this._points.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  updateEvent(id, event) {
    const index = this._points.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), event, this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  addEvent(event) {
    this._points = [].concat(event, this._points);
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
