import {render, unrender, Position, check} from '../utils.js';
import {getSampleEvents} from '../data.js';
import {DATE} from '../constants.js';
import CardItem from '../components/card-item.js';
import Form from '../components/form.js';
import CardList from '../components/card-list.js';
import Sort from '../components/sort.js';
import Slot from '../components/slot.js';
import PointController from './point.js';

export default class TripController {
  constructor(container, totalField) {
    this._container = container;
    this._totalField = totalField;
    this._form = new Form();
    this._cardList = new CardList();
    this._sort = new Sort();
    this._days = [];
    this._allEvents = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
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
          this._renderPoint(events[j], Array.from(slots)[j]);
        }
      }
    } else {
      render(this._container, this._form.getElement(), Position.AFTERBEGIN);
    }
    let total = 0;
    let costs = this._allEvents.reduce((sum, current) => sum + current.cost, 0);
    total = total + costs;
    this._totalField.innerHTML = total;
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }


  _renderPoint(point, container) {
    const pointController = new PointController(container, point, this._onChangeView, this._onDataChange, this._cardList);
    pointController.init();
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    const index = this._allEvents.findIndex((it) => it === oldData);
    if (newData === null) {
      this._allEvents = [...this._allEvents.slice(0, index), ...this._allEvents.slice(index + 1)];

      const slots = this._container.querySelectorAll(`.trip-events__item`);
      const lastSlot = Array.from(slots)[slots.length - 1];
      unrender(lastSlot);
    } else if (oldData === null) {
      this._allEvents.unshift(newData);

      const lists = this._container.querySelectorAll(`.trip-events__list`);
      const lastlist = Array.from(lists)[lists.length - 1];
      const additionalSlot = new Slot();
      render(lastlist, additionalSlot.getElement(), Position.BEFOREEND);
    } else {
      this._allEvents[this._allEvents.findIndex((it) => it === oldData)] = newData;
    }
    this._renderEvents();
  }

  _renderEvents() {
    const slots = this._cardList.getElement().querySelectorAll(`.trip-events__item`);
    for (const slot of slots) {
      unrender(slot.children[0]);
    }

    if (this._days.length) {
      for (let j = 0; j < Array.from(slots).length; j++) {
        this._renderPoint(this._allEvents[j], Array.from(slots)[j]);
      }
    } else {
      render(this._container, this._form.getElement(), Position.AFTERBEGIN);
    }

    const dayItems = this._container.querySelectorAll(`.trip-days__item`);
    for (const day of dayItems) {
      const eventItems = day.querySelector(`.trip-events__list`).children;
      if (eventItems.length === 0) {
        unrender(day);
      }
    }

    let costs = this._allEvents.reduce((sum, current) => sum + current.cost, 0);
    this._totalField.innerHTML = costs;
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderDefault() {
    this._cardList.getElement().innerHTML = `<ul class="trip-days">
    </ul>`;
    if (this._days.length) {
      const eventsPerDay = this._allEvents.length / this._days.length;
      const eventsPerDayToRender = Math.trunc(eventsPerDay);
      const restEvents = this._allEvents.length - eventsPerDayToRender * this._days.length;

      for (let i = 0; i < this._days.length; i++) {
        const points = new Array(eventsPerDayToRender).fill(``);
        let item = new CardItem(i + 1, DATE.allDates(), points);
        render(this._cardList.getElement().querySelector(`.trip-days`), item.getElement(), Position.BEFOREEND);
      }
      const slots = this._container.querySelectorAll(`.trip-events__item`);
      for (let j = 0; j < Array.from(slots).length; j++) {
        this._renderPoint(this._allEvents[j], Array.from(slots)[j]);
      }
      if (restEvents) {
        let restEventsToRender = this._allEvents.slice(-restEvents);
        const lists = this._container.querySelectorAll(`.trip-events__list`);
        const lastlist = Array.from(lists)[lists.length - 1];
        for (let event of restEventsToRender) {
          const additionalSlot = new Slot();
          render(lastlist, additionalSlot.getElement(), Position.BEFOREEND);
          this._renderCard(event, additionalSlot.getElement());
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

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    } else {
      let label = evt.target.textContent.toLowerCase().trim();
      check(document.getElementById(`sort-${label}`));
    }
    this._cardList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `time`:
        const sortedByTimeEvents = this._allEvents.slice().sort((a, b) => (b.hoursEnd - b.hoursStart) - (a.hoursEnd - a.hoursStart));
        sortedByTimeEvents.forEach((taskMock) => this._renderPoint(taskMock, this._cardList.getElement()));
        break;
      case `price`:
        const sortedByPriceEvents = this._allEvents.slice().sort((a, b) => b.cost - a.cost);
        sortedByPriceEvents.forEach((taskMock) => this._renderPoint(taskMock, this._cardList.getElement()));
        break;
      case `default`:
        this._renderDefault();
        break;
    }
  }
}
