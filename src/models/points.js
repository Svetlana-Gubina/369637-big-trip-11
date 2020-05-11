export default class PointsModel {
  constructor() {
    this._points = [];
    this._dataChangeHandlers = [];
  }

  removeEvent(id) {
    const index = this._points.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  getpointsAll() {
    return this._points;
  }

  setpoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateEvent(id, event) {
    const index = this._points.findIndex((it) => it.id === id);
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

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
