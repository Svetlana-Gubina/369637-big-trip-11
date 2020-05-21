export const MILLISECONDS = 86400000;

export const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAr=${Math.random()}`;
export const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

export const INVALIDITY_MESSAGE = `Please enter an integer`;
export const REG = /^\d+$/;

export const HIDDEN_CLASS = `visually-hidden`;

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

export const FilterName = {
  everything: `Everything`,
  future: `Future`,
  past: `Past`,
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

export const LoadingMessage = {
  loading: `Loading...`,
  failed: `Sorry,an error occurred`,
  noPoints: `Click New Event to create your first point`,
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

export const getPreposition = (type) => {
  let preposition;
  if (TO_EVENT_TYPES.includes(type)) {
    preposition = ` to `;
  } else {
    preposition = ` in `;
  }
  return preposition;
};

const getOptionsAddedCost = (point) => {
  let cost = [];
  point.options.forEach((option) => {
    if (option.hasOwnProperty(`isAdded`) && option.isAdded === true) {
      cost.push(option.price);
    }
  });
  return cost.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

export const getTotalPoitsCost = (points) => {
  const optionsAddedCost = points.reduce((accumulator, currentValue) => accumulator + getOptionsAddedCost(currentValue) + currentValue.cost, 0);
  return optionsAddedCost;
};

export const getTypeAvailableOptions = (optionsList, type) => {
  const optionItem = optionsList.find((item) => item.type === type);
  return optionItem.offers;
};

export const getOptionForTitle = (options, title) => {
  return options.find((item) => item.title === title);
};
