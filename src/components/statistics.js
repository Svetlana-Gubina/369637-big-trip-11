import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from 'chart.js';
import ChartDataLabels from 'chart.js';
import moment from 'moment';

export default class Statistics extends AbstractSmartComponent {
  constructor({events}) {
    super();
    this._events = events;
    this._moneyChart = null;
  }

  show() {
    super.show();
    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const canvasMoney = this.getElement().querySelector(`.statistics__chart--money`);
    const canvasTransport = this.getElement().querySelector(`.statistics__chart--transport`);
    const canvasTime = this.getElement().querySelector(`.statistics__chart--time`);

    const moneyCtx = canvasMoney.getContext(`2d`);
    const transportCtx = canvasTransport.getContext(`2d`);
    const timeCtx = canvasTime.getContext(`2d`);

    const getMoneyData = (eventType) => {
      return this._events.getPointsAll().reduce((acc, evt) => evt.eventType === eventType ? evt.cost : acc, 0);
    };
    const rideMoneyData = getMoneyData(`Taxi`) + getMoneyData(`bus`) + getMoneyData(`transport`) + getMoneyData(`train`);
    const moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [`FLY`, `STAY`, `DRIVE`, `LOOK`, `EAT`, `RIDE`],
        datasets: [{
          data: [getMoneyData(`flight`), getMoneyData(`check-in`), getMoneyData(`drive`), getMoneyData(`restaurant`), getMoneyData(`sightseeing`), rideMoneyData],
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
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          borderWidth: 1,
          barThickness: 44,
          minBarLength: 50
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              min: 20,
              beginAtZero: true
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
          text: `MONEY`,
          fontSize: 23,
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
      return this._events.getPointsAll().filter((evt) => evt.eventType === eventType).length;
    };
    const rideData = getTransportData(`taxi`) + getTransportData(`bus`) + getTransportData(`transport`) + getTransportData(`train`);

    const transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
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
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          borderWidth: 1,
          barThickness: 44,
          minBarLength: 50
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
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
          text: `TRANSPORT`,
          fontSize: 23,
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
      const hotels = this._events.getPointsAll().filter((evt) => evt.eventType === eventType);
      let placeDurations = [];
      for (const evt of hotels) {
        placeDurations.push(moment.duration(evt.eventEnd - evt.eventStart).hours());
      }
      return placeDurations.reduce((sum, current) => sum + current, 0);
    };

    const getCityTimeSpent = (city) => {
      const hotels = this._events.getPointsAll().filter((evt) => evt.city === city);
      let cityDurations = [];
      for (const evt of hotels) {
        cityDurations.push(moment.duration(evt.eventEnd - evt.eventStart).hours());
      }
      return cityDurations.reduce((sum, current) => sum + current, 0);
    };

    const timeChart = new Chart(timeCtx, {
      plugins: [ChartDataLabels],
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
          barThickness: 44,
          minBarLength: 50
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 5,
              fontSize: 13,
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
          fontSize: 23,
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

  getTemplate() {
    return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    </section>

    <section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
    </section>`;
  }
}
