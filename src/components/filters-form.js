import AbstractComponent from './abstract-component.js';

export default class FiltersForm extends AbstractComponent {
  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
  }
}
