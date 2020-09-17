import moment from "moment";

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return currentDate;
};

export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() > dueDate.getTime();
};

export const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() === dueDate.getTime();
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some((repeat) => repeat);
};

export const formatTaskDueDate = (dueDate) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }

  return moment(dueDate).format(`D MMMM`);
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1; // ?
  }

  if (dateB === null) {
    return -1; // ?
  }

  return null;
};

export const sortTaskUp = (taskA, taskB) => {
  const weigth = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weigth !== null) {
    return weigth;
  }

  return taskA.dueDate.getTime() - taskB.dueDate.getTime();
};

export const sortTaskDown = (taskA, taskB) => {
  const weigth = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weigth !== null) {
    return weigth;
  }

  return taskB.dueDate.getTime() - taskA.dueDate.getTime();
};

