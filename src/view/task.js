import {isTaskExpired, isTaskRepeating, formatTaskDueDate} from '../utils/task.js';
import AbstractView from './abstract.js';

export default class Task extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._archiveClickHandler = this._archiveClickHandler.bind(this);
  }

  getTemplate() {
    const {description, color, dueDate, repeating, isArchive, isFavorite} = this._task;

    return (
      `<article class="card card--${color} ${isTaskExpired(dueDate) ? `card--deadline` : ``}
        ${isTaskRepeating(repeating) ? `card--repeat` : ``}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn card__btn--archive
                ${isArchive ? `card__btn--disabled` : ``}">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites ${isFavorite ? `card__btn--disabled` : ``}"
              >
                favorites
              </button>
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <p class="card__text">${description}</p>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">
                        ${formatTaskDueDate(dueDate)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>`
    );
  }

  _editClickHandler() {
    this._callback.editClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  _archiveClickHandler() {
    this._callback.archiveClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.getElement().querySelector(`.card__btn--archive`)
      .addEventListener(`click`, this._archiveClickHandler);
  }
}
