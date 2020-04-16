import Menu from './components/menu.js';
import RouteInfoElement from './components/route-info.js';
import {Position, render} from './utils.js';
import {RouteData} from './data.js';
import FiltersForm from './components/filters-form.js';
import Filters from './components/filter.js';
import TripController from './controllers/event.js';

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

