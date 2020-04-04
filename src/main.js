import {getMenu} from './components/menu.js';
import {getFiltersForm} from './components/filtersForm.js';
import {getFilter} from './components/filter.js';
import {getCard} from './components/card.js';
// import {getCards} from './components/cards.js';
import {editEvent} from './components/editEvent.js';
import {getSort} from './components/sort.js';
import {getRouteInfoElement} from './components/routeInfo.js';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfo = document.querySelector(`.trip-main`);
render(tripInfo, getRouteInfoElement(`Mar 18`, `20`, `Amsterdam`, `Chamonix`, `Geneva`, `1230`), `afterbegin`);
const tripControls = document.querySelector(`.trip-controls`);
render(tripControls, getMenu(), `afterbegin`);
render(tripControls, getFiltersForm(), `beforeend`);
const filtersForm = document.querySelector(`.trip-filters`);
render(filtersForm, getFilter(), `afterbegin`);
const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, getSort(), `afterbegin`);
// render(tripEvents, getCards(), `beforeend`);
new Array(3).fill(``).forEach(() => render(tripEvents, getCard(), `beforeend`));
const items = document.querySelectorAll(`.trip-days__item`);
const events = items[0].querySelectorAll(`.trip-events__item`);
events[1].innerHTML = ``;
render(events[1], editEvent(), `beforeend`);
