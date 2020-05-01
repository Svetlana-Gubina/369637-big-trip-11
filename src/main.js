import Menu from './components/menu.js';
import RouteInfoElement from './components/route-info.js';
import {Position, render, show, hide, check} from './utils.js';
import FiltersForm from './components/filters-form.js';
import FiltersComponent from './components/filter.js';
import TripController from './controllers/event.js';
import API from './api.js';
import Sort from './components/sort.js';
import PointsModel from './models/points.js';
import {FiltersNames} from './constants.js';
import Statistics from "./components/statistics.js";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAr=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

/* === RENDER COMPONENTS ===  */

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main`);

const pointsModel = new PointsModel();
const controller = new TripController(tripEvents, pointsModel, api);

api.getData().then(function (data) {
  pointsModel.setpoints(data);
  const routeInfo = new RouteInfoElement({data: pointsModel});
  routeInfo.render(tripInfo);
  controller.render(routeInfo);
});

const tripControls = document.querySelector(`.trip-controls`);
const menu = new Menu();
render(tripControls, menu, Position.AFTERBEGIN);
const filtersForm = new FiltersForm();
render(tripControls, filtersForm, Position.BEFOREEND);

const filters = document.querySelector(`.trip-filters`);
const filterElements = new FiltersComponent(FiltersNames);
filterElements.getElement(filters);

// /* === SORT BY EVENT - TIME - PRICE === */

const sortComponent = new Sort();
render(tripEvents, sortComponent, Position.AFTERBEGIN);
sortComponent.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();
  controller.onSortLinkClick(evt);
});

// /* === STATISTICS === */

const statisticsComponent = new Statistics({events: pointsModel});
render(tripEvents, statisticsComponent, Position.BEFOREEND);
statisticsComponent.hide();

const headerCont = document.querySelector(`.page-header__container`);
headerCont.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName === `A`) {
    switch (evt.target.textContent) {
      case `Table`:
        controller.show();
        show(filters);
        sortComponent.show();
        statisticsComponent.hide();
        break;
      case `Stats`:
        controller.hide();
        sortComponent.hide();
        hide(filters);
        statisticsComponent.show();
        break;
    }
  } else if (evt.target.tagName === `BUTTON`) {
    /* === ADD NEW EVENT ===  */
    statisticsComponent.hide();
    controller.show();
    show(filters);
    controller.addEvent();
  }
});

// /* === FILTER BY EVERYTHING - FUTURE - PAST === */

filters.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== `LABEL`) {
    return;
  } else {
    const currentFilter = evt.target.textContent;
    check(filters
      .querySelector(`#filter-${currentFilter.toLowerCase()}`));
    controller.filterEvents(currentFilter, evt);
  }
});

