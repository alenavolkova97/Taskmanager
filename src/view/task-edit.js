import {COLORS} from '../const.js';
import {isTaskExpired, isTaskRepeating, humanizeTaskDueDate} from '../utils/task.js';
import AbstractView from './abstract.js';
import {replace} from '../utils/render.js';

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
  color: COLORS[0]
};

export default class TaskEdit extends AbstractView {
  constructor(task = BLANK_TASK) {
    super();
    this._data = TaskEdit.parseTaskToData(task);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);

    this._setInnerHandlers();
  }

  _createTaskEditDateTemplate(dueDate, isDueDate) {
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
          value="${humanizeTaskDueDate(dueDate)}"
        />
      </label>
    </fieldset>` : ``}`;
  }

  _createTaskEditRepeatingTemplate(repeating, isRepeating) {
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
    const {description, dueDate, repeating, color, isDueDate, isRepeating} = this._data;

    return (
      `<article class="card card--edit card--${color} ${isTaskExpired(dueDate) ? `card--deadline` : ``}
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
                >${description}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  ${this._createTaskEditDateTemplate(dueDate, isDueDate)}
                  ${this._createTaskEditRepeatingTemplate(repeating, isRepeating)}
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
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">cancel</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    this.removeElement();

    const newElement = this.getElement();
    replace(newElement, prevElement);

    prevElement = null;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
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
  }

  _dueDateToggleHandler() {
    this.updateData({
      isDueDate: !this._data.isDueDate
    });
  }

  _repeatingToggleHandler() {
    this.updateData({
      isRepeating: !this._data.isRepeating
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.card__form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isDueDate: Boolean(task.dueDate),
          isRepeating: isTaskRepeating(task.repeating)
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

    return data;
  }
}
