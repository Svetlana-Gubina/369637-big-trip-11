export default class Model {
  constructor(event) {
    this.cost = event[`base_price`];
    this.id = event[`id`];
    this.eventType = event[`type`];
    this.isFavorite = Boolean(event[`is_favorite`]);
    this.options = event[`offers`] || [];
    this.destination = event[`destination`];
    this.eventStart = event[`date_from`];
    this.eventEnd = event[`date_to`];
  }

  static parseEvent(event) {
    return new Model(event);
  }

  static parseEvents(events) {
    return events.map(Model.parseEvent);
  }

  toRAW() {
    return {
      "base_price": this.cost,
      "date_from": this.eventStart,
      "date_to": this.eventEnd,
      "destination": this.destination,
      "is_favorite": this.isFavorite,
      "offers": this.options,
      "type": this.eventType,
    };
  }

  static clone(event) {
    return new Model(event.toRAW());
  }
}
