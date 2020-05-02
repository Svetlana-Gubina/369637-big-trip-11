import {MIN_PRICE, MAX_PRICE, AVAILABLE_EVENT_TYPES, AVAILABLE_OPTIONS, MILLISECONDS} from './constants.js';
import {getRandomOfArray, getRandomInteger, shuffle} from './utils.js';


export const getEvent = () => ({
  "id": getRandomInteger(MIN_PRICE, MAX_PRICE),
  "type": getRandomOfArray(AVAILABLE_EVENT_TYPES.slice(0, 7)),
  "is_favorite": true,
  "date_from": new Date(Date.now()),
  "date_to": new Date(Date.now() + MILLISECONDS),
  "base_price": getRandomInteger(MIN_PRICE, MAX_PRICE),
  "destination": {
    "description": `Chamonix, is a beautiful city, a true asian pearl, with crowded streets.`,
    "name": `Chamonix`,
    "pictures": [
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Chamonix parliament building`
      }
    ]
  },
  "offers": shuffle(Array.from(AVAILABLE_OPTIONS).slice(0, getRandomInteger(1, 5))),
});
