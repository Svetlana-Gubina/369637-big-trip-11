import {render, Position} from '../utils.js';
import Day from '../components/day.js';
import CardList from '../components/card-list.js';
import Sort from '../components/sort.js';
import PointController from './oneRoutePointManipulate.js';
import moment from 'moment';
import FormController from './addEvent.js';
import AbstractModel from '../models/abstractModel.js';
import {isIncludes, SortType, Action, StorePrefix, STORE_VER, AUTHORIZATION, END_POINT} from '../constants.js';
import Provider from "../api/provider.js";
import Store from "../api/store.js";
import API from '../api/api.js';

const DESTINATIONS_STORE_PREFIX = StorePrefix.destinations;
const DESTINATIONS_STORE_NAME = `${DESTINATIONS_STORE_PREFIX}-${STORE_VER}`;
const START_COUNT = 1;
const FilterName = {
  everything: `Everything`,
  future: `Future`,
  past: `Past`,
};

export default class TripController {
  constructor(container, pointsModel, addNewEventElement, apiWithProvider) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._apiWithProvider = apiWithProvider;
    this._cardList = new CardList();
    this._sortComponent = new Sort();
    this._totalField = null;
    this._addNewEventElement = addNewEventElement;
    this._days = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._subscriptions = [];

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._formController = new FormController(this._container, this._cardList, this._addNewEventElement, this._apiWithProvider, this._onDataChange);

    this._pointControllers = [];
  }

  renderDefault() {
    const data = this._pointsModel.getPointsAll();
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

  rerender() {
    // TODO: update RouteInfoElement
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
    // TODO: стоимость путешествия — это суммарная стоимость всех точек маршрута вместе со всеми выбранными дополнительными опциями.
    let costs = data.reduce((sum, current) => sum + current.cost, 0);
    this.updateTotal(costs);
  }

  updateTotal(number) {
    let total = 0;
    total = total + number;
    this._totalField.innerHTML = total;
  }

  _onSortTypeChange(sortType) {
    this._cardList.getElement().innerHTML = ``;
    const data = this._pointsModel.getPointsAll();
    switch (sortType) {
      case SortType.timeType:
        const sortedByTimeEvents = data.slice().sort((a, b) => (b.eventEnd - b.eventStart) - (a.eventEnd - a.eventStart));
        sortedByTimeEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case SortType.priceType:
        const sortedByPriceEvents = data.slice().sort((a, b) => b.cost - a.cost);
        sortedByPriceEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case SortType.defaultType:
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
    // TODO: обработака ошибки загрузки
    // .catch(() => {
    //
    // });
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
            this.renderTotalCount();
          }
        })
        // TODO: добавьте всему блоку с формой редактирования красную обводку (стилизация на ваше усмотрение).Перед повторной отправкой убирайте с формы красную обводку.
        .catch(() => {
          controller.shake();
        });
        break;
      case Action.update:
        this._apiWithProvider.updateEvent(oldData.id, newData)
        .then((event) => {
          const isSuccess = this._pointsModel.updateEvent(oldData.id, event);
          if (isSuccess) {
            this.rerender();
            this.renderTotalCount();
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
          this.renderTotalCount();
        }).catch(() => {
          controller.shake();
        });
        break;
    }
  }

  addEvent() {
    this.rerender();
    const formController = this._formController;
    const destinations = new AbstractModel();

    const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
    const provider = new Provider(api, destinationsStore);

    provider.getDestinations().then(function (points) {
      destinations.setPoints(points);
      formController.render({points: destinations});
    });
    // TODO: обработака ошибки загрузки
    // .catch(() => {
    //
    // });
  }

  filterEvents(currentFilter) {
    const data = this._pointsModel.getPointsAll();
    switch (currentFilter) {
      // TODO: Заблокируйте кнопку выбора фильтра, если данному фильтру не удовлетворяет ни одна точка маршрута.
      // debugger;
      case FilterName.future:
        this._pointControllers.forEach((pointController) => pointController.destroy());
        const futureEvents = data.slice().filter((event) => new Date(event.eventStart).getTime() > Date.now());
        this._pointControllers = [];
        this._subscriptions = [];
        for (let day of this._days) {
          if (new Date(day.getDate()).getTime() < Date.now() || !isIncludes(futureEvents, day.getPoints())) {
            day.hide();
          } else {
            day.show();
          }
          const slots = day.getElement().querySelectorAll(`.trip-events__item`);
          for (let point of futureEvents) {
            let slot = Array.from(slots).find((slotItem) => slotItem.id === point.id);
            if (slot) {
              this._renderPoint(point, slot);
            }
          }
        }
        let futCosts = futureEvents.reduce((sum, current) => sum + current.cost, 0);
        this.updateTotal(futCosts);
        // TODO: update RouteInfoElement
        break;
      case FilterName.past:
        // debugger;
        this._pointControllers.forEach((pointController) => pointController.destroy());
        const pastEvents = data.slice().filter((event) => new Date(event.eventEnd).getTime() < Date.now());
        this._pointControllers = [];
        this._subscriptions = [];
        for (let day of this._days) {
          if (new Date(day.getDate()).getTime() > Date.now() || !isIncludes(pastEvents, day.getPoints())) {
            day.hide();
          } else {
            day.show();
          }
          const slots = day.getElement().querySelectorAll(`.trip-events__item`);
          for (let point of pastEvents) {
            let slot = Array.from(slots).find((slotItem) => slotItem.id === point.id);
            if (slot) {
              this._renderPoint(point, slot);
            }
          }
        }
        let pastCosts = pastEvents.reduce((sum, current) => sum + current.cost, 0);
        this.updateTotal(pastCosts);
        // TODO: update RouteInfoElement
        break;
      case FilterName.everything:
        this.rerender();
        this.renderTotalCount();
        break;
    }
  }
}
