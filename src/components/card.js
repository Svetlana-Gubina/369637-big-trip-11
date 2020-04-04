export const getCard = ({eventType, city, cost, hours, durationHours, durationMinutes, option}) => {
  return `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${eventType} to ${city}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T10:30">${hours}:${durationMinutes}</time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T11:00">${hours}:${durationMinutes}</time>
            </p>
            <p class="event__duration">${durationHours}H ${durationMinutes}M</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${cost}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            <li class="event__offer">
              <span class="event__offer-title">${option.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
             </li>
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`.trim();
};
