import {render, Position} from '../utils.js';
import {getSampleEvents} from '../data.js';
import {DATE} from '../constants.js';
import CardItem from '../components/card-item.js';
import Form from '../components/form.js';
import CardList from '../components/card-list.js';
import Sort from '../components/sort.js';
import Card from '../components/card.js';
import EditEvent from '../components/edit-event.js';


export default class TripController {
  constructor(container, totalField) {
    this._container = container;
    this._totalField = totalField;
    this._form = new Form();
    this._cardList = new CardList();
    this._sort = new Sort();
    this._days = [];
    this._allEvents = [];
  }

  init() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    render(this._container, this._cardList.getElement(), Position.BEFOREEND);
    this._days = new Array(DATE.duration).fill(``);
    if (this._days.length) {
      for (let i = 0; i < this._days.length; i++) {
        let events = getSampleEvents();
        this._allEvents.push(...events);
        let item = new CardItem(i + 1, DATE.allDates(), events);
        render(this._cardList.getElement().querySelector(`.trip-days`), item.getElement(), Position.BEFOREEND);
        const slots = item.getElement().querySelectorAll(`.trip-events__item`);
        for (let j = 0; j < Array.from(slots).length; j++) {
          this._renderCard(events[j], Array.from(slots)[j]);
        }
      }
    } else {
      render(this._container, this._form.getElement(), Position.AFTERBEGIN);
    }
    let total = 0;
    let costs = this._allEvents.reduce((sum, current) => sum + current.cost, 0);
    total = total + costs;
    this._totalField.innerHTML = total;
  }


  _renderCard(event, container) {
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
  }
}
