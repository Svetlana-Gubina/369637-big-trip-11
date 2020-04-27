import Menu from './components/menu.js';
import RouteInfoElement from './components/route-info.js';
import {Position, render, show, hide, check} from './utils.js';
import {RouteData} from './data.js';
import FiltersForm from './components/filters-form.js';
import Filters from './components/filter.js';
import TripController from './controllers/event.js';
import Stats from './components/stats.js';
import API from './api.js';
import Sort from './components/sort.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAr=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

/* === RENDER COMPONENTS ===  */

const tripInfo = document.querySelector(`.trip-main`);
const routeInfo = new RouteInfoElement(RouteData);
render(tripInfo, routeInfo.getElement(), Position.AFTERBEGIN);
const tripControls = document.querySelector(`.trip-controls`);
const menu = new Menu();
render(tripControls, menu.getElement(), Position.AFTERBEGIN);
const filtersForm = new FiltersForm();
render(tripControls, filtersForm.getElement(), Position.BEFOREEND);
const smallSort = document.querySelector(`.trip-filters`);
const filters = new Filters();
filters.getElement(smallSort);
const tripEvents = document.querySelector(`.trip-events`);
const totalField = document.querySelector(`.trip-info__cost-value`);


const controller = new TripController(tripEvents, totalField);
api.getData().then((data) => controller.init(data));

/* === SORT BY EVENT - TIME - PRICE === */

const sort = new Sort();
render(tripEvents, sort.getElement(), Position.AFTERBEGIN);
sort.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();
  api.getData().then((data) => controller.onSortLinkClick(evt, data));
});

/* === STATISTICS === */

const stats = new Stats();
render(tripEvents, stats.getElement(), Position.BEFOREEND);
hide(stats.getElement());
const canvasMoney = stats.getElement().querySelector(`.statistics__chart--money`);
const canvasTransport = stats.getElement().querySelector(`.statistics__chart--transport`);
const canvasTime = stats.getElement().querySelector(`.statistics__chart--time`);

const headerCont = document.querySelector(`.page-header__container`);
headerCont.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName === `A`) {
    switch (evt.target.textContent) {
      case `Table`:
        controller.show();
        show(smallSort);
        hide(stats.getElement());
        break;
      case `Stats`:
        controller.hide();
        hide(sort.getElement());
        hide(smallSort);
        show(stats.getElement());
        api.getData().then((data) => controller.createChart(canvasMoney, canvasTransport, canvasTime, data));
        break;
    }
  } else if (evt.target.tagName === `BUTTON`) {

    /* === ADD NEW EVENT ===  */

    controller.show();
    show(smallSort);
    api.getData().then((data) => controller.addEvent(data));
  }
});

/* === FILTER BY EVERYTHING - FUTURE - PAST === */

smallSort.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== `LABEL`) {
    return;
  } else {
    const currentFilter = evt.target.textContent;
    check(smallSort.querySelector(`#filter-${currentFilter.toLowerCase()}`));
    api.getData().then((data) => controller.filterEvents(currentFilter, data, evt));
  }
});
