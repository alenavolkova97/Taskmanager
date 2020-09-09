import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import BoardView from './view/board.js';
import SortingView from './view/sorting.js';
import TaskListView from './view/task-list.js';
import TaskEditView from './view/task-edit.js';
import TaskView from './view/task.js';
import LoadMoreButtonView from './view/load-more-button.js';
import NoTasksView from './view/no-tasks.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition, replace, remove} from "./utils/render.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const mainElement = document.querySelector(`main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const renderTask = (taskListElement, task) => {
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

  render(taskListElement, taskComponent);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const TaskListComponent = new TaskListView();

  render(boardContainer, boardComponent);
  render(boardComponent, TaskListComponent);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent, new NoTasksView(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent, new SortingView(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(TaskListComponent.getElement(), boardTask)); // ?

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const LoadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent, LoadMoreButtonComponent);

    LoadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(TaskListComponent.getElement(), boardTask)); // ?

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        remove(LoadMoreButtonComponent);
      }
    });
  }
};

render(headerElement, new SiteMenuView());
render(mainElement, new FilterView(filters));

renderBoard(mainElement, tasks);
