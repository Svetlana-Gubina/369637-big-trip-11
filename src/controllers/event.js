import {render, unrender, Position, check} from '../utils.js';
import {getEvent} from '../data.js';
import {filterNullProps, getFormDateTime} from '../constants.js';
import Day from '../components/day.js';
import Form from '../components/form.js';
import CardList from '../components/card-list.js';
import PointController from './point.js';
import Chart from 'chart.js';
import moment from 'moment';
import API from '../api.js';
import Model from '../model.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});


export default class TripController {
  constructor(container, totalField) {
    this._container = container;
    this._totalField = totalField;
    this._form = new Form();
    this._cardList = new CardList();
    this._days = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
  }

  init(data) {
    // console.log(data);
    render(this._container, this._cardList.getElement(), Position.BEFOREEND);

    let count = 1;
    data.forEach((item) => {
      let start = moment(item.eventStart).date();

      let nextDay = new Day(count, start);
      let dayIndex = this._days.findIndex((it) => it._date === start);
      if (dayIndex !== -1) {
        this._days[dayIndex]._points.push(item);
      } else {
        count++;
        this._days.push(nextDay);
        nextDay._points.push(item);
      }
    });

    for (let day of this._days) {
      const slots = day.getElement().querySelectorAll(`.trip-events__item`);
      for (let point of day._points) {
        let slot = Array.from(slots).find((it) => it.id === point.id);
        this._renderPoint(point, slot);
      }
      render(this._cardList.getElement().querySelector(`.trip-days`), day.getElement(), Position.BEFOREEND);
    }

    let total = 0;
    let costs = data.reduce((sum, current) => sum + current.cost, 0);
    total = total + costs;
    this._totalField.innerHTML = total;
  }


  show() {
    this._cardList.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._cardList.getElement().classList.add(`visually-hidden`);
  }


  _renderPoint(point, container) {
    const pointController = new PointController(container, point, this._onChangeView, this._onDataChange, this._cardList);
    pointController.init();
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(actionType, update) {
    switch (actionType) {
      case `update`:
        api.updateEvent({
          id: update.id,
          data: update.toRAW()
        }).then((data) => this.init(data));
        break;
      case `delete`:
        api.deleteEvent({
          id: update.id
        })
          .then(() => api.getData())
          .then((data) => this.init(data));
        break;
    }
  }


  addEvent(evs) {
    this._cardList.getElement().innerHTML = `<ul class="trip-days">
          </ul>`;
    this._days = [];
    this.init(evs);
    render(this._container, this._form.getElement(), Position.AFTERBEGIN);
    this._form.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      unrender(this._form.getElement());
      this._form.removeElement();
    });

