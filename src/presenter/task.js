import TaskEditView from '../view/task-edit.js';
import TaskView from '../view/task.js';
import {render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDITING: `editing`
};

export default class Task {
  constructor(taskListContainer, changeData, changeMode) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._currentMode = null; // null | Mode.DEFAULT | Mode.EDITING
    this._currentTaskComponent = null; // null | new TaskView() | new TaskEditView()

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
  }

  init(task, forceState = Mode.DEFAULT) {
    this._task = task || this._task;

    if (this._currentMode === null) {
      this._currentTaskComponent = new TaskView(this._task);

      this._currentTaskComponent.setEditClickHandler(this._handleEditClick);
      this._currentTaskComponent.setFavoriteClickHandler(this._handleFavoriteClick);
      this._currentTaskComponent.setArchiveClickHandler(this._handleArchiveClick);

      render(this._taskListContainer, this._currentTaskComponent);

      this._currentMode = Mode.DEFAULT;

      return;
    }

    const prevTaskComponent = this._currentTaskComponent;

    if (forceState === Mode.DEFAULT) {
      this._currentTaskComponent = new TaskView(this._task);

      this._currentTaskComponent.setEditClickHandler(this._handleEditClick);
      this._currentTaskComponent.setFavoriteClickHandler(this._handleFavoriteClick);
      this._currentTaskComponent.setArchiveClickHandler(this._handleArchiveClick);

      document.removeEventListener(`keydown`, this._escKeyDownHandler);

    } else if (forceState === Mode.EDITING) {
      this._currentTaskComponent = new TaskEditView(this._task);

      this._currentTaskComponent.setFormSubmitHandler(this._handleFormSubmit);

      document.addEventListener(`keydown`, this._escKeyDownHandler);

      this._changeMode();
    }

    replace(this._currentTaskComponent, prevTaskComponent);

    this._currentMode = forceState;
  }

  destroy() {
    remove(this._currentTaskComponent);
  }

  resetView() {
    if (this._currentMode !== Mode.DEFAULT) {
      this.init(null, Mode.DEFAULT);
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.init(null, Mode.DEFAULT);
    }
  }

  _handleEditClick() {
    this.init(null, Mode.EDITING);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._task,
            {
              isFavorite: !this._task.isFavorite
            }
        )
    );
  }

  _handleArchiveClick() {
    this._changeData(
        Object.assign(
            {},
            this._task,
            {
              isArchive: !this._task.isArchive
            }
        )
    );
  }

  _handleFormSubmit(task) {
    this._changeData(task);
  }
}
