import {render, unrender, Position, check} from '../utils.js';
import {getEvent} from '../data.js';
import {filterNullProps, getFormDateTime} from '../constants.js';
import Day from '../components/day.js';
import Form from '../components/form.js';
import CardList from '../components/card-list.js';
import PointController from './point.js';
import moment from 'moment';
import Model from '../model.js';


export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this.api = api;
    this._form = new Form();
    this._cardList = new CardList();
    this._days = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
  }

  render(routeInfo) {
    const totalField = routeInfo.getElement(). querySelector(`.trip-info__cost-value`);
    const data = this._pointsModel.getpointsAll();
    render(this._container, this._cardList, Position.BEFOREEND);

    let count = 1;
    data.forEach((item) => {
      let start = moment(item.eventStart).date();
      let nextDay = new Day(count, start);
      let dayIndex = this._days.findIndex((it) => it._date === start);
      if (dayIndex !== -1) {
        this._days[dayIndex]._points.push(item);
      } else {
        count++;
        this._days.push(nextDay);
        nextDay._points.push(item);
      }
    });

    for (let day of this._days) {
      const slots = day.getElement().querySelectorAll(`.trip-events__item`);
      for (let point of day._points) {
        let slot = Array.from(slots).find((it) => it.id === point.id);
        this._renderPoint(point, slot);
      }
      render(this._cardList.getElement().querySelector(`.trip-days`), day, Position.BEFOREEND);
    }

    let total = 0;
    let costs = data.reduce((sum, current) => sum + current.cost, 0);
    total = total + costs;
    totalField.innerHTML = total;
  }


  hide() {
    this._cardList.hide();
  }

  show() {
    this._cardList.show();
  }

  _renderPoint(point, container) {
    const pointController = new PointController(container, point, this._onChangeView, this._onDataChange, this._cardList);
    pointController.init();
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(actionType, update) {
    switch (actionType) {
      case `update`:
        this.api.updateEvent({
          id: update.id,
          data: update.toRAW()
        }).then((data) => this.init(data));
        break;
      case `delete`:
        this.api.deleteEvent({
          id: update.id
        })
          .then(() => this.api.getData())
          .then((data) => this.init(data));
        break;
    }
  }


  addEvent() {
    render(this._container, this._form, Position.AFTERBEGIN);
    this._form.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      unrender(this._form.getElement());
      this._form.removeElement();
    });

    this._form.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._form.getElement().querySelector(`.event--edit`));
      const defaultEvent = getEvent();
      const formEntry = filterNullProps({
        eventType: formData.get(`event-type`),
        eventStart: getFormDateTime(formData.get(`event-start-time`)),
        eventEnd: getFormDateTime(formData.get(`event-end-time`)),
        city: formData.get(`event-destination`),
        cost: Number(formData.get(`event-price`)),
      });
      const newEvent = Object.assign({}, defaultEvent, formEntry);
      const model = Model.parseEvent(newEvent);
      this.api.createEvent({
        id: model.id,
        data: model.toRAW()
      }).then((data) => this.init(data));
      unrender(this._form.getElement());
      this._form.removeElement();
    });
  }

  filterEvents(currentFilter, evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    } else {
      this._cardList.getElement().innerHTML = ``;
      const data = this._pointsModel.getpointsAll();
      switch (currentFilter) {
        case `Future`:
          const futureEvents = data.slice().filter((event) => event.eventStart > Date.now());
          futureEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
          break;
        case `Past`:
          const pastEvents = data.slice().filter((event) => event.eventEnd < Date.now());
          pastEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
          break;
        case `Everything`:
          this._cardList.getElement().innerHTML = `<ul class="trip-days">
          </ul>`;
          // this._days = [];
          // this.init(data);
          break;
      }
    }
  }

  onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    } else {
      let label = evt.target.textContent.toLowerCase().trim();
      check(document.getElementById(`sort-${label}`));
    }
    this._cardList.getElement().innerHTML = ``;
    const data = this._pointsModel.getpointsAll();

    switch (evt.target.dataset.sortType) {
      case `time`:
        const sortedByTimeEvents = data.slice().sort((a, b) => (b.eventEnd - b.eventStart) - (a.eventEnd - a.eventStart));
        sortedByTimeEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case `price`:
        const sortedByPriceEvents = data.slice().sort((a, b) => b.cost - a.cost);
        sortedByPriceEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case `default`:
        this._cardList.getElement().innerHTML = `<ul class="trip-days">
        </ul>`;
        // this._days = [];
        // this.init(data);
        break;
    }
  }
}
