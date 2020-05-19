import {render, Position} from '../utils.js';
import Day from '../components/day.js';
import CardList from '../components/card-list.js';
import Sort from '../components/sort.js';
import PointController from './point-controller.js';
import moment from 'moment';
import FormController from './form-controller.js';
import AbstractModel from '../models/abstract-model.js';
import {isIncludes, SortType, Action, StorePrefix, STORE_VER, AUTHORIZATION, END_POINT, getTotalPoitsCost} from '../constants.js';
import Provider from "../api/provider.js";
import Store from "../api/store.js";
import API from '../api/api.js';

const DESTINATIONS_STORE_PREFIX = StorePrefix.destinations;
const DESTINATIONS_STORE_NAME = `${DESTINATIONS_STORE_PREFIX}-${STORE_VER}`;
const START_COUNT = 1;

export default class TripController {
  constructor(container, pointsModel, addNewEventElement, routeInfo, apiWithProvider, filterController) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._apiWithProvider = apiWithProvider;
    this._routeInfo = routeInfo;
    this._filterController = filterController;
    this._cardList = new CardList();
    this._sortComponent = new Sort();
    this._totalField = null;
    this._addNewEventElement = addNewEventElement;
    this._days = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._subscriptions = [];
    this._pointControllers = [];

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._formController = new FormController(this._container, this._cardList, this._addNewEventElement, this._apiWithProvider, this._onDataChange);
  }

  renderDefault() {
    const data = this._pointsModel.getPointsAll().slice().sort((a, b) => new Date(a.eventStart) - new Date(b.eventStart));

    let count = START_COUNT;
    data.forEach((item) => {
      let start = moment(item.eventStart).date();
      let nextDay = new Day(count, start, item.eventStart);
      let dayIndex = this._days.findIndex((dayItem) => dayItem.getDateNumber() === start);
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
        let slot = Array.from(slots).find((slotItem) => slotItem.id === point.id);
        this._renderPoint(point, slot);
      }
      render(this._cardList.getElement().querySelector(`.trip-days`), day, Position.BEFOREEND);
    }
  }

  renderSortedPoints(points) {
    this._cardList.getElement().innerHTML = ``;
    points.forEach((point) => {
      this._renderPoint(point, this._cardList.getElement());
    });
  }

  rerender() {
    this._cardList.getElement().innerHTML = `<ul class="trip-days">
    </ul>`;
    this._days = [];
    this._pointControllers = [];
    this.renderDefault();
  }

  render(totalField) {
    this._totalField = totalField;
    render(this._container, this._sortComponent, Position.AFTERBEGIN);
    render(this._container, this._cardList, Position.BEFOREEND);
    this.renderDefault();
  }

  renderTotalCount() {
    const data = this._pointsModel.getPointsAll();
    let total = 0;
    total = total + getTotalPoitsCost(data);
    this._totalField.innerHTML = total;
  }

  updateRouteInfo({points}) {
    this._routeInfo.update({points});
    this._routeInfo.rerender();
  }

  _onSortTypeChange(sortType) {
    this._pointControllers = [];
    this._subscriptions = [];
    switch (sortType) {
      case SortType.timeType:
        this._pointsModel.setSortType(SortType.timeType);
        const pointsSortedByTime = this._pointsModel.getSortedPoints();
        this.renderSortedPoints(pointsSortedByTime);
        break;
      case SortType.priceType:
        this._pointsModel.setSortType(SortType.priceType);
        const pointsSortedByPtice = this._pointsModel.getSortedPoints();
        this.renderSortedPoints(pointsSortedByPtice);
        break;
      case SortType.defaultType:
        this._pointsModel.setSortType(SortType.defaultType);
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
    const pointController = new PointController(container, this._onChangeView, this._onDataChange, this._cardList, this._apiWithProvider, this._formController);
    this._pointControllers.push(pointController);
    const destinations = new AbstractModel();

    const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
    const provider = new Provider(api, destinationsStore);

    provider.getDestinations().then(function (points) {
      destinations.setPoints(points);
      pointController.render(point, {points: destinations});
    });
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((item) => item());
  }

  _onDataChange(controller, actionType, oldData, newData) {
    switch (actionType) {
      case Action.create:
        this._apiWithProvider.createEvent(newData)
        .then((event) => {
          const isSuccess = this._pointsModel.addEvent(event);
          if (isSuccess) {
            controller.destroy();
            this.rerender();
            this.updateRouteInfo({points: this._pointsModel});
          }
        })
        .catch(() => {
          controller.shake();
        });
        break;
      case Action.update:
        this._apiWithProvider.updateEvent(oldData.id, newData)
        .then((event) => {
          const isSuccess = this._pointsModel.updateEvent(oldData.id, event);
          if (isSuccess) {
            const currentSortType = this._pointsModel.getSortType();
            if (currentSortType === SortType.defaultType) {
              this.rerender();
            } else {
              this.renderSortedPoints(this._pointsModel.getPointsAll());
            }
            this.updateRouteInfo({points: this._pointsModel});
          }
        })
        .catch(() => {
          controller.shake();
        });
        break;
      case Action.delete:
        this._apiWithProvider.deleteEvent({
          id: oldData.id
        }).then(() => {
          this._pointsModel.removeEvent(oldData.id);
          this.rerender();
          this.updateRouteInfo({points: this._pointsModel});
        }).catch(() => {
          controller.shake();
        });
        break;
    }
  }

  addEvent() {
    this. _onSortTypeChange(SortType.defaultType);
    this._sortComponent.setDefaultChecked();
    this._filterController.render();

    const formController = this._formController;
    const destinations = new AbstractModel();

    const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
    const provider = new Provider(api, destinationsStore);

    provider.getDestinations().then(function (points) {
      destinations.setPoints(points);
      formController.render({points: destinations});
    });
  }

  _onFilterChange() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._subscriptions = [];

    const filteredPoints = this._pointsModel.getFilteredPoints();

    if (filteredPoints.length === this._pointsModel.getPointsAll().length) {
      this.rerender();
      this.updateRouteInfo({points: this._pointsModel});
    } else {
      for (let day of this._days) {
        if (!isIncludes(filteredPoints, day.getPoints())) {
          day.hide();
        } else {
          day.show();
        }
        const slots = day.getElement().querySelectorAll(`.trip-events__item`);
        for (let point of filteredPoints) {
          let slot = Array.from(slots).find((slotItem) => slotItem.id === point.id);
          if (slot) {
            this._renderPoint(point, slot);
          }
        }
      }
    }
  }
}
