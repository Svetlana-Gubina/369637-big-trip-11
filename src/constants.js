export const MILLISECONDS = 86400000;

export const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

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
  return options.reduce((acc, option) => formData.get(`event-offer-${option.title}`) ? [...acc, option] : acc, []);
};

export const getNamedElement = (list, name) => {
  const index = list.findIndex((it) => it[`name`] === name);
  return list[index];
};

export const filteredArray = (arr, item) => {
  let index = arr.findIndex((it) => it === item);
  let newArr = arr.slice();
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

export const getPrep = (type) => {
  let prep;
  if (AVAILABLE_EVENT_TYPES.slice(0, 7).includes(type)) {
    prep = ` to `;
  } else {
    prep = ` in `;
  }
  return prep;
};
