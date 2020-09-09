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
import {render, RenderPosition} from "./utils.js";

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
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
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
    document.addEventListener(`keydown`, onEscPress); // ?

    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
    });
  });

  render(taskListElement, taskComponent.getElement());
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const TaskListComponent = new TaskListView();

  render(boardContainer, boardComponent.getElement());
  render(boardComponent.getElement(), TaskListComponent.getElement());

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTasksView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new SortingView().getElement(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(TaskListComponent.getElement(), boardTask));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const LoadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent.getElement(), LoadMoreButtonComponent.getElement());

    LoadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(TaskListComponent.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        LoadMoreButtonComponent.getElement().remove(); // delete Dom-element
        LoadMoreButtonComponent.removeElement(); // set _element as null
      }
    });
  }
};

render(headerElement, new SiteMenuView().getElement());
render(mainElement, new FilterView(filters).getElement());

renderBoard(mainElement, tasks);
