import BoardView from '../view/board.js';
import SortingView from '../view/sorting.js';
import TaskListView from '../view/task-list.js';
import TaskEditView from '../view/task-edit.js';
import TaskView from '../view/task.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import NoTasksView from '../view/no-tasks.js';
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._noTasksComponent = new NoTasksView();
    this._sortingComponent = new SortingView();
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice(); // ?

    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);

    this._renderBoard();
  }

  _renderTask(task) {
    const taskComponent = new TaskView(task);
    let taskEditComponent;

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };

    const onEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscPress);
      }
    };

    taskComponent.setEditClickHandler(() => {
      if (!taskEditComponent) {
        taskEditComponent = new TaskEditView(task); // create component when click happen
      }
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscPress);

      taskEditComponent.setFormSubmitHandler(() => {
        replaceFormToCard();
      });
    });

    render(this._taskListComponent, taskComponent);
  }

  _renderTasks(from, to) {
    this._boardTasks
    .slice(from, to)
    .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTasksComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._boardComponent, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoadMoreButton() {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const LoadMoreButtonComponent = new LoadMoreButtonView();

    render(this._boardComponent, LoadMoreButtonComponent);

    LoadMoreButtonComponent.setClickHandler(() => {
      this._boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => this._renderTask(boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= this._boardTasks.length) {
        remove(LoadMoreButtonComponent);
      }
    });
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();
    this._renderTaskList();
  }
}
