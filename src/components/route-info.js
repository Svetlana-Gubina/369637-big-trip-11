export const getRouteInfoElement = ({departurePlace, point, destination, departureDate, returndate, departureMonth, returnMonth}) => {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${departurePlace} &mdash; ${point} &mdash; ${destination}</h1>

    <p class="trip-info__dates">${departureMonth} ${departureDate}&nbsp;&mdash;&nbsp;${returnMonth} ${returndate}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
  </p>
  </section>`;
};
