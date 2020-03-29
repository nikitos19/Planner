import { Item } from './itemsStorage.js';
import { sortItems } from './searchAndSortItems.js';
import { updateStorage } from './itemsStorage.js';

document.getElementById('newTaskBtn').addEventListener('click', addNewTask);
document.getElementById('newTaskIpt').addEventListener('keyup', submitInput);
document
  .getElementById('clearAllOpenItems')
  .addEventListener('click', clearAllOpenItems);
document
  .getElementById('clearAllDoneItems')
  .addEventListener('click', clearAllDoneItems);

//Press Enter when enter the text
function submitInput(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('newTaskBtn').click();
  }
}

//ADD button is pressed to add new task
function addNewTask(event) {
  const newTaskInput = document.getElementById('newTaskIpt');
  if (newTaskInput.value === '') {
    return;
  }

  const newLi = createLi(new Item(false, newTaskInput.value, null));
  document.getElementById('openItems').append(newLi);
  newTaskInput.value = '';

  callSortItems(
    newLi.parentNode,
    document.getElementById('openItemsSort').value,
  );
}

//Create li element from input or from localStorage when load page
export const createLi = ({ done = false, text, date = null }) => {
  const newLi = document.createElement('li');
  newLi.setAttribute('class', 'openTask');

  const doneCkeckbox = createDoneCheckbox(done);
  newLi.appendChild(doneCkeckbox);

  const taskText = document.createElement('div');
  taskText.setAttribute('class', 'taskText');
  taskText.addEventListener('dblclick', editTask);
  taskText.textContent = text;
  newLi.appendChild(taskText);

  const taskDate = createDateDiv(date, done);
  newLi.appendChild(taskDate);

  const removeButton = document.createElement('a');
  removeButton.setAttribute('class', 'glyphicon glyphicon-trash rmvBtn');
  removeButton.setAttribute('href', '#');
  removeButton.addEventListener('click', removeTask);
  newLi.appendChild(removeButton);
  return newLi;
};

//Creating done checkbox
const createDoneCheckbox = done => {
  const label = document.createElement('label');
  label.setAttribute('class', 'checkboxContainer');

  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('class', 'chBx');
  input.addEventListener('change', checkboxChanged);
  if (done) {
    input.checked = true;
  }

  const span = document.createElement('span');
  span.setAttribute('class', 'doneCheckbox');

  label.append(input);
  label.append(span);
  return label;
};

//Creating task date(creation date and done date if exists)
const createDateDiv = (date, done) => {
  const taskDate = document.createElement('div');
  taskDate.setAttribute('class', 'taskDate');
  if (date != null) {
    const creationDate = document.createElement('span');
    creationDate.innerHTML = date[0];
    taskDate.appendChild(creationDate);
    if (done) {
      const doneDate = document.createElement('span');
      doneDate.innerHTML = `<br/><b>${date[1]}</b>`;
      taskDate.appendChild(doneDate);
    }
  } else {
    const creationDate = document.createElement('span');
    creationDate.innerHTML = getCurrentTime();
    taskDate.appendChild(creationDate);
  }
  return taskDate;
};

//Double click on li to change text
function editTask(event) {
  const li = event.currentTarget;
  const valueToEdit = li.textContent;
  const taskInput = document.createElement('input');
  taskInput.setAttribute('type', 'text');
  taskInput.setAttribute('value', valueToEdit);
  taskInput.setAttribute('class', 'newTaskIptClass');
  taskInput.addEventListener('change', saveChangedTask);
  taskInput.addEventListener('keyup', submitChangedTask);
  li.replaceWith(taskInput);
  taskInput.focus();
}

//Save edited task
function saveChangedTask(event) {
  const changedInput = event.currentTarget;
  if (changedInput.value === '') {
    return;
  }
  const taskText = document.createElement('div');
  taskText.setAttribute('class', 'taskText');
  taskText.addEventListener('dblclick', editTask);
  taskText.textContent = changedInput.value;
  changedInput.replaceWith(taskText);

  callSortItems(
    taskText.parentNode.parentNode,
    document.getElementById('openItemsSort').value,
  );
}

//Pressed Enter or Esc button during editing task
function submitChangedTask(event) {
  if (event.keyCode === 13 || event.keyCode === 27) {
    event.preventDefault();
    saveChangedTask(event);
  }
}

//Get current hours and minutes in am/pm format
const getCurrentTime = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let strAmPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${strAmPm}`;
};

//Remove task
function removeTask(event) {
  event.preventDefault();
  const liToBeRemoved = event.currentTarget.parentNode;
  const taskList = liToBeRemoved.parentNode;
  liToBeRemoved.remove();
  new Promise(resolve => resolve(updateStorage())).catch(error =>
    console.error(error),
  );
}

//Checkbox is changed
function checkboxChanged(event) {
  const currentLiNode = event.currentTarget.parentNode.parentNode;
  if (this.checked) {
    completeTask(currentLiNode);
  } else {
    reopenTask(currentLiNode);
  }
}

//Complete task, move to done items
function completeTask(taskLi) {
  const liChildren = Array.from(taskLi.childNodes);
  liChildren
    .find(el => el.className === 'taskText')
    .removeEventListener('dblclick', editTask);
  const taskDate = liChildren.find(el => el.className === 'taskDate');
  const doneDate = document.createElement('span');
  doneDate.innerHTML = `<br/><b>${getCurrentTime()}</b>`;
  taskDate.appendChild(doneDate);
  document.getElementById('doneItems').appendChild(taskLi);
  callSortItems(
    taskLi.parentNode,
    document.getElementById('doneItemsSort').value,
  );
}

//Reopen task, move to open items
function reopenTask(taskLi) {
  const liChildren = Array.from(taskLi.childNodes);
  liChildren
    .find(el => el.className === 'taskText')
    .addEventListener('dblclick', editTask);
  const taskDate = liChildren.find(el => el.className === 'taskDate');
  taskDate.lastElementChild.remove();
  document.getElementById('openItems').appendChild(taskLi);
  callSortItems(
    taskLi.parentNode,
    document.getElementById('openItemsSort').value,
  );
}

const callSortItems = (list, sortBy) => {
  new Promise(resolve => resolve(sortItems(list, sortBy))).catch(error =>
    console.error(error),
  );
};

function clearAllOpenItems(event) {
  document.getElementById('openItems').innerHTML = '';
  new Promise(resolve => resolve(updateStorage())).catch(error =>
    console.error(error),
  );
}

function clearAllDoneItems(event) {
  document.getElementById('doneItems').innerHTML = '';
  new Promise(resolve => resolve(updateStorage())).catch(error =>
    console.error(error),
  );
}
