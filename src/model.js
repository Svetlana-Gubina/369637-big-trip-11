export default class Model {
  constructor(data) {
    this.id = data[`id`];
    this.eventType = data[`type`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.eventStart = data[`date_from`];
    this.eventEnd = data[`date_to`];
    this.cost = data[`base_price`];
    this.destination = data[`destination`];
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`] || ``;
    this.options = data[`offers`] || [];
    this.photos = new Array(data[`pictures`] || []);
  }

  static parseEvent(data) {
    return new Model(data);
  }

  static parseEvents(data) {
    return data.map(Model.parseEvent);
  }

  toRAW() {
    return {
      'id': this.id,
      'is_favorite': this.isFavorite,
      'type': this._eventType,
      'date_from': this._eventStart,
      'date_to': this._eventEnd,
      'base_price': this._cost,
      'destination': this._destination,
      'offers': this._options,
      'pictures': this._photos,
    };
  }
}
