import {getRandomBoolean} from './utils.js';
export const MILLISECONDS = 86400000;


export const MIN_PRICE = 20;
export const MAX_PRICE = 1000;
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

export const filterNullProps = (obj) => Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== null));

// export const getFormDateTime = (formData, name) => {
//   formData = {
//     get() {
//       return name;
//     }
//   };
//   const value = formData.get(name);
//   return value ? moment(value).toDate() : null;
// };

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

export const getSelectedOptions = (options, formData) => {
  return options.map((option) => option.title).reduce((acc, option) => formData.get(`event-offer-${option}`) ? [...acc, option] : acc, []);
};

export const getNamedElement = (list, name) => {
  const index = list.findIndex((it) => it[`name`] === name);
  return list[index];
};
