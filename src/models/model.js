import moment from 'moment';

export default class Model {
  constructor(event) {
    this.cost = event[`base_price`];
    this.id = event[`id`];
    this.eventType = event[`type`];
    this.isFavorite = Boolean(event[`is_favorite`]);
    this.options = event[`offers`] || [];
    this.destination = event[`destination`];
    this.eventStart = event[`date_from`]; // "2019-07-10T22:55:56.845Z",
    this.eventEnd = event[`date_to`]; // "2019-07-11T11:22:13.375Z",
  }

  static parseEvent(data) {
    return new Model(data);
  }

  static parseEvents(data) {
    return data.map(Model.parseEvent);
  }

  toRAW() {
    return {
      "base_price": this.cost,
      "date_from": this.eventStart, // moment(this.eventStart).format(),
      "date_to": this.eventEnd, // moment(this.eventEnd).format(),
      "destination": this.destination,
      "is_favorite": this.isFavorite,
      "offers": this.options,
      "type": this.eventType,
    };
  }
}
