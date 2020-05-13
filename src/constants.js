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

export const getPrep = (type) => {
  let prep;
  if (AVAILABLE_EVENT_TYPES.slice(0, 7).includes(type)) {
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
