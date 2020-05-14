import Model from '../models/model.js';

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getData() {
    if (isOnline()) {
      return this._api.getData()
        .then((events) => {
          events.forEach((event) => this._store.setItem(event.id, event.toRAW()));

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());
    return Promise.resolve(Model.parseEvents(storeEvents));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
      .then((destinations) => {
        destinations.forEach((destination) => this._store.setItem(destination.name, destination));

        return destinations;
      });
    }

    const storeDestinations = Object.values(this._store.getItems());
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
      .then((offers) => {
        offers.forEach((offer) => this._store.setItem(offer.type, offers));

        return offers;
      });
    }

    const storeOffers = Object.values(this._store.getItems());
    return Promise.resolve(storeOffers);
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
      .then((newEvent) => {
        this._store.setItem(newEvent.id, newEvent.toRAW());

        return newEvent;
      });
    }

    // TODO: Реализовать логику при отсутствии интернета
    const localEvent = Model.clone(Object.assign(event, {id}));
    this._store.setItem(id, localEvent.toRAW());
    return Promise.resolve(localEvent);
  }

  deleteEvent({id}) {
    if (isOnline()) {
      return this._api.deleteEvent({id})
      .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }
}
