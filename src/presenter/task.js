import TaskEditView from '../view/task-edit.js';
import TaskView from '../view/task.js';
import {render, replace, remove} from "../utils/render.js";

export default class Task {
  constructor(taskListContainer, changeData) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;

    this._taskComponent = null;
    // this._taskEditComponent = null; // !!!!!!!!!!!!

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
  }

  init(task) {
    this._task = task;

    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskView(task);

    this._taskComponent.setEditClickHandler(this._handleEditClick);
    this._taskComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._taskComponent.setArchiveClickHandler(this._handleArchiveClick);

    console.log(prevTaskComponent);
    console.log(prevTaskEditComponent);
    console.log(this._taskComponent);
    console.log(this._taskEditComponent);
    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this._taskListContainer, this._taskComponent);
      console.log('new');
      return;
    }

    console.log('replace');

    if (this._taskListContainer.getElement().contains(prevTaskComponent.getElement())) {
      replace(this._taskComponent, prevTaskComponent);
    }

    if (prevTaskEditComponent && this._taskListContainer.getElement().contains(prevTaskEditComponent.getElement())) {
      replace(this._taskEditComponent, prevTaskEditComponent);
    }

    remove(prevTaskComponent);
    if (prevTaskEditComponent) { // !!!!!!!!!!!!
      remove(prevTaskEditComponent);
    }
  }

  destroy() {
    remove(this._taskComponent);
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceFormToCard();
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
    this._replaceFormToCard();
  }
}
