import {MIN_PRICE, MAX_PRICE, AVAILABLE_EVENT_TYPES, AVAILABLE_OPTIONS, CITIES, MILLISECONDS} from './constants.js';
import {getRandomOfArray, getRandomInteger, shuffle} from './utils.js';


export const getEvent = () => ({
  "type": getRandomOfArray(AVAILABLE_EVENT_TYPES.slice(0, 7)),
  "is_favorite": true,
  "date_from": new Date(Date.now()),
  "date_to": Number(new Date(Date.now()) + MILLISECONDS),
  "base_price": getRandomInteger(MIN_PRICE, MAX_PRICE),
  "destination": {
    "name": getRandomOfArray(CITIES),
  },
  "offers": shuffle(Array.from(AVAILABLE_OPTIONS).slice(0, getRandomInteger(1, 5))),
});
