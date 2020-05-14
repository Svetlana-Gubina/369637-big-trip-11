import Menu from './components/menu.js';
import RouteInfoElement from './components/route-info.js';
import FiltersComponent from './components/filter.js';
import Statistics from "./components/statistics.js";
import TripController from './controllers/allEventsManipulate.js';
import API from './api.js';
import PointsModel from './models/points.js';
import {Position, render, check} from './utils.js';
import {FiltersNames, Tab} from './constants.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAr=${Math.random()}`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);
const addNewEventElement = document.querySelector(`.trip-main__event-add-btn`);

const pointsModel = new PointsModel();
const controller = new TripController(tripEvents, pointsModel, addNewEventElement, api);

api.getData().then(function (points) {
  pointsModel.setPoints(points);
  const routeInfo = new RouteInfoElement({points: pointsModel});
  routeInfo.render(tripMain);
  const totalField = document.querySelector(`.trip-info__cost-value`);
  controller.render(totalField);
  controller.renderTotalCount();
});

const tripControls = document.querySelector(`.trip-controls`);
const menu = new Menu();
render(tripControls, menu, Position.AFTERBEGIN);

const filtersForm = new FiltersComponent(FiltersNames);
render(tripControls, filtersForm, Position.BEFOREEND);

const statisticsComponent = new Statistics({events: pointsModel});
render(tripEvents, statisticsComponent, Position.BEFOREEND);
statisticsComponent.hide();

const headerCont = document.querySelector(`.page-header__container`);
headerCont.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName === `A`) {
    switch (evt.target.textContent) {
      case Tab.tableTab:
        controller.show();
        controller.showSortComponent();
        filtersForm.show();
        statisticsComponent.hide();
        break;
      case Tab.statsTab:
        controller.hide();
        controller.hideSortComponent();
        filtersForm.hide();
        statisticsComponent.show();
        break;
    }
  } else if (evt.target.tagName === `BUTTON`) {
    evt.target.disabled = true;
    statisticsComponent.hide();
    controller.show();
    filtersForm.show();
    controller.addEvent(addNewEventElement);
  }
});

filtersForm.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== `LABEL`) {
    return;
  } else {
    const currentFilter = evt.target.textContent;
    check(filtersForm.getElement().querySelector(`#filter-${currentFilter.toLowerCase()}`));
    controller.filterEvents(currentFilter);
  }
});

