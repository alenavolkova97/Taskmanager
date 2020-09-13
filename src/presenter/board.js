import BoardView from '../view/board.js';
import SortingView from '../view/sorting.js';
import TaskListView from '../view/task-list.js';
import TaskEditView from '../view/task-edit.js';
import TaskView from '../view/task.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import NoTasksView from '../view/no-tasks.js';
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SortType} from '../const.js';

const TASK_COUNT_PER_STEP = 8;

export default class Board { // create components, add components into page, add event listeners
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._noTasksComponent = new NoTasksView();
    this._sortingComponent = new SortingView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks; // ?
    this._sourcedBoardTasks = this._boardTasks.slice();

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

  _sortTasks(sortType) {
    switch (sortType) {
      case sortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case sortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default: // ?
        this._boardTasks = this._sourcedBoardTasks; // ? slice
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    // - Очищаем список
    // - Рендерим список заново
  }

  _renderSorting() {
    render(this._boardComponent, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
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
