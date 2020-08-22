import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import BoardView from './view/board.js';
import SortingView from './view/sorting.js';
import TaskListView from './view/task-list.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createTaskTemplate} from './view/task.js';
import LoadMoreButtonView from './view/load-more-button.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from "./mock/filter.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const mainElement = document.querySelector(`main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

renderElement(headerElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
const TaskListComponent = new TaskListView();

renderElement(mainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderElement(boardComponent.getElement(), new SortingView().getElement(), RenderPosition.BEFOREEND);
renderElement(boardComponent.getElement(), TaskListComponent.getElement(), RenderPosition.BEFOREEND);

renderTemplate(TaskListComponent.getElement(), createTaskEditTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(TaskListComponent.getElement(), createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  const LoadMoreButtonComponent = new LoadMoreButtonView();

  renderElement(boardComponent.getElement(), LoadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  LoadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(TaskListComponent.getElement(), createTaskTemplate(task), `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      LoadMoreButtonComponent.getElement().remove(); // delete Dom-element
      LoadMoreButtonComponent.removeElement(); // set _element as null
    }
  });
}
