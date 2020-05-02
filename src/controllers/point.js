import {render, replace, Position} from '../utils.js';
import Card from '../components/card.js';
import EditEvent from '../components/edit-event.js';
import {getFormDateTime, getSelectedOptions} from '../constants.js';
import Model from '../models//model.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const parseFormData = (formData) => {
  return new Model({
    "type": formData.get(`event-type`),
    "date_from": getFormDateTime(formData.get(`event-start-time`)),
    "date_to": getFormDateTime(formData.get(`event-end-time`)),
    "base_price": formData.get(`event-price`),
    "is_favorite": Boolean(formData.get(`event-favorite`)),
    "destination": formData.get(`event-destination`),
    "offers": getSelectedOptions(formData),
  });
};

export default class PointController {
  constructor(container, point, onChangeView, onDataChange, list, api) {
    this._list = list;
    this._container = container;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._point = point;
    this._eventStart = this._point.eventStart;
    this._eventEnd = this._point.eventEnd;
    this._pointView = new Card(point);
    this._pointEdit = new EditEvent(point, api);
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replace(this._pointView, this._pointEdit);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._pointView.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, (evt) => {
         evt.preventDefault();
         this._onChangeView();
         replace(this._pointEdit, this._pointView);
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    this._pointEdit.getElement()
    .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         replace(this._pointView, this._pointEdit);
         document.removeEventListener(`keydown`, onEscKeyDown);
       });

    this._pointEdit.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._pointEdit.setData({
          deleteButtonLabel: `Deleting...`,
        });

        this._onDataChange(this, `delete`, this._point, null);
      });

    this._pointEdit.getElement()
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        const formData = new FormData(this._pointEdit.getElement().querySelector(`.event--edit`));
        const formEntry = parseFormData(formData);
        const model = Model.parseEvent(formEntry);

        this._pointEdit.setData({
          saveButtonLabel: `Saving...`,
        });

        this._onDataChange(this, `update`, this._point, model);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, this._pointView, Position.BEFOREEND);
  }

  shake() {
    this._pointEdit.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointView.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._pointEdit.getElement().style.animation = ``;
      this._pointView.getElement().style.animation = ``;
      this._pointEdit.setData({
        saveButtonLabel: `Save`,
        deleteButtonLabel: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
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

