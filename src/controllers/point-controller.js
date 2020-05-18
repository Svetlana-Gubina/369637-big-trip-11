import {render, replace, remove, Position} from '../utils.js';
import Card from '../components/card.js';
import EditEvent from '../components/edit-event.js';
import AbstractModel from '../models/abstract-model.js';
import {DefaultLabels, ChangeLabels, Action, StorePrefix, STORE_VER, AUTHORIZATION, END_POINT} from '../constants.js';
import Provider from "../api/provider.js";
import Store from "../api/store.js";
import API from '../api/api.js';

const OFFERS_STORE_PREFIX = StorePrefix.offers;
const OFFERS_STORE__NAME = `${OFFERS_STORE_PREFIX}-${STORE_VER}`;
const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointController {
  constructor(container, onChangeView, onDataChange, list, apiWithProvider, formController) {
    this._list = list;
    this._apiWithProvider = apiWithProvider;
    this._container = container;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._pointView = null;
    this._pointEdit = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._formController = formController;
  }

  destroy() {
    if (this._pointView) {
      remove(this._pointView);
    }
    if (this._pointEdit) {
      remove(this._pointEdit);
    }

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(point, {points}) {
    this._pointView = new Card(point);
    const pointEdit = new EditEvent(point, {points});
    this._pointEdit = pointEdit;

    const offers = new AbstractModel();

    const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    const offersStore = new Store(OFFERS_STORE__NAME, window.localStorage);
    const provider = new Provider(api, offersStore);

    provider.getOffers().then(function (list) {
      offers.setPoints(list);
      pointEdit.setOptionsList({points: offers});
    });

    this._pointEdit.setSubmitHandler((evt) => {
      evt.preventDefault();
      const entry = this._pointEdit.parseFormData();
      this._pointEdit.setData({
        saveButtonLabel: ChangeLabels.saveButtonLabel,
      });
      this._onDataChange(this, Action.update, point, entry);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setDeleteButtonClickHandler(() => {
      this._pointEdit.setData({
        deleteButtonLabel: ChangeLabels.deleteButtonLabel,
      });

      this._onDataChange(this, Action.delete, point, null);
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
        saveButtonLabel: DefaultLabels.saveButtonLabel,
        deleteButtonLabel: DefaultLabels.deleteButtonLabel,
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

