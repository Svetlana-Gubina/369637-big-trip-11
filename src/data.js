import {DATE, INIT_DATE, MIN_PRICE, MAX_PRICE, DESC, CITIES, AVAILABLE_EVENT_TYPES, AVAILABLE_OPTIONS} from './constants.js';
import {getRandomOfArray, getRandomInteger, shuffle} from './utils.js';


export const RouteInfo = {
  departurePlace: getRandomOfArray(CITIES),
  point: getRandomOfArray(CITIES),
  destination: getRandomOfArray(CITIES),
  departureDate: DATE.startDay,
  departureMonth: DATE.startMonth,
  returndate: DATE.endDay,
  returnMonth: DATE.endMonth,
};

const date = new Date();

export const getEvent = () => ({
  eventType: getRandomOfArray(AVAILABLE_EVENT_TYPES.slice(0, 7)),
  enothterEventType: AVAILABLE_EVENT_TYPES[2],
  eventDate: INIT_DATE,
  city: getRandomOfArray(CITIES),
  cost: getRandomInteger(MIN_PRICE, MAX_PRICE),
  hours: date.getHours(),
  durationHours: getRandomInteger(1, 5),
  durationMinutes: getRandomInteger(10, 50),
  option: getRandomOfArray(Array.from(AVAILABLE_OPTIONS)),
  options: shuffle(Array.from(AVAILABLE_OPTIONS).slice(0, getRandomInteger(1, 5))),
  photos: new Array(5).fill().map(() => getRandomInteger(1, 30)),
  description: shuffle(DESC).slice(0, getRandomInteger(1, 3)),
});


export const getSampleEvents = () => {
  const randomEvents = new Array(getRandomInteger(1, 5)).fill().map(() => getEvent());
  return randomEvents;
};
