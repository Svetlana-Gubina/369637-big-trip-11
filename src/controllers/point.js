import {render, replace, Position} from '../utils.js';
import Card from '../components/card.js';
import EditEvent from '../components/edit-event.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointController {
  constructor(container, onChangeView, onDataChange, list, api, formController) {
    this._list = list;
    this._api = api;
    this._container = container;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._pointView = null;
    this._pointEdit = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._formController = formController;
  }

  render(point, {points}) {
    this._pointView = new Card(point);
    this._pointEdit = new EditEvent(point, {points}, this._api);

    this._pointEdit.setSubmitHandler((evt) => {
      evt.preventDefault();
      const entry = this._pointEdit.parseFormData();
      this._pointEdit.setData({
        saveButtonLabel: `Saving...`,
      });
      this._onDataChange(this, `update`, point, entry);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setDeleteButtonClickHandler(() => {
      this._pointEdit.setData({
        deleteButtonLabel: `Deleting...`,
      });

      this._onDataChange(this, `delete`, this._point, null);
    });

    this._pointView.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, (evt) => {
         evt.preventDefault();
         this._formController.destroy();
         this._onChangeView();
         replace(this._pointEdit, this._pointView);
         document.addEventListener(`keydown`, this._onEscKeyDown);
       });

    this._pointEdit.getElement()
    .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         this._pointEdit.reset();
         replace(this._pointView, this._pointEdit);
         document.removeEventListener(`keydown`, this._onEscKeyDown);
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
        this._pointEdit.reset();
        item.replaceChild(this._pointView.getElement(), this._pointEdit.getElement());
      }
    }
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._pointEdit.reset();
      replace(this._pointView, this._pointEdit);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

