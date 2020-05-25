import {getIncreasedDateEndForFlatpickr} from './utils.js';

export const formDefaultEvent = {
  "base_price": ``,
  "date_from": new Date(Date.now()),
  "date_to": getIncreasedDateEndForFlatpickr(new Date(Date.now())),
  "destination": {
    "description": `Chamonix, is a beautiful city, a true asian pearl, with crowded streets.`,
    "name": `Chamonix`,
    "pictures": [
      {
        "src": `http://picsum.photos/300/200?r=0.0762563005163317`,
        "description": `Chamonix parliament building`,
      }
    ]
  },
  "is_favorite": false,
  "offers": [
  ],
  "type": `flight`,
};
