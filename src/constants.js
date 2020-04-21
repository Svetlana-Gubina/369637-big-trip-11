import {getRandomBoolean} from './utils.js';
import moment from 'moment';

const MONTHES = new Set([
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
]);

export const INIT_DATE = Date.now() + 1 + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000;
export const RETURN_DATE = INIT_DATE + 1 + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000;
const MILLISECONDS = 86400000;


export const DATE = {
  startDay: new Date(INIT_DATE).getDate(),
  startMonth: Array.from(MONTHES)[new Date(INIT_DATE).getMonth()],
  endDay: new Date(RETURN_DATE).getDate(),
  endMonth: Array.from(MONTHES)[new Date(RETURN_DATE).getMonth()],
  duration: Math.ceil((RETURN_DATE - INIT_DATE) / 24 / 60 / 60 / 1000),
  allDates() {
    let dates = [INIT_DATE];
    let start = INIT_DATE;
    let msCount = start;
    for (let i = 0; i <= this.duration; i++) {
      msCount = msCount + MILLISECONDS;
      dates.push(msCount);
    }
    return dates;
  },
};

export const MIN_PRICE = 20;
export const MAX_PRICE = 1000;
export const DESC = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`.`);
export const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
export const AVAILABLE_EVENT_TYPES = [
  `bus`,
  `drive`,
  `flight`,
  `ship`,
  `train`,
  `transport`,
  `taxi`,
  `check`,
  `sightseeing`,
  `restaurant`,
];

export const AVAILABLE_OPTIONS = new Set([
  {
    title: `Add luggage`,
    shortTitle: `luggage`,
    price: 10,
    isAdded: getRandomBoolean(),
  },
  {
    title: `Switch to comfort class`,
    shortTitle: `comfort`,
    price: 150,
    isAdded: getRandomBoolean(),
  },
  {
    title: ` Add meal`,
    shortTitle: `meal`,
    price: 2,
    isAdded: getRandomBoolean(),
  },
  {
    title: `Choose seats`,
    shortTitle: `seats`,
    price: 9,
    isAdded: getRandomBoolean(),
  }
]);

export const getSelectedOptions = (formData) => {
  const selectedTitles = Array.from(AVAILABLE_OPTIONS)
                              .map(({shortTitle}) => shortTitle)
                              .reduce((acc, option) => formData.get(`event-offer-${option}`) ? [...acc, option] : acc, []);

  const selectedOptions = Array.from(AVAILABLE_OPTIONS)
                                .reduce((acc, it) => selectedTitles.includes(it.shortTitle) ? [...acc, it] : acc, []);

  return selectedOptions.length ? selectedOptions : null;
};

export const filterNullProps = (obj) => Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== null));

export const getFormDateTime = (formData, name) => {
  formData = {
    get() {
      return name;
    }
  };
  const value = formData.get(name);
  return value ? moment(value).toDate() : null;
};

export const filteredArray = (arr, item) => {
  let index = arr.indexOf(item);
  let newArr = arr.slice();
  if (index >= 0) {
    newArr.splice(index, 1);
  }
  return newArr;
};
