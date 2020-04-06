import {getMenu} from './components/menu.js';
import {getFiltersForm} from './components/filters-form.js';
import {getFilter} from './components/filter.js';
import {getCardList} from './components/card-list.js';
import {getSort} from './components/sort.js';
import {getRouteInfoElement} from './components/route-info.js';
import {DATE} from './constants.js';
import {RouteInfo, getSampleEvents, getEvent} from './data.js';
import {getCard} from './components/card.js';
import {editEvent} from './components/edit-event.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfo = document.querySelector(`.trip-main`);
render(tripInfo, getRouteInfoElement(RouteInfo), `afterbegin`);
const tripControls = document.querySelector(`.trip-controls`);
render(tripControls, getMenu(), `afterbegin`);
render(tripControls, getFiltersForm(), `beforeend`);
const filtersForm = document.querySelector(`.trip-filters`);
render(filtersForm, getFilter(), `afterbegin`);
const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, getSort(), `afterbegin`);
new Array(DATE.duration).fill(``).forEach((value, i) => render(tripEvents, getCardList(i + 1, DATE.allDates()), `beforeend`));
const days = document.querySelectorAll(`.trip-events__list`);

let total = 0;

const getEventsToRender = () => {
  let events = getSampleEvents();
  let eventsTotal = events.map(({cost}) => cost)
                          .reduce((sum, current) => sum + current, 0);

  total = +eventsTotal;
  return events.map((event) => getCard(event)).join(``);
};
Array.from(days).forEach((value) => render(value, getEventsToRender(), `beforeend`));
const events = document.querySelectorAll(`.trip-events__item`);
events[1].innerHTML = ``;
render(events[1], editEvent(getEvent()), `beforeend`);

const totalField = document.querySelector(`.trip-info__cost`);
const getTotal = () => {
  return total;
};
render(totalField, getTotal(), `beforeend`);

