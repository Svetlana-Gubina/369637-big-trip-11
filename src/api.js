import Model from './model.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getData() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(Model.parseEvents);
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(toJSON);
  }

  createEvent({event}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Model.parseEvent);
  }

  updateEvent({id, data}) {
    return this._load({
      url: `point/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Model.parseEvent);
  }

  deleteEvent({id}) {
    return this._load({url: `point/${id}`, method: Method.DELETE});
  }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw new Error(`fetch error: ${err}`);
      });
  }
}
