export const createFilterMarkup = (filter, isChecked) => {
  const {name} = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.toLowerCase()}"
    ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name.toLowerCase()}">${name}</label>
    </div>
    </div>`);
};