    this._form.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._form.getElement().querySelector(`.event--edit`));
      const defaultEvent = getEvent();
      const formEntry = filterNullProps({
        eventType: formData.get(`event-type`),
        eventStart: getFormDateTime(formData.get(`event-start-time`)),
        eventEnd: getFormDateTime(formData.get(`event-end-time`)),
        city: formData.get(`event-destination`),
        cost: Number(formData.get(`event-price`)),
      });

      const newEvent = Object.assign({}, defaultEvent, formEntry);
      const model = Model.parseEvent(newEvent);

      api.createEvent({
        id: model.id,
        data: model.toRAW()
      }).then((data) => this.init(data));

      unrender(this._form.getElement());
      this._form.removeElement();
    });
  }

  // _renderEvents() {
  // }


  filterEvents(currentFilter, data, evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    } else {
      this._cardList.getElement().innerHTML = ``;
      switch (currentFilter) {
        case `Future`:
          const futureEvents = data.slice().filter((event) => event.eventStart > Date.now());
          futureEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
          break;
        case `Past`:
          const pastEvents = data.slice().filter((event) => event.eventEnd < Date.now());
          pastEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
          break;
        case `Everything`:
          this._cardList.getElement().innerHTML = `<ul class="trip-days">
          </ul>`;
          this._days = [];
          this.init(data);
          break;
      }
    }
  }

  onSortLinkClick(evt, data) {
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
        const sortedByTimeEvents = data.slice().sort((a, b) => (b.eventEnd - b.eventStart) - (a.eventEnd - a.eventStart));
        sortedByTimeEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case `price`:
        const sortedByPriceEvents = data.slice().sort((a, b) => b.cost - a.cost);
        sortedByPriceEvents.forEach((event) => this._renderPoint(event, this._cardList.getElement()));
        break;
      case `default`:
        this._cardList.getElement().innerHTML = `<ul class="trip-days">
        </ul>`;
        this._days = [];
        this.init(data);
        break;
    }
  }

  createChart(canvasMoney, canvasTransport, canvasTime, events) {
    const moneyCtx = canvasMoney.getContext(`2d`);
    const transportCtx = canvasTransport.getContext(`2d`);
    const timeCtx = canvasTime.getContext(`2d`);

    const getMoneyData = (eventType) => {
      return events.reduce((acc, evt) => evt.eventType === eventType ? evt.cost : acc, 0);
    };
    const rideMoneyData = getMoneyData(`Taxi`) + getMoneyData(`bus`) + getMoneyData(`transport`) + getMoneyData(`train`);
    const moneyChart = new Chart(moneyCtx, {
      type: `horizontalBar`,
      data: {
        labels: [`FLY`, `STAY`, `DRIVE`, `LOOK`, `EAT`, `RIDE`],
        datasets: [{
          data: [getMoneyData(`flight`), getMoneyData(`check-in`), getMoneyData(`drive`), getMoneyData(`sightseeing`), getMoneyData(`restaurant`), rideMoneyData],
          backgroundColor: [
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
          ],
          borderColor: [
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
          ],
          borderWidth: 1,
          barThickness: 40
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              min: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        title: {
          position: `left`,
          display: true,
          text: `MONEY`,
          fontSize: 16,
          fontColor: `#000000`
        },
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            bottom: 50
          }
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          duration: 1,
          onComplete() {
            let chartInstance = this.chart;
            let ctx = chartInstance.ctx;
            let icons = [`flight`, `check-in`, `drive`, `sightseeing`, `check-in`, `bus`];
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = `center`;
            ctx.textBaseline = `bottom`;
            this.data.datasets.forEach(function (dataset, i) {
              let meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                let img = new Image();
                img.src = `img/icons/${icons[index]}.png`;
                img.onload = () => {
                  ctx.drawImage(img, 37, bar._model.y - 8, 15, 15);
                };
                if (dataset.data[index] > 0) {
                  let data = String.fromCharCode(8364) + dataset.data[index];
                  ctx.fillText(data, bar._model.x - 20, bar._model.y + 5);
                }
              });
            });
          }
        }
      }
    });

    const getTransportData = (eventType) => {
      return events.filter((evt) => evt.eventType === eventType).length;
    };
    const rideData = getTransportData(`taxi`) + getTransportData(`bus`) + getTransportData(`transport`) + getTransportData(`train`);

    const transportChart = new Chart(transportCtx, {
      type: `horizontalBar`,
      data: {
        labels: [`DRIVE`, `RIDE`, `FLY`, `SAIL`],
        datasets: [{
          data: [getTransportData(`drive`), rideData, getTransportData(`flight`), getTransportData(`ship`)],
          backgroundColor: [
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
          ],
          borderColor: [
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
          ],
          borderWidth: 1,
          barThickness: 40
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              min: 0
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        title: {
          position: `left`,
          display: true,
          text: `TRANSPORT`,
          fontSize: 16,
          fontColor: `#000000`
        },
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            bottom: 50
          }
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          duration: 1,
          onComplete() {
            let chartInstance = this.chart;
            let ctx = chartInstance.ctx;
            let icons = [`drive`, `bus`, `flight`, `ship`];
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = `center`;
            ctx.textBaseline = `bottom`;
            this.data.datasets.forEach(function (dataset, i) {
              let meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                let img = new Image();
                img.src = `img/icons/${icons[index]}.png`;
                img.onload = () => {
                  ctx.drawImage(img, 37, bar._model.y - 8, 15, 15);
                };
                if (dataset.data[index] > 0) {
                  let data = dataset.data[index] + `x`;
                  ctx.fillText(data, bar._model.x - 15, bar._model.y + 5);
                }
              });
            });
          }
        }
      }
    });

    const getPlaceTimeSpent = (eventType) => {
      const hotels = events.filter((evt) => evt.eventType === eventType);
      let placeDurations = [];
      for (const evt of hotels) {
        placeDurations.push(moment.duration(evt.eventEnd - evt.eventStart).hours());
      }
      return placeDurations.reduce((sum, current) => sum + current, 0);
    };

    const getCityTimeSpent = (city) => {
      const hotels = events.filter((evt) => evt.city === city);
      let cityDurations = [];
      for (const evt of hotels) {
        cityDurations.push(moment.duration(evt.eventEnd - evt.eventStart).hours());
      }
      return cityDurations.reduce((sum, current) => sum + current, 0);
    };

    const timeChart = new Chart(timeCtx, {
      type: `horizontalBar`,
      data: {
        labels: [`HOTEL`, `TO AIRPORT`, `TO GENEVA`, `TO CHANOIX`],
        datasets: [{
          data: [getPlaceTimeSpent(`check-in`), getPlaceTimeSpent(`flight`),
            getCityTimeSpent(`Geneva`), getCityTimeSpent(`Chamonix`)],
          backgroundColor: [
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
          ],
          borderColor: [
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
            `rgba(255, 255, 255, 1)`,
          ],
          borderWidth: 1,
          barThickness: 40
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              min: 0
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }]
        },
        legend: {
          display: false
        },
        title: {
          position: `left`,
          display: true,
          text: `TIME SPENT`,
          fontSize: 16,
          fontColor: `#000000`
        },
        tooltips: {
          enabled: false
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          duration: 1,
          onComplete() {
            let chartInstance = this.chart;
            let ctx = chartInstance.ctx;
            let icons = [`check-in`, `flight`, `sightseeing`, `sightseeing`];
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = `center`;
            ctx.textBaseline = `bottom`;
            this.data.datasets.forEach(function (dataset, i) {
              let meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                let img = new Image();
                img.src = `img/icons/${icons[index]}.png`;
                img.onload = () => {
                  ctx.drawImage(img, 35, bar._model.y - 8, 15, 15);
                };
                if (dataset.data[index] > 0) {
                  let data = dataset.data[index] + `H`;
                  ctx.fillText(data, bar._model.x - 15, bar._model.y + 5);
                }
              });
            });
          }
        }
      }
    });
  }
}
