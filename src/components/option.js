export const renderOption = ({title, price, isAdded}) => {
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${isAdded ? `checked` : ``}>
  <label class="event__offer-label" for="event-offer-${title}-1">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </label>
  </div>`;
};
