import {render, Position, remove, getDaysByFilter, getEventDates} from '../utils.js';
import Day from '../components/day.js';
import CardList from '../components/card-list.js';
import Sort from '../components/sort.js';
import SlotList from '../components/slot-list.js';
import PointController from './point-controller.js';
import FormController from './form-controller.js';
import AbstractModel from '../models/abstract-model.js';
import {FilterName, SortType, Action, StorePrefix, STORE_VER, AUTHORIZATION, END_POINT, getTotalPoitsCost} from '../constants.js';
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
    this._slotList = null;
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

  _setDays() {
    if (this._days.length) {
      this._days = [];
    }

    const allPoints = this._pointsModel.getPointsAll().slice().sort((a, b) => new Date(a.eventStart) - new Date(b.eventStart));

    let count = START_COUNT;
    allPoints.forEach((item) => {

      const itemDates = getEventDates(item);
      for (let day of itemDates) {
        let nextDay = new Day(count, day.dateNumber, day.date);
        let dayIndex = this._days.findIndex((dayItem) => dayItem.getDateNumber() === day.dateNumber);

        if (dayIndex !== -1) {
          if (!this._days[dayIndex]._points.includes(item)) {
            this._days[dayIndex]._points.push(item);
          }
        } else {
          count++;
          this._days.push(nextDay);
          nextDay._points.push(item);
        }
      }
    });
  }

  renderDefault() {
    const currentFilter = this._pointsModel.getFilterName();
    const days = getDaysByFilter(this._days, currentFilter);

    for (let day of days) {
      const slots = day.getElement().querySelectorAll(`.trip-events__item`);
      const dayPoints = day.getPoints();
      for (let point of dayPoints) {
        let slot = Array.from(slots).find((slotItem) => slotItem.id === point.id);
        this._renderPoint(point, slot);
      }
      render(this._cardList.getElement().querySelector(`.trip-days`), day, Position.BEFOREEND);
    }
  }

  renderSortedPoints(points) {
    if (this._slotList) {
      remove(this._slotList);
    }
    const slotList = new SlotList(points);
    this._slotList = slotList;
    render(this._container, slotList, Position.BEFOREEND);
    const slots = slotList.getElement().querySelectorAll(`.trip-events__item`);
    points.forEach((point) => {
      let slot = Array.from(slots).find((slotItem) => slotItem.id === point.id);
      this._renderPoint(point, slot);
    });
  }

  rerender() {
    this._filterController.render();
    this._cardList.getElement().innerHTML = `<ul class="trip-days">
    </ul>`;
    this._setDays();
    this._pointControllers = [];
    this.renderDefault();
  }

  render(totalField) {
    this._setDays();

    this._totalField = totalField;
    render(this._container, this._sortComponent, Position.AFTERBEGIN);
    render(this._container, this._cardList, Position.BEFOREEND);
    this.renderDefault();
  }

  renderTotalCount() {
    const points = this._pointsModel.getFilteredPoints();
    let total = 0;
    total = total + getTotalPoitsCost(points);
    this._totalField.innerHTML = total;
  }

  updateRouteInfo({points}) {
    this._routeInfo.update({points});
    this._routeInfo.rerender();
  }

  _onSortTypeChange(sortType) {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._subscriptions = [];
    this.hide();

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
        this.show();
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

  showTab() {
    const currentSortType = this._pointsModel.getSortType();
    if (currentSortType === SortType.defaultType) {
      this.show();
    } else {
      const pointsSortedByCurrentType = this._pointsModel.getSortedPoints();
      this.renderSortedPoints(pointsSortedByCurrentType);
    }
  }

  hideTab() {
    const currentSortType = this._pointsModel.getSortType();
    if (currentSortType === SortType.defaultType) {
      this.hide();
    } else {
      if (this._slotList) {
        remove(this._slotList);
      }
    }
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
              this._setDays();
              this.renderSortedPoints(this._pointsModel.getSortedPoints());
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
          const currentSortType = this._pointsModel.getSortType();
          if (currentSortType === SortType.defaultType) {
            this.rerender();
          } else {
            this._setDays();
            this.renderSortedPoints(this._pointsModel.getSortedPoints());
          }
          this.updateRouteInfo({points: this._pointsModel});
        }).catch(() => {
          controller.shake();
        });
        break;
    }
  }

  addEvent() {
    this._pointsModel.setSortType(SortType.defaultType);
    this._pointsModel.setFilter(FilterName.everything);
    this._sortComponent.setDefaultChecked();

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
    if (this._slotList) {
      remove(this._slotList);
    }
    this.show();
    this.rerender();
  }
}
