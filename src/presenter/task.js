import TaskEditView from '../view/task-edit.js';
import TaskView from '../view/task.js';
import {render, replace, remove} from "../utils/render.js";

export default class Task {
  constructor(taskListContainer) {
    this._taskListContainer = taskListContainer;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(task) {
    this._task = task;

    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskView(task);

    this._taskComponent.setEditClickHandler(this._handleEditClick);

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this._taskListContainer, this._taskComponent);
      return;
    }

    if (this._taskListContainer.getElement().contains(prevTaskComponent.getElement())) {
      replace(this._taskComponent, prevTaskComponent);
    }

    if (this._taskListContainer.getElement().contains(prevTaskEditComponent.getElement())) {
      replace(this._taskEditComponent, prevTaskEditComponent);
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  }

  destroy() {
    remove(this._taskComponent);
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _handleEditClick() {
    if (!this._taskEditComponent) {
      this._taskEditComponent = new TaskEditView(this._task);
    }
    this._replaceCardToForm();
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._taskEditComponent.setFormSubmitHandler(this._handleFormSubmit);
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }
}
