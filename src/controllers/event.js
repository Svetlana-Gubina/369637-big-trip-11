import {render, remove, Position} from '../utils.js';
import {getEvent} from '../data.js';
import {filterNullProps, getFormDateTime} from '../constants.js';
import Day from '../components/day.js';
import Form from '../components/form.js';
import CardList from '../components/card-list.js';
import Sort from '../components/sort.js';
import PointController from './point.js';
import moment from 'moment';
import Model from '../models//model.js';

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._form = new Form(api);
    this._cardList = new CardList();
    this._sortComponent = new Sort();
    this._totalField = null;
    this._days = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._subscriptions = [];

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  renderDefault() {
    const data = this._pointsModel.getpointsAll();
    let count = 1;
    data.forEach((item) => {
      let start = moment(item.eventStart).date();
      let nextDay = new Day(count, start, item.eventStart);
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
  }

  rerender() {
    this._cardList.getElement().innerHTML = `<ul class="trip-days">
    </ul>`;
    this._days = [];
    this.renderDefault();
  }

  render(routeInfo) {
    this._totalField = routeInfo.getElement(). querySelector(`.trip-info__cost-value`);
    render(this._container, this._sortComponent, Position.AFTERBEGIN);
    render(this._container, this._cardList, Position.BEFOREEND);
    this.renderDefault();
  }

  renderTotalCount() {
    const data = this._pointsModel.getpointsAll();
    let costs = data.reduce((sum, current) => sum + current.cost, 0);
    this.updateTotal(costs);
  }

  updateTotal(num) {
    let total = 0;
    total = total + num;
    this._totalField.innerHTML = total;
  }

  _onSortTypeChange(sortType) {
    this._cardList.getElement().innerHTML = ``;
    const data = this._pointsModel.getpointsAll();
    switch (sortType) {
      case `time`:
        const sortedByTimeEvents = data.slice().sort((a, b) => (b.eventEnd - b.eventStart) - (a.eventEnd - a.eventStart));
        sortedByTimeEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case `price`:
        const sortedByPriceEvents = data.slice().sort((a, b) => b.cost - a.cost);
        sortedByPriceEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case `default`:
        this.rerender();
        break;
    }
  }

  hide() {
    this._cardList.hide();
  }

  show() {
    this._cardList.show();
  }

  showSortComponent() {
    this._sortComponent.show();
  }

  hideSortComponent() {
    this._sortComponent.hide();
  }

  _renderPoint(point, container) {
    const pointController = new PointController(container, point, this._onChangeView, this._onDataChange, this._cardList, this._api);
    pointController.init();
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(pointController, actionType, oldData, newData) {
    switch (actionType) {
      case `update`:
        this._api.updateEvent(oldData.id, newData.toRAW()
        ).then((event) => {
          const isSuccess = this._pointsModel.updateEvent(oldData.id, event);
          if (isSuccess) {
            this.rerender();
            this.renderTotalCount();
          }
        })
        .catch(() => {
          pointController.shake();
        });
        break;
      case `delete`:
        this._api.deleteEvent({
          id: oldData.id
        }).then(() => {
          this._pointsModel.removeEvent(oldData.id);
          this.rerender();
          this.renderTotalCount();
        }).catch(() => {
          pointController.shake();
        });
        break;
    }
  }


  addEvent() {
    render(this._container, this._form, Position.AFTERBEGIN);

    this._form.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = this._form.getData();
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

      this._api.createEvent(model.toRAW())
      .then((pointModel) => {
        this._pointsModel.addEvent(pointModel);
        this.rerender();
        this.renderTotalCount();
        remove(this._form);
      }).catch(() => {
        this._form.shake();
      });
    });
  }

  filterEvents(currentFilter) {
    this._cardList.getElement().innerHTML = ``;
    const data = this._pointsModel.getpointsAll();
    switch (currentFilter) {
      case `Future`:
        const futureEvents = data.slice().filter((event) => event.eventStart > Date.now());
        futureEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        let futCosts = futureEvents.reduce((sum, current) => sum + current.cost, 0);
        this.updateTotal(futCosts);
        break;
      case `Past`:
        const pastEvents = data.slice().filter((event) => event.eventEnd < Date.now());
        pastEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        let pastCosts = pastEvents.reduce((sum, current) => sum + current.cost, 0);
        this.updateTotal(pastCosts);
        break;
      case `Everything`:
        this.rerender();
        this.renderTotalCount();
        break;
    }
  }
}
