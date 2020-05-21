import {FilterName, SortType, HIDDEN_CLASS, MILLISECONDS} from "./constants.js";
import moment from 'moment';

export const show = (element) => {
  element.classList.remove(HIDDEN_CLASS);
};

export const hide = (element) => {
  element.classList.add(HIDDEN_CLASS);
};

export const check = (element) => {
  element.checked = true;
};

export const uncheck = (element) => {
  element.checked = false;
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement;
};

export const render = (container, component, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case Position.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);
  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export const getEventsByFilter = (points, filterName) => {
  switch (filterName) {
    case FilterName.future:
      return points.slice().filter((event) => new Date(event.eventStart).getTime() > Date.now());
    case FilterName.past:
      return points.slice().filter((event) => new Date(event.eventEnd).getTime() < Date.now());
  }

  return points;
};

export const getDaysByFilter = (days, filterName) => {
  switch (filterName) {
    case FilterName.future:
      return days.slice().filter((day) => new Date(day.getDate()) > Date.now());
    case FilterName.past:
      return days.slice().filter((day) => new Date(day.getDate()) < Date.now());
  }

  return days;
};

const getDurationHours = (point) => {
  const duration = new Date(point.eventEnd) - new Date(point.eventStart);
  return moment(duration).hours();
};

export const getPointsSortedByType = (points, sortType) => {
  switch (sortType) {
    case SortType.timeType:
      return points.slice().sort((a, b) => getDurationHours(b) - getDurationHours(a));
    case SortType.priceType:
      return points.slice().sort((a, b) => b.cost - a.cost);
  }

  return points;
};

export const checkInput = (input, customValidation) => {
  customValidation.checkValidity(input);

  if (customValidation.getInvalidities() !== ``) {
    const message = customValidation.getInvalidities();
    input.setCustomValidity(message);
    return false;
  } else {
    input.setCustomValidity(``);
    return true;
  }
};

const HOURS = 24;
const MINUTES = 60;
const SECONDS = 60;
const MILLISECONDS_IN_SECOND = 1000;
const LIMIT = 9;

export const getDays = (milliseconds) => {
  return milliseconds / (SECONDS * MINUTES * HOURS * MILLISECONDS_IN_SECOND);
};

const getDaysResult = (milliseconds) => {
  if (milliseconds < MILLISECONDS) {
    return 0;
  } else {
    const days = getDays(milliseconds);
    const absoluteDays = Math.floor(days);
    return absoluteDays > LIMIT ? absoluteDays : `0` + absoluteDays;
  }
};

export const convertMillisecondsToTime = (milliseconds) => {
  const days = getDays(milliseconds);
  const absoluteDays = Math.floor(days);
  const rest = getDaysResult(milliseconds) === 0 ? milliseconds : (days - absoluteDays);

  const hours = rest / (MILLISECONDS_IN_SECOND * SECONDS * MINUTES);
  const absoluteHours = Math.floor(hours);
  const hoursResult = absoluteHours > LIMIT ? absoluteHours : `0` + absoluteHours;

  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const minutesResult = absoluteMinutes > LIMIT ? absoluteMinutes : `0` + absoluteMinutes;

  return {
    days: getDaysResult(milliseconds),
    hours: hoursResult,
    minutes: minutesResult,
  };
};

