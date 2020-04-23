import {DATE, MIN_PRICE, MAX_PRICE, CITIES, AVAILABLE_EVENT_TYPES, AVAILABLE_OPTIONS} from './constants.js';
import {getRandomOfArray, getRandomInteger, shuffle} from './utils.js';
import moment from 'moment';


export const RouteData = {
  departurePlace: getRandomOfArray(CITIES),
  point: getRandomOfArray(CITIES),
  destination: getRandomOfArray(CITIES),
  departureDate: DATE.startDay,
  departureMonth: DATE.startMonth,
  returndate: DATE.endDay,
  returnMonth: DATE.endMonth,
};


export const getEvent = () => ({
  id: getRandomInteger(MIN_PRICE, MAX_PRICE),
  eventType: getRandomOfArray(AVAILABLE_EVENT_TYPES.slice(0, 7)),
  isFavorite: true,
  eventStart: Date.now(),
  eventEnd: moment(Date.now()).add(7, `days`),
  cost: getRandomInteger(MIN_PRICE, MAX_PRICE),
  destination: {
    description: `Chamonix, is a beautiful city, a true asian pearl, with crowded streets.`,
    name: `Chamonix`,
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Chamonix parliament building`
      }
    ]
  },
  options: shuffle(Array.from(AVAILABLE_OPTIONS).slice(0, getRandomInteger(1, 5))),
});
