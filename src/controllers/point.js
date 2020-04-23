import {render, Position} from '../utils.js';
import Card from '../components/card.js';
import EditEvent from '../components/edit-event.js';
import {getFormDateTime, filterNullProps, getSelectedOptions} from '../constants.js';
import Model from '../model.js';

export default class PointController {
  constructor(container, point, onChangeView, onDataChange, list) {
    this._list = list;
    this._container = container;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._point = point;
    this._eventStart = this._point.eventDate;
    this._diffTime = this._point.diffTime;
    this._eventEnd = this._point.eventDate + this._diffTime;
    this._pointView = new Card(point);
    this._pointEdit = new EditEvent(point);
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._pointView.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, (evt) => {
         evt.preventDefault();
         this._onChangeView();
         this._container.replaceChild(this._pointEdit.getElement(), this._pointView.getElement());
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    this._pointEdit.getElement()
    .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         this._container.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
         document.removeEventListener(`keydown`, onEscKeyDown);
       });

    this._pointEdit.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {

        this._onDataChange(`delete`, this._point);
      });

    this._pointEdit.getElement()
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        const formData = new FormData(this._pointEdit.getElement().querySelector(`.event--edit`));

        const formEntry = filterNullProps({
          eventType: formData.get(`event-type`),
          eventStart: getFormDateTime(formData.get(`event-start-time`)),
          eventEnd: getFormDateTime(formData.get(`event-end-time`)),
          city: formData.get(`event-destination`),
          cost: Number(formData.get(`event-price`)),
          options: getSelectedOptions(formData),
          isFavorite: Boolean(formData.get(`event-favorite`)),
        });

        const entry = Object.assign({}, this._point, formEntry);
        const model = Model.parseEvent(entry);

        this._onDataChange(`update`, model);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, this._pointView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    let eventItems = this._list.getElement().querySelectorAll(`.trip-events__item`);
    for (const item of eventItems) {
      if (item.contains(this._pointEdit.getElement())) {
        item.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
      }
    }
  }
}

