export const getRouteInfoElement = (dep, arr, start, point, end, total) => {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${start} &mdash; ${point} &mdash; ${end}</h1>

    <p class="trip-info__dates">${dep} &nbsp;&mdash;&nbsp;${arr}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
  </p>
  </section>`;
};
