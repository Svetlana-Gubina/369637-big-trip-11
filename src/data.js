const randomPrice = 1000;

export const formDefaultEvent = {
  "base_price": randomPrice,
  "date_from": new Date(Date.now()),
  "date_to": new Date(Date.now()),
  "destination": {
    "description": `Chamonix, is a beautiful city, a true asian pearl, with crowded streets.`,
    "name": `Chamonix`,
    "pictures": [
    ]
  },
  "is_favorite": false,
  "offers": [
  ],
  "type": `transport`,
};
