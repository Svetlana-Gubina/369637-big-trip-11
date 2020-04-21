export const renderOption = ({title, shortTitle, price, isAdded}) => {
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${shortTitle}-1" type="checkbox" name="event-offer-${shortTitle}" ${isAdded ? `checked` : ``}>
  <label class="event__offer-label" for="event-offer-${shortTitle}-1">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </label>
  </div>`;
};
