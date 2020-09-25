import {COLORS} from '../const.js';
import {isTaskRepeating, formatTaskDueDate} from '../utils/task.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import he from "he";

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_TASK = {
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  color: COLORS[0],
  isArchive: false,
  isFavorite: false
};

export default class TaskEdit extends SmartView {
  constructor(task = BLANK_TASK) {
    super();
    this._data = TaskEdit.parseTaskToData(task);
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);
    this._repeatingChangeHandler = this._repeatingChangeHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  _createTaskEditDateTemplate(dueDate, isDueDate, isDisabled) {
    return `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${formatTaskDueDate(dueDate)}"
          ${isDisabled ? `disabled` : ``}
        />
      </label>
    </fieldset>` : ``}`;
  }

  _createTaskEditRepeatingTemplate(repeating, isRepeating, isDisabled) {
    return `<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
    </button>

    ${isRepeating ? `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${Object.entries(repeating).map(([day, repeat]) =>`<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-1"
          name="repeat"
          value="${day}"
          ${repeat ? `checked` : ``}
          ${isDisabled ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-1"
          >${day}</label
        >`).join(``)}
      </div>
    </fieldset>` : ``}`;
  }

  _createTaskEditColorsTemplate(currentColor) {
    return COLORS.map((color) => `<input
      type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${currentColor === color ? `checked` : ``}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >${color}</label
    >`).join(``);
  }

  getTemplate() {
    const {description, dueDate, repeating, color, isDueDate, isRepeating,
      isDisabled, isSaving, isDeleting} = this._data;

    const isSubmitDisabled = (isDueDate && dueDate === null)
      || (isRepeating && !isTaskRepeating(repeating));

    return (
      `<article class="card card--edit card--${color}
        ${isRepeating ? `card--repeat` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                  ${isDisabled ? `disabled` : ``}
                >${he.encode(description)}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  ${this._createTaskEditDateTemplate(dueDate, isDueDate, isDisabled)}
                  ${this._createTaskEditRepeatingTemplate(repeating, isRepeating, isDisabled)}
                </div>
              </div>

              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${this._createTaskEditColorsTemplate(color)}
                </div>
              </div>
            </div>

            <div class="card__status-btns">
              <button class="card__save" type="submit" ${isSubmitDisabled || isDisabled ? `disabled` : ``}>
                ${isSaving ? `saving...` : `save`}
              </button>
              <button class="card__delete" type="button" ${isDisabled ? `disabled` : ``}>
                ${isDeleting ? `deleting...` : `delete`}
              </button>
            </div>
          </div>
        </form>
      </article>`
    );
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.isDueDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._data.dueDate,
            onChange: this._dueDateChangeHandler
          }
      );
    }
  }

  _setInnerHandlers() {
    this
      .getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._dueDateToggleHandler);
    this
      .getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._repeatingToggleHandler);
    this
    .getElement()
    .querySelector(`.card__text`)
    .addEventListener(`input`, this._descriptionInputHandler);

    if (this._data.isRepeating) {
      this
      .getElement()
      .querySelector(`.card__repeat-days-inner`)
      .addEventListener(`change`, this._repeatingChangeHandler);
    }
    this
    .getElement()
    .querySelector(`.card__colors-wrap`)
    .addEventListener(`change`, this._colorChangeHandler);
  }

  _dueDateToggleHandler() {
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false
    });
  }

  _repeatingToggleHandler() {
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false
    });
  }

  _descriptionInputHandler(evt) {
    this.updateData({
      description: evt.target.value
    }, true);
  }

  _dueDateChangeHandler([userDate]) {
    userDate.setHours(23, 59, 59, 999);

    this.updateData({
      dueDate: userDate
    });
  }

  _repeatingChangeHandler(evt) {
    this.updateData({
      repeating: Object.assign(
          {},
          this._data.repeating,
          {[evt.target.value]: evt.target.checked}
      )
    });
  }

  _colorChangeHandler(evt) {
    this.updateData({
      color: evt.target.value
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data));
  }

  _deleteClickHandler() {
    this._callback.deleteClick(TaskEdit.parseDataToTask(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.card__form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._deleteClickHandler);
  }

  static parseTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isDueDate: Boolean(task.dueDate),
          isRepeating: isTaskRepeating(task.repeating),
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    // if (!data.isDueDate) { // зачем нужны ?
    //   data.dueDate = null;
    // }

    // if (!data.isRepeating) {
    //   data.repeating = {
    //     mo: false,
    //     tu: false,
    //     we: false,
    //     th: false,
    //     fr: false,
    //     sa: false,
    //     su: false
    //   };
    // }

    delete data.isDueDate;
    delete data.isRepeating;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
