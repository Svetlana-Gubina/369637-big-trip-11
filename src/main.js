import Menu from './components/menu.js';
import Message from './components/loading-message.js';
import RouteInfoElement from './components/route-info.js';
import Statistics from "./components/statistics.js";
import TripController from './controllers/trip-controller.js';
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import API from './api/api.js';
import PointsModel from './models/points.js';
import {Position, render} from './utils.js';
import {Tab, StorePrefix, STORE_VER, AUTHORIZATION, END_POINT, LoadingMessage} from './constants.js';
import FilterController from './controllers/filter-controller.js';

const OFFLINE_TITLE = ` [offline]`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const STORE_PREFIX = StorePrefix.events;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);
const addNewEventElement = document.querySelector(`.trip-main__event-add-btn`);
const message = new Message();
render(tripEvents, message, Position.BEFOREEND);
addNewEventElement.disabled = true;

const pointsModel = new PointsModel();
const routeInfo = new RouteInfoElement(tripMain);

const tripControls = document.querySelector(`.trip-controls`);
const menu = new Menu();
render(tripControls, menu, Position.AFTERBEGIN);
const filterController = new FilterController(tripControls, pointsModel);

const controller = new TripController(tripEvents, pointsModel, addNewEventElement, routeInfo, apiWithProvider, filterController);

apiWithProvider.getData().then(function (points) {
  addNewEventElement.disabled = false;
  if (points.length > 0) {
    pointsModel.setPoints(points);
    message.remove();
    routeInfo.update({points: pointsModel});
    routeInfo.render(tripMain);
    filterController.render();
    const totalField = document.querySelector(`.trip-info__cost-value`);
    controller.render(totalField);
    controller.renderTotalCount();
  } else {
    message.setData(LoadingMessage.noPoints);
  }
})
.catch(() => {
  message.setData(LoadingMessage.failed);
});

const statisticsComponent = new Statistics({events: pointsModel});
render(tripEvents, statisticsComponent, Position.BEFOREEND);
statisticsComponent.hide();

const headerCont = document.querySelector(`.page-header__container`);
headerCont.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName === `A`) {
    switch (evt.target.textContent) {
      case Tab.tableTab:
        controller.showTab();
        controller.showSortComponent();
        statisticsComponent.hide();
        break;
      case Tab.statsTab:
        controller.hideTab();
        controller.hideSortComponent();
        statisticsComponent.show();
        break;
    }
  } else if (evt.target.tagName === `BUTTON`) {
    evt.target.disabled = true;
    statisticsComponent.hide();
    controller.show();
    controller.addEvent(addNewEventElement);
  }
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(OFFLINE_TITLE, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += OFFLINE_TITLE;
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});
