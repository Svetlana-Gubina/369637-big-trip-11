import Menu from './components/menu.js';
import RouteInfoElement from './components/route-info.js';
import {Position, render} from './utils.js';
import {RouteData, getSampleEvents} from './data.js';
import FiltersForm from './components/filters-form.js';
import Filters from './components/filter.js';
import Sort from './components/sort.js';
import CardList from './components/card-list.js';
import {DATE} from './constants.js';
import Card from './components/card.js';
import EditEvent from './components/edit-event.js';
import Form from './components/form.js';

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
const sort = new Sort();
render(tripEvents, sort.getElement(), Position.AFTERBEGIN);
const lists = [];
new Array(DATE.duration).fill(``).forEach((value, i) => lists.push(new CardList(i + 1, DATE.allDates())));
lists.forEach((list) => render(tripEvents, list.getElement(), Position.BEFOREEND));
if (lists.length) {
  lists.forEach((list) => render(tripEvents, list.getElement(), Position.BEFOREEND));
} else {
  const form = new Form();
  render(tripEvents, form.getElement(), Position.BEFOREEND);
}
const days = document.querySelectorAll(`.trip-events__list`);
const totalField = document.querySelector(`.trip-info__cost-value`);

let total = 0;
const renderEvents = (container) => {
  let events = getSampleEvents();
  const renderCard = (event) => {
    const eventComponent = new Card(event);
    const eventEditComponent = new EditEvent(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    eventEditComponent.getElement()
    .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
         document.removeEventListener(`keydown`, onEscKeyDown);
       });

    eventEditComponent.getElement()
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(container, eventComponent.getElement(), Position.BEFOREEND);
  };
  events.forEach((eventMock) => renderCard(eventMock));
  let costs = events.map(({cost}) => cost).reduce((sum, current) => sum + current, 0);
  total = total + costs;
};

days.forEach((day) => renderEvents(day));
totalField.innerHTML = total;
