import Menu from './components/menu.js';
import RouteInfoElement from './components/route-info.js';
import {Position, render, show, hide, check} from './utils.js';
import {RouteData} from './data.js';
import FiltersForm from './components/filters-form.js';
import Filters from './components/filter.js';
import TripController from './controllers/event.js';
import Stats from './components/stats.js';

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

let controller = new TripController(tripEvents, totalField);
controller.init();

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
        hide(smallSort);
        show(stats.getElement());
        controller.createChart(canvasMoney, canvasTransport, canvasTime);
        break;
    }
  } else if (evt.target.tagName === `BUTTON`) {
    controller.show();
    show(smallSort);
    controller.addEvent();
  }
});

smallSort.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== `LABEL`) {
    return;
  } else {
    const currentFilter = evt.target.textContent;
    check(smallSort.querySelector(`#filter-${currentFilter.toLowerCase()}`));
    controller.filterEvents(currentFilter);
  }
});
