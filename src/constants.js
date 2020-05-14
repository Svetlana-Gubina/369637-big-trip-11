export const MILLISECONDS = 86400000;

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

export const StorePrefix = {
  events: `bigTrip-events-localstorage`,
  destinations: `bigTrip-destinations-localstorage`,
  offers: `bigTrip-offers-localstorage`,
};

export const STORE_VER = `v1`;

export const Action = {
  create: `create`,
  update: `update`,
  delete: `delete`,
};

export const SortType = {
  timeType: `time`,
  priceType: `price`,
  defaultType: `default`,
};

export const Tab = {
  tableTab: `Table`,
  statsTab: `Stats`,
};

export const DefaultLabels = {
  deleteButtonLabel: `Delete`,
  saveButtonLabel: `Save`,
};

export const ChangeLabels = {
  deleteButtonLabel: `Deleting...`,
  saveButtonLabel: `Saving...`,
};

export const getViewSelectedOptions = (options) => {
  return options.reduce((accumulator, option) => option.isAdded ? [...accumulator, option] : accumulator, []);
};

export const getNamedElement = (list, name) => {
  const index = list.findIndex((item) => item[`name`] === name);
  return list[index];
};

export const getfilteredArray = (array, item) => {
  let index = array.findIndex((arrayItem) => arrayItem === item);
  let newArr = array.slice();
  if (index >= 0) {
    newArr.splice(index, 1);
  }
  return newArr;
};

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

const MOVE_TYPES_COUNT = 6;
export const MOVE_EVENT_TYPES = AVAILABLE_EVENT_TYPES.slice(0, MOVE_TYPES_COUNT);

const INIT_STAY_TYPES_COUNT = 7;
const END_STAY_TYPES_COUNT = 10;
export const STAY_EVENT_TYPES = AVAILABLE_EVENT_TYPES.slice(INIT_STAY_TYPES_COUNT, END_STAY_TYPES_COUNT);

const TO_EVENT_TYPES = AVAILABLE_EVENT_TYPES.slice(0, INIT_STAY_TYPES_COUNT);

export const getPrep = (type) => {
  let prep;
  if (TO_EVENT_TYPES.includes(type)) {
    prep = ` to `;
  } else {
    prep = ` in `;
  }
  return prep;
};

export const isIncludes = (array1, array2) => {
  const result = [];
  array2.forEach(function (item) {
    if (array1.includes(item)) {
      result.push(item);
    }
  });
  return result.length > 0 ? true : false;
};
