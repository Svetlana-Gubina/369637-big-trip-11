import {getRandomBoolean} from './utils.js';
import moment from 'moment';

export const MILLISECONDS = 86400000;


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
  `check-in`,
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

export const FiltersNames = [
  {
    name: `Everything`,
  },
  {
    name: `Future`,
  },
  {
    name: `Past`,
  }
];

export const DefaultLabels = {
  deleteButtonLabel: `Delete`,
  saveButtonLabel: `Save`,
};
