import {createElement} from '../utils.js';

export default class Filter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  _createFilterItemTemplate(filter, isChecked) {
    const {name, count} = filter;

    return (
      `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
        ${count === 0 ? `disabled` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span></label
      >`
    );
  }

  _getTemplate() {
    return (
      `<section class="main__filter filter container">
        ${this._filters
          .map((filter, index) => this._createFilterItemTemplate(filter, index === 0))
          .join(``)}
      </section>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
