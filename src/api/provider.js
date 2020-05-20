import Model from '../models/model.js';
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedEventss = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((accumulator, current) => {
    return Object.assign({}, accumulator, {
      [current.id]: current,
    });
  }, {});
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
          const items = createStoreStructure((events.map((event) => event.toRAW())));
          this._store.setItems(items);

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
        const items = destinations.reduce((accumulator, current) => {
          return Object.assign({}, accumulator, {
            [current.name]: current,
          });
        }, {});

        this._store.setItems(items);

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
        const items = offers.reduce((accumulator, current) => {
          return Object.assign({}, accumulator, {
            [current.type]: current,
          });
        }, {});

        this._store.setItems(items);

        return offers;
      });
    }

    const storeOffers = Object.values(this._store.getItems());
    return Promise.resolve(storeOffers);
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
      .then((newEvent) => {
        this._store.setItem(newEvent.id, newEvent.toRAW());

        return newEvent;
      });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Model.clone(Object.assign(event, {id: localNewEventId}));
    this._store.setItem(localNewEvent.id, localNewEvent.toRAW());
    return Promise.resolve(localNewEvent);
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
      .then((newEvent) => {
        this._store.setItem(newEvent.id, newEvent.toRAW());

        return newEvent;
      });
    }

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

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());
      return this._api.sync(storeEvents)
         .then((response) => {
           const createdEvents = getSyncedEventss(response.created);
           const updatedEvents = getSyncedEventss(response.updated);
           const items = createStoreStructure([...createdEvents, ...updatedEvents]);
           this._store.setItems(items);
         });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
