import Form from '../components/form.js';
import AbstractModel from '../models/abstract-model.js';
import {ChangeLabels, Action, StorePrefix, STORE_VER, AUTHORIZATION, END_POINT} from '../constants.js';
import Provider from "../api/provider.js";
import Store from "../api/store.js";
import API from '../api/api.js';

const OFFERS_STORE_PREFIX = StorePrefix.offers;
const OFFERS_STORE__NAME = `${OFFERS_STORE_PREFIX}-${STORE_VER}`;
const SHAKE_ANIMATION_TIMEOUT = 600;

export default class FormController {
  constructor(container, cardList, addNewEventElement, apiWithProvider, onDataChange) {
    this._container = container;
    this._cardList = cardList;
    this._addNewEventElement = addNewEventElement;
    this._apiWithProvider = apiWithProvider;
    this._onDataChange = onDataChange;
    this._form = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  destroy() {
    if (this._form) {
      this._form.remove();
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render({points}) {
    const form = new Form(this._addNewEventElement, {points});
    this._form = form;
    const offers = new AbstractModel();

    const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    const offersStore = new Store(OFFERS_STORE__NAME, window.localStorage);
    const provider = new Provider(api, offersStore);

    provider.getOffers().then(function (list) {
      offers.setPoints(list);
      form.setOptionsList({points: offers});
    });
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._form.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formEntry = this._form.parseFormData();
      this._form.setData({
        saveButtonLabel: ChangeLabels.saveButtonLabel,
      });
      this._onDataChange(this, Action.create, null, formEntry);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._form.setCancelButtonClickHandler(() => {
      this._form.reset();
      this._form.remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._container.insertBefore(this._form.getElement(), this._cardList.getElement());
  }

  shake() {
    this._form.getElement().querySelector(`.event`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._form.getElement().querySelector(`.event`).style = `outline: 2px solid red;`;
    setTimeout(() => {
      this._form.getElement().style.animation = ``;
      this._form.getElement().querySelector(`.event`).style = `outline: none;`;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._form.remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

