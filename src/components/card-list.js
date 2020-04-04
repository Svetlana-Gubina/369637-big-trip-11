export const getCardList = (count, dates) => {
  return `<ul class="trip-days">
  <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${count}</span>
      <time class="day__date" datetime="2019-03-18">${new Date(dates[count - 1]).toDateString()}</time>
    </div>

    <ul class="trip-events__list">
    </ul>
    </li>
    </ul>`;
};
