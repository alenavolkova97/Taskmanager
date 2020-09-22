import SiteMenuView from './view/site-menu.js';
import StatisticsView from "./view/statistics.js";
import {generateTask} from './mock/task.js';
import {render, remove} from "./utils/render.js";
import BoardPresenter from './presenter/board.js';
import FilterPresenter from "./presenter/filter.js";
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType, FilterType} from "./const.js";

const TASK_COUNT = 22;

const mainElement = document.querySelector(`main`);
const headerElement = mainElement.querySelector(`.main__control`);
const menuComponent = new SiteMenuView();

const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(mainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, tasksModel);

render(headerElement, menuComponent);

const handleTaskNewFormClose = () => {
  menuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  menuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      menuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(mainElement, statisticsComponent);
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
