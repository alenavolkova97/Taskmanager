import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import {generateTask} from './mock/task.js';
import {render} from "./utils/render.js";
import BoardPresenter from './presenter/board.js';
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';

const TASK_COUNT = 22;

const mainElement = document.querySelector(`main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = [
  {
    type: `all`,
    name: `ALL`,
    count: 0
  }
];

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(mainElement, tasksModel);

render(headerElement, new SiteMenuView());
render(mainElement, new FilterView(filters, `all`));

boardPresenter.init();
